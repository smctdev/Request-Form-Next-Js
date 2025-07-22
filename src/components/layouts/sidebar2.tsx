"use client";

import { useEffect, useState } from "react";
import Logo from "@/assets/logo.png";
import {
  ChartBarIcon,
  EnvelopeIcon,
  DocumentCheckIcon,
  DocumentPlusIcon,
  UserGroupIcon,
  BookOpenIcon,
  UserIcon,
  BuildingOfficeIcon,
  MapIcon,
  SwatchIcon,
  UserPlusIcon,
  BriefcaseIcon,
  StarIcon,
  LockClosedIcon,
  FlagIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import echo from "@/hooks/echo";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { NavItem, SidebarProps } from "@/types/sidebarTypes";
import { useNotification } from "@/context/NotificationContext";
import Swal from "sweetalert2";

const Sidebar2 = ({ darkMode, role, open, toggleSidebar }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname(); // Get current location
  const [notificationReceived, setnotificationReceived] = useState(false);
  const [pendingCounts, setPendingCounts] = useState(0);
  const { user, logout, isAuthenticated, isApprover, isAuditor, isAdmin } =
    useAuth();
  const { isRefresh } = useNotification();

  const navItems: NavItem[] = isAuditor
    ? [
        {
          title: "Dashboard",
          submenu: false,
          icon: ChartBarIcon,
          path: "/approver/dashboard",
        },
        {
          title: "My Request",
          submenu: false,
          icon: EnvelopeIcon,
          path: "/request",
        },
        {
          title: "Create Request",
          submenu: false,
          icon: DocumentPlusIcon,
          path: "/create-request?title=Stock%20Requisition",
        },
        {
          title: "Process Request",
          submenu: false,
          icon: DocumentCheckIcon,
          path: "/approver/request",
        },
        {
          title: "Reports",
          submenu: false,
          icon: FlagIcon,
          path: "/reports",
        },
        { title: "Help", submenu: false, icon: BookOpenIcon, path: "/help" },
      ]
    : isApprover
    ? [
        {
          title: "Dashboard",
          submenu: false,
          icon: ChartBarIcon,
          path: "/approver/dashboard",
        },
        {
          title: "My Request",
          submenu: false,
          icon: EnvelopeIcon,
          path: "/request",
        },
        {
          title: "Create Request",
          submenu: false,
          icon: DocumentPlusIcon,
          path: "/create-request?title=Stock%20Requisition",
        },
        {
          title: "Process Request",
          submenu: false,
          icon: DocumentCheckIcon,
          path: "/approver/request",
        },
        { title: "Help", submenu: false, icon: BookOpenIcon, path: "/help" },
      ]
    : isAdmin
    ? [
        {
          title: "Dashboard",
          submenu: false,
          icon: ChartBarIcon,
          path: "/dashboard",
        },
        {
          title: "Users",
          submenu: false,
          icon: UserPlusIcon,
          path: "/admin/users",
        },
        {
          title: "Positions",
          submenu: false,
          icon: BriefcaseIcon,
          path: "/admin/positions",
        },
        {
          title: "Branches",
          submenu: false,
          icon: BuildingOfficeIcon,
          path: "/admin/branches",
        },
        {
          title: "Approvers",
          submenu: false,
          icon: UserIcon,
          path: "/admin/approvers",
        },
        {
          title: "AVP Staffs",
          submenu: false,
          icon: UserGroupIcon,
          path: "/admin/avp-staffs",
        },
        {
          title: "Area Managers",
          submenu: false,
          icon: MapIcon,
          path: "/admin/area-managers",
        },
        {
          title: "Branch Heads",
          submenu: false,
          icon: SwatchIcon,
          path: "/admin/branch-heads",
        },
        {
          title: "Feedbacks",
          submenu: false,
          icon: StarIcon,
          path: "/admin/feedbacks",
        },
        {
          title: "Request Access",
          submenu: false,
          icon: LockClosedIcon,
          path: "/admin/request-access",
        },
        {
          title: "Reports",
          submenu: false,
          icon: FlagIcon,
          path: "/reports",
        },
        { title: "Help", submenu: false, icon: BookOpenIcon, path: "/help" },
      ]
    : [
        {
          title: "Dashboard",
          submenu: false,
          icon: ChartBarIcon,
          path: "/dashboard",
        },
        {
          title: "My Request",
          submenu: false,
          icon: EnvelopeIcon,
          path: "/request",
        },
        {
          title: "Create Request",
          submenu: false,
          icon: DocumentPlusIcon,
          path: "/create-request?title=Stock%20Requisition",
        },
        { title: "Help", submenu: false, icon: BookOpenIcon, path: "/help" },
      ];

  useEffect(() => {
    const handleResize = () => {
      // Your resize logic here
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isApprover) return;
    const fetchPendingsCount = async () => {
      try {
        const response = await api.get("/for-approval-pendings-count");

        setPendingCounts(response?.data);
      } catch (error) {
        console.error(error);
      } finally {
        setnotificationReceived(false);
      }
    };

    fetchPendingsCount();
  }, [notificationReceived, isRefresh, isApprover]);

  useEffect(() => {
    if (!echo || user?.id || !pathname) return;

    const channel = echo
      .private(`pendingCount.${user?.id}`)
      .listen("NotificationEvent", (e: any) => {
        setnotificationReceived(true);
      });

    return () => {
      channel.stopListening("NotificationEvent");
    };
  }, [user, pathname, echo]);

  useEffect(() => {
    if (!echo || !user?.id || !pathname) return;
    echo
      .private(`App.Models.User.${user?.id}`)
      .notification((notification: any) => {
        setnotificationReceived(true);
      });

    return () => {
      echo.leave(`private-App.Models.User.${user.id}`);
    };
  }, [user?.id, echo, pathname]);

  useEffect(() => {}, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout(router);
      }
    });
  };

  const listStyle =
    "relative mx-2 group flex items-center text-[18px] text-gray-400 font-medium py-2 pr-3 px-2 cursor-pointer rounded-lg";
  const pStyle = "group-hover:text-primary font text-lg px-2 rounded-lg";
  const pStyle2 = "font text-lg px-2 rounded-lg";
  const iconStyle = "size-[32px] group-hover:text-primary";
  const activeClass = "bg-[#D2E6F7] text-primary"; // Change to your preferred active color

  if (!isAuthenticated) return null;

  return (
    <div className={`bg-white h-full`}>
      <div className={`bg-white ${open ? "w-60" : "w-20"} h-full`}>
        <div className="px-2 py-3 h-[68px] flex justify-center items-center border-b-[0.5px] border-gray-300">
          <Image
            src={Logo}
            alt="Logo"
            height={80}
            width={120}
            className="cursor-pointer"
            onClick={toggleSidebar}
          />
          {/* <h1
            className={`text-primary font-bold mr-7 ${
              open ? "visible" : "invisible"
            }`}
          >
            Request Form
          </h1> */}
        </div>
        <ul className="flex-1 w-full overflow-y-auto mt-6 h-[calc(100vh-110px)]">
          <div className="w-full gap-2">
            {navItems.map((item) => (
              <Link href={item.path} key={item.title}>
                <li
                  className={`${listStyle} ${
                    pathname.startsWith(item.path.split("?")[0])
                      ? activeClass
                      : ""
                  } ${!open ? "justify-center" : "hover:bg-[#E7F1F9]"}`}
                >
                  <div
                    className={`p-2 ${
                      !open ? "hover:bg-[#D2E6F7] rounded-lg relative" : ""
                    }`}
                  >
                    <item.icon className={iconStyle} />

                    {pendingCounts > 0 &&
                      item.title === "Process Request" &&
                      !open && (
                        <span className="absolute top-0 right-0 bg-pink-400 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                          {pendingCounts}
                        </span>
                      )}
                  </div>
                  {open ? (
                    <div className={`flex-1 ${!open ? "hidden" : "block"}`}>
                      <p className={`${pStyle} truncate p-1`}>
                        {item.title}{" "}
                        {pendingCounts > 0 &&
                          item.title === "Process Request" &&
                          open && (
                            <span className="bg-pink-400 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                              {pendingCounts}
                            </span>
                          )}
                      </p>
                    </div>
                  ) : (
                    <div className={`relative group`}>
                      <p
                        className={`${pStyle} truncate p-1 absolute left-full ml-5 top-1/2 transform -translate-y-1/2 bg-[#D2E6F7] rounded-lg ${
                          open
                            ? "hidden"
                            : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                        } transition-opacity`}
                      >
                        {item.title}
                      </p>
                    </div>
                  )}
                </li>
              </Link>
            ))}

            {open ? (
              <div
                onClick={handleLogout}
                className="absolute flex hover:bg-[#ff7575] px-5 rounded-lg hover:text-black items-center justify-center w-full h-10 border-t cursor-pointer bottom-2"
              >
                <svg
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="text-gray-500 dark:text-gray-400"
                  style={{
                    transform: "rotate(-180deg)",
                    width: "25px",
                    height: "25px",
                  }} // Rotating 180 degrees to the left
                >
                  <path d="M17 16l4-4m0 0l-4-4 m4 4h-14m5 8 H6a3 3 0 01-3-3V7a3 3 0 013-3h7"></path>
                </svg>
                <p
                  className={`${pStyle} text-gray-500 truncate p-1 ${
                    !open ? "hidden" : ""
                  } dark:text-gray-400`}
                >
                  Logout
                </p>
              </div>
            ) : (
              <div
                onClick={handleLogout}
                className="absolute flex items-center justify-center w-full h-10 border-t border-gray-300 cursor-pointer group bottom-2"
              >
                <svg
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="text-gray-500 hover:text-[#ff7575] dark:text-gray-400"
                  style={{
                    transform: "rotate(-180deg)",
                    width: "25px",
                    height: "25px",
                  }} // Rotating 180 degrees to the left
                >
                  <path d="M17 16l4-4m0 0l-4-4 m4 4h-14m5 8 H6a3 3 0 01-3-3V7a3 3 0 013-3h7"></path>
                </svg>
                <p
                  className={`${pStyle2} truncate p-1 absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-[#ff7575] text-black rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300`}
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar2;
