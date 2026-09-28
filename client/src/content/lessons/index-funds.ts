import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "index-funds",
  module: "plan",
  title: "Index funds: own the whole market",
  subtitle: "Why copying a list beats most professionals, and which funds a Georgian investor can actually buy.",
  minutes: 10,
  blocks: [
    {
      type: "p",
      text: "Here is a fact that upsets a lot of well-paid people: over long periods, the large majority of professional fund managers fail to beat a simple, unmanaged list of stocks. Not because they are stupid, but because they charge fees and trade a lot, and the list does neither. Index funds are the way you buy the list.",
    },
    { type: "h2", text: "What an index is" },
    {
      type: "p",
      text: "An **index** is a published list of companies with a rule for how much of each to hold. The S&P 500 is the roughly 500 largest US companies, weighted by size. MSCI World covers about 1,400 large and mid-sized companies across 23 developed countries. FTSE All-World adds emerging markets too, for over 3,000 companies in total.",
    },
    {
      type: "p",
      text: "An **index fund** simply buys everything on the list in the stated proportions. When the list changes, the fund changes. No one is guessing which company will do well. You get the average of the whole market, which sounds unambitious until you learn what the professionals achieve.",
    },
    { type: "h2", text: "Why the average beats most experts" },
    {
      type: "p",
      text: "Before fees, the average active manager earns roughly the market return, because together they *are* the market. After fees of 1% to 2% a year, plus trading costs, most fall behind. Studies covering 15-year periods consistently find that around 85 to 90% of actively managed US stock funds trail their index. The few that win are hard to identify in advance, and rarely keep winning.",
    },
    {
      type: "example",
      title: "The fee gap over 30 years",
      steps: [
        "Two funds track the same market, which returns 7% a year before fees.",
        "Index fund fee: 0.2%. Net return: 6.8%. 10,000 grows to 10,000 × 1.068^30 ≈ 72,000.",
        "Active fund fee: 1.5%. Net return: 5.5%. 10,000 grows to 10,000 × 1.055^30 ≈ 49,800.",
        "Difference: 72,000 − 49,800 ≈ 22,000 USD.",
      ],
      result: "Even if the active manager matched the market perfectly, the fee alone costs you about 22,000 USD on a 10,000 investment. Most do not match the market.",
    },
    {
      type: "callout",
      tone: "key",
      title: "The quiet superpower",
      text: "You do not need to be right about anything. You need to own everything, pay almost nothing for it, and wait. The [fees lesson](/learn/fees) shows how much that \"almost nothing\" matters.",
    },
    { type: "h2", text: "Accumulating or distributing" },
    {
      type: "p",
      text: "European ETFs come in two flavours. **Distributing** funds pay dividends out to your account as cash. **Accumulating** funds reinvest the dividends inside the fund automatically, so the unit price grows a little faster and you never have to do anything. For a long-term investor building a pot, accumulating is simpler: no cash sitting idle, no small purchases to make, and often simpler tax records. Fund names usually show it: \"Acc\" or \"C\" for accumulating, \"Dist\" or \"D\" for distributing.",
    },
    { type: "h2", text: "Funds a Georgian investor can buy" },
    {
      type: "p",
      text: "Most of what you read online about index funds is written for Americans and mentions US-listed ETFs like `VOO`, `VTI` and `SPY`. Because of European rules (called PRIIPs), brokers serving Europe and neighbouring countries usually cannot sell those to you. You can still look at their long histories in [Explore](/explore) to learn from, but you will buy the European equivalents, called **UCITS ETFs**, listed in Frankfurt, Amsterdam, London or Milan.",
    },
    {
      type: "table",
      headers: ["What it tracks", "Example ETF (ticker)", "Companies", "Type"],
      rows: [
        ["FTSE All-World (developed + emerging)", "VWCE (Frankfurt: VWCE.DE)", "over 3,000", "Accumulating"],
        ["MSCI World (developed only)", "IWDA (Amsterdam: IWDA.AS)", "about 1,400", "Accumulating"],
        ["S&P 500 (US large companies)", "VUAA (London: VUAA.L) or SXR8 (Frankfurt: SXR8.DE)", "about 500", "Accumulating"],
      ],
      caption: "Examples for learning, not recommendations. Check the current fee (TER), size and your broker's availability before buying.",
    },
    {
      type: "p",
      text: "The first row is the one-fund answer. A single all-world accumulating ETF holds thousands of companies across every major economy, reinvests its dividends, and charges around 0.2% a year. Many careful investors hold this and nothing else for decades. It is not a compromise; it is the strategy.",
    },
    {
      type: "widget",
      widget: "live-chart",
      props: { symbol: "VWCE.DE", range: "5y" },
      caption: "This is what owning the whole world has looked like. Zoom in to see the dips; zoom out to see what the dips became.",
    },
    { type: "h2", text: "How to read a fund's page" },
    {
      type: "list",
      items: [
        "**TER (total expense ratio):** the yearly fee. Under 0.25% is good for a broad index fund.",
        "**Index tracked:** which list it copies. Broader is usually better for a core holding.",
        "**Fund size:** larger funds (over 500 million USD or EUR) are less likely to close and trade more cheaply.",
        "**Replication:** \"physical\" means it actually holds the shares. Preferable to \"synthetic\" for a beginner.",
        "**Domicile:** most UCITS ETFs are based in Ireland or Luxembourg for tax efficiency. Ireland is usually the more favourable for US dividends.",
        "**Accumulating or distributing:** as above.",
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "Do not collect funds",
      text: "Beginners often buy an all-world fund, then an S&P 500 fund, then a tech fund, then an emerging markets fund, and end up owning the same companies four times with four sets of fees. One broad fund already contains them all. The [diversification lesson](/learn/diversification) explains what real diversification is.",
    },
    {
      type: "terms",
      terms: [
        { term: "Index", def: "A published list of companies and their weights, like the S&P 500 or MSCI World." },
        { term: "Index fund / ETF", def: "A fund that copies an index instead of picking stocks." },
        { term: "UCITS", def: "The European fund standard. UCITS ETFs are what non-US investors can normally buy." },
        { term: "TER", def: "Total expense ratio: the fund's yearly fee as a percentage of your money." },
        { term: "Accumulating", def: "A fund that reinvests dividends automatically." },
        { term: "Active fund", def: "A fund where a manager picks investments, usually for a higher fee." },
      ],
    },
  ],
  quiz: [
    {
      q: "Over 15-year periods, roughly what share of actively managed US stock funds have trailed their index?",
      options: ["About 10%", "About 50%", "About 85 to 90%", "None; professionals usually win"],
      answer: 2,
      explain: "Most active funds fall behind after fees and trading costs. The average of the market, bought cheaply, beats them.",
    },
    {
      q: "What does an accumulating ETF do with dividends?",
      options: [
        "Pays them to your bank account",
        "Reinvests them inside the fund automatically",
        "Donates them",
        "Holds them as cash forever",
      ],
      answer: 1,
      explain: "Accumulating funds reinvest dividends, so the unit price grows faster and you have nothing to do.",
    },
    {
      q: "Why can most investors in Georgia not buy the US-listed ETF VOO?",
      options: [
        "It is too expensive",
        "European PRIIPs rules stop brokers serving the region from selling US-listed funds",
        "It only accepts US citizens",
        "It was closed years ago",
      ],
      answer: 1,
      explain: "Regulation limits US-listed ETFs; the European UCITS equivalents such as VUAA or SXR8 track the same index.",
    },
    {
      q: "Which is the best description of a one-fund portfolio built on an all-world accumulating ETF?",
      options: [
        "A risky bet on one company",
        "A legitimate, complete long-term strategy holding thousands of companies",
        "Only suitable for the very wealthy",
        "Something that needs weekly adjustment",
      ],
      answer: 1,
      explain: "One broad accumulating fund provides global diversification, automatic reinvestment and low fees. Many investors hold it alone for decades.",
    },
  ],
  takeaways: [
    "An index fund copies a list of companies. No guessing, very low fees.",
    "Most professionals trail the index after fees. Owning the average, cheaply, beats them.",
    "From Georgia you buy UCITS ETFs (VWCE, IWDA, VUAA, SXR8 as examples), not US-listed ones.",
    "One all-world accumulating ETF is a complete strategy. Do not collect overlapping funds.",
  ],
};
