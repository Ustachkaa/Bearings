import { useEffect, useState } from "react";
import { useAlertMutations, useAlertRules, useSettings, useSettingsMutations } from "@/lib/queries";
import type { AppSettings } from "@/lib/types";
import { Button, Callout, Card, Confirm, Field, NumberInput, PageHeader, Select, Skeleton, Toggle, useToast } from "@/components/ui";
import { IcMail } from "@/components/icons";
import { CRON_LABELS } from "./Alerts";
import "./pages.css";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function SettingsPage() {
  const { data: s, isLoading } = useSettings();
  const { save, testEmail, reset } = useSettingsMutations();
  const { data: rules } = useAlertRules();
  const { create, update } = useAlertMutations();
  const toast = useToast();

  const [email, setEmail] = useState<AppSettings["email"] | null>(null);
  const [display, setDisplay] = useState<AppSettings["display"] | null>(null);
  const [cron, setCron] = useState("");
  const [customCron, setCustomCron] = useState(false);
  const [digest, setDigest] = useState<AppSettings["digest"] | null>(null);
  const [dca, setDca] = useState<AppSettings["dca"] | null>(null);
  const [confirm, setConfirm] = useState<"all" | "learning" | "portfolio" | "alerts" | null>(null);

  useEffect(() => {
    if (s) {
      setEmail({ ...s.email, pass: "" });
      setDisplay(s.display);
      setCron(s.schedule.cron);
      setCustomCron(!CRON_LABELS[s.schedule.cron]);
      setDigest(s.digest);
      setDca(s.dca);
    }
  }, [s]);

  if (isLoading || !s || !email || !display || !digest || !dca) {
    return (
      <div>
        <PageHeader eyebrow="Rigging" title="Settings" />
        <Skeleton h={300} />
      </div>
    );
  }

  const saveEmail = () => {
    save.mutate({ email }, { onSuccess: () => toast.success("Email settings saved"), onError: (e) => toast.error(e.message) });
  };
  const doTest = () => {
    save.mutate(
      { email },
      {
        onSuccess: () =>
          testEmail.mutate(undefined, {
            onSuccess: (r) => (r.ok ? toast.success(`Test email sent to ${email.to}`) : toast.error(r.error ?? "Failed")),
            onError: (e) => toast.error(e.message),
          }),
        onError: (e) => toast.error(e.message),
      },
    );
  };
  const saveSchedule = () => {
    save.mutate({ schedule: { cron }, digest }, { onSuccess: () => toast.success("Schedule saved"), onError: (e) => toast.error(e.message) });
  };
  const saveDca = () => {
    const existing = rules?.find((r) => r.type === "dca_reminder");
    const params = { dayOfMonth: dca.dayOfMonth, amount: dca.amount, currency: dca.currency };
    save.mutate({ dca });
    if (existing) {
      update.mutate({ id: existing.id, enabled: dca.enabled, params }, { onSuccess: () => toast.success("Monthly plan updated"), onError: (e) => toast.error(e.message) });
    } else if (dca.enabled) {
      create.mutate({ type: "dca_reminder", symbol: null, params }, { onSuccess: () => toast.success("Monthly reminder created"), onError: (e) => toast.error(e.message) });
    } else {
      toast.success("Saved");
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Rigging" title="Settings" lede="Email, schedule, your monthly plan and the data this app keeps on your computer." />

      <div className="settings-grid">
        <Card className="rise d1" title="Email alerts" eyebrow="Gmail" subtitle="Alerts and the weekly digest are sent from your Gmail account to any address you choose.">
          <div className="form-grid">
            <div className="span2">
              <Toggle checked={email.enabled} onChange={(v) => setEmail({ ...email, enabled: v })} label="Send emails" />
            </div>
            <Field label="Gmail address (sender)">
              <input className="input" value={email.user} onChange={(e) => setEmail({ ...email, user: e.target.value })} placeholder="you@gmail.com" autoComplete="off" />
            </Field>
            <Field label="App password" hint={email.passSet ? "A password is saved. Leave blank to keep it." : "16 characters from Google, spaces are fine."}>
              <input className="input mono" type="password" value={email.pass} onChange={(e) => setEmail({ ...email, pass: e.target.value })} placeholder={email.passSet ? "•••• •••• •••• ••••" : "xxxx xxxx xxxx xxxx"} autoComplete="new-password" />
            </Field>
            <Field label="Send alerts to">
              <input className="input" value={email.to} onChange={(e) => setEmail({ ...email, to: e.target.value })} placeholder="you@gmail.com" />
            </Field>
            <Field label="From name (optional)">
              <input className="input" value={email.from} onChange={(e) => setEmail({ ...email, from: e.target.value })} placeholder="Bearings <you@gmail.com>" />
            </Field>
            <Field label="SMTP host">
              <input className="input mono" value={email.host} onChange={(e) => setEmail({ ...email, host: e.target.value })} />
            </Field>
            <div className="row" style={{ gap: 12, alignItems: "flex-end" }}>
              <Field label="Port">
                <NumberInput value={email.port} onChange={(v) => setEmail({ ...email, port: v })} min={1} max={65535} width={110} />
              </Field>
              <div style={{ paddingBottom: 10 }}>
                <Toggle checked={email.secure} onChange={(v) => setEmail({ ...email, secure: v })} label="TLS (port 465)" />
              </div>
            </div>
          </div>
          <div className="row wrap" style={{ marginTop: 16, gap: 8 }}>
            <Button variant="primary" onClick={saveEmail} loading={save.isPending}>
              Save
            </Button>
            <Button icon={<IcMail size={14} />} onClick={doTest} loading={testEmail.isPending}>
              Save and send a test email
            </Button>
          </div>
          <div className="hr" />
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            How to get a Gmail App Password (2 minutes)
          </div>
          <ol className="howto">
            <li>Turn on 2-Step Verification for your Google account at myaccount.google.com/security.</li>
            <li>
              Open{" "}
              <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer">
                myaccount.google.com/apppasswords
              </a>
              , type a name such as "Bearings" and press Create.
            </li>
            <li>Google shows a 16-character code. Paste it into the App password box above. Your normal Gmail password is never used or stored.</li>
            <li>Press "Save and send a test email". If it arrives, you are done.</li>
          </ol>
          <Callout tone="note" title="Where the password lives">
            Only in the data file on this computer (server/data/bearings.json). It is never sent anywhere except to Gmail's own servers when sending mail.
          </Callout>
        </Card>

        <Card className="rise d2" title="Schedule" eyebrow="When to check" subtitle="How often the alert engine looks at prices while the app is running, and when the digest goes out.">
          <div className="form-grid">
            <Field label="Check prices">
              {customCron ? (
                <input className="input mono" value={cron} onChange={(e) => setCron(e.target.value)} placeholder="*/30 * * * *" />
              ) : (
                <Select value={cron} onChange={setCron} options={Object.entries(CRON_LABELS).map(([value, label]) => ({ value, label }))} />
              )}
            </Field>
            <div style={{ alignSelf: "end", paddingBottom: 8 }}>
              <Toggle checked={customCron} onChange={setCustomCron} label="Custom cron expression" />
            </div>
            <div className="span2">
              <Toggle checked={digest.enabled} onChange={(v) => setDigest({ ...digest, enabled: v })} label="Send a weekly digest email" />
            </div>
            <Field label="Digest day">
              <Select value={String(digest.weekday)} onChange={(v) => setDigest({ ...digest, weekday: Number(v) })} options={WEEKDAYS.map((d, i) => ({ value: String(i), label: d }))} />
            </Field>
            <Field label="Digest hour (24h)">
              <NumberInput value={digest.hour} onChange={(v) => setDigest({ ...digest, hour: v })} min={0} max={23} width={110} />
            </Field>
          </div>
          <div style={{ marginTop: 16 }}>
            <Button variant="primary" onClick={saveSchedule} loading={save.isPending}>
              Save schedule
            </Button>
          </div>
          <Callout tone="warn" title="Alerts need the app running">
            The engine lives on this computer. When the PC is off or the app is closed, nothing is checked. The README explains how to keep it running or move it to a small cloud server.
          </Callout>
        </Card>

        <Card className="rise d3" title="Your monthly plan" eyebrow="Dollar-cost averaging" subtitle="A reminder on the same day each month so the plan runs itself. This is the single most useful alert in the app.">
          <div className="form-grid">
            <div className="span2">
              <Toggle checked={dca.enabled} onChange={(v) => setDca({ ...dca, enabled: v })} label="Remind me every month" />
            </div>
            <Field label="Day of month">
              <NumberInput value={dca.dayOfMonth} onChange={(v) => setDca({ ...dca, dayOfMonth: v })} min={1} max={28} width={110} />
            </Field>
            <Field label="Amount">
              <div className="row">
                <NumberInput value={dca.amount} onChange={(v) => setDca({ ...dca, amount: v })} min={0} step={10} width={160} />
                <Select value={dca.currency} onChange={(v) => setDca({ ...dca, currency: v })} options={["USD", "EUR", "GEL", "GBP"].map((c) => ({ value: c, label: c }))} className="" />
              </div>
            </Field>
            <Field label="Note to yourself (optional)">
              <input className="input" value={dca.note} onChange={(e) => setDca({ ...dca, note: e.target.value })} placeholder="e.g. Transfer to broker, buy VWCE.DE, do not look at the chart." />
            </Field>
          </div>
          <div style={{ marginTop: 16 }}>
            <Button variant="primary" onClick={saveDca} loading={save.isPending || create.isPending || update.isPending}>
              Save plan
            </Button>
          </div>
        </Card>

        <Card className="rise d4" title="Profile" eyebrow="Display">
          <div className="form-grid">
            <Field label="Your name (for greetings)">
              <input className="input" value={display.name} onChange={(e) => setDisplay({ ...display, name: e.target.value })} placeholder="Optional" />
            </Field>
            <Field label="App address in emails" hint="Links in emails point here.">
              <input className="input mono" value={display.appUrl} onChange={(e) => setDisplay({ ...display, appUrl: e.target.value })} />
            </Field>
          </div>
          <div style={{ marginTop: 16 }}>
            <Button variant="primary" onClick={() => save.mutate({ display }, { onSuccess: () => toast.success("Saved") })} loading={save.isPending}>
              Save
            </Button>
          </div>
        </Card>

        <Card className="rise d5" title="Data" eyebrow="Start over" subtitle="Everything lives in one file on this computer. These buttons cannot be undone.">
          <div className="row wrap" style={{ gap: 8 }}>
            <Button variant="danger" size="sm" onClick={() => setConfirm("learning")}>
              Reset lesson progress
            </Button>
            <Button variant="danger" size="sm" onClick={() => setConfirm("portfolio")}>
              Reset practice portfolio
            </Button>
            <Button variant="danger" size="sm" onClick={() => setConfirm("alerts")}>
              Clear alert log
            </Button>
            <Button variant="danger" size="sm" onClick={() => setConfirm("all")}>
              Erase everything
            </Button>
          </div>
        </Card>
      </div>

      <Confirm
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        title={confirm === "all" ? "Erase everything?" : `Reset ${confirm === "learning" ? "lesson progress" : confirm === "portfolio" ? "the practice portfolio" : "the alert log"}?`}
        text={confirm === "all" ? "Watchlist, rules, alerts, practice trades, progress and settings (including email) are all deleted." : "This cannot be undone."}
        confirmLabel="Yes, do it"
        danger
        onConfirm={() => confirm && reset.mutate(confirm, { onSuccess: () => toast.info("Done") })}
      />
    </div>
  );
}
