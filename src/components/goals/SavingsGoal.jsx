import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Pencil,
  PiggyBank,
  Plus,
  Target,
  Trash2,
  Trophy,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  Link,
} from "react-router-dom";

import useGoal from "../../hooks/useGoal";

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(getSafeNumber(value));
}

function formatDate(value) {
  if (!value) {
    return "No deadline";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "No deadline";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

function getDaysRemaining(value) {
  if (!value) {
    return null;
  }

  const deadline =
    new Date(value);

  if (
    Number.isNaN(
      deadline.getTime()
    )
  ) {
    return null;
  }

  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  deadline.setHours(
    0,
    0,
    0,
    0
  );

  return Math.ceil(
    (
      deadline.getTime() -
      today.getTime()
    ) /
      (
        1000 *
        60 *
        60 *
        24
      )
  );
}

function clampPercentage(value) {
  return Math.min(
    Math.max(
      Number(value) || 0,
      0
    ),
    100
  );
}

function getGoalStatus({
  completed,
  daysRemaining,
  progress,
}) {
  if (completed) {
    return {
      label: "Completed",
      classes:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      icon: CheckCircle2,
    };
  }

  if (
    daysRemaining !== null &&
    daysRemaining < 0
  ) {
    return {
      label: "Overdue",
      classes:
        "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
      icon: CalendarDays,
    };
  }

  if (
    daysRemaining !== null &&
    daysRemaining <= 7
  ) {
    return {
      label: "Due Soon",
      classes:
        "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      icon: CalendarDays,
    };
  }

  if (progress >= 75) {
    return {
      label: "Almost There",
      classes:
        "border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400",
      icon: Trophy,
    };
  }

  return {
    label: "In Progress",
    classes:
      "border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    icon: Target,
  };
}

function SavingsGoal({
  onAddSavings,
  onEdit,
  onDelete,
}) {
  const {
    goals = [],
    loading,
    error,
  } = useGoal();

  const activeGoal =
    goals.find(
      (goal) =>
        String(
          goal.status || ""
        )
          .trim()
          .toLowerCase() ===
        "active"
    ) ||
    goals.find((goal) => {
      const target =
        getSafeNumber(
          goal.targetAmount ??
            goal.target_amount ??
            goal.target ??
            goal.amount
        );

      const saved =
        getSafeNumber(
          goal.savedAmount ??
            goal.saved_amount ??
            goal.saved
        );

      return (
        target > 0 &&
        saved < target
      );
    }) ||
    goals[0];

  const target =
    getSafeNumber(
      activeGoal?.targetAmount ??
        activeGoal?.target_amount ??
        activeGoal?.target ??
        activeGoal?.amount
    );

  const saved =
    getSafeNumber(
      activeGoal?.savedAmount ??
        activeGoal?.saved_amount ??
        activeGoal?.saved
    );

  const remaining =
    Math.max(
      target - saved,
      0
    );

  const rawProgress =
    target > 0
      ? (
          saved /
          target
        ) *
        100
      : 0;

  const progress =
    clampPercentage(
      rawProgress
    );

  const completed =
    target > 0 &&
    saved >= target;

  const daysRemaining =
    getDaysRemaining(
      activeGoal?.deadline
    );

  const goalStatus =
    getGoalStatus({
      completed,
      daysRemaining,
      progress,
    });

  const GoalStatusIcon =
    goalStatus.icon;

  if (loading) {
    return (
      <section
        className="
          rounded-3xl
          border
          border-slate-200/80
          bg-white
          p-6
          shadow-sm
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        <div className="animate-pulse">
          <div
            className="
              h-7
              w-48
              rounded-lg
              bg-slate-200
              dark:bg-slate-800
            "
          />

          <div
            className="
              mt-3
              h-4
              w-64
              rounded
              bg-slate-100
              dark:bg-slate-800/70
            "
          />

          <div
            className="
              mt-8
              h-72
              rounded-3xl
              bg-slate-100
              dark:bg-slate-800
            "
          />
        </div>
      </section>
    );
  }

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-slate-200/80
        bg-white
        p-6
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-64
          w-64
          rounded-full
          bg-cyan-500/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-28
          -left-20
          h-64
          w-64
          rounded-full
          bg-violet-500/10
          blur-3xl
        "
      />

      <div className="relative">
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
          <div className="flex items-start gap-3">
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-cyan-500/10
                text-cyan-600
                dark:text-cyan-400
              "
            >
              <PiggyBank size={24} />
            </div>

            <div>
              <h2
                className="
                  text-xl
                  font-black
                  tracking-tight
                  text-slate-950
                  dark:text-white
                  sm:text-2xl
                "
              >
                Savings Goal
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Track progress toward your
                most important financial
                target.
              </p>
            </div>
          </div>

          <Link
            to="/goals"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-semibold
              text-slate-700
              transition
              hover:border-cyan-400
              hover:text-cyan-600
              dark:border-slate-700
              dark:bg-slate-950/40
              dark:text-slate-200
              dark:hover:text-cyan-400
            "
          >
            Manage goals
            <ArrowRight size={16} />
          </Link>
        </div>

        {error && (
          <div
            className="
              mt-6
              rounded-2xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600
              dark:border-red-900
              dark:bg-red-950/30
              dark:text-red-400
            "
          >
            {error}
          </div>
        )}

        {!error && !activeGoal && (
          <div
            className="
              mt-8
              flex
              min-h-80
              flex-col
              items-center
              justify-center
              rounded-3xl
              border
              border-dashed
              border-slate-300
              bg-slate-50/70
              px-6
              text-center
              dark:border-slate-700
              dark:bg-slate-950/30
            "
          >
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-cyan-500/10
                text-cyan-500
              "
            >
              <Target size={30} />
            </div>

            <h3
              className="
                mt-5
                text-lg
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              No savings goal yet
            </h3>

            <p
              className="
                mt-2
                max-w-sm
                text-sm
                leading-6
                text-slate-500
                dark:text-slate-400
              "
            >
              Create a financial target and
              start tracking your savings
              progress.
            </p>

            <Link
              to="/goals"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-cyan-500
                px-5
                py-3
                font-semibold
                text-white
                transition
                hover:bg-cyan-600
              "
            >
              <Plus size={18} />
              Create goal
            </Link>
          </div>
        )}
                {!error && activeGoal && (
          <div className="mt-8 space-y-6">
            {/* Goal overview */}

            <div
              className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-gradient-to-br
                from-slate-50
                via-white
                to-cyan-50/60
                p-5
                dark:border-slate-800
                dark:from-slate-950/70
                dark:via-slate-950/40
                dark:to-cyan-950/20
                sm:p-6
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-20
                  -top-20
                  h-52
                  w-52
                  rounded-full
                  bg-cyan-500/10
                  blur-3xl
                "
              />

              <div
                className="
                  relative
                  grid
                  gap-7
                  xl:grid-cols-[210px_minmax(0,1fr)]
                "
              >
                {/* Circular progress */}

                <div
                  className="
                    flex
                    items-center
                    justify-center
                  "
                >
                  <div
                    className="
                      relative
                      flex
                      h-48
                      w-48
                      items-center
                      justify-center
                    "
                  >
                    <svg
                      viewBox="0 0 190 190"
                      className="
                        h-48
                        w-48
                        -rotate-90
                      "
                      aria-label={`${Math.round(
                        progress
                      )}% completed`}
                    >
                      <circle
                        cx="95"
                        cy="95"
                        r="78"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="14"
                        className="
                          text-slate-200
                          dark:text-slate-800
                        "
                      />

                      <motion.circle
                        cx="95"
                        cy="95"
                        r="78"
                        fill="none"
                        stroke="url(#goalProgressGradient)"
                        strokeWidth="14"
                        strokeLinecap="round"
                        strokeDasharray={
                          2 *
                          Math.PI *
                          78
                        }
                        initial={{
                          strokeDashoffset:
                            2 *
                            Math.PI *
                            78,
                        }}
                        animate={{
                          strokeDashoffset:
                            2 *
                            Math.PI *
                            78 *
                            (1 -
                              progress /
                                100),
                        }}
                        transition={{
                          duration: 1.1,
                          ease: "easeOut",
                        }}
                      />

                      <defs>
                        <linearGradient
                          id="goalProgressGradient"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#06b6d4"
                          />

                          <stop
                            offset="55%"
                            stopColor="#3b82f6"
                          />

                          <stop
                            offset="100%"
                            stopColor="#8b5cf6"
                          />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div
                      className="
                        absolute
                        inset-0
                        flex
                        flex-col
                        items-center
                        justify-center
                        text-center
                      "
                    >
                      <span
                        className="
                          text-4xl
                          font-black
                          tracking-tight
                          text-slate-950
                          dark:text-white
                        "
                      >
                        {Math.round(
                          progress
                        )}
                        %
                      </span>

                      <span
                        className="
                          mt-1
                          text-xs
                          font-medium
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        completed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Goal details */}

                <div className="min-w-0">
                  <div
                    className="
                      flex
                      flex-col
                      gap-4
                      sm:flex-row
                      sm:items-start
                      sm:justify-between
                    "
                  >
                    <div className="min-w-0">
                      <p
                        className="
                          text-xs
                          font-bold
                          uppercase
                          tracking-[0.2em]
                          text-cyan-600
                          dark:text-cyan-400
                        "
                      >
                        Current priority
                      </p>

                      <h3
                        className="
                          mt-2
                          truncate
                          text-2xl
                          font-black
                          tracking-tight
                          text-slate-950
                          dark:text-white
                          sm:text-3xl
                        "
                      >
                        {activeGoal.title ||
                          "Untitled Goal"}
                      </h3>

                      <p
                        className="
                          mt-2
                          text-sm
                          leading-6
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        {completed
                          ? "Congratulations! You have successfully reached this savings target."
                          : "Continue adding savings consistently to reach your target."}
                      </p>
                    </div>

                    <span
                      className={`
                        inline-flex
                        w-fit
                        shrink-0
                        items-center
                        gap-2
                        rounded-full
                        border
                        px-3
                        py-1.5
                        text-xs
                        font-bold
                        ${goalStatus.classes}
                      `}
                    >
                      <GoalStatusIcon
                        size={14}
                      />

                      {goalStatus.label}
                    </span>
                  </div>

                  {/* Main progress bar */}

                  <div className="mt-7">
                    <div
                      className="
                        mb-3
                        flex
                        items-center
                        justify-between
                        gap-4
                      "
                    >
                      <span
                        className="
                          text-sm
                          font-medium
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        Goal progress
                      </span>

                      <span
                        className="
                          text-sm
                          font-black
                          text-slate-900
                          dark:text-white
                        "
                      >
                        {formatCurrency(
                          saved
                        )}{" "}
                        /{" "}
                        {formatCurrency(
                          target
                        )}
                      </span>
                    </div>

                    <div
                      className="
                        h-3
                        overflow-hidden
                        rounded-full
                        bg-slate-200
                        dark:bg-slate-800
                      "
                    >
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${progress}%`,
                        }}
                        transition={{
                          duration: 1,
                          ease: "easeOut",
                        }}
                        className="
                          h-full
                          rounded-full
                          bg-gradient-to-r
                          from-cyan-500
                          via-blue-500
                          to-violet-500
                        "
                      />
                    </div>

                    <div
                      className="
                        mt-3
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-3
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      <span>
                        {formatCurrency(
                          remaining
                        )}{" "}
                        remaining
                      </span>

                      <span>
                        {completed
                          ? "Target achieved"
                          : `${Math.max(
                              0,
                              100 -
                                Math.round(
                                  progress
                                )
                            )}% still needed`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial summary */}

            <div
              className="
                grid
                gap-4
                sm:grid-cols-2
                xl:grid-cols-3
              "
            >
              <motion.article
                initial={{
                  opacity: 0,
                  y: 14,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.1,
                }}
                className="
                  rounded-2xl
                  border
                  border-emerald-200
                  bg-emerald-50
                  p-5
                  dark:border-emerald-900
                  dark:bg-emerald-950/20
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        text-sm
                        font-medium
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Amount saved
                    </p>

                    <h4
                      className="
                        mt-2
                        text-2xl
                        font-black
                        text-emerald-600
                        dark:text-emerald-400
                      "
                    >
                      {formatCurrency(
                        saved
                      )}
                    </h4>
                  </div>

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-emerald-500/10
                      text-emerald-500
                    "
                  >
                    <PiggyBank
                      size={21}
                    />
                  </div>
                </div>
              </motion.article>

              <motion.article
                initial={{
                  opacity: 0,
                  y: 14,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.17,
                }}
                className="
                  rounded-2xl
                  border
                  border-cyan-200
                  bg-cyan-50
                  p-5
                  dark:border-cyan-900
                  dark:bg-cyan-950/20
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        text-sm
                        font-medium
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Target amount
                    </p>

                    <h4
                      className="
                        mt-2
                        text-2xl
                        font-black
                        text-cyan-600
                        dark:text-cyan-400
                      "
                    >
                      {formatCurrency(
                        target
                      )}
                    </h4>
                  </div>

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-cyan-500/10
                      text-cyan-500
                    "
                  >
                    <Target size={21} />
                  </div>
                </div>
              </motion.article>

              <motion.article
                initial={{
                  opacity: 0,
                  y: 14,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.24,
                }}
                className="
                  rounded-2xl
                  border
                  border-violet-200
                  bg-violet-50
                  p-5
                  sm:col-span-2
                  dark:border-violet-900
                  dark:bg-violet-950/20
                  xl:col-span-1
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        text-sm
                        font-medium
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Remaining
                    </p>

                    <h4
                      className="
                        mt-2
                        text-2xl
                        font-black
                        text-violet-600
                        dark:text-violet-400
                      "
                    >
                      {formatCurrency(
                        remaining
                      )}
                    </h4>
                  </div>

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-violet-500/10
                      text-violet-500
                    "
                  >
                    <CircleDollarSign
                      size={21}
                    />
                  </div>
                </div>
              </motion.article>
            </div>

            {/* Deadline information */}

            <div
              className="
                flex
                flex-col
                gap-4
                rounded-2xl
                border
                border-slate-200
                bg-slate-50/70
                p-5
                dark:border-slate-800
                dark:bg-slate-950/30
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-amber-500/10
                    text-amber-500
                  "
                >
                  <CalendarDays
                    size={21}
                  />
                </div>

                <div>
                  <p
                    className="
                      text-xs
                      font-medium
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Goal deadline
                  </p>

                  <p
                    className="
                      mt-1
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {formatDate(
                      activeGoal.deadline
                    )}
                  </p>
                </div>
              </div>

              {daysRemaining !== null && (
                <span
                  className={`
                    inline-flex
                    w-fit
                    items-center
                    rounded-full
                    px-4
                    py-2
                    text-sm
                    font-bold
                    ${
                      completed
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : daysRemaining <
                          0
                        ? "bg-red-500/10 text-red-600 dark:text-red-400"
                        : daysRemaining <=
                          7
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                    }
                  `}
                >
                  {completed
                    ? "Goal completed"
                    : daysRemaining < 0
                    ? `${Math.abs(
                        daysRemaining
                      )} ${
                        Math.abs(
                          daysRemaining
                        ) === 1
                          ? "day"
                          : "days"
                      } overdue`
                    : `${daysRemaining} ${
                        daysRemaining === 1
                          ? "day"
                          : "days"
                      } remaining`}
                </span>
              )}
            </div>
                        {/* Goal actions */}

            <div
              className="
                grid
                gap-3
                sm:grid-cols-3
              "
            >
              <motion.button
                type="button"
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={() =>
                  onAddSavings?.(
                    activeGoal
                  )
                }
                disabled={
                  completed ||
                  typeof onAddSavings !==
                    "function"
                }
                className="
                  group
                  flex
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  bg-gradient-to-r
                  from-emerald-500
                  to-green-600
                  px-5
                  py-4
                  font-bold
                  text-white
                  shadow-lg
                  shadow-emerald-500/20
                  transition
                  hover:shadow-xl
                  hover:shadow-emerald-500/30
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/15
                    transition
                    group-hover:scale-105
                  "
                >
                  {completed ? (
                    <CheckCircle2
                      size={18}
                    />
                  ) : (
                    <Plus size={18} />
                  )}
                </span>

                <span>
                  {completed
                    ? "Goal Completed"
                    : "Add Savings"}
                </span>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={() =>
                  onEdit?.(activeGoal)
                }
                disabled={
                  typeof onEdit !==
                  "function"
                }
                className="
                  group
                  flex
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  border
                  border-blue-200
                  bg-blue-50
                  px-5
                  py-4
                  font-bold
                  text-blue-600
                  transition
                  hover:border-blue-400
                  hover:bg-blue-100
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:border-blue-900
                  dark:bg-blue-950/20
                  dark:text-blue-400
                  dark:hover:border-blue-700
                  dark:hover:bg-blue-950/40
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-500/10
                    transition
                    group-hover:scale-105
                  "
                >
                  <Pencil size={17} />
                </span>

                Edit Goal
              </motion.button>

              <motion.button
                type="button"
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={() =>
                  onDelete?.(activeGoal)
                }
                disabled={
                  typeof onDelete !==
                  "function"
                }
                className="
                  group
                  flex
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  border
                  border-red-200
                  bg-red-50
                  px-5
                  py-4
                  font-bold
                  text-red-600
                  transition
                  hover:border-red-400
                  hover:bg-red-100
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:border-red-900
                  dark:bg-red-950/20
                  dark:text-red-400
                  dark:hover:border-red-700
                  dark:hover:bg-red-950/40
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-500/10
                    transition
                    group-hover:scale-105
                  "
                >
                  <Trash2 size={17} />
                </span>

                Delete Goal
              </motion.button>
            </div>

            {/* Goal message */}

            <div
              className={`
                relative
                overflow-hidden
                rounded-2xl
                border
                px-5
                py-4
                ${
                  completed
                    ? `
                      border-emerald-200
                      bg-emerald-50
                      dark:border-emerald-900
                      dark:bg-emerald-950/20
                    `
                    : progress >= 75
                    ? `
                      border-violet-200
                      bg-violet-50
                      dark:border-violet-900
                      dark:bg-violet-950/20
                    `
                    : `
                      border-cyan-200
                      bg-cyan-50
                      dark:border-cyan-900
                      dark:bg-cyan-950/20
                    `
                }
              `}
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
                <div
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <div
                    className={`
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      ${
                        completed
                          ? "bg-emerald-500/10 text-emerald-500"
                          : progress >=
                            75
                          ? "bg-violet-500/10 text-violet-500"
                          : "bg-cyan-500/10 text-cyan-500"
                      }
                    `}
                  >
                    {completed ? (
                      <Trophy size={21} />
                    ) : progress >= 75 ? (
                      <Target size={21} />
                    ) : (
                      <PiggyBank
                        size={21}
                      />
                    )}
                  </div>

                  <div>
                    <p
                      className="
                        font-bold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      {completed
                        ? "Congratulations!"
                        : progress >= 75
                        ? "You are almost there"
                        : "Keep building momentum"}
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        leading-6
                        text-slate-600
                        dark:text-slate-400
                      "
                    >
                      {completed
                        ? `You reached your ${formatCurrency(
                            target
                          )} savings target.`
                        : progress >= 75
                        ? `Only ${formatCurrency(
                            remaining
                          )} remains to complete this goal.`
                        : `You have saved ${Math.round(
                            progress
                          )}% of your target. Consistent contributions will help you reach it faster.`}
                    </p>
                  </div>
                </div>

                <Link
                  to="/goals"
                  className="
                    inline-flex
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white/70
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-700
                    transition
                    hover:border-cyan-400
                    hover:text-cyan-600
                    dark:border-slate-700
                    dark:bg-slate-950/40
                    dark:text-slate-200
                    dark:hover:text-cyan-400
                  "
                >
                  View all goals
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default SavingsGoal;