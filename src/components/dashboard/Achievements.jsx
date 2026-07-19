import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  Award,
  CalendarCheck2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  LockKeyhole,
  PieChart,
  PiggyBank,
  Sparkles,
  Tags,
  Target,
  Trophy,
  WalletCards,
  Zap,
} from "lucide-react";

import useFinance from "../../hooks/useFinance";

/* =========================================================
   CONFIGURATION
========================================================= */

const UNLOCK_DATE_STORAGE_KEY =
  "fintrack-achievement-unlock-dates";

const LEVELS = [
  {
    level: 1,
    title: "Money Beginner",
    minimumXP: 0,
  },
  {
    level: 2,
    title: "Money Starter",
    minimumXP: 150,
  },
  {
    level: 3,
    title: "Finance Builder",
    minimumXP: 400,
  },
  {
    level: 4,
    title: "Money Manager",
    minimumXP: 750,
  },
  {
    level: 5,
    title: "Wealth Navigator",
    minimumXP: 1100,
  },
];

const ACCENT_DESIGNS = {
  cyan: {
    border:
      "border-cyan-500/25 hover:border-cyan-400/50",

    background:
      "from-cyan-500/[0.11] via-cyan-500/[0.04] to-transparent",

    icon:
      "bg-cyan-500/15 text-cyan-400",

    badge:
      "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",

    progress:
      "from-cyan-400 to-blue-500",

    footer:
      "text-cyan-400",

    glow:
      "bg-cyan-500/15",
  },

  violet: {
    border:
      "border-violet-500/25 hover:border-violet-400/50",

    background:
      "from-violet-500/[0.11] via-violet-500/[0.04] to-transparent",

    icon:
      "bg-violet-500/15 text-violet-400",

    badge:
      "border-violet-500/20 bg-violet-500/10 text-violet-400",

    progress:
      "from-violet-400 to-purple-500",

    footer:
      "text-violet-400",

    glow:
      "bg-violet-500/15",
  },

  blue: {
    border:
      "border-blue-500/25 hover:border-blue-400/50",

    background:
      "from-blue-500/[0.11] via-blue-500/[0.04] to-transparent",

    icon:
      "bg-blue-500/15 text-blue-400",

    badge:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",

    progress:
      "from-blue-400 to-indigo-500",

    footer:
      "text-blue-400",

    glow:
      "bg-blue-500/15",
  },

  emerald: {
    border:
      "border-emerald-500/25 hover:border-emerald-400/50",

    background:
      "from-emerald-500/[0.11] via-emerald-500/[0.04] to-transparent",

    icon:
      "bg-emerald-500/15 text-emerald-400",

    badge:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",

    progress:
      "from-emerald-400 to-teal-500",

    footer:
      "text-emerald-400",

    glow:
      "bg-emerald-500/15",
  },

  amber: {
    border:
      "border-amber-500/25 hover:border-amber-400/50",

    background:
      "from-amber-500/[0.11] via-amber-500/[0.04] to-transparent",

    icon:
      "bg-amber-500/15 text-amber-400",

    badge:
      "border-amber-500/20 bg-amber-500/10 text-amber-400",

    progress:
      "from-amber-400 to-orange-500",

    footer:
      "text-amber-400",

    glow:
      "bg-amber-500/15",
  },

  rose: {
    border:
      "border-rose-500/25 hover:border-rose-400/50",

    background:
      "from-rose-500/[0.11] via-rose-500/[0.04] to-transparent",

    icon:
      "bg-rose-500/15 text-rose-400",

    badge:
      "border-rose-500/20 bg-rose-500/10 text-rose-400",

    progress:
      "from-rose-400 to-red-500",

    footer:
      "text-rose-400",

    glow:
      "bg-rose-500/15",
  },
};

