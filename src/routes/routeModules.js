import { lazy } from "react";

/* =========================================================
   ROUTE IMPORTERS
========================================================= */

const routeImporters = {
  "/dashboard": () =>
    import(
      "../pages/Dashboard/Dashboard"
    ),

  "/transactions": () =>
    import(
      "../pages/Transactions/Transactions"
    ),

  "/budget": () =>
    import(
      "../pages/Budget/Budget"
    ),

  "/goals": () =>
    import(
      "../pages/Goals/Goals"
    ),

  "/analytics": () =>
    import(
      "../pages/Analytics/Analytics"
    ),

  "/profile": () =>
    import(
      "../pages/Profile/Profile"
    ),
};

const routePromiseCache =
  new Map();

/* =========================================================
   RESOLVE ROUTE
========================================================= */

function resolveRoutePath(
  pathname
) {
  return Object.keys(
    routeImporters
  ).find(
    (routePath) =>
      pathname === routePath ||
      pathname.startsWith(
        `${routePath}/`
      )
  );
}

/* =========================================================
   LOAD AND CACHE
========================================================= */

function loadRoute(routePath) {
  const importer =
    routeImporters[routePath];

  if (!importer) {
    return Promise.resolve(null);
  }

  if (
    !routePromiseCache.has(
      routePath
    )
  ) {
    routePromiseCache.set(
      routePath,
      importer()
    );
  }

  return routePromiseCache.get(
    routePath
  );
}

function createLazyRoute(
  routePath
) {
  return lazy(() =>
    loadRoute(routePath)
  );
}

/* =========================================================
   LAZY ROUTES
========================================================= */

export const Dashboard =
  createLazyRoute("/dashboard");

export const Transactions =
  createLazyRoute(
    "/transactions"
  );

export const Budget =
  createLazyRoute("/budget");

export const Goals =
  createLazyRoute("/goals");

export const Analytics =
  createLazyRoute("/analytics");

export const Profile =
  createLazyRoute("/profile");

/* =========================================================
   PRELOAD ONE ROUTE
========================================================= */

export function preloadRoute(
  pathname
) {
  const routePath =
    resolveRoutePath(pathname);

  if (!routePath) {
    return Promise.resolve(null);
  }

  return loadRoute(
    routePath
  ).catch((error) => {
    console.error(
      `Unable to preload ${routePath}:`,
      error
    );

    return null;
  });
}

/* =========================================================
   PRELOAD LIKELY NEXT ROUTES
========================================================= */

const relatedRoutes = {
  "/dashboard": [
    "/transactions",
    "/budget",
  ],

  "/transactions": [
    "/dashboard",
    "/analytics",
  ],

  "/budget": [
    "/dashboard",
    "/goals",
  ],

  "/goals": [
    "/dashboard",
    "/budget",
  ],

  "/analytics": [
    "/dashboard",
    "/transactions",
  ],

  "/profile": [
    "/dashboard",
  ],
};

export function preloadRelatedRoutes(
  pathname
) {
  const currentPath =
    resolveRoutePath(pathname);

  const paths =
    relatedRoutes[
      currentPath
    ] || [];

  return Promise.allSettled(
    paths.map((path) =>
      preloadRoute(path)
    )
  );
}