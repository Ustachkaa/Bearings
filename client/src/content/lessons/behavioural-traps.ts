import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "behavioural-traps",
  module: "mindset",
  title: "Behavioural traps",
  subtitle: "The market does not beat most investors. Their own brains do. Here are the eight ways, and the fix for each.",
  minutes: 10,
  blocks: [
    {
      type: "p",
      text: "Studies of real investor accounts keep finding the same thing: the average investor earns noticeably less than the funds they invest in. Not because the funds are bad, but because people buy after prices rise and sell after prices fall. The gap is caused by behaviour, and behaviour can be managed once you can name the traps.",
    },
    { type: "h2", text: "The eight traps" },
    {
      type: "steps",
      title: "Name it, then counter it",
      steps: [
        { title: "FOMO (fear of missing out)", text: "A coin doubles in a month and you buy at the top because everyone else did. Counter: a rule that you never buy anything that rose more than 50% in the last three months without waiting 30 days." },
        { title: "Panic selling", text: "The market drops 20%, headlines scream, and you sell to \"stop the bleeding\" at the bottom. Counter: written sell rules from [how to think](/learn/how-to-think), read before every sale." },
        { title: "Loss aversion", text: "Losing $100 feels about twice as bad as gaining $100 feels good, so you hold losers hoping to break even and sell winners too early. Counter: judge each holding by its thesis today, not by your purchase price." },
        { title: "Anchoring", text: "You bought at $50, it is now $30, and $50 feels like the \"real\" price. The market does not know or care what you paid. Counter: ask, would I buy this today at $30? If not, why hold it?" },
        { title: "Recency bias", text: "After three good years you assume good years are normal; after a crash you assume crashes are normal. Counter: look at 30-year charts, not 3-year ones. [Reading a chart](/learn/reading-a-chart)." },
        { title: "Overconfidence", text: "Two lucky picks convince you that you can pick stocks. Counter: track every decision in the practice portfolio journal and compare with a boring index fund after a year." },
        { title: "Herd behaviour", text: "Everyone in the group chat is buying, so it must be right. Crowds are right on average and catastrophically wrong at extremes. Counter: if you first heard about it from a crowd, you are probably late." },
        { title: "Confirmation bias", text: "You own it, so you only read articles that agree with you. Counter: before adding to a position, write down the strongest argument against it." },
      ],
    },
    { type: "h2", text: "The cycle that empties accounts" },
    {
      type: "p",
      text: "Put the traps together and you get the classic pattern. Prices rise, recency bias and FOMO pull you in near the top. Prices fall, loss aversion makes you freeze, then panic makes you sell near the bottom. Prices recover, you wait for \"calm\" and miss the rebound. Repeat. Each cycle you buy high and sell low, the exact opposite of the plan.",
    },
    {
      type: "example",
      title: "What one panic sale costs",
      steps: [
        "You hold $10,000 of a world fund. A bear market takes it to $7,000, a 30% fall.",
        "You panic and sell at $7,000.",
        "The market recovers 43% over the next 18 months (7,000 × 1.43 = $10,010, back to even).",
        "You wait for calm and buy back in at $10,000 with your $7,000, getting 30% fewer units than you had.",
        "Meanwhile a friend who did nothing is back at $10,000. You are at $7,000 of the same fund.",
      ],
      result: "One emotional decision cost 30% of the holding permanently. The market did not do this. The behaviour did. See [drawdowns](/learn/drawdowns) for the recovery maths.",
    },
    {
      type: "widget",
      widget: "drawdown",
      props: { drop: 50 },
      caption: "Set the drop to what a bad crash looks like, 50%, and see the recovery needed. Then remember that investors who stayed put got the whole recovery, and those who sold did not.",
    },
    { type: "h2", text: "The cure is automation" },
    {
      type: "p",
      text: "You will not out-willpower your own brain in the moment. Nobody does. The fix is to make the decisions in advance and remove the moment entirely. A standing monthly transfer into an [index fund](/learn/index-funds) does not feel FOMO or panic. It buys in March 2020 and it buys in January 2022 with the same indifference. That indifference is worth more than any analysis.",
    },
    {
      type: "table",
      headers: ["Manual investor", "Automated investor"],
      rows: [
        ["Decides each month whether to invest", "Money moves on the 1st regardless"],
        ["Checks prices daily, reacts to news", "Reads a weekly digest, reviews quarterly"],
        ["Sizes positions by excitement", "Sizes by a written percentage rule"],
        ["Sells when scared", "Sells only when written rules say so"],
      ],
      caption: "The automated investor is not smarter. They have simply removed the moments where mistakes happen.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Use Bearings against your own brain",
      text: "Set a dip [alert](/alerts) on your core fund instead of watching prices. Let the monthly reminder do the deciding. When a scary headline arrives, open the Explore page and read the checklist rather than the news. Rules beat feelings, every time, over time.",
    },
    {
      type: "callout",
      tone: "note",
      title: "You are not special, and that is good news",
      text: "Every one of these traps was measured in professional fund managers too. The advantage you have over them is that nobody is grading your quarterly performance. You can afford to do nothing, which is the hardest and most profitable move in investing.",
    },
    {
      type: "terms",
      terms: [
        { term: "FOMO", def: "Fear of missing out: buying because a price has risen and others are buying." },
        { term: "Loss aversion", def: "Feeling losses roughly twice as strongly as equal-sized gains." },
        { term: "Anchoring", def: "Treating an irrelevant number, usually your purchase price, as the true value." },
        { term: "Recency bias", def: "Assuming the recent past is what normal looks like." },
        { term: "Confirmation bias", def: "Seeking information that agrees with what you already believe." },
        { term: "Behaviour gap", def: "The difference between a fund's return and what its investors actually earned." },
      ],
    },
  ],
  quiz: [
    {
      q: "You bought a stock at $60. It is now $40 and the business has deteriorated, but you refuse to sell until it gets back to $60. Which trap is this?",
      options: ["FOMO", "Anchoring combined with loss aversion", "Herd behaviour", "Recency bias"],
      answer: 1,
      explain: "Your purchase price is an anchor the market does not know about, and loss aversion makes realising the loss feel unbearable. Ask instead: would I buy it today at $40?",
    },
    {
      q: "A $10,000 holding falls 30% to $7,000 and you sell. It then recovers fully and you buy back with your $7,000. Compared with a friend who held, how much of the position did you lose?",
      options: ["Nothing", "About 10%", "30%", "43%"],
      answer: 2,
      explain: "Your friend is back at $10,000. You hold $7,000 of the same fund, 30% less. The market recovered; your decision did not.",
    },
    {
      q: "What is the most reliable cure for behavioural traps?",
      options: ["Reading more news", "Stronger willpower in the moment", "Automating decisions in advance so the moment never arrives", "Checking prices more often to react faster"],
      answer: 2,
      explain: "Nobody consistently beats their own brain in the heat of the moment. A standing monthly transfer and written rules remove the moment.",
    },
    {
      q: "You first heard about an investment because everyone in a group chat was buying it. What does herd behaviour suggest?",
      options: ["Buy immediately before it rises more", "You are probably late, and crowds are worst at extremes", "Crowds are always wrong, so sell it short", "Group chats are the best research source"],
      answer: 1,
      explain: "Crowds are roughly right on average but badly wrong at peaks and troughs. Widespread excitement usually means the easy gains are gone.",
    },
  ],
  takeaways: [
    "The average investor earns less than the funds they hold because they buy after rises and sell after falls.",
    "Name the trap: FOMO, panic, loss aversion, anchoring, recency, overconfidence, herding, confirmation.",
    "One panic sale can permanently cost a third of a holding even though the market fully recovers.",
    "Automate contributions and write your rules in advance. Doing nothing is the hardest and most profitable skill.",
  ],
};
