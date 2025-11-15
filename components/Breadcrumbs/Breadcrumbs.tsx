"use client";

import image from "../../app/favicon.ico";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const Breadcrumbs = () => {
  const pathname = usePathname();

  // تقسيم المسار لصفحات
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  // بناء المسارات التدريجية
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const isLast = index === pathSegments.length - 1;

    // أول حرف كابيتال
    const name = segment.charAt(0).toUpperCase() + segment.slice(1);

    return (
      <div key={href} className="flex items-center gap-1 text-sm">
        {!isLast ? (
          <Link href={href} className="text-muted-foreground hover:underline">
            {name}
          </Link>
        ) : (
          <span className="font-medium">{name}</span>
        )}
        {!isLast && <span className="text-muted-foreground">{">"}</span>}
      </div>
    );
  });

  // لو احنا في الصفحة الرئيسية
  if (pathname === "/") {
    return (
      <Image src={image} alt="" width={25} height={25} className="rounded" />
    );
  }

  return (
    <nav className="flex items-center gap-2">
      <Link href="/" className="text-muted-foreground hover:underline">
        <Image src={image} alt="" width={25} height={25} className="rounded" />
      </Link>
      {pathSegments.length > 0 && <span>{">"}</span>}
      {breadcrumbs}
    </nav>
  );
};

export default Breadcrumbs;
