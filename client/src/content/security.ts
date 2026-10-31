export interface SecurityBandContent {
  badgeLabel: string;
  badgeTitle: string;
  badgeSubtitle: string;
  title: string;
  paragraph: string;
  certifications: string[];
  cta: {
    label: string;
    href: string;
  };
}

export const securityContent: SecurityBandContent = {
  badgeLabel: "TRUST & COMPLIANCE",
  badgeTitle: "SOC 2 TYPE II",
  badgeSubtitle: "ISO 27001 AUDITED",
  title: "Enterprise data sovereignty and banking-grade security",
  paragraph:
    "Your proprietary sales, cost, and vendor terms are protected by tenant-isolated encryption keys, automated penetration audits, and strict regional data residency compliant with GDPR and CCPA.",
  certifications: [
    "SOC 2 Type II Certified",
    "ISO/IEC 27001:2022",
    "GDPR & CCPA Compliant",
    "Single-Tenant Dedicated VPC Option",
  ],
  cta: {
    label: "Explore security whitepaper",
    href: "#",
  },
};

