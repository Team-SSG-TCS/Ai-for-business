export interface SplitFeatureContent {
  eyebrow: string;
  title: string;
  paragraph: string;
  bullets: Array<{
    title: string;
    description: string;
  }>;
  cta: {
    label: string;
    href: string;
  };
  visual: {
    badge: string;
    metricLabel: string;
    metricValue: string;
    secondaryMetricLabel: string;
    secondaryMetricValue: string;
    diagramTitle: string;
    stages: Array<{
      name: string;
      speed: string;
      status: string;
    }>;
  };
}

export const splitFeatureContent: SplitFeatureContent = {
  eyebrow: "Continuous Econometric Learning",
  title: "Predict demand shifts before they erode your category margins",
  paragraph:
    "Traditional rules-based spreadsheets fail when input inflation, regional supply delays, and competitor promotions hit simultaneously. Our neural econometric engine models cross-elasticity and substitution behavior in real time.",
  bullets: [
    {
      title: "Cross-elasticity mapping",
      description: "Detect cannibalization across private label and tier-one branded products automatically.",
    },
    {
      title: "Omnichannel inventory sync",
      description: "Dynamically adjust store-level prices based on localized inventory depletion rates.",
    },
    {
      title: "Human-governed boundaries",
      description: "Enforce absolute floor and ceiling margin guardrails with one-click merchant veto.",
    },
  ],
  cta: {
    label: "Talk to an expert",
    href: "#demo-modal",
  },
  visual: {
    badge: "Continuous Neural Econometric Engine",
    metricLabel: "Autonomous Decision Speed",
    metricValue: "<850ms",
    secondaryMetricLabel: "Confidence Threshold",
    secondaryMetricValue: "99.2%",
    diagramTitle: "End-to-End Decision Pipeline",
    stages: [
      { name: "POS & ERP Catalog Ingestion", speed: "15ms", status: "Active" },
      { name: "Cross-SKU Elasticity Calculation", speed: "120ms", status: "Active" },
      { name: "Competitor Market Move Parity", speed: "65ms", status: "Active" },
      { name: "Gross Margin Bound Validation", speed: "25ms", status: "Passed" },
      { name: "Real-time API Dispatch to POS", speed: "30ms", status: "Deployed" },
    ],
  },
};

