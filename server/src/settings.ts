import { config } from "./config.js";
import { getSetting, setSetting } from "./db.js";

export interface AppSettings {
  email: {
    enabled: boolean;
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    from: string;
    to: string;
  };
  schedule: {
    cron: string;
  };
  digest: {
    enabled: boolean;
    /** 0 = Sunday … 6 = Saturday */
    weekday: number;
    hour: number;
  };
  dca: {
    enabled: boolean;
    dayOfMonth: number;
    amount: number;
    currency: string;
    note: string;
  };
  display: {
    name: string;
    currency: string;
    appUrl: string;
  };
  paper: {
    startingCash: number;
  };
  onboarding: {
    done: boolean;
  };
}

export function defaultSettings(): AppSettings {
  return {
    email: {
      enabled: Boolean(config.smtp.user && config.smtp.pass),
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      user: config.smtp.user,
      pass: config.smtp.pass,
      from: config.smtp.from || (config.smtp.user ? `Bearings <${config.smtp.user}>` : ""),
      to: config.smtp.to || config.smtp.user,
    },
    schedule: { cron: config.checkCron },
    digest: { enabled: true, weekday: 0, hour: 18 },
    dca: { enabled: false, dayOfMonth: 1, amount: 100, currency: "USD", note: "" },
    display: { name: "", currency: "USD", appUrl: `http://localhost:${config.isProd ? config.port : 5180}` },
    paper: { startingCash: 10000 },
    onboarding: { done: false },
  };
}

function deepMerge<T extends Record<string, any>>(base: T, patch: Partial<T> | undefined): T {
  if (!patch) return base;
  const out: any = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    if (v && typeof v === "object" && !Array.isArray(v) && typeof base[k] === "object") out[k] = deepMerge(base[k], v);
    else if (v !== undefined) out[k] = v;
  }
  return out;
}

export function getAppSettings(): AppSettings {
  return deepMerge(defaultSettings(), getSetting<Partial<AppSettings>>("app", {}));
}

export function updateAppSettings(patch: Partial<AppSettings>): AppSettings {
  const current = getAppSettings();
  // An empty password in the patch means "keep the existing one".
  if (patch.email && (patch.email.pass === "" || patch.email.pass === undefined)) {
    patch = { ...patch, email: { ...patch.email, pass: current.email.pass } as AppSettings["email"] };
  }
  const next = deepMerge(current, patch);
  setSetting("app", next);
  return next;
}

/** Settings safe to send to the browser: the SMTP password is never returned. */
export function publicSettings(s = getAppSettings()) {
  return { ...s, email: { ...s.email, pass: "", passSet: Boolean(s.email.pass) } };
}

export function emailConfigured(s = getAppSettings()) {
  return s.email.enabled && Boolean(s.email.host && s.email.user && s.email.pass && s.email.to);
}
