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

import {
  preloadRelatedRoutes,
} from "../routes/routeModules";

function MainLayout() {
  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);

  const location =
    useLocation();

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
        event.key.toLowerCase() ===
          "k";

      if (pressedShortcut) {
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

  /* =======================================================
     PRELOAD LIKELY NEXT PAGES

     Skip background downloads on data-saver and slow 2G.
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
      "requestIdleCallback" in
      window
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
        "cancelIdleCallback" in
          window
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
      <Sidebar />

      <MobileSidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <div
        className="
          min-w-0
          lg:ml-72
        "
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
            bg-[#f4f7fb]
            transition-colors
            duration-300
            dark:bg-[#020617]
          "
        >
          {/*
            mode="sync" keeps the current page visible while
            the next page begins rendering.

            mode="wait" was creating the visible pause.
          */}

          <AnimatePresence
            mode="sync"
            initial={false}
          >
            <PageTransition
              key={
                location.pathname
              }
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
                <Suspense
                  fallback={
                    <RouteFallback />
                  }
                >
                  <Outlet />
                </Suspense>
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