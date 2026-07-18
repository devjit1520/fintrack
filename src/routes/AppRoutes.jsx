import {
  lazy,
  Suspense,
} from "react";

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicOnlyRoute from "../components/auth/PublicOnlyRoute";

import ErrorBoundary from "../components/common/ErrorBoundary";
import PageLoader from "../components/common/PageLoader";

/* =========================================================
   LAZY-LOADED LAYOUTS
========================================================= */

const MainLayout = lazy(() =>
  import("../layouts/MainLayout")
);

const AuthLayout = lazy(() =>
  import("../pages/Auth/AuthLayout")
);

/* =========================================================
   LAZY-LOADED PUBLIC PAGES
========================================================= */

const Welcome = lazy(() =>
  import("../pages/Welcome/Welcome")
);

const Login = lazy(() =>
  import("../pages/Auth/Login")
);

const Register = lazy(() =>
  import("../pages/Auth/Register")
);

/* =========================================================
   LAZY-LOADED PROTECTED PAGES
========================================================= */

const Dashboard = lazy(() =>
  import("../pages/Dashboard/Dashboard")
);

const Transactions = lazy(() =>
  import("../pages/Transactions/Transactions")
);

const Budget = lazy(() =>
  import("../pages/Budget/Budget")
);

const Goals = lazy(() =>
  import("../pages/Goals/Goals")
);

const Analytics = lazy(() =>
  import("../pages/Analytics/Analytics")
);

const Profile = lazy(() =>
  import("../pages/Profile/Profile")
);

/* =========================================================
   ROUTES
========================================================= */

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* =================================================
            PUBLIC-ONLY PAGES
        ================================================== */}

        <Route element={<PublicOnlyRoute />}>
          <Route
            path="/"
            element={<Welcome />}
          />

          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />
          </Route>
        </Route>

        {/* =================================================
            PROTECTED APPLICATION PAGES
        ================================================== */}

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/transactions"
              element={<Transactions />}
            />

            <Route
              path="/budget"
              element={<Budget />}
            />

            <Route
              path="/goals"
              element={<Goals />}
            />

            <Route
              path="/analytics"
              element={
                <ErrorBoundary>
                  <Analytics />
                </ErrorBoundary>
              }
            />

            <Route
              path="/profile"
              element={<Profile />}
            />
          </Route>
        </Route>

        {/* =================================================
            UNKNOWN URL
        ================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;