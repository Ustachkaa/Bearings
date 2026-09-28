/**
 * Bearings data store.
 *
 * A single-user local app does not need a database server. Everything lives in
 * one JSON document on disk (server/data/bearings.json) that is written
 * atomically after each change. No native modules, works on any Node version.
 */
import fs from "node:fs";
import path from "node:path";
import { config } from "./config.js";

export interface WatchItem {
  id: number;
  symbol: string;
  name: string;
  type: string;
  currency: string;
  notes: string;
  thesis: string;
  addedAt: string;
}

export interface AlertRule {
  id: number;
  symbol: string | null;
  type: string;
  params: Record<string, any>;
  state: Record<string, any>;
  enabled: boolean;
  cooldownHours: number;
  lastFiredAt: string | null;
  createdAt: string;
}

export interface AlertEvent {
  id: number;
  ruleId: number | null;
  symbol: string | null;
  type: string;
  level: "info" | "opportunity" | "caution" | "reminder";
  title: string;
  message: string;
  data: Record<string, any>;
  emailed: boolean;
  read: boolean;
  createdAt: string;
}

export interface Txn {
  id: number;
  symbol: string;
  name: string;
  side: "buy" | "sell";
  qty: number;
  price: number;
  fee: number;
  currency: string;
  note: string;
  at: string;
}

export interface Progress {
  lessonId: string;
  completed: boolean;
  quizScore: number | null;
  quizTotal: number | null;
  completedAt: string | null;
  updatedAt: string;
}

export interface CheckRun {
  id: number;
  startedAt: string;
  finishedAt: string | null;
  rules: number;
  fired: number;
  emailed: number;
  error: string | null;
}

interface Data {
  version: number;
  settings: Record<string, unknown>;
  watchlist: WatchItem[];
  alertRules: AlertRule[];
  alertEvents: AlertEvent[];
  txns: Txn[];
  progress: Record<string, Progress>;
  checkRuns: CheckRun[];
  seq: Record<string, number>;
}

const FILE = path.join(config.dataDir, "bearings.json");
const MAX_EVENTS = 2000;
const MAX_RUNS = 200;

function empty(): Data {
  return {
    version: 1,
    settings: {},
    watchlist: [],
    alertRules: [],
    alertEvents: [],
    txns: [],
    progress: {},
    checkRuns: [],
    seq: {},
  };
}

function load(): Data {
  try {
    if (!fs.existsSync(FILE)) return empty();
    const parsed = JSON.parse(fs.readFileSync(FILE, "utf8"));
    return { ...empty(), ...parsed };
  } catch (err) {
    console.error("[db] could not read data file, starting fresh:", err);
    return empty();
  }
}

export const data: Data = load();

let saveTimer: NodeJS.Timeout | null = null;
function flush() {
  saveTimer = null;
  const tmp = FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, FILE);
}

/** Schedule a write. Writes are coalesced so bursts of changes hit the disk once. */
export function save() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    try {
      flush();
    } catch (err) {
      console.error("[db] save failed:", err);
    }
  }, 150);
}

export function saveNow() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = null;
  flush();
}

export function nextId(table: string): number {
  data.seq[table] = (data.seq[table] ?? 0) + 1;
  return data.seq[table];
}

export const nowIso = () => new Date().toISOString();

// ── settings ────────────────────────────────────────────────────────────────
export function getSetting<T>(key: string, fallback: T): T {
  const v = data.settings[key];
  return v === undefined ? fallback : (v as T);
}

export function setSetting(key: string, value: unknown) {
  data.settings[key] = value;
  save();
}

// ── events ──────────────────────────────────────────────────────────────────
export function addEvent(e: Omit<AlertEvent, "id" | "createdAt" | "emailed" | "read">): AlertEvent {
  const ev: AlertEvent = { ...e, id: nextId("alertEvents"), createdAt: nowIso(), emailed: false, read: false };
  data.alertEvents.unshift(ev);
  if (data.alertEvents.length > MAX_EVENTS) data.alertEvents.length = MAX_EVENTS;
  save();
  return ev;
}

export function addCheckRun(run: Omit<CheckRun, "id">): CheckRun {
  const r: CheckRun = { ...run, id: nextId("checkRuns") };
  data.checkRuns.unshift(r);
  if (data.checkRuns.length > MAX_RUNS) data.checkRuns.length = MAX_RUNS;
  save();
  return r;
}

process.on("exit", () => {
  try {
    if (saveTimer) saveNow();
  } catch {
    /* ignore */
  }
});
