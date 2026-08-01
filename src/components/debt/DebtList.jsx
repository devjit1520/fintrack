import {
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  AlertTriangle,
  ArrowDownAZ,
  ArrowDownUp,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Filter,
  Landmark,
  Plus,
  Search,
  SlidersHorizontal,
  WalletCards,
  X,
} from "lucide-react";

import useDebt from "../../hooks/useDebt";

import DebtCard from "./DebtCard";
import DebtEmptyState from "./DebtEmptyState";

import {
  calculateDebtProgress,
  calculateRemainingAmount,
  getDaysUntilDue,
  getDebtTypeLabel,
  normalizeDebtRecord,
} from "../../utils/debtCalculations";

/* =========================================================
   FILTER OPTIONS
========================================================= */

const statusOptions = [
  {
    value: "all",
    label: "All Status",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "due-soon",
    label: "Due Soon",
  },
  {
    value: "overdue",
    label: "Overdue",
  },
  {
    value: "completed",
    label: "Completed",
  },
];

/* =========================================================
   SORT OPTIONS
========================================================= */

const sortOptions = [
  {
    value: "due-soon",
    label: "Due Soon",
  },
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "balance-high",
    label: "Highest Balance",
  },
  {
    value: "amount-high",
    label: "Highest Amount",
  },
  {
    value: "progress-high",
    label: "Highest Progress",
  },
  {
    value: "name",
    label: "Name A–Z",
  },
];

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
   VIEW INFORMATION
========================================================= */

function getViewInformation(view) {
  switch (view) {
    case "borrowed":
      return {
        eyebrow: "Payable records",
        title: "Money Borrowed",
        description:
          "Money borrowed from friends, family or other people.",
        addLabel:
          "Add Borrowed Money",
        emptyType: "borrowed",
        icon: WalletCards,
        iconClasses:
          "bg-rose-500/10 text-rose-600 dark:text-rose-300",
      };

    case "lent":
      return {
        eyebrow:
          "Receivable records",
        title: "Money Lent",
        description:
          "Money you have lent and are waiting to receive back.",
        addLabel:
          "Add Money Lent",
        emptyType: "lent",
        icon: CircleDollarSign,
        iconClasses:
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
      };

    case "loans":
    default:
      return {
        eyebrow:
          "Loan management",
        title: "Loans & EMI Records",
        description:
          "Manage loan balances, installments and repayment schedules.",
        addLabel: "Add Loan",
        emptyType: "loans",
        icon: Landmark,
        iconClasses:
          "bg-violet-500/10 text-violet-600 dark:text-violet-300",
      };
  }
}

/* =========================================================
   MATCH RECORD TO CURRENT TAB
========================================================= */

function matchesView(
  record,
  view
) {
  if (view === "lent") {
    return (
      record.type === "lent" ||
      record.direction ===
        "receivable"
    );
  }

  if (view === "borrowed") {
    return (
      record.type ===
        "borrowed" ||
      (record.direction ===
        "payable" &&
        record.type !== "loan" &&
        record.type !== "emi")
    );
  }

  if (view === "loans") {
    return (
      record.type === "loan" ||
      record.type === "emi"
    );
  }

  return true;
}

/* =========================================================
   GET DERIVED RECORD STATUS
========================================================= */

function getDerivedStatus(record) {
  if (
    record.status === "completed"
  ) {
    return "completed";
  }

  const days =
    getDaysUntilDue(
      record.nextDueDate
    );

  if (
    record.status === "overdue" ||
    (days !== null && days < 0)
  ) {
    return "overdue";
  }

  if (
    days !== null &&
    days >= 0 &&
    days <= 7
  ) {
    return "due-soon";
  }

  return "active";
}

/* =========================================================
   SMALL STATUS CARD
========================================================= */

function MiniStat({
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
   LIST SKELETON
========================================================= */

function DebtListSkeleton() {
  return (
    <div className="space-y-4">
      <div
        className="
          h-36
          animate-pulse
          rounded-[26px]
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
            h-[310px]
            animate-pulse
            rounded-[26px]
            bg-slate-200
            dark:bg-white/[0.05]
          "
        />
      ))}
    </div>
  );
}

/* =========================================================
   DEBT LIST
========================================================= */

