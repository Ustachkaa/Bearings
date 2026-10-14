import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAnalysis, useHistory, useProjection, useStats, useWatchlist, useWatchlistMutations } from "@/lib/queries";
import type { Analysis, HistoryRange, Signal } from "@/lib/types";
import { compact, money, num, pct, pctRaw, signClass, typeLabel, dateLong } from "@/lib/format";
import { sma } from "@/lib/indicators";
import { usePref } from "@/lib/theme";
import { Badge, Button, Callout, Card, ErrorNote, LevelBadge, PageHeader, Skeleton, Slider, StanceBadge, StatTile, Tabs, Toggle, useToast } from "@/components/ui";
import { LineChart } from "@/components/charts/LineChart";
import { FanChart } from "@/components/charts/FanChart";
import { BearingDial } from "@/components/charts/BearingDial";
import { TickerSearch } from "@/components/TickerSearch";
import { AlertRuleForm } from "@/components/AlertRuleForm";
import { TradeForm } from "@/components/TradeForm";
import { Widget } from "@/components/widgets";
import { IcBell, IcBook, IcBriefcase, IcStar, IcStarFilled } from "@/components/icons";
import "./pages.css";

const GROUPS: { title: string; items: { symbol: string; name: string }[] }[] = [
  {
    title: "Whole-world funds (the usual starting point)",
    items: [
      { symbol: "VWCE.DE", name: "Vanguard FTSE All-World, accumulating" },
      { symbol: "IWDA.AS", name: "iShares Core MSCI World" },
      { symbol: "SXR8.DE", name: "iShares Core S&P 500, accumulating" },
      { symbol: "VUAA.L", name: "Vanguard S&P 500, accumulating" },
    ],
  },
  {
    title: "US companies",
    items: [
      { symbol: "AAPL", name: "Apple" },
      { symbol: "MSFT", name: "Microsoft" },
      { symbol: "JNJ", name: "Johnson & Johnson" },
      { symbol: "KO", name: "Coca-Cola" },
    ],
  },
  {
    title: "European companies",
    items: [
      { symbol: "ASML.AS", name: "ASML (Amsterdam)" },
      { symbol: "SAP.DE", name: "SAP (Frankfurt)" },
      { symbol: "NESN.SW", name: "Nestlé (Zurich)" },
      { symbol: "ULVR.L", name: "Unilever (London)" },
    ],
  },
  {
    title: "Crypto and commodities",
    items: [
      { symbol: "BTC-USD", name: "Bitcoin" },
      { symbol: "ETH-USD", name: "Ethereum" },
      { symbol: "GC=F", name: "Gold futures" },
      { symbol: "^GSPC", name: "S&P 500 index" },
    ],
  },
];

