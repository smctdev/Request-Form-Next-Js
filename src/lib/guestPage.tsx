import Preloader from "@/components/loaders/PreLoader";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function guestPage(WrappedComponent: any) {
  return (props: any) => {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    if (isLoading) {
      return <Preloader />;
    }

    if (user.length !== 0 && isAuthenticated) {
      if (user.role === "approver") {
        router.push("/approver/dashboard");
      } else {
        router.push("/dashboard");
      }
      return Swal.fire({
        icon: "warning",
        title: "Ops!",
        text: "You are already logged in",
        confirmButtonText: "Close",
        confirmButtonColor: "#dc3545",
      });
    }

    return <WrappedComponent {...props} />;
  };
}
