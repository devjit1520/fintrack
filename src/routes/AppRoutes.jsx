import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import AuthLayout from "../pages/Auth/AuthLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import Dashboard from "../pages/Dashboard/Dashboard";
import Transactions from "../pages/Transactions/Transactions";
import Budget from "../pages/Budget/Budget";
import Goals from "../pages/Goals/Goals";
import Analytics from "../pages/Analytics/Analytics";
// import Settings from "../pages/Settings/Settings";
import Profile from "../pages/Profile/Profile";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicOnlyRoute from "../components/auth/PublicOnlyRoute";

import ErrorBoundary from "../components/common/ErrorBoundary";

function AppRoutes() {
  return (
    <Routes>
      {/* Public authentication pages */}
      <Route element={<PublicOnlyRoute />}>
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

      {/* Protected application pages */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="transactions"
            element={<Transactions />}
          />

          <Route
            path="budget"
            element={<Budget />}
          />

          <Route
            path="goals"
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

          {/* <Route
            path="settings"
            element={<Settings />}
          /> */}

          <Route
            path="profile"
            element={<Profile />}
          />
        </Route>
      </Route>

      {/* Unknown URL */}
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