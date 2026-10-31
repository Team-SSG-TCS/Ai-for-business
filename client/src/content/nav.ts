export interface NavItem {
  title: string;
  description: string;
  href: string;
  iconName: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
  promo?: {
    title: string;
    description: string;
    image: string;
    href: string;
    cta: string;
  };
}

export interface NavigationContent {
  announcement: {
    lead: string;
    text: string;
    cta: string;
    href: string;
  };
  brand: {
    name: string;
    logoText: string;
  };
  links: {
    products: NavGroup;
    solutions: NavGroup;
    resources: NavGroup;
    company: NavGroup;
  };
  actions: {
    pricingText: string;
    pricingHref: string;
    demoButtonText: string;
  };
}

export const navContent: NavigationContent = {
  announcement: {
    lead: "Partner marketplace is live:",
    text: "explore best-in-class retail solutions, all in one place",
    cta: "",
    href: "#news",
  },
  brand: {
    name: "Competera AI",
    logoText: "Competera",
  },
  links: {
    products: {
      label: "Products",
      items: [
        {
          title: "Pricing Engine",
          description: "SKU-level elasticities and automated price recommendations at scale.",
          href: "#feature-tabs",
          iconName: "Cpu",
        },
        {
          title: "Demand Forecasting",
          description: "Predict unit velocity across omnichannel nodes with 95%+ precision.",
          href: "#split-feature",
          iconName: "TrendingUp",
        },
        {
          title: "Competitive Intelligence",
          description: "Real-time shelf tracking and competitor price scraping across 100M+ data points.",
          href: "#feature-grid",
          iconName: "Radar",
        },
        {
          title: "Promotion Optimization",
          description: "Simulate discount depths to protect gross margin and eliminate basket cannibalization.",
          href: "#feature-tabs",
          iconName: "Percent",
        },
      ],
      promo: {
        title: "Winter 2026 Platform Release",
        description: "Autonomous margin guardrails and multi-echelon scenario modeling.",
        image: "/promo-preview.png",
        href: "#feature-tabs",
        cta: "Explore release",
      },
    },
    solutions: {
      label: "Solutions",
      items: [
        {
          title: "Grocery & FMCG",
          description: "Perishable item dynamic markdowns and high-frequency category re-pricing.",
          href: "#industries",
          iconName: "ShoppingCart",
        },
        {
          title: "Consumer Electronics",
          description: "Map price compliance, bundle simulation, and warranty attachment optimization.",
          href: "#industries",
          iconName: "Smartphone",
        },
        {
          title: "Apparel & Footwear",
          description: "Lifecycle markdown curves and size-curve elasticity modeling.",
          href: "#industries",
          iconName: "Shirt",
        },
        {
          title: "Pharmacy & Health",
          description: "Regulated category margin governance and basket affinity scoring.",
          href: "#industries",
          iconName: "HeartPulse",
        },
      ],
      promo: {
        title: "Enterprise Playbook",
        description: "How top 50 retailers secure 4.2% margin expansion in 90 days.",
        image: "/playbook-preview.png",
        href: "#case-studies",
        cta: "Download guide",
      },
    },
    resources: {
      label: "Resources",
      items: [
        {
          title: "Case Studies",
          description: "Verified customer outcomes, audited revenue gains, and rollout timelines.",
          href: "#case-studies",
          iconName: "FileText",
        },
        {
          title: "Pricing Maturity Benchmark",
          description: "Compare your algorithmic execution against industry quartile performance.",
          href: "#stepper",
          iconName: "BarChart3",
        },
        {
          title: "Security & Trust Portal",
          description: "SOC 2 Type II, ISO 27001 certifications and data sovereignty standards.",
          href: "#security",
          iconName: "Shield",
        },
        {
          title: "API Documentation",
          description: "REST and GraphQL endpoints for real-time ERP/PIM catalog synchronization.",
          href: "#",
          iconName: "Code2",
        },
      ],
    },
    company: {
      label: "Company",
      items: [
        {
          title: "About Us",
          description: "Our mission to bring mathematical discipline to global commerce.",
          href: "#closing-cta",
          iconName: "Building2",
        },
        {
          title: "Research & Science",
          description: "Peer-reviewed demand econometric modeling and reinforcement learning.",
          href: "#news",
          iconName: "FlaskConical",
        },
        {
          title: "Executive Leadership",
          description: "Retail practitioners and PhD econometricians engineering the future.",
          href: "#awards",
          iconName: "Users",
        },
        {
          title: "Careers",
          description: "Join our global distributed engineering and machine learning teams.",
          href: "#",
          iconName: "Briefcase",
        },
      ],
    },
  },
  actions: {
    pricingText: "Pricing",
    pricingHref: "#value-props",
    demoButtonText: "Request a demo",
  },
};

