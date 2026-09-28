import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "diversification",
  module: "plan",
  title: "Diversification and your mix",
  subtitle: "Spreading risk across companies, countries and asset types, then keeping the mix on course.",
  minutes: 9,
  blocks: [
    {
      type: "p",
      text: "\"Don't put all your eggs in one basket\" is the oldest advice in investing, and also the most misunderstood. Owning ten technology stocks is ten eggs in one basket. Owning one all-world fund is thousands of eggs in hundreds of baskets. Diversification is about how *different* your holdings are, not how many lines are on your statement.",
    },
    { type: "h2", text: "Four layers of spreading" },
    {
      type: "list",
      items: [
        "**Across companies.** One company can fail. Five hundred cannot all fail at once. This layer is handled the moment you buy a broad index fund.",
        "**Across sectors.** Banks, energy, technology, healthcare and consumer goods thrive and suffer at different times. A broad index holds them all.",
        "**Across countries.** The US is about 60% of the world's stock market value, but Japan, Europe, and emerging economies move differently. An all-world fund covers them; an S&P 500 fund does not.",
        "**Across asset types.** Stocks, bonds and cash respond differently to the same news. This is the layer you control with your allocation.",
      ],
    },
    { type: "h2", text: "Correlation, in plain words" },
    {
      type: "p",
      text: "Two things are **correlated** when they tend to move together. Two airline stocks are highly correlated: fuel prices, a pandemic or a recession hit both. An airline and a government bond are weakly correlated, and in a crisis often move in opposite directions, because frightened investors sell stocks and buy bonds.",
    },
    {
      type: "p",
      text: "Mixing assets with low correlation is what smooths the ride. You give up a little of the top-end return and remove a lot of the bottom-end pain. Since the bottom-end pain is what makes people sell at the worst moment, this trade is usually worth it.",
    },
    {
      type: "example",
      title: "A bad year, two portfolios",
      steps: [
        "Portfolio A: 100% global stocks. In a crisis year stocks fall 35%. A is down 35%.",
        "Portfolio B: 70% global stocks, 30% government bonds. Stocks fall 35%, bonds rise 5%.",
        "B's stock part: 70 × (1 − 0.35) = 45.5. B's bond part: 30 × 1.05 = 31.5. Total: 45.5 + 31.5 = 77.",
        "B is down 23% instead of 35%.",
        "In a normal year, with stocks up 10% and bonds up 3%: A is up 10%; B is up 0.7 × 10 + 0.3 × 3 = 7.9%.",
      ],
      result: "B gives up about 2 points in a good year and saves about 12 points in a terrible one. Whether that trade suits you depends on your horizon and stomach, which the risk lesson helped you measure.",
    },
    { type: "h2", text: "Choosing your mix" },
    {
      type: "p",
      text: "Your **asset allocation** is the share of stocks, bonds and cash you hold. It should follow from your [time horizon and risk tolerance](/learn/risk-and-return), not from what feels exciting this month. Some common starting points:",
    },
    {
      type: "table",
      headers: ["Profile", "Stocks", "Bonds", "Typical worst year", "Long-run average (rough)"],
      rows: [
        ["Aggressive: 15+ years, calm temperament", "90 to 100%", "0 to 10%", "about −35% to −40%", "about 7%"],
        ["Balanced: 7 to 15 years, or nervous", "60 to 80%", "20 to 40%", "about −20% to −28%", "about 5.5 to 6.5%"],
        ["Cautious: under 7 years", "30 to 50%", "50 to 70%", "about −10% to −15%", "about 4 to 5%"],
      ],
      caption: "Historical ranges used for planning, not guarantees. Bonds have had bad years too.",
    },
    {
      type: "widget",
      widget: "allocation",
      props: { stocks: 60, bonds: 30, cash: 10 },
      caption: "Find the mix where the worst-year number is one you could see on your screen and still keep buying. That is your allocation.",
    },
    {
      type: "callout",
      tone: "note",
      title: "A young investor's usual answer",
      text: "Someone in their twenties or thirties investing for retirement can reasonably hold 90 to 100% in a global stock fund, because the horizon is measured in decades and the emergency fund handles short-term shocks. Bonds become more important as the goal date approaches.",
    },
    { type: "h2", text: "Individual stocks: the 5% rule" },
    {
      type: "p",
      text: "If you decide to own individual companies alongside your funds, a widely used rule of thumb is to keep any single stock under about **5% of your total portfolio**. At 5%, a company going to zero costs you 5%, painful but survivable. At 40%, it changes your life. The [position sizing lesson](/learn/position-sizing) turns this into a method.",
    },
    { type: "h2", text: "Home bias" },
    {
      type: "p",
      text: "People everywhere overweight their own country's stocks because they feel familiar. For a Georgian investor this matters differently: the local market is tiny, so the temptation is usually to overweight the US instead, because that is what the news covers. An all-world fund settles the question by holding countries at their actual market weight. The [global investing lesson](/learn/global-investing) covers currency too.",
    },
    { type: "h2", text: "Rebalancing: keeping the mix on course" },
    {
      type: "p",
      text: "If stocks have a great year, your 70/30 portfolio drifts to 78/22 without you doing anything. **Rebalancing** means selling a little of what grew and buying what lagged, to return to the mix you chose. It quietly forces you to sell high and buy low.",
    },
    {
      type: "steps",
      title: "Rebalance once a year",
      steps: [
        { title: "Pick a date", text: "Your birthday, or the first weekend of January. Not a market event." },
        { title: "Compare actual to target", text: "If you are within about 5 points of your target mix, do nothing." },
        { title: "Adjust with new money first", text: "Direct your monthly contributions to the lagging part until the mix is restored. This avoids selling and any tax it may trigger." },
        { title: "Sell only if needed", text: "For big drifts, sell some of the overweight part and buy the underweight part." },
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "The simplest version",
      text: "One all-world stock ETF plus, if you want bonds, one global government bond ETF. Two lines. Rebalance once a year. Everything else is optional.",
    },
    {
      type: "terms",
      terms: [
        { term: "Diversification", def: "Holding assets that do not all move together, so no single event can sink you." },
        { term: "Correlation", def: "How much two assets tend to move together. Low correlation smooths a portfolio." },
        { term: "Asset allocation", def: "Your chosen split between stocks, bonds and cash." },
        { term: "Rebalancing", def: "Restoring your target mix after market moves have shifted it." },
        { term: "Home bias", def: "Overweighting familiar, local investments at the expense of global diversification." },
      ],
    },
  ],
  quiz: [
    {
      q: "Which portfolio is more diversified?",
      options: [
        "Ten different technology stocks",
        "One all-world index fund",
        "Three airline stocks and two oil companies",
        "One company you know very well",
      ],
      answer: 1,
      explain: "Diversification is about how different the holdings are. One all-world fund spans thousands of companies across every sector and country.",
    },
    {
      q: "A 70% stock / 30% bond portfolio in a year when stocks fall 35% and bonds rise 5%. Roughly how much is it down?",
      options: ["About −35%", "About −30%", "About −23%", "About −5%"],
      answer: 2,
      explain: "70 × 0.65 = 45.5 and 30 × 1.05 = 31.5, total 77, a fall of about 23%.",
    },
    {
      q: "What is the common rule of thumb for the maximum size of any single stock in a beginner's portfolio?",
      options: ["About 5%", "About 25%", "About 50%", "There is no limit"],
      answer: 0,
      explain: "Keeping each single company under about 5% means one failure costs 5%, not your future.",
    },
    {
      q: "Your target is 70/30 but a strong year has pushed it to 80/20. What is the simplest first step?",
      options: [
        "Sell all your stocks",
        "Direct new monthly contributions to bonds until the mix is restored",
        "Move everything to cash",
        "Do nothing, forever",
      ],
      answer: 1,
      explain: "Using new money to restore the mix avoids selling and any taxes it might trigger. Sell only if the drift is large.",
    },
  ],
  takeaways: [
    "Diversify across companies, sectors, countries and asset types. Count differences, not lines.",
    "Mixing low-correlation assets trades a little upside for a lot less downside.",
    "Choose your allocation from horizon and temperament, and keep any single stock under about 5%.",
    "Rebalance once a year on a fixed date, using new contributions first.",
  ],
};
