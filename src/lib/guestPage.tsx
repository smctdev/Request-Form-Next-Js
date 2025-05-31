import Preloader from "@/components/loaders/PreLoader";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function guestPage(WrappedComponent: any) {
  function GuestPageComponent(props: any) {
    const { user, isLoading, isAuthenticated, isLogin } = useAuth();
    const router = useRouter();

    if (isLoading) {
      return <Preloader />;
    }

    if (!isLogin && !isLoading && (user?.length !== 0 || isAuthenticated)) {
      const path =
        user?.role === "approver" ? "/approver/dashboard" : "/dashboard";

      router.push(path);

      Swal.fire({
        icon: "warning",
        title: "Ops!",
        text: "You are already logged in",
        confirmButtonText: "Close",
        confirmButtonColor: "#dc3545",
      });
      return;
    }

    return <WrappedComponent {...props} />;
  }

  return GuestPageComponent;
}
