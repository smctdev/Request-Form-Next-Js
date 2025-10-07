"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Preloader from "./loaders/PreLoader";

export default function PageError() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) return <Preloader />;

  return (
    <>
      <div className="flex flex-col items-center justify-center fixed top-0 z-50 bottom-0 left-0 inset-1 right-0 min-h-screen p-4 text-center bg-gradient-to-br from-primary to-secondary">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-base-100 rounded-full bg-opacity-70 !animate-pulse"
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

        <div className="relative z-10 w-full max-w-2xl">
          <div className="bg-base-100 rounded-3xl shadow-2xl p-8 md:p-12 transform transition-all hover:scale-[1.01] duration-300">
            <div className="flex justify-center mb-8">
              <p className="!text-6xl font-bold">
                Ops! Something went wrong with this page.
              </p>
            </div>
            <p className="mb-8 !text-lg opacity-80">
              We're having trouble loading this page right now. Please try again
              later or head back to the dashboard.
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
                className="bg-base-100 btn btn-outline btn-wide"
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
