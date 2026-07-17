import {useEffect, useState } from "react";
import {
  AnimatePresence,
} from "framer-motion";
import { Outlet , useLocation, } from "react-router-dom";
import PageTransition from "../components/common/PageTransition";

import GlobalSearch from "../components/search/GlobalSearch";

import Sidebar from "../components/layout/Sidebar";
import MobileSidebar from "../components/layout/MobileSidebar";
import TopHeader from "../components/layout/TopHeader";

function MainLayout() {
 const [sidebarOpen, setSidebarOpen] = useState(false);
const [searchOpen, setSearchOpen] = useState(false);
const location = useLocation();


useEffect(() => {
  const handleGlobalSearch = (
    event
  ) => {
    const pressedSearchShortcut =
      (event.ctrlKey ||
        event.metaKey) &&
      event.key.toLowerCase() ===
        "k";

    if (
      pressedSearchShortcut
    ) {
      event.preventDefault();

      setSearchOpen(true);
    }
  };

  window.addEventListener(
    "keydown",
    handleGlobalSearch
  );

  return () => {
    window.removeEventListener(
      "keydown",
      handleGlobalSearch
    );
  };
}, []);

  return (
<div
  className="
    min-h-screen
    bg-slate-100
    text-slate-900
    transition-colors
    duration-300
    dark:bg-slate-950
    dark:text-slate-100
  "
>

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
  openSidebar={() =>
    setSidebarOpen(true)
  }
  openSearch={() =>
    setSearchOpen(true)
  }
/>

<main
  className="
    min-h-screen
    bg-slate-100
    transition-colors
    duration-300
    dark:bg-slate-950
    p-2
  "
>
  <AnimatePresence
    mode="wait"
    initial={false}
  >
    <PageTransition key={location.pathname}>
<div
  className="
    min-h-screen
    bg-[#f4f7fb]
    px-4
    pb-5
    transition-colors
    duration-300
    dark:bg-[#020617]
    sm:px-6
    sm:pb-10
    lg:px-5

  "
>
  <Outlet />
</div>
    </PageTransition>
  </AnimatePresence>
</main>

      </div>
<GlobalSearch
  open={searchOpen}
  onClose={() =>
    setSearchOpen(false)
  }
/>

    </div>
  );
}

export default MainLayout;