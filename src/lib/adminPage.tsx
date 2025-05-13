import Preloader from "@/components/loaders/PreLoader";
import Unauthenticated from "@/components/not-authenticated";
import Unauthorized from "@/components/not-authorized";
import { useAuth } from "@/context/AuthContext";

export default function adminPage(WrappedComponent: any) {
  return (props: any) => {
    const { user, isLoading, isAdmin, isAuthenticated } = useAuth();

    if (isLoading) {
      return <Preloader />;
    }

    if (!user || !isAuthenticated) {
      return <Unauthenticated />;
    }

    if (!isAdmin) {
      return <Unauthorized />;
    }

    return <WrappedComponent {...props} />;
  };
}
