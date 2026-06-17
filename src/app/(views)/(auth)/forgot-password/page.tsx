"use client";

import React, { useState } from "react";
import building from "@/assets/building.jpg";
import { XCircleIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import guestPage from "@/lib/guestPage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    setLoading(true);
    if (!email) {
      setError("Please enter your email address."); // Set error if no email is provided
      setLoading(false); // Stop the loading indicator
      return; // Exit the function early
    }

    try {
      const response = await api.post(`/password/email`, {
        email,
      });
      if (response.status === 200) {
        setEmail("");
        setError(null);
        Swal.fire({
          icon: "success",
          title: response.data.message || "",
          iconColor: "#007bff",
          text: "You will be redirected to the login page",
          confirmButtonText: "Go to login",
          confirmButtonColor: "#007bff",
        }).then(() => {
          router.push("/login");
        });
      }
    } catch (error: any) {
      if (error) {
        console.error(error.response.data.message);
        setError(error.response.data.message);
      }
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="relative flex items-center justify-center w-full lg:w-1/2 p-6">
        {/* Mobile background */}
        <Image
          className="absolute inset-0 z-0 object-cover w-full h-full lg:hidden"
          fill
          src={building}
          alt="background"
        />
        <div className="absolute inset-0 z-0 bg-black/40 lg:hidden" />

        <div className="relative z-10 w-full max-w-lg border border-base-300 rounded-2xl">
          {/* Card */}
          <div className="bg-base-100 rounded-2xl shadow-2xl p-8 lg:p-10">
            {/* Header */}
            <div className="mb-8">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-primary hover:opacity-70 transition-opacity mb-6 flex items-center gap-1 text-xs font-medium"
              >
                ← Back to login
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="flex items-start gap-3 px-4 py-3 mb-6 text-error bg-error/10 border border-error/30 rounded-xl">
                <XCircleIcon className="w-5 h-5 text-error mt-0.5 shrink-0" />
                <span className="text-sm flex-1">{error}</span>
                <button
                  onClick={() => setError("")}
                  className="text-error/60 hover:text-error transition-colors"
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
            )}

            <Link href="/login">
              <div className="block lg:hidden">
                <XCircleIcon className="absolute mb-2   cursor-pointer size-8 right-4 top-4" />
              </div>
            </Link>
            <h1 className="p-4 mt-4 text-2xl font-semibold text-center">
              Forgot your password?
            </h1>
            <p className="p-4 text-center text-primary font-bold !text-xl">
              We'll email you a secure link to reset the password for your
              account
            </p>
            <div className="px-6">
              <p className="mb-2">Email</p>
              <input
                type="email"
                value={email}
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full lg:max-w-[417px] h-[45px] p-2 bg-gray-300 rounded-lg"
              />
              {error && <p className="mt-2 text-red-500">{error}</p>}
            </div>
            <div className="px-6 pt-4">
              <button
                type="button"
                disabled={loading}
                onClick={handleResetPassword}
                className={`${
                  loading ? "bg-blue-400 !cursor-not-allowed" : ""
                } bg-primary hover:bg-blue-500 text-white py-2 px-4 rounded-lg w-full lg:max-w-[417px] h-[45px] cursor-pointer`}
              >
                {loading ? "Sending..." : "Send Link"}
              </button>
              <Link href="/login">
                <button
                  type="button"
                  className="flex items-center justify-center cursor-pointer bg-gray-600 border-2 hover:bg-gray-700 text-white my-2 py-4.5 px-4 rounded-lg w-full lg:max-w-[417px] h-[45px]"
                >
                  <span>Cancel</span>
                </button>
              </Link>
              <Link href="/registration">
                <div className="flex flex-row justify-center mt-[10px]">
                  <p className="text-sm italic text-center lg:text-base">
                    Don't have an account?{" "}
                  </p>
                  <p className="pl-2 text-sm italic font-bold underline text-primary lg:text-base">
                    Sign Up
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — decorative image */}
      <div className="hidden lg:block w-1/2 relative">
        <Image
          fill
          className="object-cover rounded-l-[150px]"
          src={building}
          alt="decorative"
          priority
        />
        <div className="absolute inset-0 bg-primary/10 rounded-l-[150px]" />
      </div>
    </div>
  );
};

export default guestPage(ForgotPassword);
