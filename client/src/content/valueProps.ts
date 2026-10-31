export interface ValuePropContent {
  eyebrow: string;
  title: string;
  subheadline: string;
  chips: Array<{
    stat: string;
    label: string;
    sublabel: string;
    iconName: string;
  }>;
}

export const valuePropsContent: ValuePropContent = {
  eyebrow: "Proven Enterprise Returns",
  title: "How price optimization software solves retail challenges",
  subheadline: "Reduce pricing operations costs by up to 30%",
  chips: [
    {
      stat: "100%",
      label: "Seamless product segmentation",
      sublabel: "Automated SKU cluster grouping by customer price perception and elasticity.",
      iconName: "Layers",
    },
    {
      stat: "Live",
      label: "Dynamic assignment across pricing campaigns",
      sublabel: "Set strategy rules once and let AI orchestrate cadence and markdowns.",
      iconName: "TrendingUp",
    },
    {
      stat: "70%",
      label: "Save up to of your time",
      sublabel: "Eliminate manual spreadsheet validation and automate price approvals.",
      iconName: "Clock",
    },
  ],
};
