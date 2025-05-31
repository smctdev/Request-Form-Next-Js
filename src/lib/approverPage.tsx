import Preloader from "@/components/loaders/PreLoader";
import Unauthenticated from "@/components/NotAuthenticated";
import Unauthorized from "@/components/NotAuthorized";
import { useAuth } from "@/context/AuthContext";

export default function approverPage(WrappedComponent: any) {
  return (props: any) => {
    const { user, isLoading, isApprover, isAuthenticated } = useAuth();

    if (isLoading) {
      return <Preloader />;
    }

    if (!user || !isAuthenticated) {
      return <Unauthenticated />;
    }

    if (!isApprover) {
      return <Unauthorized />;
    }

    return <WrappedComponent {...props} />;
  };
}
