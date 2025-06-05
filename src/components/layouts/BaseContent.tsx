"use client";

import Navbar from "@/components/layouts/navbar";
import Sidebar2 from "@/components/layouts/sidebar2";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { useState } from "react";

const BaseContent = ({ children }: any) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState<any>(false);
  const { user } = useAuth();
  const pathname = usePathname();

  const isGuest =
    pathname === "/login" ||
    pathname === "/registration" ||
    pathname === "/" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/print");

  if (isGuest) return <>{children}</>;

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="relative flex w-full h-screen white">
      <div
        className={`h-full fixed ${
          isSidebarVisible ? "block" : "hidden"
        } md:block z-30 text-black`}
      >
        <Sidebar2
          darkMode={false}
          role={user?.role}
          isSidebarVisible={isSidebarVisible}
          toggleSidebar={toggleSidebar}
          open={isSidebarVisible}
        />
      </div>
      <div
        className={`flex-1 flex-col w-full transition-all duration-300 ml-0 ${
          isSidebarVisible ? "md:ml-60 ml-20" : "md:ml-20 ml-0"
        }`}
      >
        <Navbar
          darkMode={false}
          toggleDarkMode={() => {}}
          toggleSidebar={toggleSidebar}
          currentPage={pathname.replace(/\//g, " ")}
          isSidebarVisible={isSidebarVisible}
        />
        <div className="flex-1 w-full text-black bg-gray">{children}</div>
      </div>
    </div>
  );
};

export default BaseContent;
