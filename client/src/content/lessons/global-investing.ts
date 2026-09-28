import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "global-investing",
  module: "mindset",
  title: "Investing globally from Georgia",
  subtitle: "You earn in lari, you will invest in dollars and euros, and you will own companies from forty countries. Here is how the currencies fit together.",
  minutes: 10,
  blocks: [
    {
      type: "p",
      text: "The Georgian stock market is small, so a Georgian investor naturally looks abroad. That is a strength: you get the whole world. It also means dealing with several currencies and several exchanges at once. This lesson untangles them so the choices become simple.",
    },
    { type: "h2", text: "US listings versus European listings" },
    {
      type: "p",
      text: "The same company or the same index can be bought in different places. Apple trades in New York as AAPL. A fund tracking the S&P 500 trades in New York as VOO or SPY, and also in London as CSPX or in Frankfurt as VUAA. The underlying holdings are the same American companies; what differs is where the fund is domiciled, which currency it trades in, and how dividends and taxes are handled.",
    },
    {
      type: "p",
      text: "For most investors outside the United States, US-domiciled funds carry a heavy withholding tax on dividends and complicated estate rules. **UCITS** funds, a European regulatory standard, are built for international investors. The most popular are domiciled in Ireland, which has favourable tax treaties, and come in **accumulating** versions that reinvest [dividends](/learn/dividends) automatically. For a Georgian investor these are usually the practical route. See [brokers and taxes](/learn/brokers-and-taxes) for the account side.",
    },
    {
      type: "table",
      headers: ["Exchange", "Suffix in Bearings", "Currency", "Example ticker"],
      rows: [
        ["Xetra (Frankfurt)", ".DE", "EUR", "VWCE.DE (world fund, accumulating)"],
        ["London Stock Exchange", ".L", "USD or GBP", "CSPX.L (S&P 500, accumulating)"],
        ["Euronext Amsterdam", ".AS", "EUR", "IWDA.AS (developed world)"],
        ["New York / Nasdaq", "none", "USD", "AAPL, VOO"],
      ],
      caption: "Type these exactly as shown into Explore. The suffix tells the data source which exchange you mean.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "One fund can be enough",
      text: "A single accumulating all-world UCITS ETF such as VWCE holds roughly 3,500 companies across developed and emerging markets for about 0.22% a year. Many careful investors hold only this plus cash. Complexity is not a requirement.",
    },
    { type: "h2", text: "Currency risk in three layers" },
    {
      type: "p",
      text: "Your money passes through three currency layers, and it helps to see them separately.",
    },
    {
      type: "steps",
      title: "Where the currencies sit",
      steps: [
        { title: "Layer 1: your salary in GEL", text: "You earn lari and must convert to dollars or euros to invest. The rate on the day you convert is the rate you get." },
        { title: "Layer 2: the fund's trading currency", text: "VWCE trades in euros, CSPX in dollars. This is mostly cosmetic: it is the currency the price is quoted in, not what you own." },
        { title: "Layer 3: the underlying companies", text: "A world fund owns companies earning in dollars, euros, yen, pounds and dozens of other currencies. This is the exposure that actually matters." },
      ],
    },
    {
      type: "p",
      text: "Layer 3 is the good news. A world fund already spreads you across most of the world's currencies. You do not need to choose between dollar and euro exposure; you own both, plus everything else, in proportion to the world economy.",
    },
    { type: "h2", text: "What the lari does to your numbers" },
    {
      type: "example",
      title: "The same fund, two exchange rates",
      steps: [
        "You invest $1,000 when the rate is 2.70 GEL per dollar, so it cost you 2,700 GEL.",
        "A year later the fund is still worth exactly $1,000.",
        "If the lari strengthened to 2.50 per dollar, your $1,000 is now worth 2,500 GEL: down 200 GEL in lari terms with no change in dollars.",
        "If the lari weakened to 3.00 per dollar, the same $1,000 is worth 3,000 GEL: up 300 GEL in lari terms.",
      ],
      result: "Currency moves add a second layer of ups and downs when you look at things in GEL. Over decades these swings have tended to wash out, and holding foreign assets is itself a hedge against your home currency weakening.",
    },
    {
      type: "widget",
      widget: "currency",
      props: { amount: 1000, from: "USD", to: "GEL" },
      caption: "Move the exchange rate up and down and watch what a fixed dollar amount looks like in lari. This is why your GEL balance can fall on a day the fund rose.",
    },
    { type: "h2", text: "Should you hedge?" },
    {
      type: "p",
      text: "Some funds are **currency hedged**: they use contracts to cancel out exchange-rate moves against a chosen currency. Hedged funds cost more, and hedging to a currency you do not spend in (nobody hedges to GEL) solves the wrong problem. For a horizon of ten years or more, unhedged world funds are the standard choice. Accept the currency noise as part of the ride, alongside the [volatility](/learn/volatility) you already accept.",
    },
    {
      type: "callout",
      tone: "note",
      title: "Think in the currency you will spend",
      text: "If you plan to retire in Georgia, your goal is in lari. If you might live abroad, it is in dollars or euros. Owning global assets in hard currencies is a reasonable default either way, and it removes the single-country risk that a purely Georgian saver carries without noticing.",
    },
    { type: "h2", text: "Practical notes" },
    {
      type: "list",
      items: [
        "Convert GEL in reasonable batches; each conversion has a spread, so many tiny conversions cost more than a monthly one.",
        "European exchanges close when it is evening in Tbilisi; US markets open at 17:30 Tbilisi time. Bearings checks prices on its own schedule, so you do not need to watch.",
        "Fund names encode a lot: \"Acc\" means accumulating, \"Dist\" means it pays dividends out, \"UCITS\" means the European standard, \"(EUR)\" is only the trading currency.",
        "Add your chosen fund to the [watchlist](/watchlist) with its exact suffix, then set a dip alert. The exchange does not change the maths.",
      ],
    },
    {
      type: "terms",
      terms: [
        { term: "UCITS", def: "A European fund standard designed for international investors; the usual choice outside the US." },
        { term: "Domicile", def: "The country a fund is legally based in. Ireland is common for tax-treaty reasons." },
        { term: "Ticker suffix", def: "The exchange code after a dot, such as .DE or .L, that identifies where a listing trades." },
        { term: "Currency risk", def: "Changes in your holding's value caused by exchange rates rather than the asset itself." },
        { term: "Hedged fund", def: "A fund that uses contracts to remove currency moves against a chosen currency." },
      ],
    },
  ],
  quiz: [
    {
      q: "You hold $1,000 of a fund. The dollar goes from 2.70 to 2.50 lari with no change in the fund's dollar value. In lari terms you…",
      options: ["Gained 200 GEL", "Lost 200 GEL", "Gained 300 GEL", "Are unchanged"],
      answer: 1,
      explain: "2,700 GEL became 2,500 GEL: a 200 GEL fall caused purely by the lari strengthening.",
    },
    {
      q: "Why are Irish-domiciled UCITS funds the usual choice for investors outside the US?",
      options: ["They are always cheaper", "They avoid heavy US dividend withholding and estate complications", "They only hold Irish companies", "They are hedged to GEL"],
      answer: 1,
      explain: "UCITS funds are built for international investors, and Ireland's tax treaties make them efficient. The holdings are global.",
    },
    {
      q: "A world index fund quoted in euros on Xetra mainly exposes you to…",
      options: ["The euro only", "The currencies of the thousands of companies it holds", "The Georgian lari", "No currency at all"],
      answer: 1,
      explain: "The quote currency is cosmetic. Real exposure comes from where the underlying companies earn, which for a world fund is most of the planet.",
    },
    {
      q: "How would you type the accumulating world ETF traded in Frankfurt into Bearings?",
      options: ["VWCE", "VWCE.L", "VWCE.DE", "VWCE.AS"],
      answer: 2,
      explain: ".DE is the Xetra (Frankfurt) suffix. The suffix tells the data source which listing you mean.",
    },
  ],
  takeaways: [
    "For a Georgian investor, Irish-domiciled accumulating UCITS ETFs on European exchanges are the practical route to owning the world.",
    "Type the exchange suffix: VWCE.DE, CSPX.L, IWDA.AS. The suffix is part of the ticker.",
    "Currency exposure comes from the companies inside the fund, not the quote currency. A world fund is already currency-diversified.",
    "GEL swings add noise to your numbers. Over long horizons, unhedged global assets are the standard choice.",
  ],
};
