import cron, { type ScheduledTask } from "node-cron";
import { addCheckRun, addEvent, data, getSetting, nowIso, save, setSetting, type AlertEvent, type AlertRule } from "../db.js";
import { getHistory, getProfile, getQuote } from "../market/provider.js";
import { analyze, type Analysis } from "../market/signals.js";
import { emailConfigured, getAppSettings } from "../settings.js";
import { evaluateRule } from "./rules.js";
import { renderAlertsMail, renderDigestMail, sendMail, type DigestRow } from "./mailer.js";
import { computePortfolio } from "../routes/portfolio.js";

let checkTask: ScheduledTask | null = null;
let hourlyTask: ScheduledTask | null = null;
let running = false;

export async function getAnalysis(symbol: string): Promise<Analysis> {
  const [quote, candles, profile] = await Promise.all([getQuote(symbol), getHistory(symbol, "2y"), getProfile(symbol)]);
  return analyze(quote, candles, profile);
}

export interface RunSummary {
  startedAt: string;
  finishedAt: string;
  rules: number;
  fired: number;
  emailed: number;
  errors: string[];
  events: AlertEvent[];
}

export async function runChecks(trigger: "cron" | "manual" = "cron"): Promise<RunSummary> {
  if (running) throw new Error("A check is already running.");
  running = true;
  const startedAt = nowIso();
  const errors: string[] = [];
  const fired: AlertEvent[] = [];
  const now = new Date();
  try {
    const rules = data.alertRules.filter((r) => r.enabled);
    const symbols = [...new Set(rules.map((r) => r.symbol).filter((s): s is string => Boolean(s)))];
    const analyses = new Map<string, Analysis>();
    await Promise.all(
      symbols.map(async (s) => {
        try {
          analyses.set(s, await getAnalysis(s));
        } catch (err) {
          errors.push(`${s}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }),
    );

    for (const rule of rules) {
      const a = rule.symbol ? analyses.get(rule.symbol) : undefined;
      if (rule.symbol && !a) continue;
      let res;
      try {
        res = evaluateRule(rule, { quote: a?.quote, analysis: a, now });
      } catch (err) {
        errors.push(`rule ${rule.id}: ${err instanceof Error ? err.message : String(err)}`);
        continue;
      }
      if (!res) continue;
      if (res.newState) rule.state = { ...rule.state, ...res.newState };
      if (res.fire) {
        rule.lastFiredAt = now.toISOString();
        const ev = addEvent({
          ruleId: rule.id,
          symbol: rule.symbol,
          type: rule.type,
          level: res.level,
          title: res.title,
          message: res.message,
          data: res.data ?? {},
        });
        fired.push(ev);
      }
    }
    save();

    let emailed = 0;
    if (fired.length && emailConfigured()) {
      const r = await sendMail(renderAlertsMail(fired));
      if (r.ok) {
        for (const ev of fired) ev.emailed = true;
        emailed = fired.length;
        save();
      } else {
        errors.push(`email: ${r.error}`);
      }
    }
    const finishedAt = nowIso();
    addCheckRun({ startedAt, finishedAt, rules: rules.length, fired: fired.length, emailed, error: errors.length ? errors.join(" | ") : null });
    setSetting("lastCheckAt", finishedAt);
    if (trigger === "cron") console.log(`[alerts] checked ${rules.length} rules, ${fired.length} fired, ${emailed} emailed${errors.length ? `, ${errors.length} errors` : ""}`);
    return { startedAt, finishedAt, rules: rules.length, fired: fired.length, emailed, errors, events: fired };
  } finally {
    running = false;
  }
}

export async function buildDigest() {
  const s = getAppSettings();
  const rows: DigestRow[] = [];
  for (const item of data.watchlist) {
    try {
      const a = await getAnalysis(item.symbol);
      const closes = a.chart.map((c) => c.close);
      const weekAgo = closes.length > 5 ? closes[closes.length - 6] : null;
      rows.push({
        symbol: a.symbol,
        name: a.name,
        price: a.indicators.price,
        currency: a.currency,
        weekChange: weekAgo ? a.indicators.price / weekAgo - 1 : null,
        drawdown: a.indicators.drawdownFromHigh,
        stance: a.verdict.stance,
        headline: a.verdict.headline,
      });
    } catch {
      /* skip */
    }
  }
  let paperValue: number | null = null;
  let paperGainPct: number | null = null;
  try {
    const p = await computePortfolio();
    paperValue = p.totals.equity;
    paperGainPct = p.totals.invested ? p.totals.gainPct : null;
  } catch {
    /* ignore */
  }
  const dcaRule = data.alertRules.find((r) => r.type === "dca_reminder" && r.enabled);
  let nextDca: string | null = null;
  if (dcaRule) {
    const day = Number(dcaRule.params.dayOfMonth ?? 1);
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth() + (now.getDate() >= day ? 1 : 0), day);
    nextDca = next.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  }
  return renderDigestMail({
    rows,
    unreadAlerts: data.alertEvents.filter((e) => !e.read).length,
    lessonsCompleted: Object.values(data.progress).filter((p) => p.completed).length,
    paperValue,
    paperGainPct,
    nextDca: s.dca.enabled || dcaRule ? nextDca : null,
  });
}

export async function sendDigestNow(): Promise<{ ok: boolean; error?: string }> {
  const mail = await buildDigest();
  const r = await sendMail(mail);
  if (r.ok) setSetting("lastDigestAt", nowIso());
  return r;
}

async function hourlyTick() {
  const s = getAppSettings();
  if (!s.digest.enabled || !emailConfigured(s)) return;
  const now = new Date();
  if (now.getDay() !== s.digest.weekday || now.getHours() !== s.digest.hour) return;
  const last = getSetting<string | null>("lastDigestAt", null);
  if (last && now.getTime() - new Date(last).getTime() < 6 * 86400_000) return;
  const r = await sendDigestNow();
  console.log(r.ok ? "[digest] weekly digest sent" : `[digest] failed: ${r.error}`);
}

export function startScheduler() {
  scheduleChecks(getAppSettings().schedule.cron);
  hourlyTask?.stop();
  hourlyTask = cron.schedule("5 * * * *", () => void hourlyTick().catch((e) => console.error("[digest]", e)));
  // A first pass shortly after boot so state-based rules learn their starting side.
  setTimeout(() => void runChecks("cron").catch((e) => console.error("[alerts]", e)), 8000);
}

export function scheduleChecks(expr: string) {
  if (!cron.validate(expr)) throw new Error(`Invalid cron expression: ${expr}`);
  checkTask?.stop();
  checkTask = cron.schedule(expr, () => void runChecks("cron").catch((e) => console.error("[alerts]", e)));
  console.log(`[alerts] checking rules on schedule "${expr}"`);
}

export function schedulerStatus() {
  const s = getAppSettings();
  return {
    cron: s.schedule.cron,
    running,
    lastCheckAt: getSetting<string | null>("lastCheckAt", null),
    lastDigestAt: getSetting<string | null>("lastDigestAt", null),
    emailConfigured: emailConfigured(s),
    digest: s.digest,
    recentRuns: data.checkRuns.slice(0, 10),
  };
}

export type { AlertRule };
