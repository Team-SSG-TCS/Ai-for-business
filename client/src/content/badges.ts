export interface BadgeItem {
  id: string;
  name: string;
  organization: string;
  category: string;
  year: string;
}

export interface BadgeRowContent {
  eyebrow: string;
  badges: BadgeItem[];
}

export const badgesContent: BadgeRowContent = {
  eyebrow: "Global Analyst & Industry Recognitions",
  badges: [
    {
      id: "gartner",
      name: "Representative Vendor",
      organization: "Gartner Market Guide",
      category: "Retail Price Optimization",
      year: "2026",
    },
    {
      id: "idc",
      name: "Major Player",
      organization: "IDC MarketScape",
      category: "Worldwide Retail AI",
      year: "2025",
    },
    {
      id: "g2-leader",
      name: "Category Leader",
      organization: "G2 Enterprise Grid",
      category: "Pricing & Revenue Management",
      year: "2026",
    },
    {
      id: "capterra",
      name: "Best Ease of Use",
      organization: "Capterra Value Index",
      category: "Top Rated Retail Software",
      year: "2025",
    },
    {
      id: "retail-tech",
      name: "Innovation Winner",
      organization: "Retail Systems Awards",
      category: "Best Omnichannel AI Tool",
      year: "2025",
    },
    {
      id: "soc2",
      name: "Type II Verified",
      organization: "AICPA SOC",
      category: "Security & Data Governance",
      year: "2026",
    },
  ],
};

