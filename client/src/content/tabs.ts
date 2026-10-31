export interface TabItem {
  id: string;
  label: string;
  title: string;
  description: string;
  metrics: Array<{
    label: string;
    value: string;
    trend: string;
  }>;
  highlightChip: string;
  uiView: {
    badge: string;
    chartTitle: string;
    tableColumns: string[];
    sampleRows: Array<{
      sku: string;
      category: string;
      currentPrice: string;
      recommendedPrice: string;
      elasticity: string;
      impact: string;
    }>;
  };
}

export interface FeatureTabsContent {
  eyebrow: string;
  title: string;
  subheadline: string;
  tabs: TabItem[];
}

export const featureTabsContent: FeatureTabsContent = {
  eyebrow: "Algorithmic Capabilities",
  title: "Unified intelligence across your entire product catalog",
  subheadline:
    "Combine deep econometric models with live market inputs to execute price changes with confidence.",
  tabs: [
    {
      id: "price-optimization",
      label: "Price Optimization",
      title: "Algorithmic SKU-level price recommendations",
      description:
        "Continuously compute real-time price elasticities across 20+ internal and external demand drivers.",
      metrics: [
        { label: "Gross Margin Gain", value: "+4.2%", trend: "Audited benchmark" },
        { label: "Recommendation Latency", value: "<850ms", trend: "Sub-second batch" },
        { label: "Catalog Coverage", value: "99.8%", trend: "Zero unmapped SKUs" },
      ],
      highlightChip: "Human-in-the-loop governance",
      uiView: {
        badge: "Live Optimization Pipeline",
        chartTitle: "Elasticity Curve & Margin Boundary Modeling",
        tableColumns: ["SKU Code", "Category", "Current", "AI Target", "Elasticity", "Gross Impact"],
        sampleRows: [
          { sku: "SKU-49201", category: "OLED Smart TV 65\"", currentPrice: "$1,199.00", recommendedPrice: "$1,249.00", elasticity: "-0.82", impact: "+$34.2K / wk" },
          { sku: "SKU-83021", category: "Wireless Noise ANC", currentPrice: "$279.00", recommendedPrice: "$264.00", elasticity: "-1.85", impact: "+18% vol" },
          { sku: "SKU-19033", category: "Ultra Slim Keyboard", currentPrice: "$89.00", recommendedPrice: "$94.50", elasticity: "-0.45", impact: "+$8.1K / wk" },
        ],
      },
    },
    {
      id: "demand-forecasting",
      label: "Demand Forecasting",
      title: "Omnichannel inventory velocity prediction",
      description:
        "Forecast unit demand with 95%+ precision factoring seasonality, weather, and localized store cannibalization.",
      metrics: [
        { label: "Forecast Accuracy", value: "96.4%", trend: "MAPE < 3.6%" },
        { label: "Inventory Holding Cost", value: "-18%", trend: "Working capital freed" },
        { label: "Out-of-Stock Reduction", value: "-42%", trend: "Shelf availability" },
      ],
      highlightChip: "Cross-store cannibalization modeling",
      uiView: {
        badge: "Omnichannel Demand Matrix",
        chartTitle: "Projected vs Actual Unit Velocity by DC Node",
        tableColumns: ["Fulfillment Node", "Product Family", "7-Day Run Rate", "30-Day Forecast", "Confidence", "Action"],
        sampleRows: [
          { sku: "DC-Northeast", category: "Refrigerated Organic", currentPrice: "14,200 units", recommendedPrice: "16,800 units", elasticity: "98.1%", impact: "Reorder auto" },
          { sku: "DC-Midwest", category: "Premium Audio Gear", currentPrice: "4,120 units", recommendedPrice: "3,890 units", elasticity: "95.4%", impact: "Reallocate" },
          { sku: "DC-WestCoast", category: "Athletic Footwear", currentPrice: "21,500 units", recommendedPrice: "24,100 units", elasticity: "97.6%", impact: "Stock adequate" },
        ],
      },
    },
    {
      id: "competitive-intelligence",
      label: "Market Intelligence",
      title: "Real-time competitive price scraping and parity",
      description:
        "Track millions of competitor price and promotion shifts hourly without breaking rate limits or data pipelines.",
      metrics: [
        { label: "Daily Crawled URLs", value: "2.9M+", trend: "Normalized data" },
        { label: "Match Precision", value: "99.4%", trend: "EAN / UPC verified" },
        { label: "Detection Latency", value: "<15m", trend: "Market move alert" },
      ],
      highlightChip: "Normalized competitor parity",
      uiView: {
        badge: "Hourly Market Surveillance",
        chartTitle: "Competitor Price Index Spread vs Primary Competitors",
        tableColumns: ["Rival Retailer", "Monitored SKUs", "Price Index", "Below Parity", "Stock Status", "Alert Level"],
        sampleRows: [
          { sku: "Competitor Alpha", category: "84,000 SKUs", currentPrice: "102.4", recommendedPrice: "14% items", elasticity: "In Stock 94%", impact: "Standard" },
          { sku: "Marketplace Beta", category: "128,500 SKUs", currentPrice: "97.1", recommendedPrice: "38% items", elasticity: "In Stock 89%", impact: "Price match required" },
          { sku: "Direct Omni Gamma", category: "42,000 SKUs", currentPrice: "100.8", recommendedPrice: "8% items", elasticity: "In Stock 97%", impact: "Nominal" },
        ],
      },
    },
    {
      id: "scenario-simulation",
      label: "Scenario Simulation",
      title: "Multi-scenario financial impact modeling",
      description:
        "Simulate margin, revenue, and unit tradeoffs before pushing prices live to your POS and ecommerce systems.",
      metrics: [
        { label: "Simulated Scenarios", value: "10,000+", trend: "Monte Carlo engine" },
        { label: "Risk Mitigation", value: "Zero loss", trend: "Bound safeguards" },
        { label: "Approval Cycle Time", value: "-75%", trend: "4 hours to 45 mins" },
      ],
      highlightChip: "Monte Carlo financial risk boundaries",
      uiView: {
        badge: "Simulated Margin Tradeoff",
        chartTitle: "Revenue Optimization vs Margin Preservation Curve",
        tableColumns: ["Scenario Strategy", "Target Margin", "Revenue Impact", "Unit Velocity", "Cannibalization", "Status"],
        sampleRows: [
          { sku: "Aggressive Margin Guard", category: "+5.4%", currentPrice: "+$1.82M", recommendedPrice: "-1.8%", elasticity: "Low risk (0.2%)", impact: "Recommended" },
          { sku: "Volume Growth Focus", category: "+1.9%", currentPrice: "+$3.45M", recommendedPrice: "+8.4%", elasticity: "Moderate (1.4%)", impact: "Alternative" },
          { sku: "Defensive Price Parity", category: "+3.1%", currentPrice: "+$2.10M", recommendedPrice: "+2.2%", elasticity: "Minimal (0.6%)", impact: "Ready to deploy" },
        ],
      },
    },
  ],
};

