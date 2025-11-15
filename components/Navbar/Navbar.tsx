import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { ModeToggle } from "../ui/modetogle";
import { SidebarTrigger } from "../ui/sidebar";
import { NavigationMenuDemo } from "../user-menu";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/verificationtoken";

const Navbar = async () => {
  let isLoggedIn = false;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    isLoggedIn = true;
  } else {
    isLoggedIn = false;
  }

  const isValid = verifyToken(token);
  if (!isValid) {
    console.log("Invalid token");
    return;
  }

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between w-full p-3 border-b bg-background">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="cursor-pointer" />
        <Breadcrumbs />
      </div>
      <div className="flex items-center gap-2">
        <h3 className=" uppercase text-lg font-semibold hidden sm:flex">
          {isValid ? isValid.name : ""}
        </h3>
        <NavigationMenuDemo isLoggedIn={isLoggedIn} />
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
