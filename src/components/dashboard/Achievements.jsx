import { useMemo } from "react";
import { motion } from "framer-motion";

import {
  Award,
  BadgeCheck,
  Flame,
  LockKeyhole,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  WalletCards,
} from "lucide-react";

import useBudget from "../../hooks/useBudget";
import useFinance from "../../hooks/useFinance";
import useGoal from "../../hooks/useGoal";

const XP_PER_LEVEL = 500;

const TONE_STYLES = {
  cyan: {
    card: `
      border-cyan-200
      bg-cyan-50/60
      dark:border-cyan-900/70
      dark:bg-cyan-950/20
    `,
    icon: `
      bg-cyan-500/10
      text-cyan-600
      dark:text-cyan-400
    `,
    badge: `
      bg-cyan-500/10
      text-cyan-600
      dark:text-cyan-400
    `,
    bar: "bg-cyan-500",
  },

  emerald: {
    card: `
      border-emerald-200
      bg-emerald-50/60
      dark:border-emerald-900/70
      dark:bg-emerald-950/20
    `,
    icon: `
      bg-emerald-500/10
      text-emerald-600
      dark:text-emerald-400
    `,
    badge: `
      bg-emerald-500/10
      text-emerald-600
      dark:text-emerald-400
    `,
    bar: "bg-emerald-500",
  },

  blue: {
    card: `
      border-blue-200
      bg-blue-50/60
      dark:border-blue-900/70
      dark:bg-blue-950/20
    `,
    icon: `
      bg-blue-500/10
      text-blue-600
      dark:text-blue-400
    `,
    badge: `
      bg-blue-500/10
      text-blue-600
      dark:text-blue-400
    `,
    bar: "bg-blue-500",
  },

  violet: {
    card: `
      border-violet-200
      bg-violet-50/60
      dark:border-violet-900/70
      dark:bg-violet-950/20
    `,
    icon: `
      bg-violet-500/10
      text-violet-600
      dark:text-violet-400
    `,
    badge: `
      bg-violet-500/10
      text-violet-600
      dark:text-violet-400
    `,
    bar: "bg-violet-500",
  },

  amber: {
    card: `
      border-amber-200
      bg-amber-50/60
      dark:border-amber-900/70
      dark:bg-amber-950/20
    `,
    icon: `
      bg-amber-500/10
      text-amber-600
      dark:text-amber-400
    `,
    badge: `
      bg-amber-500/10
      text-amber-600
      dark:text-amber-400
    `,
    bar: "bg-amber-500",
  },
};

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(getSafeNumber(value));
}

function calculateProgress(
  current,
  target
) {
  const safeCurrent = Math.max(
    getSafeNumber(current),
    0
  );

  const safeTarget = Math.max(
    getSafeNumber(target),
    0
  );

  if (safeTarget === 0) {
    return 0;
  }

  return Math.min(
    Math.round(
      (safeCurrent / safeTarget) *
        100
    ),
    100
  );
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  ) {
    const [year, month, day] =
      value
        .split("-")
        .map(Number);

    return new Date(
      year,
      month - 1,
      day
    );
  }

  const date = new Date(value);

  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date;
}

