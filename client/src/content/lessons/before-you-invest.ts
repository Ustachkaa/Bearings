import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "before-you-invest",
  module: "plan",
  title: "Before you invest a single lari",
  subtitle: "The order of operations that keeps a market fall from becoming a life crisis.",
  minutes: 8,
  blocks: [
    {
      type: "p",
      text: "The stock market rewards people who can leave their money alone for years. It punishes people who are forced to sell at a bad moment. The difference between the two groups is rarely intelligence. It is preparation. This lesson is the preparation.",
    },
    { type: "h2", text: "The order of operations" },
    {
      type: "steps",
      title: "Do these in order",
      steps: [
        { title: "Know your monthly number", text: "Add up what you actually spend in a normal month: rent, food, transport, phone, everything. Not what you wish you spent. This number drives every other step." },
        { title: "Kill expensive debt", text: "Credit cards, consumer loans and buy-now-pay-later balances often charge 20% to 40% a year. No investment reliably beats that. Paying them off is a guaranteed return of the same size." },
        { title: "Build the emergency fund", text: "Save 3 to 6 months of your monthly number in a bank account or short deposit you can reach within a few days. This is the wall between your investments and life's surprises." },
        { title: "Write down your goals", text: "What is the money for, and when? A flat in 3 years is a different plan from retirement in 35. The [goals lesson](/learn/goals-and-horizon) makes this concrete." },
        { title: "Only then, invest", text: "With debt gone and a cushion in place, money you will not need for at least 5 years can go to work in [index funds](/learn/index-funds), every month, on autopilot." },
      ],
    },
    { type: "h2", text: "Why the emergency fund comes first" },
    {
      type: "p",
      text: "Imagine you skip it. You invest everything, and eight months later your car dies the same week the market drops 25%. You now have to sell investments that are down a quarter to pay a mechanic. You have turned a temporary fall into a permanent loss, exactly the mistake [risk and return](/learn/risk-and-return) warned about.",
    },
    {
      type: "example",
      title: "Sizing the cushion",
      steps: [
        "Your monthly spending is 1,500 USD (roughly 4,000 GEL, depending on the exchange rate).",
        "A 3-month fund: 3 × 1,500 = 4,500 USD.",
        "A 6-month fund: 6 × 1,500 = 9,000 USD.",
        "Saving 300 USD a month, the 3-month fund takes 4,500 ÷ 300 = 15 months to build.",
      ],
      result: "Fifteen months feels slow. It is also the last time you will ever have to think about it. Once built, the fund just sits there, and everything you save after it can be invested.",
    },
    {
      type: "widget",
      widget: "emergency-fund",
      props: { monthlyExpenses: 1500, months: 6 },
      caption: "Enter your real monthly spending. Pick 3 months if your job is very stable, 6 if it is not or you have dependants.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Where to keep it",
      text: "A separate bank account, ideally not the one your card is linked to, so you do not spend it by accident. A short-term deposit is fine if you can break it within a few days. It should be boring. Boring is the point.",
    },
    { type: "h2", text: "Expensive debt is a negative investment" },
    {
      type: "p",
      text: "A loan at 25% a year is compounding against you at 25%. Paying 1,000 USD of it off saves you 250 USD next year, guaranteed, tax-free, with zero risk. No stock, fund or coin offers that. Until the expensive debt is gone, it is the best investment you have.",
    },
    {
      type: "p",
      text: "Cheap debt is different. A mortgage at 8% or a student loan at 5% can reasonably sit alongside investing, because a broad stock index has a fair chance of beating those rates over long periods. The dividing line is roughly 10%: above it, pay it off first; below it, use judgement.",
    },
    { type: "h2", text: "Only money you will not need" },
    {
      type: "p",
      text: "Stocks have historically recovered from every fall, but recovery has sometimes taken years. Money you invest must be able to wait out a bad stretch. The rule of thumb is five years minimum: if you might need it sooner, it belongs in cash or a deposit, as the [inflation lesson](/learn/inflation-and-cash) explained.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Never invest borrowed money",
      text: "Loans, margin, leverage, \"borrow to buy\": all of them turn a normal market fall into a forced sale or a debt you cannot repay. The people who get destroyed in crashes are almost always the ones who borrowed. See [scams and red flags](/learn/scams-and-red-flags).",
    },
    { type: "h2", text: "Write it down" },
    {
      type: "p",
      text: "Before your first purchase, write three sentences: what you are buying, why, and what would make you sell. Bearings has a place for this in your [watchlist](/watchlist) notes. In a year, when the market has done something dramatic, those sentences will be the calmest voice in the room. The [mindset lesson](/learn/how-to-think) builds this habit.",
    },
    {
      type: "terms",
      terms: [
        { term: "Emergency fund", def: "3 to 6 months of living expenses in cash or a short deposit, kept apart from investments." },
        { term: "Expensive debt", def: "Borrowing at roughly 10% a year or more: cards, consumer loans, instalment plans." },
        { term: "Time horizon", def: "How long before you need the money. Investing needs 5 years or more." },
        { term: "Leverage", def: "Investing with borrowed money. Multiplies gains and losses, and can force you to sell at the bottom." },
      ],
    },
  ],
  quiz: [
    {
      q: "Your monthly spending is 1,200 USD. What is a 6-month emergency fund?",
      options: ["1,200 USD", "3,600 USD", "7,200 USD", "14,400 USD"],
      answer: 2,
      explain: "6 × 1,200 = 7,200 USD.",
    },
    {
      q: "You have 2,000 USD spare and a credit card balance charging 30% a year. What is the best first move?",
      options: [
        "Buy a global index fund; it will beat 30%",
        "Pay off the card, a guaranteed 30% return",
        "Buy crypto to pay off the card faster",
        "Keep the cash and the debt as they are",
      ],
      answer: 1,
      explain: "No investment reliably returns 30%. Clearing the debt saves that interest with certainty and zero risk.",
    },
    {
      q: "Why does the emergency fund come before investing?",
      options: [
        "Because banks pay more than stocks",
        "So that a surprise expense never forces you to sell investments during a fall",
        "Because it is required by law",
        "Because investing is only for wealthy people",
      ],
      answer: 1,
      explain: "The fund absorbs life's shocks so your investments can stay untouched through market dips.",
    },
    {
      q: "What is the minimum time horizon for money you put into stock funds?",
      options: ["1 month", "1 year", "About 5 years or more", "50 years"],
      answer: 2,
      explain: "Recoveries from falls have sometimes taken years. Money needed sooner than about five years belongs in cash.",
    },
  ],
  takeaways: [
    "Order matters: know your spending, clear expensive debt, build the cushion, set goals, then invest.",
    "The emergency fund is what lets you ignore market falls instead of being forced to sell into them.",
    "Debt above about 10% a year is a negative investment. Pay it off first.",
    "Invest only money you can leave alone for five years or more, and never borrowed money.",
  ],
};
