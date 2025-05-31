import Preloader from "@/components/loaders/PreLoader";
import Unauthenticated from "@/components/NotAuthenticated";
import Unauthorized from "@/components/NotAuthorized";
import { useAuth } from "@/context/AuthContext";

export default function adminPage(WrappedComponent: any) {
  function AdminPageComponent(props: any) {
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
  }

  return AdminPageComponent;
}
