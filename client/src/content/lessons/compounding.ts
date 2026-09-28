import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "compounding",
  module: "foundations",
  title: "Compounding: growth on top of growth",
  subtitle: "The single idea that makes patient investors rich and impatient ones poor.",
  minutes: 10,
  blocks: [
    {
      type: "p",
      text: "If you learn only one thing from this whole course, make it this lesson. Compounding is what happens when your returns start earning their own returns. It is slow at first, almost boringly so, and then it becomes the most powerful force in your financial life.",
    },
    { type: "h2", text: "Simple growth versus compound growth" },
    {
      type: "p",
      text: "Imagine two accounts, each starting with 1,000 USD and each earning 7% a year. The first pays the 70 USD out to you every year and stays at 1,000. The second keeps the 70 USD inside, so next year it earns 7% on 1,070, not 1,000.",
    },
    {
      type: "example",
      title: "1,000 USD at 7% a year, reinvested",
      steps: [
        "Year 1: 1,000 × 1.07 = 1,070",
        "Year 2: 1,070 × 1.07 = 1,144.90",
        "Year 3: 1,144.90 × 1.07 = 1,225.04",
        "Year 10: 1,000 × 1.07^10 = 1,967.15",
        "Year 20: 1,000 × 1.07^20 = 3,869.68",
        "Year 30: 1,000 × 1.07^30 = 7,612.26",
      ],
      result: "Simple interest would have paid 30 × 70 = 2,100 USD over 30 years, ending at 3,100. Compounding ends at 7,612. The difference, 4,512 USD, is returns earned by earlier returns.",
    },
    {
      type: "p",
      text: "Look at the shape of those numbers. The first decade added about 967 USD. The third decade added about 3,742 USD, almost four times as much, from the same 7% rate. Nothing changed except the size of the pile the 7% was applied to.",
    },
    {
      type: "widget",
      widget: "compound",
      props: { initial: 1000, monthly: 100, years: 30, rate: 7 },
      caption: "Set the years to 10, then 20, then 30. The last ten years do more work than the first twenty combined.",
    },
    { type: "h2", text: "The Rule of 72" },
    {
      type: "p",
      text: "You do not need a calculator to feel compounding. Divide 72 by your yearly return and you get roughly the number of years it takes money to double.",
    },
    {
      type: "list",
      items: [
        "At 3% (a good bank deposit): 72 ÷ 3 = 24 years to double.",
        "At 7% (long-run stock market average): 72 ÷ 7 ≈ 10 years to double.",
        "At 10%: 72 ÷ 10 ≈ 7 years to double.",
      ],
    },
    {
      type: "p",
      text: "So at 7%, money doubles roughly every decade. 1,000 USD becomes 2,000, then 4,000, then 8,000 over 30 years, which matches the 7,612 USD in the example above almost exactly.",
    },
    {
      type: "widget",
      widget: "rule-72",
      props: { rate: 7 },
      caption: "Try 2% and 12%. A small difference in rate is a huge difference in doubling time.",
    },
    { type: "h2", text: "Starting early beats investing more" },
    {
      type: "p",
      text: "This is the part that surprises everyone. Because compounding rewards time above all, the person who starts earlier wins even if they invest less in total.",
    },
    {
      type: "example",
      title: "Nino and Giorgi",
      steps: [
        "Nino invests 100 USD a month from age 25 to 35, then stops. Total invested: 10 years × 12 × 100 = 12,000 USD.",
        "Giorgi waits, then invests 100 USD a month from age 35 to 65. Total invested: 30 years × 12 × 100 = 36,000 USD.",
        "Both earn 7% a year.",
        "Nino's 12,000 grows to about 17,000 by age 35, then compounds untouched for 30 more years: 17,000 × 1.07^30 ≈ 129,400 USD.",
        "Giorgi's 30 years of contributions grow to about 117,000 USD by age 65.",
      ],
      result: "Nino invested a third as much money and finished with more. Her secret was not skill. It was ten extra years.",
    },
    {
      type: "callout",
      tone: "key",
      title: "The most expensive mistake",
      text: "Waiting until you \"have enough money to start\" is the mistake that costs the most, because the years you wait are the years that would have compounded the longest. 50 USD a month now beats 500 USD a month in ten years.",
    },
    { type: "h2", text: "Dividends compound too" },
    {
      type: "p",
      text: "When a fund pays a dividend, you can take the cash or reinvest it into more units. Reinvesting means the dividend itself starts earning returns. Over long periods, reinvested dividends have made up a very large share of total stock market returns. Many European ETFs do this for you automatically; they are called *accumulating* funds, and [index funds](/learn/index-funds) explains how to spot them.",
    },
    { type: "h2", text: "Compounding works against you as well" },
    {
      type: "p",
      text: "The same maths applies to anything charged as a percentage every year: fund fees, inflation, credit card interest. A 1.5% yearly fee does not sound like much, but compounded over 30 years it eats roughly a third of your final pot. The [fees lesson](/learn/fees) shows the full calculation. And a credit card at 20% a year doubles your debt every 3.6 years, which is why [paying off expensive debt](/learn/before-you-invest) comes before investing.",
    },
    {
      type: "callout",
      tone: "note",
      title: "About that 7%",
      text: "Throughout this course 7% is used as a planning number for a broad stock index over long periods. Real returns arrive in lumps: some years plus 25%, some minus 20%. The average only shows up if you stay invested through both.",
    },
    {
      type: "terms",
      terms: [
        { term: "Compounding", def: "Earning returns on your previous returns, not just on your original money." },
        { term: "Rule of 72", def: "Divide 72 by the yearly return to estimate how many years it takes money to double." },
        { term: "Reinvesting", def: "Using dividends or interest to buy more of the investment instead of taking the cash." },
        { term: "Accumulating fund", def: "A fund that reinvests dividends automatically inside the fund." },
        { term: "Time horizon", def: "How long you can leave money invested before you need it." },
      ],
    },
  ],
  quiz: [
    {
      q: "1,000 USD grows at 7% a year with returns reinvested. Roughly how much is it after 30 years?",
      options: ["3,100 USD", "5,000 USD", "7,600 USD", "21,000 USD"],
      answer: 2,
      explain: "1,000 × 1.07^30 ≈ 7,612 USD. Simple interest would give only 3,100.",
    },
    {
      q: "Using the Rule of 72, how long does money take to double at 8% a year?",
      options: ["About 5 years", "About 9 years", "About 12 years", "About 18 years"],
      answer: 1,
      explain: "72 ÷ 8 = 9 years.",
    },
    {
      q: "Nino invested 12,000 USD over 10 years starting at 25. Giorgi invested 36,000 USD over 30 years starting at 35. At 7%, who has more at 65?",
      options: ["Giorgi, because he invested three times as much", "Nino, because her money had ten more years to compound", "They finish exactly equal", "Impossible to say"],
      answer: 1,
      explain: "Nino's smaller pot compounds for 40 years in total and ends slightly ahead of Giorgi's larger contributions.",
    },
    {
      q: "Which of these also compounds over time, working against you?",
      options: ["A yearly fund fee of 1.5%", "A one-time 5 USD trading commission", "The name of the fund", "The number of shares you hold"],
      answer: 0,
      explain: "Anything charged as a percentage every year compounds. Fees and inflation quietly shrink your pot the same way returns grow it.",
    },
  ],
  takeaways: [
    "Compounding means returns earn returns. It is slow early and explosive late.",
    "Rule of 72: divide 72 by the yearly return to get the doubling time.",
    "Starting earlier beats investing more. Time is worth more than money.",
    "Fees and inflation compound too, in the wrong direction. Keep both small.",
  ],
};
