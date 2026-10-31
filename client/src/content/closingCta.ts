export interface ClosingCtaContent {
  title: string;
  paragraph: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  metricBadge: string;
  bannerDetail: {
    title: string;
    metrics: Array<{
      label: string;
      value: string;
    }>;
  };
}

export const closingCtaContent: ClosingCtaContent = {
  title: "Ready to optimize your retail pricing architecture?",
  paragraph:
    "Schedule a custom demonstration with our retail econometric team using your historical SKU transaction sample.",
  primaryButtonText: "Talk to an expert",
  secondaryButtonText: "Request sample audit",
  metricBadge: "Average 90-day time to value",
  bannerDetail: {
    title: "Autonomous Enterprise Pricing Console",
    metrics: [
      { label: "Active Monitored SKUs", value: "2,940,000+" },
      { label: "Sub-Second Ingestion Rate", value: "48,000 req/sec" },
      { label: "Audited Gross Lift", value: "+4.2% Net Margin" },
    ],
  },
};