/* =========================================================
   SAFE HELPERS
========================================================= */

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function calculatePercentage(
  current,
  target
) {
  const safeCurrent =
    getSafeNumber(current);

  const safeTarget =
    getSafeNumber(target);

  if (safeTarget <= 0) {
    return 0;
  }

  return Math.min(
    Math.max(
      Math.round(
        (safeCurrent /
          safeTarget) *
          100
      ),
      0
    ),
    100
  );
}

function readStoredArray(
  exactKeys,
  keyword
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return [];
  }

  for (const key of exactKeys) {
    try {
      const parsed =
        JSON.parse(
          localStorage.getItem(
            key
          ) || "[]"
        );

      if (
        Array.isArray(parsed) &&
        parsed.length > 0
      ) {
        return parsed;
      }
    } catch {
      // Continue checking.
    }
  }

  /*
   * Supports per-user keys such as:
   * fintrack-goals-user-id
   * fintrack-budgets-user-id
   */
  for (
    let index = 0;
    index < localStorage.length;
    index += 1
  ) {
    const key =
      localStorage.key(index);

    if (
      !key ||
      !key
        .toLowerCase()
        .includes(keyword)
    ) {
      continue;
    }

    try {
      const parsed =
        JSON.parse(
          localStorage.getItem(
            key
          ) || "[]"
        );

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Ignore unrelated values.
    }
  }

  return [];
}

function readUnlockDates() {
  if (
    typeof window ===
    "undefined"
  ) {
    return {};
  }

  try {
    const parsed =
      JSON.parse(
        localStorage.getItem(
          UNLOCK_DATE_STORAGE_KEY
        ) || "{}"
      );

    return parsed &&
      typeof parsed === "object"
      ? parsed
      : {};
  } catch {
    return {};
  }
}

