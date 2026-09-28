import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "what-is-investing",
  module: "foundations",
  title: "What investing actually is",
  subtitle: "Owning a slice of real businesses, and letting time do the heavy lifting.",
  minutes: 8,
  blocks: [
    {
      type: "p",
      text: "Most people imagine investing as a screen full of flashing numbers and someone shouting \"buy!\". That is trading, and it is a small, noisy corner of a much calmer world. Investing, in the sense this course teaches, is simple: you use money you do not need right now to **own a piece of something that produces value**, and you let that ownership grow for years.",
    },
    {
      type: "p",
      text: "When you buy a share of a company, you own a tiny fraction of it. Not a picture of it, not a bet on it. A real fraction of its factories, software, brands and, most importantly, its profits.",
    },
    { type: "h2", text: "Saving, investing and speculating" },
    {
      type: "p",
      text: "These three words get mixed up constantly, and the confusion costs people money. They are different activities with different purposes.",
    },
    {
      type: "table",
      headers: ["Activity", "What you do", "What you expect", "Time frame"],
      rows: [
        ["Saving", "Keep money safe and reachable (bank, deposit)", "Roughly the same money back, slowly losing to inflation", "Weeks to a couple of years"],
        ["Investing", "Own productive assets: companies, funds, bonds", "Growth over years, with bumps along the way", "5 years to decades"],
        ["Speculating", "Bet on a price moving before something changes", "Fast gains, usually fast losses", "Minutes to months"],
      ],
      caption: "Saving protects, investing grows, speculating gambles.",
    },
    {
      type: "callout",
      tone: "key",
      title: "The one-sentence definition",
      text: "Investing is buying ownership in things that make money, then holding them long enough for the profits, not the mood of the market, to decide your result.",
    },
    { type: "h2", text: "Where the returns come from" },
    {
      type: "p",
      text: "A share does not grow in value by magic. It grows because the business behind it does one or more of three things:",
    },
    {
      type: "list",
      items: [
        "**Earns profit.** A company sells things for more than they cost to make. That profit belongs to the owners, including you.",
        "**Pays dividends.** Many companies send part of the profit to shareholders as cash, a few times a year. Learn more in [dividends](/learn/dividends).",
        "**Grows.** A company that reinvests profit into new products or markets becomes worth more, and its share price tends to follow over time.",
      ],
    },
    {
      type: "example",
      title: "One share of a coffee chain",
      steps: [
        "The chain has 1,000,000 shares and earns 5,000,000 USD profit this year.",
        "Profit per share: 5,000,000 ÷ 1,000,000 = 5 USD.",
        "It pays 2 USD per share as a dividend and keeps 3 USD per share to open new shops.",
        "You own 100 shares, so you receive 100 × 2 = 200 USD in cash this year.",
        "The 3 USD per share it kept (300 USD for your 100 shares) is still yours. It is now inside new shops that should earn more profit next year.",
      ],
      result: "Your return has two parts: 200 USD you can see in your account, and 300 USD of extra value working inside the business.",
    },
    { type: "h2", text: "Why prices jump around every day" },
    {
      type: "p",
      text: "If returns come from slow, boring things like profit and growth, why does the price move every single day? Because the daily price is set by the *mood* of buyers and sellers, not by the value of the business. Some days people are scared, some days greedy. News, rumours, interest rates and plain boredom all push the price around.",
    },
    {
      type: "p",
      text: "Over a week, mood is almost the whole story. Over ten years, mood mostly cancels out and the business is the story. This is why a long-term investor can shrug at a bad month: the thing they own did not change, only its price tag did.",
    },
    {
      type: "widget",
      widget: "live-chart",
      props: { symbol: "VOO", range: "10y" },
      caption: "Switch the range between 1 month and 10 years. Notice how the same fund looks like chaos up close and like a steady climb from a distance.",
    },
    { type: "h2", text: "Time is the main ingredient" },
    {
      type: "p",
      text: "Broad baskets of large companies, like the 500 biggest in the United States, have returned roughly **7 to 10% a year on average** over long stretches of history. That average hides enormous swings: some years were up 30%, some were down 40%. Nobody knows which kind next year will be, and, honestly, nobody needs to.",
    },
    {
      type: "p",
      text: "What matters is that the average has been positive, and that the longer you stay in, the more the average dominates the swings. Ten years of a 7% average turns 1,000 USD into about 1,967 USD. Thirty years turns it into about 7,612 USD. That is the engine of [compounding](/learn/compounding), the subject of the next lesson but one.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "What this course will not do",
      text: "It will not tell you which stock will double next year. Nobody can, and anyone who claims otherwise is selling something. It will teach you how to own the whole market cheaply, add to it every month, understand the numbers, and sleep well.",
    },
    {
      type: "terms",
      terms: [
        { term: "Share (stock)", def: "A unit of ownership in a company. Owning shares makes you a part-owner." },
        { term: "Return", def: "What you gain or lose on an investment, usually expressed as a percentage per year." },
        { term: "Dividend", def: "Cash a company pays out of its profits to shareholders." },
        { term: "Market", def: "All the buyers and sellers of an asset, and the price they currently agree on." },
        { term: "Speculation", def: "Betting on a price change without owning something that produces value." },
      ],
    },
  ],
  quiz: [
    {
      q: "When you buy a share of a company, what do you actually own?",
      options: [
        "A promise that the price will rise",
        "A small real fraction of the company and its profits",
        "A loan that the company must repay you",
        "A ticket that expires after one year",
      ],
      answer: 1,
      explain: "A share is a piece of ownership. You are entitled to your fraction of the profits and the growth of the business.",
    },
    {
      q: "Over a single week, what mostly decides a stock's price movement?",
      options: [
        "The company's ten-year growth plan",
        "The mood of buyers and sellers",
        "The dividend paid last year",
        "The number of employees",
      ],
      answer: 1,
      explain: "Short-term prices are driven by sentiment and news. The business itself changes slowly.",
    },
    {
      q: "Which of these is speculating rather than investing?",
      options: [
        "Buying a fund of 500 companies and holding it for 20 years",
        "Buying shares of a profitable company you plan to hold for a decade",
        "Buying a coin today because you think its price will jump by Friday",
        "Adding 100 USD a month to a global index fund",
      ],
      answer: 2,
      explain: "A bet on a short-term price move, without owning something productive, is speculation.",
    },
    {
      q: "Roughly what long-run average yearly return have broad stock indexes delivered historically?",
      options: ["0 to 1%", "7 to 10%", "25 to 30%", "50% or more"],
      answer: 1,
      explain: "About 7 to 10% a year on average, with very large swings from year to year.",
    },
  ],
  takeaways: [
    "Investing means owning productive assets, not betting on price moves.",
    "Returns come from profits, dividends and growth, which move slowly. Daily prices are mood.",
    "Time is the main ingredient: the longer you hold, the more the average return dominates the swings.",
    "Nobody can predict next year. You do not need to.",
  ],
};
