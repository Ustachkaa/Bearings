import { useState } from "react";
import { Link } from "react-router-dom";
import { useAlertEvents, useAlertMeta, useAlertMutations, useAlertRules, useAlertStatus } from "@/lib/queries";
import type { AlertRule } from "@/lib/types";
import { dateTime, timeAgo } from "@/lib/format";
import { Badge, Button, Callout, Card, Confirm, Empty, LevelBadge, PageHeader, Skeleton, Toggle, useToast } from "@/components/ui";
import { AlertRuleForm } from "@/components/AlertRuleForm";
import { IcBell, IcMail, IcPlay, IcPlus, IcTrash } from "@/components/icons";
import "./pages.css";

export const CRON_LABELS: Record<string, string> = {
  "*/15 * * * *": "every 15 minutes",
  "*/30 * * * *": "every 30 minutes",
  "0 * * * *": "every hour",
  "0 */2 * * *": "every 2 hours",
  "0 9 * * *": "daily at 09:00",
  "0 9,18 * * *": "daily at 09:00 and 18:00",
};

function describeRule(r: AlertRule, label: string) {
  const p = r.params;
  switch (r.type) {
    case "price_below":
      return `${r.symbol} falls below ${p.target}`;
    case "price_above":
      return `${r.symbol} rises above ${p.target}`;
    case "drop_from_high":
      return `${r.symbol} is ${p.pct}% or more below its 52-week high`;
    case "rsi_below":
      return `${r.symbol} RSI drops below ${p.value}`;
    case "rsi_above":
      return `${r.symbol} RSI rises above ${p.value}`;
    case "cross_sma200":
      return `${r.symbol} crosses ${p.direction === "both" ? "either way over" : p.direction} its 200-day average`;
    case "day_move":
      return `${r.symbol} moves more than ${p.pct}% in a day`;
    case "dca_reminder":
      return `Day ${p.dayOfMonth} each month${p.amount ? `: invest ${p.amount}` : ""}${r.symbol ? ` into ${r.symbol}` : ""}`;
    default:
      return `${r.symbol ?? ""} ${label}`.trim();
  }
}

