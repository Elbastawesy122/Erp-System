"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { CircleUserRound } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLogout } from "@/lib/fetchData/fetchUser";
import { useRouter } from "next/navigation";

export function NavigationMenuDemo( { isLoggedIn }: { isLoggedIn: boolean } ) {
  const isMobile = useIsMobile();
  const logout = useLogout();
  const router = useRouter();

  return (
    <NavigationMenu viewport={isMobile}>
      <NavigationMenuList className="flex-wrap">
        <NavigationMenuItem className="block">
          <NavigationMenuTrigger>
            <CircleUserRound className="cursor-pointer" />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-fit gap-4">
              <li>
                <NavigationMenuLink asChild>
                  {isLoggedIn ? (
                    <button
                      onClick={async () => {
                        await logout();
                        router.replace("/user/login");
                        router.refresh();
                      }}
                      className="w-full text-left px-4 py-2 cursor-pointer"
                    >
                      Logout
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        router.push("/user/login");
                        router.refresh();
                      }}
                      className="w-full text-left px-4 py-2 cursor-pointer"
                    >
                      Login
                    </button>
                  )}
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