function DebtList({
  view = "loans",
  onAddDebt,
  onEditDebt,
  onDeleteDebt,
  onRecordPayment,
  onViewDetails,
}) {
  const {
    debts,
    loading,
  } = useDebt();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [
    sort,
    setSort,
  ] = useState("due-soon");

  /* =======================================================
     VIEW CONFIG
  ======================================================= */

  const viewInfo =
    useMemo(
      () =>
        getViewInformation(
          view
        ),
      [view]
    );

  const ViewIcon =
    viewInfo.icon;

  /* =======================================================
     NORMALIZE RECORDS
  ======================================================= */

  const viewRecords =
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
        .filter((record) =>
          matchesView(
            record,
            view
          )
        );
    }, [debts, view]);

  /* =======================================================
     STATUS COUNTS
  ======================================================= */

  const counts =
    useMemo(() => {
      return viewRecords.reduce(
        (result, record) => {
          const status =
            getDerivedStatus(
              record
            );

          result.total += 1;

          if (
            status === "active"
          ) {
            result.active += 1;
          }

          if (
            status ===
            "due-soon"
          ) {
            result.dueSoon += 1;
          }

          if (
            status ===
            "overdue"
          ) {
            result.overdue += 1;
          }

          if (
            status ===
            "completed"
          ) {
            result.completed += 1;
          }

          return result;
        },
        {
          total: 0,
          active: 0,
          dueSoon: 0,
          overdue: 0,
          completed: 0,
        }
      );
    }, [viewRecords]);

  /* =======================================================
     FILTER + SEARCH + SORT
  ======================================================= */

  const filteredRecords =
    useMemo(() => {
      const searchText =
        search
          .trim()
          .toLowerCase();

      const result =
        viewRecords.filter(
          (record) => {
            /* -------------------------------
               SEARCH
            -------------------------------- */

            const searchableText = [
              record.title,
              record.partyName,
              record.notes,
              record.type,
              getDebtTypeLabel(
                record.type
              ),
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

            const matchesSearch =
              !searchText ||
              searchableText.includes(
                searchText
              );

            /* -------------------------------
               STATUS
            -------------------------------- */

            const derivedStatus =
              getDerivedStatus(
                record
              );

            const matchesStatus =
              statusFilter ===
                "all" ||
              derivedStatus ===
                statusFilter;

            return (
              matchesSearch &&
              matchesStatus
            );
          }
        );

      /* =====================================
         SORT
      ===================================== */

      result.sort(
        (first, second) => {
          switch (sort) {
            case "newest":
              return (
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
              );

            case "balance-high":
              return (
                calculateRemainingAmount(
                  second
                ) -
                calculateRemainingAmount(
                  first
                )
              );

            case "amount-high": {
              const secondAmount =
                Number(
                  second.totalAmount
                ) ||
                Number(
                  second.amount
                ) ||
                0;

              const firstAmount =
                Number(
                  first.totalAmount
                ) ||
                Number(
                  first.amount
                ) ||
                0;

              return (
                secondAmount -
                firstAmount
              );
            }

            case "progress-high":
              return (
                calculateDebtProgress(
                  second
                ) -
                calculateDebtProgress(
                  first
                )
              );

            case "name":
              return (
                first.title || ""
              ).localeCompare(
                second.title || ""
              );

            case "due-soon":
            default: {
              const firstCompleted =
                getDerivedStatus(
                  first
                ) === "completed";

              const secondCompleted =
                getDerivedStatus(
                  second
                ) === "completed";

              if (
                firstCompleted !==
                secondCompleted
              ) {
                return firstCompleted
                  ? 1
                  : -1;
              }

              const firstDate =
                getTimestamp(
                  first.nextDueDate
                );

              const secondDate =
                getTimestamp(
                  second.nextDueDate
                );

              if (
                !firstDate &&
                secondDate
              ) {
                return 1;
              }

              if (
                firstDate &&
                !secondDate
              ) {
                return -1;
              }

              return (
                firstDate -
                secondDate
              );
            }
          }
        }
      );

      return result;
    }, [
      viewRecords,
      search,
      statusFilter,
      sort,
    ]);

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  const hasFilters =
    search.trim() ||
    statusFilter !== "all" ||
    sort !== "due-soon";

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setSort("due-soon");
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <DebtListSkeleton />
    );
  }

  /* =======================================================
     NO RECORDS FOR THIS CATEGORY
  ======================================================= */

  if (
    viewRecords.length === 0
  ) {
    return (
      <DebtEmptyState
        type={
          viewInfo.emptyType
        }
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
          TOOLBAR CONTAINER
      =================================================== */}

      <motion.section
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
        }}
        className="
          relative
          min-w-0
          overflow-hidden
          rounded-[26px]
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
        {/* Decorative glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            h-44
            w-44
            rounded-full
            bg-blue-500/[0.06]
            blur-[80px]
          "
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
              xl:flex-row
              xl:items-center
              xl:justify-between
            "
          >
            <div
              className="
                flex
                min-w-0
                items-center
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
                  ${viewInfo.iconClasses}
                `}
              >
                <ViewIcon
                  size={19}
                />
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
                  {viewInfo.eyebrow}
                </p>

                <h3
                  className="
                    mt-1
                    truncate
                    text-base
                    font-black
                    text-slate-950
                    dark:text-white
                  "
                >
                  {viewInfo.title}
                </h3>

                <p
                  className="
                    mt-1
                    max-w-xl
                    text-[10px]
                    leading-5
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {viewInfo.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onAddDebt?.()
              }
              className="
                inline-flex
                min-h-11
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-gradient-to-r
                from-cyan-500
                via-blue-500
                to-violet-500
                px-5
                py-3
                text-xs
                font-black
                text-white
                shadow-lg
                shadow-blue-500/20
                transition
                hover:-translate-y-0.5
                hover:shadow-xl
              "
            >
              <Plus size={16} />

              {viewInfo.addLabel}
            </button>
          </div>

          {/* ===============================================
              MINI STATISTICS
          ================================================ */}

          <div
            className="
              mt-5
              grid
              min-w-0
              gap-3
              grid-cols-2
              lg:grid-cols-4
            "
          >
            <MiniStat
              label="Total"
              value={counts.total}
              icon={WalletCards}
              classes="
                bg-blue-500/10
                text-blue-600
                dark:text-blue-300
              "
            />

            <MiniStat
              label="Active"
              value={
                counts.active +
                counts.dueSoon
              }
              icon={Clock3}
              classes="
                bg-violet-500/10
                text-violet-600
                dark:text-violet-300
              "
            />

            <MiniStat
              label="Overdue"
              value={
                counts.overdue
              }
              icon={AlertTriangle}
              classes="
                bg-rose-500/10
                text-rose-600
                dark:text-rose-300
              "
            />

            <MiniStat
              label="Completed"
              value={
                counts.completed
              }
              icon={CheckCircle2}
              classes="
                bg-emerald-500/10
                text-emerald-600
                dark:text-emerald-300
              "
            />
          </div>

          {/* ===============================================
              FILTER TOOLBAR
          ================================================ */}

          <div
            className="
              mt-5
              grid
              min-w-0
              gap-3
              lg:grid-cols-[minmax(220px,1fr)_190px_200px_auto]
            "
          >
            {/* Search */}

            <div
              className="
                relative
                min-w-0
              "
            >
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
                placeholder="Search debt records..."
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
                    transition
                    hover:bg-slate-200
                    hover:text-slate-700
                    dark:hover:bg-white/[0.07]
                    dark:hover:text-white
                  "
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Status */}

            <div className="relative">
              <Filter
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
                value={
                  statusFilter
                }
                onChange={(event) =>
                  setStatusFilter(
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
                {statusOptions.map(
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
              onClick={resetFilters}
              disabled={!hasFilters}
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
        </div>
      </motion.section>

      {/* ===================================================
          RESULT INFORMATION
      =================================================== */}

      <div
        className="
          flex
          min-w-0
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
            font-semibold
            text-slate-500
            dark:text-slate-400
          "
        >
          Showing{" "}
          <span
            className="
              font-black
              text-slate-900
              dark:text-white
            "
          >
            {filteredRecords.length}
          </span>{" "}
          of{" "}
          <span
            className="
              font-black
              text-slate-900
              dark:text-white
            "
          >
            {viewRecords.length}
          </span>{" "}
          records
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
          <ArrowDownAZ
            size={13}
          />

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
          FILTERED EMPTY STATE
      =================================================== */}

      {filteredRecords.length ===
      0 ? (
        <section
          className="
            flex
            min-h-[300px]
            flex-col
            items-center
            justify-center
            rounded-[28px]
            border
            border-dashed
            border-slate-300
            bg-white/60
            px-5
            py-10
            text-center
            dark:border-white/[0.09]
            dark:bg-[#0a1427]/70
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
              border-blue-500/15
              bg-blue-500/10
              text-blue-600
              dark:text-blue-300
            "
          >
            <Search size={25} />
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
            No matching records
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
            No debt records match
            your current search,
            status filter or sorting
            criteria.
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="
              mt-5
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
              transition
              hover:bg-blue-500/15
              dark:text-blue-300
            "
          >
            <X size={13} />

            Clear Filters
          </button>
        </section>
      ) : (
        /* =================================================
           DEBT RECORDS
        ================================================== */

        <div
          className="
            min-w-0
            space-y-4
          "
        >
          {filteredRecords.map(
            (record, index) => (
              <DebtCard
                key={record.id}
                record={record}
                index={index}
                onEditDebt={
                  onEditDebt
                }
                onDeleteDebt={
                  onDeleteDebt
                }
                onRecordPayment={
                  onRecordPayment
                }
                onViewDetails={
                  onViewDetails
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

export default DebtList;