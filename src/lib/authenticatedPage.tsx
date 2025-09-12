import Preloader from "@/components/loaders/PreLoader";
import Unauthenticated from "@/components/NotAuthenticated";
import Unauthorized from "@/components/NotAuthorized";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function authenticatedPage(
  WrappedComponent: any,
  isProtectedAdmin = false,
  isProtectedAuditor = false,
  isProtectedApprover = false
) {
  function AuthenticatedPageComponent(props: any) {
    const {
      user,
      isLoading,
      isAuthenticated,
      setIsLogin,
      isAuditor,
      isAdmin,
      isApprover,
    } = useAuth();
    const route = useRouter();
    const adminAndAuditor = isAdmin || isAuditor;
    const adminAndApprover = isAdmin || isApprover;
    const protectedAdminAndAuditor = isProtectedAuditor && isProtectedAdmin;
    const protectedAdminAndApprover = isProtectedApprover && isProtectedAdmin;
    const protectedAdmin =
      isProtectedApprover && isProtectedAdmin && isProtectedAuditor;

    const noAccess =
      (protectedAdmin && !isAdmin) ||
      (protectedAdminAndAuditor && !adminAndAuditor) ||
      (protectedAdminAndApprover && !adminAndApprover); 

    useEffect(() => {
      if (isLoading) return;

      if (!isAuthenticated) {
        route.replace("/login");
      }
      setIsLogin(false);
    }, [isLoading, isAuthenticated, route, isApprover]);

    if (isLoading || !isAuthenticated) {
      return <Preloader />;
    }

    if (user.length === 0 || !isAuthenticated) {
      return <Unauthenticated />;
    }

    if (noAccess) {
      return <Unauthorized />;
    }

    return <WrappedComponent {...props} />;
  }

  return AuthenticatedPageComponent;
}
