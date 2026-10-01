export type SidebarRoute = {
  title: string;
  url: string;
  items: {
    title: string;
    url: string;
  }[];
};

export const adminRoutes: SidebarRoute[] = [
  {
    title: "Management",
    url: "#",
    items: [
      {
        title: "Overview",
        url: "/admin",
      },
      {
        title: "Expert Management",
        url: "/admin/expert-management",
      },
      {
        title: "Student Management",
        url: "/admin/student-management",
      },
      {
        title: "Escrow Management",
        url: "/admin/escrow-management",
      },
    ],
  },
  {
    title: "Operations",
    url: "#",
    items: [
      {
        title: "Assignments",
        url: "/admin/assignments",
      },
      {
        title: "Payments",
        url: "/admin/payments",
      },
      {
        title: "Reports",
        url: "/admin/reports",
      },
    ],
  },
  {
    title: "App Settings",
    url: "#",
    items: [
      {
        title: "Settings",
        url: "/admin/settings",
      },
    ],
  },
];

export const studentRoutes: SidebarRoute[] = [
  {
    title: "Assignments",
    url: "#",
    items: [
      {
        title: "Overview",
        url: "/student",
      },
      {
        title: "Assignment Management",
        url: "/student/assignment-management",
      },
      {
        title: "Payments",
        url: "/student/payments",
      },
    ],
  },
  {
    title: "Account",
    url: "#",
    items: [
      {
        title: "Profile",
        url: "/student/profile",
      },
    ],
  },
];

export const expertRoutes: SidebarRoute[] = [
  {
    title: "Work",
    url: "#",
    items: [
      {
        title: "Overview",
        url: "/expert",
      },
      {
        title: "Assignments Management",
        url: "/expert/assignments-management",
      },
      {
        title: "Bids Management",
        url: "/expert/my-bids",
      },
      {
        title: "Earnings",
        url: "/expert/earnings",
      },
    ],
  },
  {
    title: "Account",
    url: "#",
    items: [
      {
        title: "Profile",
        url: "/expert/profile",
      },
    ],
  },
];
