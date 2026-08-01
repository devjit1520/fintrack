import { motion } from "framer-motion";

import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  HandCoins,
  Landmark,
  MoreHorizontal,
  Pencil,
  ReceiptText,
  Trash2,
  UserRound,
  WalletCards,
} from "lucide-react";

import {
  calculateCompletedInstallments,
  calculateDebtProgress,
  calculatePaidAmount,
  calculateRemainingAmount,
  calculateRemainingInstallments,
  formatDebtCurrency,
  formatDebtDate,
  getDaysUntilDue,
  getDebtTypeLabel,
  normalizeDebtRecord,
} from "../../utils/debtCalculations";

/* =========================================================
   STATUS DESIGN
========================================================= */

function getDebtStatusDesign(record) {
  if (record.status === "completed") {
    return {
      label: "Completed",
      icon: CheckCircle2,
      badgeClasses:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
      iconClasses:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    };
  }

  const days =
    getDaysUntilDue(
      record.nextDueDate
    );

  if (
    record.status === "overdue" ||
    (days !== null && days < 0)
  ) {
    return {
      label: "Overdue",
      icon: AlertTriangle,
      badgeClasses:
        "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-300",
      iconClasses:
        "bg-rose-500/10 text-rose-600 dark:text-rose-300",
    };
  }

  if (
    days !== null &&
    days >= 0 &&
    days <= 7
  ) {
    return {
      label:
        days === 0
          ? "Due Today"
          : "Due Soon",

      icon: Clock3,

      badgeClasses:
        "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300",

      iconClasses:
        "bg-amber-500/10 text-amber-600 dark:text-amber-300",
    };
  }

  return {
    label: "Active",
    icon: WalletCards,
    badgeClasses:
      "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-300",
    iconClasses:
      "bg-blue-500/10 text-blue-600 dark:text-blue-300",
  };
}

/* =========================================================
   DUE DATE TEXT
========================================================= */

function getDueText(date) {
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

  if (days <= 7) {
    return `Due in ${days} days`;
  }

  return formatDebtDate(date);
}

/* =========================================================
   METRIC BOX
========================================================= */

