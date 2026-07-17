import {
  useMemo,
  useState,
} from "react";

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

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import useGoal from "../../hooks/useGoal";

import DashboardGoalModal from "./DashboardGoalModal";

/* =========================================================
   HELPERS
========================================================= */

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

  if (Number.isNaN(date.getTime())) {
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

  const deadline = new Date(value);

  if (
    Number.isNaN(
      deadline.getTime()
    )
  ) {
    return null;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  return Math.ceil(
    (
      deadline.getTime() -
      today.getTime()
    ) /
      86400000
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
      icon: CheckCircle2,
      classes:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    };
  }

  if (
    daysRemaining !== null &&
    daysRemaining < 0
  ) {
    return {
      label: "Overdue",
      icon: CalendarDays,
      classes:
        "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
    };
  }

  if (
    daysRemaining !== null &&
    daysRemaining <= 7
  ) {
    return {
      label: "Due Soon",
      icon: CalendarDays,
      classes:
        "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  }

  if (progress >= 75) {
    return {
      label: "Almost There",
      icon: Trophy,
      classes:
        "border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400",
    };
  }

  return {
    label: "In Progress",
    icon: Target,
    classes:
      "border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  };
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  title,
  value,
  icon: Icon,
  cardClasses,
  iconClasses,
  valueClasses,
}) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 14,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className={`
        rounded-2xl
        border
        p-5
        ${cardClasses}
      `}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <h4
            className={`
              mt-2
              text-2xl
              font-black
              ${valueClasses}
            `}
          >
            {value}
          </h4>
        </div>

        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${iconClasses}
          `}
        >
          <Icon size={21} />
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   SAVINGS GOAL
========================================================= */

function SavingsGoal() {
  const {
    goals = [],
    loading,
    error,
  } = useGoal();

  const [modal, setModal] =
    useState({
      open: false,
      mode: "savings",
      goal: null,
    });

  /* =======================================================
     ACTIVE GOAL
  ======================================================= */

  const activeGoal = useMemo(() => {
    const active = goals.find(
      (goal) =>
        String(
          goal.status || ""
        )
          .trim()
          .toLowerCase() ===
        "active"
    );

    if (active) {
      return active;
    }

    const unfinished =
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
      });

    return unfinished || goals[0];
  }, [goals]);

  const target = getSafeNumber(
    activeGoal?.targetAmount ??
      activeGoal?.target_amount ??
      activeGoal?.target ??
      activeGoal?.amount
  );

  const saved = getSafeNumber(
    activeGoal?.savedAmount ??
      activeGoal?.saved_amount ??
      activeGoal?.saved
  );

  const remaining = Math.max(
    target - saved,
    0
  );

  const progress =
    clampPercentage(
      target > 0
        ? (saved / target) * 100
        : 0
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

  /* =======================================================
     SVG CIRCLE VALUES
  ======================================================= */

  const circleRadius = 78;

  const circleCircumference =
    2 * Math.PI * circleRadius;

  const circleOffset =
    circleCircumference *
    (1 - progress / 100);

  /* =======================================================
     MODAL ACTIONS
  ======================================================= */

  const openModal = (mode) => {
    if (!activeGoal) {
      return;
    }

    setModal({
      open: true,
      mode,
      goal: activeGoal,
    });
  };

  const closeModal = () => {
    setModal({
      open: false,
      mode: "savings",
      goal: null,
    });
  };

  /* =======================================================
     LOADING STATE
  ======================================================= */

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
          <div className="h-7 w-52 rounded-lg bg-slate-200 dark:bg-slate-800" />

          <div className="mt-3 h-4 w-64 rounded bg-slate-100 dark:bg-slate-800/70" />

          <div className="mt-8 h-80 rounded-3xl bg-slate-100 dark:bg-slate-800" />
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-slate-200/80
          bg-white
          p-5
          shadow-sm
          dark:border-slate-800
          dark:bg-slate-900
          sm:p-6
        "
      >
        {/* Background decoration */}

        <div
          className="
            pointer-events-none
            absolute
            -right-28
            -top-28
            h-72
            w-72
            rounded-full
            bg-cyan-500/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-32
            -left-24
            h-72
            w-72
            rounded-full
            bg-violet-500/10
            blur-3xl
          "
        />

        <div className="relative z-10">
          {/* =================================================
              HEADER
          ================================================== */}

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
                <h2 className="text-xl font-black tracking-tight text-slate-950 dark:text-white sm:text-2xl">
                  Savings Goal
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Track your most important financial target.
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

          {/* =================================================
              ERROR
          ================================================== */}

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

          {/* =================================================
              EMPTY STATE
          ================================================== */}

          {!error && !activeGoal && (
            <div
              className="
                mt-7
                flex
                min-h-72
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

              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                No savings goal yet
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                Create a goal and start tracking your savings progress.
              </p>

              <Link
                to="/goals"
                className="
                  mt-5
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

          {/* =================================================
              ACTIVE GOAL
          ================================================== */}

          {!error && activeGoal && (
            <div className="mt-7 space-y-5">
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
                  dark:via-slate-950/50
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
                    items-center
                    gap-7
                    lg:grid-cols-[210px_minmax(0,1fr)]
                  "
                >
                  {/* ===========================================
                      FIXED PERCENTAGE CIRCLE
                  ============================================ */}

                  <div className="flex items-center justify-center">
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
                        className="h-48 w-48 -rotate-90"
                        aria-label={`${Math.round(
                          progress
                        )}% completed`}
                      >
                        {/* Theme-aware background ring */}

                        <circle
                          cx="95"
                          cy="95"
                          r={circleRadius}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="14"
                          className="
                            text-slate-200
                            transition-colors
                            duration-300
                            dark:text-slate-700
                          "
                        />

                        {/* Progress ring */}

                        <motion.circle
                          cx="95"
                          cy="95"
                          r={circleRadius}
                          fill="none"
                          stroke="url(#dashboardGoalProgressGradient)"
                          strokeWidth="14"
                          strokeLinecap="round"
                          strokeDasharray={
                            circleCircumference
                          }
                          initial={{
                            strokeDashoffset:
                              circleCircumference,
                          }}
                          animate={{
                            strokeDashoffset:
                              circleOffset,
                          }}
                          transition={{
                            duration: 1.1,
                            ease: "easeOut",
                          }}
                        />

                        <defs>
                          <linearGradient
                            id="dashboardGoalProgressGradient"
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

                      {/* Circle center */}

                      <div
                        className="
                          absolute
                          inset-[29px]
                          flex
                          flex-col
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-slate-200
                          bg-white
                          text-center
                          shadow-inner
                          transition-colors
                          duration-300
                          dark:border-slate-700
                          dark:bg-slate-900
                        "
                      >
                        <span
                          className="
                           text-white
                            bg-clip-text
                            text-4xl
                            font-black
                            tracking-tight
                            text-transparent
                          "
                        >
                          {Math.round(
                            progress
                          )}
                          %
                        </span>

                        <span className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
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

                        <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                          {activeGoal.title ||
                            "Untitled Goal"}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                          {completed
                            ? "Congratulations! You have successfully completed this savings target."
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

                    {/* Horizontal progress */}

                    <div className="mt-7">
                      <div className="mb-3 flex items-center justify-between gap-4">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          Goal progress
                        </span>

                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {formatCurrency(
                            saved
                          )}{" "}
                          /{" "}
                          {formatCurrency(
                            target
                          )}
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
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

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
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

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <SummaryCard
                  title="Amount saved"
                  value={formatCurrency(
                    saved
                  )}
                  icon={PiggyBank}
                  cardClasses="
                    border-emerald-200
                    bg-emerald-50
                    dark:border-emerald-900
                    dark:bg-emerald-950/20
                  "
                  iconClasses="
                    bg-emerald-500/10
                    text-emerald-500
                  "
                  valueClasses="
                    text-emerald-600
                    dark:text-emerald-400
                  "
                />

                <SummaryCard
                  title="Target amount"
                  value={formatCurrency(
                    target
                  )}
                  icon={Target}
                  cardClasses="
                    border-cyan-200
                    bg-cyan-50
                    dark:border-cyan-900
                    dark:bg-cyan-950/20
                  "
                  iconClasses="
                    bg-cyan-500/10
                    text-cyan-500
                  "
                  valueClasses="
                    text-cyan-600
                    dark:text-cyan-400
                  "
                />

                <SummaryCard
                  title="Remaining"
                  value={formatCurrency(
                    remaining
                  )}
                  icon={
                    CircleDollarSign
                  }
                  cardClasses="
                    border-violet-200
                    bg-violet-50
                    sm:col-span-2
                    dark:border-violet-900
                    dark:bg-violet-950/20
                    xl:col-span-1
                  "
                  iconClasses="
                    bg-violet-500/10
                    text-violet-500
                  "
                  valueClasses="
                    text-violet-600
                    dark:text-violet-400
                  "
                />
              </div>

              {/* Deadline */}

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
                <div className="flex items-center gap-3">
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
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Goal deadline
                    </p>

                    <p className="mt-1 font-bold text-slate-900 dark:text-white">
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
                          : daysRemaining < 0
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : daysRemaining <= 7
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
                  relative
                  z-20
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
                    openModal(
                      "savings"
                    )
                  }
                  disabled={completed}
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
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                    {completed ? (
                      <CheckCircle2
                        size={18}
                      />
                    ) : (
                      <Plus size={18} />
                    )}
                  </span>

                  {completed
                    ? "Goal Completed"
                    : "Add Savings"}
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
                    openModal("edit")
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
                    dark:border-blue-900
                    dark:bg-blue-950/20
                    dark:text-blue-400
                    dark:hover:border-blue-700
                    dark:hover:bg-blue-950/40
                  "
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
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
                    openModal("delete")
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
                    dark:border-red-900
                    dark:bg-red-950/20
                    dark:text-red-400
                    dark:hover:border-red-700
                    dark:hover:bg-red-950/40
                  "
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10">
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
                      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/20"
                      : progress >= 75
                        ? "border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/20"
                        : "border-cyan-200 bg-cyan-50 dark:border-cyan-900 dark:bg-cyan-950/20"
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
                  <div className="flex items-start gap-3">
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
                            : progress >= 75
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
                      <p className="font-bold text-slate-900 dark:text-white">
                        {completed
                          ? "Congratulations!"
                          : progress >= 75
                            ? "You are almost there"
                            : "Keep building momentum"}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
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

      {/* Working goal modal */}

      <DashboardGoalModal
        open={modal.open}
        mode={modal.mode}
        goal={modal.goal}
        onClose={closeModal}
      />
    </>
  );
}

export default SavingsGoal;