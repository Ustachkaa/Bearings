import nodemailer from "nodemailer";
import type { AlertEvent } from "../db.js";
import { emailConfigured, getAppSettings } from "../settings.js";

export interface Mail {
  subject: string;
  html: string;
  text: string;
}

export function getTransport() {
  const s = getAppSettings();
  if (!emailConfigured(s)) return null;
  return nodemailer.createTransport({
    host: s.email.host,
    port: s.email.port,
    secure: s.email.secure,
    auth: { user: s.email.user, pass: s.email.pass },
  });
}

export async function sendMail(mail: Mail): Promise<{ ok: boolean; error?: string }> {
  const s = getAppSettings();
  const transport = getTransport();
  if (!transport) return { ok: false, error: "Email is not configured. Add your Gmail App Password in Settings." };
  try {
    await transport.sendMail({ from: s.email.from || s.email.user, to: s.email.to, ...mail });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function verifyTransport(): Promise<{ ok: boolean; error?: string }> {
  const transport = getTransport();
  if (!transport) return { ok: false, error: "Email is not configured." };
  try {
    await transport.verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ── templates ───────────────────────────────────────────────────────────────
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const nl2br = (s: string) => esc(s).replace(/\n/g, "<br>");

const LEVEL_COLOR: Record<string, string> = {
  opportunity: "#1f7a3a",
  caution: "#b3362f",
  info: "#1f5aa6",
  reminder: "#8a5d0f",
};
const LEVEL_WORD: Record<string, string> = {
  opportunity: "Opportunity",
  caution: "Caution",
  info: "Heads-up",
  reminder: "Reminder",
};

function shell(title: string, body: string, footer = "") {
  const s = getAppSettings();
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f7f2e8;font-family:Georgia,'Times New Roman',serif;color:#14202e;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f2e8;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fffdf8;border:1px solid #e4dccb;border-radius:14px;overflow:hidden;">
  <tr><td style="background:#14202e;padding:22px 28px;border-bottom:3px solid #c9a24a;">
    <div style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#c9a24a;font-family:Arial,Helvetica,sans-serif;">Bearings</div>
    <div style="font-size:24px;color:#f7f2e8;margin-top:6px;font-weight:600;">${esc(title)}</div>
  </td></tr>
  <tr><td style="padding:26px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;">${body}</td></tr>
  <tr><td style="padding:18px 28px;border-top:1px solid #e4dccb;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280;line-height:1.5;">
    ${footer}
    <div style="margin-top:8px;">Open Bearings: <a href="${esc(s.display.appUrl)}" style="color:#1f5aa6;">${esc(s.display.appUrl)}</a></div>
    <div style="margin-top:8px;">These alerts are rule-based observations for learning, not financial advice. Nobody can predict prices; keep to your plan.</div>
  </td></tr>
</table>
</td></tr></table></body></html>`;
}

export function renderAlertsMail(events: AlertEvent[]): Mail {
  const first = events[0];
  const subject =
    events.length === 1
      ? `${LEVEL_WORD[first.level] ?? "Alert"}: ${first.title}`
      : `${events.length} Bearings alerts: ${events.map((e) => e.symbol ?? "plan").filter((v, i, a) => a.indexOf(v) === i).slice(0, 4).join(", ")}`;

  const cards = events
    .map(
      (e) => `
      <div style="border-left:4px solid ${LEVEL_COLOR[e.level] ?? "#1f5aa6"};background:#f7f2e8;border-radius:8px;padding:14px 16px;margin:0 0 14px;">
        <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${LEVEL_COLOR[e.level] ?? "#1f5aa6"};font-weight:700;">${esc(LEVEL_WORD[e.level] ?? "Alert")}${e.symbol ? ` · ${esc(e.symbol)}` : ""}</div>
        <div style="font-size:17px;font-weight:700;margin:6px 0 8px;">${esc(e.title)}</div>
        <div style="color:#3b4552;">${nl2br(e.message)}</div>
      </div>`,
    )
    .join("");

  const text = events.map((e) => `[${LEVEL_WORD[e.level] ?? "Alert"}] ${e.title}\n${e.message}`).join("\n\n---\n\n");
  return {
    subject,
    html: shell(events.length === 1 ? (LEVEL_WORD[first.level] ?? "Alert") : `${events.length} alerts`, cards, `Sent ${new Date().toLocaleString("en-GB", { timeZone: getAppSettings().display.appUrl ? undefined : undefined })}.`),
    text,
  };
}

export interface DigestRow {
  symbol: string;
  name: string;
  price: number;
  currency: string;
  weekChange: number | null;
  drawdown: number;
  stance: string;
  headline: string;
}

export interface DigestPayload {
  rows: DigestRow[];
  unreadAlerts: number;
  lessonsCompleted: number;
  paperValue: number | null;
  paperGainPct: number | null;
  nextDca: string | null;
}

export function renderDigestMail(p: DigestPayload): Mail {
  const money = (x: number, cur: string) => new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: 2 }).format(x);
  const pct = (x: number | null) => (x === null ? "—" : `${x >= 0 ? "+" : ""}${(x * 100).toFixed(1)}%`);
  const stanceColor: Record<string, string> = { accumulate: "#1f7a3a", steady: "#1f5aa6", patience: "#8a5d0f", caution: "#b3362f" };

  const rows = p.rows
    .map(
      (r) => `<tr>
      <td style="padding:8px 6px;border-bottom:1px solid #eee5d3;"><b>${esc(r.symbol)}</b><br><span style="color:#6b7280;font-size:12px;">${esc(r.name)}</span></td>
      <td style="padding:8px 6px;border-bottom:1px solid #eee5d3;text-align:right;white-space:nowrap;">${esc(money(r.price, r.currency))}</td>
      <td style="padding:8px 6px;border-bottom:1px solid #eee5d3;text-align:right;color:${(r.weekChange ?? 0) >= 0 ? "#1f7a3a" : "#b3362f"};">${esc(pct(r.weekChange))}</td>
      <td style="padding:8px 6px;border-bottom:1px solid #eee5d3;text-align:right;">${esc(pct(r.drawdown))}</td>
      <td style="padding:8px 6px;border-bottom:1px solid #eee5d3;color:${stanceColor[r.stance] ?? "#14202e"};font-weight:700;">${esc(r.headline)}</td>
    </tr>`,
    )
    .join("");

  const body = `
    <p style="margin:0 0 16px;">Your weekly look at the horizon. Nothing here requires action: it is a habit of checking in calmly, once a week, instead of every hour.</p>
    ${
      p.rows.length
        ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse;">
      <tr style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#6b7280;">
        <th align="left" style="padding:6px;">Asset</th><th align="right" style="padding:6px;">Price</th><th align="right" style="padding:6px;">Week</th><th align="right" style="padding:6px;">From high</th><th align="left" style="padding:6px;">Stance</th>
      </tr>${rows}</table>`
        : `<p style="color:#6b7280;">Your watchlist is empty. Add a broad index fund to start following it.</p>`
    }
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:22px;font-size:14px;">
      <tr>
        <td style="padding:12px;background:#f7f2e8;border-radius:8px;"><div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#6b7280;">Unread alerts</div><div style="font-size:22px;font-weight:700;">${p.unreadAlerts}</div></td>
        <td style="width:10px;"></td>
        <td style="padding:12px;background:#f7f2e8;border-radius:8px;"><div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#6b7280;">Lessons done</div><div style="font-size:22px;font-weight:700;">${p.lessonsCompleted}</div></td>
        <td style="width:10px;"></td>
        <td style="padding:12px;background:#f7f2e8;border-radius:8px;"><div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#6b7280;">Practice portfolio</div><div style="font-size:22px;font-weight:700;">${p.paperValue === null ? "—" : esc(money(p.paperValue, "USD"))}</div><div style="font-size:12px;color:${(p.paperGainPct ?? 0) >= 0 ? "#1f7a3a" : "#b3362f"};">${esc(pct(p.paperGainPct))}</div></td>
      </tr>
    </table>
    ${p.nextDca ? `<p style="margin:18px 0 0;color:#3b4552;">Next regular investment: <b>${esc(p.nextDca)}</b>.</p>` : ""}
  `;
  const text = [
    "Bearings weekly digest",
    ...p.rows.map((r) => `${r.symbol}: ${money(r.price, r.currency)}, week ${pct(r.weekChange)}, from high ${pct(r.drawdown)}, stance ${r.headline}`),
    `Unread alerts: ${p.unreadAlerts}. Lessons done: ${p.lessonsCompleted}.`,
  ].join("\n");
  return { subject: "Your weekly Bearings digest", html: shell("Weekly digest", body), text };
}

export function renderTestMail(): Mail {
  const body = `<p style="margin:0 0 12px;">Your email alerts are connected. When one of your rules fires, or on your digest day, the message will look like this.</p>
  <div style="border-left:4px solid #1f7a3a;background:#f7f2e8;border-radius:8px;padding:14px 16px;">
    <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#1f7a3a;font-weight:700;">Opportunity · EXAMPLE</div>
    <div style="font-size:17px;font-weight:700;margin:6px 0 8px;">This is what an alert looks like</div>
    <div style="color:#3b4552;">Short, plain-language, and always with a reminder that the plan comes first.</div>
  </div>`;
  return { subject: "Bearings: email alerts are working", html: shell("Connected", body), text: "Your Bearings email alerts are connected." };
}
