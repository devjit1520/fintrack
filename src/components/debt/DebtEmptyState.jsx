import { motion } from "framer-motion";

import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  History,
  Landmark,
  Plus,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";

/* =========================================================
   EMPTY STATE CONFIGURATION
========================================================= */

const emptyStateConfig = {
  overview: {
    eyebrow: "Start tracking",
    title: "Your Debt Center is empty",

    description:
      "Add your first loan, EMI, borrowed amount or money lent to start tracking balances, repayments, due dates and payment history.",

    buttonLabel:
      "Add First Debt Record",

    icon: WalletCards,

    iconClasses: `
      bg-blue-500/10
      text-blue-600
      dark:text-blue-300
    `,

    glowClasses:
      "bg-blue-500/[0.12]",

    badge:
      "Ready to start tracking",
  },

  loans: {
    eyebrow: "Loans & installments",
    title: "No loans or EMIs yet",

    description:
      "Add loans or installment-based payments to track outstanding balances, EMI amounts, due dates and repayment progress.",

    buttonLabel:
      "Add Loan or EMI",

    icon: Landmark,

    iconClasses: `
      bg-violet-500/10
      text-violet-600
      dark:text-violet-300
    `,

    glowClasses:
      "bg-violet-500/[0.12]",

    badge:
      "No active loan records",
  },

  borrowed: {
    eyebrow: "Money you owe",
    title: "No borrowed money records",

    description:
      "Record money borrowed from friends, family or other people so FinTrack can help you monitor repayments and due dates.",

    buttonLabel:
      "Add Borrowed Money",

    icon: ArrowDownLeft,

    iconClasses: `
      bg-rose-500/10
      text-rose-600
      dark:text-rose-300
    `,

    glowClasses:
      "bg-rose-500/[0.10]",

    badge:
      "No personal borrowing",
  },

  lent: {
    eyebrow: "Money to collect",
    title: "No money lent records",

    description:
      "Add money you have lent to another person so you can monitor outstanding balances and repayments received.",

    buttonLabel:
      "Add Money Lent",

    icon: ArrowUpRight,

    iconClasses: `
      bg-emerald-500/10
      text-emerald-600
      dark:text-emerald-300
    `,

    glowClasses:
      "bg-emerald-500/[0.10]",

    badge:
      "No receivables recorded",
  },

  history: {
    eyebrow: "Repayment activity",
    title: "No payment history yet",

    description:
      "Payments and repayments will automatically appear here after you record activity against a debt record.",

    buttonLabel:
      "Add Debt Record",

    icon: History,

    iconClasses: `
      bg-cyan-500/10
      text-cyan-600
      dark:text-cyan-300
    `,

    glowClasses:
      "bg-cyan-500/[0.10]",

    badge:
      "History updates automatically",
  },

  default: {
    eyebrow: "Debt management",
    title: "No debt records found",

    description:
      "Create a debt record to start tracking outstanding balances, repayment progress and upcoming due dates.",

    buttonLabel:
      "Add Debt Record",

    icon: CircleDollarSign,

    iconClasses: `
      bg-blue-500/10
      text-blue-600
      dark:text-blue-300
    `,

    glowClasses:
      "bg-blue-500/[0.10]",

    badge:
      "Nothing to display",
  },
};

/* =========================================================
   FEATURE ITEM
========================================================= */

