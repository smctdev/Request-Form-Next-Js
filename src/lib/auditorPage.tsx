import Preloader from "@/components/loaders/PreLoader";
import Unauthenticated from "@/components/NotAuthenticated";
import Unauthorized from "@/components/NotAuthorized";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function auditorPage(WrappedComponent: any) {
  function AuditorPageComponent(props: any) {
    const {
      user,
      isLoading,
      isAuditor,
      isAuthenticated,
      setIsLogin,
      isLogin,
      isAdmin,
    } = useAuth();

    useEffect(() => {
      if (!isAuthenticated && !isLogin) return;
      setIsLogin(false);
    }, [isAuthenticated, user]);

    if (isLoading) {
      return <Preloader />;
    }

    if (!user || !isAuthenticated) {
      return <Unauthenticated />;
    }

    if (!isAuditor && !isAdmin) {
      return <Unauthorized />;
    }

    return <WrappedComponent {...props} />;
  }

  return AuditorPageComponent;
}
