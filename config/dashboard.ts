import { UserRole } from "@prisma/client";

import { SidebarSection } from "types";

export const sidebarLinks: SidebarSection[] = [
  // {
  //   title: "",
  //   items: [{ href: "/dashboard", icon: "dashboard", title: "Dashboard" }],
  // },
  {
    title: "MENU",
    items: [
      {
        href: "/admin",
        icon: "laptop",
        title: "PILOT OWNER PANEL",
        authorizeOnly: UserRole.PILOTOWNER,
      },
      {
        href: "/portal/pilots",
        icon: "page",
        title: "MY PILOTS",
        authorizeOnly: UserRole.PILOTOWNER,
      },
      {
        href: "/portal/enrollments",
        icon: "user",
        title: "USER LIST",
        authorizeOnly: UserRole.PILOTOWNER,
      },
      {
        href: "/dashboard",
        icon: "user",
        title: "Dashboard",
        authorizeOnly: UserRole.SUPERADMIN,
      },

      {
        href: "/admin/pilotownerapproval",
        icon: "page",
        title: "Pilot Owner Approval Management",
        authorizeOnly: UserRole.SUPERADMIN,
      },

      {
        href: "/schedule/pilot-owner",
        title: "SCHEDULE",
        icon: "calendar",
        authorizeOnly: UserRole.PILOTOWNER,
      },
      // {
      //   href: "/portal/chat",
      //   icon: "chat",
      //   title: "CHAT WITH AI",
      //   authorizeOnly: UserRole.PILOTOWNER,
      // },

      {
        href: "/dashboard",
        icon: "laptop",
        title: "PILOT USER PANEL",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/user/pilotlist",
        title: "EXPLORE AVAILABLE PILOTS",
        icon: "page",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/user/enrolledpilots",
        title: "SUBSCRIBED PILOTS",
        icon: "gridCheck",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/schedule/pilot-user",
        title: "SCHEDULE",
        icon: "calendar",
        authorizeOnly: UserRole.USER,
      },

      // { href: "/dashboard/charts", icon: "lineChart", title: "Charts" },
      // {
      //   href: "/admin/orders",
      //   icon: "package",
      //   title: "Orders",
      //   badge: 2,
      //   authorizeOnly: UserRole.ADMIN,
      // },
      // {
      //   href: "#/dashboard/posts",
      //   icon: "post",
      //   title: "User Posts",
      //   authorizeOnly: UserRole.USER,
      //   disabled: false,
      // },
    ],
  },
  {
    title: "OTHERS",
    items: [
      // { href: "/dashboard/settings", icon: "settings", title: "Settings" },
      // { href: "/", icon: "home", title: "Homepage" },
      // {
      //   href: "#",
      //   icon: "messages",
      //   title: "Support",
      //   authorizeOnly: UserRole.USER,
      //   disabled: true,
      // },
      {
        href: "/resources/solutions",
        icon: "gridCheck",
        title: "SOLUTIONS",
        disabled: false,
      },
      // {
      //   href: "#",
      //   icon: "gridCheck",
      //   title: "Modules",
      //   disabled: false,
      // },
      // {
      //   href: "#",
      //   icon: "gridCheck",
      //   title: "Infrasturctures",
      //   disabled: false,
      // },
      {
        href: "/resources/demonstrator",
        icon: "post",
        title: "DEMONSTRATORS",
        disabled: false,
      },
      {
        href: "/resources/infrastructures",
        icon: "house",
        title: "INFRASTRUCTURES",
        disabled: false,
      },
    ],
  },
];