function getDateKey(date) {
  if (!date) {
    return null;
  }

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTransactionDate(
  transaction
) {
  return (
    transaction.createdAt ||
    transaction.created_at ||
    transaction.date
  );
}

function calculateStreak(
  transactions
) {
  const activityDays = new Set(
    transactions
      .map((transaction) =>
        parseDate(
          getTransactionDate(
            transaction
          )
        )
      )
      .filter(Boolean)
      .map(getDateKey)
  );

  if (!activityDays.size) {
    return 0;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(
    today
  );

  yesterday.setDate(
    yesterday.getDate() - 1
  );

  let cursor;

  if (
    activityDays.has(
      getDateKey(today)
    )
  ) {
    cursor = new Date(today);
  } else if (
    activityDays.has(
      getDateKey(yesterday)
    )
  ) {
    cursor = new Date(
      yesterday
    );
  } else {
    return 0;
  }

  let streak = 0;

  while (
    activityDays.has(
      getDateKey(cursor)
    )
  ) {
    streak += 1;

    cursor.setDate(
      cursor.getDate() - 1
    );
  }

  return streak;
}

function getGoalTarget(goal) {
  return getSafeNumber(
    goal.targetAmount ??
      goal.target_amount ??
      goal.target ??
      goal.amount
  );
}

function getGoalSaved(goal) {
  return getSafeNumber(
    goal.savedAmount ??
      goal.saved_amount ??
      goal.saved
  );
}

function getErrorMessage(error) {
  if (!error) {
    return "";
  }

  if (
    typeof error === "string"
  ) {
    return error;
  }

  return (
    error.message ||
    "Unable to load achievement data."
  );
}

function getLevelName(level) {
  if (level >= 8) {
    return "Finance Master";
  }

  if (level >= 5) {
    return "Smart Investor";
  }

  if (level >= 3) {
    return "Finance Explorer";
  }

  return "Money Starter";
}

function Achievements() {
  const {
    transactions = [],
    loading: financeLoading,
    error: financeError,
  } = useFinance();

  const {
    budgets = [],
    loading: budgetLoading,
    error: budgetError,
  } = useBudget();

  const {
    goals = [],
    loading: goalLoading,
    error: goalError,
  } = useGoal();

  const loading =
    financeLoading ||
    budgetLoading ||
    goalLoading;

  const error =
    financeError ||
    budgetError ||
    goalError;

  const achievementData =
    useMemo(() => {
      let totalIncome = 0;

      transactions.forEach(
        (transaction) => {
          const type = String(
            transaction.type || ""
          )
            .trim()
            .toLowerCase();

          if (type === "income") {
            totalIncome +=
              getSafeNumber(
                transaction.amount
              );
          }
        }
      );

      const completedGoals =
        goals.filter((goal) => {
          const status = String(
            goal.status || ""
          )
            .trim()
            .toLowerCase();

          const target =
            getGoalTarget(goal);

          const saved =
            getGoalSaved(goal);

          return (
            status === "completed" ||
            (target > 0 &&
              saved >= target)
          );
        }).length;

      const totalGoalSavings =
        goals.reduce(
          (total, goal) =>
            total +
            getGoalSaved(goal),
          0
        );

      const streak =
        calculateStreak(
          transactions
        );

      const achievementList = [
        {
          id: "first-step",
          title: "First Step",
          description:
            "Record your first financial transaction.",
          current:
            transactions.length,
          target: 1,
          valueType: "number",
          unit: "transaction",
          reward: 100,
          icon: ReceiptText,
          tone: "cyan",
        },

        {
          id: "consistent-tracker",
          title:
            "Consistent Tracker",
          description:
            "Record at least 10 transactions.",
          current:
            transactions.length,
          target: 10,
          valueType: "number",
          unit: "transactions",
          reward: 150,
          icon: BadgeCheck,
          tone: "blue",
        },

        {
          id: "income-builder",
          title: "Income Builder",
          description:
            "Record ₹10,000 in total income.",
          current: totalIncome,
          target: 10000,
          valueType: "currency",
          unit: "income",
          reward: 200,
          icon: WalletCards,
          tone: "emerald",
        },

        {
          id: "budget-starter",
          title: "Budget Starter",
          description:
            "Create your first category budget.",
          current: budgets.length,
          target: 1,
          valueType: "number",
          unit: "budget",
          reward: 100,
          icon: ShieldCheck,
          tone: "blue",
        },

        {
          id: "budget-master",
          title: "Budget Master",
          description:
            "Create five category budgets.",
          current: budgets.length,
          target: 5,
          valueType: "number",
          unit: "budgets",
          reward: 250,
          icon: Award,
          tone: "violet",
        },

        {
          id: "goal-setter",
          title: "Goal Setter",
          description:
            "Create your first savings goal.",
          current: goals.length,
          target: 1,
          valueType: "number",
          unit: "goal",
          reward: 100,
          icon: Target,
          tone: "cyan",
        },

        {
          id: "goal-achiever",
          title: "Goal Achiever",
          description:
            "Complete one savings goal.",
          current:
            completedGoals,
          target: 1,
          valueType: "number",
          unit: "completed goal",
          reward: 400,
          icon: Trophy,
          tone: "amber",
        },

        {
          id: "smart-saver",
          title: "Smart Saver",
          description:
            "Save ₹5,000 toward your goals.",
          current:
            totalGoalSavings,
          target: 5000,
          valueType: "currency",
          unit: "saved",
          reward: 250,
          icon: PiggyBank,
          tone: "emerald",
        },

        {
          id: "seven-day-streak",
          title:
            "Seven-Day Streak",
          description:
            "Record activity for seven consecutive days.",
          current: streak,
          target: 7,
          valueType: "number",
          unit: "days",
          reward: 350,
          icon: Flame,
          tone: "amber",
        },
      ].map((achievement) => {
        const progress =
          calculateProgress(
            achievement.current,
            achievement.target
          );

        return {
          ...achievement,
          progress,
          unlocked:
            getSafeNumber(
              achievement.current
            ) >=
            getSafeNumber(
              achievement.target
            ),
        };
      });

      const unlockedAchievements =
        achievementList.filter(
          (achievement) =>
            achievement.unlocked
        );

      const lockedAchievements =
        achievementList
          .filter(
            (achievement) =>
              !achievement.unlocked
          )
          .sort(
            (first, second) =>
              second.progress -
              first.progress
          );

      const totalXp =
        unlockedAchievements.reduce(
          (
            total,
            achievement
          ) =>
            total +
            achievement.reward,
          0
        );

      const level =
        Math.floor(
          totalXp /
            XP_PER_LEVEL
        ) + 1;

      const currentLevelXp =
        totalXp %
        XP_PER_LEVEL;

      const levelProgress =
        calculateProgress(
          currentLevelXp,
          XP_PER_LEVEL
        );

      const featuredAchievements =
        [
          ...unlockedAchievements
            .slice(-2)
            .reverse(),

          ...lockedAchievements.slice(
            0,
            2
          ),
        ];

      const usedIds = new Set(
        featuredAchievements.map(
          (achievement) =>
            achievement.id
        )
      );

      if (
        featuredAchievements.length <
        4
      ) {
        achievementList.forEach(
          (achievement) => {
            if (
              featuredAchievements.length <
                4 &&
              !usedIds.has(
                achievement.id
              )
            ) {
              featuredAchievements.push(
                achievement
              );

              usedIds.add(
                achievement.id
              );
            }
          }
        );
      }

      return {
        achievementList,
        featuredAchievements:
          featuredAchievements.slice(
            0,
            4
          ),
        unlockedCount:
          unlockedAchievements.length,
        lockedCount:
          lockedAchievements.length,
        totalXp,
        level,
        currentLevelXp,
        levelProgress,
        streak,
        nextAchievement:
          lockedAchievements[0] ||
          null,
      };
    }, [
      transactions,
      budgets,
      goals,
    ]);

  const {
    achievementList,
    featuredAchievements,
    unlockedCount,
    lockedCount,
    totalXp,
    level,
    currentLevelXp,
    levelProgress,
    streak,
    nextAchievement,
  } = achievementData;

  const overallProgress =
    achievementList.length > 0
      ? Math.round(
          (unlockedCount /
            achievementList.length) *
            100
        )
      : 0;

  if (loading) {
    return (
      <section
        className="
          h-full
          rounded-3xl
          border
          border-slate-200
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
              w-44
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
              dark:bg-slate-800
            "
          />

          <div
            className="
              mt-7
              h-52
              rounded-3xl
              bg-slate-100
              dark:bg-slate-800
            "
          />

          <div
            className="
              mt-5
              grid
              gap-3
              sm:grid-cols-2
            "
          >
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="
                    h-44
                    rounded-2xl
                    bg-slate-100
                    dark:bg-slate-800
                  "
                />
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="
        relative
        flex
        h-full
        flex-col
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
      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-64
          w-64
          rounded-full
          bg-amber-500/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          -left-24
          h-64
          w-64
          rounded-full
          bg-violet-500/10
          blur-3xl
        "
      />

      <div className="relative">
        {/* Header */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-amber-500/10
                text-amber-600
                dark:text-amber-400
              "
            >
              <Trophy size={21} />
            </div>

            <div>
              <h2
                className="
                  text-xl
                  font-black
                  tracking-tight
                  text-slate-950
                  dark:text-white
                "
              >
                Achievements
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Celebrate your financial
                progress.
              </p>
            </div>
          </div>

          <div
            className="
              inline-flex
              shrink-0
              items-center
              gap-1.5
              rounded-full
              border
              border-amber-200
              bg-amber-50
              px-3
              py-1.5
              text-xs
              font-bold
              text-amber-700
              dark:border-amber-900
              dark:bg-amber-950/20
              dark:text-amber-400
            "
          >
            <Sparkles size={13} />
            {totalXp} XP
          </div>
        </div>

        {error && (
          <div
            className="
              mt-5
              rounded-2xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600
              dark:border-red-900
              dark:bg-red-950/20
              dark:text-red-400
            "
          >
            {getErrorMessage(error)}
          </div>
        )}

        {/* Compact level overview */}

        <div
          className="
            mt-6
            rounded-3xl
            border
            border-slate-200
            bg-gradient-to-br
            from-slate-50
            via-white
            to-amber-50/70
            p-5
            dark:border-slate-800
            dark:from-slate-950/80
            dark:via-slate-950/40
            dark:to-amber-950/20
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
            "
          >
            {/* Progress ring */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-center
              "
            >
              <div
                className="
                  relative
                  flex
                  h-28
                  w-28
                  items-center
                  justify-center
                  rounded-full
                "
                style={{
                  background: `conic-gradient(
                    #f59e0b
                    ${
                      overallProgress *
                      3.6
                    }deg,
                    rgba(148,163,184,0.18)
                    0deg
                  )`,
                }}
              >
<div
  className="
    flex
    h-[88px]
    w-[88px]
    flex-col
    items-center
    justify-center
    rounded-full
    bg-white
    dark:bg-slate-900
  "
>
  <span
    className="
      text-lg
      font-black
      leading-none
      text-slate-950
      dark:text-white
    "
  >
    {overallProgress}%
  </span>

  <span
    className="
      mt-1
      text-[9px]
      font-medium
      text-slate-500
      dark:text-slate-400
    "
  >
    complete
  </span>
</div>
              </div>
            </div>

            <div className="min-w-0 flex-1">
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
                    text-slate-950
                    dark:text-white
                  "
                >
                  Level {level}
                </h3>

                <span
                  className="
                    rounded-full
                    bg-violet-500/10
                    px-3
                    py-1
                    text-xs
                    font-bold
                    text-violet-600
                    dark:text-violet-400
                  "
                >
                  {getLevelName(level)}
                </span>
              </div>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {unlockedCount} of{" "}
                {achievementList.length}{" "}
                milestones unlocked.
              </p>

              <div className="mt-4">
                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                    gap-3
                    text-xs
                  "
                >
                  <span
                    className="
                      font-semibold
                      text-slate-600
                      dark:text-slate-300
                    "
                  >
                    Level progress
                  </span>

                  <span
                    className="
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {currentLevelXp} /{" "}
                    {XP_PER_LEVEL} XP
                  </span>
                </div>

                <div
                  className="
                    h-2.5
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
                      width: `${levelProgress}%`,
                    }}
                    transition={{
                      duration: 0.9,
                      ease: "easeOut",
                    }}
                    className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-amber-400
                      via-orange-500
                      to-rose-500
                    "
                  />
                </div>
              </div>

              <div
                className="
                  mt-4
                  grid
                  grid-cols-3
                  gap-2
                "
              >
                <div
                  className="
                    rounded-xl
                    bg-white/70
                    px-3
                    py-2
                    dark:bg-slate-900/60
                  "
                >
                  <p
                    className="
                      text-[10px]
                      text-slate-500
                    "
                  >
                    Unlocked
                  </p>

                  <p
                    className="
                      mt-1
                      font-black
                      text-emerald-600
                      dark:text-emerald-400
                    "
                  >
                    {unlockedCount}
                  </p>
                </div>

                <div
                  className="
                    rounded-xl
                    bg-white/70
                    px-3
                    py-2
                    dark:bg-slate-900/60
                  "
                >
                  <p
                    className="
                      text-[10px]
                      text-slate-500
                    "
                  >
                    Remaining
                  </p>

                  <p
                    className="
                      mt-1
                      font-black
                      text-slate-700
                      dark:text-slate-200
                    "
                  >
                    {lockedCount}
                  </p>
                </div>

                <div
                  className="
                    rounded-xl
                    bg-white/70
                    px-3
                    py-2
                    dark:bg-slate-900/60
                  "
                >
                  <p
                    className="
                      text-[10px]
                      text-slate-500
                    "
                  >
                    Streak
                  </p>

                  <p
                    className="
                      mt-1
                      flex
                      items-center
                      gap-1
                      font-black
                      text-rose-600
                      dark:text-rose-400
                    "
                  >
                    <Flame size={14} />
                    {streak}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {nextAchievement && (
            <div
              className="
                mt-5
                flex
                items-center
                justify-between
                gap-3
                rounded-2xl
                border
                border-amber-200
                bg-amber-50/70
                px-4
                py-3
                dark:border-amber-900/60
                dark:bg-amber-950/20
              "
            >
              <div className="min-w-0">
                <p
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-wider
                    text-amber-600
                    dark:text-amber-400
                  "
                >
                  Next milestone
                </p>

                <p
                  className="
                    mt-1
                    truncate
                    text-sm
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  {nextAchievement.title}
                </p>
              </div>

              <span
                className="
                  shrink-0
                  text-sm
                  font-black
                  text-amber-600
                  dark:text-amber-400
                "
              >
                {nextAchievement.progress}%
              </span>
            </div>
          )}
        </div>

        {/* Featured achievements */}

        <div
          className="
            mt-5
            grid
            gap-3
            sm:grid-cols-2
          "
        >
          {featuredAchievements.map(
            (
              achievement,
              index
            ) => {
              const AchievementIcon =
                achievement.icon;

              const styles =
                TONE_STYLES[
                  achievement.tone
                ] ||
                TONE_STYLES.cyan;

              const currentValue =
                achievement.valueType ===
                "currency"
                  ? formatCurrency(
                      Math.min(
                        achievement.current,
                        achievement.target
                      )
                    )
                  : Math.min(
                      achievement.current,
                      achievement.target
                    );

              const targetValue =
                achievement.valueType ===
                "currency"
                  ? formatCurrency(
                      achievement.target
                    )
                  : achievement.target;

              return (
                <motion.article
                  key={achievement.id}
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.07,
                  }}
                  whileHover={{
                    y: -3,
                  }}
                  className={`
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    p-4
                    transition
                    ${
                      achievement.unlocked
                        ? styles.card
                        : `
                          border-slate-200
                          bg-slate-50/70
                          dark:border-slate-800
                          dark:bg-slate-950/30
                        `
                    }
                  `}
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                  >
                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${
                          achievement.unlocked
                            ? styles.icon
                            : `
                              bg-slate-200
                              text-slate-500
                              dark:bg-slate-800
                              dark:text-slate-400
                            `
                        }
                      `}
                    >
                      {achievement.unlocked ? (
                        <AchievementIcon
                          size={19}
                        />
                      ) : (
                        <LockKeyhole
                          size={17}
                        />
                      )}
                    </div>

                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        px-2.5
                        py-1
                        text-[10px]
                        font-black
                        ${
                          achievement.unlocked
                            ? styles.badge
                            : `
                              bg-slate-200
                              text-slate-500
                              dark:bg-slate-800
                              dark:text-slate-400
                            `
                        }
                      `}
                    >
                      <Sparkles size={11} />
                      +{achievement.reward} XP
                    </span>
                  </div>

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <h3
                      className="
                        truncate
                        font-black
                        text-slate-900
                        dark:text-white
                      "
                    >
                      {achievement.title}
                    </h3>

                    {achievement.unlocked && (
                      <BadgeCheck
                        size={16}
                        className="
                          shrink-0
                          text-emerald-500
                        "
                      />
                    )}
                  </div>

                  <p
                    className="
                      mt-1.5
                      min-h-10
                      text-xs
                      leading-5
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {achievement.description}
                  </p>

                  <div className="mt-4">
                    <div
                      className="
                        mb-2
                        flex
                        items-center
                        justify-between
                        gap-3
                        text-[10px]
                      "
                    >
                      <span
                        className="
                          font-bold
                          
                          text-slate-600
                          dark:text-slate-300
                        "
                      >
                        {achievement.unlocked
                          ? "Completed"
                          : `${achievement.progress}% complete`}
                      </span>

                      <span
                        className="
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        {currentValue} /{" "}
                        {targetValue}
                      </span>
                    </div>

                    <div
                      className="
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
                          width: `${achievement.progress}%`,
                        }}
                        transition={{
                          duration: 0.8,
                          delay:
                            index * 0.07,
                        }}
                        className={`
                          h-full
                          rounded-full
                          ${
                            achievement.unlocked
                              ? styles.bar
                              : "bg-slate-400 dark:bg-slate-600"
                          }
                        `}
                      />
                    </div>
                  </div>

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      justify-between
                      border-t
                      border-slate-200/70
                      pt-3
                      dark:border-slate-700/70
                    "
                  >
                    <span
                      className={`
                        text-[10px]
                        font-bold
                        ${
                          achievement.unlocked
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-500 dark:text-slate-400"
                        }
                      `}
                    >
                      {achievement.unlocked
                        ? "Achievement unlocked"
                        : `${achievement.unit} required`}
                    </span>

                    {achievement.unlocked ? (
                      <Trophy
                        size={14}
                        className="text-amber-500"
                      />
                    ) : (
                      <LockKeyhole
                        size={13}
                        className="text-slate-400"
                      />
                    )}
                  </div>
                </motion.article>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}

export default Achievements;