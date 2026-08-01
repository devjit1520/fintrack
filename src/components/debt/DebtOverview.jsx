import { useMemo } from "react";

import { motion } from "framer-motion";

import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  HandCoins,
  History,
  Landmark,
  Plus,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import useDebt from "../../hooks/useDebt";

import DebtEmptyState from "./DebtEmptyState";

import {
  calculateDebtProgress,
  calculatePaidAmount,
  calculateRemainingAmount,
  formatDebtCurrency,
  formatDebtDate,
  getDaysUntilDue,
  getDebtTypeLabel,
  normalizeDebtRecord,
} from "../../utils/debtCalculations";

/* =========================================================
   SAFE DATE
========================================================= */

function getTimestamp(value) {
  if (!value) {
    return 0;
  }

  const date =
    new Date(value);

  const timestamp =
    date.getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
}

/* =========================================================
   DUE DATE MESSAGE
========================================================= */

function getDueMessage(date) {
  if (!date) {
    return "No payment date";
  }

  const days =
    getDaysUntilDue(date);

  if (days === null) {
    return "No payment date";
  }

  if (days < 0) {
    const overdueDays =
      Math.abs(days);

    return `Overdue by ${overdueDays} ${
      overdueDays === 1
        ? "day"
        : "days"
    }`;
  }

  if (days === 0) {
    return "Due today";
  }

  if (days === 1) {
    return "Due tomorrow";
  }

  return `Due in ${days} days`;
}

/* =========================================================
   STATUS DESIGN
========================================================= */

function getStatusDesign(status) {
  switch (status) {
    case "completed":
      return {
        label: "Completed",

        classes:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
      };

    case "overdue":
      return {
        label: "Overdue",

        classes:
          "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-300",
      };

    case "upcoming":
      return {
        label: "Upcoming",

        classes:
          "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300",
      };

    case "partially-paid":
      return {
        label: "Partially Paid",

        classes:
          "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-300",
      };

    case "active":
    default:
      return {
        label: "Active",

        classes:
          "border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-300",
      };
  }
}

/* =========================================================
   NEXT PAYMENT CARD
========================================================= */

