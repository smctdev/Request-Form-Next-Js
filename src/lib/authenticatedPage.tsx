import Preloader from "@/components/loaders/PreLoader";
import Unauthenticated from "@/components/NotAuthenticated";
import Unauthorized from "@/components/NotAuthorized";
import { useAuth } from "@/context/AuthContext";

export default function authenticatedPage(WrappedComponent: any) {
  function AuthenticatedPageComponent(props: any) {
    const { user, isLoading, isAuthenticated } = useAuth();

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
