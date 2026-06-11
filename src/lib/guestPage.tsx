import Preloader from "@/components/loaders/PreLoader";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function guestPage(WrappedComponent: any) {
  function GuestPageComponent(props: any) {
    const { user, isLoading, isAuthenticated, isLogin, isApprover } = useAuth();
    const router = useRouter();
    const isAlreadyAuthenticated = isAuthenticated && user;
    const pathname = usePathname();
    const isBackToDashboard = pathname !== "/";

    useEffect(() => {
      if (user && isAuthenticated && !isLoading && isBackToDashboard) {
        const path = isApprover ? "/approver/dashboard" : "/dashboard";

        Swal.fire({
          title: "Redirecting...",
          text: "Redirecting to dashboard. Please wait...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        router.push(path);

        if (!isLogin) {
          Swal.fire({
            icon: "warning",
            title: "Ops!",
            text: "You are already logged in",
            confirmButtonText: "Close",
            confirmButtonColor: "#dc3545",
          });
        }
      }
    }, [
      isAuthenticated,
      router,
      isApprover,
      isLogin,
      isBackToDashboard,
      user,
      isLoading,
    ]);

    if (isLoading) {
      return <Preloader />;
    }

    if (isBackToDashboard && isAlreadyAuthenticated) return null;

    return <WrappedComponent {...props} />;
  }

  return GuestPageComponent;
}
