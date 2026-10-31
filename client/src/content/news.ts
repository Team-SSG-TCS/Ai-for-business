export interface NewsArticleItem {
  typeLabel: "Article" | "Report" | "Case Study";
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  href: string;
  tag: string;
}

export interface NewsGridContent {
  eyebrow: string;
  title: string;
  subheadline: string;
  articles: NewsArticleItem[];
}

export const newsContent: NewsGridContent = {
  eyebrow: "Industry Research & Insights",
  title: "Latest findings in retail algorithmic economics",
  subheadline:
    "Peer-reviewed research and executive perspectives on pricing intelligence, margin defense, and demand forecasting.",
  articles: [
    {
      typeLabel: "Report",
      title: "Gartner Market Guide for Retail Unified Price Optimization",
      excerpt:
        "Analysis of machine learning capabilities transforming multi-tier price architecture across global retail organizations.",
      date: "October 2026",
      readTime: "12 min read",
      href: "#",
      tag: "Analyst Research",
    },
    {
      typeLabel: "Article",
      title: "Cross-Elasticity Modeling: Eliminating Category Cannibalization",
      excerpt:
        "How neural networks isolate substitute effects across private label and national brand products during inflationary spikes.",
      date: "September 2026",
      readTime: "8 min read",
      href: "#",
      tag: "Econometrics",
    },
    {
      typeLabel: "Case Study",
      title: "How 450 Supermarket Locations Automated Markdown Timing",
      excerpt:
        "A deep dive into operationalizing real-time shelf life sensors with dynamic discount calculations at store level.",
      date: "August 2026",
      readTime: "6 min read",
      href: "#",
      tag: "Field Implementation",
    },
  ],
};

