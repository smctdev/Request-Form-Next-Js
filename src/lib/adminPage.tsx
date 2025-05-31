import Preloader from "@/components/loaders/PreLoader";
import Unauthenticated from "@/components/NotAuthenticated";
import Unauthorized from "@/components/NotAuthorized";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function adminPage(WrappedComponent: any) {
  function AdminPageComponent(props: any) {
    const { user, isLoading, isAdmin, isAuthenticated, setIsLogin } = useAuth();

    useEffect(() => {
      setIsLogin(false);
    }, [isAuthenticated, user]);

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
