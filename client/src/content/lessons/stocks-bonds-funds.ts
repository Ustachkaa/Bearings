import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "stocks-bonds-funds",
  module: "foundations",
  title: "The building blocks",
  subtitle: "Stocks, bonds, funds and cash, and how one ticker can hold 500 companies.",
  minutes: 9,
  blocks: [
    {
      type: "p",
      text: "Every portfolio in the world, from a student's first 50 USD to a pension fund worth billions, is built from a handful of parts. Once you know what each part does, the rest of investing is deciding how much of each to hold.",
    },
    { type: "h2", text: "The four basic parts" },
    {
      type: "terms",
      terms: [
        { term: "Stock", def: "Ownership in one company. Highest long-run growth, biggest swings." },
        { term: "Bond", def: "A loan you make to a government or company. They pay you interest and return the money on a set date. Steadier, lower return." },
        { term: "Fund", def: "A basket holding many stocks or bonds at once. You buy one unit of the basket and own a slice of everything inside." },
        { term: "Cash", def: "Money in a bank account or deposit. Safe and reachable, but slowly eroded by [inflation](/learn/inflation-and-cash)." },
      ],
    },
    {
      type: "p",
      text: "Stocks are the growth engine. Bonds are the shock absorber. Cash is the emergency exit. Funds are simply the convenient way to hold hundreds of stocks or bonds without buying them one by one.",
    },
    { type: "h2", text: "Stocks: owning companies" },
    {
      type: "p",
      text: "You met stocks in [the first lesson](/learn/what-is-investing). One extra idea matters here: a single company can fail. Even famous ones do. Owning one stock means your result depends entirely on that one story. That is why beginners should start with funds, and only later, if at all, add individual companies in small amounts.",
    },
    { type: "h2", text: "Bonds: lending money" },
    {
      type: "p",
      text: "When you buy a bond you become the lender. A government or company borrows, say, 1,000 USD from you, pays you a fixed interest (the *coupon*) each year, and gives the 1,000 USD back at the end (the *maturity*).",
    },
    {
      type: "example",
      title: "A 5-year bond",
      steps: [
        "You lend 1,000 USD by buying a bond with a 4% coupon and 5 years to maturity.",
        "Each year you receive 1,000 × 0.04 = 40 USD.",
        "Over 5 years that is 5 × 40 = 200 USD of interest.",
        "At the end you get your 1,000 USD back.",
      ],
      result: "Total received: 1,200 USD. Predictable, calm, and lower than stocks tend to deliver.",
    },
    {
      type: "p",
      text: "Bond prices do move, especially when interest rates change, but far less than stocks. In a portfolio their job is to make the bad years less bad, so you do not panic and sell your stocks at the bottom.",
    },
    { type: "h2", text: "Funds: the basket" },
    {
      type: "p",
      text: "A fund pools money from many investors and buys a list of assets. You own units of the fund, and each unit is a proportional slice of everything inside. Three kinds matter to you:",
    },
    {
      type: "list",
      items: [
        "**Index fund.** Holds every company in a published list (an *index*), like the 500 largest US companies. No manager picks; the fund simply copies the list. Very low fees.",
        "**ETF (exchange-traded fund).** A fund that trades on a stock exchange like a share. Most beginner-friendly index funds are ETFs. You buy them through a broker in seconds.",
        "**Mutual fund.** A fund bought directly from the fund company, priced once a day. Often actively managed, which usually means higher fees. Less relevant for someone investing from Georgia.",
      ],
    },
    {
      type: "example",
      title: "One share of an S&P 500 ETF",
      steps: [
        "The ETF holds shares in 500 companies, weighted by size.",
        "Apple might be about 7% of the fund, Microsoft about 6%, and the smallest company about 0.01%.",
        "You buy one unit for 500 USD.",
        "Roughly 35 USD of your 500 is Apple (500 × 0.07), 30 USD is Microsoft (500 × 0.06), and the rest is spread across the other 498.",
      ],
      result: "With a single purchase you own a slice of 500 businesses. If one goes bankrupt, you lose a fraction of a percent, not everything.",
    },
    {
      type: "callout",
      tone: "key",
      title: "Why this matters so much",
      text: "A fund turns the hardest question in investing (\"which company will win?\") into an easy one (\"do I believe the economy as a whole will be bigger in 20 years?\"). For most people, most of the time, the answer to the second question is yes, and that is enough. See [index funds](/learn/index-funds).",
    },
    { type: "h2", text: "Tickers and exchanges" },
    {
      type: "p",
      text: "Every stock and ETF has a short code called a **ticker**. Apple is `AAPL`, Microsoft is `MSFT`. The same fund can have different tickers on different exchanges: Vanguard's all-world ETF is `VWCE` on Xetra in Frankfurt and `VWRA` in London. Exchanges are simply the marketplaces where the trading happens: the New York Stock Exchange and Nasdaq in the US, Xetra in Frankfurt, the London Stock Exchange, Euronext in Amsterdam and Paris.",
    },
    {
      type: "p",
      text: "In Bearings you type a ticker into [Explore](/explore) to see its price, history and signals. For European listings add the exchange suffix Yahoo uses: `VWCE.DE` for Frankfurt, `VWRA.L` for London, `IWDA.AS` for Amsterdam. Crypto uses pairs like `BTC-USD`.",
    },
    { type: "h2", text: "Putting the parts together" },
    {
      type: "p",
      text: "The mix of stocks, bonds and cash you hold is called your **asset allocation**, and it is the single biggest decision in your investing life. Young, long-horizon investors usually lean heavily toward stocks because they have decades to ride out the swings. The next few lessons explain why, and the [diversification lesson](/learn/diversification) helps you choose your own mix.",
    },
    {
      type: "widget",
      widget: "allocation",
      props: { stocks: 80, bonds: 15, cash: 5 },
      caption: "Drag the sliders. Watch how adding bonds lowers both the expected return and the size of the worst year.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "A perfectly good first portfolio",
      text: "One global stock ETF, bought every month, plus a cash emergency fund in the bank. Many experienced investors never need anything more complicated.",
    },
  ],
  quiz: [
    {
      q: "What is a bond?",
      options: [
        "Ownership in a company",
        "A loan you make to a government or company in exchange for interest",
        "A basket of many stocks",
        "A type of bank account",
      ],
      answer: 1,
      explain: "A bond makes you the lender. You receive interest and your money back at maturity.",
    },
    {
      q: "You buy one unit of an S&P 500 ETF. How many companies do you now own a slice of?",
      options: ["1", "50", "About 500", "Every company in the world"],
      answer: 2,
      explain: "The fund holds the roughly 500 companies in the index, and your unit is a proportional slice of all of them.",
    },
    {
      q: "What is the main job of bonds in a long-term portfolio?",
      options: [
        "To deliver the highest possible growth",
        "To make bad years less bad so you do not panic-sell",
        "To replace the emergency fund",
        "To pay for trading fees",
      ],
      answer: 1,
      explain: "Bonds swing far less than stocks and cushion the portfolio during stock market falls.",
    },
    {
      q: "Which is the Yahoo-style ticker for Vanguard's all-world ETF listed in Frankfurt?",
      options: ["VWCE.DE", "VWCE.L", "VWCE-USD", "^VWCE"],
      answer: 0,
      explain: "The .DE suffix marks the Frankfurt (Xetra) listing. .L is London, -USD is used for crypto pairs and ^ marks indexes.",
    },
  ],
  takeaways: [
    "Stocks grow, bonds steady, cash rescues, funds bundle.",
    "One ETF can hold hundreds of companies, which removes the risk of a single company sinking you.",
    "Asset allocation, the mix of stocks, bonds and cash, is your most important decision.",
    "A single global stock ETF plus an emergency fund is a legitimate, complete plan.",
  ],
};
