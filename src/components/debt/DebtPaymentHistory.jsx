import {
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  ArrowDownLeft,
  ArrowDownUp,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  HandCoins,
  History,
  Plus,
  ReceiptText,
  Search,
  SlidersHorizontal,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";

import useDebt from "../../hooks/useDebt";

import {
  formatDebtCurrency,
  formatDebtDate,
  getDebtTypeLabel,
  normalizeDebtRecord,
} from "../../utils/debtCalculations";

/* =========================================================
   FILTER OPTIONS
========================================================= */

const paymentTypeOptions = [
  {
    value: "all",
    label: "All Payments",
  },
  {
    value: "paid",
    label: "Paid",
  },
  {
    value: "received",
    label: "Received",
  },
];

/* =========================================================
   SORT OPTIONS
========================================================= */

const sortOptions = [
  {
    value: "newest",
    label: "Newest First",
  },
  {
    value: "oldest",
    label: "Oldest First",
  },
  {
    value: "amount-high",
    label: "Highest Amount",
  },
  {
    value: "amount-low",
    label: "Lowest Amount",
  },
];

/* =========================================================
   SAFE NUMBER
========================================================= */

function toSafeNumber(value) {
  const number =
    Number(value);

  return Number.isFinite(number)
    ? Math.max(0, number)
    : 0;
}

/* =========================================================
   SAFE DATE TIMESTAMP
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
   SAFE DISPLAY DATE
========================================================= */

function getDisplayDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  try {
    return formatDebtDate(value);
  } catch {
    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "Date unavailable";
    }

    return date.toLocaleDateString();
  }
}

/* =========================================================
   GET PAYMENT DATE
========================================================= */

function getPaymentDate(payment) {
  return (
    payment.paymentDate ||
    payment.date ||
    payment.paidAt ||
    payment.receivedAt ||
    payment.createdAt ||
    payment.created_at ||
    payment.updatedAt ||
    payment.updated_at ||
    ""
  );
}

/* =========================================================
   GET PAYMENT AMOUNT
========================================================= */

function getPaymentAmount(payment) {
  return toSafeNumber(
    payment.amount ??
      payment.paymentAmount ??
      payment.value ??
      payment.paidAmount ??
      payment.receivedAmount
  );
}

/* =========================================================
   DETERMINE PAYMENT TYPE
========================================================= */

function getPaymentType(
  payment,
  debt
) {
  const rawType =
    String(
      payment.paymentType ||
        payment.action ||
        payment.type ||
        payment.direction ||
        ""
    ).toLowerCase();

  if (
    rawType.includes(
      "receive"
    ) ||
    rawType.includes(
      "collect"
    ) ||
    rawType === "receivable"
  ) {
    return "received";
  }

  if (
    rawType.includes("paid") ||
    rawType.includes("payment") ||
    rawType === "payable"
  ) {
    return "paid";
  }

  if (
    debt?.direction ===
    "receivable"
  ) {
    return "received";
  }

  return "paid";
}

/* =========================================================
   PAYMENT NOTE
========================================================= */

function getPaymentNote(payment) {
  return (
    payment.notes ||
    payment.note ||
    payment.description ||
    payment.memo ||
    ""
  );
}

/* =========================================================
   BUILD NORMALIZED HISTORY
========================================================= */

