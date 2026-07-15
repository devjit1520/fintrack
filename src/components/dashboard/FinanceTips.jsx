import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CalendarCheck,
  Coffee,
  Lightbulb,
  PiggyBank,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  WalletCards,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import useFinance from "../../hooks/useFinance";

const TIP_LIBRARY = [
  {
    id: "pay-yourself-first",
    title: "Pay yourself first",
    description:
      "Move a fixed portion of your income into savings before spending on anything else.",
    action:
      "Start with 10% and increase it gradually as your income grows.",
    category: "Savings",
    icon: PiggyBank,
    tone: "emerald",
  },
  {
    id: "24-hour-rule",
    title: "Use the 24-hour rule",
    description:
      "Wait one full day before making a non-essential purchase.",
    action:
      "This simple pause can reduce impulse spending and unnecessary purchases.",
    category: "Spending",
    icon: Coffee,
    tone: "amber",
  },
  {
    id: "weekly-review",
    title: "Review finances weekly",
    description:
      "A short weekly review helps you notice overspending before the month ends.",
    action:
      "Check your transactions, budgets, and savings goals every weekend.",
    category: "Planning",
    icon: CalendarCheck,
    tone: "blue",
  },
  {
    id: "emergency-fund",
    title: "Build an emergency fund",
    description:
      "Emergency savings protect you from using debt when unexpected expenses appear.",
    action:
      "Aim for three to six months of essential living expenses.",
    category: "Security",
    icon: ShieldCheck,
    tone: "violet",
  },
  {
    id: "track-small-expenses",
    title: "Track small expenses",
    description:
      "Small daily purchases can become a large monthly expense when combined.",
    action:
      "Record coffee, snacks, subscriptions, and delivery charges consistently.",
    category: "Tracking",
    icon: ReceiptText,
    tone: "rose",
  },
  {
    id: "goal-breakdown",
    title: "Break large goals into steps",
    description:
      "A large target becomes easier when it is divided into monthly contributions.",
    action:
      "Divide the remaining goal amount by the months left before the deadline.",
    category: "Goals",
    icon: Target,
    tone: "cyan",
  },
  {
    id: "subscription-review",
    title: "Review subscriptions",
    description:
      "Unused subscriptions quietly reduce your available monthly balance.",
    action:
      "Cancel services you have not used during the last 30 days.",
    category: "Expenses",
    icon: WalletCards,
    tone: "orange",
  },
  {
    id: "financial-learning",
    title: "Improve financial knowledge",
    description:
      "Learning basic budgeting, investing, and tax concepts improves financial decisions.",
    action:
      "Spend at least 15 minutes each week learning one finance topic.",
    category: "Learning",
    icon: BookOpenCheck,
    tone: "indigo",
  },
];

