import { useMemo } from "react";

import { motion } from "framer-motion";

import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  HandCoins,
  Landmark,
  Scale,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import useDebt from "../../hooks/useDebt";

import {
  calculatePaidAmount,
  calculateRemainingAmount,
  formatDebtCurrency,
  normalizeDebtRecord,
} from "../../utils/debtCalculations";

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconClasses,
  valueClasses = "",
  badge,
  delay = 0,
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
        duration: 0.35,
        delay,
        ease: "easeOut",
      }}
      className="
        group
        relative
        min-w-0
        overflow-hidden
        rounded-[24px]
        border
        border-slate-200/80
        bg-white
        p-5
        shadow-sm
        transition
        duration-300
        hover:-translate-y-0.5
        hover:shadow-lg
        dark:border-white/[0.08]
        dark:bg-[#0b1629]
      "
    >
      {/* Background glow */}

      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-36
          w-36
          rounded-full
          bg-blue-500/[0.05]
          blur-[60px]
          transition
          group-hover:bg-blue-500/[0.09]
        "
      />

      <div className="relative">
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
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              ${iconClasses}
            `}
          >
            <Icon size={19} />
          </div>

          {badge && (
            <span
              className="
                inline-flex
                shrink-0
                items-center
                rounded-full
                border
                border-slate-200
                bg-slate-50
                px-2.5
                py-1
                text-[9px]
                font-black
                text-slate-500
                dark:border-white/[0.08]
                dark:bg-white/[0.04]
                dark:text-slate-400
              "
            >
              {badge}
            </span>
          )}
        </div>

        <p
          className="
            mt-5
            text-[9px]
            font-black
            uppercase
            tracking-[0.13em]
            text-slate-500
            dark:text-slate-400
          "
        >
          {title}
        </p>

        <p
          className={`
            mt-2
            truncate
            text-2xl
            font-black
            tracking-tight
            text-slate-950
            dark:text-white
            ${valueClasses}
          `}
        >
          {value}
        </p>

        <p
          className="
            mt-2
            text-[10px]
            leading-5
            text-slate-500
            dark:text-slate-400
          "
        >
          {description}
        </p>
      </div>
    </motion.article>
  );
}

/* =========================================================
   STATUS ITEM
========================================================= */

function StatusItem({
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
            truncate
            text-[9px]
            font-bold
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
   POSITION BAR
========================================================= */

function PositionBar({
  payable,
  receivable,
}) {
  const combined =
    payable + receivable;

  const payablePercent =
    combined > 0
      ? Math.round(
          (payable / combined) * 100
        )
      : 0;

  const receivablePercent =
    combined > 0
      ? 100 - payablePercent
      : 0;

  return (
    <div className="mt-5">
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              h-2.5
              w-2.5
              rounded-full
              bg-rose-500
            "
          />

          <span
            className="
              text-[10px]
              font-bold
              text-slate-500
              dark:text-slate-400
            "
          >
            Payable {payablePercent}%
          </span>
        </div>

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              h-2.5
              w-2.5
              rounded-full
              bg-emerald-500
            "
          />

          <span
            className="
              text-[10px]
              font-bold
              text-slate-500
              dark:text-slate-400
            "
          >
            Receivable {receivablePercent}%
          </span>
        </div>
      </div>

      <div
        className="
          mt-3
          flex
          h-2.5
          overflow-hidden
          rounded-full
          bg-slate-200
          dark:bg-white/[0.07]
        "
      >
        {combined > 0 ? (
          <>
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: `${payablePercent}%`,
              }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
              }}
              className="
                h-full
                bg-gradient-to-r
                from-rose-500
                to-orange-500
              "
            />

            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: `${receivablePercent}%`,
              }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
              }}
              className="
                h-full
                bg-gradient-to-r
                from-emerald-500
                to-cyan-500
              "
            />
          </>
        ) : (
          <div
            className="
              h-full
              w-full
              bg-slate-300
              dark:bg-white/[0.08]
            "
          />
        )}
      </div>
    </div>
  );
}

/* =========================================================
   POSITION CARD
========================================================= */

function DebtPositionCard({
  payable,
  receivable,
  activeCount,
  overdueCount,
  completedCount,
}) {
  const netPosition =
    receivable - payable;

  const positive =
    netPosition >= 0;

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 16,
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
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-64
          w-64
          rounded-full
          bg-violet-500/[0.07]
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
          bg-cyan-500/[0.06]
          blur-[100px]
        "
      />

      <div className="relative">
        <div
          className="
            flex
            min-w-0
            flex-col
            gap-5
            xl:flex-row
            xl:items-start
            xl:justify-between
          "
        >
          <div className="min-w-0">
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
                  rounded-2xl
                  bg-violet-500/10
                  text-violet-600
                  dark:text-violet-300
                "
              >
                <Scale size={19} />
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
                  Balance comparison
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
                  Debt Position
                </h3>
              </div>
            </div>

            <p
              className="
                mt-4
                max-w-xl
                text-xs
                leading-5
                text-slate-500
                dark:text-slate-400
              "
            >
              Compare outstanding money
              you owe with money that
              others still owe you.
            </p>
          </div>

          <div
            className="
              min-w-0
              rounded-2xl
              border
              border-slate-200/80
              bg-slate-50/70
              px-5
              py-4
              dark:border-white/[0.07]
              dark:bg-white/[0.025]
              xl:min-w-[260px]
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <div>
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-wide
                    text-slate-500
                  "
                >
                  Net Debt Position
                </p>

                <p
                  className={`
                    mt-2
                    text-xl
                    font-black
                    ${
                      positive
                        ? `
                          text-emerald-600
                          dark:text-emerald-300
                        `
                        : `
                          text-rose-600
                          dark:text-rose-300
                        `
                    }
                  `}
                >
                  {positive ? "+" : "-"}
                  {formatDebtCurrency(
                    Math.abs(netPosition)
                  )}
                </p>
              </div>

              <div
                className={`
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  ${
                    positive
                      ? `
                        bg-emerald-500/10
                        text-emerald-600
                        dark:text-emerald-300
                      `
                      : `
                        bg-rose-500/10
                        text-rose-600
                        dark:text-rose-300
                      `
                  }
                `}
              >
                {positive ? (
                  <TrendingUp size={17} />
                ) : (
                  <TrendingDown size={17} />
                )}
              </div>
            </div>

            <p
              className="
                mt-2
                text-[9px]
                leading-4
                text-slate-500
                dark:text-slate-400
              "
            >
              {positive
                ? "Receivables are currently higher than liabilities."
                : "Liabilities are currently higher than receivables."}
            </p>
          </div>
        </div>

        {/* Payable vs receivable */}

        <div
          className="
            mt-6
            grid
            min-w-0
            gap-3
            sm:grid-cols-2
          "
        >
          <div
            className="
              rounded-2xl
              border
              border-rose-500/15
              bg-rose-500/[0.045]
              p-4
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <div>
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-wide
                    text-rose-600
                    dark:text-rose-300
                  "
                >
                  You Owe
                </p>

                <p
                  className="
                    mt-1.5
                    text-lg
                    font-black
                    text-slate-950
                    dark:text-white
                  "
                >
                  {formatDebtCurrency(
                    payable
                  )}
                </p>
              </div>

              <ArrowUpRight
                size={18}
                className="
                  text-rose-500
                "
              />
            </div>
          </div>

          <div
            className="
              rounded-2xl
              border
              border-emerald-500/15
              bg-emerald-500/[0.045]
              p-4
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <div>
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-wide
                    text-emerald-600
                    dark:text-emerald-300
                  "
                >
                  Others Owe You
                </p>

                <p
                  className="
                    mt-1.5
                    text-lg
                    font-black
                    text-slate-950
                    dark:text-white
                  "
                >
                  {formatDebtCurrency(
                    receivable
                  )}
                </p>
              </div>

              <ArrowDownLeft
                size={18}
                className="
                  text-emerald-500
                "
              />
            </div>
          </div>
        </div>

        <PositionBar
          payable={payable}
          receivable={receivable}
        />

        {/* Record statuses */}

        <div
          className="
            mt-6
            grid
            min-w-0
            gap-3
            sm:grid-cols-3
          "
        >
          <StatusItem
            label="Active"
            value={activeCount}
            icon={WalletCards}
            classes="
              bg-blue-500/10
              text-blue-600
              dark:text-blue-300
            "
          />

          <StatusItem
            label="Overdue"
            value={overdueCount}
            icon={AlertTriangle}
            classes="
              bg-rose-500/10
              text-rose-600
              dark:text-rose-300
            "
          />

          <StatusItem
            label="Completed"
            value={completedCount}
            icon={CheckCircle2}
            classes="
              bg-emerald-500/10
              text-emerald-600
              dark:text-emerald-300
            "
          />
        </div>
      </div>
    </motion.section>
  );
}

/* =========================================================
   LOADING SKELETON
========================================================= */

function DebtSummarySkeleton() {
  return (
    <div className="space-y-4">
      <div
        className="
          grid
          gap-4
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
              h-44
              animate-pulse
              rounded-[24px]
              bg-slate-200
              dark:bg-white/[0.05]
            "
          />
        ))}
      </div>

      <div
        className="
          h-72
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
   DEBT SUMMARY
========================================================= */

function DebtSummary() {
  const {
    debts,
    loading,
  } = useDebt();

  const records =
    Array.isArray(debts)
      ? debts
      : [];

  const metrics =
    useMemo(() => {
      let totalPayable = 0;
      let totalReceivable = 0;
      let overdueBalance = 0;

      let totalPaid = 0;
      let totalReceived = 0;

      let activeCount = 0;
      let overdueCount = 0;
      let completedCount = 0;

      records.forEach(
        (debt) => {
          const record =
            normalizeDebtRecord(
              debt
            );

          const remaining =
            calculateRemainingAmount(
              record
            );

          const paid =
            calculatePaidAmount(
              record
            );

          if (
            record.direction ===
            "receivable"
          ) {
            totalReceivable +=
              remaining;

            totalReceived += paid;
          } else {
            totalPayable +=
              remaining;

            totalPaid += paid;
          }

          if (
            record.status ===
            "completed"
          ) {
            completedCount += 1;

            return;
          }

          activeCount += 1;

          if (
            record.status ===
            "overdue"
          ) {
            overdueCount += 1;

            overdueBalance +=
              remaining;
          }
        }
      );

      return {
        totalPayable,
        totalReceivable,
        overdueBalance,
        totalPaid,
        totalReceived,
        activeCount,
        overdueCount,
        completedCount,
      };
    }, [records]);

  if (loading) {
    return (
      <DebtSummarySkeleton />
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
          SUMMARY CARDS
      =================================================== */}

      <div
        className="
          grid
          min-w-0
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <SummaryCard
          title="Total Payable"
          value={formatDebtCurrency(
            metrics.totalPayable
          )}
          description="Outstanding loans, EMIs, borrowed money and other dues."
          icon={Landmark}
          iconClasses="
            bg-rose-500/10
            text-rose-600
            dark:text-rose-300
          "
          valueClasses="
            text-rose-600
            dark:text-rose-300
          "
          badge={`${metrics.activeCount} active`}
          delay={0}
        />

        <SummaryCard
          title="Total Receivable"
          value={formatDebtCurrency(
            metrics.totalReceivable
          )}
          description="Outstanding money that others still need to repay you."
          icon={HandCoins}
          iconClasses="
            bg-emerald-500/10
            text-emerald-600
            dark:text-emerald-300
          "
          valueClasses="
            text-emerald-600
            dark:text-emerald-300
          "
          badge="To collect"
          delay={0.05}
        />

        <SummaryCard
          title="Overdue Balance"
          value={formatDebtCurrency(
            metrics.overdueBalance
          )}
          description="Outstanding balance across records that have passed their due date."
          icon={AlertTriangle}
          iconClasses="
            bg-amber-500/10
            text-amber-600
            dark:text-amber-300
          "
          valueClasses="
            text-amber-600
            dark:text-amber-300
          "
          badge={`${metrics.overdueCount} overdue`}
          delay={0.1}
        />

        <SummaryCard
          title="Total Repayment Activity"
          value={formatDebtCurrency(
            metrics.totalPaid +
              metrics.totalReceived
          )}
          description="Combined value of repayments paid and repayments received."
          icon={CircleDollarSign}
          iconClasses="
            bg-violet-500/10
            text-violet-600
            dark:text-violet-300
          "
          badge={`${metrics.completedCount} completed`}
          delay={0.15}
        />
      </div>

      {/* ===================================================
          POSITION OVERVIEW
      =================================================== */}

      <DebtPositionCard
        payable={
          metrics.totalPayable
        }
        receivable={
          metrics.totalReceivable
        }
        activeCount={
          metrics.activeCount
        }
        overdueCount={
          metrics.overdueCount
        }
        completedCount={
          metrics.completedCount
        }
      />
    </div>
  );
}

export default DebtSummary;