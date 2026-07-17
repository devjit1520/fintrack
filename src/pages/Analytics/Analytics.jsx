import {
  useMemo,
  useState,
} from "react";

import useFinance from "../../hooks/useFinance";

import AnalyticsHeader from "../../components/analytics/AnalyticsHeader";
import AnalyticsRangeControls from "../../components/analytics/AnalyticsRangeControls";
import AnalyticsSummary from "../../components/analytics/AnalyticsSummary";
import AnalyticsOverview from "../../components/analytics/AnalyticsOverview";

import ExpensePieChart from "../../components/analytics/ExpensePieChart";
import IncomeExpenseChart from "../../components/analytics/IncomeExpenseChart";
import MonthlyTrendChart from "../../components/analytics/MonthlyTrendChart";
import SavingsTrendChart from "../../components/analytics/SavingsTrendChart";
import CategoryPieChart from "../../components/analytics/CategoryPieChart";

import TopCategories from "../../components/analytics/TopCategories";
import FinancialHealth from "../../components/analytics/FinancialHealth";
import SmartInsights from "../../components/analytics/SmartInsights";
import RecentActivity from "../../components/analytics/RecentActivity";
import ExportAnalytics from "../../components/analytics/ExportAnalytics";

import SectionReveal from "../../components/common/SectionReveal";

/* =========================================================
   DATE HELPERS
========================================================= */

