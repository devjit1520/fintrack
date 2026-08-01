import {
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
} from "framer-motion";

import {
  Outlet,
  useLocation,
} from "react-router-dom";

import PageTransition from "../components/common/PageTransition";
import RouteFallback from "../components/common/RouteFallback";

import GlobalSearch from "../components/search/GlobalSearch";

import Sidebar from "../components/layout/Sidebar";
import MobileSidebar from "../components/layout/MobileSidebar";
import TopHeader from "../components/layout/TopHeader";

// import {
//   preloadRelatedRoutes,
// } from "../routes/routeModules";

/* =========================================================
   SIDEBAR STORAGE KEY
========================================================= */

const SIDEBAR_COLLAPSED_KEY =
  "fintrack-sidebar-collapsed";

/* =========================================================
   READ SAVED SIDEBAR STATE
========================================================= */

function getInitialSidebarState() {
  try {
    return (
      window.localStorage.getItem(
        SIDEBAR_COLLAPSED_KEY
      ) === "true"
    );
  } catch {
    return false;
  }
}

/* =========================================================
   MAIN APPLICATION LAYOUT
========================================================= */

function MainLayout() {
  const location =
    useLocation();

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(
    getInitialSidebarState
  );

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);

  /* =======================================================
     SAVE SIDEBAR COLLAPSE STATE
  ======================================================= */

  useEffect(() => {
    try {
      window.localStorage.setItem(
        SIDEBAR_COLLAPSED_KEY,
        String(sidebarCollapsed)
      );
    } catch {
      // Ignore storage errors.
    }
  }, [sidebarCollapsed]);

  /* =======================================================
     CLOSE MOBILE UI AFTER NAVIGATION
  ======================================================= */

  useEffect(() => {
    setSidebarOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  /* =======================================================
     GLOBAL SEARCH SHORTCUT
  ======================================================= */

  useEffect(() => {
    const handleGlobalSearch = (
      event
    ) => {
      const pressedShortcut =
        (event.ctrlKey ||
          event.metaKey) &&
        event.key
          .toLowerCase() === "k";

      if (!pressedShortcut) {
        return;
      }

      event.preventDefault();

      setSearchOpen(
        (current) => !current
      );
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

  /* =======================================================
     PRELOAD RELATED ROUTES
  ======================================================= */

  useEffect(() => {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    const slowConnection =
      connection?.saveData ||
      connection?.effectiveType ===
        "slow-2g" ||
      connection?.effectiveType ===
        "2g";

    if (slowConnection) {
      return undefined;
    }

    let idleId;
    let timeoutId;

    const preload = () => {
      preloadRelatedRoutes(
        location.pathname
      );
    };

    if (
      "requestIdleCallback" in window
    ) {
      idleId =
        window.requestIdleCallback(
          preload,
          {
            timeout: 1800,
          }
        );
    } else {
      timeoutId =
        window.setTimeout(
          preload,
          900
        );
    }

    return () => {
      if (
        idleId &&
        "cancelIdleCallback" in window
      ) {
        window.cancelIdleCallback(
          idleId
        );
      }

      if (timeoutId) {
        window.clearTimeout(
          timeoutId
        );
      }
    };
  }, [location.pathname]);

  /* =======================================================
     TOGGLE DESKTOP SIDEBAR
  ======================================================= */

  const toggleSidebarCollapse =
    () => {
      setSidebarCollapsed(
        (current) => !current
      );
    };

  return (
    <div
      className="
        min-h-dvh
        min-w-0
        overflow-x-hidden
        bg-slate-100
        text-slate-900
        transition-colors
        duration-300
        dark:bg-slate-950
        dark:text-slate-100
      "
    >
      {/* Fixed desktop sidebar */}

      <Sidebar
        collapsed={
          sidebarCollapsed
        }
        onToggleCollapse={
          toggleSidebarCollapse
        }
      />

      {/* Mobile sidebar */}

      <MobileSidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* Right application area */}

      <div
        className={`
          min-h-dvh
          min-w-0
          overflow-x-hidden
          transition-[margin-left]
          duration-300
          ease-in-out
          ${
            sidebarCollapsed
              ? "lg:ml-20"
              : "lg:ml-72"
          }
        `}
      >
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
            min-h-[calc(100dvh-5rem)]
            min-w-0
            overflow-x-hidden
            bg-[#f4f7fb]
            transition-colors
            duration-300
            dark:bg-[#020617]
          "
        >
          <AnimatePresence
            mode="sync"
            initial={false}
          >
            <PageTransition
              key={location.pathname}
            >
              <div
                className="
                  min-h-[calc(100dvh-5rem)]
                  min-w-0
                  px-4
                  pb-8
                  pt-4
                  sm:px-6
                  sm:pb-10
                  sm:pt-6
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