import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "crypto",
  module: "mindset",
  title: "Crypto: how a long-term investor treats it",
  subtitle: "Not a scam, not a retirement plan. A small, wild satellite that needs its own rules.",
  minutes: 9,
  blocks: [
    {
      type: "p",
      text: "You will be asked about crypto by friends, and you will be tempted by it during rallies. This lesson does not tell you to avoid it. It tells you what it is, why the normal tools do not work on it, and how to hold some without letting it hijack your plan.",
    },
    { type: "h2", text: "What Bitcoin and Ethereum are" },
    {
      type: "p",
      text: "**Bitcoin** is a digital asset recorded on a shared public ledger (a blockchain) maintained by thousands of computers rather than a bank. There will only ever be 21 million bitcoins, and new ones are created on a fixed, slowing schedule. Its supporters see it as digital gold: scarce, portable, and outside any government's control. Its critics see a speculative token with no use beyond being traded.",
    },
    {
      type: "p",
      text: "**Ethereum** is a blockchain designed to run programs (smart contracts) as well as record balances. Its token, ether, pays for running those programs. It is more like a platform than a currency. Thousands of other coins exist; the overwhelming majority have gone or will go to zero.",
    },
    { type: "h2", text: "Why valuation tools do not apply" },
    {
      type: "p",
      text: "A company earns profit, so you can compute a [P/E](/learn/valuation). A bond pays interest. A property collects rent. Crypto produces no cash flow, so there is nothing to divide by. Its price is set entirely by what the next buyer will pay. That makes it a pure bet on future demand, which is not necessarily wrong, but it is a different kind of thing from owning businesses.",
    },
    {
      type: "table",
      headers: ["Feature", "World index fund", "Bitcoin"],
      rows: [
        ["Produces cash flow", "Yes (profits, dividends)", "No"],
        ["Can be valued by ratios", "Yes", "No"],
        ["Typical annual volatility", "15% to 20%", "60% to 100%"],
        ["Worst drawdown so far", "About −55% (2008)", "About −85% (2018)"],
        ["Bearings stance signals", "All apply", "Trend, dip, RSI, volatility only"],
      ],
      caption: "Same app, different animal. Bearings tracks BTC-USD and ETH-USD like any ticker but skips valuation signals.",
    },
    { type: "h2", text: "The volatility is the whole story" },
    {
      type: "example",
      title: "What 70% volatility means for $1,000",
      steps: [
        "Annual volatility about 70%. Monthly swing ≈ 70 ÷ √12 = 70 ÷ 3.46 ≈ 20%.",
        "On $1,000, a typical month moves about $200 up or down.",
        "In a bad year Bitcoin has fallen 75%: $1,000 becomes $250.",
        "To recover from −75% requires +300%. See [drawdowns](/learn/drawdowns).",
      ],
      result: "If $1,000 becoming $250 would change your life, $1,000 is too much. Size it so that a 75% fall is a shrug.",
    },
    {
      type: "widget",
      widget: "volatility",
      props: { vol: 70, amount: 1000 },
      caption: "Enter the amount you were thinking of putting into crypto. Look at the typical monthly swing and the bad-year outcome before deciding.",
    },
    { type: "h2", text: "Custody, scams and taxes" },
    {
      type: "p",
      text: "Buying crypto on an exchange means the exchange holds it for you. Exchanges have gone bankrupt and taken customer funds with them. Holding it in your own wallet means you hold the keys, and if you lose them, nobody can help. Both routes have real risks; choose a large regulated exchange or learn self-custody properly, and never keep more there than your sizing rule allows.",
    },
    {
      type: "p",
      text: "Crypto is the favourite tool of [scammers](/learn/scams-and-red-flags): fake exchanges, \"guaranteed yield\" schemes, romance scams ending in a crypto transfer, and influencers paid to pump coins they are quietly selling. If someone you did not seek out is telling you about a coin, that is the warning. Taxes vary by country; check the position in Georgia with the Revenue Service and keep records of every purchase. See [brokers and taxes](/learn/brokers-and-taxes).",
    },
    { type: "h2", text: "The long-term investor's crypto rules" },
    {
      type: "steps",
      title: "If you choose to hold some",
      steps: [
        { title: "Size: 0% to 5% of the portfolio in total", text: "Zero is a perfectly good number. Five is the ceiling. See [position sizing](/learn/position-sizing)." },
        { title: "Only money you can lose entirely", text: "Not the emergency fund, not next year's tuition. Money whose disappearance would not change a single decision in your life." },
        { title: "Stick to the two largest", text: "Bitcoin and Ethereum have survived multiple 70%+ crashes. Most other coins have not and will not." },
        { title: "Buy monthly, never lump sum", text: "With 20% monthly swings, [dollar-cost averaging](/learn/dollar-cost-averaging) matters even more than for stocks." },
        { title: "Never use leverage", text: "Borrowing to buy something that can fall 20% in a day is how accounts go to zero in an afternoon." },
        { title: "Rebalance when it balloons", text: "If a rally pushes crypto from 5% to 12% of your portfolio, sell back to 5%. Take the gift." },
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "Crypto is where FOMO lives",
      text: "Every crypto rally produces stories of people who got rich. It does not produce stories of the far larger number who bought the top and sold the bottom. If you feel the pull during a rally, reread [behavioural traps](/learn/behavioural-traps) and check the RSI. Above 80 is not your moment.",
    },
    {
      type: "terms",
      terms: [
        { term: "Blockchain", def: "A public ledger maintained by many computers instead of one institution." },
        { term: "Bitcoin", def: "The first and largest cryptocurrency, capped at 21 million units." },
        { term: "Ethereum", def: "A blockchain that runs programs; its token is ether." },
        { term: "Custody", def: "Who holds the asset: an exchange, or you via your own wallet keys." },
        { term: "Leverage", def: "Borrowing to buy more than you can afford. Multiplies gains and losses." },
        { term: "Satellite position", def: "A small, speculative slice outside the core of broad funds." },
      ],
    },
  ],
  quiz: [
    {
      q: "Why can Bearings not show a valuation signal for Bitcoin?",
      options: ["Bitcoin is too new", "Bitcoin produces no earnings or cash flow to measure against", "Exchanges do not publish prices", "Its P/E is always 21 million"],
      answer: 1,
      explain: "Valuation ratios divide price by something the asset produces. Crypto produces nothing to divide by, so price is purely supply and demand.",
    },
    {
      q: "Bitcoin has about 70% annual volatility. Roughly what is its typical monthly swing?",
      options: ["5%", "10%", "20%", "70%"],
      answer: 2,
      explain: "70 ÷ √12 ≈ 70 ÷ 3.46 ≈ 20%. A $1,000 position typically moves about $200 in a month.",
    },
    {
      q: "What is the maximum share of a long-term portfolio Bearings suggests for crypto in total?",
      options: ["0%", "5%", "25%", "50%"],
      answer: 1,
      explain: "Zero to 5% in total. Enough to participate if it works, small enough that a 75% fall is a shrug.",
    },
    {
      q: "Which of these is the single most dangerous thing to combine with crypto?",
      options: ["Monthly buying", "A regulated exchange", "Leverage (borrowed money)", "A five-year horizon"],
      answer: 2,
      explain: "Borrowed money plus 20% daily moves means a position can be wiped out entirely in hours. Never use leverage on volatile assets.",
    },
  ],
  takeaways: [
    "Crypto has no cash flow, so valuation tools do not work. Price is purely what the next buyer pays.",
    "Volatility of 60% to 100% means 20%+ monthly swings and 75%+ crashes are normal, not exceptional.",
    "Hold 0% to 5% at most, only money you can lose, only the two largest coins, bought monthly, never with leverage.",
    "Crypto is the natural home of FOMO and scams. If you did not seek it out, be suspicious.",
  ],
};
