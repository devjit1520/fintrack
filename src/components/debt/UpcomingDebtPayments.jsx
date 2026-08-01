import { useMemo } from "react";

import { motion } from "framer-motion";

import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  HandCoins,
  Plus,
  ReceiptText,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import useDebt from "../../hooks/useDebt";

import {
  calculateRemainingAmount,
  formatDebtCurrency,
  formatDebtDate,
  getDaysUntilDue,
  getDebtTypeLabel,
  normalizeDebtRecord,
} from "../../utils/debtCalculations";

/* =========================================================
   SAFE NUMBER
========================================================= */

function toNumber(value) {
  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

/* =========================================================
   SAFE TIMESTAMP
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
   PAYMENT STATUS
========================================================= */

function getPaymentStatus(record) {
  const days =
    getDaysUntilDue(
      record.nextDueDate
    );

  if (
    record.status === "overdue" ||
    (days !== null && days < 0)
  ) {
    return {
      id: "overdue",
      label: "Overdue",
      priority: 1,
      icon: AlertTriangle,

      badgeClasses: `
        border-rose-500/20
        bg-rose-500/10
        text-rose-600
        dark:text-rose-300
      `,

      iconClasses: `
        bg-rose-500/10
        text-rose-600
        dark:text-rose-300
      `,
    };
  }

  if (days === 0) {
    return {
      id: "today",
      label: "Due Today",
      priority: 2,
      icon: Clock3,

      badgeClasses: `
        border-orange-500/20
        bg-orange-500/10
        text-orange-600
        dark:text-orange-300
      `,

      iconClasses: `
        bg-orange-500/10
        text-orange-600
        dark:text-orange-300
      `,
    };
  }

  if (
    days !== null &&
    days > 0 &&
    days <= 7
  ) {
    return {
      id: "week",
      label: "Next 7 Days",
      priority: 3,
      icon: CalendarClock,

      badgeClasses: `
        border-amber-500/20
        bg-amber-500/10
        text-amber-600
        dark:text-amber-300
      `,

      iconClasses: `
        bg-amber-500/10
        text-amber-600
        dark:text-amber-300
      `,
    };
  }

  return {
    id: "month",
    label: "Next 30 Days",
    priority: 4,
    icon: CalendarCheck2,

    badgeClasses: `
      border-blue-500/20
      bg-blue-500/10
      text-blue-600
      dark:text-blue-300
    `,

    iconClasses: `
      bg-blue-500/10
      text-blue-600
      dark:text-blue-300
    `,
  };
}

/* =========================================================
   DUE DESCRIPTION
========================================================= */

function getDueDescription(date) {
  if (!date) {
    return "No due date";
  }

  const days =
    getDaysUntilDue(date);

  if (days === null) {
    return "No due date";
  }

  if (days < 0) {
    const count =
      Math.abs(days);

    return `Overdue by ${count} ${
      count === 1
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
   EXPECTED PAYMENT AMOUNT
========================================================= */

function getExpectedPaymentAmount(
  record
) {
  const remaining =
    calculateRemainingAmount(
      record
    );

  const installment =
    toNumber(
      record.installmentAmount
    );

  if (installment > 0) {
    return Math.min(
      installment,
      remaining
    );
  }

  return remaining;
}

/* =========================================================
   SUMMARY ITEM
========================================================= */

function ScheduleSummary({
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
        px-3.5
        py-3
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
            mt-0.5
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
   PAYMENT ROW
========================================================= */

function PaymentRow({
  record,
  index,
  onRecordPayment,
}) {
  const status =
    getPaymentStatus(
      record
    );

  const StatusIcon =
    status.icon;

  const receivable =
    record.direction ===
    "receivable";

  const remaining =
    calculateRemainingAmount(
      record
    );

  const paymentAmount =
    getExpectedPaymentAmount(
      record
    );

  return (
    <motion.article
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
        delay:
          Math.min(index, 7) *
          0.035,
      }}
      className="
        group
        relative
        min-w-0
        overflow-hidden
        rounded-[22px]
        border
        border-slate-200/80
        bg-white
        p-4
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-blue-500/20
        hover:shadow-md
        dark:border-white/[0.07]
        dark:bg-white/[0.025]
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
          blur-[70px]
          ${
            receivable
              ? "bg-emerald-500/[0.05]"
              : "bg-blue-500/[0.05]"
          }
        `}
      />

      <div className="relative">
        {/* ===============================================
            HEADER
        ================================================ */}

        <div
          className="
            flex
            min-w-0
            flex-col
            gap-4
            lg:flex-row
            lg:items-center
          "
        >
          {/* Main information */}

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
                h-11
                w-11
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
                    : status.iconClasses
                }
              `}
            >
              {receivable ? (
                <HandCoins
                  size={18}
                />
              ) : (
                <StatusIcon
                  size={18}
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
                <h4
                  className="
                    break-words
                    text-sm
                    font-black
                    text-slate-950
                    dark:text-white
                  "
                >
                  {record.title ||
                    "Untitled Debt"}
                </h4>

                <span
                  className={`
                    inline-flex
                    items-center
                    gap-1
                    rounded-full
                    border
                    px-2.5
                    py-1
                    text-[8px]
                    font-black
                    ${status.badgeClasses}
                  `}
                >
                  <StatusIcon
                    size={10}
                  />

                  {status.label}
                </span>
              </div>

              <div
                className="
                  mt-2
                  flex
                  min-w-0
                  flex-wrap
                  items-center
                  gap-x-4
                  gap-y-1.5
                "
              >
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    text-[9px]
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  <ReceiptText
                    size={11}
                  />

                  {getDebtTypeLabel(
                    record.type
                  )}
                </span>

                <span
                  className="
                    inline-flex
                    min-w-0
                    items-center
                    gap-1.5
                    text-[9px]
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  <UserRound
                    size={11}
                  />

                  <span className="truncate">
                    {record.partyName ||
                      "No person or institution"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Direction */}

          <span
            className={`
              inline-flex
              w-fit
              shrink-0
              items-center
              gap-1.5
              rounded-full
              border
              px-2.5
              py-1.5
              text-[8px]
              font-black
              ${
                receivable
                  ? `
                    border-emerald-500/20
                    bg-emerald-500/10
                    text-emerald-600
                    dark:text-emerald-300
                  `
                  : `
                    border-rose-500/20
                    bg-rose-500/10
                    text-rose-600
                    dark:text-rose-300
                  `
              }
            `}
          >
            {receivable ? (
              <ArrowDownLeft
                size={11}
              />
            ) : (
              <ArrowUpRight
                size={11}
              />
            )}

            {receivable
              ? "Receivable"
              : "Payable"}
          </span>
        </div>

        {/* ===============================================
            PAYMENT INFORMATION
        ================================================ */}

        <div
          className="
            mt-4
            grid
            min-w-0
            gap-3
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          {/* Payment amount */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200/80
              bg-slate-50/70
              p-3.5
              dark:border-white/[0.07]
              dark:bg-black/[0.08]
            "
          >
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
              {receivable
                ? "Expected Receipt"
                : "Expected Payment"}
            </p>

            <p
              className={`
                mt-1.5
                truncate
                text-sm
                font-black
                ${
                  receivable
                    ? `
                      text-emerald-600
                      dark:text-emerald-300
                    `
                    : `
                      text-blue-600
                      dark:text-blue-300
                    `
                }
              `}
            >
              {formatDebtCurrency(
                paymentAmount
              )}
            </p>
          </div>

          {/* Remaining */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200/80
              bg-slate-50/70
              p-3.5
              dark:border-white/[0.07]
              dark:bg-black/[0.08]
            "
          >
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
              Remaining
            </p>

            <p
              className="
                mt-1.5
                truncate
                text-sm
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

          {/* Due date */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200/80
              bg-slate-50/70
              p-3.5
              dark:border-white/[0.07]
              dark:bg-black/[0.08]
            "
          >
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
              Due Date
            </p>

            <p
              className="
                mt-1.5
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

          {/* Due information */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200/80
              bg-slate-50/70
              p-3.5
              dark:border-white/[0.07]
              dark:bg-black/[0.08]
            "
          >
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
              Schedule
            </p>

            <p
              className="
                mt-1.5
                truncate
                text-sm
                font-black
                text-slate-950
                dark:text-white
              "
            >
              {getDueDescription(
                record.nextDueDate
              )}
            </p>
          </div>
        </div>

        {/* ===============================================
            ACTION
        ================================================ */}

        <div
          className="
            mt-4
            flex
            min-w-0
            flex-col
            gap-3
            border-t
            border-slate-200/80
            pt-4
            dark:border-white/[0.06]
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
              text-[9px]
              text-slate-500
              dark:text-slate-400
            "
          >
            <CalendarClock
              size={12}
            />

            {getDueDescription(
              record.nextDueDate
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
              min-h-10
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              px-4
              py-2
              text-[10px]
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
                    shadow-blue-500/15
                  `
              }
            `}
          >
            {receivable ? (
              <>
                <HandCoins
                  size={14}
                />

                Record Received
              </>
            ) : (
              <>
                <Banknote
                  size={14}
                />

                Record Payment
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyUpcomingPayments({
  onAddDebt,
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
      className="
        relative
        min-w-0
        overflow-hidden
        rounded-[28px]
        border
        border-blue-500/15
        bg-blue-500/[0.035]
        p-6
        sm:p-8
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
          bg-cyan-500/[0.08]
          blur-[80px]
        "
      />

      <div
        className="
          relative
          flex
          min-h-[200px]
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
            border-blue-500/20
            bg-blue-500/10
            text-blue-600
            shadow-lg
            shadow-blue-500/10
            dark:text-blue-300
          "
        >
          <CalendarCheck2
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
          No upcoming payments
        </h3>

        <p
          className="
            mt-2
            max-w-lg
            text-xs
            leading-5
            text-slate-500
            dark:text-slate-400
          "
        >
          You currently have no debt
          payments or repayments scheduled
          within the next 30 days.
        </p>

        <div
          className="
            mt-4
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-emerald-500/20
            bg-emerald-500/10
            px-3
            py-2
            text-[9px]
            font-black
            text-emerald-600
            dark:text-emerald-300
          "
        >
          <ShieldCheck size={13} />

          Schedule clear
        </div>

        {onAddDebt && (
          <button
            type="button"
            onClick={onAddDebt}
            className="
              mt-5
              inline-flex
              min-h-10
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-2
              text-[10px]
              font-black
              text-slate-600
              transition
              hover:border-blue-500/25
              hover:text-blue-600
              dark:border-white/[0.08]
              dark:bg-white/[0.04]
              dark:text-slate-300
              dark:hover:text-blue-300
            "
          >
            <Plus size={13} />

            Add Debt Record
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* =========================================================
   LOADING
========================================================= */

function UpcomingPaymentsSkeleton() {
  return (
    <div className="space-y-4">
      <div
        className="
          grid
          gap-3
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div
            key={index}
            className="
              h-16
              animate-pulse
              rounded-2xl
              bg-slate-200
              dark:bg-white/[0.05]
            "
          />
        ))}
      </div>

      {Array.from({
        length: 3,
      }).map((_, index) => (
        <div
          key={index}
          className="
            h-[240px]
            animate-pulse
            rounded-[22px]
            bg-slate-200
            dark:bg-white/[0.05]
          "
        />
      ))}
    </div>
  );
}

/* =========================================================
   UPCOMING DEBT PAYMENTS
========================================================= */

function UpcomingDebtPayments({
  limit = 8,
  onAddDebt,
  onRecordPayment,
  onViewAll,
}) {
  const {
    debts,
    loading,
  } = useDebt();

  /* =======================================================
     BUILD PAYMENT SCHEDULE
  ======================================================= */

  const payments =
    useMemo(() => {
      const source =
        Array.isArray(debts)
          ? debts
          : [];

      return source
        .map((record) =>
          normalizeDebtRecord(
            record
          )
        )
        .filter((record) => {
          if (
            record.status ===
            "completed"
          ) {
            return false;
          }

          if (!record.nextDueDate) {
            return false;
          }

          const days =
            getDaysUntilDue(
              record.nextDueDate
            );

          if (days === null) {
            return false;
          }

          /*
            Keep:
            - overdue
            - today
            - next 30 days
          */

          return days <= 30;
        })
        .sort(
          (first, second) => {
            const firstStatus =
              getPaymentStatus(
                first
              );

            const secondStatus =
              getPaymentStatus(
                second
              );

            if (
              firstStatus.priority !==
              secondStatus.priority
            ) {
              return (
                firstStatus.priority -
                secondStatus.priority
              );
            }

            return (
              getTimestamp(
                first.nextDueDate
              ) -
              getTimestamp(
                second.nextDueDate
              )
            );
          }
        );
    }, [debts]);

  /* =======================================================
     COUNTS
  ======================================================= */

  const summary =
    useMemo(() => {
      return payments.reduce(
        (result, record) => {
          const status =
            getPaymentStatus(
              record
            );

          if (
            status.id ===
            "overdue"
          ) {
            result.overdue += 1;
          }

          if (
            status.id ===
            "today"
          ) {
            result.today += 1;
          }

          if (
            status.id ===
            "week"
          ) {
            result.week += 1;
          }

          if (
            status.id ===
            "month"
          ) {
            result.month += 1;
          }

          return result;
        },
        {
          overdue: 0,
          today: 0,
          week: 0,
          month: 0,
        }
      );
    }, [payments]);

  /* =======================================================
     VISIBLE RECORDS
  ======================================================= */

  const visiblePayments =
    useMemo(() => {
      if (
        !Number.isFinite(limit) ||
        limit <= 0
      ) {
        return payments;
      }

      return payments.slice(
        0,
        limit
      );
    }, [payments, limit]);

  if (loading) {
    return (
      <UpcomingPaymentsSkeleton />
    );
  }

  if (payments.length === 0) {
    return (
      <EmptyUpcomingPayments
        onAddDebt={onAddDebt}
      />
    );
  }

  return (
    <div
      className="
        min-w-0
        space-y-4
      "
    >
      {/* ===================================================
          SCHEDULE SUMMARY
      =================================================== */}

      <div
        className="
          grid
          min-w-0
          grid-cols-2
          gap-3
          xl:grid-cols-4
        "
      >
        <ScheduleSummary
          label="Overdue"
          value={summary.overdue}
          icon={AlertTriangle}
          classes="
            bg-rose-500/10
            text-rose-600
            dark:text-rose-300
          "
        />

        <ScheduleSummary
          label="Due Today"
          value={summary.today}
          icon={Clock3}
          classes="
            bg-orange-500/10
            text-orange-600
            dark:text-orange-300
          "
        />

        <ScheduleSummary
          label="Next 7 Days"
          value={summary.week}
          icon={CalendarClock}
          classes="
            bg-amber-500/10
            text-amber-600
            dark:text-amber-300
          "
        />

        <ScheduleSummary
          label="Next 30 Days"
          value={summary.month}
          icon={CalendarCheck2}
          classes="
            bg-blue-500/10
            text-blue-600
            dark:text-blue-300
          "
        />
      </div>

      {/* ===================================================
          PAYMENT SCHEDULE
      =================================================== */}

      <section
        className="
          relative
          min-w-0
          overflow-hidden
          rounded-[28px]
          border
          border-slate-200/80
          bg-white
          p-4
          shadow-sm
          dark:border-white/[0.08]
          dark:bg-[#0a1427]
          sm:p-5
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-56
            w-56
            rounded-full
            bg-blue-500/[0.06]
            blur-[90px]
          "
        />

        <div className="relative">
          {/* Header */}

          <div
            className="
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
                <CalendarClock
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
                  Payment schedule
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
                  Upcoming Debt Activity
                </h3>

                <p
                  className="
                    mt-1
                    text-[10px]
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {payments.length} scheduled{" "}
                  {payments.length === 1
                    ? "payment"
                    : "payments"}{" "}
                  need tracking.
                </p>
              </div>
            </div>

            <div
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                border-blue-500/20
                bg-blue-500/10
                px-3
                py-2
                text-[9px]
                font-black
                text-blue-600
                dark:text-blue-300
              "
            >
              <CalendarCheck2
                size={13}
              />

              30-day schedule
            </div>
          </div>

          {/* Records */}

          <div
            className="
              mt-5
              space-y-3
            "
          >
            {visiblePayments.map(
              (record, index) => (
                <PaymentRow
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

          {/* View all */}

          {payments.length >
            visiblePayments.length && (
            <div
              className="
                flex
                justify-center
                border-t
                border-slate-200/80
                pt-5
                dark:border-white/[0.07]
              "
            >
              <button
                type="button"
                onClick={() =>
                  onViewAll?.()
                }
                className="
                  group
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
                View all {payments.length} payments

                <ArrowRight
                  size={13}
                  className="
                    transition-transform
                    group-hover:translate-x-0.5
                  "
                />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default UpcomingDebtPayments;