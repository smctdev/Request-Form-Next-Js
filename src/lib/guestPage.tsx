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
      if (isLoading || !isBackToDashboard) return;

      if (isAuthenticated) {
        const path = isApprover ? "/approver/dashboard" : "/dashboard";

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
      isLoading,
      isAuthenticated,
      router,
      isApprover,
      isLogin,
      isBackToDashboard,
    ]);

    if (isLoading) {
      return <Preloader />;
    }

    if (isBackToDashboard && isAlreadyAuthenticated) return null;

    return <WrappedComponent {...props} />;
  }

  return GuestPageComponent;
}
