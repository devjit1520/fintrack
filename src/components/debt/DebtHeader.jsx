import { useMemo } from "react";

import { motion } from "framer-motion";

import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  CalendarClock,
  CircleDollarSign,
  History,
  Landmark,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import useDebt from "../../hooks/useDebt";

import {
  calculateRemainingAmount,
  formatDebtCurrency,
  getDaysUntilDue,
  normalizeDebtRecord,
} from "../../utils/debtCalculations";

/* =========================================================
   HEADER METRIC
========================================================= */

function HeaderMetric({
  label,
  value,
  description,
  icon: Icon,
  classes,
  delay = 0,
}) {
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
        duration: 0.3,
        delay,
      }}
      className="
        min-w-0
        rounded-2xl
        border
        border-white/[0.08]
        bg-white/[0.055]
        p-3.5
        backdrop-blur-sm
        transition
        hover:bg-white/[0.075]
      "
    >
      <div
        className="
          flex
          items-start
          gap-3
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
              text-[8px]
              font-black
              uppercase
              tracking-[0.12em]
              text-slate-400
            "
          >
            {label}
          </p>

          <p
            className="
              mt-1
              truncate
              text-base
              font-black
              tracking-tight
              text-white
            "
          >
            {value}
          </p>

          <p
            className="
              mt-0.5
              truncate
              text-[8px]
              font-medium
              text-slate-500
            "
          >
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   HEADER ACTION
========================================================= */