function NextPaymentCard({
  record,
  onRecordPayment,
}) {
  if (!record) {
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
        className="
          relative
          min-w-0
          overflow-hidden
          rounded-[28px]
          border
          border-slate-200/80
          bg-white
          p-5
          shadow-sm
          dark:border-white/[0.08]
          dark:bg-[#0a1427]
          sm:p-6
        "
      >
        <div
          className="
            flex
            min-h-[260px]
            flex-col
            items-center
            justify-center
            text-center
          "
        >
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-[22px]
              border
              border-emerald-500/20
              bg-emerald-500/10
              text-emerald-600
              dark:text-emerald-300
            "
          >
            <CheckCircle2
              size={27}
            />
          </div>

          <h3
            className="
              mt-5
              text-lg
              font-black
              text-slate-950
              dark:text-white
            "
          >
            No scheduled payment
          </h3>

          <p
            className="
              mt-2
              max-w-md
              text-xs
              leading-5
              text-slate-500
              dark:text-slate-400
            "
          >
            There are currently no active
            debt records with an upcoming
            payment date.
          </p>
        </div>
      </motion.article>
    );
  }

  const remainingAmount =
    calculateRemainingAmount(
      record
    );

  const progress =
    calculateDebtProgress(
      record
    );

  const scheduledAmount =
    Number(
      record.installmentAmount
    ) > 0
      ? Math.min(
          Number(
            record.installmentAmount
          ),
          remainingAmount
        )
      : remainingAmount;

  const receivable =
    record.direction ===
    "receivable";

  const daysUntilDue =
    getDaysUntilDue(
      record.nextDueDate
    );

  const overdue =
    daysUntilDue !== null &&
    daysUntilDue < 0;

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
        duration: 0.4,
      }}
      className="
        relative
        min-w-0
        overflow-hidden
        rounded-[28px]
        border
        border-slate-200/80
        bg-white
        shadow-sm
        dark:border-white/[0.08]
        dark:bg-gradient-to-br
        dark:from-[#0a172a]
        dark:via-[#0b1629]
        dark:to-[#13132d]
      "
    >
      {/* Glow */}

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-64
          w-64
          rounded-full
          bg-blue-500/[0.08]
          blur-[100px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          left-1/4
          h-56
          w-56
          rounded-full
          bg-violet-500/[0.07]
          blur-[100px]
        "
      />

      <div
        className="
          relative
          p-5
          sm:p-6
        "
      >
        {/* Header */}

        <div
          className="
            flex
            min-w-0
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
              min-w-0
              items-start
              gap-3
            "
          >
            <div
              className={`
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                ${
                  receivable
                    ? `
                      bg-emerald-500/10
                      text-emerald-600
                      dark:text-emerald-300
                    `
                    : `
                      bg-blue-500/10
                      text-blue-600
                      dark:text-blue-300
                    `
                }
              `}
            >
              {receivable ? (
                <HandCoins
                  size={20}
                />
              ) : (
                <CalendarClock
                  size={20}
                />
              )}
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-cyan-600
                  dark:text-cyan-300
                "
              >
                Next scheduled payment
              </p>

              <h3
                className="
                  mt-1
                  break-words
                  text-lg
                  font-black
                  text-slate-950
                  dark:text-white
                "
              >
                {record.title}
              </h3>

              <p
                className="
                  mt-1
                  truncate
                  text-[10px]
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {record.partyName ||
                  "No person or institution"}
              </p>
            </div>
          </div>

          <span
            className={`
              inline-flex
              w-fit
              shrink-0
              items-center
              gap-1.5
              rounded-full
              border
              px-3
              py-1.5
              text-[9px]
              font-black
              ${
                overdue
                  ? `
                    border-rose-500/20
                    bg-rose-500/10
                    text-rose-600
                    dark:text-rose-300
                  `
                  : `
                    border-blue-500/20
                    bg-blue-500/10
                    text-blue-600
                    dark:text-blue-300
                  `
              }
            `}
          >
            {overdue ? (
              <AlertTriangle
                size={12}
              />
            ) : (
              <Clock3 size={12} />
            )}

            {getDueMessage(
              record.nextDueDate
            )}
          </span>
        </div>

        {/* Amount */}

        <div
          className="
            mt-6
            grid
            min-w-0
            gap-3
            sm:grid-cols-3
          "
        >
          <div
            className="
              rounded-2xl
              border
              border-slate-200/80
              bg-slate-50/70
              p-4
              dark:border-white/[0.07]
              dark:bg-white/[0.03]
            "
          >
            <p
              className="
                text-[8px]
                font-black
                uppercase
                tracking-wide
                text-slate-500
              "
            >
              {receivable
                ? "Expected Amount"
                : "Payment Amount"}
            </p>

            <p
              className="
                mt-2
                truncate
                text-lg
                font-black
                text-slate-950
                dark:text-white
              "
            >
              {formatDebtCurrency(
                scheduledAmount
              )}
            </p>
          </div>

          <div
            className="
              rounded-2xl
              border
              border-slate-200/80
              bg-slate-50/70
              p-4
              dark:border-white/[0.07]
              dark:bg-white/[0.03]
            "
          >
            <p
              className="
                text-[8px]
                font-black
                uppercase
                tracking-wide
                text-slate-500
              "
            >
              Remaining Balance
            </p>

            <p
              className="
                mt-2
                truncate
                text-lg
                font-black
                text-slate-950
                dark:text-white
              "
            >
              {formatDebtCurrency(
                remainingAmount
              )}
            </p>
          </div>

          <div
            className="
              rounded-2xl
              border
              border-slate-200/80
              bg-slate-50/70
              p-4
              dark:border-white/[0.07]
              dark:bg-white/[0.03]
            "
          >
            <p
              className="
                text-[8px]
                font-black
                uppercase
                tracking-wide
                text-slate-500
              "
            >
              Payment Date
            </p>

            <p
              className="
                mt-2
                truncate
                text-sm
                font-black
                text-slate-950
                dark:text-white
              "
            >
              {record.nextDueDate
                ? formatDebtDate(
                    record.nextDueDate
                  )
                : "Not scheduled"}
            </p>
          </div>
        </div>

        {/* Progress */}

        <div className="mt-5">
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <span
              className="
                text-[9px]
                font-bold
                text-slate-500
                dark:text-slate-400
              "
            >
              Repayment progress
            </span>

            <span
              className="
                text-[10px]
                font-black
                text-blue-600
                dark:text-blue-300
              "
            >
              {progress}%
            </span>
          </div>

          <div
            className="
              mt-2
              h-2.5
              overflow-hidden
              rounded-full
              bg-slate-200
              dark:bg-white/[0.07]
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
                duration: 0.7,
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
        </div>

        {/* Action */}

        <div
          className="
            mt-6
            flex
            flex-col
            gap-3
            border-t
            border-slate-200/80
            pt-5
            dark:border-white/[0.07]
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
              text-[10px]
              text-slate-500
              dark:text-slate-400
            "
          >
            <ReceiptText
              size={13}
            />

            {getDebtTypeLabel(
              record.type
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              onRecordPayment?.(
                record
              )
            }
            className={`
              inline-flex
              min-h-11
              items-center
              justify-center
              gap-2
              rounded-2xl
              px-5
              py-3
              text-xs
              font-black
              text-white
              shadow-lg
              transition
              hover:-translate-y-0.5
              ${
                receivable
                  ? `
                    bg-gradient-to-r
                    from-emerald-500
                    to-cyan-500
                    shadow-emerald-500/15
                  `
                  : `
                    bg-gradient-to-r
                    from-cyan-500
                    via-blue-500
                    to-violet-500
                    shadow-blue-500/20
                  `
              }
            `}
          >
            {receivable ? (
              <HandCoins size={16} />
            ) : (
              <Banknote size={16} />
            )}

            {receivable
              ? "Record Received"
              : "Record Payment"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   HEALTH STAT
========================================================= */

function HealthStat({
  label,
  value,
  icon: Icon,
  classes,
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
        border-slate-200/80
        bg-slate-50/70
        p-3.5
        dark:border-white/[0.07]
        dark:bg-white/[0.025]
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
          ${classes}
        `}
      >
        <Icon size={15} />
      </div>

      <div className="min-w-0">
        <p
          className="
            text-[8px]
            font-black
            uppercase
            tracking-wide
            text-slate-500
            dark:text-slate-400
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1
            text-sm
            font-black
            text-slate-950
            dark:text-white
          "
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   DEBT HEALTH CARD
========================================================= */

function DebtHealthCard({
  metrics,
}) {
  const totalRecords =
    metrics.active +
    metrics.overdue +
    metrics.completed;

  const completionRate =
    totalRecords > 0
      ? Math.round(
          (metrics.completed /
            totalRecords) *
            100
        )
      : 0;

  const overdueRate =
    totalRecords > 0
      ? Math.round(
          (metrics.overdue /
            totalRecords) *
            100
        )
      : 0;

  let healthLabel =
    "Healthy";

  let healthDescription =
    "Your debt records are currently under control.";

  let healthClasses =
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300";

  let HealthIcon =
    ShieldCheck;

  if (metrics.overdue > 0) {
    healthLabel =
      "Needs Attention";

    healthDescription =
      `${metrics.overdue} ${
        metrics.overdue === 1
          ? "record requires"
          : "records require"
      } immediate attention.`;

    healthClasses =
      "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-300";

    HealthIcon =
      AlertTriangle;
  } else if (
    metrics.dueSoon > 0
  ) {
    healthLabel =
      "Upcoming Payments";

    healthDescription =
      `${metrics.dueSoon} ${
        metrics.dueSoon === 1
          ? "payment is"
          : "payments are"
      } due within seven days.`;

    healthClasses =
      "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300";

    HealthIcon =
      CalendarClock;
  }

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
        duration: 0.4,
        delay: 0.05,
      }}
      className="
        relative
        min-w-0
        overflow-hidden
        rounded-[28px]
        border
        border-slate-200/80
        bg-white
        p-5
        shadow-sm
        dark:border-white/[0.08]
        dark:bg-[#0a1427]
        sm:p-6
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-48
          w-48
          rounded-full
          bg-emerald-500/[0.06]
          blur-[80px]
        "
      />

      <div className="relative">
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
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
                bg-emerald-500/10
                text-emerald-600
                dark:text-emerald-300
              "
            >
              <ShieldCheck
                size={19}
              />
            </div>

            <div>
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-emerald-600
                  dark:text-emerald-300
                "
              >
                Debt health
              </p>

              <h3
                className="
                  mt-1
                  text-lg
                  font-black
                  text-slate-950
                  dark:text-white
                "
              >
                Portfolio Status
              </h3>
            </div>
          </div>
        </div>

        {/* Health status */}

        <div
          className="
            mt-5
            rounded-2xl
            border
            border-slate-200/80
            bg-slate-50/70
            p-4
            dark:border-white/[0.07]
            dark:bg-white/[0.025]
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
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                ${healthClasses}
              `}
            >
              <HealthIcon
                size={17}
              />
            </div>

            <div>
              <p
                className="
                  text-sm
                  font-black
                  text-slate-950
                  dark:text-white
                "
              >
                {healthLabel}
              </p>

              <p
                className="
                  mt-1
                  text-[10px]
                  leading-5
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {healthDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}

        <div
          className="
            mt-4
            grid
            min-w-0
            grid-cols-2
            gap-3
          "
        >
          <HealthStat
            label="Active"
            value={metrics.active}
            icon={WalletCards}
            classes="
              bg-blue-500/10
              text-blue-600
              dark:text-blue-300
            "
          />

          <HealthStat
            label="Overdue"
            value={metrics.overdue}
            icon={AlertTriangle}
            classes="
              bg-rose-500/10
              text-rose-600
              dark:text-rose-300
            "
          />

          <HealthStat
            label="Due Soon"
            value={metrics.dueSoon}
            icon={Clock3}
            classes="
              bg-amber-500/10
              text-amber-600
              dark:text-amber-300
            "
          />

          <HealthStat
            label="Completed"
            value={metrics.completed}
            icon={CheckCircle2}
            classes="
              bg-emerald-500/10
              text-emerald-600
              dark:text-emerald-300
            "
          />
        </div>

        {/* Completion */}

        <div className="mt-5">
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <span
              className="
                text-[9px]
                font-bold
                text-slate-500
                dark:text-slate-400
              "
            >
              Record completion
            </span>

            <span
              className="
                text-[10px]
                font-black
                text-emerald-600
                dark:text-emerald-300
              "
            >
              {completionRate}%
            </span>
          </div>

          <div
            className="
              mt-2
              h-2
              overflow-hidden
              rounded-full
              bg-slate-200
              dark:bg-white/[0.07]
            "
          >
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: `${completionRate}%`,
              }}
              transition={{
                duration: 0.7,
              }}
              className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-emerald-500
                to-cyan-500
              "
            />
          </div>
        </div>

        {overdueRate > 0 && (
          <p
            className="
              mt-3
              text-[9px]
              font-semibold
              text-rose-600
              dark:text-rose-300
            "
          >
            {overdueRate}% of your
            records are currently
            overdue.
          </p>
        )}
      </div>
    </motion.article>
  );
}

/* =========================================================
   QUICK ACTION BUTTON
========================================================= */

function QuickAction({
  icon: Icon,
  title,
  description,
  classes,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex
        min-w-0
        items-center
        gap-3
        rounded-2xl
        border
        border-slate-200/80
        bg-slate-50/70
        p-3.5
        text-left
        transition
        hover:-translate-y-0.5
        hover:border-blue-500/20
        hover:bg-blue-500/[0.035]
        dark:border-white/[0.07]
        dark:bg-white/[0.025]
        dark:hover:bg-white/[0.045]
      "
    >
      <span
        className={`
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          ${classes}
        `}
      >
        <Icon size={17} />
      </span>

      <span className="min-w-0 flex-1">
        <span
          className="
            block
            truncate
            text-[11px]
            font-black
            text-slate-950
            dark:text-white
          "
        >
          {title}
        </span>

        <span
          className="
            mt-0.5
            block
            truncate
            text-[9px]
            text-slate-500
            dark:text-slate-400
          "
        >
          {description}
        </span>
      </span>

      <ArrowRight
        size={14}
        className="
          shrink-0
          text-slate-400
          transition
          group-hover:translate-x-0.5
          group-hover:text-blue-500
        "
      />
    </button>
  );
}

/* =========================================================
   QUICK ACTIONS CARD
========================================================= */

function QuickActionsCard({
  onAddDebt,
  onOpenHistory,
  onViewLoans,
  onViewBorrowed,
  onViewLent,
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
      transition={{
        duration: 0.4,
        delay: 0.1,
      }}
      className="
        relative
        min-w-0
        overflow-hidden
        rounded-[28px]
        border
        border-slate-200/80
        bg-white
        p-5
        shadow-sm
        dark:border-white/[0.08]
        dark:bg-[#0a1427]
        sm:p-6
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
            bg-violet-500/10
            text-violet-600
            dark:text-violet-300
          "
        >
          <Sparkles size={19} />
        </div>

        <div>
          <p
            className="
              text-[9px]
              font-black
              uppercase
              tracking-[0.14em]
              text-violet-600
              dark:text-violet-300
            "
          >
            Shortcuts
          </p>

          <h3
            className="
              mt-1
              text-lg
              font-black
              text-slate-950
              dark:text-white
            "
          >
            Quick Actions
          </h3>
        </div>
      </div>

      <div
        className="
          mt-5
          grid
          gap-3
          sm:grid-cols-2
          xl:grid-cols-1
        "
      >
        <QuickAction
          icon={Plus}
          title="Add Debt Record"
          description="Create a new record"
          onClick={onAddDebt}
          classes="
            bg-blue-500/10
            text-blue-600
            dark:text-blue-300
          "
        />

        <QuickAction
          icon={Landmark}
          title="Loans & EMI"
          description="View installments"
          onClick={onViewLoans}
          classes="
            bg-violet-500/10
            text-violet-600
            dark:text-violet-300
          "
        />

        <QuickAction
          icon={ArrowDownLeft}
          title="Money Borrowed"
          description="View money you owe"
          onClick={onViewBorrowed}
          classes="
            bg-rose-500/10
            text-rose-600
            dark:text-rose-300
          "
        />

        <QuickAction
          icon={ArrowUpRight}
          title="Money Lent"
          description="View receivables"
          onClick={onViewLent}
          classes="
            bg-emerald-500/10
            text-emerald-600
            dark:text-emerald-300
          "
        />

        <QuickAction
          icon={History}
          title="Payment History"
          description="Review past repayments"
          onClick={onOpenHistory}
          classes="
            bg-cyan-500/10
            text-cyan-600
            dark:text-cyan-300
          "
        />
      </div>
    </motion.article>
  );
}

/* =========================================================
   RECENT DEBT RECORD
========================================================= */

function RecentDebtRecord({
  record,
  index,
  onRecordPayment,
}) {
  const remaining =
    calculateRemainingAmount(
      record
    );

  const progress =
    calculateDebtProgress(
      record
    );

  const design =
    getStatusDesign(
      record.status
    );

  const receivable =
    record.direction ===
    "receivable";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay:
          Math.min(index, 5) *
          0.04,
      }}
      className="
        group
        min-w-0
        rounded-2xl
        border
        border-slate-200/80
        bg-slate-50/65
        p-4
        transition
        hover:border-blue-500/20
        hover:bg-blue-500/[0.025]
        dark:border-white/[0.07]
        dark:bg-white/[0.025]
        dark:hover:bg-white/[0.04]
      "
    >
      <div
        className="
          flex
          min-w-0
          flex-col
          gap-4
          md:flex-row
          md:items-center
        "
      >
        <div
          className="
            flex
            min-w-0
            flex-1
            items-start
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
                receivable
                  ? `
                    bg-emerald-500/10
                    text-emerald-600
                    dark:text-emerald-300
                  `
                  : `
                    bg-blue-500/10
                    text-blue-600
                    dark:text-blue-300
                  `
              }
            `}
          >
            {receivable ? (
              <ArrowDownLeft
                size={17}
              />
            ) : (
              <ArrowUpRight
                size={17}
              />
            )}
          </div>

          <div className="min-w-0">
            <div
              className="
                flex
                min-w-0
                flex-wrap
                items-center
                gap-2
              "
            >
              <p
                className="
                  break-words
                  text-xs
                  font-black
                  text-slate-950
                  dark:text-white
                "
              >
                {record.title}
              </p>

              <span
                className={`
                  rounded-full
                  border
                  px-2
                  py-1
                  text-[8px]
                  font-black
                  ${design.classes}
                `}
              >
                {design.label}
              </span>
            </div>

            <p
              className="
                mt-1
                truncate
                text-[9px]
                text-slate-500
                dark:text-slate-400
              "
            >
              {getDebtTypeLabel(
                record.type
              )}
              {" • "}
              {record.partyName ||
                "No party"}
            </p>
          </div>
        </div>

        <div
          className="
            grid
            min-w-0
            grid-cols-2
            gap-3
            md:w-[290px]
          "
        >
          <div>
            <p
              className="
                text-[8px]
                font-bold
                uppercase
                text-slate-500
              "
            >
              Remaining
            </p>

            <p
              className="
                mt-1
                truncate
                text-xs
                font-black
                text-slate-950
                dark:text-white
              "
            >
              {formatDebtCurrency(
                remaining
              )}
            </p>
          </div>

          <div>
            <p
              className="
                text-[8px]
                font-bold
                uppercase
                text-slate-500
              "
            >
              Progress
            </p>

            <p
              className="
                mt-1
                text-xs
                font-black
                text-blue-600
                dark:text-blue-300
              "
            >
              {progress}%
            </p>
          </div>
        </div>

        {record.status !==
          "completed" && (
          <button
            type="button"
            onClick={() =>
              onRecordPayment?.(
                record
              )
            }
            className="
              inline-flex
              min-h-10
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-blue-500/20
              bg-blue-500/10
              px-3
              py-2
              text-[10px]
              font-black
              text-blue-600
              transition
              hover:bg-blue-500/15
              dark:text-blue-300
            "
          >
            <CircleDollarSign
              size={14}
            />

            {receivable
              ? "Receive"
              : "Pay"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* =========================================================
   RECENT RECORDS
========================================================= */

function RecentRecords({
  records,
  onRecordPayment,
  onViewLoans,
}) {
  return (
    <motion.section
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
        delay: 0.15,
      }}
      className="
        relative
        min-w-0
        overflow-hidden
        rounded-[28px]
        border
        border-slate-200/80
        bg-white
        p-5
        shadow-sm
        dark:border-white/[0.08]
        dark:bg-[#0a1427]
        sm:p-6
      "
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
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-blue-500/10
              text-blue-600
              dark:text-blue-300
            "
          >
            <WalletCards
              size={19}
            />
          </div>

          <div>
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
              Latest activity
            </p>

            <h3
              className="
                mt-1
                text-lg
                font-black
                text-slate-950
                dark:text-white
              "
            >
              Recent Debt Records
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={
            onViewLoans
          }
          className="
            inline-flex
            min-h-10
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-2
            text-[10px]
            font-black
            text-slate-600
            transition
            hover:border-blue-500/25
            hover:bg-blue-500/[0.06]
            hover:text-blue-600
            dark:border-white/[0.08]
            dark:bg-white/[0.035]
            dark:text-slate-400
            dark:hover:text-blue-300
          "
        >
          View Records

          <ArrowRight
            size={13}
          />
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {records.map(
          (record, index) => (
            <RecentDebtRecord
              key={record.id}
              record={record}
              index={index}
              onRecordPayment={
                onRecordPayment
              }
            />
          )
        )}
      </div>
    </motion.section>
  );
}

/* =========================================================
   LOADING
========================================================= */

function DebtOverviewSkeleton() {
  return (
    <div className="space-y-5">
      <div
        className="
          grid
          gap-5
          xl:grid-cols-[1.45fr_0.75fr]
        "
      >
        <div
          className="
            h-[360px]
            animate-pulse
            rounded-[28px]
            bg-slate-200
            dark:bg-white/[0.05]
          "
        />

        <div
          className="
            h-[360px]
            animate-pulse
            rounded-[28px]
            bg-slate-200
            dark:bg-white/[0.05]
          "
        />
      </div>

      <div
        className="
          h-[320px]
          animate-pulse
          rounded-[28px]
          bg-slate-200
          dark:bg-white/[0.05]
        "
      />
    </div>
  );
}

/* =========================================================
   DEBT OVERVIEW
========================================================= */

function DebtOverview({
  onAddDebt,
  onRecordPayment,
  onOpenHistory,
  onViewLoans,
  onViewBorrowed,
  onViewLent,
}) {
  const {
    debts,
    loading,
  } = useDebt();

  const records =
    useMemo(() => {
      return (
        Array.isArray(debts)
          ? debts
          : []
      ).map((debt) =>
        normalizeDebtRecord(
          debt
        )
      );
    }, [debts]);

  /* =======================================================
     NEXT PAYMENT
  ======================================================= */

  const nextPayment =
    useMemo(() => {
      return records
        .filter(
          (record) =>
            record.status !==
              "completed" &&
            record.nextDueDate
        )
        .sort(
          (first, second) =>
            getTimestamp(
              first.nextDueDate
            ) -
            getTimestamp(
              second.nextDueDate
            )
        )[0] || null;
    }, [records]);

  /* =======================================================
     HEALTH METRICS
  ======================================================= */

  const healthMetrics =
    useMemo(() => {
      return records.reduce(
        (result, record) => {
          if (
            record.status ===
            "completed"
          ) {
            result.completed += 1;

            return result;
          }

          result.active += 1;

          const days =
            getDaysUntilDue(
              record.nextDueDate
            );

          if (
            record.status ===
              "overdue" ||
            (days !== null &&
              days < 0)
          ) {
            result.overdue += 1;

            return result;
          }

          if (
            days !== null &&
            days >= 0 &&
            days <= 7
          ) {
            result.dueSoon += 1;
          }

          return result;
        },
        {
          active: 0,
          overdue: 0,
          dueSoon: 0,
          completed: 0,
        }
      );
    }, [records]);

  /* =======================================================
     RECENT RECORDS
  ======================================================= */

  const recentRecords =
    useMemo(() => {
      return [...records]
        .sort(
          (first, second) =>
            Math.max(
              getTimestamp(
                second.updatedAt
              ),
              getTimestamp(
                second.createdAt
              )
            ) -
            Math.max(
              getTimestamp(
                first.updatedAt
              ),
              getTimestamp(
                first.createdAt
              )
            )
        )
        .slice(0, 4);
    }, [records]);

  if (loading) {
    return (
      <DebtOverviewSkeleton />
    );
  }

  if (records.length === 0) {
    return (
      <DebtEmptyState
        type="overview"
        onAddDebt={
          onAddDebt
        }
      />
    );
  }

  return (
    <div
      className="
        min-w-0
        space-y-5
      "
    >
      {/* ===================================================
          PRIMARY OVERVIEW
      =================================================== */}

      <div
        className="
          grid
          min-w-0
          gap-5
          xl:grid-cols-[1.4fr_0.8fr]
        "
      >
        <NextPaymentCard
          record={nextPayment}
          onRecordPayment={
            onRecordPayment
          }
        />

        <DebtHealthCard
          metrics={
            healthMetrics
          }
        />
      </div>

      {/* ===================================================
          QUICK ACTIONS + RECENT RECORDS
      =================================================== */}

      <div
        className="
          grid
          min-w-0
          gap-5
          xl:grid-cols-[0.7fr_1.5fr]
        "
      >
        <QuickActionsCard
          onAddDebt={onAddDebt}
          onOpenHistory={
            onOpenHistory
          }
          onViewLoans={
            onViewLoans
          }
          onViewBorrowed={
            onViewBorrowed
          }
          onViewLent={
            onViewLent
          }
        />

        <RecentRecords
          records={
            recentRecords
          }
          onRecordPayment={
            onRecordPayment
          }
          onViewLoans={
            onViewLoans
          }
        />
      </div>
    </div>
  );
}

export default DebtOverview;