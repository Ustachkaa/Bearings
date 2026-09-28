import { Router } from "express";
import { z } from "zod";
import { data, nextId, nowIso, save, type AlertRule } from "../db.js";
import { bad, notFound } from "../lib/http.js";
import { getQuote, normalizeSymbol } from "../market/provider.js";
import { RULE_META, ruleMeta } from "../alerts/rules.js";
import { runChecks, schedulerStatus, sendDigestNow } from "../alerts/scheduler.js";

export const alertsRouter = Router();

alertsRouter.get("/meta", (_req, res) => res.json(RULE_META));

alertsRouter.get("/status", (_req, res) => res.json(schedulerStatus()));

alertsRouter.get("/rules", (_req, res) => {
  res.json(data.alertRules);
});

const ruleSchema = z.object({
  symbol: z.string().nullable().optional(),
  type: z.string(),
  params: z.record(z.string(), z.any()).optional(),
  enabled: z.boolean().optional(),
  cooldownHours: z.number().min(0).max(24 * 90).optional(),
});

alertsRouter.post("/rules", async (req, res) => {
  const parsed = ruleSchema.safeParse(req.body);
  if (!parsed.success) throw bad(parsed.error.issues.map((i) => i.message).join("; "));
  const meta = ruleMeta(parsed.data.type);
  if (!meta) throw bad(`Unknown rule type ${parsed.data.type}`);
  let symbol: string | null = parsed.data.symbol ? normalizeSymbol(parsed.data.symbol) : null;
  if (meta.needsSymbol) {
    if (!symbol) throw bad("This rule needs a ticker symbol");
    const q = await getQuote(symbol);
    symbol = q.symbol;
  }
  const params: Record<string, any> = {};
  for (const p of meta.params) {
    const v = parsed.data.params?.[p.key];
    params[p.key] = v === undefined || v === "" ? p.default : p.type === "number" ? Number(v) : String(v);
    if (p.type === "number" && !Number.isFinite(params[p.key])) throw bad(`${p.label} must be a number`);
  }
  const rule: AlertRule = {
    id: nextId("alertRules"),
    symbol,
    type: meta.type,
    params,
    state: {},
    enabled: parsed.data.enabled ?? true,
    cooldownHours: parsed.data.cooldownHours ?? meta.defaultCooldownHours,
    lastFiredAt: null,
    createdAt: nowIso(),
  };
  data.alertRules.push(rule);
  save();
  res.status(201).json(rule);
});

alertsRouter.patch("/rules/:id", (req, res) => {
  const rule = data.alertRules.find((r) => r.id === Number(req.params.id));
  if (!rule) throw notFound("Rule not found");
  const parsed = ruleSchema.partial().safeParse(req.body);
  if (!parsed.success) throw bad("invalid body");
  if (parsed.data.enabled !== undefined) rule.enabled = parsed.data.enabled;
  if (parsed.data.cooldownHours !== undefined) rule.cooldownHours = parsed.data.cooldownHours;
  if (parsed.data.params) {
    rule.params = { ...rule.params, ...parsed.data.params };
    rule.state = {};
  }
  save();
  res.json(rule);
});

alertsRouter.delete("/rules/:id", (req, res) => {
  const idx = data.alertRules.findIndex((r) => r.id === Number(req.params.id));
  if (idx === -1) throw notFound("Rule not found");
  data.alertRules.splice(idx, 1);
  save();
  res.json({ ok: true });
});

alertsRouter.get("/events", (req, res) => {
  const limit = Math.min(500, Math.max(1, Number(req.query.limit ?? 100)));
  res.json({ events: data.alertEvents.slice(0, limit), unread: data.alertEvents.filter((e) => !e.read).length });
});

alertsRouter.post("/events/read-all", (_req, res) => {
  for (const e of data.alertEvents) e.read = true;
  save();
  res.json({ ok: true });
});

alertsRouter.delete("/events", (_req, res) => {
  data.alertEvents = [];
  save();
  res.json({ ok: true });
});

alertsRouter.delete("/events/:id", (req, res) => {
  const idx = data.alertEvents.findIndex((e) => e.id === Number(req.params.id));
  if (idx === -1) throw notFound("Event not found");
  data.alertEvents.splice(idx, 1);
  save();
  res.json({ ok: true });
});

alertsRouter.post("/run", async (_req, res) => {
  res.json(await runChecks("manual"));
});

alertsRouter.post("/digest", async (_req, res) => {
  res.json(await sendDigestNow());
});
