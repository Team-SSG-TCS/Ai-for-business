export interface IndustryTileItem {
  id: string;
  title: string;
  metric: string;
  iconName: string;
  href: string;
}

export interface IndustryGridContent {
  eyebrow: string;
  title: string;
  subheadline: string;
  industries: IndustryTileItem[];
}

export const industriesContent: IndustryGridContent = {
  eyebrow: "Specialized Retail Verticals",
  title: "Tuned for the specific commercial dynamics of your category",
  subheadline:
    "Every retail sector has distinct inventory perishability, supplier rebate structures, and consumer elasticity.",
  industries: [
    {
      id: "grocery",
      title: "Supermarkets & FMCG",
      metric: "Perishable markdowns & basket affinity",
      iconName: "Apple",
      href: "#case-studies",
    },
    {
      id: "electronics",
      title: "Consumer Electronics",
      metric: "MAP compliance & warranty tie-ins",
      iconName: "Tv",
      href: "#case-studies",
    },
    {
      id: "apparel",
      title: "Fashion & Footwear",
      metric: "Lifecycle curves & size-run elasticity",
      iconName: "Shirt",
      href: "#case-studies",
    },
    {
      id: "pharma",
      title: "Pharmacy & Wellness",
      metric: "Regulatory price ceilings & health baskets",
      iconName: "Pill",
      href: "#case-studies",
    },
    {
      id: "diy-hardware",
      title: "DIY & Home Improvement",
      metric: "Contractor pricing & seasonal surges",
      iconName: "Hammer",
      href: "#case-studies",
    },
    {
      id: "convenience",
      title: "Convenience & Gas",
      metric: "Micro-local fuel and snack elasticity",
      iconName: "Fuel",
      href: "#case-studies",
    },
    {
      id: "department",
      title: "Department Stores",
      metric: "Concession margin split optimization",
      iconName: "Store",
      href: "#case-studies",
    },
    {
      id: "auto",
      title: "Automotive Aftermarket",
      metric: "SKU catalog depth & fitment matching",
      iconName: "Wrench",
      href: "#case-studies",
    },
  ],
};

