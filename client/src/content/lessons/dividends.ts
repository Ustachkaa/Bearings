import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "dividends",
  module: "numbers",
  title: "Dividends: getting paid to wait",
  subtitle: "Some of your return arrives as cash. Learn what yield means and why a very high one can be a warning.",
  minutes: 8,
  blocks: [
    {
      type: "p",
      text: "When you own a share, you own a slice of the company's profit. Companies can do two things with that profit: keep it to grow the business, or hand some of it to shareholders as cash. That cash payment is a **dividend**. It usually arrives every three months, straight into your brokerage account, whether the share price went up or down that quarter.",
    },
    { type: "h2", text: "Yield: the dividend as a percentage" },
    {
      type: "p",
      text: "**Dividend yield** is the yearly dividend divided by the current share price. It lets you compare the cash you receive with what you paid, the same way an interest rate describes a savings account.",
    },
    {
      type: "example",
      title: "Calculating a yield",
      steps: [
        "A company pays $0.75 per share every quarter.",
        "Yearly dividend = 0.75 × 4 = $3.00 per share.",
        "The share price is $100.",
        "Yield = 3 ÷ 100 = 0.03, which is 3%.",
        "If you own 200 shares worth $20,000, you receive 200 × 3 = $600 a year in cash.",
      ],
      result: "A 3% yield means every $100 invested pays you about $3 a year while you hold it.",
    },
    {
      type: "p",
      text: "Notice that yield moves in the opposite direction to price. If the share falls to $75 and the dividend stays at $3, the yield rises to 3 ÷ 75 = 4%. That sounds better, but the reason the price fell may be that investors doubt the $3 will keep coming.",
    },
    { type: "h2", text: "Dates and payout ratio" },
    {
      type: "p",
      text: "To receive a dividend you must own the share before the **ex-dividend date**; on that morning the price drops by roughly the dividend amount because the cash is now owed to existing holders, not new buyers. This is why a chart's [adjusted close](/learn/reading-a-chart) matters.",
    },
    {
      type: "p",
      text: "The **payout ratio** is the share of profit paid out as dividends. A company earning $6 per share and paying $3 has a payout ratio of 50%. Under about 60% leaves room to keep paying through a bad year. Over 100% means the company is paying out more than it earns, which cannot last.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "When a high yield is a red flag",
      text: "If a stock yields 9% while similar companies yield 3%, the market is usually saying the dividend will be cut. The price has fallen because investors expect less cash, not because someone left a bargain lying around. Bearings flags yields above about 6% as a caution for exactly this reason.",
    },
    { type: "h2", text: "Reinvesting: the quiet engine" },
    {
      type: "p",
      text: "You can spend dividends or use them to buy more shares. Reinvesting is where [compounding](/learn/compounding) does its work: the new shares pay their own dividends, which buy more shares, and so on. Many brokers offer an automatic **dividend reinvestment plan** (DRIP). Over long periods, reinvested dividends have made up a large part of total stock market returns.",
    },
    {
      type: "example",
      title: "Reinvesting for 20 years",
      steps: [
        "Start with $10,000 in a fund yielding 3%, with the dividend growing 5% a year and no price change at all.",
        "Year 1 dividend: 10,000 × 0.03 = $300, reinvested.",
        "Year 2 you now hold $10,300 and the payout per unit has grown 5%, so the yield on your original cost is now 3.15%.",
        "Repeating this for 20 years turns the $10,000 into roughly $22,000 purely from reinvested and growing dividends.",
      ],
      result: "Even with a flat share price, reinvested dividends more than doubled the holding over 20 years. Try the widget below to see the exact path.",
    },
    { type: "h2", text: "Accumulating funds do it for you" },
    {
      type: "p",
      text: "Many European [index funds](/learn/index-funds) come in two versions. **Distributing** funds pay dividends to your account. **Accumulating** funds (often marked \"Acc\" or with a C in the ticker, for example VWCE) reinvest them inside the fund automatically. For a long-term investor in [Georgia](/learn/global-investing), accumulating funds are simpler: nothing to reinvest by hand, and fewer small taxable events to track. See [brokers and taxes](/learn/brokers-and-taxes).",
    },
    {
      type: "widget",
      widget: "dividend",
      props: { amount: 10000, yieldPct: 3, growth: 5, years: 20 },
      caption: "Compare taking the cash with reinvesting it. Then set dividend growth to 0% and see how much of the result came from growth.",
    },
    {
      type: "terms",
      terms: [
        { term: "Dividend", def: "Cash a company pays to shareholders out of its profit." },
        { term: "Dividend yield", def: "Yearly dividend divided by current price, as a percentage." },
        { term: "Ex-dividend date", def: "The first day a buyer no longer receives the upcoming dividend." },
        { term: "Payout ratio", def: "The share of profit paid out as dividends." },
        { term: "DRIP", def: "Dividend reinvestment plan: dividends automatically buy more shares." },
        { term: "Accumulating fund", def: "A fund that reinvests dividends internally instead of paying them out." },
      ],
    },
    {
      type: "callout",
      tone: "key",
      title: "Dividends are part of the return, not a bonus",
      text: "A stock that rises 5% and pays 3% returned 8%. A stock that rises 8% and pays nothing also returned 8%. Do not chase yield for its own sake; judge the total.",
    },
  ],
  quiz: [
    {
      q: "A share costs $80 and pays $0.60 every quarter. What is its dividend yield?",
      options: ["0.75%", "3%", "7.5%", "12%"],
      answer: 1,
      explain: "Yearly dividend = 0.60 × 4 = $2.40. Yield = 2.40 ÷ 80 = 0.03 = 3%.",
    },
    {
      q: "A company earns $4 per share and pays $5 per share in dividends. What is its payout ratio, and what does it suggest?",
      options: ["80%, comfortably sustainable", "125%, paying out more than it earns", "20%, very conservative", "500%, a bargain"],
      answer: 1,
      explain: "5 ÷ 4 = 1.25, or 125%. Paying more than you earn cannot continue for long.",
    },
    {
      q: "A stock's yield jumps from 3% to 9% in six months while the dividend is unchanged. The most likely explanation is…",
      options: ["The company tripled its dividend", "The share price fell sharply and investors fear a cut", "The company was bought out", "Yield always rises over time"],
      answer: 1,
      explain: "With the dividend unchanged, the only way yield triples is a price collapse. Markets usually price in an expected cut.",
    },
    {
      q: "What does an accumulating ETF do with the dividends its companies pay?",
      options: ["Pays them to you monthly", "Reinvests them inside the fund automatically", "Donates them", "Holds them as cash forever"],
      answer: 1,
      explain: "Accumulating funds reinvest dividends internally, so the fund's price includes them and you have nothing to do.",
    },
  ],
  takeaways: [
    "Dividend yield = yearly dividend ÷ price. A 3% yield pays about $3 a year for every $100 invested.",
    "A yield far above its peers usually signals an expected cut, not a bargain.",
    "Reinvested dividends are a major source of long-term returns. Automate it.",
    "Accumulating funds reinvest for you, which is simpler for a long-term investor.",
  ],
};
