import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "risk-and-return",
  module: "foundations",
  title: "Risk and return are the same coin",
  subtitle: "Why higher returns come with bigger swings, and how to tell a swing from a sinking.",
  minutes: 9,
  blocks: [
    {
      type: "p",
      text: "Every investment offers a deal: more expected return in exchange for more uncertainty. There is no product that gives stock-like growth with deposit-like calm. When someone offers you one, you are looking at either a misunderstanding or a [scam](/learn/scams-and-red-flags).",
    },
    {
      type: "p",
      text: "The good news is that \"risk\" is a word covering two very different things, and only one of them should frighten a long-term investor.",
    },
    { type: "h2", text: "Two kinds of risk" },
    {
      type: "terms",
      terms: [
        { term: "Volatility", def: "How much the price swings up and down. Uncomfortable, but temporary for a diversified fund." },
        { term: "Permanent loss", def: "Money that is gone and not coming back: a company that fails, a scam, or selling a good asset at the bottom." },
        { term: "Drawdown", def: "The fall from a peak to a low point, measured as a percentage. See [drawdowns](/learn/drawdowns)." },
        { term: "Risk tolerance", def: "How much swinging you can emotionally stand without selling." },
        { term: "Risk capacity", def: "How much swinging your finances can afford, given when you need the money." },
      ],
    },
    {
      type: "p",
      text: "A broad index fund falling 30% is volatility. It has happened many times and the fund has recovered every time so far, because the 500 companies inside kept making things and selling them. A single company going bankrupt is permanent loss. Its shares go to zero and stay there.",
    },
    {
      type: "callout",
      tone: "key",
      title: "The rule that follows",
      text: "Diversified volatility is a price you pay for growth. Concentrated permanent loss is a mistake you avoid. Own baskets, not lottery tickets.",
    },
    { type: "h2", text: "What the swings have looked like" },
    {
      type: "p",
      text: "Here is what owning the S&P 500, the 500 largest US companies, has actually felt like at its worst moments. These are real drawdowns, from peak to trough:",
    },
    {
      type: "table",
      headers: ["Period", "Approximate fall", "Roughly how long to recover"],
      rows: [
        ["2007 to 2009 (financial crisis)", "about −57%", "about 5 to 6 years including dividends"],
        ["2020 (pandemic)", "about −34%", "about 6 months"],
        ["2022 (inflation and rate rises)", "about −25%", "about 2 years"],
      ],
      caption: "Every one of these felt like the end of the world at the time. Every one was followed by new highs.",
    },
    {
      type: "p",
      text: "Notice that a 7% average return contains years like these. Someone who sold in March 2009 or March 2020 turned temporary volatility into permanent loss with a single click.",
    },
    { type: "h2", text: "The cruel arithmetic of losses" },
    {
      type: "p",
      text: "Gains and losses are not symmetrical. A fall needs a bigger rise to undo it, and the deeper the fall, the more lopsided it gets.",
    },
    {
      type: "example",
      title: "Recovering from a fall",
      steps: [
        "You have 1,000 USD. It falls 20%: 1,000 × 0.80 = 800.",
        "To get back to 1,000 you need 200 on 800: 200 ÷ 800 = 25% gain.",
        "Now suppose it falls 50%: 1,000 × 0.50 = 500.",
        "To get back you need 500 on 500: 500 ÷ 500 = 100% gain.",
      ],
      result: "A 20% loss needs a 25% gain. A 50% loss needs a 100% gain. This is why avoiding permanent losses matters more than chasing big wins.",
    },
    { type: "h2", text: "Tolerance versus capacity" },
    {
      type: "p",
      text: "Two questions decide how much risk you should take. The first is emotional: if your account dropped 30% next year, would you calmly keep buying, or would you lie awake and sell? Be honest. The second is practical: when will you actually need this money? Money for a flat deposit in two years cannot afford a 30% drop, no matter how brave you feel.",
    },
    {
      type: "p",
      text: "Your allocation should satisfy the stricter of the two. A 25-year-old with a 40-year horizon but a nervous stomach might hold 70% stocks instead of 100%. A calm 55-year-old who needs the money in five years should hold far more bonds than their temperament alone would suggest.",
    },
    {
      type: "widget",
      widget: "risk-quiz",
      props: {},
      caption: "Answer honestly. The result suggests a starting mix of stocks and bonds you can refine in the diversification lesson.",
    },
    { type: "h2", text: "Diversification: the free lunch" },
    {
      type: "p",
      text: "Combining assets that do not move in lockstep lowers the swings without lowering the long-run return by nearly as much. Holding 500 companies instead of one removes the risk of any single collapse. Adding companies from Europe and Asia removes some of the risk of one country stumbling. Adding bonds smooths the worst years. This is the closest thing to a free lunch in finance, and the [diversification lesson](/learn/diversification) shows how to build it.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "A practical test",
      text: "Before you buy anything, write down the number your account would show after a 40% fall. If seeing that number would make you sell, the position is too big or too concentrated. Shrink it now, calmly, rather than later, in a panic.",
    },
  ],
  quiz: [
    {
      q: "Which of these is a permanent loss rather than volatility?",
      options: [
        "A global index fund falling 25% during a recession",
        "A single company going bankrupt and its shares dropping to zero",
        "Your ETF being down 8% this month",
        "Bond prices falling 5% when interest rates rise",
      ],
      answer: 1,
      explain: "Bankruptcy wipes out the shares for good. The other three are price swings in assets that still exist and can recover.",
    },
    {
      q: "Your 1,000 USD falls 50% to 500 USD. What gain do you need to get back to 1,000?",
      options: ["50%", "75%", "100%", "150%"],
      answer: 2,
      explain: "You need 500 more on a base of 500, which is a 100% gain.",
    },
    {
      q: "Roughly how far did the S&P 500 fall during the 2007 to 2009 financial crisis?",
      options: ["About −10%", "About −25%", "About −57%", "About −90%"],
      answer: 2,
      explain: "The index fell by roughly 57% from peak to trough, then went on to new highs within about six years including dividends.",
    },
    {
      q: "You need money for a flat deposit in two years. What matters most in deciding your risk level?",
      options: [
        "Your risk tolerance, because you feel brave",
        "Your risk capacity, because a big drop would wreck the plan",
        "Last year's returns",
        "What your friends are buying",
      ],
      answer: 1,
      explain: "A short horizon means you cannot afford a large fall, whatever your temperament. Capacity sets the ceiling.",
    },
  ],
  takeaways: [
    "Volatility is temporary and is the price of growth. Permanent loss is avoidable and is the real enemy.",
    "Losses need bigger gains to undo: −50% needs +100%.",
    "Choose your risk level by the stricter of tolerance (emotion) and capacity (timing).",
    "Diversification lowers swings without giving up much return.",
  ],
};
