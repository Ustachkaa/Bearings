# Bearings

**Learn to invest, do the maths, follow the market, and get calm email alerts.**

Bearings is a personal investing companion built for a first-time, long-term investor. It runs on your own computer and combines:

- **A 26-lesson course** in four modules (foundations, building a plan, reading the numbers, thinking like an investor), each with worked arithmetic, an interactive calculator and a quiz.
- **18 calculators** (compound growth, dollar-cost averaging replayed on real history, fees, inflation, goal planning, position sizing, P/E, dividends, drawdowns, volatility, currency exposure for GEL/USD/EUR, and more).
- **Explore**: live prices and history for any stock, ETF, index, commodity or crypto worldwide, with a transparent rule-based **stance** (Accumulate / Steady / Patience / Caution), every signal explained in plain words with its maths, a long-term buyer's checklist, a Monte Carlo "range of outcomes", and a "what if I had invested every month" replay.
- **Watchlist and alerts**: rules such as *dip from 52-week high*, *price below*, *RSI oversold*, *golden cross*, *stance changed*, *big daily move*, and a **monthly investing reminder**. Alerts appear in-app and are emailed through your Gmail. A weekly digest summarises your watchlist.
- **Practice portfolio**: trade with pretend money at real prices, with a journal that asks *why* on every trade.

Everything is stored in one JSON file on your machine. No accounts, no tracking.

> Bearings is a learning tool. Its signals describe the current price; nothing here predicts the future and none of it is financial advice.

---

## Quick start

Requirements: **Node.js 20 or newer** (you have 20 and 22 installed via nvm) and an internet connection (market data comes from Yahoo Finance, fonts from Google Fonts).

```bash
cd Bearings
npm install
copy .env.example .env      # optional now; needed for email alerts
npm run dev
```

Then open **http://localhost:5180**. The API runs on port 7300 and the web app proxies to it.

Or double-click **`start-bearings.bat`**, which builds once and starts everything on http://localhost:7300.

## Email alerts (Gmail, two minutes)

1. Turn on 2-Step Verification for your Google account: <https://myaccount.google.com/security>
2. Create an App Password at <https://myaccount.google.com/apppasswords> (name it "Bearings"). Google shows a 16-character code.
3. In the app open **Settings → Email alerts**, enter your Gmail address, paste the code, choose where alerts should go, and press **Save and send a test email**.

You can also put the same values in `.env` (see `.env.example`); the Settings page overrides them. The password is stored only in `server/data/bearings.json` on your computer.

## How the alert engine works

- While the app is running, it checks every enabled rule on a schedule (default: every 30 minutes; change it in Settings).
- Fired alerts go to the **Ship's log** on the Alerts page and, if email is connected, into one email per check.
- **Monthly investing reminder**: set the day and amount under *Settings → Your monthly plan*. This is the most useful alert for a long-term investor.
- **Weekly digest**: a Sunday evening email (configurable) with your watchlist, stances, unread alerts and practice-portfolio value.
- Press **Check now** on the Alerts page at any time.

Because the engine lives on your PC, nothing is checked while the PC is off or the app is closed. See *Running all the time* below.

## Running all the time

**Option A – keep it running on Windows.** Build once and start the production server:

```bash
npm run build
npm start          # serves the app and API on http://localhost:7300
```

To start it automatically at login, create a shortcut to `start-bearings.bat` in `shell:startup` (Win+R, type `shell:startup`). Or use Task Scheduler with the action `cmd /c "C:\Users\<you>\Desktop\Bearings\start-bearings.bat"` set to run at log-on.

**Option B – a small cloud server (24/7 alerts).** Any Node host works (Railway, Render, Fly.io, a €4 VPS):

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment variables: copy the ones from `.env.example` (`PORT` is usually provided by the host; set `SMTP_*`, `ALERT_TO`, `TZ=Asia/Tbilisi`).
- **Persist the data folder.** Mount a volume at `/app/server/data` (or set `DATA_DIR` to a persistent path), otherwise watchlist and settings vanish on redeploy.
- Set *Settings → Profile → App address* to the public URL so email links point at it.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Server (port 7300, auto-reload) and Vite client (port 5180) together |
| `npm run build` | Builds the client into `client/dist` |
| `npm start` | Production: one process serving API and the built client on port 7300 |
| `npm run typecheck` | TypeScript checks for both packages |

