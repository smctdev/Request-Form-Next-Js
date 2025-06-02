import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaBan,
  FaHome,
  FaLock,
  FaSignInAlt,
  FaUserShield,
} from "react-icons/fa";
import Swal from "sweetalert2";

export default function Unauthorized() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleSwitchAccount = () => {
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
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-50 flex flex-col min-h-screen bg-gradient-to-br from-error via-base-100 to-error">
      <main className="flex items-center justify-center flex-grow p-4">
        <div className="w-full max-w-3xl">
          <div className="border shadow-2xl card bg-base-100 backdrop-blur-md border-error/30">
            <div className="p-8 card-body md:p-12">
              <div className="flex flex-col items-center gap-8 lg:flex-row">
                <div className="flex-1 hidden lg:block">
                  <div className="relative p-8">
                    <div className="absolute -inset-8 bg-error/10 rounded-2xl -rotate-6"></div>
                    <div className="relative p-8 border shadow-lg bg-error/5 rounded-xl border-error/20">
                      <div className="text-center">
                        <FaBan className="mx-auto mb-4 !text-8xl text-error" />
                        <div className="gap-2 text-white badge badge-error">
                          <FaLock /> 403 Forbidden
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="mb-4 !text-4xl font-bold text-error">
                    Access Denied
                  </h1>
                  <p className="mb-6 text-lg text-white">
                    You don't have permission to access this resource. This area
                    requires special privileges.
                  </p>

                  <div className="space-y-4">
                    <div className="collapse collapse-plus bg-base-200">
                      <input
                        type="radio"
                        name="forbidden-options"
                        defaultChecked
                      />
                      <div className="font-medium text-white collapse-title">
                        I think I should have access
                      </div>
                      <div className="collapse-content">
                        <p className="mb-3 text-white">
                          Contact your administrator or:
                        </p>
                        <Link
                          href="/request-access"
                          className="gap-2 btn btn-outline btn-error btn-sm hover:text-white"
                        >
                          <FaUserShield /> Request Access
                        </Link>
                      </div>
                    </div>

                    <div className="collapse collapse-plus bg-base-200">
                      <input type="radio" name="forbidden-options" />
                      <div className="font-medium text-white collapse-title">
                        I have a different account
                      </div>
                      <div className="collapse-content">
                        <button
                          type="button"
                          onClick={handleSwitchAccount}
                          className="w-full gap-2 btn btn-outline btn-primary btn-sm"
                        >
                          <FaSignInAlt /> Switch Accounts
                        </button>
                      </div>
                    </div>

                    <div className="text-white divider divider-primary">OR</div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Link
                        href={`/${
                          user.role === "approver"
                            ? "approver/dashboard"
                            : "dashboard"
                        }`}
                        className="flex-1 gap-2 text-white btn btn-ghost"
                      >
                        <FaHome className="!text-6xl" /> Go back to Dashboard
                      </Link>
                      <button
                        onClick={() => router.back()}
                        className="flex-1 gap-2 text-white btn btn-ghost"
                      >
                        ↩ Go Back
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