function HeaderAction({
  icon: Icon,
  children,
  onClick,
  primary = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex
        min-h-11
        items-center
        justify-center
        gap-2
        rounded-2xl
        px-4
        py-2.5
        text-[10px]
        font-black
        transition-all
        duration-300
        focus:outline-none
        focus-visible:ring-4
        focus-visible:ring-blue-500/20

        ${
          primary
            ? `
              bg-gradient-to-r
              from-cyan-500
              via-blue-500
              to-violet-500
              text-white
              shadow-lg
              shadow-blue-500/20
              hover:-translate-y-0.5
              hover:shadow-xl
              hover:shadow-blue-500/25
            `
            : `
              border
              border-white/[0.09]
              bg-white/[0.055]
              text-slate-300
              backdrop-blur-sm
              hover:border-white/[0.14]
              hover:bg-white/[0.09]
              hover:text-white
            `
        }
      `}
    >
      <Icon size={15} />

      {children}
    </button>
  );
}

/* =========================================================
   DEBT HEADER
========================================================= */

function DebtHeader({
  onAddDebt,
  onOpenHistory,
}) {
  const {
    debts,
    loading,
  } = useDebt();

  /* =======================================================
     NORMALIZE RECORDS
  ======================================================= */

  const records =
    useMemo(() => {
      return (
        Array.isArray(debts)
          ? debts
          : []
      ).map((record) =>
        normalizeDebtRecord(
          record
        )
      );
    }, [debts]);

  /* =======================================================
     HEADER METRICS
  ======================================================= */

  const metrics =
    useMemo(() => {
      return records.reduce(
        (result, record) => {
          const remaining =
            calculateRemainingAmount(
              record
            );

          const completed =
            record.status ===
            "completed";

          if (completed) {
            return result;
          }

          if (
            record.direction ===
            "receivable"
          ) {
            result.receivable +=
              remaining;
          } else {
            result.payable +=
              remaining;
          }

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
          } else if (
            days !== null &&
            days >= 0 &&
            days <= 7
          ) {
            result.dueSoon += 1;
          }

          return result;
        },
        {
          payable: 0,
          receivable: 0,
          overdue: 0,
          dueSoon: 0,
        }
      );
    }, [records]);

  /* =======================================================
     HEALTH STATUS
  ======================================================= */

  const healthStatus =
    useMemo(() => {
      if (metrics.overdue > 0) {
        return {
          label:
            "Needs attention",

          description:
            `${metrics.overdue} overdue ${
              metrics.overdue === 1
                ? "record"
                : "records"
            }`,

          icon:
            AlertTriangle,

          classes: `
            border-rose-400/20
            bg-rose-500/10
            text-rose-300
          `,
        };
      }

      if (
        metrics.dueSoon > 0
      ) {
        return {
          label:
            "Payments approaching",

          description:
            `${metrics.dueSoon} due within 7 days`,

          icon:
            CalendarClock,

          classes: `
            border-amber-400/20
            bg-amber-500/10
            text-amber-300
          `,
        };
      }

      return {
        label:
          "Schedule healthy",

        description:
          "No urgent payments",

        icon:
          ShieldCheck,

        classes: `
          border-emerald-400/20
          bg-emerald-500/10
          text-emerald-300
        `,
      };
    }, [metrics]);

  const HealthIcon =
    healthStatus.icon;

  return (
    <motion.header
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
        rounded-[30px]
        border
        border-slate-200/80
        bg-gradient-to-br
        from-[#09182c]
        via-[#0a1830]
        to-[#181832]
        shadow-xl
        shadow-slate-950/10
        dark:border-white/[0.08]
      "
    >
      {/* ===================================================
          DECORATIVE BACKGROUND
      =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-28
          -top-32
          h-80
          w-80
          rounded-full
          bg-blue-500/[0.16]
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-36
          left-1/4
          h-72
          w-72
          rounded-full
          bg-violet-500/[0.13]
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-48
          w-48
          rounded-full
          bg-cyan-500/[0.06]
          blur-[100px]
        "
      />

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div
        className="
          relative
          p-5
          sm:p-6
          lg:p-7
        "
      >
        {/* =================================================
            TOP SECTION
        ================================================== */}

        <div
          className="
            flex
            min-w-0
            flex-col
            gap-6
            lg:flex-row
            lg:items-start
            lg:justify-between
          "
        >
          {/* Title */}

          <div
            className="
              min-w-0
              max-w-2xl
            "
          >
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-cyan-400/15
                bg-cyan-400/[0.07]
                px-3
                py-1.5
                text-[9px]
                font-black
                uppercase
                tracking-[0.14em]
                text-cyan-300
              "
            >
              <Sparkles size={11} />

              Liability command center
            </div>

            <div
              className="
                mt-5
                flex
                min-w-0
                items-start
                gap-4
              "
            >
              <div
                className="
                  hidden
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-[20px]
                  border
                  border-blue-400/15
                  bg-gradient-to-br
                  from-cyan-500/15
                  via-blue-500/15
                  to-violet-500/15
                  text-blue-300
                  shadow-lg
                  shadow-blue-500/10
                  sm:flex
                "
              >
                <Landmark
                  size={24}
                />
              </div>

              <div className="min-w-0">
                <h1
                  className="
                    text-2xl
                    font-black
                    tracking-[-0.04em]
                    text-white
                    sm:text-3xl
                    lg:text-[34px]
                  "
                >
                  Debt Center
                </h1>

                <p
                  className="
                    mt-2
                    max-w-xl
                    text-[11px]
                    leading-5
                    text-slate-400
                    sm:text-xs
                    sm:leading-6
                  "
                >
                  Manage loans, EMIs,
                  personal borrowing and
                  money lent from one
                  organized financial
                  workspace.
                </p>
              </div>
            </div>

            {/* Health */}

            <div
              className={`
                mt-5
                inline-flex
                items-center
                gap-3
                rounded-2xl
                border
                px-3.5
                py-2.5
                ${healthStatus.classes}
              `}
            >
              <HealthIcon
                size={15}
              />

              <div>
                <p
                  className="
                    text-[9px]
                    font-black
                  "
                >
                  {healthStatus.label}
                </p>

                <p
                  className="
                    mt-0.5
                    text-[8px]
                    font-medium
                    text-slate-400
                  "
                >
                  {
                    healthStatus.description
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}

          <div
            className="
              flex
              w-full
              flex-col
              gap-2
              sm:w-auto
              sm:flex-row
              lg:justify-end
            "
          >
            <HeaderAction
              icon={History}
              onClick={
                onOpenHistory
              }
            >
              Payment History
            </HeaderAction>

            <HeaderAction
              icon={Plus}
              onClick={onAddDebt}
              primary
            >
              Add Debt Record
            </HeaderAction>
          </div>
        </div>

        {/* =================================================
            DIVIDER
        ================================================== */}

        <div
          className="
            my-6
            h-px
            bg-gradient-to-r
            from-transparent
            via-white/[0.09]
            to-transparent
          "
        />

        {/* =================================================
            FINANCIAL METRICS
        ================================================== */}

        <div
          className="
            grid
            min-w-0
            grid-cols-2
            gap-3
            xl:grid-cols-4
          "
        >
          <HeaderMetric
            label="Total Payable"
            value={
              loading
                ? "—"
                : formatDebtCurrency(
                    metrics.payable
                  )
            }
            description="Outstanding liabilities"
            icon={ArrowUpRight}
            classes="
              bg-rose-500/10
              text-rose-300
            "
            delay={0.05}
          />

          <HeaderMetric
            label="Receivable"
            value={
              loading
                ? "—"
                : formatDebtCurrency(
                    metrics.receivable
                  )
            }
            description="Money to collect"
            icon={ArrowDownLeft}
            classes="
              bg-emerald-500/10
              text-emerald-300
            "
            delay={0.1}
          />

          <HeaderMetric
            label="Overdue"
            value={
              loading
                ? "—"
                : metrics.overdue
            }
            description="Needs attention"
            icon={
              AlertTriangle
            }
            classes="
              bg-amber-500/10
              text-amber-300
            "
            delay={0.15}
          />

          <HeaderMetric
            label="Due Soon"
            value={
              loading
                ? "—"
                : metrics.dueSoon
            }
            description="Within 7 days"
            icon={CalendarClock}
            classes="
              bg-blue-500/10
              text-blue-300
            "
            delay={0.2}
          />
        </div>

        {/* =================================================
            BOTTOM INFO
        ================================================== */}

        <div
          className="
            mt-5
            flex
            min-w-0
            flex-col
            gap-3
            rounded-2xl
            border
            border-white/[0.07]
            bg-black/[0.08]
            px-4
            py-3
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
              gap-2
            "
          >
            <CircleDollarSign
              size={14}
              className="
                shrink-0
                text-cyan-300
              "
            />

            <p
              className="
                text-[9px]
                leading-4
                text-slate-400
              "
            >
              Track every liability and
              receivable without mixing
              them with normal expenses.
            </p>
          </div>

          <span
            className="
              shrink-0
              text-[8px]
              font-black
              uppercase
              tracking-[0.12em]
              text-slate-500
            "
          >
            {records.length}{" "}
            {records.length === 1
              ? "record"
              : "records"}{" "}
            tracked
          </span>
        </div>
      </div>
    </motion.header>
  );
}

export default DebtHeader;