"use client";

import { useEffect, useState } from "react";
import Slice from "../../../../../public/assets/Slice.png";
import building from "../../../../../public/assets/building.jpg";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import BounceLoader from "react-spinners/ClipLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../../../context/AuthContext";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import guestPage from "@/lib/guestPage";

type UserCredentials = z.infer<typeof schema>;

const schema = z.object({
  email: z.string().min(3).max(50),
  password: z.string().min(5).max(20),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, error, setError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserCredentials>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();

  const submitData: SubmitHandler<UserCredentials> = async (data) => {
    setLoading(true);
    try {
      await login(data, router);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setError("");
  };

  const inputStyle =
    "w-full lg:max-w-[417px] h-[45px] p-2 bg-gray-300 rounded-lg text-black focus:outline-none focus:ring-1 focus:ring-primary";
  return (
    <div className="flex flex-row bg-[#FFFFFF] text-black">
      <div className="relative flex items-center justify-center w-full p-8 bg-center bg-cover lg:w-1/2">
        <Image
          className="absolute inset-0 z-0 object-cover w-full h-screen lg:hidden"
          width={0}
          height={0}
          src={building}
          alt="photo"
        />

        <div className="lg:max-w-[481px] bg-white md:max-w-[430px] w-full lg:mt-0 mt-20  bg-opacity-90 p-8 rounded-lg z-10 lg:m-0 m-10 ">
          <h1 className="text-primary font-bold lg:!text-[32px] md:!text-2xl mb-6 text-left lg:mt-0 ">
            <Link href="/" className="transition hover:text-[#38bdf1]">
              <ArrowLeftCircleIcon className="inline w-18 h-18" />
            </Link>{" "}
            ACCOUNT LOGIN
          </h1>
          {error && (
            <div
              className="flex items-center px-4 py-5 mb-4 text-red-700 bg-red-100 border border-red-400 rounded"
              role="alert"
              aria-live="assertive"
            >
              <FontAwesomeIcon
                className="w-6 h-6 mr-4 text-red-500"
                icon={faTriangleExclamation}
              />
              <div>
                <strong className="font-bold">Error!</strong>
                <span className="block ml-2 sm:inline">{error}</span>
              </div>
              <button
                onClick={handleCloseAlert}
                className="ml-auto text-red-500 hover:text-red-700 focus:outline-none"
                aria-label="Close alert"
              >
                &times;
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit(submitData)}>
            <div className="mb-4">
              <h1 className="mb-2 text-base lg:text-lg">Email</h1>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Enter Email"
                className={`${inputStyle} autofill-input`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {" "}
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <h1 className="mb-2 text-base lg:text-lg">Password</h1>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter password"
                className={`${inputStyle}  autofill-input`}
              />
              <div className="flex flex-row items-center mt-2">
                <label className="cursor-pointer label">
                  <input
                    type="checkbox"
                    checked={showPassword} // Controlled component
                    className="checkbox checkbox-info checked:[--chkfg:white]"
                    onChange={() => setShowPassword(!showPassword)}
                  />
                </label>
                <div className="group relative">
                  <button
                    type="button"
                    className="ml-2 label-text cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    Show password
                  </button>
                  <span className="absolute transition-all duration-500 ease-in-out w-0 opacity-0 group-hover:opacity-100 group-hover:w-full border-0 border-t border-blue-400 left-0 bottom-0 ml-2"></span>
                </div>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
              <div className="flex justify-center">
                <Link href="/forgot-password">
                  <p className=" font-medium lg:text-base text-xs mt-[12px]  cursor-pointer">
                    Forgot Password
                  </p>
                </Link>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <button
                className="cursor-pointer bg-primary text-white px-4 rounded-lg w-full lg:max-w-[417px] lg:h-[45px] h-10"
                type="submit"
                disabled={loading || !!errors.email || !!errors.password}
              >
                {loading ? (
                  <span>
                    <BounceLoader color="#FFFFFF" />
                  </span>
                ) : (
                  "Log In"
                )}
              </button>
            </div>
          </form>

          <Link href="/registration">
            <div className="flex flex-row justify-center items-center mt-[10px]">
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
      <div className="items-center justify-center hidden w-1/2 lg:block">
        <Image
          height={0}
          width={0}
          className="object-cover w-full h-screen"
          src={Slice}
          alt="photo"
        />
      </div>
    </div>
  );
};

export default guestPage(Login);
