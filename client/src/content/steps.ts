export interface ProcessStepItem {
  id: "01" | "02" | "03" | "04" | "05";
  numberText: string;
  title: string;
  description: string;
  deliverable: string;
  visualDetail: {
    tag: string;
    headline: string;
    dataPoints: Array<{
      label: string;
      value: string;
    }>;
  };
}

export interface ProcessStepperContent {
  eyebrow: string;
  titleRegular: string;
  titleGreen: string;
  subheadline: string;
  actionButtonText: string;
  steps: ProcessStepItem[];
}

export const processStepperContent: ProcessStepperContent = {
  eyebrow: "Workflow Architecture",
  titleRegular: "How Competera's ",
  titleGreen: "retail price optimization software works",
  subheadline: "From raw data ingestion to continuous algorithmic pricing in your stores and ecommerce channels.",
  actionButtonText: "See platform in action",
  steps: [
    {
      id: "01",
      numberText: "01",
      title: "Data Integration & Preprocessing",
      description:
        "We connect and prepare your internal retail data, then enrich it with external market signals so the models are trained for your specific business context.",
      deliverable: "Standardized 99.8% clean catalog data stream",
      visualDetail: {
        tag: "Phase 1: Ingestion & Enrichment",
        headline: "ERP, PIM & POS Data Preprocessing",
        dataPoints: [
          { label: "Historical Records Cleansed", value: "3 Years POS Data" },
          { label: "External Market Signals", value: "Competitors, Seasonality, Weather" },
          { label: "Reconciliation Rate", value: "99.98% Precision" },
        ],
      },
    },
    {
      id: "02",
      numberText: "02",
      title: "ML Model Preparation & Training",
      description:
        "While the platform already supports algorithmic pricing, dedicated ML models are validated against historical patterns to ensure reliable recommendations.",
      deliverable: "Backtested neural elasticity curves",
      visualDetail: {
        tag: "Phase 2: Econometric Modeling",
        headline: "Dedicated Machine Learning Training",
        dataPoints: [
          { label: "Demand Drivers Modeled", value: "24 Internal & External" },
          { label: "Cannibalization Factor", value: "Calculated Real-Time" },
          { label: "Model Validation Fit", value: "R² = 0.96 Verified" },
        ],
      },
    },
    {
      id: "03",
      numberText: "03",
      title: "Boundary Guardrail Configuration",
      description:
        "Establish absolute ceiling and floor margins, MAP guidelines, competitive index rules, and merchant approval thresholds.",
      deliverable: "Deterministic margin safety boundaries",
      visualDetail: {
        tag: "Phase 3: Guardrail Definition",
        headline: "Deterministic Constraint Protection",
        dataPoints: [
          { label: "Minimum Margin Threshold", value: "Locked at 22.5%" },
          { label: "Max Daily Price Shift", value: "Bounded ±4.5%" },
          { label: "Legal & MAP Enforcement", value: "Automated Hard-Stop" },
        ],
      },
    },
    {
      id: "04",
      numberText: "04",
      title: "A/B Category Testing & Validation",
      description:
        "Deploy recommendations across 10% to 20% of your store network or digital catalog to measure margin lift against control groups.",
      deliverable: "Statistically verified financial lift",
      visualDetail: {
        tag: "Phase 4: Statistical Validation",
        headline: "Rigorous Cluster A/B Benchmarking",
        dataPoints: [
          { label: "Test vs Control Store Ratio", value: "20% Test / 80% Control" },
          { label: "Statistical Significance", value: "p < 0.001 Verified" },
          { label: "Pilot Margin Lift", value: "+3.9% Net Gain" },
        ],
      },
    },
    {
      id: "05",
      numberText: "05",
      title: "Autonomous Rollout & Continuous Learning",
      description:
        "Scale autonomous recommendation feeds across all product categories with continuous online reinforcement learning.",
      deliverable: "Self-optimizing enterprise pricing engine",
      visualDetail: {
        tag: "Phase 5: Full Rollout",
        headline: "Automated POS Dispatch & Retraining",
        dataPoints: [
          { label: "Catalog Coverage", value: "100% Active SKUs" },
          { label: "Merchant Time Saved", value: "18 Hours / Buyer / Wk" },
          { label: "Retraining Cadence", value: "Nightly Automated Cycle" },
        ],
      },
    },
  ],
};
