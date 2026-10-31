export interface HeroContent {
  eyebrow: string;
  titleRegular: string;
  titleBold: string;
  supportingCopy: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  socialProof: {
    leadText: string;
    rating: string;
    reviewCountText: string;
    badges: Array<{
      name: string;
      score: string;
    }>;
  };
  dashboardPreview: {
    activeCategory: string;
    grossMarginGain: string;
    optimizedSkus: string;
    forecastAccuracy: string;
    timeframe: string;
    confidenceScore: string;
  };
}

export const heroContent: HeroContent = {
  eyebrow: "Enterprise Retail AI Platform",
  titleRegular: "Pricing AI solutions for ",
  titleBold: "enterprise retail",
  supportingCopy:
    "Understand why your customers buy, predict how they'll react to price changes, and deliver prices that reflect your competitive position and customer perceived value.",
  primaryCta: {
    label: "REQUEST A DEMO",
    href: "#demo-modal",
  },
  secondaryCta: {
    label: "Watch product tour",
    href: "#feature-tabs",
  },
  socialProof: {
    leadText: "Trusted by 50+ retailers across the globe",
    rating: "4.9",
    reviewCountText: "G2, Capterra & Crozdesk",
    badges: [
      { name: "Capterra", score: "5.0 ★" },
      { name: "G2 Leader", score: "4.9 ★" },
      { name: "Crozdesk", score: "4.9 ★" },
    ],
  },
  dashboardPreview: {
    activeCategory: "Office furniture & accessories - UK",
    grossMarginGain: "+4.8%",
    optimizedSkus: "2.9M",
    forecastAccuracy: "96.4%",
    timeframe: "Last 30 days",
    confidenceScore: "99.2%",
  },
};
