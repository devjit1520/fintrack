import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Welcome from "../pages/Welcome/Welcome";

import AuthLayout from "../pages/Auth/AuthLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import Dashboard from "../pages/Dashboard/Dashboard";
import Transactions from "../pages/Transactions/Transactions";
import Budget from "../pages/Budget/Budget";
import Goals from "../pages/Goals/Goals";
import Analytics from "../pages/Analytics/Analytics";
import Profile from "../pages/Profile/Profile";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicOnlyRoute from "../components/auth/PublicOnlyRoute";

import ErrorBoundary from "../components/common/ErrorBoundary";

function AppRoutes() {
  return (
    <Routes>
      {/* =====================================================
          PUBLIC-ONLY PAGES
      ====================================================== */}

      <Route element={<PublicOnlyRoute />}>
        {/* First page shown to logged-out users */}
        <Route
          path="/"
          element={<Welcome />}
        />

        {/* Login and registration layout */}
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

      {/* =====================================================
          PROTECTED APPLICATION PAGES
      ====================================================== */}

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

      {/* =====================================================
          UNKNOWN URL
      ====================================================== */}

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