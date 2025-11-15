"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRequestStore } from "@/lib/zustand/useRequest";
import { useEffect } from "react";

export function FilterRequest({ tabs }: { tabs: string[] }) {
  const isMobile = useIsMobile();
  const { getRequests } = useRequestStore();

  useEffect(() => {
    getRequests(1);
  }, [getRequests]);

  return (
    <NavigationMenu viewport={isMobile} className="w-full">
      <NavigationMenuList className="flex-wrap w-full">
        <NavigationMenuItem className="block w-full">
          <NavigationMenuTrigger className="cursor-pointer w-full">
            Filter by
          </NavigationMenuTrigger>
          <NavigationMenuContent className="w-full min-w-[200px] ">
            <ul className="grid w-full gap-2">
              {tabs.map((tab, i) => (
                <li key={i} className="w-full">
                  <NavigationMenuLink asChild>
                    <h3
                      onClick={() => getRequests( 1,tab)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {tab}
                    </h3>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
