import { Link } from "react-router-dom";
import { LESSONS } from "@/content/lessons";
import { useAlertEvents, useAlertMutations, useAlertRules, useAlertStatus, usePortfolio, useProgress, usePulse, useSettings, useSettingsMutations, useWatchlistOverview } from "@/lib/queries";
import { money, pct, pctRaw, signClass, timeAgo } from "@/lib/format";
import { Button, Card, Empty, Skeleton, StanceBadge, StatTile, useToast } from "@/components/ui";
import { Sparkline } from "@/components/charts/Sparkline";
import { CompassRose, IcArrowRight, IcBell, IcBook, IcCheck, IcPlay, IcSearch } from "@/components/icons";
import "./pages.css";

const SUGGESTED = [
  { symbol: "VWCE.DE", name: "Vanguard FTSE All-World (accumulating)" },
  { symbol: "SXR8.DE", name: "iShares Core S&P 500 (accumulating)" },
  { symbol: "IWDA.AS", name: "iShares Core MSCI World" },
  { symbol: "BTC-USD", name: "Bitcoin" },
];

function greeting() {
  const h = new Date().getHours();
  return h < 5 ? "Good night" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export function HomePage() {
  const { data: settings } = useSettings();
  const { data: progress } = useProgress();
  const { data: pulse, isLoading: pulseLoading } = usePulse();
  const { data: watch, isLoading: watchLoading } = useWatchlistOverview();
  const { data: events } = useAlertEvents(6);
  const { data: rules } = useAlertRules();
  const { data: status } = useAlertStatus();
  const { data: portfolio } = usePortfolio();
  const { run } = useAlertMutations();
  const { save: saveSettings } = useSettingsMutations();
  const toast = useToast();

  const done = LESSONS.filter((l) => progress?.[l.id]?.completed).length;
  const next = LESSONS.find((l) => !progress?.[l.id]?.completed) ?? LESSONS[0];
  const name = settings?.display.name?.trim();
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  const steps = [
    { id: "lesson", label: "Read your first lesson", sub: "Ten minutes on what investing actually is", to: `/learn/${LESSONS[0].id}`, done: done > 0 },
    { id: "watch", label: "Add a fund to your watchlist", sub: "Try VWCE.DE, a whole-world fund", to: "/explore/VWCE.DE", done: (watch?.length ?? 0) > 0 },
    { id: "email", label: "Connect email alerts", sub: "A Gmail App Password is all it takes", to: "/settings", done: Boolean(status?.emailConfigured) },
    { id: "trade", label: "Make a practice trade", sub: "Play with $10,000 of pretend money", to: "/portfolio", done: (portfolio?.txnCount ?? 0) > 0 },
  ];
  const allDone = steps.every((s) => s.done);
  const showOnboarding = !settings?.onboarding.done && !allDone;
  const dcaRule = rules?.find((r) => r.type === "dca_reminder" && r.enabled);
  let nextDca: string | null = null;
  if (dcaRule) {
    const day = Number(dcaRule.params.dayOfMonth ?? 1);
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth() + (now.getDate() >= day ? 1 : 0), day);
    nextDca = d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  }

  return (
    <div className="col" style={{ gap: 22 }}>
      <section className="hero">
        <Card ink className="hero-card rise">
          <CompassRose size={300} className="hero-rose" />
          <div>
            <div className="eyebrow">{today}</div>
            <h1 style={{ marginTop: 10 }}>
              {greeting()}
              {name ? `, ${name}` : ""}. {done === 0 ? "Let us get your bearings." : done < LESSONS.length ? "Steady progress beats bold guesses." : "You know the course. Sail it."}
            </h1>
            <p className="lede muted">
              {done} of {LESSONS.length} lessons done · {watch?.length ?? 0} on your watchlist · {events?.unread ?? 0} unread alert{(events?.unread ?? 0) === 1 ? "" : "s"}
            </p>
          </div>
          <div className="hero-actions">
            <Button variant="brass" to={`/learn/${next.id}`} icon={<IcBook size={15} />}>
              {done === 0 ? "Start lesson 1" : `Continue: ${next.title}`}
            </Button>
            <Button variant="ghost" to="/explore" icon={<IcSearch size={15} />}>
              Explore a market
            </Button>
          </div>
        </Card>

        {showOnboarding ? (
          <Card className="rise d1" title="Start here" eyebrow="Four small steps" actions={<Button variant="ghost" size="sm" onClick={() => saveSettings.mutate({ onboarding: { done: true } })}>Hide</Button>}>
            <div className="checklist">
              {steps.map((s) => (
                <Link key={s.id} to={s.to} className={`check-item ${s.done ? "done" : ""}`}>
                  <span className="check-box">
                    <IcCheck size={13} />
                  </span>
                  <span className="grow">
                    <div className="check-text">{s.label}</div>
                    <div className="check-sub">{s.sub}</div>
                  </span>
                  <IcArrowRight size={14} style={{ color: "var(--ink-3)" }} />
                </Link>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="rise d1" title="Practice portfolio" eyebrow="Pretend money, real prices" actions={<Button size="sm" to="/portfolio">Open</Button>}>
            {portfolio ? (
              <div className="grid cols-2">
                <StatTile label="Total value" value={money(portfolio.totals.equity, "USD", { digits: 0 })} delta={pct(portfolio.totals.totalReturnPct)} deltaTone={signClass(portfolio.totals.totalReturnPct) as "good" | "bad" | ""} sub="since start" />
                <StatTile label="Invested" value={money(portfolio.totals.value, "USD", { digits: 0 })} delta={portfolio.totals.invested ? pct(portfolio.totals.gainPct) : undefined} deltaTone={signClass(portfolio.totals.gainPct) as "good" | "bad" | ""} sub={`${portfolio.holdings.length} holding${portfolio.holdings.length === 1 ? "" : "s"}`} />
              </div>
            ) : (
              <Skeleton h={60} />
            )}
            {nextDca && (
              <div className="tiny muted" style={{ marginTop: 12 }}>
                Next regular investment reminder: <strong>{nextDca}</strong>
              </div>
            )}
          </Card>
        )}
      </section>

      <section className="rise d2">
        <div className="row between" style={{ marginBottom: 10 }}>
          <div className="eyebrow">Market pulse</div>
          <span className="tiny muted-3">Prices refresh every couple of minutes. Daily change shown.</span>
        </div>
        <div className="pulse">
          {pulseLoading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} h={70} />)}
          {pulse?.map((p) => {
            const q = p.quote;
            const isIndex = q.type === "INDEX" || q.type === "CURRENCY" || q.type === "COMMODITY";
            return (
              <Link to={`/explore/${encodeURIComponent(p.symbol)}`} className="pulse-tile" key={p.symbol}>
                <div className="pulse-label">{p.label}</div>
                <div className="pulse-price">{isIndex ? q.price.toLocaleString("en-US", { maximumFractionDigits: q.price < 10 ? 4 : 0 }) : money(q.price, q.currency, { digits: 0 })}</div>
                <div className={`pulse-chg ${signClass(q.changePct)}`}>{pctRaw(q.changePct, 2)}</div>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid cols-2 rise d3">
        <Card
          title="Your bearings"
          eyebrow="Watchlist"
          actions={
            <Button size="sm" to="/watchlist">
              All
            </Button>
          }
        >
          {watchLoading && <Skeleton h={120} />}
          {watch && watch.length === 0 && (
            <div>
              <Empty title="Nothing on the horizon yet" text="Add a broad, low-cost fund first. These are common starting points for investors in Europe and Georgia:" />
              <div className="suggest-grid">
                {SUGGESTED.map((s) => (
                  <Link to={`/explore/${encodeURIComponent(s.symbol)}`} className="suggest" key={s.symbol}>
                    <span className="sym">{s.symbol}</span>
                    <span className="name">{s.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {watch && watch.length > 0 && (
            <div className="watch-mini">
              {watch.slice(0, 8).map((r) => (
                <Link to={`/explore/${encodeURIComponent(r.item.symbol)}`} className="watch-mini-row" key={r.item.id}>
                  <div style={{ minWidth: 0 }}>
                    <div className="sym">{r.item.symbol}</div>
                    <div className="name">{r.item.name}</div>
                  </div>
                  <div className="hide-sm">{r.spark && <Sparkline data={r.spark} width={96} height={28} />}</div>
                  <div className="hide-sm" style={{ textAlign: "right" }}>
                    {r.quote && (
                      <>
                        <div className="num" style={{ fontWeight: 600 }}>
                          {money(r.quote.price, r.quote.currency)}
                        </div>
                        <div className={`tiny num ${signClass(r.quote.changePct)}`}>{pctRaw(r.quote.changePct)}</div>
                      </>
                    )}
                  </div>
                  <div>{r.verdict ? <StanceBadge stance={r.verdict.stance} /> : <span className="tiny muted-3">{r.error ? "no data" : "…"}</span>}</div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card
          title="Ship's log"
          eyebrow="Recent alerts"
          actions={
            <>
              <Button
                size="sm"
                variant="ghost"
                icon={<IcPlay size={12} />}
                loading={run.isPending}
                onClick={() =>
                  run.mutate(undefined, {
                    onSuccess: (r) => toast.info(r.fired ? `${r.fired} alert${r.fired === 1 ? "" : "s"} fired` : "Checked. Nothing to report."),
                    onError: (e) => toast.error(e.message),
                  })
                }
              >
                Check now
              </Button>
              <Button size="sm" to="/alerts">
                All
              </Button>
            </>
          }
        >
          {!events && <Skeleton h={100} />}
          {events && events.events.length === 0 && (
            <Empty
              title="Quiet waters"
              text={
                rules && rules.length > 0
                  ? `${rules.length} rule${rules.length === 1 ? "" : "s"} watching. Last check ${timeAgo(status?.lastCheckAt)}.`
                  : "No alert rules yet. Set one up so the app watches the market for you."
              }
              action={
                !rules?.length && (
                  <Button size="sm" to="/alerts" icon={<IcBell size={13} />}>
                    Create an alert
                  </Button>
                )
              }
            />
          )}
          {events && events.events.length > 0 && (
            <div>
              {events.events.map((e) => (
                <div className="event-row" key={e.id}>
                  <span className={`event-mark ${e.level}`} />
                  <div className="grow" style={{ minWidth: 0 }}>
                    <div className="event-title">{e.title}</div>
                    <div className="tiny muted-3">
                      {timeAgo(e.createdAt)}
                      {e.emailed ? " · emailed" : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid cols-2 rise d4">
        <Card title="Learning progress" eyebrow="The almanac" actions={<Button size="sm" to="/learn">Open</Button>}>
          <div className="row" style={{ gap: 16 }}>
            <StatTile label="Lessons complete" value={`${done} / ${LESSONS.length}`} />
            <div className="grow">
              <div className="progress-track">
                <div className={`progress-fill ${done === LESSONS.length ? "good" : ""}`} style={{ width: `${(done / LESSONS.length) * 100}%` }} />
              </div>
              <div className="tiny muted-3" style={{ marginTop: 6 }}>
                Up next: {next.title}
              </div>
            </div>
          </div>
        </Card>
        <Card title="How to use the signals" eyebrow="Honesty note">
          <p className="small muted" style={{ lineHeight: 1.55 }}>
            Bearings turns today's price into a stance: <strong>Accumulate</strong>, <strong>Steady</strong>, <strong>Patience</strong> or <strong>Caution</strong>. It is a description of the present, not a prediction. Your monthly plan goes ahead regardless; the signals only suggest when an extra contribution looks attractive.{" "}
            <Link to="/learn/using-bearings">Read the lesson on using Bearings.</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
