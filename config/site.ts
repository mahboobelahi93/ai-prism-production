import { SidebarSection, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "AI-PRISM Alliance of Open-Access Pilots",
  description:
    "Empowering pilot owners with an open-access platform featuring end-to-end encryption, virtual pilots, optimized scheduling, and KPIs for performance monitoring.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://twitter.com/miickasmt",
    github: "https://github.com/mickasmt/next-auth-roles-template",
  },
  mailSupport: "support@ai-prism.fake",
};

export const footerLinks: SidebarSection[] = [
  {
    //   title: "Company",
    //   items: [
    //     { title: "About", href: "https://aiprism.eu/" },
    //     { title: "AI-PRISM Vision", href: "https://aiprism.eu/" },
    //     { title: "Terms", href: "https://aiprism.eu/" },
    //     { title: "Privacy", href: "https://aiprism.eu/" },
    //   ],
    // },
    // {
    //   title: "Features",
    //   items: [
    //     { title: "Built for Pilot Owners", href: "https://aiprism.eu/" },
    //     { title: "Virtual Pilots", href: "https://aiprism.eu/" },
    //     { title: "Optimized Scheduling", href: "https://aiprism.eu/" },
    //     { title: "Open-Access Pilots", href: "https://aiprism.eu/" },
    //   ],
    // },
    // {
    title: "Docs",
    items: [
      { title: "Privacy Policy", href: "https://aiprism.eu/privacy-policies/" },
      { title: "Terms of Use", href: "https://aiprism.eu/terms-of-use/" },
    ],
  },
];

export const categoryOptions = [
  { label: "Robot", value: "robot" },
  { label: "Machines", value: "machines" },
  { label: "Design", value: "design" },
  { label: "Others", value: "others" },
];
