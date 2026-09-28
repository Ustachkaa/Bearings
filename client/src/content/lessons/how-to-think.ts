import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "how-to-think",
  module: "mindset",
  title: "How to think like an investor",
  subtitle: "A thesis, a checklist, a size decided in advance, and a rule for when to sell. Everything else is noise.",
  minutes: 10,
  blocks: [
    {
      type: "p",
      text: "Most beginners think investing is about finding the right thing to buy. It is mostly about having a process that stops you doing stupid things when you are excited or scared. This lesson gives you that process in four parts. The [signals](/learn/using-bearings) in this app are built to support it, not replace it.",
    },
    { type: "h2", text: "1. Write the thesis first" },
    {
      type: "p",
      text: "Before you buy anything, write one sentence that explains why it will be worth more in ten years. Not why the price will go up next month. Why the **thing itself** will be worth more. For a world index fund the sentence is easy: \"The world economy grows over decades, and this owns a slice of almost all of it for a tiny fee.\" For a single company it is harder, and if you cannot write it, that is your answer.",
    },
    {
      type: "callout",
      tone: "key",
      title: "The thesis test",
      text: "If your sentence contains the words \"everyone is buying\", \"it has been going up\" or \"I have a feeling\", it is not a thesis. It is a mood. See [behavioural traps](/learn/behavioural-traps).",
    },
    { type: "h2", text: "2. Run the checklist" },
    {
      type: "p",
      text: "The Explore page in Bearings shows a checklist for every asset. It is the same list a careful investor runs in their head. Learn to run it yourself:",
    },
    {
      type: "steps",
      title: "The pre-purchase checklist",
      steps: [
        { title: "Diversified?", text: "Is this a fund holding hundreds of companies, or one company? One company means a small position at most. [Diversification](/learn/diversification)." },
        { title: "Trend intact?", text: "Is the price above its 200-day average? If not, for a single company, do you know why? [Moving averages](/learn/moving-averages)." },
        { title: "Not stretched?", text: "Is the price less than 15% above that average? Far above means optimism is already priced in." },
        { title: "Profitable?", text: "For a company: does it actually earn money? Negative earnings are a bet on a future that has not arrived. [Valuation](/learn/valuation)." },
        { title: "Reasonable price?", text: "Is the P/E under about 30, and can you explain why that number is fair?" },
        { title: "Low cost?", text: "For a fund: is the yearly fee under 0.5%, ideally under 0.25%? [Fees](/learn/fees)." },
        { title: "Volatility you can live with?", text: "Would the typical monthly swing on your intended amount let you sleep? [Volatility](/learn/volatility)." },
        { title: "Discount?", text: "Is it at least 10% below its 52-week high? Not required, but a better moment for extra money. [Drawdowns](/learn/drawdowns)." },
      ],
    },
    { type: "h2", text: "3. Decide the size before, not during" },
    {
      type: "p",
      text: "The moment you are typing an order is the worst moment to decide how much to buy. Excitement inflates the number. Decide the size when you are calm, as a percentage of your whole portfolio, and write it down. Then the order is just execution.",
    },
    {
      type: "example",
      title: "Sizing a single stock in a $10,000 portfolio",
      steps: [
        "Your rule: no single company above 5% of the portfolio.",
        "5% of 10,000 = $500.",
        "The share costs $125. 500 ÷ 125 = 4 shares.",
        "You want to buy 12 shares because you are excited. Twelve shares would be $1,500, which is 15% of the portfolio, three times your rule.",
      ],
      result: "You buy 4 shares. If your thesis is right, 4 shares make you money. If it is wrong, 4 shares cannot hurt you. That is the whole point. See [position sizing](/learn/position-sizing).",
    },
    {
      type: "widget",
      widget: "position-size",
      props: { portfolio: 10000, riskPct: 5 },
      caption: "Enter your real portfolio size and the share price of something you are tempted by. The number of shares it gives you is your answer, decided while calm.",
    },
    { type: "h2", text: "4. Know your sell rules in advance" },
    {
      type: "p",
      text: "There are exactly three good reasons to sell, and none of them is \"the price fell\".",
    },
    {
      type: "table",
      headers: ["Sell when…", "Do not sell when…"],
      rows: [
        ["The thesis broke: the business changed in a way your sentence did not survive", "The price fell but the business is the same"],
        ["You need the money for the goal you were saving for", "A scary headline appeared"],
        ["A position grew far beyond its target size and you are rebalancing", "It has gone up a lot and you want to \"lock in\" gains with no plan for the cash"],
      ],
      caption: "Write your sell rules down the day you buy. Read them before you sell.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "The most expensive sentence in investing",
      text: "\"I will get back in when things calm down.\" Things calm down after the recovery, not before. Investors who sold in March 2020 and waited for calm missed one of the fastest rebounds in history. If the thesis holds, you hold.",
    },
    { type: "h2", text: "Keep a journal and review quarterly" },
    {
      type: "p",
      text: "Every trade in the Bearings [practice portfolio](/portfolio) has a note field. Use it. Write the thesis, the size rule you applied, and what would make you sell. Six months later, read it back. You will discover which of your reasons were reasons and which were moods. That feedback loop is how investors actually improve.",
    },
    {
      type: "p",
      text: "Then close the app. Review your holdings once a quarter, not once an hour. Prices move every second; businesses change over years. Checking daily feeds the [behavioural traps](/learn/behavioural-traps) that cost people the most. The weekly digest exists so that you can look once a week and be done.",
    },
    {
      type: "terms",
      terms: [
        { term: "Thesis", def: "One sentence explaining why an asset will be worth more in ten years." },
        { term: "Checklist", def: "A fixed set of questions you answer before every purchase." },
        { term: "Position size", def: "How much of your portfolio one holding represents, decided in advance." },
        { term: "Rebalancing", def: "Selling some of what grew and buying what shrank to restore target percentages." },
        { term: "Journal", def: "A written record of why you bought, so you can learn from your own decisions." },
      ],
    },
  ],
  quiz: [
    {
      q: "Which of these is a genuine investment thesis?",
      options: [
        "\"Everyone on social media is buying it\"",
        "\"It went up 40% last month\"",
        "\"This fund owns a slice of the whole world economy for 0.2% a year\"",
        "\"I have a good feeling about the CEO\"",
      ],
      answer: 2,
      explain: "A thesis explains why the thing itself will be worth more over years. The others describe price movement or mood.",
    },
    {
      q: "Your rule is 5% maximum per single stock in a $20,000 portfolio. A share costs $250. How many shares at most?",
      options: ["2", "4", "8", "40"],
      answer: 1,
      explain: "5% of 20,000 = $1,000. 1,000 ÷ 250 = 4 shares.",
    },
    {
      q: "Which is a good reason to sell?",
      options: ["The price dropped 15% this month", "A frightening headline about the economy", "The business changed so your thesis no longer holds", "You feel nervous"],
      answer: 2,
      explain: "Sell when the thesis breaks, when you need the money for its goal, or to rebalance. Price drops and headlines are not reasons.",
    },
    {
      q: "How often should a long-term investor review their holdings?",
      options: ["Every hour", "Every day", "Once a quarter", "Never"],
      answer: 2,
      explain: "Businesses change over years, prices over seconds. Quarterly reviews catch what matters without feeding anxiety.",
    },
  ],
  takeaways: [
    "Write a one-sentence thesis before buying. If you cannot, do not buy.",
    "Run the checklist: diversified, trend, not stretched, profitable, fair price, low cost, bearable volatility, discount.",
    "Decide position size as a percentage while calm, before you place the order.",
    "Sell only when the thesis breaks, you need the money, or you are rebalancing. Journal every trade and review quarterly.",
  ],
};
