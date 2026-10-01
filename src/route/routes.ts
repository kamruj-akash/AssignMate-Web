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
        title: "Expert Approval",
        url: "/admin/expert-approval",
      },
      {
        title: "Expert Management",
        url: "/admin/expert-management",
      },
      {
        title: "Student Management",
        url: "/admin/student-management",
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
        title: "Post Assignment",
        url: "/student/post-assignment",
      },
      {
        title: "My Assignments",
        url: "/student/my-assignments",
      },
      {
        title: "Find Experts",
        url: "/student/experts",
      },
    ],
  },
  {
    title: "Account",
    url: "#",
    items: [
      {
        title: "Messages",
        url: "/student/messages",
      },
      {
        title: "Payments",
        url: "/student/payments",
      },
      {
        title: "Profile",
        url: "/student/profile",
      },
      {
        title: "Settings",
        url: "/student/settings",
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
        title: "Browse Assignments",
        url: "/expert/browse-assignments",
      },
      {
        title: "My Bids",
        url: "/expert/my-bids",
      },
      {
        title: "Active Work",
        url: "/expert/active-work",
      },
      {
        title: "Completed",
        url: "/expert/completed",
      },
    ],
  },
  {
    title: "Account",
    url: "#",
    items: [
      {
        title: "Messages",
        url: "/expert/messages",
      },
      {
        title: "Earnings",
        url: "/expert/earnings",
      },
      {
        title: "Profile",
        url: "/expert/profile",
      },
      {
        title: "Settings",
        url: "/expert/settings",
      },
    ],
  },
];