export function AlertsPage() {
  const { data: rules, isLoading } = useAlertRules();
  const { data: metas } = useAlertMeta();
  const { data: ev } = useAlertEvents(200);
  const { data: status } = useAlertStatus();
  const { update, remove, run, readAll, clearEvents, digest } = useAlertMutations();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState<AlertRule | null>(null);
  const [clearing, setClearing] = useState(false);

  const metaFor = (t: string) => metas?.find((m) => m.type === t);

  return (
    <div>
      <PageHeader
        eyebrow="The watch"
        title="Alerts"
        lede="Rules the app checks on a schedule. When one fires it lands in the log below and, if email is connected, in your inbox."
        actions={
          <>
            <Button
              variant="ghost"
              icon={<IcPlay size={14} />}
              loading={run.isPending}
              onClick={() =>
                run.mutate(undefined, {
                  onSuccess: (r) => toast.info(r.fired ? `${r.fired} alert${r.fired === 1 ? "" : "s"} fired${r.emailed ? ", emailed" : ""}` : `Checked ${r.rules} rule${r.rules === 1 ? "" : "s"}. Nothing to report.`),
                  onError: (e) => toast.error(e.message),
                })
              }
            >
              Check now
            </Button>
            <Button variant="primary" icon={<IcPlus size={14} />} onClick={() => setOpen(true)}>
              New rule
            </Button>
          </>
        }
      />

      <div className="grid cols-3 rise d1" style={{ marginBottom: 18 }}>
        <Card tight>
          <div className="eyebrow">Schedule</div>
          <div style={{ fontWeight: 600, marginTop: 4 }}>{status ? CRON_LABELS[status.cron] ?? status.cron : "…"}</div>
          <div className="tiny muted-3">Last check {timeAgo(status?.lastCheckAt)}</div>
        </Card>
        <Card tight>
          <div className="eyebrow">Email</div>
          <div className="row" style={{ marginTop: 4 }}>
            <Badge tone={status?.emailConfigured ? "good" : "warn"} dot>
              {status?.emailConfigured ? "connected" : "not set up"}
            </Badge>
            <Link to="/settings" className="tiny">
              settings
            </Link>
          </div>
          <div className="tiny muted-3">{status?.emailConfigured ? `Weekly digest ${status.digest.enabled ? "on" : "off"}` : "Alerts still appear here without email."}</div>
        </Card>
        <Card tight>
          <div className="eyebrow">Weekly digest</div>
          <div className="row" style={{ marginTop: 4 }}>
            <Button
              size="sm"
              icon={<IcMail size={13} />}
              disabled={!status?.emailConfigured}
              loading={digest.isPending}
              onClick={() => digest.mutate(undefined, { onSuccess: (r) => (r.ok ? toast.success("Digest sent") : toast.error(r.error ?? "Failed")), onError: (e) => toast.error(e.message) })}
            >
              Send now
            </Button>
          </div>
          <div className="tiny muted-3">Last sent {timeAgo(status?.lastDigestAt)}</div>
        </Card>
      </div>

      <div className="grid cols-2 rise d2" style={{ alignItems: "start" }}>
        <Card title="Rules" eyebrow={`${rules?.length ?? 0} watching`}>
          {isLoading && <Skeleton h={120} />}
          {rules && rules.length === 0 && (
            <Empty
              title="No rules yet"
              text="Start with the two that matter most for a long-term investor: a monthly reminder to invest, and a dip alert on your core fund."
              action={
                <Button icon={<IcBell size={14} />} onClick={() => setOpen(true)}>
                  Create your first rule
                </Button>
              }
            />
          )}
          {rules && rules.length > 0 && (
            <div>
              {rules.map((r) => {
                const m = metaFor(r.type);
                return (
                  <div className="rule-row" key={r.id}>
                    <Toggle checked={r.enabled} onChange={(v) => update.mutate({ id: r.id, enabled: v })} />
                    <div style={{ minWidth: 0 }}>
                      <div className="rule-title">{m?.label ?? r.type}</div>
                      <div className="rule-sub">
                        {describeRule(r, m?.label ?? r.type)}
                        {r.lastFiredAt ? ` · last fired ${timeAgo(r.lastFiredAt)}` : ""}
                        {r.cooldownHours > 0 ? ` · quiet ${r.cooldownHours}h` : ""}
                      </div>
                    </div>
                    <button className="btn ghost icon" title="Delete rule" onClick={() => setDeleting(r)}>
                      <IcTrash size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <Callout tone="key" title="What alerts are for">
            Alerts nudge you about <em>timing extra contributions</em> or noticing a big change. Your regular monthly investment goes ahead whatever they say. <Link to="/learn/using-bearings">How to use Bearings honestly.</Link>
          </Callout>
        </Card>

        <Card
          title="Ship's log"
          eyebrow={`${ev?.unread ?? 0} unread`}
          actions={
            <>
              <Button size="sm" variant="ghost" onClick={() => readAll.mutate()} disabled={!ev?.unread}>
                Mark all read
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setClearing(true)} disabled={!ev?.events.length}>
                Clear
              </Button>
            </>
          }
        >
          {!ev && <Skeleton h={120} />}
          {ev && ev.events.length === 0 && <Empty title="Quiet waters" text="Nothing has fired yet. Rules are checked on the schedule shown above, and you can press Check now at any time." />}
          {ev && ev.events.length > 0 && (
            <div>
              {ev.events.map((e) => (
                <div className="event-row" key={e.id} style={{ opacity: e.read ? 0.75 : 1 }}>
                  <span className={`event-mark ${e.level}`} />
                  <div className="grow" style={{ minWidth: 0 }}>
                    <div className="row wrap" style={{ gap: 8 }}>
                      <LevelBadge level={e.level} />
                      {e.symbol && (
                        <Link to={`/explore/${encodeURIComponent(e.symbol)}`} className="sym" style={{ textDecoration: "none" }}>
                          {e.symbol}
                        </Link>
                      )}
                      <span className="tiny muted-3">
                        {dateTime(e.createdAt)}
                        {e.emailed ? " · emailed" : ""}
                      </span>
                    </div>
                    <div className="event-title" style={{ marginTop: 4 }}>
                      {e.title}
                    </div>
                    <div className="event-msg">{e.message}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <AlertRuleForm open={open} onClose={() => setOpen(false)} />
      <Confirm open={deleting !== null} onClose={() => setDeleting(null)} title="Delete this rule?" text="It stops watching immediately. Past log entries stay." confirmLabel="Delete" danger onConfirm={() => deleting && remove.mutate(deleting.id)} />
      <Confirm open={clearing} onClose={() => setClearing(false)} title="Clear the log?" text="All past alert entries are removed. Rules are kept." confirmLabel="Clear log" danger onConfirm={() => clearEvents.mutate()} />
    </div>
  );
}
