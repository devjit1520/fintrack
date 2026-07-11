import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard/Dashboard";
import Transactions from "../pages/Transactions/Transactions";
import Budget from "../pages/Budget/Budget";
import Goals from "../pages/Goals/Goals";
import Analytics from "../pages/Analytics/Analytics";
import Settings from "../pages/Settings/Settings";
// import Analytics from "./pages/Analytics";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
         {/* Add this */}
  {/* <Route path="/analytics" element={<Analytics />} /> */}
      </Route>
    </Routes>
  );
}

export default AppRoutes;