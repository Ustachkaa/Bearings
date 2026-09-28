import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
export const serverDir = path.resolve(here, "..");
export const rootDir = path.resolve(serverDir, "..");

// Load .env from the repo root first, then allow a server-local override.
dotenv.config({ path: path.join(rootDir, ".env") });
dotenv.config({ path: path.join(serverDir, ".env"), override: true });

const env = (k: string, d = "") => (process.env[k] ?? d).trim();

const dataDirRaw = env("DATA_DIR", path.join(serverDir, "data"));
export const dataDir = path.isAbsolute(dataDirRaw) ? dataDirRaw : path.resolve(rootDir, dataDirRaw);
fs.mkdirSync(dataDir, { recursive: true });

export const config = {
  port: Number(env("PORT", "7300")),
  isProd: env("NODE_ENV") === "production",
  dataDir,
  clientDist: path.join(rootDir, "client", "dist"),
  tz: env("TZ", "Asia/Tbilisi"),
  checkCron: env("CHECK_CRON", "*/30 * * * *"),
  smtp: {
    host: env("SMTP_HOST", "smtp.gmail.com"),
    port: Number(env("SMTP_PORT", "465")),
    secure: env("SMTP_SECURE", "true") !== "false",
    user: env("SMTP_USER"),
    pass: env("SMTP_PASS"),
    from: env("ALERT_FROM"),
    to: env("ALERT_TO"),
  },
};
