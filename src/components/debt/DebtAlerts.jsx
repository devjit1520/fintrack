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
   ALERT CONFIG
========================================================= */

function getAlertInfo(record) {
  const days =
    getDaysUntilDue(
      record.nextDueDate
    );

  /* -------------------------------------------------------
     OVERDUE
  -------------------------------------------------------- */

  if (
    record.status === "overdue" ||
    (days !== null && days < 0)
  ) {
    const overdueDays =
      days !== null
        ? Math.abs(days)
        : 0;

    return {
      priority: 1,

      type: "overdue",

      label: "Overdue",

      message:
        overdueDays > 0
          ? `Overdue by ${overdueDays} ${
              overdueDays === 1
                ? "day"
                : "days"
            }`
          : "Payment is overdue",

      icon: AlertTriangle,

      containerClasses: `
        border-rose-500/20
        bg-rose-500/[0.045]
        hover:border-rose-500/30
        dark:bg-rose-500/[0.055]
      `,

      iconClasses: `
        bg-rose-500/10
        text-rose-600
        dark:text-rose-300
      `,

      badgeClasses: `
        border-rose-500/20
        bg-rose-500/10
        text-rose-600
        dark:text-rose-300
      `,

      valueClasses: `
        text-rose-600
        dark:text-rose-300
      `,
    };
  }

  /* -------------------------------------------------------
     DUE TODAY
  -------------------------------------------------------- */

  if (days === 0) {
    return {
      priority: 2,

      type: "today",

      label: "Due Today",

      message:
        "Payment requires attention today",

      icon: Clock3,

      containerClasses: `
        border-orange-500/20
        bg-orange-500/[0.045]
        hover:border-orange-500/30
        dark:bg-orange-500/[0.055]
      `,

      iconClasses: `
        bg-orange-500/10
        text-orange-600
        dark:text-orange-300
      `,

      badgeClasses: `
        border-orange-500/20
        bg-orange-500/10
        text-orange-600
        dark:text-orange-300
      `,

      valueClasses: `
        text-orange-600
        dark:text-orange-300
      `,
    };
  }

  /* -------------------------------------------------------
     DUE SOON
  -------------------------------------------------------- */

  if (
    days !== null &&
    days > 0 &&
    days <= 7
  ) {
    return {
      priority: 3,

      type: "soon",

      label: "Due Soon",

      message: `Due in ${days} ${
        days === 1
          ? "day"
          : "days"
      }`,

      icon: CalendarClock,

      containerClasses: `
        border-amber-500/20
        bg-amber-500/[0.04]
        hover:border-amber-500/30
        dark:bg-amber-500/[0.05]
      `,

      iconClasses: `
        bg-amber-500/10
        text-amber-600
        dark:text-amber-300
      `,

      badgeClasses: `
        border-amber-500/20
        bg-amber-500/10
        text-amber-600
        dark:text-amber-300
      `,

      valueClasses: `
        text-amber-600
        dark:text-amber-300
      `,
    };
  }

  return null;
}

/* =========================================================
   ALERT SUMMARY ITEM
========================================================= */

