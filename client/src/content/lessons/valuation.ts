import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "valuation",
  module: "numbers",
  title: "Valuation: what am I paying for?",
  subtitle: "Price tells you nothing on its own. Ratios tell you what you get for it.",
  minutes: 10,
  blocks: [
    {
      type: "p",
      text: "Imagine two bakeries for sale. One costs $100,000 and earns $10,000 a year. The other costs $100,000 and earns $2,000 a year. Same price, very different deals. Stocks work the same way, and **valuation** is simply the habit of asking: how much profit do I get for the price I pay?",
    },
    { type: "h2", text: "Market cap: the real price tag" },
    {
      type: "p",
      text: "A share price of $150 does not tell you what the whole company costs. For that you need **market capitalisation** (market cap): the share price multiplied by the number of shares that exist. A company with 1 billion shares at $150 has a market cap of $150 billion. That is the price tag for the entire business.",
    },
    {
      type: "p",
      text: "This is why a $3 stock is not automatically cheap and a $3,000 stock is not automatically expensive. A company could split its shares ten-for-one tomorrow, the price would become a tenth, and nothing about the business would change.",
    },
    { type: "h2", text: "Earnings per share and the P/E ratio" },
    {
      type: "p",
      text: "**Earnings per share** (EPS) is the company's yearly profit divided by its number of shares. It is your slice of the profit for each share you own. The **price-to-earnings ratio** (P/E) divides the share price by EPS. It answers: how many years of current profit would it take to pay back the price?",
    },
    {
      type: "example",
      title: "Working out a P/E",
      steps: [
        "The share price is $150.",
        "The company earned $6 per share over the last twelve months.",
        "P/E = 150 ÷ 6 = 25.",
        "Flip it around: 6 ÷ 150 = 0.04, so each share earns 4% of its price in profit each year.",
      ],
      result: "You pay $25 for every $1 of yearly profit. If profits never grew, it would take 25 years of earnings to pay back the price.",
    },
    {
      type: "p",
      text: "A high P/E is not automatically bad. Investors pay more for profits they expect to **grow**. If that $6 becomes $12 in five years, today's P/E of 25 becomes a P/E of 12.5 on those future earnings. A low P/E is not automatically good: sometimes the market expects profits to shrink, and it is right.",
    },
    {
      type: "table",
      headers: ["Trailing P/E", "Rough reading", "Question to ask"],
      rows: [
        ["Under 12", "Cheap, or troubled", "Why is the market so pessimistic?"],
        ["12 to 20", "Reasonable, near long-run averages", "Is the business stable?"],
        ["20 to 35", "Growth premium", "Is the growth actually arriving?"],
        ["Over 35", "Priced for perfection", "What happens if it stumbles?"],
        ["None (negative EPS)", "Not profitable", "Is this a bet on a future that has not come?"],
      ],
      caption: "These are the bands the Bearings signals use. They are rules of thumb, not laws.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Cheap can get cheaper",
      text: "A P/E of 8 looks like a bargain until profits halve and the P/E becomes 16 without the price moving. Low ratios on a shrinking business are called a value trap. Always ask why something is cheap before celebrating.",
    },
    { type: "h2", text: "Trailing versus forward" },
    {
      type: "p",
      text: "**Trailing P/E** uses the last twelve months of actual profit. **Forward P/E** uses analysts' estimates of next year's profit. Forward is usually lower for growing companies and it is also a guess. When the two differ a lot, the market is betting heavily on change. Bearings shows both when available.",
    },
    { type: "h2", text: "Price to book" },
    {
      type: "p",
      text: "**Book value** is what the company owns minus what it owes, according to its accounts. **Price-to-book** (P/B) compares the market cap to that figure. A P/B of 1 means you pay exactly what the assets are worth on paper. Banks and industrial firms are often judged this way. For software companies whose value is in code and brands, book value misses most of the picture, so P/B matters less.",
    },
    { type: "h2", text: "Where these ratios do not apply" },
    {
      type: "p",
      text: "An [index fund](/learn/index-funds) holds hundreds of companies, so its \"P/E\" is a blended average of all of them. It tells you whether the whole market is expensive or cheap compared with history, which is useful context, but you cannot judge a fund the way you judge one bakery. The main number to check on a fund is its [fee](/learn/fees).",
    },
    {
      type: "p",
      text: "[Crypto](/learn/crypto) has no earnings, no book value and no dividends, so there is nothing to divide by. Its price is set entirely by what the next buyer will pay. That is not a criticism; it is the reason the tools in this lesson simply do not work there.",
    },
    {
      type: "widget",
      widget: "pe",
      props: { price: 150, eps: 6 },
      caption: "Drag the price and the earnings. Watch how the P/E and the payback years move, and notice what happens when earnings turn negative.",
    },
    {
      type: "terms",
      terms: [
        { term: "Market cap", def: "Share price times number of shares: the price of the whole company." },
        { term: "EPS", def: "Earnings per share: yearly profit divided by shares outstanding." },
        { term: "P/E ratio", def: "Price divided by EPS: years of current profit needed to repay the price." },
        { term: "Forward P/E", def: "P/E using estimated next-year earnings instead of last year's." },
        { term: "P/B ratio", def: "Market cap divided by book value (assets minus debts)." },
        { term: "Value trap", def: "Something that looks cheap because its business is shrinking." },
      ],
    },
    {
      type: "callout",
      tone: "key",
      title: "The one habit",
      text: "Before buying any single company, write down its P/E and one sentence explaining why that number is fair. If you cannot write the sentence, you are not buying a business, you are buying a ticker symbol. See [how to think](/learn/how-to-think).",
    },
  ],
  quiz: [
    {
      q: "A company has 500 million shares trading at $40. What is its market cap?",
      options: ["$40 million", "$500 million", "$20 billion", "$2 billion"],
      answer: 2,
      explain: "500,000,000 × $40 = $20,000,000,000, or $20 billion.",
    },
    {
      q: "A share costs $90 and earned $3 per share last year. What is its trailing P/E?",
      options: ["27", "30", "3", "0.033"],
      answer: 1,
      explain: "P/E = 90 ÷ 3 = 30. You pay $30 for every $1 of yearly profit.",
    },
    {
      q: "Why might a company with a P/E of 40 still be a sensible purchase?",
      options: [
        "Because high P/E always means high quality",
        "Because investors expect profits to grow fast enough to justify the price",
        "Because P/E does not matter for stocks",
        "Because a P/E above 35 is the safest range",
      ],
      answer: 1,
      explain: "A high P/E is a bet on growth. If earnings double, the effective P/E halves. The risk is that the growth does not arrive.",
    },
    {
      q: "Why can you not calculate a meaningful P/E for Bitcoin?",
      options: ["Its price is too high", "It has no earnings to divide by", "Exchanges hide the data", "Its P/E is always exactly 1"],
      answer: 1,
      explain: "P/E needs profit. Crypto produces no earnings, dividends or book value, so the ratio simply does not exist.",
    },
  ],
  takeaways: [
    "Share price alone means nothing. Market cap is the real price tag for the whole business.",
    "P/E = price ÷ earnings per share. It is the number of years of current profit needed to repay the price.",
    "High P/E is a bet on growth; low P/E can be a bargain or a trap. Always ask why.",
    "These ratios are for single companies. Judge funds by fees and diversification, and remember crypto has nothing to divide by.",
  ],
};
