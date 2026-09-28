import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "scams-and-red-flags",
  module: "mindset",
  title: "Scams and red flags",
  subtitle: "The people most likely to lose money are new investors with savings and hope. Learn the patterns before someone uses them on you.",
  minutes: 9,
  blocks: [
    {
      type: "p",
      text: "Now that you have a brokerage account and some knowledge, you have become a target. Scammers do not look for fools. They look for people who have just started, have money to invest, and do not yet know what normal looks like. This lesson shows you what normal looks like so that abnormal stands out.",
    },
    { type: "h2", text: "The arithmetic that exposes almost everything" },
    {
      type: "p",
      text: "Warren Buffett, widely considered the most successful investor alive, has compounded at roughly 20% a year over six decades. The world stock market has returned about 7% to 10% a year over long periods. Anyone promising you more than Buffett, reliably, is either lying or does not understand their own product.",
    },
    {
      type: "example",
      title: "Why 40% a year forever is impossible",
      steps: [
        "Someone promises a guaranteed 40% a year. You invest $1,000.",
        "After 10 years: 1,000 × 1.40^10 ≈ 1,000 × 28.9 = about $28,900.",
        "After 30 years: 1,000 × 1.40^30 ≈ 1,000 × 24,200 = about $24 million.",
        "If they could really do this, they would not need your $1,000. They would borrow from a bank at 8% and keep the difference forever.",
      ],
      result: "The offer refutes itself. Real returns of 40% exist for a year or two by luck, never as a guarantee. Try the widget to see the curve.",
    },
    {
      type: "widget",
      widget: "compound",
      props: { initial: 1000, monthly: 0, years: 10, rate: 40 },
      caption: "Set the rate to 40% and stretch the years to 30. Then ask yourself why anyone with this machine would be advertising to you.",
    },
    { type: "h2", text: "The red flags" },
    {
      type: "steps",
      title: "If you see one of these, stop",
      steps: [
        { title: "Guaranteed returns", text: "Nothing that earns more than a bank deposit is guaranteed. The word itself is the warning." },
        { title: "Signals groups and paid tips", text: "Telegram or WhatsApp groups selling buy and sell signals. If the signals worked, the seller would use them quietly and be rich. They make money from subscriptions, not trading." },
        { title: "Influencer confidence", text: "Someone with a rented car and a screenshot of gains. Screenshots are free. Audited track records are not, and they never have one." },
        { title: "Pump and dump", text: "A small coin or stock gets promoted everywhere at once. Insiders bought earlier and sell into the crowd you are part of. The price then collapses." },
        { title: "Unregulated platforms", text: "A shiny app with no licence from a real regulator. Your money enters; it does not come back." },
        { title: "Pressure to hurry", text: "\"The offer closes tonight.\" Real investments are there tomorrow. Urgency exists to stop you thinking." },
        { title: "Withdrawal problems", text: "You can deposit instantly but withdrawing needs \"verification\", a \"tax payment\" or a \"release fee\". You will never see the money. Do not pay the fee." },
        { title: "Romance and friendship leads", text: "A new online friend who gradually turns the conversation to a crypto opportunity. The relationship is the product; you are the target." },
      ],
    },
    { type: "h2", text: "Legal products that still empty accounts" },
    {
      type: "p",
      text: "Not everything dangerous is a scam. Some things are legal, regulated, and still ruinous for beginners.",
    },
    {
      type: "table",
      headers: ["Product", "The pitch", "The reality"],
      rows: [
        ["CFDs and leveraged trading", "Trade with 30 times your money", "Regulators' own data: 70% to 80% of retail accounts lose money"],
        ["Day-trading courses", "Learn to make a living from charts", "The course is the business, not the trading"],
        ["Options for income", "Collect premium every week", "Small steady gains until one large loss erases years"],
        ["Meme stocks and micro-cap coins", "Get in early", "You are the exit liquidity for whoever got in earlier"],
      ],
      caption: "Legal does not mean suitable. None of these belongs in a beginner's long-term plan.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Leverage is the fastest way to zero",
      text: "Borrowing to invest turns a 30% fall in the asset into a 100% loss of your money at about 3 times leverage. At 30 times, a 3% move wipes you out. Bearings has no leverage features on purpose. See [volatility](/learn/volatility) for why even 1× is plenty.",
    },
    { type: "h2", text: "How to check something is real" },
    {
      type: "list",
      items: [
        "Look up the broker or platform on its regulator's public register: the SEC and FINRA in the US, the FCA in the UK, BaFin in Germany, CySEC in Cyprus, the National Bank of Georgia locally. If it is not there, it is not regulated.",
        "Search the company name together with the words \"scam\", \"withdrawal\" and \"review\". Read the one-star reviews first.",
        "Check that the fund or stock exists on a real exchange. Type it into Explore; if the data source has never heard of it, ask why.",
        "Never send money to an individual, a wallet address given in a chat, or a company you found through an advertisement or a stranger.",
        "Ask: how does this person make money? If the answer is \"from me, whether or not the investment works\", walk away.",
      ],
    },
    {
      type: "callout",
      tone: "key",
      title: "Boring is the tell of the real thing",
      text: "Real investing is a world index fund, a monthly transfer, and a fee of 0.2% a year. Nobody makes a flashy video about it because nobody gets rich selling it to you. That is exactly why it works. See [index funds](/learn/index-funds) and [behavioural traps](/learn/behavioural-traps).",
    },
    {
      type: "terms",
      terms: [
        { term: "Pump and dump", def: "Promoting an asset to inflate its price, then selling to the buyers you attracted." },
        { term: "CFD", def: "Contract for difference: a leveraged bet on price moves without owning the asset." },
        { term: "Leverage", def: "Borrowed money used to make a position larger than your capital." },
        { term: "Regulator", def: "The public body that licenses financial firms and keeps a searchable register." },
        { term: "Exit liquidity", def: "Late buyers whose money lets early buyers sell at the top." },
      ],
    },
  ],
  quiz: [
    {
      q: "A scheme promises a guaranteed 40% a year. Roughly what would $1,000 become in 10 years if that were true?",
      options: ["$4,000", "$14,000", "$29,000", "$400,000"],
      answer: 2,
      explain: "1.40^10 ≈ 28.9, so about $28,900. Nobody with such a machine would need your $1,000.",
    },
    {
      q: "You can deposit instantly on a platform, but withdrawing requires paying a \"release fee\" first. What should you do?",
      options: ["Pay the fee to unlock your money", "Pay half the fee as a test", "Do not pay; this is the classic withdrawal scam and the money is already gone", "Deposit more to reach a higher tier"],
      answer: 2,
      explain: "Legitimate brokers never charge to release your own money. The fee is the second theft, and there will be a third.",
    },
    {
      q: "Roughly what share of retail CFD accounts lose money, according to regulators' required disclosures?",
      options: ["5% to 10%", "30% to 40%", "70% to 80%", "Nobody knows"],
      answer: 2,
      explain: "European brokers must publish this figure, and it consistently sits around 70% to 80%. Leverage is the reason.",
    },
    {
      q: "What is the most reliable single question to ask about anyone offering you an investment?",
      options: ["How many followers do they have?", "How do they make money, and is it from me regardless of results?", "Do they have a nice office?", "Have they shown a screenshot of gains?"],
      answer: 1,
      explain: "If their income comes from your fees or subscriptions rather than from the investment working, their incentive is to sell you, not to be right.",
    },
  ],
  takeaways: [
    "The world market returns about 7% to 10% a year; the greatest investor alive managed about 20%. Guaranteed higher returns refute themselves.",
    "Red flags: guarantees, signals groups, urgency, unregulated platforms, withdrawal fees, strangers turning friendly then financial.",
    "Legal products can still be ruinous: leverage, CFDs, options for income, and day-trading courses.",
    "Check the regulator's register, read the one-star reviews, and ask how the seller gets paid. Boring is the mark of the real thing.",
  ],
};
