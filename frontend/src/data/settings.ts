// data/settings.ts

import { SettingItem } from "@/interfaces/Settings";

export const settingsData: SettingItem[] = [
  {
    id: "site-logo",
    section: "Appearance",
    title: "Site Logo",
    description: "Upload the site logo",
    type: "upload"
  },
  {
    id: "social-links",
    section: "Social Links",
    title: "Facebook Link",
    description: "Link to your official Facebook page",
    type: "table"
  },
  {
    id: "company-address",
    section: "Company Info",
    title: "Company Address",
    description: "Set the physical address and contact info",
    type: "table"
  },
  {
    id: "featured-works",
    section: "Featured Works",
    title: "Highlight Projects",
    description: "Manage the featured projects or clients",
    type: "table"
  },
  {
    id: "upcoming-events",
    section: "Events",
    title: "Event Listings",
    description: "Add and manage upcoming events",
    type: "table"
  }
];
