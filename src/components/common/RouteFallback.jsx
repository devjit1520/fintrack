function SkeletonBlock({
  className = "",
}) {
  return (
    <div
      className={`
        animate-pulse
        rounded-2xl
        bg-slate-200/80
        dark:bg-slate-800/80
        ${className}
      `}
    />
  );
}

function RouteFallback() {
  return (
    <div
      className="
        min-w-0
        space-y-6
        py-4
      "
      role="status"
      aria-label="Loading page content"
    >
      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div className="space-y-3">
          <SkeletonBlock className="h-8 w-52" />
          <SkeletonBlock className="h-4 w-72 max-w-full" />
        </div>

        <SkeletonBlock className="h-11 w-full sm:w-36" />
      </div>

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <SkeletonBlock
            key={index}
            className="h-32"
          />
        ))}
      </div>

      <div
        className="
          grid
          gap-5
          xl:grid-cols-2
        "
      >
        <SkeletonBlock className="h-72" />
        <SkeletonBlock className="h-72" />
      </div>

      <span className="sr-only">
        Loading...
      </span>
    </div>
  );
}

export default RouteFallback;