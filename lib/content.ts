// Homepage copy for Solstra Capital — a FICTIONAL company used as a design preset.
// All names, figures, addresses and tickers are invented placeholders; replace per client.
// Photography is placeholder editorial imagery (Unsplash).

export const nav = [
  {
    label: "About Solstra",
    href: "#active-thinking",
    intro: "An independent, high-conviction investment house, founded in London in 1991.",
    links: [
      { label: "Our story", image: "/images/london.jpg" },
      { label: "Our people", image: "/images/careers.jpg" },
      { label: "Leadership", image: "/images/boardroom.jpg" },
      { label: "Responsibility", image: "/images/stewardship.jpg" },
    ],
  },
  {
    label: "Investment",
    href: "#investment",
    intro: "Fourteen specialist teams, each free to pursue its own investment philosophy.",
    links: [
      { label: "Equities", image: "/images/equities.jpg" },
      { label: "Fixed income", image: "/images/fixed-income.jpg" },
      { label: "Multi-asset", image: "/images/multi-asset.jpg" },
      { label: "Alternatives", image: "/images/alternatives.jpg" },
    ],
  },
  {
    label: "Stewardship",
    href: "#investment",
    intro: "Active ownership as a natural extension of active management.",
    links: [
      { label: "Our approach", image: "/images/stewardship.jpg" },
      { label: "Engagement", image: "/images/corridor.jpg" },
      { label: "Reports & policies", image: "/images/independent.jpg" },
    ],
  },
  {
    label: "Investor relations",
    href: "#investor-relations",
    intro: "Information for current and potential shareholders of Solstra Group plc.",
    links: [
      { label: "Investor relations", image: "/images/london.jpg" },
      { label: "Board & governance", image: "/images/boardroom.jpg" },
      { label: "Results & reports", image: "/images/corridor.jpg" },
      { label: "Share price information", image: "/images/trajectory.jpg" },
    ],
  },
  { label: "Careers", href: "#careers" },
] as const;

export const metrics = [
  {
    value: "48.6",
    prefix: "£",
    suffix: "B",
    spoken: "£48.6 billion",
    label: "Assets under management",
    note: "Entrusted to us by clients around the world. Illustrative figure.",
  },
  {
    value: "1991",
    spoken: "1991",
    label: "Founded",
    note: "Over three decades of independent investing from London.",
  },
  {
    value: "14",
    spoken: "14",
    label: "Investment teams",
    note: "Each free to follow its own philosophy — no house view.",
  },
] as const;

export const chapters = [
  {
    title: "Curiosity",
    text: "Great investment ideas begin with better questions. Our managers look further, dig deeper and challenge what the market takes for granted.",
    image: "/images/curiosity.jpg",
    alt: "Morning mist rolling over a green escarpment at sunrise",
  },
  {
    title: "Independent thinking",
    text: "There is no house view at Solstra. Each team is free to form its own conclusions — and accountable for them.",
    image: "/images/independent.jpg",
    alt: "Angular white architecture against a pale sky",
  },
  {
    title: "Conviction",
    text: "We build concentrated, high-conviction portfolios that look different from the benchmark, because that is where genuine value is created.",
    image: "/images/conviction.jpg",
    alt: "A sharp snow-covered mountain peak",
  },
  {
    title: "Opportunity",
    text: "Markets change constantly. Active managers can move with them — exploring every corner of their investment universe.",
    image: "/images/opportunity.jpg",
    alt: "Aerial view of waves meeting a pale shoreline",
  },
  {
    title: "Long-term perspective",
    text: "We invest with patience, focused on the outcomes that matter to our clients over years and decades, not quarters.",
    image: "/images/long-term.jpg",
    alt: "Mountain peaks rising above a sea of clouds at dusk",
  },
] as const;

export const capabilities = [
  {
    title: "Equities",
    text: "Unconstrained, high-conviction strategies across the UK, Europe, Japan, the US, global and emerging markets.",
    tags: ["UK", "Europe", "Global", "Emerging markets", "Japan"],
    image: "/images/equities.jpg",
  },
  {
    title: "Fixed income",
    text: "Flexible, benchmark-agnostic approaches to bonds, credit and income, actively managed through the cycle.",
    tags: ["Strategic bond", "Global high yield", "Emerging debt"],
    image: "/images/fixed-income.jpg",
  },
  {
    title: "Multi-asset",
    text: "Diversified portfolios that combine asset classes in pursuit of clear outcomes rather than benchmarks.",
    tags: ["Income", "Growth", "Balanced"],
    image: "/images/multi-asset.jpg",
  },
  {
    title: "Alternatives",
    text: "Absolute return and specialist strategies designed to add genuine diversification to client portfolios.",
    tags: ["Absolute return", "Systematic", "Gold & silver"],
    image: "/images/alternatives.jpg",
  },
  {
    title: "Stewardship",
    text: "Active ownership — engaging with the companies we invest in to support long-term, sustainable value creation.",
    tags: ["Engagement", "Voting", "Sustainability"],
    image: "/images/stewardship.jpg",
  },
] as const;

export const pathways = [
  {
    title: "Institutional",
    text: "Pension schemes, insurers, sovereign wealth funds and consultants partnering with our specialist teams.",
    image: "/images/institutional.jpg",
    alt: "Stone-clad city street at dusk",
  },
  {
    title: "Professional",
    text: "Financial advisers, wealth managers and fund selectors seeking differentiated, active strategies.",
    image: "/images/professional.jpg",
    alt: "Portrait of a professional in a dark jacket",
  },
  {
    title: "Individual",
    text: "Private investors building their future with our funds, investment trusts and ISAs.",
    image: "/images/individual.jpg",
    alt: "Portrait of a smiling woman",
  },
] as const;

export const investorLinks = [
  {
    title: "Investor relations",
    text: "Strategy, performance and everything our shareholders need.",
    meta: "Shareholders",
    image: "/images/london.jpg",
  },
  {
    title: "Board & governance",
    text: "Our Board, its committees and our approach to corporate governance.",
    meta: "Leadership",
    image: "/images/boardroom.jpg",
  },
  {
    title: "Results & reports",
    text: "Annual reports, interim results and regulatory announcements.",
    meta: "Reporting",
    image: "/images/corridor.jpg",
  },
  {
    title: "Share price information",
    text: "Share price, historical data and dividend information.",
    meta: "LSE: SLST",
    image: "/images/trajectory.jpg",
  },
] as const;
