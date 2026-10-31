export interface LogoItem {
  name: string;
  category: string;
  metric: string;
  href: string;
}

export interface MarqueeContent {
  eyebrow: string;
  logos: LogoItem[];
}

export const marqueeContent: MarqueeContent = {
  eyebrow: "Trusted by 50+ enterprise retailers globally",
  logos: [
    { name: "Lyreco", category: "Office & Workplace", metric: "+4.2% Margin", href: "#case-studies" },
    { name: "SPEEDWAY", category: "Convenience & Gas", metric: "2.4M SKUs", href: "#case-studies" },
    { name: "TSC", category: "Department Stores", metric: "-28% Markdown Cost", href: "#case-studies" },
    { name: "iHerb", category: "Health & Wellness", metric: "99.4% Availability", href: "#case-studies" },
    { name: "FINDEL", category: "Educational Supplies", metric: "<1s Latency", href: "#case-studies" },
    { name: "CULT BEAUTY", category: "Beauty & Cosmetics", metric: "+5.8% EBITDA", href: "#case-studies" },
    { name: "LOOKFANTASTIC", category: "Luxury Retail", metric: "85% Automated", href: "#case-studies" },
    { name: "NOVUS", category: "Supermarkets & FMCG", metric: "96.5% Precision", href: "#case-studies" },
    { name: "STARBOARD", category: "Cruise & Duty Free", metric: "+3.9% Lift", href: "#case-studies" },
  ],
};
