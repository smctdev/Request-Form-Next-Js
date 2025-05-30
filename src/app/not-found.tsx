"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [isMounted, setIsMounted] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <>
      <div className="flex flex-col items-center justify-center fixed top-0  bottom-0 left-0 inset-1 right-0 min-h-screen p-4 text-center bg-gradient-to-br from-primary to-secondary">
        {isMounted && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full bg-opacity-70 !animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 5 + 1}px`,
                  height: `${Math.random() * 5 + 1}px`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 10 + 5}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="relative z-10 w-full max-w-2xl">
          <div className="bg-base-100 rounded-3xl shadow-2xl p-8 md:p-12 transform transition-all hover:scale-[1.01] duration-300">
            <div className="flex justify-center mb-8">
              <p className="!text-6xl text-white font-bold">404 Not Found</p>
            </div>
            <p className="mb-8 !text-lg opacity-80 text-white">
              The page you're looking for seems to have drifted off into the
              cosmos. Don't worry, we'll help you navigate back to dashboard.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              {isAuthenticated ? (
                <Link
                  href={`/${
                    user.role === "approver"
                      ? "approver/dashboard"
                      : "dashboard"
                  }`}
                  className="btn btn-primary btn-wide"
                >
                  🚀 Beam Me To Dashboard
                </Link>
              ) : (
                <Link href="/login" className="btn btn-primary btn-wide">
                  🚀 Beam Me To Login
                </Link>
              )}
              <button
                className="bg-gray-100 btn btn-outline btn-wide"
                onClick={() => router.back()}
              >
                ↩ Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
