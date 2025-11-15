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

type FilterOrderProps = {
  progressList: string[];
  onFilter: (progress: string) => void;
};

export function FilterMenuDemo({ progressList, onFilter }: FilterOrderProps) {
  const isMobile = useIsMobile();

  return (
    <NavigationMenu viewport={isMobile} className="w-full">
      <NavigationMenuList className="flex-wrap w-full">
        <NavigationMenuItem className="block w-full">
          <NavigationMenuTrigger className="cursor-pointer w-full">
            Filter by
          </NavigationMenuTrigger>
          <NavigationMenuContent className="w-full min-w-[200px] ">
            <ul className="grid w-full gap-2">
              {progressList.map((progress, i) => (
                <li key={i} className="w-full">
                  <NavigationMenuLink asChild>
                    <h3
                      onClick={() => onFilter(progress)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {progress}
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
