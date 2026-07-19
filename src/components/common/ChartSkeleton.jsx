function ChartSkeleton({
  heightClass = "h-80",
}) {
  return (
    <div
      className={`
        relative
        w-full
        min-w-0
        overflow-hidden
        rounded-3xl
        border
        border-slate-200/80
        bg-white
        dark:border-slate-800
        dark:bg-slate-900
        ${heightClass}
      `}
      role="status"
      aria-label="Loading chart"
    >
      <div
        className="
          absolute
          left-6
          top-6
          h-5
          w-40
          animate-pulse
          rounded-lg
          bg-slate-200
          dark:bg-slate-800
        "
      />

      <div
        className="
          absolute
          inset-x-6
          bottom-6
          top-20
          animate-pulse
          rounded-2xl
          bg-slate-100
          dark:bg-slate-950/60
        "
      />

      <span className="sr-only">
        Loading chart...
      </span>
    </div>
  );
}

export default ChartSkeleton;