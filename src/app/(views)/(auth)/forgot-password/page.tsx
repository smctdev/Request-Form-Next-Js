"use client";

import React, { useState } from "react";
import Slice from "@/assets/Slice.png";
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
    <div className="flex flex-row">
      <div className="relative flex items-center justify-center w-full p-8 bg-center bg-cover lg:w-1/2">
        <Image
          width={0}
          height={0}
          className="absolute inset-0 z-0 object-cover w-full h-screen lg:hidden"
          src={building}
          alt="photo"
        />
        <div className="lg:max-w-[481px] md:max-w-[450px] w-full lg:mt-0  mt-20 bg-base-100 bg-opacity-90 p-8 rounded-lg z-10 lg:m-0 m-10 relative ">
          <Link href="/login">
            <div className="block lg:hidden">
              <XCircleIcon className="absolute mb-2   cursor-pointer size-8 right-4 top-4" />
            </div>
          </Link>
          <h1 className="p-4 mt-4 text-2xl font-semibold text-center">
            Forgot your password?
          </h1>
          <p className="p-4 text-center text-primary font-bold !text-xl">
            We'll email you a secure link to reset the password for your account
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
      <div className="items-center justify-center hidden w-1/2 lg:block">
        <Image
          width={0}
          height={0}
          className="object-cover w-full h-screen"
          src={Slice}
          alt="photo"
        />
      </div>
    </div>
  );
};

export default guestPage(ForgotPassword);
