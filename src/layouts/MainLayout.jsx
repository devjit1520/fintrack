import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

function MainLayout() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="flex-1 lg:ml-72">
        <Navbar />

        {/* <main className="p-6 lg:p-8">
          <Outlet />
        </main> */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 p-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}

export default MainLayout;