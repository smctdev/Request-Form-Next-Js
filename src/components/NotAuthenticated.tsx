import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaLock, FaSignInAlt, FaUserPlus } from "react-icons/fa";

export default function Unauthenticated() {
  const router = useRouter();
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center p-4 text-center bg-gradient-to-br from-gray-100 to-gray-500">
      <div className="card w-full max-w-lg bg-base-100 shadow-2xl border border-base-300 transform transition-all hover:scale-[1.01] duration-300">
        <div className="p-8 card-body md:p-10">
          <div className="flex justify-center mb-6">
            <div className="p-5 rounded-full bg-error bg-opacity-20 text-error">
              <FaLock className="text-white !text-4xl" />
            </div>
          </div>
          <h1 className="mb-2 !text-3xl font-bold text-white">
            Access Restricted
          </h1>
          <p className="mb-6 !text-lg opacity-80 text-white">
            You need to be signed in to view this content. Please authenticate
            to continue.
          </p>
          <div className="flex flex-col w-full gap-4">
            <Link href="/login" className="gap-2 btn btn-primary">
              <FaSignInAlt /> Sign In
            </Link>

            <div className="text-white divider divider-primary">OR</div>

            <Link
              href="/registration"
              className="gap-2 text-white bg-gray-700 btn btn-outline"
            >
              <FaUserPlus /> Create Account
            </Link>
          </div>

          <div className="mt-6">
            <button
              onClick={() => router.back()}
              className="text-sm text-white link link-hover opacity-70"
            >
              ← Return to previous page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
