export interface FeatureCardItem {
  iconName: string;
  title: string;
  description: string;
  metric: string;
}

export interface FeatureGridContent {
  eyebrow: string;
  title: string;
  subheadline: string;
  items: FeatureCardItem[];
}

export const featuresContent: FeatureGridContent = {
  eyebrow: "Enterprise Infrastructure",
  title: "Architected for high-concurrency retail transactions",
  subheadline:
    "Built for enterprise retailers operating tens of thousands of stores and millions of digital SKUs.",
  items: [
    {
      iconName: "Zap",
      title: "Real-time pricing API",
      description: "Sub-second webhook and GraphQL dispatch to electronic shelf labels and ecommerce checkout.",
      metric: "<50ms p99 SLA",
    },
    {
      iconName: "ShieldAlert",
      title: "Automated guardrails",
      description: "Deterministic rules preventing loss-making price changes below regulatory or contractual thresholds.",
      metric: "100% boundary check",
    },
    {
      iconName: "Layers",
      title: "Multi-echelon simulation",
      description: "Model how warehouse replenishment schedules influence localized clearance markdown timing.",
      metric: "10k+ scenarios / min",
    },
    {
      iconName: "Database",
      title: "Enterprise ERP connectors",
      description: "Native bidirectional connectors for SAP S/4HANA, Oracle Retail, Blue Yonder, and Salesforce.",
      metric: "Plug-and-play sync",
    },
    {
      iconName: "UsersCheck",
      title: "Merchant-in-the-loop workflow",
      description: "Intuitive recommendation inbox where category buyers approve, modify, or reject AI proposals.",
      metric: "Role-based approvals",
    },
  ],
};

