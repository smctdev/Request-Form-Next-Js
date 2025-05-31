import Preloader from "@/components/loaders/PreLoader";
import Unauthenticated from "@/components/NotAuthenticated";
import Unauthorized from "@/components/NotAuthorized";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function authenticatedPage(WrappedComponent: any) {
  function AuthenticatedPageComponent(props: any) {
    const { user, isLoading, isAuthenticated, setIsLogin } = useAuth();

    useEffect(() => {
      setIsLogin(false);
    }, [isAuthenticated, user]);

    if (isLoading) {
      return <Preloader />;
    }

    if (user.length === 0 || !isAuthenticated) {
      return <Unauthenticated />;
    }

    return <WrappedComponent {...props} />;
  }

  return AuthenticatedPageComponent;
}
