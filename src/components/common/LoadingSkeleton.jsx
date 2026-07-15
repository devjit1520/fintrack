import clsx from "clsx";

function SkeletonBlock({
  className = "",
  rounded = "rounded-xl",
}) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "skeleton",
        rounded,
        className
      )}
    />
  );
}

function LoadingSkeleton({
  type = "card",
  count = 1,
  className = "",
}) {
  const items = Array.from(
    { length: count },
    (_, index) => index
  );

  if (type === "stats") {
    return (
      <div
        className={clsx(
          "premium-grid-small",
          className
        )}
      >
        {items.map((item) => (
          <div
            key={item}
            className="premium-card"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <SkeletonBlock className="h-4 w-28" />

                <SkeletonBlock className="mt-5 h-9 w-40" />

                <SkeletonBlock className="mt-5 h-3 w-32" />
              </div>

              <SkeletonBlock
                className="size-12 shrink-0"
                rounded="rounded-2xl"
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div
        className={clsx(
          "premium-card space-y-4",
          className
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <SkeletonBlock className="h-5 w-36" />
          <SkeletonBlock className="h-9 w-24" />
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item}
              className="grid grid-cols-[1fr_100px] items-center gap-4 rounded-xl border border-slate-200/70 p-4 dark:border-slate-800"
            >
              <div className="flex min-w-0 items-center gap-3">
                <SkeletonBlock
                  className="size-10 shrink-0"
                  rounded="rounded-xl"
                />

                <div className="min-w-0 flex-1">
                  <SkeletonBlock className="h-4 w-36 max-w-full" />
                  <SkeletonBlock className="mt-2 h-3 w-24" />
                </div>
              </div>

              <SkeletonBlock className="ml-auto h-5 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div
        className={clsx(
          "premium-card",
          className
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <SkeletonBlock className="h-5 w-36" />
            <SkeletonBlock className="mt-2 h-3 w-52 max-w-full" />
          </div>

          <SkeletonBlock className="h-9 w-24" />
        </div>

        <SkeletonBlock
          className="mt-7 h-[280px] w-full"
          rounded="rounded-2xl"
        />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "premium-grid",
        className
      )}
    >
      {items.map((item) => (
        <div
          key={item}
          className="premium-card"
        >
          <SkeletonBlock className="h-5 w-36" />
          <SkeletonBlock className="mt-4 h-4 w-full" />
          <SkeletonBlock className="mt-2 h-4 w-4/5" />

          <div className="mt-6 flex gap-3">
            <SkeletonBlock className="h-10 w-28" />
            <SkeletonBlock className="h-10 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;