function AlertSummaryItem({
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
   ALERT CARD
========================================================= */

function DebtAlertCard({
  record,
  alert,
  index,
  onRecordPayment,
}) {
  const AlertIcon =
    alert.icon;

  const receivable =
    record.direction ===
    "receivable";

  const remaining =
    calculateRemainingAmount(
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
          Math.min(index, 6) *
          0.04,
      }}
      className={`
        group
        relative
        min-w-0
        overflow-hidden
        rounded-[22px]
        border
        p-4
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-md
        ${alert.containerClasses}
      `}
    >
      {/* ===================================================
          SOFT BACKGROUND GLOW
      =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-36
          w-36
          rounded-full
          bg-white/[0.25]
          blur-[60px]
          dark:bg-white/[0.02]
        "
      />

      <div className="relative">
        {/* =================================================
            TOP AREA
        ================================================== */}

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
            {/* Alert icon */}

            <div
              className={`
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                ${alert.iconClasses}
              `}
            >
              <AlertIcon
                size={18}
              />
            </div>

            {/* Record information */}

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
                    rounded-full
                    border
                    px-2.5
                    py-1
                    text-[8px]
                    font-black
                    ${alert.badgeClasses}
                  `}
                >
                  {alert.label}
                </span>
              </div>

              <p
                className={`
                  mt-1.5
                  text-[10px]
                  font-bold
                  ${alert.valueClasses}
                `}
              >
                {alert.message}
              </p>

              {/* Meta */}

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

          {/* Direction badge */}

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

        {/* =================================================
            FINANCIAL DETAILS
        ================================================== */}

        <div
          className="
            mt-4
            grid
            min-w-0
            gap-3
            sm:grid-cols-2
          "
        >
          {/* Remaining */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200/70
              bg-white/60
              px-3.5
              py-3
              dark:border-white/[0.06]
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
              Remaining Balance
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
              border-slate-200/70
              bg-white/60
              px-3.5
              py-3
              dark:border-white/[0.06]
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
        </div>

        {/* =================================================
            ACTION
        ================================================== */}

        <div
          className="
            mt-4
            flex
            flex-col
            gap-3
            border-t
            border-slate-200/60
            pt-4
            dark:border-white/[0.06]
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p
            className="
              text-[9px]
              leading-4
              text-slate-500
              dark:text-slate-400
            "
          >
            {receivable
              ? "Record the repayment when you receive this money."
              : "Record your payment to update the outstanding balance."}
          </p>

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
   HEALTHY EMPTY STATE
========================================================= */

function NoDebtAlerts({
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
        border-emerald-500/15
        bg-emerald-500/[0.035]
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
          bg-emerald-500/[0.08]
          blur-[80px]
        "
      />

      <div
        className="
          relative
          flex
          min-h-[190px]
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
            shadow-lg
            shadow-emerald-500/10
            dark:text-emerald-300
          "
        >
          <ShieldCheck
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
          No urgent payment alerts
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
          You currently have no overdue
          payments or debt records due
          within the next seven days.
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
          <CheckCircle2
            size={13}
          />

          Payment schedule healthy
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
   LOADING SKELETON
========================================================= */

function DebtAlertsSkeleton() {
  return (
    <div className="space-y-4">
      <div
        className="
          grid
          gap-3
          sm:grid-cols-3
        "
      >
        {Array.from({
          length: 3,
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
        length: 2,
      }).map((_, index) => (
        <div
          key={index}
          className="
            h-[245px]
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
   DEBT ALERTS
========================================================= */

function DebtAlerts({
  limit = 5,
  onAddDebt,
  onRecordPayment,
  onViewAll,
}) {
  const {
    debts,
    loading,
  } = useDebt();

  /* =======================================================
     BUILD ALERT LIST
  ======================================================= */

  const alerts =
    useMemo(() => {
      const records =
        Array.isArray(debts)
          ? debts
          : [];

      return records
        .map((record) =>
          normalizeDebtRecord(
            record
          )
        )
        .filter(
          (record) =>
            record.status !==
              "completed" &&
            record.nextDueDate
        )
        .map((record) => {
          const alert =
            getAlertInfo(
              record
            );

          if (!alert) {
            return null;
          }

          return {
            record,
            alert,
          };
        })
        .filter(Boolean)
        .sort(
          (first, second) => {
            /* ---------------------------------------------
               PRIORITY FIRST
            ---------------------------------------------- */

            if (
              first.alert
                .priority !==
              second.alert
                .priority
            ) {
              return (
                first.alert
                  .priority -
                second.alert
                  .priority
              );
            }

            /* ---------------------------------------------
               THEN DATE
            ---------------------------------------------- */

            const firstDate =
              new Date(
                first.record
                  .nextDueDate
              ).getTime();

            const secondDate =
              new Date(
                second.record
                  .nextDueDate
              ).getTime();

            return (
              firstDate -
              secondDate
            );
          }
        );
    }, [debts]);

  /* =======================================================
     COUNTS
  ======================================================= */

  const counts =
    useMemo(() => {
      return alerts.reduce(
        (result, item) => {
          if (
            item.alert.type ===
            "overdue"
          ) {
            result.overdue += 1;
          }

          if (
            item.alert.type ===
            "today"
          ) {
            result.today += 1;
          }

          if (
            item.alert.type ===
            "soon"
          ) {
            result.soon += 1;
          }

          return result;
        },
        {
          overdue: 0,
          today: 0,
          soon: 0,
        }
      );
    }, [alerts]);

  /* =======================================================
     VISIBLE ALERTS
  ======================================================= */

  const visibleAlerts =
    useMemo(() => {
      if (
        !Number.isFinite(limit) ||
        limit <= 0
      ) {
        return alerts;
      }

      return alerts.slice(
        0,
        limit
      );
    }, [alerts, limit]);

  if (loading) {
    return (
      <DebtAlertsSkeleton />
    );
  }

  if (alerts.length === 0) {
    return (
      <NoDebtAlerts
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
          ALERT SUMMARY
      =================================================== */}

      <div
        className="
          grid
          min-w-0
          gap-3
          sm:grid-cols-3
        "
      >
        <AlertSummaryItem
          label="Overdue"
          value={counts.overdue}
          icon={AlertTriangle}
          classes="
            bg-rose-500/10
            text-rose-600
            dark:text-rose-300
          "
        />

        <AlertSummaryItem
          label="Due Today"
          value={counts.today}
          icon={Clock3}
          classes="
            bg-orange-500/10
            text-orange-600
            dark:text-orange-300
          "
        />

        <AlertSummaryItem
          label="Due Soon"
          value={counts.soon}
          icon={CalendarClock}
          classes="
            bg-amber-500/10
            text-amber-600
            dark:text-amber-300
          "
        />
      </div>

      {/* ===================================================
          IMPORTANT OVERDUE WARNING
      =================================================== */}

      {counts.overdue > 0 && (
        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            flex
            min-w-0
            items-start
            gap-3
            rounded-2xl
            border
            border-rose-500/20
            bg-rose-500/[0.06]
            px-4
            py-3.5
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
              bg-rose-500/10
              text-rose-600
              dark:text-rose-300
            "
          >
            <AlertTriangle
              size={16}
            />
          </div>

          <div className="min-w-0">
            <p
              className="
                text-[11px]
                font-black
                text-rose-700
                dark:text-rose-300
              "
            >
              {counts.overdue} overdue{" "}
              {counts.overdue === 1
                ? "record needs"
                : "records need"}{" "}
              attention
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
              Review overdue repayments
              first to keep your debt
              schedule accurate.
            </p>
          </div>
        </motion.div>
      )}

      {/* ===================================================
          ALERT RECORDS
      =================================================== */}

      <div
        className="
          min-w-0
          space-y-3
        "
      >
        {visibleAlerts.map(
          (
            {
              record,
              alert,
            },
            index
          ) => (
            <DebtAlertCard
              key={record.id}
              record={record}
              alert={alert}
              index={index}
              onRecordPayment={
                onRecordPayment
              }
            />
          )
        )}
      </div>

      {/* ===================================================
          VIEW MORE
      =================================================== */}

      {alerts.length >
        visibleAlerts.length && (
        <div
          className="
            flex
            justify-center
            pt-1
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
              bg-white
              px-4
              py-2
              text-[10px]
              font-black
              text-slate-600
              transition
              hover:border-blue-500/25
              hover:bg-blue-500/[0.05]
              hover:text-blue-600
              dark:border-white/[0.08]
              dark:bg-white/[0.035]
              dark:text-slate-400
              dark:hover:text-blue-300
            "
          >
            View all {alerts.length} alerts

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
  );
}

export default DebtAlerts;