export function ExplorePage() {
  const { symbol: raw } = useParams();
  const symbol = raw ? decodeURIComponent(raw).toUpperCase() : undefined;
  const [recent, setRecent] = usePref<string[]>("recent", []);
  useEffect(() => {
    if (symbol) setRecent([symbol, ...recent.filter((s) => s !== symbol)].slice(0, 8));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  if (!symbol) {
    return (
      <div>
        <PageHeader eyebrow="Chart room" title="Explore any stock, fund or coin" lede="Type a name or ticker. Bearings pulls the price history, works out the indicators and explains what they mean in plain words." />
        <div className="rise d1" style={{ marginBottom: 26 }}>
          <TickerSearch autoFocus placeholder="Search: Apple, VWCE.DE, Bitcoin…" />
        </div>
        {recent.length > 0 && (
          <div className="rise d2" style={{ marginBottom: 26 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              Recently viewed
            </div>
            <div className="row wrap">
              {recent.map((s) => (
                <Link key={s} to={`/explore/${encodeURIComponent(s)}`} className="btn sm">
                  {s}
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="col rise d3" style={{ gap: 22 }}>
          {GROUPS.map((g) => (
            <div key={g.title}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                {g.title}
              </div>
              <div className="suggest-grid">
                {g.items.map((it) => (
                  <Link key={it.symbol} to={`/explore/${encodeURIComponent(it.symbol)}`} className="suggest">
                    <span className="sym">{it.symbol}</span>
                    <span className="name">{it.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Callout tone="note" title="Ticker suffixes">
          European listings carry an exchange suffix: <code>.DE</code> Frankfurt/Xetra, <code>.AS</code> Amsterdam, <code>.L</code> London, <code>.SW</code> Zurich, <code>.PA</code> Paris. Crypto pairs end in <code>-USD</code>. Indexes start with <code>^</code>.
        </Callout>
      </div>
    );
  }

  return <AnalysisView symbol={symbol} />;
}

function AnalysisView({ symbol }: { symbol: string }) {
  const { data: a, isLoading, error, refetch } = useAnalysis(symbol);
  const { data: watch } = useWatchlist();
  const { add, remove } = useWatchlistMutations();
  const toast = useToast();
  const [alertOpen, setAlertOpen] = useState(false);
  const [tradeOpen, setTradeOpen] = useState(false);
  const inWatch = watch?.find((w) => w.symbol === symbol);

  if (isLoading) {
    return (
      <div className="col" style={{ gap: 18 }}>
        <Skeleton h={90} />
        <Skeleton h={220} />
        <Skeleton h={320} />
      </div>
    );
  }
  if (error || !a) {
    return (
      <div>
        <PageHeader eyebrow="Chart room" title={symbol} />
        <ErrorNote error={error ?? new Error("No data")} retry={() => refetch()} />
        <div style={{ marginTop: 16 }}>
          <TickerSearch autoFocus />
        </div>
      </div>
    );
  }
  const q = a.quote;

  return (
    <div className="col" style={{ gap: 20 }}>
      <header className="explore-hero rise">
        <div>
          <div className="row wrap" style={{ gap: 8, marginBottom: 10 }}>
            <Badge tone="brass">{typeLabel(a.type)}</Badge>
            {q.exchange && <Badge>{q.exchange}</Badge>}
            <Badge>{q.currency}</Badge>
            {a.profile?.sector && <Badge>{a.profile.sector}</Badge>}
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>{a.name}</h1>
          <div className="row" style={{ gap: 14, marginTop: 12, alignItems: "baseline", flexWrap: "wrap" }}>
            <span className="sym" style={{ fontSize: 15 }}>
              {a.symbol}
            </span>
            <span className="price-big">{money(q.price, q.currency)}</span>
            <span className={`price-chg ${signClass(q.changePct)}`}>
              {q.change >= 0 ? "+" : ""}
              {num(q.change, q.price < 10 ? 4 : 2)} ({pctRaw(q.changePct, 2)}) today
            </span>
          </div>
        </div>
        <div className="row wrap" style={{ gap: 8, alignSelf: "center" }}>
          <Button
            variant={inWatch ? "default" : "primary"}
            icon={inWatch ? <IcStarFilled size={15} /> : <IcStar size={15} />}
            loading={add.isPending || remove.isPending}
            onClick={() =>
              inWatch
                ? remove.mutate(inWatch.id, { onSuccess: () => toast.info(`${symbol} removed from watchlist`) })
                : add.mutate(symbol, { onSuccess: () => toast.success(`${symbol} added to your watchlist`), onError: (e) => toast.error(e.message) })
            }
          >
            {inWatch ? "Watching" : "Watch"}
          </Button>
          <Button icon={<IcBell size={15} />} onClick={() => setAlertOpen(true)}>
            Alert me
          </Button>
          <Button icon={<IcBriefcase size={15} />} onClick={() => setTradeOpen(true)}>
            Practice buy
          </Button>
        </div>
      </header>

      <Card className="rise d1">
        <div className="verdict-card">
          <BearingDial score={a.verdict.score} stance={a.verdict.stance} headline={a.verdict.headline} />
          <div className="verdict-text">
            <div className="row wrap" style={{ gap: 8 }}>
              <span className="eyebrow">Bearings stance</span>
              <StanceBadge stance={a.verdict.stance} />
            </div>
            <div className="verdict-summary">{a.verdict.summary}</div>
            <div className="verdict-next">{a.verdict.nextStep}</div>
            <div className="verdict-caveat">{a.verdict.caveat}</div>
          </div>
        </div>
      </Card>

      <PriceCard a={a} />

      <div className="grid cols-2 rise d3" style={{ alignItems: "start" }}>
        <Card title="What the signals see" eyebrow={`${a.signals.length} observations`} subtitle="Each card explains one thing about today's price and shows the arithmetic.">
          <div className="signal-list">
            {a.signals.map((s) => (
              <SignalCard key={s.id} s={s} />
            ))}
          </div>
        </Card>
        <div className="col" style={{ gap: 18 }}>
          <Card title="Long-term buyer's checklist" eyebrow="Before you add money">
            <div className="check-list">
              {a.checklist.map((c) => (
                <div className="check-row" key={c.id}>
                  <span className={`check-icon ${c.status}`}>{c.status === "pass" ? "✓" : c.status === "fail" ? "✗" : c.status === "warn" ? "!" : "·"}</span>
                  <div>
                    <div className="check-label">{c.label}</div>
                    <div className="check-note">
                      {c.note}{" "}
                      {c.lesson && (
                        <Link to={`/learn/${c.lesson}`} className="tiny">
                          Learn why
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <IndicatorsCard a={a} />
        </div>
      </div>

      <ProjectionCard a={a} />

      <Card className="rise d4" title="If you had invested every month" eyebrow="Real history, replayed" subtitle="What a fixed monthly purchase of this asset would have done. History does not repeat exactly, but it teaches the shape of things.">
        <Widget widget="dca" props={{ symbol: a.symbol, monthly: 100, range: "10y" }} />
      </Card>

      <AboutCard a={a} />

      <AlertRuleForm open={alertOpen} onClose={() => setAlertOpen(false)} defaultSymbol={a.symbol} />
      <TradeForm open={tradeOpen} onClose={() => setTradeOpen(false)} defaultSymbol={a.symbol} />
    </div>
  );
}

function SignalCard({ s }: { s: Signal }) {
  const [showMath, setShowMath] = useState(false);
  return (
    <div className={`signal ${s.level}`}>
      <div className="row between">
        <LevelBadge level={s.level} />
        <span className="tiny muted-3" style={{ textTransform: "capitalize" }}>
          {s.category}
        </span>
      </div>
      <div className="signal-title">{s.title}</div>
      <div className="signal-detail">{s.detail}</div>
      {showMath && s.math && <div className="signal-math">{s.math}</div>}
      <div className="signal-foot">
        {s.math ? (
          <button className="btn ghost sm" onClick={() => setShowMath((v) => !v)}>
            {showMath ? "Hide the maths" : "Show the maths"}
          </button>
        ) : (
          <span />
        )}
        {s.lesson && (
          <Link to={`/learn/${s.lesson}`} className="row tiny" style={{ gap: 4 }}>
            <IcBook size={12} /> Lesson
          </Link>
        )}
      </div>
    </div>
  );
}

const RANGES: { id: HistoryRange; label: string }[] = [
  { id: "6mo", label: "6M" },
  { id: "1y", label: "1Y" },
  { id: "2y", label: "2Y" },
  { id: "5y", label: "5Y" },
  { id: "10y", label: "10Y" },
  { id: "max", label: "Max" },
];

function PriceCard({ a }: { a: Analysis }) {
  const [range, setRange] = usePref<HistoryRange>("explore.range", "1y");
  const [showMa, setShowMa] = usePref("explore.ma", true);
  const fetchRange: HistoryRange = range === "6mo" || range === "1y" ? "2y" : range;
  const { data: hist, isFetching, error } = useHistory(a.symbol, fetchRange);

  const view = useMemo(() => {
    const candles = hist ?? [];
    if (!candles.length) return null;
    const closes = candles.map((c) => c.close);
    const s50 = sma(closes, 50);
    const s200 = sma(closes, 200);
    const cutoff = range === "6mo" ? Date.now() - 186 * 86400_000 : range === "1y" ? Date.now() - 366 * 86400_000 : 0;
    const startIdx = cutoff ? candles.findIndex((c) => new Date(c.date).getTime() >= cutoff) : 0;
    const from = Math.max(0, startIdx);
    const x = candles.slice(from).map((c) => c.date);
    const first = closes[from];
    const last = closes[closes.length - 1];
    return {
      x,
      price: closes.slice(from),
      s50: s50.slice(from),
      s200: s200.slice(from),
      change: first ? last / first - 1 : 0,
      high: Math.max(...closes.slice(from)),
      low: Math.min(...closes.slice(from)),
    };
  }, [hist, range]);

  const fmt = (v: number) => money(v, a.currency, { digits: v < 10 ? 3 : v < 1000 ? 2 : 0 });

  return (
    <Card
      className="rise d2"
      title="Price and trend"
      eyebrow="The chart"
      actions={
        <>
          <Toggle checked={showMa} onChange={setShowMa} label="Averages" />
          <Tabs tabs={RANGES} value={range} onChange={setRange} />
        </>
      }
    >
      {error && <ErrorNote error={error} />}
      {!view && !error && <Skeleton h={280} />}
      {view && (
        <div className={isFetching ? "faded" : ""}>
          <div className="row wrap" style={{ gap: 20, marginBottom: 10 }}>
            <StatTile label={`Change over ${RANGES.find((r) => r.id === range)?.label}`} value={<span className={signClass(view.change)}>{pct(view.change)}</span>} />
            <StatTile label="Highest close" value={fmt(view.high)} />
            <StatTile label="Lowest close" value={fmt(view.low)} />
            <StatTile label="Now vs 200-day average" value={<span className={signClass(a.indicators.pctFromSma200)}>{pct(a.indicators.pctFromSma200)}</span>} />
          </div>
          <LineChart
            ariaLabel={`${a.name} price over ${range}`}
            x={view.x}
            height={300}
            yFormat={fmt}
            series={[
              { id: "price", label: "Price", data: view.price, area: true },
              ...(showMa
                ? [
                    { id: "s50", label: "50-day average", data: view.s50, color: "var(--s2)" },
                    { id: "s200", label: "200-day average", data: view.s200, muted: true },
                  ]
                : []),
            ]}
          />
          <p className="tiny muted-3" style={{ marginTop: 10 }}>
            The 200-day average (grey) is a slow line through a year of prices. Above it, the long trend is up. The 50-day (orange) reacts faster. Where they cross, traders shout "golden" or "death" cross; a patient investor mostly shrugs.{" "}
            <Link to="/learn/moving-averages">Lesson.</Link>
          </p>
        </div>
      )}
    </Card>
  );
}

function IndicatorsCard({ a }: { a: Analysis }) {
  const i = a.indicators;
  const q = a.quote;
  const rangePos = i.high52 > i.low52 ? ((i.price - i.low52) / (i.high52 - i.low52)) * 100 : 50;
  const items: { label: string; value: string; sub?: string; cls?: string; lesson?: string }[] = [
    { label: "From 52-week high", value: pct(i.drawdownFromHigh), sub: `High ${money(i.high52, a.currency)}`, cls: signClass(i.drawdownFromHigh), lesson: "drawdowns" },
    { label: "Vs 200-day average", value: pct(i.pctFromSma200), sub: i.sma200 ? money(i.sma200, a.currency) : "—", cls: signClass(i.pctFromSma200), lesson: "moving-averages" },
    { label: "Vs 50-day average", value: pct(i.pctFromSma50), sub: i.sma50 ? money(i.sma50, a.currency) : "—", cls: signClass(i.pctFromSma50), lesson: "moving-averages" },
    { label: "RSI (14 days)", value: i.rsi14 === null ? "—" : i.rsi14.toFixed(0), sub: i.rsi14 === null ? "" : i.rsi14 < 30 ? "oversold" : i.rsi14 > 70 ? "overbought" : "balanced", lesson: "rsi" },
    { label: "Volatility (30 days)", value: i.vol30 === null ? "—" : pct(i.vol30, 0, false), sub: i.vol30 === null ? "" : `≈ ±${pct(i.vol30 / Math.sqrt(12), 0, false)} a month`, lesson: "volatility" },
    { label: "1-year return", value: pct(i.ret1y), sub: "incl. dividends", cls: signClass(i.ret1y) },
    { label: "Worst fall (1 year)", value: pct(i.maxDrawdown1y), sub: "peak to trough", lesson: "drawdowns" },
    { label: `Yearly growth (${i.cagrYears.toFixed(0)}y)`, value: i.cagr === null ? "—" : pct(i.cagr), sub: "compound, from history", cls: signClass(i.cagr), lesson: "compounding" },
  ];
  if (q.pe) items.push({ label: "P/E ratio", value: q.pe.toFixed(1), sub: q.forwardPe ? `forward ${q.forwardPe.toFixed(1)}` : "", lesson: "valuation" });
  if (q.dividendYield) items.push({ label: "Dividend yield", value: pct(q.dividendYield, 2, false), lesson: "dividends" });
  if (q.marketCap) items.push({ label: "Market cap", value: money(q.marketCap, q.currency, { compact: true }), sub: q.marketCap > 2e11 ? "mega cap" : q.marketCap > 1e10 ? "large cap" : q.marketCap > 2e9 ? "mid cap" : "small cap", lesson: "valuation" });
  if (a.profile?.beta) items.push({ label: "Beta", value: a.profile.beta.toFixed(2), sub: a.profile.beta > 1.2 ? "swings more than the market" : a.profile.beta < 0.8 ? "swings less than the market" : "moves with the market", lesson: "volatility" });

  return (
    <Card title="The instruments" eyebrow="Indicators">
      <div style={{ marginBottom: 16 }}>
        <div className="row between tiny muted-3" style={{ marginBottom: 4 }}>
          <span>52-week low {money(i.low52, a.currency)}</span>
          <span>high {money(i.high52, a.currency)}</span>
        </div>
        <div className="progress-track" style={{ position: "relative", height: 10 }}>
          <div className="progress-fill" style={{ width: `${Math.max(2, Math.min(100, rangePos))}%`, background: "var(--s1)" }} />
        </div>
        <div className="tiny muted-3" style={{ marginTop: 4 }}>
          Today sits {rangePos.toFixed(0)}% of the way up its one-year range.
        </div>
      </div>
      <div className="ind-grid">
        {items.map((it) => (
          <div className="ind" key={it.label}>
            <div className="ind-label">{it.label}</div>
            <div className={`ind-value ${it.cls ?? ""}`}>{it.value}</div>
            {(it.sub || it.lesson) && (
              <div className="ind-sub">
                {it.sub}
                {it.lesson && (
                  <>
                    {it.sub ? " · " : ""}
                    <Link to={`/learn/${it.lesson}`}>what is this?</Link>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function ProjectionCard({ a }: { a: Analysis }) {
  const { data: stats } = useStats(a.symbol, "10y");
  const [initial, setInitial] = useState(1000);
  const [monthly, setMonthly] = useState(100);
  const [years, setYears] = useState(15);
  const [ret, setRet] = useState<number | null>(null);
  const [vol, setVol] = useState<number | null>(null);
  useEffect(() => {
    if (stats && ret === null) {
      setRet(Math.round(stats.suggestedReturn * 1000) / 10);
      setVol(Math.round(stats.suggestedVol * 100));
    }
  }, [stats, ret]);
  const input = ret === null || vol === null ? null : { initial, monthly, years, annualReturn: ret / 100, annualVol: vol / 100 };
  const { data: proj, isFetching } = useProjection(input);
  const fmt = (v: number) => money(v, "USD", { compact: v >= 100000, digits: 0 });

  return (
    <Card className="rise d4" title="Range of outcomes" eyebrow="Not a forecast" subtitle="Thousands of simulated futures using an assumed average return and this asset's historical bumpiness. The spread matters more than the middle line.">
      <div className="grid proj-grid">
        <div className="col" style={{ gap: 14 }}>
          <Slider label="Starting amount" value={initial} min={0} max={50000} step={100} onChange={setInitial} format={(v) => money(v, "USD", { digits: 0 })} />
          <Slider label="Monthly contribution" value={monthly} min={0} max={2000} step={10} onChange={setMonthly} format={(v) => money(v, "USD", { digits: 0 })} />
          <Slider label="Years" value={years} min={1} max={40} step={1} onChange={setYears} format={(v) => `${v} yr`} />
          <Slider
            label="Assumed yearly return"
            value={ret ?? 7}
            min={-5}
            max={20}
            step={0.5}
            onChange={setRet}
            format={(v) => `${v.toFixed(1)}%`}
            hint={stats?.cagr !== null && stats?.cagr !== undefined ? `History: ${pct(stats.cagr)} a year over ${stats.years.toFixed(0)} years. Bearings caps the default at 10%: long-run stock markets have returned about 7–10%.` : "Long-run stock markets have returned about 7–10% a year."}
          />
          <Slider label="Assumed bumpiness (volatility)" value={vol ?? 18} min={2} max={120} step={1} onChange={setVol} format={(v) => `${v}%`} hint={stats?.annualVol ? `History: ${pct(stats.annualVol, 0, false)} a year.` : undefined} />
        </div>
        <div className={isFetching ? "faded" : ""}>
          {!proj && <Skeleton h={280} />}
          {proj && (
            <>
              <div className="row wrap" style={{ gap: 20, marginBottom: 10 }}>
                <StatTile label={`Middle outcome after ${years} years`} value={fmt(proj.finalMedian)} sub={`you put in ${fmt(proj.contributions[years])}`} />
                <StatTile label="Poor outcome (1 in 10 worse)" value={fmt(proj.percentiles.p10[years])} />
                <StatTile label="Good outcome (1 in 10 better)" value={fmt(proj.percentiles.p90[years])} />
                <StatTile label="Chance of ending below what you put in" value={<span className={proj.probLoss > 0.2 ? "bad" : proj.probLoss > 0.08 ? "warn" : "good"}>{pct(proj.probLoss, 0, false)}</span>} />
              </div>
              <FanChart result={proj} format={fmt} />
              <p className="tiny muted-3" style={{ marginTop: 10 }}>
                In half of the simulated futures you end with more than the middle line, in half with less. The wide band shows how uncertain even a sensible plan is. Longer horizons and steady contributions narrow the odds of loss.{" "}
                <Link to="/learn/risk-and-return">Lesson on risk.</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

function AboutCard({ a }: { a: Analysis }) {
  const [more, setMore] = useState(false);
  const p = a.profile;
  const q = a.quote;
  const rows: [string, string][] = [];
  if (q.marketCap) rows.push(["Market cap", money(q.marketCap, q.currency, { compact: true })]);
  if (q.pe) rows.push(["P/E (trailing)", q.pe.toFixed(1)]);
  if (q.forwardPe) rows.push(["P/E (forward)", q.forwardPe.toFixed(1)]);
  if (q.eps !== undefined) rows.push(["Earnings per share", money(q.eps, q.currency)]);
  if (q.pb) rows.push(["Price to book", q.pb.toFixed(2)]);
  if (q.dividendYield) rows.push(["Dividend yield", pct(q.dividendYield, 2, false)]);
  if (p?.payoutRatio) rows.push(["Payout ratio", pct(p.payoutRatio, 0, false)]);
  if (p?.profitMargin !== undefined) rows.push(["Profit margin", pct(p.profitMargin, 1, false)]);
  if (p?.revenueGrowth !== undefined) rows.push(["Revenue growth (yoy)", pct(p.revenueGrowth, 1)]);
  if (p?.returnOnEquity !== undefined) rows.push(["Return on equity", pct(p.returnOnEquity, 1, false)]);
  if (p?.debtToEquity !== undefined) rows.push(["Debt to equity", num(p.debtToEquity, 0) + "%"]);
  if (p?.expenseRatio !== undefined) rows.push(["Expense ratio", pct(p.expenseRatio, 2, false)]);
  if (p?.totalAssets) rows.push(["Fund size", money(p.totalAssets, q.currency, { compact: true })]);
  if (p?.category) rows.push(["Category", p.category]);
  if (p?.employees) rows.push(["Employees", compact(p.employees)]);
  if (q.avgVolume) rows.push(["Average daily volume", compact(q.avgVolume)]);
  rows.push(["52-week range", `${money(a.indicators.low52, q.currency)} – ${money(a.indicators.high52, q.currency)}`]);
  rows.push(["Data as of", dateLong(a.asOf)]);

  const summary = p?.summary ?? "";
  return (
    <Card className="rise d5" title={`About ${a.name}`} eyebrow="The facts">
      <div className="grid cols-2" style={{ alignItems: "start" }}>
        <div>
          {p?.industry && (
            <div className="row wrap" style={{ gap: 8, marginBottom: 10 }}>
              <Badge>{p.industry}</Badge>
              {p.country && <Badge>{p.country}</Badge>}
              {p.website && (
                <a className="tiny" href={p.website} target="_blank" rel="noreferrer">
                  {p.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          )}
          {summary ? (
            <p className="small muted" style={{ lineHeight: 1.6 }}>
              {more || summary.length < 420 ? summary : summary.slice(0, 420) + "…"}{" "}
              {summary.length >= 420 && (
                <button className="btn ghost sm" onClick={() => setMore((m) => !m)}>
                  {more ? "Less" : "Read more"}
                </button>
              )}
            </p>
          ) : (
            <p className="small muted">
              {a.type === "ETF" || a.type === "FUND"
                ? "A fund holds a basket of many securities. Check the provider's factsheet for exact holdings, cost and whether dividends are reinvested (accumulating) or paid out (distributing)."
                : a.type === "CRYPTO"
                  ? "A cryptocurrency. No earnings, no dividends, no balance sheet; the price reflects supply, demand and sentiment alone."
                  : "No description available."}
            </p>
          )}
        </div>
        <div className="table-wrap">
          <table className="table fund-table">
            <tbody>
              {rows.map(([k, v]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td className="num" style={{ fontWeight: 600 }}>
                    {v}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
