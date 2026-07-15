import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import AuthPageLoader from "./AuthPageLoader";

function ProtectedRoute() {
  const location = useLocation();

  const {
    loading,
    isAuthenticated,
  } = useAuth();

  if (loading) {
    return (
      <AuthPageLoader message="Checking your session..." />
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;