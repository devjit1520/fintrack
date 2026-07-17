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

  // Wait while Supabase checks the current session.
  if (loading) {
    return (
      <AuthPageLoader message="Checking your session..." />
    );
  }

  // Logged-out users return to the welcome page.
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // Logged-in users may access protected pages.
  return <Outlet />;
}

export default ProtectedRoute;