function MetricBox({
  label,
  value,
  icon: Icon,
  classes,
}) {
  return (
    <div
      className="
        min-w-0
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
        className="
          flex
          items-center
          gap-2
        "
      >
        <span
          className={`
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${classes}
          `}
        >
          <Icon size={14} />
        </span>

        <span
          className="
            min-w-0
            truncate
            text-[8px]
            font-black
            uppercase
            tracking-wide
            text-slate-500
            dark:text-slate-400
          "
        >
          {label}
        </span>
      </div>

      <p
        className="
          mt-3
          truncate
          text-sm
          font-black
          tracking-tight
          text-slate-950
          dark:text-white
        "
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   INSTALLMENT INFORMATION
========================================================= */

function InstallmentInformation({
  record,
}) {
  const installmentAmount =
    Number(
      record.installmentAmount
    ) || 0;

  const totalInstallments =
    Number(
      record.totalInstallments
    ) || 0;

  if (
    installmentAmount <= 0 &&
    totalInstallments <= 0
  ) {
    return null;
  }

  const completed =
    calculateCompletedInstallments(
      record
    );

  const remaining =
    calculateRemainingInstallments(
      record
    );

  return (
    <div
      className="
        mt-4
        grid
        min-w-0
        gap-3
        rounded-2xl
        border
        border-violet-500/10
        bg-violet-500/[0.035]
        p-4
        sm:grid-cols-3
      "
    >
      <div>
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
          Installment
        </p>

        <p
          className="
            mt-1.5
            text-xs
            font-black
            text-slate-950
            dark:text-white
          "
        >
          {installmentAmount > 0
            ? formatDebtCurrency(
                installmentAmount
              )
            : "Not set"}
        </p>
      </div>

      <div>
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
          Completed
        </p>

        <p
          className="
            mt-1.5
            text-xs
            font-black
            text-emerald-600
            dark:text-emerald-300
          "
        >
          {completed}
          {totalInstallments > 0
            ? ` / ${totalInstallments}`
            : ""}
        </p>
      </div>

      <div>
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
            text-xs
            font-black
            text-violet-600
            dark:text-violet-300
          "
        >
          {remaining}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   PROGRESS
========================================================= */

function DebtProgress({
  progress,
  receivable,
}) {
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
        <span
          className="
            text-[9px]
            font-bold
            text-slate-500
            dark:text-slate-400
          "
        >
          {receivable
            ? "Collection progress"
            : "Repayment progress"}
        </span>

        <span
          className={`
            text-[10px]
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
          {progress}%
        </span>
      </div>

      <div
        className="
          mt-2.5
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
          className={`
            h-full
            rounded-full
            ${
              receivable
                ? `
                  bg-gradient-to-r
                  from-emerald-500
                  to-cyan-500
                `
                : `
                  bg-gradient-to-r
                  from-cyan-500
                  via-blue-500
                  to-violet-500
                `
            }
          `}
        />
      </div>
    </div>
  );
}

/* =========================================================
   DEBT CARD
========================================================= */

function DebtCard({
  debt,
  record,
  index = 0,
  onEditDebt,
  onDeleteDebt,
  onRecordPayment,
  onViewDetails,
}) {
  /*
    Support both:

    <DebtCard debt={record} />

    and

    <DebtCard record={record} />

    so this component stays compatible
    with different DebtList versions.
  */

  const source =
    debt || record;

  if (!source) {
    return null;
  }

  const normalized =
    normalizeDebtRecord(
      source
    );

  const remainingAmount =
    calculateRemainingAmount(
      normalized
    );

  const paidAmount =
    calculatePaidAmount(
      normalized
    );

  const progress =
    calculateDebtProgress(
      normalized
    );

  const totalAmount =
    Number(
      normalized.totalAmount
    ) ||
    Number(
      normalized.amount
    ) ||
    0;

  const receivable =
    normalized.direction ===
    "receivable";

  const completed =
    normalized.status ===
    "completed";

  const status =
    getDebtStatusDesign(
      normalized
    );

  const StatusIcon =
    status.icon;

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.32,
        delay:
          Math.min(index, 7) *
          0.035,
      }}
      className="
        group
        relative
        min-w-0
        overflow-hidden
        rounded-[26px]
        border
        border-slate-200/80
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-blue-500/20
        hover:shadow-lg
        dark:border-white/[0.08]
        dark:bg-[#0a1427]
      "
    >
      {/* ===================================================
          BACKGROUND GLOW
      =================================================== */}

      <div
        className={`
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-56
          w-56
          rounded-full
          blur-[90px]
          ${
            receivable
              ? "bg-emerald-500/[0.07]"
              : "bg-blue-500/[0.07]"
          }
        `}
      />

      <div
        className="
          relative
          p-5
          sm:p-6
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
            gap-4
            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >
          {/* Left */}

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
                <HandCoins size={20} />
              ) : normalized.type ===
                "loan" ? (
                <Landmark size={20} />
              ) : (
                <WalletCards size={20} />
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
                <h3
                  className="
                    break-words
                    text-base
                    font-black
                    tracking-tight
                    text-slate-950
                    dark:text-white
                    sm:text-lg
                  "
                >
                  {normalized.title ||
                    "Untitled Debt"}
                </h3>

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
                    size={11}
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
                  gap-x-3
                  gap-y-1
                "
              >
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    text-[9px]
                    font-semibold
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  <ReceiptText
                    size={12}
                  />

                  {getDebtTypeLabel(
                    normalized.type
                  )}
                </span>

                <span
                  className="
                    inline-flex
                    min-w-0
                    items-center
                    gap-1.5
                    text-[9px]
                    font-semibold
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  <UserRound
                    size={12}
                  />

                  <span className="truncate">
                    {normalized.partyName ||
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
              px-3
              py-1.5
              text-[9px]
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
                size={12}
              />
            ) : (
              <ArrowUpRight
                size={12}
              />
            )}

            {receivable
              ? "Receivable"
              : "Payable"}
          </span>
        </div>

        {/* =================================================
            AMOUNTS
        ================================================== */}

        <div
          className="
            mt-6
            grid
            min-w-0
            gap-3
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          <MetricBox
            label="Original Amount"
            value={formatDebtCurrency(
              totalAmount
            )}
            icon={
              CircleDollarSign
            }
            classes="
              bg-violet-500/10
              text-violet-600
              dark:text-violet-300
            "
          />

          <MetricBox
            label={
              receivable
                ? "Received"
                : "Paid"
            }
            value={formatDebtCurrency(
              paidAmount
            )}
            icon={
              receivable
                ? HandCoins
                : Banknote
            }
            classes="
              bg-emerald-500/10
              text-emerald-600
              dark:text-emerald-300
            "
          />

          <MetricBox
            label="Remaining"
            value={formatDebtCurrency(
              remainingAmount
            )}
            icon={WalletCards}
            classes="
              bg-blue-500/10
              text-blue-600
              dark:text-blue-300
            "
          />

          <MetricBox
            label="Next Due"
            value={getDueText(
              normalized.nextDueDate
            )}
            icon={CalendarDays}
            classes={
              normalized.status ===
              "overdue"
                ? `
                  bg-rose-500/10
                  text-rose-600
                  dark:text-rose-300
                `
                : `
                  bg-amber-500/10
                  text-amber-600
                  dark:text-amber-300
                `
            }
          />
        </div>

        {/* =================================================
            INSTALLMENT INFO
        ================================================== */}

        <InstallmentInformation
          record={normalized}
        />

        {/* =================================================
            PROGRESS
        ================================================== */}

        <DebtProgress
          progress={progress}
          receivable={receivable}
        />

        {/* =================================================
            NOTES
        ================================================== */}

        {normalized.notes && (
          <div
            className="
              mt-4
              rounded-2xl
              border
              border-slate-200/80
              bg-slate-50/60
              px-4
              py-3
              dark:border-white/[0.06]
              dark:bg-white/[0.02]
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
              Notes
            </p>

            <p
              className="
                mt-1.5
                line-clamp-2
                text-[10px]
                leading-5
                text-slate-600
                dark:text-slate-400
              "
            >
              {normalized.notes}
            </p>
          </div>
        )}

        {/* =================================================
            FOOTER ACTIONS
        ================================================== */}

        <div
          className="
            mt-5
            flex
            min-w-0
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
          {/* View details */}

          <button
            type="button"
            onClick={() =>
              onViewDetails?.(
                normalized
              )
            }
            className="
              group/details
              inline-flex
              min-h-10
              items-center
              gap-2
              rounded-xl
              px-1
              text-[10px]
              font-black
              text-slate-500
              transition
              hover:text-blue-600
              dark:text-slate-400
              dark:hover:text-blue-300
            "
          >
            View details

            <ChevronRight
              size={14}
              className="
                transition-transform
                group-hover/details:translate-x-0.5
              "
            />
          </button>

          {/* Buttons */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <button
              type="button"
              onClick={() =>
                onEditDebt?.(
                  normalized
                )
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
                px-3.5
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
              <Pencil size={13} />

              Edit
            </button>

            <button
              type="button"
              onClick={() =>
                onDeleteDebt?.(
                  normalized
                )
              }
              className="
                inline-flex
                min-h-10
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-rose-500/15
                bg-rose-500/[0.05]
                px-3.5
                py-2
                text-[10px]
                font-black
                text-rose-600
                transition
                hover:border-rose-500/25
                hover:bg-rose-500/10
                dark:text-rose-300
              "
            >
              <Trash2 size={13} />

              Delete
            </button>

            {!completed && (
              <button
                type="button"
                onClick={() =>
                  onRecordPayment?.(
                    normalized
                  )
                }
                className={`
                  inline-flex
                  min-h-10
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
                        shadow-blue-500/20
                      `
                  }
                `}
              >
                {receivable ? (
                  <>
                    <HandCoins
                      size={14}
                    />

                    Receive
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
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default DebtCard;