const TONE_STYLES = {
  emerald: {
    card: `
      border-emerald-200
      bg-gradient-to-br
      from-emerald-50
      via-white
      to-cyan-50
      dark:border-emerald-900
      dark:from-emerald-950/30
      dark:via-slate-950/70
      dark:to-cyan-950/20
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
    accent: "bg-emerald-500",
  },

  amber: {
    card: `
      border-amber-200
      bg-gradient-to-br
      from-amber-50
      via-white
      to-orange-50
      dark:border-amber-900
      dark:from-amber-950/30
      dark:via-slate-950/70
      dark:to-orange-950/20
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
    accent: "bg-amber-500",
  },

  blue: {
    card: `
      border-blue-200
      bg-gradient-to-br
      from-blue-50
      via-white
      to-cyan-50
      dark:border-blue-900
      dark:from-blue-950/30
      dark:via-slate-950/70
      dark:to-cyan-950/20
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
    accent: "bg-blue-500",
  },

  violet: {
    card: `
      border-violet-200
      bg-gradient-to-br
      from-violet-50
      via-white
      to-purple-50
      dark:border-violet-900
      dark:from-violet-950/30
      dark:via-slate-950/70
      dark:to-purple-950/20
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
    accent: "bg-violet-500",
  },

  rose: {
    card: `
      border-rose-200
      bg-gradient-to-br
      from-rose-50
      via-white
      to-pink-50
      dark:border-rose-900
      dark:from-rose-950/30
      dark:via-slate-950/70
      dark:to-pink-950/20
    `,
    icon: `
      bg-rose-500/10
      text-rose-600
      dark:text-rose-400
    `,
    badge: `
      bg-rose-500/10
      text-rose-600
      dark:text-rose-400
    `,
    accent: "bg-rose-500",
  },

  cyan: {
    card: `
      border-cyan-200
      bg-gradient-to-br
      from-cyan-50
      via-white
      to-blue-50
      dark:border-cyan-900
      dark:from-cyan-950/30
      dark:via-slate-950/70
      dark:to-blue-950/20
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
    accent: "bg-cyan-500",
  },

  orange: {
    card: `
      border-orange-200
      bg-gradient-to-br
      from-orange-50
      via-white
      to-amber-50
      dark:border-orange-900
      dark:from-orange-950/30
      dark:via-slate-950/70
      dark:to-amber-950/20
    `,
    icon: `
      bg-orange-500/10
      text-orange-600
      dark:text-orange-400
    `,
    badge: `
      bg-orange-500/10
      text-orange-600
      dark:text-orange-400
    `,
    accent: "bg-orange-500",
  },

  indigo: {
    card: `
      border-indigo-200
      bg-gradient-to-br
      from-indigo-50
      via-white
      to-violet-50
      dark:border-indigo-900
      dark:from-indigo-950/30
      dark:via-slate-950/70
      dark:to-violet-950/20
    `,
    icon: `
      bg-indigo-500/10
      text-indigo-600
      dark:text-indigo-400
    `,
    badge: `
      bg-indigo-500/10
      text-indigo-600
      dark:text-indigo-400
    `,
    accent: "bg-indigo-500",
  },
};

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function parseTransactionDate(value) {
  if (!value) {
    return null;
  }

  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    const [year, month, day] =
      value.split("-").map(Number);

    return new Date(
      year,
      month - 1,
      day
    );
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
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

function getDayOfYear() {
  const today = new Date();

  const startOfYear = new Date(
    today.getFullYear(),
    0,
    0
  );

  const difference =
    today.getTime() -
    startOfYear.getTime();

  return Math.floor(
    difference /
      (1000 * 60 * 60 * 24)
  );
}

function FinanceTips() {
  const {
    transactions = [],
    loading,
    error,
  } = useFinance();

  const [activeIndex, setActiveIndex] =
    useState(0);

  const [isPaused, setIsPaused] =
    useState(false);

  const smartTip = useMemo(() => {
    const today = new Date();

    const currentMonth =
      today.getMonth();

    const currentYear =
      today.getFullYear();

    let monthlyIncome = 0;
    let monthlyExpense = 0;

    const categoryTotals = {};

    transactions.forEach(
      (transaction) => {
        const date =
          parseTransactionDate(
            transaction.date ||
              transaction.createdAt ||
              transaction.created_at
          );

        if (
          !date ||
          date.getMonth() !==
            currentMonth ||
          date.getFullYear() !==
            currentYear
        ) {
          return;
        }

        const type = String(
          transaction.type || ""
        )
          .trim()
          .toLowerCase();

        const amount =
          getSafeNumber(
            transaction.amount
          );

        if (type === "income") {
          monthlyIncome += amount;
        }

        if (type === "expense") {
          monthlyExpense += amount;

          const category =
            String(
              transaction.category ||
                "Other"
            ).trim() || "Other";

          categoryTotals[category] =
            (categoryTotals[category] ||
              0) + amount;
        }
      }
    );

    const balance =
      monthlyIncome - monthlyExpense;

    const savingsRate =
      monthlyIncome > 0
        ? (balance / monthlyIncome) *
          100
        : 0;

    const highestCategory =
      Object.entries(
        categoryTotals
      ).sort(
        (first, second) =>
          second[1] - first[1]
      )[0];

    if (
      monthlyIncome === 0 &&
      monthlyExpense === 0
    ) {
      return {
        id: "smart-start-tracking",
        title: "Start with consistent tracking",
        description:
          "Your dashboard becomes more useful when every income and expense is recorded.",
        action:
          "Add your recent transactions to receive personalized financial suggestions.",
        category: "Smart tip",
        icon: Sparkles,
        tone: "violet",
      };
    }

    if (monthlyExpense > monthlyIncome) {
      return {
        id: "smart-reduce-expenses",
        title: "Your expenses exceed income",
        description: highestCategory
          ? `${highestCategory[0]} is your largest expense category at ${formatCurrency(
              highestCategory[1]
            )}.`
          : "Your monthly spending is currently higher than your income.",
        action:
          "Review optional expenses first and set a category budget for better control.",
        category: "Smart tip",
        icon: TrendingDown,
        tone: "rose",
      };
    }

    if (savingsRate < 20) {
      return {
        id: "smart-improve-savings",
        title: "Increase your savings rate",
        description: `Your current estimated savings rate is ${Math.max(
          Math.round(savingsRate),
          0
        )}%.`,
        action:
          "Try saving at least 20% of your income before planning optional expenses.",
        category: "Smart tip",
        icon: PiggyBank,
        tone: "amber",
      };
    }

    return {
      id: "smart-healthy-balance",
      title: "Your monthly balance looks healthy",
      description: `You currently have an estimated surplus of ${formatCurrency(
        balance
      )}.`,
      action:
        "Assign part of this surplus to an emergency fund or an active savings goal.",
      category: "Smart tip",
      icon: Sparkles,
      tone: "emerald",
    };
  }, [transactions]);

  const tips = useMemo(
    () => [
      smartTip,
      ...TIP_LIBRARY,
    ],
    [smartTip]
  );

  useEffect(() => {
    const dailyIndex =
      getDayOfYear() %
      tips.length;

    setActiveIndex(dailyIndex);
  }, [tips.length]);

  useEffect(() => {
    if (
      isPaused ||
      tips.length <= 1
    ) {
      return undefined;
    }

    const timer = window.setInterval(
      () => {
        setActiveIndex(
          (currentIndex) =>
            (currentIndex + 1) %
            tips.length
        );
      },
      8000
    );

    return () =>
      window.clearInterval(timer);
  }, [isPaused, tips.length]);

  useEffect(() => {
    if (
      activeIndex >= tips.length
    ) {
      setActiveIndex(0);
    }
  }, [activeIndex, tips.length]);

  const activeTip =
    tips[activeIndex] || tips[0];

  const ActiveIcon =
    activeTip.icon;

  const styles =
    TONE_STYLES[
      activeTip.tone
    ] || TONE_STYLES.cyan;

  const showPreviousTip = () => {
    setActiveIndex(
      (currentIndex) =>
        currentIndex === 0
          ? tips.length - 1
          : currentIndex - 1
    );
  };

  const showNextTip = () => {
    setActiveIndex(
      (currentIndex) =>
        (currentIndex + 1) %
        tips.length
    );
  };

  const showRandomTip = () => {
    if (tips.length <= 1) {
      return;
    }

    let randomIndex =
      activeIndex;

    while (
      randomIndex === activeIndex
    ) {
      randomIndex =
        Math.floor(
          Math.random() *
            tips.length
        );
    }

    setActiveIndex(randomIndex);
  };

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
              w-40
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
              h-80
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
                bg-amber-500/10
                text-amber-600
                dark:text-amber-400
              "
            >
              <Lightbulb size={23} />
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
                Finance Tips
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Practical ideas for building
                better money habits.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={showRandomTip}
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
              hover:border-amber-400
              hover:text-amber-600
              dark:border-slate-700
              dark:bg-slate-950/40
              dark:text-slate-200
              dark:hover:text-amber-400
            "
          >
            <RefreshCw size={16} />
            New tip
          </button>
        </div>

        {error && (
          <div
            className="
              mt-6
              rounded-2xl
              border
              border-amber-200
              bg-amber-50
              px-4
              py-3
              text-sm
              text-amber-700
              dark:border-amber-900
              dark:bg-amber-950/20
              dark:text-amber-400
            "
          >
            Personalized data is temporarily
            unavailable. General finance tips
            will still continue to work.
          </div>
        )}

        {/* Active tip */}

        <div
          className="mt-8"
          onMouseEnter={() =>
            setIsPaused(true)
          }
          onMouseLeave={() =>
            setIsPaused(false)
          }
          onFocus={() =>
            setIsPaused(true)
          }
          onBlur={() =>
            setIsPaused(false)
          }
        >
          <AnimatePresence mode="wait">
            <motion.article
              key={`${activeTip.id}-${activeIndex}`}
              initial={{
                opacity: 0,
                y: 18,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -12,
                scale: 0.98,
              }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
              }}
              className={`
                relative
                overflow-hidden
                rounded-3xl
                border
                p-5
                sm:p-7
                ${styles.card}
              `}
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-16
                  -top-16
                  h-48
                  w-48
                  rounded-full
                  bg-white/40
                  blur-3xl
                  dark:bg-white/5
                "
              />

              <div className="relative">
                <div
                  className="
                    flex
                    flex-col
                    gap-5
                    sm:flex-row
                    sm:items-start
                    sm:justify-between
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      gap-4
                    "
                  >
                    <div
                      className={`
                        flex
                        h-14
                        w-14
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        ${styles.icon}
                      `}
                    >
                      <ActiveIcon size={26} />
                    </div>

                    <div>
                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          px-3
                          py-1.5
                          text-xs
                          font-bold
                          ${styles.badge}
                        `}
                      >
                        {activeTip.category ===
                        "Smart tip" ? (
                          <Sparkles size={13} />
                        ) : (
                          <Lightbulb size={13} />
                        )}

                        {activeTip.category}
                      </span>

                      <h3
                        className="
                          mt-4
                          text-2xl
                          font-black
                          tracking-tight
                          text-slate-950
                          dark:text-white
                          sm:text-3xl
                        "
                      >
                        {activeTip.title}
                      </h3>
                    </div>
                  </div>

                  <span
                    className="
                      shrink-0
                      text-xs
                      font-semibold
                      text-slate-400
                    "
                  >
                    Tip {activeIndex + 1} of{" "}
                    {tips.length}
                  </span>
                </div>

                <p
                  className="
                    mt-6
                    max-w-3xl
                    text-base
                    leading-7
                    text-slate-600
                    dark:text-slate-300
                  "
                >
                  {activeTip.description}
                </p>

                <div
                  className="
                    mt-6
                    flex
                    items-start
                    gap-3
                    rounded-2xl
                    border
                    border-white/70
                    bg-white/60
                    p-4
                    backdrop-blur-xl
                    dark:border-slate-700/70
                    dark:bg-slate-950/40
                  "
                >
                  <div
                    className={`
                      mt-0.5
                      h-2.5
                      w-2.5
                      shrink-0
                      rounded-full
                      ${styles.accent}
                    `}
                  />

                  <div>
                    <p
                      className="
                        text-xs
                        font-black
                        uppercase
                        tracking-[0.16em]
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Action step
                    </p>

                    <p
                      className="
                        mt-2
                        text-sm
                        font-medium
                        leading-6
                        text-slate-800
                        dark:text-slate-200
                      "
                    >
                      {activeTip.action}
                    </p>
                  </div>
                </div>

                {/* Navigation */}

                <div
                  className="
                    mt-7
                    flex
                    flex-col
                    gap-4
                    border-t
                    border-slate-200/70
                    pt-5
                    dark:border-slate-700/70
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    {tips.map(
                      (tip, index) => (
                        <button
                          key={tip.id}
                          type="button"
                          onClick={() =>
                            setActiveIndex(
                              index
                            )
                          }
                          aria-label={`Show tip ${
                            index + 1
                          }`}
                          className={`
                            h-2.5
                            rounded-full
                            transition-all
                            ${
                              index ===
                              activeIndex
                                ? `w-8 ${styles.accent}`
                                : "w-2.5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700"
                            }
                          `}
                        />
                      )
                    )}
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <button
                      type="button"
                      onClick={showPreviousTip}
                      aria-label="Previous finance tip"
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-slate-200
                        bg-white/70
                        text-slate-600
                        transition
                        hover:border-amber-400
                        hover:text-amber-600
                        dark:border-slate-700
                        dark:bg-slate-950/40
                        dark:text-slate-300
                      "
                    >
                      <ArrowLeft size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={showNextTip}
                      aria-label="Next finance tip"
                      className="
                        inline-flex
                        h-10
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-slate-950
                        px-4
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-amber-500
                        dark:bg-white
                        dark:text-slate-950
                        dark:hover:bg-amber-400
                      "
                    >
                      Next tip
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {!isPaused && (
                <motion.div
                  key={`timer-${activeIndex}`}
                  initial={{
                    width: "0%",
                  }}
                  animate={{
                    width: "100%",
                  }}
                  transition={{
                    duration: 8,
                    ease: "linear",
                  }}
                  className={`
                    absolute
                    bottom-0
                    left-0
                    h-1
                    ${styles.accent}
                  `}
                />
              )}
            </motion.article>
          </AnimatePresence>
        </div>

        <div
          className="
            mt-5
            flex
            items-center
            justify-center
            gap-2
            text-xs
            text-slate-400
          "
        >
          <Sparkles size={13} />

          Tips rotate automatically every
          eight seconds. Hover to pause.
        </div>
      </div>
    </section>
  );
}

export default FinanceTips;