function normalizeHistoryItem(
  item,
  index,
  debtMap
) {
  /*
    Payment history may come from different
    versions of DebtContext.

    Supported examples:

    {
      id,
      debtId,
      amount,
      date
    }

    {
      payment: {...},
      debt: {...}
    }

    {
      id,
      recordId,
      paymentAmount,
      paymentDate
    }
  */

  const payment =
    item?.payment || item || {};

  const possibleDebtId =
    item?.debtId ||
    item?.debt_id ||
    item?.recordId ||
    item?.record_id ||
    item?.parentId ||
    item?.parent_id ||
    payment?.debtId ||
    payment?.debt_id ||
    payment?.recordId ||
    item?.debt?.id ||
    "";

  let debt = null;

  if (item?.debt) {
    debt =
      normalizeDebtRecord(
        item.debt
      );
  } else if (
    possibleDebtId &&
    debtMap.has(possibleDebtId)
  ) {
    debt =
      debtMap.get(
        possibleDebtId
      );
  }

  const amount =
    getPaymentAmount(payment);

  const date =
    getPaymentDate(payment);

  const paymentType =
    getPaymentType(
      payment,
      debt
    );

  return {
    id:
      payment.id ||
      item?.id ||
      `${possibleDebtId || "payment"}-${
        date || "unknown-date"
      }-${index}`,

    debtId: possibleDebtId,

    amount,

    date,

    paymentType,

    title:
      payment.debtTitle ||
      item?.debtTitle ||
      item?.title ||
      debt?.title ||
      "Debt Payment",

    partyName:
      payment.partyName ||
      item?.partyName ||
      debt?.partyName ||
      "",

    debtType:
      payment.debtType ||
      item?.debtType ||
      debt?.type ||
      "",

    notes:
      getPaymentNote(
        payment
      ),

    debt,
  };
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function PaymentSummaryCard({
  title,
  value,
  description,
  icon: Icon,
  classes,
  delay = 0,
}) {
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
        delay,
      }}
      className="
        relative
        min-w-0
        overflow-hidden
        rounded-[22px]
        border
        border-slate-200/80
        bg-white
        p-4
        shadow-sm
        dark:border-white/[0.08]
        dark:bg-[#0a1427]
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-12
          -top-12
          h-28
          w-28
          rounded-full
          bg-blue-500/[0.05]
          blur-[50px]
        "
      />

      <div className="relative">
        <div
          className={`
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            ${classes}
          `}
        >
          <Icon size={17} />
        </div>

        <p
          className="
            mt-4
            text-[8px]
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
          className="
            mt-1.5
            truncate
            text-xl
            font-black
            tracking-tight
            text-slate-950
            dark:text-white
          "
        >
          {value}
        </p>

        <p
          className="
            mt-1.5
            text-[9px]
            leading-4
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
   PAYMENT HISTORY ROW
========================================================= */

function PaymentHistoryRow({
  payment,
  index,
}) {
  const received =
    payment.paymentType ===
    "received";

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.28,
        delay:
          Math.min(index, 8) *
          0.03,
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
        sm:p-5
      "
    >
      {/* Background glow */}

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
            received
              ? "bg-emerald-500/[0.05]"
              : "bg-blue-500/[0.05]"
          }
        `}
      />

      <div className="relative">
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
          {/* =================================================
              ICON + INFORMATION
          ================================================== */}

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
                  received
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
              {received ? (
                <ArrowDownLeft
                  size={18}
                />
              ) : (
                <ArrowUpRight
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
                  {payment.title}
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

                    ${
                      received
                        ? `
                          border-emerald-500/20
                          bg-emerald-500/10
                          text-emerald-600
                          dark:text-emerald-300
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
                  {received ? (
                    <HandCoins
                      size={10}
                    />
                  ) : (
                    <Banknote
                      size={10}
                    />
                  )}

                  {received
                    ? "Received"
                    : "Paid"}
                </span>
              </div>

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
                {payment.debtType && (
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
                      payment.debtType
                    )}
                  </span>
                )}

                {payment.partyName && (
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
                      {
                        payment.partyName
                      }
                    </span>
                  </span>
                )}

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
                  <CalendarDays
                    size={11}
                  />

                  {getDisplayDate(
                    payment.date
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              AMOUNT
          ================================================== */}

          <div
            className="
              min-w-[150px]
              rounded-2xl
              border
              border-slate-200/80
              bg-slate-50/70
              px-4
              py-3
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
              {received
                ? "Amount Received"
                : "Amount Paid"}
            </p>

            <p
              className={`
                mt-1.5
                truncate
                text-base
                font-black

                ${
                  received
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
              {received
                ? "+"
                : "-"}
              {formatDebtCurrency(
                payment.amount
              )}
            </p>
          </div>
        </div>

        {/* =================================================
            NOTES
        ================================================== */}

        {payment.notes && (
          <div
            className="
              mt-4
              rounded-2xl
              border
              border-slate-200/70
              bg-slate-50/60
              px-4
              py-3
              dark:border-white/[0.06]
              dark:bg-black/[0.06]
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
              Payment note
            </p>

            <p
              className="
                mt-1.5
                text-[10px]
                leading-5
                text-slate-600
                dark:text-slate-400
              "
            >
              {payment.notes}
            </p>
          </div>
        )}
      </div>
    </motion.article>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyPaymentHistory({
  onAddDebt,
}) {
  return (
    <motion.section
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
        border-slate-200/80
        bg-white
        p-6
        shadow-sm
        dark:border-white/[0.08]
        dark:bg-[#0a1427]
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
          bg-violet-500/[0.07]
          blur-[80px]
        "
      />

      <div
        className="
          relative
          flex
          min-h-[240px]
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
            border-violet-500/20
            bg-violet-500/10
            text-violet-600
            shadow-lg
            shadow-violet-500/10
            dark:text-violet-300
          "
        >
          <History size={27} />
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
          No payment history yet
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
          Payments and repayments will
          appear here after you record
          activity against a debt,
          loan or money-lent record.
        </p>

        <div
          className="
            mt-4
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-slate-200
            bg-slate-50
            px-3
            py-2
            text-[9px]
            font-black
            text-slate-500
            dark:border-white/[0.08]
            dark:bg-white/[0.035]
            dark:text-slate-400
          "
        >
          <CheckCircle2
            size={13}
          />

          History will update automatically
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

            Add Debt Record
          </button>
        )}
      </div>
    </motion.section>
  );
}

/* =========================================================
   FILTERED EMPTY STATE
========================================================= */

function NoMatchingPayments({
  onReset,
}) {
  return (
    <div
      className="
        flex
        min-h-[260px]
        flex-col
        items-center
        justify-center
        rounded-[26px]
        border
        border-dashed
        border-slate-300
        bg-white/60
        p-6
        text-center
        dark:border-white/[0.09]
        dark:bg-[#0a1427]/60
      "
    >
      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-[20px]
          bg-blue-500/10
          text-blue-600
          dark:text-blue-300
        "
      >
        <Search size={22} />
      </div>

      <h3
        className="
          mt-4
          text-base
          font-black
          text-slate-950
          dark:text-white
        "
      >
        No matching payments
      </h3>

      <p
        className="
          mt-2
          max-w-md
          text-[10px]
          leading-5
          text-slate-500
          dark:text-slate-400
        "
      >
        Try changing your search,
        payment type or sorting options.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="
          mt-4
          inline-flex
          min-h-10
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-blue-500/20
          bg-blue-500/10
          px-4
          py-2
          text-[10px]
          font-black
          text-blue-600
          dark:text-blue-300
        "
      >
        <X size={13} />

        Clear Filters
      </button>
    </div>
  );
}

/* =========================================================
   LOADING SKELETON
========================================================= */

function PaymentHistorySkeleton() {
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
              h-36
              animate-pulse
              rounded-[22px]
              bg-slate-200
              dark:bg-white/[0.05]
            "
          />
        ))}
      </div>

      <div
        className="
          h-24
          animate-pulse
          rounded-[24px]
          bg-slate-200
          dark:bg-white/[0.05]
        "
      />

      {Array.from({
        length: 3,
      }).map((_, index) => (
        <div
          key={index}
          className="
            h-32
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
   DEBT PAYMENT HISTORY
========================================================= */

function DebtPaymentHistory({
  onAddDebt,
}) {
  const {
    debts,
    paymentHistory,
    loading,
  } = useDebt();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    paymentType,
    setPaymentType,
  ] = useState("all");

  const [
    sort,
    setSort,
  ] = useState("newest");

  /* =======================================================
     NORMALIZED DEBTS
  ======================================================= */

  const normalizedDebts =
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
     DEBT MAP
  ======================================================= */

  const debtMap =
    useMemo(() => {
      const map =
        new Map();

      normalizedDebts.forEach(
        (record) => {
          if (record.id) {
            map.set(
              record.id,
              record
            );
          }
        }
      );

      return map;
    }, [normalizedDebts]);

  /* =======================================================
     FALLBACK PAYMENT HISTORY
  ======================================================= */

  const fallbackHistory =
    useMemo(() => {
      return normalizedDebts.flatMap(
        (record) => {
          const payments =
            Array.isArray(
              record.payments
            )
              ? record.payments
              : Array.isArray(
                    record.paymentHistory
                  )
                ? record.paymentHistory
                : [];

          return payments.map(
            (payment) => ({
              ...payment,
              debtId:
                payment.debtId ||
                record.id,

              debt: record,
            })
          );
        }
      );
    }, [normalizedDebts]);

  /* =======================================================
     NORMALIZE HISTORY
  ======================================================= */

  const history =
    useMemo(() => {
      const source =
        Array.isArray(
          paymentHistory
        ) &&
        paymentHistory.length > 0
          ? paymentHistory
          : fallbackHistory;

      return source
        .map(
          (
            item,
            index
          ) =>
            normalizeHistoryItem(
              item,
              index,
              debtMap
            )
        )
        .filter(
          (item) =>
            item.amount > 0
        );
    }, [
      paymentHistory,
      fallbackHistory,
      debtMap,
    ]);

  /* =======================================================
     SUMMARY
  ======================================================= */

  const summary =
    useMemo(() => {
      return history.reduce(
        (result, payment) => {
          result.count += 1;
          result.total +=
            payment.amount;

          if (
            payment.paymentType ===
            "received"
          ) {
            result.received +=
              payment.amount;
          } else {
            result.paid +=
              payment.amount;
          }

          return result;
        },
        {
          count: 0,
          total: 0,
          paid: 0,
          received: 0,
        }
      );
    }, [history]);

  /* =======================================================
     FILTER / SEARCH / SORT
  ======================================================= */

  const filteredHistory =
    useMemo(() => {
      const searchText =
        search
          .trim()
          .toLowerCase();

      const result =
        history.filter(
          (payment) => {
            const searchable =
              [
                payment.title,
                payment.partyName,
                payment.notes,
                payment.debtType,
                payment.paymentType,
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch =
              !searchText ||
              searchable.includes(
                searchText
              );

            const matchesType =
              paymentType ===
                "all" ||
              payment.paymentType ===
                paymentType;

            return (
              matchesSearch &&
              matchesType
            );
          }
        );

      result.sort(
        (first, second) => {
          switch (sort) {
            case "oldest":
              return (
                getTimestamp(
                  first.date
                ) -
                getTimestamp(
                  second.date
                )
              );

            case "amount-high":
              return (
                second.amount -
                first.amount
              );

            case "amount-low":
              return (
                first.amount -
                second.amount
              );

            case "newest":
            default:
              return (
                getTimestamp(
                  second.date
                ) -
                getTimestamp(
                  first.date
                )
              );
          }
        }
      );

      return result;
    }, [
      history,
      search,
      paymentType,
      sort,
    ]);

  /* =======================================================
     RESET
  ======================================================= */

  const hasFilters =
    search.trim() ||
    paymentType !== "all" ||
    sort !== "newest";

  const resetFilters = () => {
    setSearch("");
    setPaymentType("all");
    setSort("newest");
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <PaymentHistorySkeleton />
    );
  }

  /* =======================================================
     EMPTY
  ======================================================= */

  if (history.length === 0) {
    return (
      <EmptyPaymentHistory
        onAddDebt={onAddDebt}
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
          SUMMARY CARDS
      =================================================== */}

      <div
        className="
          grid
          min-w-0
          gap-3
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <PaymentSummaryCard
          title="Total Activity"
          value={formatDebtCurrency(
            summary.total
          )}
          description="Combined paid and received repayments."
          icon={
            CircleDollarSign
          }
          classes="
            bg-violet-500/10
            text-violet-600
            dark:text-violet-300
          "
          delay={0}
        />

        <PaymentSummaryCard
          title="Total Paid"
          value={formatDebtCurrency(
            summary.paid
          )}
          description="Money paid toward debts and loans."
          icon={Banknote}
          classes="
            bg-blue-500/10
            text-blue-600
            dark:text-blue-300
          "
          delay={0.04}
        />

        <PaymentSummaryCard
          title="Total Received"
          value={formatDebtCurrency(
            summary.received
          )}
          description="Repayments collected from others."
          icon={HandCoins}
          classes="
            bg-emerald-500/10
            text-emerald-600
            dark:text-emerald-300
          "
          delay={0.08}
        />

        <PaymentSummaryCard
          title="Transactions"
          value={
            summary.count
          }
          description="Recorded repayment transactions."
          icon={ReceiptText}
          classes="
            bg-cyan-500/10
            text-cyan-600
            dark:text-cyan-300
          "
          delay={0.12}
        />
      </div>

      {/* ===================================================
          FILTER TOOLBAR
      =================================================== */}

      <motion.section
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          relative
          min-w-0
          overflow-hidden
          rounded-[24px]
          border
          border-slate-200/80
          bg-white
          p-4
          shadow-sm
          dark:border-white/[0.08]
          dark:bg-[#0a1427]
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            h-44
            w-44
            rounded-full
            bg-violet-500/[0.06]
            blur-[80px]
          "
        />

        <div
          className="
            relative
            grid
            min-w-0
            gap-3
            lg:grid-cols-[minmax(240px,1fr)_190px_190px_auto]
          "
        >
          {/* Search */}

          <div className="relative">
            <Search
              size={16}
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search payment history..."
              className="
                h-11
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                pl-11
                pr-10
                text-xs
                font-medium
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500/40
                focus:bg-white
                focus:ring-4
                focus:ring-blue-500/10
                dark:border-white/[0.08]
                dark:bg-white/[0.035]
                dark:text-white
                dark:focus:bg-white/[0.05]
              "
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                aria-label="Clear search"
                className="
                  absolute
                  right-3
                  top-1/2
                  flex
                  h-7
                  w-7
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  hover:bg-slate-200
                  hover:text-slate-700
                  dark:hover:bg-white/[0.08]
                  dark:hover:text-white
                "
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Payment type */}

          <div className="relative">
            <WalletCards
              size={15}
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <select
              value={paymentType}
              onChange={(event) =>
                setPaymentType(
                  event.target.value
                )
              }
              className="
                h-11
                w-full
                appearance-none
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                pl-11
                pr-8
                text-xs
                font-bold
                text-slate-700
                outline-none
                transition
                focus:border-blue-500/40
                focus:ring-4
                focus:ring-blue-500/10
                dark:border-white/[0.08]
                dark:bg-white/[0.035]
                dark:text-slate-300
              "
            >
              {paymentTypeOptions.map(
                (option) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Sort */}

          <div className="relative">
            <ArrowDownUp
              size={15}
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <select
              value={sort}
              onChange={(event) =>
                setSort(
                  event.target.value
                )
              }
              className="
                h-11
                w-full
                appearance-none
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                pl-11
                pr-8
                text-xs
                font-bold
                text-slate-700
                outline-none
                transition
                focus:border-blue-500/40
                focus:ring-4
                focus:ring-blue-500/10
                dark:border-white/[0.08]
                dark:bg-white/[0.035]
                dark:text-slate-300
              "
            >
              {sortOptions.map(
                (option) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Reset */}

          <button
            type="button"
            disabled={!hasFilters}
            onClick={
              resetFilters
            }
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              px-4
              text-[10px]
              font-black
              text-slate-600
              transition
              enabled:hover:border-blue-500/25
              enabled:hover:bg-blue-500/[0.06]
              enabled:hover:text-blue-600
              disabled:cursor-not-allowed
              disabled:opacity-40
              dark:border-white/[0.08]
              dark:bg-white/[0.035]
              dark:text-slate-400
              dark:enabled:hover:text-blue-300
            "
          >
            <SlidersHorizontal
              size={14}
            />

            Reset
          </button>
        </div>
      </motion.section>

      {/* ===================================================
          RESULT COUNT
      =================================================== */}

      <div
        className="
          flex
          flex-col
          gap-2
          px-1
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <p
          className="
            text-[10px]
            text-slate-500
            dark:text-slate-400
          "
        >
          Showing{" "}
          <span
            className="
              font-black
              text-slate-950
              dark:text-white
            "
          >
            {
              filteredHistory.length
            }
          </span>{" "}
          of{" "}
          <span
            className="
              font-black
              text-slate-950
              dark:text-white
            "
          >
            {history.length}
          </span>{" "}
          payment records
        </p>

        <div
          className="
            inline-flex
            w-fit
            items-center
            gap-2
            text-[9px]
            font-bold
            text-slate-400
          "
        >
          <History size={12} />

          {
            sortOptions.find(
              (option) =>
                option.value ===
                sort
            )?.label
          }
        </div>
      </div>

      {/* ===================================================
          HISTORY LIST
      =================================================== */}

      {filteredHistory.length ===
      0 ? (
        <NoMatchingPayments
          onReset={
            resetFilters
          }
        />
      ) : (
        <div
          className="
            min-w-0
            space-y-3
          "
        >
          {filteredHistory.map(
            (payment, index) => (
              <PaymentHistoryRow
                key={payment.id}
                payment={payment}
                index={index}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

export default DebtPaymentHistory;