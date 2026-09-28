import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "dollar-cost-averaging",
  module: "plan",
  title: "Investing on autopilot",
  subtitle: "Dollar-cost averaging: the same amount, every month, whatever the market is doing.",
  minutes: 8,
  blocks: [
    {
      type: "p",
      text: "The hardest question in investing is \"is now a good time to buy?\" Dollar-cost averaging (DCA) is the decision to stop asking. You invest a fixed amount on a fixed day every month. When prices are high you get fewer units; when prices are low you get more. Over time you end up buying more of the cheap stuff automatically, without ever guessing.",
    },
    { type: "h2", text: "The arithmetic" },
    {
      type: "example",
      title: "Three months, 100 USD each",
      steps: [
        "Month 1: price 10 USD. 100 ÷ 10 = 10 units.",
        "Month 2: price 5 USD (a crash). 100 ÷ 5 = 20 units.",
        "Month 3: price 10 USD (recovered). 100 ÷ 10 = 10 units.",
        "Total invested: 300 USD. Total units: 10 + 20 + 10 = 40.",
        "Your average price paid: 300 ÷ 40 = 7.50 USD per unit.",
        "The average of the three prices was (10 + 5 + 10) ÷ 3 = 8.33 USD.",
      ],
      result: "You paid 7.50 per unit while the average price was 8.33, because the fixed amount bought more units when the price was low. At the final price of 10, your 40 units are worth 400 USD, a 33% gain even though the price ended where it started.",
    },
    {
      type: "p",
      text: "This is the whole trick. A fixed amount of money is automatically greedy when things are cheap and cautious when they are expensive, which is the opposite of what human emotions do.",
    },
    { type: "h2", text: "What DCA really fixes" },
    {
      type: "p",
      text: "The mathematical benefit is real but modest. The behavioural benefit is enormous. DCA removes three decisions that ruin beginners:",
    },
    {
      type: "list",
      items: [
        "**When to start.** You start now, with this month's amount. Waiting for a \"better\" moment is how people sit in cash for years.",
        "**Whether to buy during a fall.** The transfer already went through. You bought the dip without needing courage.",
        "**Whether to buy during a boom.** You bought your usual amount and no more, so you did not pile in at the top out of excitement.",
      ],
    },
    {
      type: "callout",
      tone: "key",
      title: "The plan is the plan",
      text: "The month the market drops 20% and every headline screams is exactly the month your automatic purchase buys 25% more units than usual. You will feel nothing, because you did not decide anything. That feeling of nothing is what winning looks like.",
    },
    { type: "h2", text: "The honest comparison with lump sums" },
    {
      type: "p",
      text: "If you have a large amount right now, say an inheritance, studies show that investing it all at once beats spreading it over a year roughly two times out of three, because markets rise more often than they fall and the money spent waiting misses that growth. So DCA is not magic for a lump sum. It is a way to sleep, and it caps the regret of investing everything the week before a crash.",
    },
    {
      type: "p",
      text: "For most people this debate is irrelevant, because they do not have a lump sum. They have a salary. Investing part of each month's salary *is* dollar-cost averaging, and it is the only option anyway. Do it as soon as the money arrives, not at the end of the month when it has evaporated.",
    },
    {
      type: "widget",
      widget: "dca",
      props: { symbol: "VOO", monthly: 100, range: "10y" },
      caption: "This replays 100 USD a month on real prices. Look at the crash months: they are where your average price was pulled down. Try a European fund like VWCE.DE too.",
    },
    { type: "h2", text: "Setting it up" },
    {
      type: "steps",
      title: "Automate the habit",
      steps: [
        { title: "Choose the amount", text: "From your goal calculation in the [goals lesson](/learn/goals-and-horizon). Start with what you can sustain even in a tight month; you can raise it later." },
        { title: "Choose the day", text: "A few days after salary arrives. Money that is already invested cannot be spent on a whim." },
        { title: "Set the bank transfer", text: "A standing order from your salary account to your broker, same amount, same day, every month." },
        { title: "Buy the same fund", text: "Some brokers offer automatic purchases (savings plans). If yours does not, set a [monthly reminder in Bearings](/alerts) and buy manually. The whole task takes two minutes." },
        { title: "Raise it with your salary", text: "When your pay rises, raise the contribution the same day. You will never miss money you never saw." },
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "What about the signals?",
      text: "Bearings shows signals like \"favourable moment to add\" on your watchlist. They are there for *extra* money, when you have some. Your regular contribution goes in every month regardless. Never skip a month because a signal says \"patience\"; that is the timing trap in disguise. See [using Bearings](/learn/using-bearings).",
    },
    { type: "h2", text: "Fees and small amounts" },
    {
      type: "p",
      text: "If your broker charges a fixed commission per trade, say 2 USD, buying 50 USD a month loses 4% to fees each time. Either use a broker with free or very cheap ETF purchases, or buy every two or three months to bring the fee under about 0.5% of each purchase. The [fees lesson](/learn/fees) has the details.",
    },
    {
      type: "terms",
      terms: [
        { term: "Dollar-cost averaging (DCA)", def: "Investing a fixed amount at fixed intervals regardless of price." },
        { term: "Lump sum", def: "Investing a large amount all at once." },
        { term: "Unit", def: "One share of a fund or ETF. Fixed money buys more units when the price is low." },
        { term: "Savings plan", def: "A broker feature that buys a chosen fund automatically each month." },
        { term: "Average price paid", def: "Total money invested divided by total units bought." },
      ],
    },
  ],
  quiz: [
    {
      q: "You invest 100 USD a month for three months at prices of 10, 5 and 10 USD. What is your average price paid per unit?",
      options: ["8.33 USD", "7.50 USD", "10.00 USD", "5.00 USD"],
      answer: 1,
      explain: "300 USD buys 10 + 20 + 10 = 40 units, so 300 ÷ 40 = 7.50 USD, below the 8.33 average of the prices.",
    },
    {
      q: "What is the biggest real-world benefit of dollar-cost averaging?",
      options: [
        "It guarantees a profit",
        "It removes the timing decisions that cause beginners to freeze or panic",
        "It avoids all fees",
        "It doubles your return",
      ],
      answer: 1,
      explain: "The maths advantage is modest. The behavioural one, never having to decide when to buy, is what keeps people invested.",
    },
    {
      q: "You receive a large lump sum. What does the evidence say about investing it all at once versus spreading it over a year?",
      options: [
        "Spreading always wins",
        "Investing at once wins roughly two times out of three, but spreading reduces regret",
        "They give identical results",
        "Neither; lump sums should stay in cash",
      ],
      answer: 1,
      explain: "Markets rise more often than they fall, so waiting usually costs return. DCA on a lump sum is a comfort choice, not a return booster.",
    },
    {
      q: "A Bearings signal says \"patience\" on your core fund this month. What should you do with your regular monthly contribution?",
      options: [
        "Skip it this month",
        "Invest it as planned; signals are for extra money only",
        "Sell your holdings",
        "Move it to crypto",
      ],
      answer: 1,
      explain: "The regular contribution never depends on signals. Using them to skip months reintroduces the timing trap DCA exists to remove.",
    },
  ],
  takeaways: [
    "A fixed amount buys more units when prices are low and fewer when high, pulling your average cost below the average price.",
    "The real value of DCA is removing decisions: when to start, whether to buy in a fall, whether to chase a boom.",
    "Lump sums usually do better invested at once, but salary investing is DCA by nature.",
    "Automate the transfer and the purchase. Signals guide extra money, never the regular contribution.",
  ],
};
