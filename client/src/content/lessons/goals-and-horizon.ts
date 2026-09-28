import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "goals-and-horizon",
  module: "plan",
  title: "Goals and time horizon",
  subtitle: "Matching each pot of money to how long it can wait, and working out the monthly number.",
  minutes: 8,
  blocks: [
    {
      type: "p",
      text: "\"I want to invest\" is not a goal. \"I want 100,000 USD in 20 years for retirement\" is. The second sentence tells you how much to save, how much risk you can take, and what to ignore along the way. This lesson turns wishes into numbers.",
    },
    { type: "h2", text: "Three horizons, three toolkits" },
    {
      type: "table",
      headers: ["Horizon", "Examples", "What suits it", "What does not"],
      rows: [
        ["Short: under 2 years", "Flat deposit, wedding, a car", "Cash, short deposits", "Stocks, crypto"],
        ["Medium: 2 to 7 years", "House down payment, a sabbatical", "Mostly bonds, some stocks", "All-stock portfolios"],
        ["Long: 7 years and beyond", "Retirement, children's education, financial independence", "Mostly or entirely stock index funds", "Sitting in cash"],
      ],
      caption: "The longer the money can wait, the more volatility it can afford, and the more growth it can capture.",
    },
    {
      type: "p",
      text: "The logic follows directly from [risk and return](/learn/risk-and-return). A stock fund can fall 30% and take three years to recover. If the money is needed in two years, that is a disaster. If it is needed in twenty, it is a footnote.",
    },
    {
      type: "callout",
      tone: "key",
      title: "One person, several pots",
      text: "You do not have one time horizon. You have one per goal. The flat deposit sits in a deposit account. The retirement money sits in a global stock fund. Mixing them in one pot leads to either too much risk for the flat or too little growth for retirement.",
    },
    { type: "h2", text: "The monthly number" },
    {
      type: "p",
      text: "For any long-term goal there is a monthly contribution that gets you there, given a return assumption and the years available. Working it out is the most motivating piece of arithmetic in investing, because the number is usually smaller than people fear when the horizon is long.",
    },
    {
      type: "example",
      title: "100,000 USD in 20 years at 7%",
      steps: [
        "Monthly rate: 7% ÷ 12 ≈ 0.583% per month, and 20 years = 240 months.",
        "The growth factor over 240 months: 1.00583^240 ≈ 4.04.",
        "The formula for the monthly payment is target × rate ÷ (growth factor − 1).",
        "100,000 × 0.00583 ÷ (4.04 − 1) = 583 ÷ 3.04 ≈ 192 USD per month.",
        "Total paid in: 192 × 240 = 46,080 USD. The other 53,920 is growth.",
      ],
      result: "About 192 USD a month reaches 100,000 in 20 years if returns average 7%. More than half the final pot is compounding, not contributions.",
    },
    {
      type: "p",
      text: "Now watch what the horizon does to that number. The same 100,000 goal in 10 years needs about 578 USD a month. In 30 years it needs about 82 USD a month. Time does not just help; it changes the size of the task by a factor of seven.",
    },
    {
      type: "widget",
      widget: "goal",
      props: { target: 100000, years: 20, rate: 7, initial: 0 },
      caption: "Enter a real goal. Then change the years and watch the monthly amount move. Try a 5% return too, to see a cautious version.",
    },
    { type: "h2", text: "Retirement: the big one" },
    {
      type: "p",
      text: "Most people's largest financial goal is the day they stop working. In Georgia the state pension is modest, and the mandatory pension scheme is a start but rarely enough alone. Whatever you build yourself is what decides the comfort of those decades.",
    },
    {
      type: "p",
      text: "A rough planning rule: if you can build a pot equal to about 25 times your yearly spending, you can withdraw about 4% a year and have a good chance of it lasting for decades. Spending 12,000 USD a year points to a target around 300,000 USD. That sounds enormous until you run it through the goal calculator above with a 30- or 35-year horizon and see the monthly figure.",
    },
    {
      type: "callout",
      tone: "note",
      title: "Adjust for inflation",
      text: "100,000 USD in 20 years will not buy what 100,000 buys today. If [inflation](/learn/inflation-and-cash) averages 3%, you would need about 180,000 to match today's 100,000 (100,000 × 1.03^20 ≈ 180,600). Either raise the target, or plan with a real return of about 4% instead of a nominal 7%, which builds the inflation into the maths.",
    },
    { type: "h2", text: "Review, but rarely" },
    {
      type: "p",
      text: "Goals change. Salaries rise, children arrive, plans move. Revisit the numbers once a year, ideally on a fixed date, and adjust the monthly amount. Do not revisit them every time the market moves; the market's mood has nothing to do with whether you still want to retire at 60.",
    },
    {
      type: "steps",
      title: "Set up one goal today",
      steps: [
        { title: "Name it and date it", text: "\"Retirement, 2056\" or \"Down payment, 2031\"." },
        { title: "Put a number on it", text: "In today's money, then add inflation or use a real return." },
        { title: "Run the calculator", text: "Get the monthly contribution. If it is too high, extend the horizon or lower the target. Do not raise the return assumption; that is wishful thinking, not planning." },
        { title: "Automate it", text: "Set a monthly transfer to your broker for that amount, and a [monthly reminder](/alerts) in Bearings so the purchase happens." },
      ],
    },
    {
      type: "terms",
      terms: [
        { term: "Time horizon", def: "The number of years until you need the money for a specific goal." },
        { term: "Target", def: "The amount you want to have when the goal date arrives." },
        { term: "Contribution", def: "The amount you add each month." },
        { term: "4% rule", def: "A planning guideline: a pot of 25 times yearly spending can usually support withdrawing 4% a year for decades." },
        { term: "Real return", def: "Return after inflation. Planning with it keeps your target in today's money." },
      ],
    },
  ],
  quiz: [
    {
      q: "You need money for a flat deposit in 18 months. Where should it be?",
      options: ["A global stock ETF", "Bitcoin", "Cash or a short-term deposit", "A single growth stock"],
      answer: 2,
      explain: "Under two years is a short horizon. A market fall at the wrong moment would wreck the plan, so cash is the right tool.",
    },
    {
      q: "At 7% a year, roughly how much per month reaches 100,000 USD in 20 years?",
      options: ["About 50 USD", "About 192 USD", "About 417 USD", "About 1,000 USD"],
      answer: 1,
      explain: "The annuity formula gives about 192 USD a month. Over half the final pot is growth rather than contributions.",
    },
    {
      q: "Using the 25-times rule, what retirement pot supports yearly spending of 12,000 USD?",
      options: ["48,000 USD", "120,000 USD", "300,000 USD", "1,200,000 USD"],
      answer: 2,
      explain: "25 × 12,000 = 300,000 USD, from which 4% a year is 12,000.",
    },
    {
      q: "Your goal calculator says the monthly amount is too high. Which adjustment is sound planning?",
      options: [
        "Assume a 15% yearly return instead of 7%",
        "Extend the horizon or lower the target",
        "Skip the emergency fund to free up cash",
        "Borrow money to invest more now",
      ],
      answer: 1,
      explain: "Horizon and target are within your control. Inflating the return assumption is wishful thinking, and borrowing or skipping the cushion adds danger.",
    },
  ],
  takeaways: [
    "Each goal has its own horizon and its own pot. Match the tool to the time.",
    "Long horizons shrink the monthly number dramatically: the same goal costs 7 times less per month over 30 years than over 10.",
    "Plan retirement with the 25-times rule and adjust targets for inflation.",
    "Review goals once a year on a fixed date, never in response to market moves.",
  ],
};
