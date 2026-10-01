"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLogout } from "@/hooks";
import { adminRoutes, expertRoutes, studentRoutes } from "@/route/routes";

import { UserRole } from "@/type";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "../shared/logo";
import { Button } from "../ui/button";
import { toast } from "../ui/toast";

const sidebarRoutes = {
  ADMIN: adminRoutes,
  STUDENT: studentRoutes,
  EXPERT: expertRoutes,
};
export function DashboardSidebar({ role }: { role: UserRole }) {
  const userRoute = sidebarRoutes[role];
  const pathName = usePathname();
  const { mutate: logout, isPending: isLogoutPending } = useLogout();
  const queryClient = useQueryClient();
  const router = useRouter();
  const handleLogout = () => {
    logout(undefined, {
      onSuccess: (res) => {
        console.log(res);
        toast.add({
          title: "Logout Successful",
          description: res?.message || "You have successfully logged out.",
          type: "success",
        });
        queryClient.removeQueries({ queryKey: ["getMe"] });
        router.push("/login");
      },
    });
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 px-4 py-3">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {userRoute.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={pathName === item.url}
                    >
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
      <Button variant="destructive" size={"lg"} onClick={handleLogout}>
        {isLogoutPending ? "Logging out..." : "Logout"}
      </Button>
    </Sidebar>
  );
}
