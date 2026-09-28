import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "brokers-and-taxes",
  module: "plan",
  title: "Opening an account from Georgia",
  subtitle: "Choosing a broker, moving lari into dollars, and the tax concepts you need to know about.",
  minutes: 10,
  blocks: [
    {
      type: "p",
      text: "Everything so far has been ideas. This lesson is logistics: how a person in Tbilisi with a GEL salary actually ends up owning a global index fund. It is less complicated than it looks, but there are a few places where being careful saves real money.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Read this first",
      text: "This lesson explains concepts. It is not tax, legal or financial advice, and rules, fees and broker availability change. Before opening an account or filing anything, check the current rules with the Georgian Revenue Service (rs.ge) or a qualified accountant, and verify each broker's current terms yourself.",
    },
    { type: "h2", text: "What a broker does" },
    {
      type: "p",
      text: "A **broker** is the company that holds your account, takes your money, buys the funds or shares you ask for, and keeps them safe in your name. You cannot buy an ETF directly from a stock exchange; you need a broker as the middleman. Their job is boring by design, and the best ones are cheap, regulated and reliable.",
    },
    { type: "h2", text: "Choosing one" },
    {
      type: "list",
      items: [
        "**Regulation.** Is the broker licensed by a serious regulator (for example in the EU, UK or US), and are client assets held separately from the broker's own money? This protects you if the broker fails.",
        "**Access to European ETFs.** You need UCITS ETFs listed in Frankfurt, Amsterdam or London, as explained in [index funds](/learn/index-funds). Confirm the broker offers them.",
        "**Fees.** Commission per trade, currency conversion cost, monthly or inactivity fees. Run the numbers from the [fees lesson](/learn/fees).",
        "**Funding from Georgia.** Can you send money from a Georgian bank, in GEL or USD, at a reasonable cost? Are withdrawals back to Georgia straightforward?",
        "**Usability and support.** Can you place a simple ETF purchase without a maze? Is there a savings-plan feature for [automatic monthly buys](/learn/dollar-cost-averaging)?",
      ],
    },
    {
      type: "p",
      text: "Georgian residents commonly use large international brokers such as Interactive Brokers or Freedom24, and some Georgian banks offer brokerage services of their own. Each has different fees, minimums and fund ranges, and these change. Treat any name here as a starting point for your own research, not a recommendation. Check the regulator's register, read the fee schedule to the end, and search for recent reviews from people in your situation.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "One test before committing",
      text: "Open the account, deposit a small amount, and buy one unit of a broad ETF. You will learn more about the broker's fees, speed and interface from that single transaction than from any comparison table.",
    },
    { type: "h2", text: "From lari to dollars" },
    {
      type: "p",
      text: "Your salary arrives in GEL. Global ETFs trade in USD or EUR. Somewhere in between, a conversion happens, and every conversion has a cost hidden in the exchange rate. Two sensible routes: convert at your bank into a USD account and send USD to the broker, or send GEL if the broker accepts it and let them convert. Compare the all-in rate you actually receive against the official mid-market rate; the gap is your real fee.",
    },
    {
      type: "example",
      title: "The cost of a poor exchange rate",
      steps: [
        "You want to invest 1,000 USD. The mid-market rate is 2.70 GEL per USD, so fair value is 2,700 GEL.",
        "Your bank quotes 2.75 GEL per USD. You pay 2,750 GEL.",
        "The extra 50 GEL is 50 ÷ 2,700 ≈ 1.85% of the transaction.",
        "Over a year of monthly investments, that is 12 × 50 = 600 GEL, gone before a single unit was bought.",
      ],
      result: "A 1.85% conversion cost is larger than most ETF fees for a whole decade. Shop the rate, and convert in larger batches if the fee is fixed per transfer.",
    },
    {
      type: "widget",
      widget: "currency",
      props: { amount: 1000, from: "GEL", to: "USD" },
      caption: "Enter what you plan to send each month and compare your bank's quoted rate with the market rate to see the real cost of the conversion.",
    },
    {
      type: "p",
      text: "Some investors keep part of their savings in USD or EUR already, to reduce the number of conversions and the risk of the lari moving against them right before a purchase. The [global investing lesson](/learn/global-investing) covers currency risk in more depth.",
    },
    { type: "h2", text: "Taxes: the concepts" },
    {
      type: "p",
      text: "You may owe tax in two places: where the company or fund is based, and where you live. Here are the ideas; the exact rates and filing rules for a Georgian resident are for the Revenue Service or an accountant to confirm.",
    },
    {
      type: "terms",
      terms: [
        { term: "Capital gain", def: "The profit when you sell something for more than you paid. Many countries tax it, often only when you actually sell, which is another reason to hold rather than trade." },
        { term: "Dividend withholding tax", def: "Tax taken at source, in the company's country, before a dividend reaches you or your fund. US dividends to Irish-domiciled ETFs are typically taxed at 15%; the fund handles it internally." },
        { term: "W-8BEN", def: "A form non-US investors sign at their broker declaring they are not US taxpayers. It applies the treaty rate to any US dividends you receive directly. Most brokers make you fill it in during sign-up." },
        { term: "Tax treaty", def: "An agreement between two countries that limits how much each can tax the same income, to prevent double taxation." },
        { term: "Accumulating fund", def: "Reinvests dividends internally. In some countries this simplifies tax because you receive no cash until you sell; in others it is taxed anyway. Check your case." },
      ],
    },
    {
      type: "callout",
      tone: "note",
      title: "Why accumulating UCITS ETFs are popular with non-US investors",
      text: "An Irish-domiciled accumulating world ETF pays a reduced withholding tax on US dividends thanks to the Ireland–US treaty, reinvests the rest, and sends you nothing to declare year by year in many jurisdictions. Whether that holds for a Georgian resident is exactly the kind of question to put to an accountant, but it is why these funds appear in every non-US beginner guide.",
    },
    { type: "h2", text: "Keep records" },
    {
      type: "steps",
      title: "Your one-folder tax system",
      steps: [
        { title: "Save every confirmation", text: "Each purchase and sale: date, ticker, units, price, fee, currency. Brokers provide statements; download them yearly." },
        { title: "Note the exchange rate", text: "If you may be taxed in GEL terms, you will need the rate on each purchase and sale date." },
        { title: "Record dividends", text: "If you hold distributing funds or single stocks, keep the dividend statements showing any tax already withheld." },
        { title: "Review once a year", text: "Before filing season, ask an accountant what applies to you. Bring the folder." },
      ],
    },
    {
      type: "p",
      text: "Good records turn tax from a source of anxiety into a half-hour yearly task. They also help you keep your own history straight: what you bought, why, and what you paid, which the [mindset lesson](/learn/how-to-think) will turn into a learning tool.",
    },
  ],
  quiz: [
    {
      q: "What is a broker?",
      options: [
        "A person who predicts stock prices",
        "The company that holds your account and buys and safeguards investments for you",
        "A type of index fund",
        "A government tax office",
      ],
      answer: 1,
      explain: "A broker is the regulated middleman between you and the exchange. It executes your orders and holds your assets.",
    },
    {
      q: "The mid-market rate is 2.70 GEL per USD and your bank charges 2.75. On a 1,000 USD conversion, what is the approximate cost?",
      options: ["5 GEL, about 0.2%", "50 GEL, about 1.85%", "500 GEL, about 18%", "There is no cost"],
      answer: 1,
      explain: "2,750 − 2,700 = 50 GEL extra, which is 50 ÷ 2,700 ≈ 1.85% of the transaction.",
    },
    {
      q: "What is the W-8BEN form for?",
      options: [
        "Opening a Georgian bank account",
        "Declaring to your broker that you are not a US taxpayer so treaty rates apply to US dividends",
        "Registering a company",
        "Requesting a loan from the broker",
      ],
      answer: 1,
      explain: "Non-US investors sign it at their broker to confirm their status and receive the applicable treaty withholding rate.",
    },
    {
      q: "Where should a Georgian resident confirm how their investment gains and dividends are taxed?",
      options: [
        "In this lesson",
        "From a forum post",
        "With the Revenue Service or a qualified accountant",
        "It is never taxed, so nowhere",
      ],
      answer: 2,
      explain: "Rules and rates change and depend on your situation. This lesson explains concepts only; confirm specifics with the authority or a professional.",
    },
  ],
  takeaways: [
    "Choose a regulated, low-fee broker that offers European UCITS ETFs and accepts funding from Georgia. Test it with a small purchase.",
    "Currency conversion is a hidden fee. Compare the rate you get with the mid-market rate and batch conversions if needed.",
    "Understand capital gains, withholding tax, W-8BEN and treaties as concepts, then confirm your own rules with the Revenue Service or an accountant.",
    "Keep every confirmation in one folder. Tax becomes a yearly half-hour.",
  ],
};
