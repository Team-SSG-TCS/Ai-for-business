export interface CaseStudyStat {
  value: string;
  caption: string;
}

export interface CaseStudyItem {
  slug: string;
  industry: string;
  customer: string;
  stats: [CaseStudyStat, CaseStudyStat];
  summary: string;
  timeframe: string;
}

export interface CaseStudiesContent {
  eyebrow: string;
  title: string;
  subheadline: string;
  items: CaseStudyItem[];
}

export const caseStudiesContent: CaseStudiesContent = {
  eyebrow: "Audited Case Studies",
  title: "Delivering double-digit margin growth for tier-one retailers",
  subheadline:
    "Explore how leading enterprise retail chains transitioned from static spreadsheets to autonomous price optimization.",
  items: [
    {
      slug: "nordic-supermarkets",
      industry: "Grocery & FMCG",
      customer: "Nordic Supermarkets",
      stats: [
        { value: "+3.8%", caption: "Gross margin increase across 450 stores" },
        { value: "40%", caption: "Reduction in food waste markdowns" },
      ],
      summary: "Automated perishable inventory pricing across fresh and dairy categories without sacrificing store foot traffic.",
      timeframe: "Full deployment in 90 days",
    },
    {
      slug: "apex-electronics",
      industry: "Consumer Electronics",
      customer: "Apex Electronics",
      stats: [
        { value: "95%+", caption: "Price scraping match precision on 2.1M SKUs" },
        { value: "-75%", caption: "Faster reaction to competitor price cuts" },
      ],
      summary: "Replaced 6 disparate pricing tools with unified AI elasticity modeling across brick-and-mortar and ecommerce.",
      timeframe: "14-week enterprise rollout",
    },
    {
      slug: "vanguard-fashion",
      industry: "Apparel & Department",
      customer: "Vanguard Fashion Group",
      stats: [
        { value: "+5.1%", caption: "Sell-through rate at full price margin" },
        { value: "30%", caption: "Reduction in end-of-season clearance depth" },
      ],
      summary: "Implemented lifecycle demand modeling to time mid-season promotions and protect initial retail markup.",
      timeframe: "Rolled out across 12 countries",
    },
    {
      slug: "helios-pharmacy",
      industry: "Pharmacy & Wellness",
      customer: "Helios Health Network",
      stats: [
        { value: "99.8%", caption: "Automated regulatory pricing compliance" },
        { value: "+$14.2M", caption: "Net EBITDA expansion in fiscal year 2025" },
      ],
      summary: "Governed strict retail margin boundaries across OTC pharmaceuticals with audit-proof change tracking.",
      timeframe: "Seamless SAP integration",
    },
  ],
};

