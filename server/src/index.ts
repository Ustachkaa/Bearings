import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { config } from "./config.js";
import { errorHandler } from "./lib/http.js";
import { marketRouter } from "./routes/market.js";
import { watchlistRouter } from "./routes/watchlist.js";
import { alertsRouter } from "./routes/alerts.js";
import { portfolioRouter } from "./routes/portfolio.js";
import { progressRouter } from "./routes/progress.js";
import { settingsRouter } from "./routes/settings.js";
import { startScheduler } from "./alerts/scheduler.js";
import { emailConfigured } from "./settings.js";

const app = express();
const startedAt = Date.now();

app.disable("x-powered-by");
app.use(cors({ origin: [/localhost:\d+$/, /127\.0\.0\.1:\d+$/] }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    name: "bearings",
    uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
    emailConfigured: emailConfigured(),
    tz: config.tz,
  });
});

app.use("/api/market", marketRouter);
app.use("/api/watchlist", watchlistRouter);
app.use("/api/alerts", alertsRouter);
app.use("/api/portfolio", portfolioRouter);
app.use("/api/progress", progressRouter);
app.use("/api/settings", settingsRouter);

app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

// The built client (client/dist) is served from the same port when it exists,
// so `npm start` is a single process. Checked per request so a build made
// while the server is running is picked up without a restart.
const indexHtml = path.join(config.clientDist, "index.html");
app.use(express.static(config.clientDist, { index: "index.html", maxAge: "1h" }));
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api")) return next();
  if (!fs.existsSync(indexHtml)) {
    return res
      .status(200)
      .type("html")
      .send(
        `<!doctype html><meta charset="utf-8"><title>Bearings</title><body style="font-family:system-ui;padding:40px;max-width:640px;line-height:1.5"><h1>Bearings API is running</h1><p>The web app has not been built yet. Either run <code>npm run dev</code> and open <a href="http://localhost:5180">http://localhost:5180</a>, or run <code>npm run build</code> once and reload this page.</p></body>`,
      );
  }
  res.sendFile(indexHtml);
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`\n  ⚓ Bearings server listening on http://localhost:${config.port}`);
  console.log(`  data: ${config.dataDir}`);
  console.log(`  email alerts: ${emailConfigured() ? "configured" : "not configured (see Settings)"}\n`);
  startScheduler();
});
