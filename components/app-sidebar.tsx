import {
  ChartArea,
  ShoppingCart,
  GitPullRequest,
  Award,
  ChartNoAxesCombined,
  Store,
  SquareCheckBig,
} from "lucide-react";
import image from "../app/favicon.ico";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: ChartArea,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Requests",
    url: "/requests",
    icon: GitPullRequest,
  },
  {
    title: "Store",
    url: "/store",
    icon: Store,
  },
  {
    title: "Achievements",
    url: "/achievements",
    icon: Award,
  },
  {
    title: "Completed",
    url: "/completed",
    icon: SquareCheckBig ,
  },
  {
    title: "Performance",
    url: "/performance",
    icon: ChartNoAxesCombined,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-5 mt-2">
            <Image
              src={image}
              alt=""
              width={25}
              height={25}
              className="rounded"
            />
            <h1 className="text-4xl font-bold pl-3 pb-1">SYSTEM</h1>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
