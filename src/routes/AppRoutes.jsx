import {
  lazy,
  Suspense,
} from "react";

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Welcome from "../pages/Welcome/Welcome";

import AuthLayout from "../pages/Auth/AuthLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicOnlyRoute from "../components/auth/PublicOnlyRoute";

import ErrorBoundary from "../components/common/ErrorBoundary";
import PageLoader from "../components/common/PageLoader";

import {
  Analytics,
  Budget,
  Dashboard,
  Goals,
  Profile,
  Transactions,
} from "./routeModules";

/*
  Protected code is downloaded only after login.
*/

const MainLayout = lazy(() =>
  import(
    "../layouts/MainLayout"
  )
);

const ProtectedAppProviders =
  lazy(() =>
    import(
      "../providers/ProtectedAppProviders"
    )
  );

function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}

      <Route
        element={
          <PublicOnlyRoute />
        }
      >
        <Route
          path="/"
          element={<Welcome />}
        />

        <Route
          element={<AuthLayout />}
        >
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

      {/* Protected application */}

      <Route
        element={
          <ProtectedRoute />
        }
      >
        <Route
          element={
            <Suspense
              fallback={
                <PageLoader />
              }
            >
              <ProtectedAppProviders />
            </Suspense>
          }
        >
          <Route
            element={
              <MainLayout />
            }
          >
            <Route
              path="/dashboard"
              element={
                <Dashboard />
              }
            />

            <Route
              path="/transactions"
              element={
                <Transactions />
              }
            />

            <Route
              path="/budget"
              element={
                <Budget />
              }
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
      </Route>

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
  );
}

export default AppRoutes;