import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "inflation-and-cash",
  module: "foundations",
  title: "Why cash quietly loses",
  subtitle: "Inflation, purchasing power, and the difference between a number and what it buys.",
  minutes: 7,
  blocks: [
    {
      type: "p",
      text: "Cash feels safe because the number never goes down. 10,000 GEL in a drawer is still 10,000 GEL next year. But money is only worth what it buys, and what it buys shrinks every year. That shrinking is inflation, and it is the reason \"doing nothing\" with your savings is itself a decision with a cost.",
    },
    { type: "h2", text: "Purchasing power" },
    {
      type: "p",
      text: "Inflation is the rate at which prices in general rise. If inflation is 5%, a basket of groceries that cost 100 GEL this year costs about 105 GEL next year. Your 100 GEL note did not change, but it now buys about 95% of the basket.",
    },
    {
      type: "p",
      text: "Anyone who has lived in Georgia for a while has felt this directly. Prices of food, rent and transport have climbed in bursts over the years, and a salary that felt comfortable five years ago can feel tight today even if the number went up. The number rose; the purchasing power did not keep pace.",
    },
    {
      type: "example",
      title: "10,000 USD under the mattress for 20 years",
      steps: [
        "Assume inflation averages 3% a year.",
        "Each year the money buys 3% less: multiply purchasing power by 0.97.",
        "After 10 years: 10,000 × 0.97^10 ≈ 7,374 USD of today's buying power.",
        "After 20 years: 10,000 × 0.97^20 ≈ 5,438 USD of today's buying power.",
      ],
      result: "The note still says 10,000. It buys what 5,438 buys today. Almost half the value evaporated without a single bad decision, just from waiting.",
    },
    {
      type: "widget",
      widget: "inflation",
      props: { amount: 10000, years: 20, inflation: 3 },
      caption: "Set inflation to 8% to see what a high-inflation decade does to cash. Then set it to 2% and compare.",
    },
    { type: "h2", text: "Real versus nominal" },
    {
      type: "p",
      text: "The return printed on a bank deposit or a fund factsheet is the **nominal** return: the change in the number. The **real** return is what is left after inflation, and it is the only one that matters for your life.",
    },
    {
      type: "example",
      title: "A deposit that looks like a win",
      steps: [
        "A bank offers a 4% yearly deposit. Inflation that year is 6%.",
        "Nominal return: +4%. Your 10,000 becomes 10,400.",
        "Real return, approximately: 4% − 6% = −2%.",
        "The 10,400 buys about 2% less than the 10,000 did a year earlier.",
      ],
      result: "You gained 400 in numbers and lost about 200 in buying power. The deposit felt safe and quietly made you poorer.",
    },
    {
      type: "callout",
      tone: "key",
      title: "The bar to clear",
      text: "An investment has to beat inflation before it has done anything for you at all. Over long periods, broad stock indexes have cleared that bar by a wide margin. Cash almost never has.",
    },
    { type: "h2", text: "So is cash useless?" },
    {
      type: "p",
      text: "No. Cash has one job it does better than anything else: being there instantly when life goes wrong. A car repair, a medical bill, a month between jobs. For that job you accept the inflation cost gladly, because the alternative is selling investments at a bad time or borrowing at 20%.",
    },
    {
      type: "list",
      items: [
        "**Emergency fund:** 3 to 6 months of expenses in cash or a deposit you can access within days. Not invested. See [before you invest](/learn/before-you-invest).",
        "**Money you need within about 2 years:** a flat deposit, a wedding, tuition. Keep it in cash or a short-term deposit. A stock market fall at the wrong moment would wreck the plan.",
        "**Everything beyond that:** invest it. Cash held for a decade is a guaranteed loss of purchasing power.",
      ],
    },
    { type: "h2", text: "Deposits versus investing over time" },
    {
      type: "table",
      headers: ["Where", "Typical nominal return", "After 3% inflation", "10,000 after 20 years (real)"],
      rows: [
        ["Drawer", "0%", "−3% real", "about 5,400"],
        ["Bank deposit", "3%", "about 0% real", "about 10,000"],
        ["Broad stock index (long-run average)", "7%", "about 4% real", "about 21,900"],
      ],
      caption: "Illustrative long-run averages, not predictions. Stocks arrive with big swings; deposits do not.",
    },
    {
      type: "p",
      text: "The deposit row is the important one. A 3% deposit in a 3% inflation world is running to stand still. It protects the number and nothing else. For money you will not touch for many years, that protection is not worth the growth you give up.",
    },
    {
      type: "callout",
      tone: "note",
      title: "Which currency?",
      text: "Inflation and interest rates differ by currency. GEL deposits often pay more than USD deposits precisely because GEL inflation and currency risk tend to be higher. A higher number is not automatically a better real return. The [global investing lesson](/learn/global-investing) covers how to think about GEL, USD and EUR together.",
    },
    {
      type: "terms",
      terms: [
        { term: "Inflation", def: "The general rise in prices over time, which lowers what each unit of money buys." },
        { term: "Purchasing power", def: "How much stuff a given amount of money can actually buy." },
        { term: "Nominal return", def: "The change in the number in your account, before inflation." },
        { term: "Real return", def: "Your return after subtracting inflation. Roughly nominal return minus inflation." },
        { term: "Emergency fund", def: "3 to 6 months of living costs kept in cash for surprises." },
      ],
    },
  ],
  quiz: [
    {
      q: "Inflation is 5%. A basket that cost 100 GEL this year costs about how much next year?",
      options: ["95 GEL", "100 GEL", "105 GEL", "150 GEL"],
      answer: 2,
      explain: "Prices rise by 5%, so 100 × 1.05 = 105 GEL for the same basket.",
    },
    {
      q: "A deposit pays 4% while inflation is 6%. What is your approximate real return?",
      options: ["+10%", "+4%", "−2%", "−6%"],
      answer: 2,
      explain: "Real return is roughly nominal minus inflation: 4% − 6% = −2%. You lost buying power despite the account growing.",
    },
    {
      q: "10,000 USD sits in cash for 20 years with 3% inflation. Roughly what is its buying power in today's terms?",
      options: ["About 10,000", "About 8,500", "About 5,400", "About 2,000"],
      answer: 2,
      explain: "10,000 × 0.97^20 ≈ 5,438. Nearly half the purchasing power is gone.",
    },
    {
      q: "Which money should stay in cash rather than be invested?",
      options: [
        "Retirement savings you will not touch for 30 years",
        "Your emergency fund and money you need within about two years",
        "All of your savings, to be safe",
        "None; cash is always a mistake",
      ],
      answer: 1,
      explain: "Cash is for emergencies and near-term needs. Long-horizon money loses to inflation if it sits in cash.",
    },
  ],
  takeaways: [
    "Money is worth what it buys. Inflation shrinks that every year.",
    "Judge every return after inflation. A 4% deposit in 6% inflation is a loss.",
    "Cash has one job: emergencies and near-term needs. Give it that job and nothing more.",
    "Money you will not need for years belongs in investments that have historically beaten inflation.",
  ],
};
