export interface FooterColumn {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

export interface FooterContent {
  brandDescription: string;
  columns: FooterColumn[];
  contact: {
    email: string;
    salesPhone: string;
    headquarters: string;
  };
  newsletter: {
    heading: string;
    subheading: string;
    placeholder: string;
    buttonText: string;
  };
  legal: {
    copyright: string;
    links: Array<{
      label: string;
      href: string;
    }>;
    complianceBadges: string[];
  };
  social: Array<{
    name: string;
    href: string;
    icon: string;
  }>;
}

export const footerContent: FooterContent = {
  brandDescription:
    "Enterprise AI platform delivering algorithmic price recommendations, omnichannel elasticity forecasting, and autonomous margin protection for global retailers.",
  columns: [
    {
      title: "Products",
      links: [
        { label: "Pricing Engine", href: "#feature-tabs" },
        { label: "Demand Forecasting", href: "#split-feature" },
        { label: "Competitive Intelligence", href: "#feature-grid" },
        { label: "Promotion Optimization", href: "#feature-tabs" },
        { label: "Scenario Simulation", href: "#feature-tabs" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "Supermarkets & FMCG", href: "#industries" },
        { label: "Consumer Electronics", href: "#industries" },
        { label: "Fashion & Apparel", href: "#industries" },
        { label: "Pharmacy & Wellness", href: "#industries" },
        { label: "DIY & Hardware", href: "#industries" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Audited Case Studies", href: "#case-studies" },
        { label: "Econometric Research", href: "#news" },
        { label: "Pricing Maturity Index", href: "#stepper" },
        { label: "Security & Trust Portal", href: "#security" },
        { label: "API Documentation", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Competera", href: "#closing-cta" },
        { label: "Executive Leadership", href: "#awards" },
        { label: "Research & Science", href: "#news" },
        { label: "Careers (We're Hiring)", href: "#" },
        { label: "Press & Newsroom", href: "#news" },
      ],
    },
    {
      title: "Governance",
      links: [
        { label: "Trust & Compliance", href: "#security" },
        { label: "SOC 2 Type II Verification", href: "#security" },
        { label: "GDPR Data Processing", href: "#security" },
        { label: "Responsible AI Principles", href: "#security" },
        { label: "System Uptime Status", href: "#" },
      ],
    },
  ],
  contact: {
    email: "enterprise@competera.ai",
    salesPhone: "+1 (800) 518-9270",
    headquarters: "San Francisco, CA · London, UK · Kyiv, UA",
  },
  newsletter: {
    heading: "Subscribe to Retail Econometrics",
    subheading: "Monthly empirical analysis on pricing elasticity and inflation dynamics. No marketing spam.",
    placeholder: "Enter your enterprise email",
    buttonText: "Subscribe",
  },
  legal: {
    copyright: "© 2026 Competera Inc. All rights reserved. Enterprise AI Retail Platform.",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Data Processing Agreement", href: "#" },
      { label: "Cookie Preferences", href: "#" },
      { label: "Security Disclosures", href: "#" },
    ],
    complianceBadges: ["ISO 27001 Certified", "SOC 2 Type II Audited", "CCPA Compliant"],
  },
  social: [
    { name: "LinkedIn", href: "https://linkedin.com", icon: "Linkedin" },
    { name: "X (Twitter)", href: "https://x.com", icon: "Twitter" },
    { name: "Facebook", href: "https://facebook.com", icon: "Facebook" },
  ],
};