function formatUnlockedDate(value) {
  if (!value) {
    return "Achievement unlocked";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Achievement unlocked";
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

/* =========================================================
   PROGRESS RING
========================================================= */

function ProgressRing({
  percentage,
}) {
  const safePercentage =
    Math.min(
      Math.max(
        getSafeNumber(
          percentage
        ),
        0
      ),
      100
    );

  return (
    <div
      className="
        relative
        flex
        h-32
        w-32
        shrink-0
        items-center
        justify-center
        rounded-full
        shadow-[0_0_45px_rgba(59,130,246,0.14)]
        sm:h-36
        sm:w-36
      "
      style={{
        background: `
          conic-gradient(
            #22d3ee 0%,
            #3b82f6 ${
              safePercentage *
              0.55
            }%,
            #8b5cf6 ${safePercentage}%,
            rgba(51, 65, 85, 0.45) ${safePercentage}%,
            rgba(51, 65, 85, 0.45) 100%
          )
        `,
      }}
    >
      <div
        className="
          absolute
          inset-[10px]
          flex
          flex-col
          items-center
          justify-center
          rounded-full
          border
          border-white/[0.08]
          bg-[#0d172a]
          text-center
        "
      >
        <p
          className="
            text-2xl
            font-black
            text-white
            sm:text-3xl
          "
        >
          {safePercentage}%
        </p>

        <p
          className="
            mt-1
            text-[10px]
            font-semibold
            text-slate-400
          "
        >
          Complete
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SUMMARY STAT
========================================================= */

function SummaryStat({
  label,
  value,
  icon: Icon,
  iconClasses,
}) {
  return (
    <div
      className="
        flex
        min-w-0
        items-center
        gap-3
        rounded-2xl
        border
        border-white/[0.07]
        bg-white/[0.025]
        p-3
      "
    >
      <div
        className={`
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          ${iconClasses}
        `}
      >
        <Icon size={16} />
      </div>

      <div className="min-w-0">
        <p
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-wide
            text-slate-500
          "
        >
          {label}
        </p>

        <p
          className="
            mt-0.5
            truncate
            text-lg
            font-black
            text-white
          "
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   ACHIEVEMENT CARD
========================================================= */

function AchievementCard({
  achievement,
  unlockedDate,
  index,
}) {
  const {
    id,
    title,
    description,
    icon: Icon,
    xp,
    current,
    target,
    progress,
    completed,
    accent,
    formatProgress,
  } = achievement;

  const design =
    ACCENT_DESIGNS[
      accent
    ] ||
    ACCENT_DESIGNS.blue;

  const inProgress =
    !completed &&
    current > 0;

  const locked =
    !completed &&
    current === 0;

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
      transition={{
        duration: 0.35,
        delay:
          index * 0.05,
        ease: "easeOut",
      }}
      whileHover={{
        y: -3,
      }}
      className={`
        group
        relative
        min-w-0
        overflow-hidden
        rounded-3xl
        border
        bg-gradient-to-br
        p-4
        transition
        duration-300
        hover:shadow-xl
        sm:p-5
        ${
          completed ||
          inProgress
            ? `
              ${design.border}
              ${design.background}
            `
            : `
              border-white/[0.08]
              from-slate-700/[0.08]
              to-transparent
              opacity-75
              hover:border-slate-500/30
            `
        }
      `}
    >
      <div
        className={`
          pointer-events-none
          absolute
          -right-14
          -top-14
          h-32
          w-32
          rounded-full
          opacity-60
          blur-3xl
          transition-opacity
          duration-300
          group-hover:opacity-100
          ${
            completed ||
            inProgress
              ? design.glow
              : "bg-slate-500/10"
          }
        `}
      />

      <div className="relative">
        {/* Header */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >
          <div
            className="
              flex
              min-w-0
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
                rounded-2xl
                ${
                  completed ||
                  inProgress
                    ? design.icon
                    : `
                      bg-slate-500/10
                      text-slate-500
                    `
                }
              `}
            >
              {locked ? (
                <LockKeyhole
                  size={19}
                />
              ) : (
                <Icon size={20} />
              )}
            </div>

            <div className="min-w-0">
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-2
                "
              >
                <h3
                  className="
                    truncate
                    text-sm
                    font-black
                    text-slate-950
                    dark:text-white
                    sm:text-base
                  "
                >
                  {title}
                </h3>

                {completed && (
                  <CheckCircle2
                    size={15}
                    className={
                      design.footer
                    }
                  />
                )}
              </div>

              <p
                className="
                  mt-1
                  line-clamp-2
                  text-xs
                  leading-5
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {description}
              </p>
            </div>
          </div>

          <span
            className={`
              inline-flex
              shrink-0
              items-center
              gap-1
              rounded-full
              border
              px-2.5
              py-1.5
              text-[9px]
              font-bold
              ${
                completed ||
                inProgress
                  ? design.badge
                  : `
                    border-slate-500/15
                    bg-slate-500/10
                    text-slate-500
                  `
              }
            `}
          >
            <Sparkles size={11} />

            +{xp} XP
          </span>
        </div>

        {/* Progress */}

        <div className="mt-5">
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
              text-[10px]
              font-semibold
            "
          >
            <span
              className="
                text-slate-600
                dark:text-slate-300
              "
            >
              {completed
                ? "Completed"
                : `${progress}% complete`}
            </span>

            <span
              className="
                text-slate-500
                dark:text-slate-400
              "
            >
              {formatProgress
                ? formatProgress(
                    current,
                    target
                  )
                : `${Math.min(
                    current,
                    target
                  )} / ${target}`}
            </span>
          </div>

          <div
            className="
              mt-2.5
              h-2
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
                duration: 0.8,
                delay:
                  0.15 +
                  index * 0.05,
                ease: "easeOut",
              }}
              className={`
                h-full
                rounded-full
                bg-gradient-to-r
                ${
                  completed ||
                  inProgress
                    ? design.progress
                    : "from-slate-500 to-slate-600"
                }
              `}
            />
          </div>
        </div>

        {/* Footer */}

        <div
          className="
            mt-4
            flex
            items-center
            gap-2
            border-t
            border-slate-200/70
            pt-3
            text-[10px]
            font-semibold
            dark:border-white/[0.07]
          "
        >
          {completed ? (
            <>
              <CheckCircle2
                size={13}
                className={
                  design.footer
                }
              />

              <span
                className={
                  design.footer
                }
              >
                Unlocked on{" "}
                {formatUnlockedDate(
                  unlockedDate
                )}
              </span>
            </>
          ) : inProgress ? (
            <>
              <Zap
                size={13}
                className={
                  design.footer
                }
              />

              <span
                className={
                  design.footer
                }
              >
                Keep going — you are making progress.
              </span>
            </>
          ) : (
            <>
              <LockKeyhole
                size={13}
                className="text-slate-500"
              />

              <span className="text-slate-500">
                Locked — complete the required activity.
              </span>
            </>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   ACHIEVEMENTS COMPONENT
========================================================= */

function Achievements() {
  const [
    showAll,
    setShowAll,
  ] = useState(false);

  const [
    storageVersion,
    setStorageVersion,
  ] = useState(0);

  const [
    unlockedDates,
    setUnlockedDates,
  ] = useState(
    readUnlockDates
  );

  const finance =
    useFinance() || {};

  const transactions =
    Array.isArray(
      finance.transactions
    )
      ? finance.transactions
      : [];

  const summary =
    finance.summary || {};

  /* =======================================================
     REFRESH LOCAL DATA WHEN USER RETURNS TO DASHBOARD
  ======================================================= */

  useEffect(() => {
    const refreshData = () => {
      setStorageVersion(
        (current) =>
          current + 1
      );
    };

    const handleVisibility =
      () => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          refreshData();
        }
      };

    window.addEventListener(
      "focus",
      refreshData
    );

    window.addEventListener(
      "storage",
      refreshData
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      window.removeEventListener(
        "focus",
        refreshData
      );

      window.removeEventListener(
        "storage",
        refreshData
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, []);

  /* =======================================================
     GOALS AND BUDGETS
  ======================================================= */

  const goals = useMemo(
    () =>
      readStoredArray(
        [
          "goals",
          "fintrack-goals",
        ],
        "goal"
      ),
    [storageVersion]
  );

  const budgets = useMemo(
    () =>
      readStoredArray(
        [
          "budgets",
          "fintrack-budgets",
        ],
        "budget"
      ),
    [storageVersion]
  );

  /* =======================================================
     FINANCE DATA
  ======================================================= */

  const financeStats =
    useMemo(() => {
      let income = 0;
      let expense = 0;

      const expenseCategories =
        new Set();

      transactions.forEach(
        (transaction) => {
          const amount =
            getSafeNumber(
              transaction.amount
            );

          const type =
            String(
              transaction.type ||
                ""
            ).toLowerCase();

          if (type === "income") {
            income += amount;
          }

          if (type === "expense") {
            expense += amount;

            const category =
              String(
                transaction.category ||
                  "Other"
              )
                .trim()
                .toLowerCase();

            if (category) {
              expenseCategories.add(
                category
              );
            }
          }
        }
      );

      const contextBalance =
        Number(
          summary.balance
        );

      const balance =
        Number.isFinite(
          contextBalance
        )
          ? contextBalance
          : income - expense;

      return {
        income,
        expense,
        balance,
        positiveBalance:
          Math.max(balance, 0),

        expenseCategoryCount:
          expenseCategories.size,
      };
    }, [
      transactions,
      summary.balance,
    ]);

  /* =======================================================
     ACHIEVEMENT DEFINITIONS
  ======================================================= */

  const achievements =
    useMemo(() => {
      const definitions = [
        {
          id: "goal-setter",
          title: "Goal Setter",
          description:
            "Create your first savings goal.",
          icon: Target,
          xp: 100,
          current: goals.length,
          target: 1,
          accent: "cyan",
        },

        {
          id: "budget-starter",
          title: "Budget Starter",
          description:
            "Create your first category budget.",
          icon: PieChart,
          xp: 100,
          current: budgets.length,
          target: 1,
          accent: "violet",
        },

        {
          id: "consistent-tracker",
          title:
            "Consistent Tracker",
          description:
            "Record at least 10 financial transactions.",
          icon: CalendarCheck2,
          xp: 150,
          current:
            transactions.length,
          target: 10,
          accent: "blue",
        },

        {
          id: "budget-master",
          title: "Budget Master",
          description:
            "Create five category budgets.",
          icon: WalletCards,
          xp: 200,
          current: budgets.length,
          target: 5,
          accent: "rose",
        },

        {
          id: "category-explorer",
          title:
            "Category Explorer",
          description:
            "Record expenses across five categories.",
          icon: Tags,
          xp: 250,
          current:
            financeStats
              .expenseCategoryCount,
          target: 5,
          accent: "emerald",
        },

        {
          id: "savings-champion",
          title:
            "Savings Champion",
          description:
            "Build a positive balance of ₹10,000.",
          icon: PiggyBank,
          xp: 300,
          current:
            financeStats
              .positiveBalance,
          target: 10000,
          accent: "amber",

          formatProgress: (
            current,
            target
          ) =>
            `₹${Math.round(
              Math.min(
                current,
                target
              )
            ).toLocaleString(
              "en-IN"
            )} / ₹${target.toLocaleString(
              "en-IN"
            )}`,
        },
      ];

      return definitions.map(
        (achievement) => {
          const progress =
            calculatePercentage(
              achievement.current,
              achievement.target
            );

          return {
            ...achievement,
            progress,
            completed:
              progress >= 100,
          };
        }
      );
    }, [
      goals.length,
      budgets.length,
      transactions.length,
      financeStats
        .expenseCategoryCount,
      financeStats
        .positiveBalance,
    ]);

  /* =======================================================
     SAVE UNLOCK DATES
  ======================================================= */

  useEffect(() => {
    setUnlockedDates(
      (currentDates) => {
        const nextDates = {
          ...currentDates,
        };

        let changed = false;

        achievements.forEach(
          (achievement) => {
            if (
              achievement.completed &&
              !nextDates[
                achievement.id
              ]
            ) {
              nextDates[
                achievement.id
              ] =
                new Date().toISOString();

              changed = true;
            }
          }
        );

        if (!changed) {
          return currentDates;
        }

        try {
          localStorage.setItem(
            UNLOCK_DATE_STORAGE_KEY,
            JSON.stringify(
              nextDates
            )
          );
        } catch {
          // Ignore unavailable storage.
        }

        return nextDates;
      }
    );
  }, [achievements]);

  /* =======================================================
     LEVEL AND XP SUMMARY
  ======================================================= */

  const completedAchievements =
    achievements.filter(
      (achievement) =>
        achievement.completed
    );

  const inProgressAchievements =
    achievements.filter(
      (achievement) =>
        !achievement.completed &&
        achievement.current > 0
    );

  const lockedAchievements =
    achievements.filter(
      (achievement) =>
        !achievement.completed &&
        achievement.current === 0
    );

  const earnedXP =
    completedAchievements.reduce(
      (total, achievement) =>
        total + achievement.xp,
      0
    );

  const totalXP =
    achievements.reduce(
      (total, achievement) =>
        total + achievement.xp,
      0
    );

  const completionPercentage =
    achievements.length > 0
      ? Math.round(
          (completedAchievements.length /
            achievements.length) *
            100
        )
      : 0;

  let currentLevel =
    LEVELS[0];

  LEVELS.forEach((level) => {
    if (
      earnedXP >=
      level.minimumXP
    ) {
      currentLevel = level;
    }
  });

  const nextLevel =
    LEVELS.find(
      (level) =>
        level.minimumXP >
        earnedXP
    ) || null;

  const currentLevelMinimum =
    currentLevel.minimumXP;

  const nextLevelMinimum =
    nextLevel?.minimumXP ||
    totalXP;

  const currentLevelRange =
    Math.max(
      nextLevelMinimum -
        currentLevelMinimum,
      1
    );

  const levelXP =
    Math.max(
      earnedXP -
        currentLevelMinimum,
      0
    );

  const levelProgress =
    Math.min(
      Math.round(
        (levelXP /
          currentLevelRange) *
          100
      ),
      100
    );

  const nextMilestone =
    achievements
      .filter(
        (achievement) =>
          !achievement.completed
      )
      .sort(
        (first, second) =>
          second.progress -
          first.progress
      )[0] || null;

  const visibleAchievements =
    showAll
      ? achievements
      : achievements.slice(0, 4);

  return (
    <section
      className="
        relative
        min-w-0
        overflow-hidden
        rounded-[30px]
        border
        border-slate-200/80
        bg-white
        p-4
        shadow-sm
        dark:border-white/10
        dark:bg-[#0d172a]
        sm:p-5
        lg:p-6
      "
    >
      {/* Background effects */}

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-72
          w-72
          rounded-full
          bg-violet-500/[0.08]
          blur-[110px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-36
          left-1/3
          h-72
          w-72
          rounded-full
          bg-cyan-500/[0.07]
          blur-[110px]
        "
      />

      <div className="relative">
        {/* =================================================
            HEADER
        ================================================== */}

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
          <div
            className="
              flex
              items-start
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
                rounded-2xl
                border
                border-amber-500/15
                bg-amber-500/10
                text-amber-400
              "
            >
              <Trophy size={21} />
            </div>

            <div>
              <h2
                className="
                  text-lg
                  font-black
                  text-slate-950
                  dark:text-white
                  sm:text-xl
                "
              >
                Achievements
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Level up your financial progress and unlock rewards.
              </p>
            </div>
          </div>

          <span
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-amber-500/20
              bg-amber-500/10
              px-3.5
              py-2
              text-xs
              font-black
              text-amber-500
              dark:text-amber-400
            "
          >
            <Sparkles size={14} />

            {earnedXP} XP
          </span>
        </div>

        {/* =================================================
            LEVEL SUMMARY
        ================================================== */}

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
            duration: 0.4,
            ease: "easeOut",
          }}
          className="
            relative
            mt-5
            min-w-0
            overflow-hidden
            rounded-3xl
            border
            border-violet-500/30
            bg-gradient-to-br
            from-blue-950/90
            via-violet-950/70
            to-slate-950
            p-5
            text-white
            shadow-xl
            shadow-violet-950/15
            sm:p-6
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
              bg-violet-500/20
              blur-[100px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-28
              left-1/4
              h-56
              w-56
              rounded-full
              bg-cyan-500/15
              blur-[100px]
            "
          />

          <div
            className="
              relative
              flex
              min-w-0
              flex-col
              gap-6
              lg:flex-row
              lg:items-center
            "
          >
            <ProgressRing
              percentage={
                completionPercentage
              }
            />

            <div
              className="
                min-w-0
                flex-1
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:items-start
                  sm:justify-between
                "
              >
                <div>
                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-2
                    "
                  >
                    <h3
                      className="
                        text-2xl
                        font-black
                        text-white
                      "
                    >
                      Level{" "}
                      {currentLevel.level}
                    </h3>

                    <span
                      className="
                        rounded-full
                        bg-violet-500/20
                        px-3
                        py-1.5
                        text-[10px]
                        font-bold
                        text-violet-300
                      "
                    >
                      {
                        currentLevel.title
                      }
                    </span>
                  </div>

                  <p
                    className="
                      mt-2
                      text-xs
                      text-slate-400
                    "
                  >
                    {
                      completedAchievements.length
                    }{" "}
                    of{" "}
                    {achievements.length}{" "}
                    milestones unlocked
                  </p>
                </div>

                <div
                  className="
                    shrink-0
                    sm:text-right
                  "
                >
                  <p
                    className="
                      text-2xl
                      font-black
                      text-white
                    "
                  >
                    {earnedXP} XP
                  </p>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      text-slate-400
                    "
                  >
                    Total XP earned
                  </p>
                </div>
              </div>

              <div
                className="
                  mt-5
                  grid
                  gap-3
                  sm:grid-cols-3
                "
              >
                <SummaryStat
                  label="Unlocked"
                  value={
                    completedAchievements.length
                  }
                  icon={
                    CheckCircle2
                  }
                  iconClasses="
                    bg-cyan-500/15
                    text-cyan-300
                  "
                />

                <SummaryStat
                  label="In progress"
                  value={
                    inProgressAchievements.length
                  }
                  icon={Zap}
                  iconClasses="
                    bg-violet-500/15
                    text-violet-300
                  "
                />

                <SummaryStat
                  label="Locked"
                  value={
                    lockedAchievements.length
                  }
                  icon={
                    LockKeyhole
                  }
                  iconClasses="
                    bg-slate-500/15
                    text-slate-400
                  "
                />
              </div>

              {nextMilestone && (
                <div
                  className="
                    mt-4
                    flex
                    flex-col
                    gap-3
                    rounded-2xl
                    border
                    border-white/[0.08]
                    bg-white/[0.035]
                    p-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <div
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-amber-500/10
                        text-amber-300
                      "
                    >
                      <Award size={17} />
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-wide
                          text-slate-500
                        "
                      >
                        Next milestone
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          text-sm
                          font-black
                          text-white
                        "
                      >
                        {
                          nextMilestone.title
                        }
                      </p>
                    </div>
                  </div>

                  <span
                    className="
                      shrink-0
                      text-sm
                      font-black
                      text-amber-300
                    "
                  >
                    {
                      nextMilestone.progress
                    }
                    %
                  </span>
                </div>
              )}

              <div className="mt-5">
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    text-[10px]
                    font-semibold
                    text-slate-400
                  "
                >
                  <span>
                    Level progress
                  </span>

                  <span>
                    {nextLevel
                      ? `${levelXP} / ${currentLevelRange} XP`
                      : "Maximum level"}
                  </span>
                </div>

                <div
                  className="
                    mt-2
                    h-2
                    overflow-hidden
                    rounded-full
                    bg-white/10
                  "
                >
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${levelProgress}%`,
                    }}
                    transition={{
                      duration: 0.9,
                      delay: 0.2,
                      ease: "easeOut",
                    }}
                    className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-cyan-400
                      via-blue-500
                      to-violet-500
                      shadow-[0_0_18px_rgba(59,130,246,0.45)]
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.article>

        {/* =================================================
            ACHIEVEMENT GRID
        ================================================== */}

        <div
          className="
            mt-4
            grid
            min-w-0
            gap-3
            lg:grid-cols-2
          "
        >
          {visibleAchievements.map(
            (
              achievement,
              index
            ) => (
              <AchievementCard
                key={
                  achievement.id
                }
                achievement={
                  achievement
                }
                unlockedDate={
                  unlockedDates[
                    achievement.id
                  ]
                }
                index={index}
              />
            )
          )}
        </div>

        {/* Show all */}

        {achievements.length > 4 && (
          <button
            type="button"
            onClick={() =>
              setShowAll(
                (current) =>
                  !current
              )
            }
            className="
              mt-4
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              border
              border-dashed
              border-slate-300
              bg-slate-50/60
              px-4
              py-3
              text-xs
              font-bold
              text-slate-500
              transition
              hover:border-violet-500/40
              hover:bg-violet-500/[0.06]
              hover:text-violet-600
              dark:border-white/10
              dark:bg-white/[0.02]
              dark:text-slate-400
              dark:hover:text-violet-400
            "
          >
            {showAll ? (
              <>
                Show fewer achievements

                <ChevronUp
                  size={15}
                />
              </>
            ) : (
              <>
                View all{" "}
                {achievements.length}{" "}
                achievements

                <ChevronDown
                  size={15}
                />
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
}

export default Achievements;