## Project layout

```
Bearings/
├─ server/                 Express + TypeScript API, alert engine, mailer
│  ├─ src/market/          Yahoo Finance provider, indicator maths, signals engine, projections
│  ├─ src/alerts/          Rule definitions, scheduler (node-cron), email templates
│  ├─ src/routes/          /api/market, /watchlist, /alerts, /portfolio, /progress, /settings
│  └─ data/bearings.json   Your data (created on first run; ignored by git)
├─ client/                 React 19 + Vite + TypeScript
│  ├─ src/content/lessons/ The 26 lessons as structured data
│  ├─ src/components/      Design system, charts (SVG), calculators (widgets), forms
│  └─ src/pages/           Home, Learn, Lesson, Tools, Explore, Watchlist, Alerts, Practice, Settings
├─ .env.example
└─ start-bearings.bat
```

## How the signals are made (and what they are not)

For each asset Bearings downloads two years of daily prices and computes: 50- and 200-day moving averages, RSI(14), distance from the 52-week high, 30-day volatility, 12-month return, and (for stocks) P/E and dividend yield. A small set of rules turns those into observations, each with a score between −1 and +1.5, a plain-language explanation and the arithmetic. The scores sum to a composite that becomes the stance:

| Score | Stance | Meaning |
|---|---|---|
| ≥ 2 | **Accumulate** | Conditions look favourable for adding a little extra |
| 0.5 – 2 | **Steady** | Nothing special; keep the regular plan |
| −1 – 0.5 | **Patience** | No discount, possibly stretched; extra money can wait |
| ≤ −1 | **Caution** | Several warning lights; understand them before buying |

The rules are tuned for someone who invests monthly into diversified funds: a fund trading below its 200-day average is treated as a discount, a single company doing the same is treated as a warning. The full logic is in `server/src/market/signals.ts` and is deliberately simple enough to read.

None of this predicts prices. The Monte Carlo chart shows a *range* of outcomes from assumed return and volatility, and the DCA replay shows what *did* happen, not what will.

## Tickers

Yahoo Finance symbols: `AAPL`, `MSFT` (US); `VWCE.DE`, `SXR8.DE` (Frankfurt/Xetra); `IWDA.AS` (Amsterdam); `VUAA.L`, `CSPX.L` (London); `NESN.SW` (Zurich); `BTC-USD`, `ETH-USD` (crypto); `^GSPC`, `^GDAXI` (indexes); `GC=F` (gold); `GEL=X` (USD/GEL). The search box finds most names; if it does not, type the exact ticker.

## Troubleshooting

- **"No quote found"** – check the ticker and its exchange suffix. European ETFs need `.DE`, `.AS`, `.L` etc.
- **Prices stop updating / errors from Yahoo** – Yahoo occasionally rate-limits. Bearings caches quotes for a minute and history for 15 minutes; wait and press refresh. *Settings → Data → Clear cache* is not needed normally.
- **Port already in use** – another Bearings instance is running. Close it, or change `PORT` in `.env` (and the proxy target in `client/vite.config.ts` if you use `npm run dev`).
- **Emails do not arrive** – the App Password must come from an account with 2-Step Verification on; use port 465 with TLS. Check the spam folder for the first one.
- **`npm install` complains about Visual Studio** – it should not; Bearings has no native modules. Delete `node_modules` and `package-lock.json` and run `npm install` again.

## Data and privacy

Everything (watchlist, rules, alert log, practice trades, lesson progress, settings, the Gmail App Password) lives in `server/data/bearings.json`. Delete the file to start over, or use *Settings → Data*. The only outside services contacted are Yahoo Finance (prices), Stooq (fallback history for US tickers), Google Fonts, and your own Gmail SMTP when sending mail.
