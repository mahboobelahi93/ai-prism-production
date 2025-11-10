import { Chat as PrismaChat, User, UserRole } from "@prisma/client";
import { Message } from "ai";
import type { Icon } from "lucide-react";

import { Icons } from "@/components/shared/icons";

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  mailSupport: string;
  links: {
    twitter: string;
    github: string;
  };
};

export type NavItem = {
  title: string;
  href: string;
  badge?: number;
  disabled?: boolean;
  external?: boolean;
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

export type MainNavItem = NavItem;

export type MarketingConfig = {
  mainNav: MainNavItem[];
};

export interface SidebarItem {
  href: string;
  icon?: string;
  title: string;
  authorizeOnly?: UserRole;
  badge?: number;
  disabled?: boolean;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export interface IBreadcrumbItem {
  label: string;
  href?: string; // href will be optional as some breadcrumbs (like the last one) don't need a link
}

export interface UploadedFile {
  name: string;
  url: string;
  key: string; // S3 object key
}

export type TChat = Omit<PrismaChat, "messages"> & {
  messages: Array<Message>;
};

export type PresignedURLCache = {
  url: string;
  key?: string;
  expiry: number;
};
