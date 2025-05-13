import Preloader from "@/components/loaders/PreLoader";
import Unauthenticated from "@/components/not-authenticated";
import Unauthorized from "@/components/not-authorized";
import { useAuth } from "@/context/AuthContext";

export default function authenticatedPage(WrappedComponent: any) {
  return (props: any) => {
    const { user, isLoading, isAuthenticated } = useAuth();

    if (isLoading) {
      return <Preloader />;
    }

    if (user.length === 0 || !isAuthenticated) {
      return <Unauthenticated />;
    }

    return <WrappedComponent {...props} />;
  };
}