function getDateInputValue(date) {
  if (!(date instanceof Date)) {
    return "";
  }

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTransactionTimestamp(
  transaction
) {
  const value =
    transaction?.date ||
    transaction?.createdAt ||
    transaction?.updatedAt;

  if (!value) {
    return 0;
  }

  const timestamp =
    new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
}

function getPresetStartDate(range) {
  const date = new Date();

  date.setHours(0, 0, 0, 0);

  if (range === "30d") {
    date.setDate(
      date.getDate() - 29
    );

    return date;
  }

  if (range === "3m") {
    date.setMonth(
      date.getMonth() - 3
    );

    return date;
  }

  if (range === "6m") {
    date.setMonth(
      date.getMonth() - 6
    );

    return date;
  }

  if (range === "1y") {
    date.setFullYear(
      date.getFullYear() - 1
    );

    return date;
  }

  return null;
}

/* =========================================================
   COMPONENT
========================================================= */

function Analytics() {
  const finance = useFinance() || {};

  const {
    transactions:
      rawTransactions = [],
  } = finance;

  const transactions = Array.isArray(
    rawTransactions
  )
    ? rawTransactions
    : [];

  /* =======================================================
     RANGE STATE
  ======================================================= */

  const [range, setRange] =
    useState("6m");

  const initialStart =
    useMemo(() => {
      const date =
        getPresetStartDate("6m");

      return getDateInputValue(
        date
      );
    }, []);

  const today = useMemo(
    () =>
      getDateInputValue(
        new Date()
      ),
    []
  );

  const [
    customStartDate,
    setCustomStartDate,
  ] = useState(initialStart);

  const [
    customEndDate,
    setCustomEndDate,
  ] = useState(today);

  /* =======================================================
     RESOLVED DATE RANGE
  ======================================================= */

  const resolvedRange =
    useMemo(() => {
      if (range === "all") {
        return {
          startTimestamp: null,
          endTimestamp: null,
          startDate: "",
          endDate: "",
        };
      }

      if (range === "custom") {
        const startTimestamp =
          customStartDate
            ? new Date(
                `${customStartDate}T00:00:00`
              ).getTime()
            : null;

        const endTimestamp =
          customEndDate
            ? new Date(
                `${customEndDate}T23:59:59.999`
              ).getTime()
            : null;

        return {
          startTimestamp:
            Number.isFinite(
              startTimestamp
            )
              ? startTimestamp
              : null,

          endTimestamp:
            Number.isFinite(
              endTimestamp
            )
              ? endTimestamp
              : null,

          startDate:
            customStartDate,

          endDate:
            customEndDate,
        };
      }

      const presetStart =
        getPresetStartDate(range);

      const presetEnd = new Date();

      presetEnd.setHours(
        23,
        59,
        59,
        999
      );

      return {
        startTimestamp:
          presetStart?.getTime() ??
          null,

        endTimestamp:
          presetEnd.getTime(),

        startDate:
          getDateInputValue(
            presetStart
          ),

        endDate:
          getDateInputValue(
            presetEnd
          ),
      };
    }, [
      range,
      customStartDate,
      customEndDate,
    ]);

  /* =======================================================
     FILTERED TRANSACTIONS
  ======================================================= */

  const filteredTransactions =
    useMemo(() => {
      return transactions.filter(
        (transaction) => {
          if (range === "all") {
            return true;
          }

          const timestamp =
            getTransactionTimestamp(
              transaction
            );

          if (!timestamp) {
            return false;
          }

          if (
            resolvedRange.startTimestamp &&
            timestamp <
              resolvedRange.startTimestamp
          ) {
            return false;
          }

          if (
            resolvedRange.endTimestamp &&
            timestamp >
              resolvedRange.endTimestamp
          ) {
            return false;
          }

          return true;
        }
      );
    }, [
      transactions,
      range,
      resolvedRange,
    ]);

  /* =======================================================
     HANDLERS
  ======================================================= */

  const handleRangeChange = (
    nextRange
  ) => {
    setRange(nextRange);

    if (nextRange === "custom") {
      if (!customStartDate) {
        setCustomStartDate(
          initialStart
        );
      }

      if (!customEndDate) {
        setCustomEndDate(
          today
        );
      }
    }
  };

  const handleResetRange = () => {
    setRange("all");

    setCustomStartDate(
      initialStart
    );

    setCustomEndDate(today);
  };

  /* =======================================================
     SHARED ANALYTICS PROPS
  ======================================================= */

  const analyticsProps = {
    transactions:
      filteredTransactions,

    allTransactions:
      transactions,

    range,

    startDate:
      resolvedRange.startDate,

    endDate:
      resolvedRange.endDate,
  };

  return (
    <section className="min-w-0 space-y-6 pt-10">
      {/* Analytics header */}

      <SectionReveal>
        <AnalyticsHeader
          {...analyticsProps}
        />
      </SectionReveal>

      {/* Date range controls */}

      <SectionReveal delay={0.04}>
        <AnalyticsRangeControls
          range={range}
          onRangeChange={
            handleRangeChange
          }
          startDate={
            customStartDate
          }
          onStartDateChange={
            setCustomStartDate
          }
          endDate={
            customEndDate
          }
          onEndDateChange={
            setCustomEndDate
          }
          totalCount={
            transactions.length
          }
          filteredCount={
            filteredTransactions.length
          }
          onReset={
            handleResetRange
          }
        />
      </SectionReveal>

      {/* Summary cards */}

      <SectionReveal delay={0.07}>
        <AnalyticsSummary
          {...analyticsProps}
        />
      </SectionReveal>

      {/* Financial overview */}

      <SectionReveal delay={0.1}>
        <AnalyticsOverview
          {...analyticsProps}
        />
      </SectionReveal>

      {/* Primary charts */}

      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        <SectionReveal
          delay={0.12}
          className="min-w-0"
        >
          <IncomeExpenseChart
            {...analyticsProps}
          />
        </SectionReveal>

        <SectionReveal
          delay={0.14}
          className="min-w-0"
        >
          <ExpensePieChart
            {...analyticsProps}
          />
        </SectionReveal>
      </div>

      {/* Trend charts */}

      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        <SectionReveal
          delay={0.16}
          className="min-w-0"
        >
          <MonthlyTrendChart
            {...analyticsProps}
          />
        </SectionReveal>

        <SectionReveal
          delay={0.18}
          className="min-w-0"
        >
          <SavingsTrendChart
            {...analyticsProps}
          />
        </SectionReveal>
      </div>

      {/* Category analytics */}

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <SectionReveal
          delay={0.2}
          className="min-w-0"
        >
          <CategoryPieChart
            {...analyticsProps}
          />
        </SectionReveal>

        <SectionReveal
          delay={0.22}
          className="min-w-0"
        >
          <TopCategories
            {...analyticsProps}
          />
        </SectionReveal>
      </div>

      {/* Financial health */}

      <SectionReveal
        delay={0.24}
        className="min-w-0"
      >
        <FinancialHealth
          {...analyticsProps}
        />
      </SectionReveal>

      {/* Premium smart insights */}

      <SectionReveal
        delay={0.26}
        className="min-w-0"
      >
        <SmartInsights
          {...analyticsProps}
        />
      </SectionReveal>

      {/* Recent activity */}

      <SectionReveal
        delay={0.28}
        className="min-w-0"
      >
        <RecentActivity
          {...analyticsProps}
        />
      </SectionReveal>

      {/* Export analytics */}

      <SectionReveal
        delay={0.3}
        className="min-w-0"
      >
        <ExportAnalytics
          {...analyticsProps}
        />
      </SectionReveal>
    </section>
  );
}

export default Analytics;