export interface AwardItem {
  eyebrow: string;
  title: string;
  href: string;
}

export interface AwardsStripContent {
  items: AwardItem[];
}

export const awardsContent: AwardsStripContent = {
  items: [
    {
      eyebrow: "Gartner 2026",
      title: "Representative Vendor in Retail Pricing AI",
      href: "#news",
    },
    {
      eyebrow: "IDC MarketScape",
      title: "Major Player in Worldwide Retail Price Optimization",
      href: "#news",
    },
    {
      eyebrow: "G2 Enterprise Grid",
      title: "Top 5 Leader in Algorithmic Merchandising",
      href: "#news",
    },
    {
      eyebrow: "Retail Technology Awards",
      title: "Best Omnichannel Innovation Platform",
      href: "#news",
    },
  ],
};

