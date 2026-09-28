import { Router } from "express";
import cron from "node-cron";
import { data, save, saveNow } from "../db.js";
import { bad } from "../lib/http.js";
import { clearMarketCaches } from "../market/provider.js";
import { renderTestMail, sendMail, verifyTransport } from "../alerts/mailer.js";
import { scheduleChecks } from "../alerts/scheduler.js";
import { getAppSettings, publicSettings, updateAppSettings, type AppSettings } from "../settings.js";

export const settingsRouter = Router();

settingsRouter.get("/", (_req, res) => {
  res.json(publicSettings());
});

settingsRouter.put("/", (req, res) => {
  const patch = (req.body ?? {}) as Partial<AppSettings>;
  if (patch.schedule?.cron !== undefined && !cron.validate(patch.schedule.cron)) throw bad("That schedule is not a valid cron expression.");
  if (patch.email?.port !== undefined) patch.email.port = Number(patch.email.port);
  const before = getAppSettings();
  const next = updateAppSettings(patch);
  if (next.schedule.cron !== before.schedule.cron) scheduleChecks(next.schedule.cron);
  res.json(publicSettings(next));
});

settingsRouter.post("/test-email", async (_req, res) => {
  const v = await verifyTransport();
  if (!v.ok) return res.status(400).json({ ok: false, error: v.error });
  const r = await sendMail(renderTestMail());
  if (!r.ok) return res.status(400).json(r);
  res.json({ ok: true });
});

settingsRouter.post("/clear-cache", (_req, res) => {
  clearMarketCaches();
  res.json({ ok: true });
});

settingsRouter.post("/reset", (req, res) => {
  const scope = String(req.body?.scope ?? "");
  if (scope === "all") {
    data.watchlist = [];
    data.alertRules = [];
    data.alertEvents = [];
    data.txns = [];
    data.progress = {};
    data.checkRuns = [];
    data.settings = {};
  } else if (scope === "learning") {
    data.progress = {};
  } else if (scope === "portfolio") {
    data.txns = [];
  } else if (scope === "alerts") {
    data.alertEvents = [];
  } else {
    throw bad("scope must be all, learning, portfolio or alerts");
  }
  saveNow();
  save();
  res.json({ ok: true });
});
