import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { BookOpen, Users, Network, LayoutDashboard } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Quotes Explorer", url: "/quotes", icon: BookOpen },
  { title: "User Profiles", url: "/users", icon: Users },
  { title: "Service Discovery", url: "/discovery", icon: Network },
];

export function AppSidebar() {
  return (
    <Sidebar className="w-60 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
          MS
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-sidebar-accent-foreground">Microservices</span>
          <span className="text-[10px] text-sidebar-foreground">Dashboard v1.0</span>
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-sidebar-foreground">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto border-t border-sidebar-border p-4">
          <div className="rounded-md bg-sidebar-accent p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-sidebar-foreground">Architecture</p>
            <div className="mt-2 space-y-1 font-mono text-[10px] text-sidebar-foreground">
              <div className="flex justify-between">
                <span>api-gateway</span>
                <span className="text-primary">:8080</span>
              </div>
              <div className="flex justify-between">
                <span>quote-service</span>
                <span className="text-sky-400">:8081</span>
              </div>
              <div className="flex justify-between">
                <span>user-service</span>
                <span className="text-violet-400">:8082</span>
              </div>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
