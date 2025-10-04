"use client";

import Image from "next/image";
import Logo from "@/assets/logo.png";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ThemeButton from "./theme-button";

export default function NavbarHome() {
  const [collapse, setCollapse] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleCLickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        divRef.current &&
        !divRef.current.contains(event.target as Node)
      ) {
        setCollapse(false);
      }
    };

    document.addEventListener("mousedown", handleCLickOutside);

    return () => {
      document.removeEventListener("mousedown", handleCLickOutside);
    };
  }, [buttonRef, divRef]);

  const handleOpen = () => {
    setCollapse(!collapse);
  };

  return (
    <div className="sticky top-0 z-50">
      <nav className="text-white shadow-lg bg-primary">
        <div className="container flex items-center justify-between px-4 py-4 mx-auto">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center">
              <Image
                src={Logo}
                alt="logo"
                height={70}
                width={70}
                className=""
              ></Image>
            </div>
            <h1 className="text-xl font-bold">SMCT Group of Companies</h1>
          </div>
          <div className="hidden space-x-6 md:flex items-center">
            <ThemeButton />
            {isAuthenticated ? (
              <Link
                href={`/${
                  user.role === "approver" ? "approver/dashboard" : "dashboard"
                }`}
                className="p-2 text-center transition hover:text-gray-50"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="transition hover:text-secondary">
                  Login
                </Link>
                <Link
                  href="/registration"
                  className="transition hover:text-secondary"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          <button
            ref={buttonRef}
            onClick={handleOpen}
            type="button"
            className="cursor-pointer md:hidden"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </nav>
      {/* for mobile */}
      {collapse && (
        <div
          ref={divRef}
          className="absolute w-full border-t shadow -bottom-22 border-black/10 md:hidden bg-primary"
        >
          <div className="flex flex-col space-y-2">
            {isAuthenticated ? (
              <Link
                href={`/${
                  user.role === "approver" ? "approver/dashboard" : "dashboard"
                }`}
                className="p-2 text-center text-white transition hover:text-gray-50"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="p-2 text-center text-white transition hover:text-gray-50"
                >
                  Login
                </Link>
                <Link
                  href="/registration"
                  className="p-2 text-center text-white transition hover:text-gray-50"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
