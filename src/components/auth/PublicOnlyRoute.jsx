import {
  Navigate,
  Outlet,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import AuthPageLoader from "./AuthPageLoader";

function PublicOnlyRoute() {
  const {
    loading,
    isAuthenticated,
  } = useAuth();

  if (loading) {
    return (
      <AuthPageLoader message="Checking your session..." />
    );
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
}

export default PublicOnlyRoute;