function FeatureItem({
  icon: Icon,
  title,
  description,
  classes,
}) {
  return (
    <div
      className="
        flex
        min-w-0
        items-start
        gap-3
        rounded-2xl
        border
        border-slate-200/80
        bg-white/70
        p-3.5
        text-left
        dark:border-white/[0.07]
        dark:bg-white/[0.025]
      "
    >
      <span
        className={`
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          ${classes}
        `}
      >
        <Icon size={15} />
      </span>

      <div className="min-w-0">
        <p
          className="
            text-[10px]
            font-black
            text-slate-900
            dark:text-white
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            text-[9px]
            leading-4
            text-slate-500
            dark:text-slate-400
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   DEBT EMPTY STATE
========================================================= */

function DebtEmptyState({
  type = "default",
  onAddDebt,
  compact = false,
}) {
  const config =
    emptyStateConfig[type] ||
    emptyStateConfig.default;

  const Icon =
    config.icon;

  /* =======================================================
     COMPACT VERSION
  ======================================================= */

  if (compact) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
        }}
        className="
          relative
          min-w-0
          overflow-hidden
          rounded-[24px]
          border
          border-slate-200/80
          bg-white
          p-5
          shadow-sm
          dark:border-white/[0.08]
          dark:bg-[#0a1427]
        "
      >
        <div
          className={`
            pointer-events-none
            absolute
            -right-16
            -top-16
            h-36
            w-36
            rounded-full
            blur-[65px]
            ${config.glowClasses}
          `}
        />

        <div
          className="
            relative
            flex
            min-w-0
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
                ${config.iconClasses}
              `}
            >
              <Icon size={18} />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-blue-600
                  dark:text-blue-300
                "
              >
                {config.eyebrow}
              </p>

              <h3
                className="
                  mt-1
                  text-sm
                  font-black
                  text-slate-950
                  dark:text-white
                "
              >
                {config.title}
              </h3>

              <p
                className="
                  mt-1
                  max-w-xl
                  text-[9px]
                  leading-4
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {config.description}
              </p>
            </div>
          </div>

          {onAddDebt && (
            <button
              type="button"
              onClick={onAddDebt}
              className="
                inline-flex
                min-h-10
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-cyan-500
                via-blue-500
                to-violet-500
                px-4
                py-2
                text-[10px]
                font-black
                text-white
                shadow-lg
                shadow-blue-500/15
                transition
                hover:-translate-y-0.5
              "
            >
              <Plus size={13} />

              {config.buttonLabel}
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  /* =======================================================
     FULL EMPTY STATE
  ======================================================= */

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      className="
        relative
        min-w-0
        overflow-hidden
        rounded-[30px]
        border
        border-slate-200/80
        bg-white
        p-5
        shadow-sm
        dark:border-white/[0.08]
        dark:bg-[#0a1427]
        sm:p-7
        lg:p-8
      "
    >
      {/* ===================================================
          BACKGROUND DECORATION
      =================================================== */}

      <div
        className={`
          pointer-events-none
          absolute
          -right-28
          -top-28
          h-72
          w-72
          rounded-full
          blur-[110px]
          ${config.glowClasses}
        `}
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-32
          left-1/4
          h-60
          w-60
          rounded-full
          bg-violet-500/[0.06]
          blur-[100px]
        "
      />

      <div
        className="
          relative
          mx-auto
          max-w-4xl
        "
      >
        {/* =================================================
            MAIN EMPTY STATE CONTENT
        ================================================== */}

        <div
          className="
            flex
            flex-col
            items-center
            text-center
          "
        >
          {/* Icon area */}

          <div className="relative">
            <div
              className={`
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-[26px]
                border
                border-slate-200/70
                bg-white
                shadow-xl
                dark:border-white/[0.08]
                dark:bg-[#0e1a30]
                ${config.iconClasses}
              `}
            >
              <Icon size={31} />
            </div>

            <div
              className="
                absolute
                -right-2
                -top-2
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-xl
                border
                border-blue-400/20
                bg-gradient-to-br
                from-cyan-500
                to-blue-600
                text-white
                shadow-lg
                shadow-blue-500/25
              "
            >
              <Sparkles size={13} />
            </div>
          </div>

          {/* Eyebrow */}

          <div
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-blue-500/15
              bg-blue-500/[0.06]
              px-3
              py-1.5
              text-[9px]
              font-black
              uppercase
              tracking-[0.13em]
              text-blue-600
              dark:text-blue-300
            "
          >
            <ReceiptText size={11} />

            {config.eyebrow}
          </div>

          {/* Title */}

          <h3
            className="
              mt-4
              text-xl
              font-black
              tracking-tight
              text-slate-950
              dark:text-white
              sm:text-2xl
            "
          >
            {config.title}
          </h3>

          {/* Description */}

          <p
            className="
              mt-3
              max-w-2xl
              text-xs
              leading-6
              text-slate-500
              dark:text-slate-400
            "
          >
            {config.description}
          </p>

          {/* Badge */}

          <div
            className="
              mt-4
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-emerald-500/15
              bg-emerald-500/[0.06]
              px-3
              py-2
              text-[9px]
              font-black
              text-emerald-600
              dark:text-emerald-300
            "
          >
            <CheckCircle2 size={12} />

            {config.badge}
          </div>

          {/* CTA */}

          {onAddDebt && (
            <button
              type="button"
              onClick={onAddDebt}
              className="
                group
                mt-6
                inline-flex
                min-h-12
                items-center
                justify-center
                gap-2.5
                rounded-2xl
                bg-gradient-to-r
                from-cyan-500
                via-blue-500
                to-violet-500
                px-6
                py-3
                text-xs
                font-black
                text-white
                shadow-xl
                shadow-blue-500/20
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-2xl
                hover:shadow-blue-500/25
              "
            >
              <Plus size={16} />

              {config.buttonLabel}

              <ArrowRight
                size={14}
                className="
                  transition-transform
                  group-hover:translate-x-0.5
                "
              />
            </button>
          )}
        </div>

        {/* =================================================
            BENEFITS
        ================================================== */}

        {type !== "history" && (
          <div
            className="
              mt-8
              grid
              min-w-0
              gap-3
              border-t
              border-slate-200/80
              pt-6
              dark:border-white/[0.07]
              md:grid-cols-3
            "
          >
            <FeatureItem
              icon={WalletCards}
              title="Track balances"
              description="Always know how much remains payable or receivable."
              classes="
                bg-blue-500/10
                text-blue-600
                dark:text-blue-300
              "
            />

            <FeatureItem
              icon={ReceiptText}
              title="Record repayments"
              description="Every payment automatically updates the debt balance."
              classes="
                bg-violet-500/10
                text-violet-600
                dark:text-violet-300
              "
            />

            <FeatureItem
              icon={ShieldCheck}
              title="Never miss dues"
              description="Upcoming and overdue payment dates are highlighted."
              classes="
                bg-emerald-500/10
                text-emerald-600
                dark:text-emerald-300
              "
            />
          </div>
        )}

        {/* =================================================
            HISTORY EXPLANATION
        ================================================== */}

        {type === "history" && (
          <div
            className="
              mt-8
              grid
              gap-3
              border-t
              border-slate-200/80
              pt-6
              dark:border-white/[0.07]
              sm:grid-cols-2
            "
          >
            <FeatureItem
              icon={ArrowUpRight}
              title="Payments made"
              description="Payments toward loans and borrowed money appear here."
              classes="
                bg-blue-500/10
                text-blue-600
                dark:text-blue-300
              "
            />

            <FeatureItem
              icon={ArrowDownLeft}
              title="Money received"
              description="Repayments received from people you lent money to appear here."
              classes="
                bg-emerald-500/10
                text-emerald-600
                dark:text-emerald-300
              "
            />
          </div>
        )}
      </div>
    </motion.section>
  );
}

export default DebtEmptyState;