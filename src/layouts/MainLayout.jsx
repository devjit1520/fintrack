import {useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import GlobalSearch from "../components/search/GlobalSearch";

import Sidebar from "../components/layout/Sidebar";
import MobileSidebar from "../components/layout/MobileSidebar";
import TopHeader from "../components/layout/TopHeader";

function MainLayout() {
 const [sidebarOpen, setSidebarOpen] = useState(false);
const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {

  const handleKey = (e) => {

    if (e.ctrlKey && e.key.toLowerCase() === "k") {

      e.preventDefault();

      setSearchOpen(true);

    }

  };

  window.addEventListener("keydown", handleKey);

  return () =>
    window.removeEventListener("keydown", handleKey);

}, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:ml-72">

        {/* Mobile Header */}
<TopHeader
    openSidebar={() => setSidebarOpen(true)}
    openSearch={() => setSearchOpen(true)}
/>

        <main className="min-h-screen p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>
<GlobalSearch
    open={searchOpen}
    onClose={() => setSearchOpen(false)}
/>

    </div>
  );
}

export default MainLayout;