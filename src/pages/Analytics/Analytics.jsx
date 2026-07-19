import {
  lazy,
  Suspense,
  useMemo,
  useState,
} from "react";

import useFinance from "../../hooks/useFinance";

import AnalyticsHeader from "../../components/analytics/AnalyticsHeader";
import AnalyticsRangeControls from "../../components/analytics/AnalyticsRangeControls";
import AnalyticsSummary from "../../components/analytics/AnalyticsSummary";
import AnalyticsOverview from "../../components/analytics/AnalyticsOverview";

import TopCategories from "../../components/analytics/TopCategories";
import FinancialHealth from "../../components/analytics/FinancialHealth";
import SmartInsights from "../../components/analytics/SmartInsights";
import RecentActivity from "../../components/analytics/RecentActivity";
import ExportAnalytics from "../../components/analytics/ExportAnalytics";

import SectionReveal from "../../components/common/SectionReveal";
import ChartSkeleton from "../../components/common/ChartSkeleton";
import DeferredRender from "../../components/common/DeferredRender";

/* =========================================================
   LAZY CHARTS
========================================================= */

const ExpensePieChart = lazy(
  () =>
    import(
      "../../components/analytics/ExpensePieChart"
    )
);

const IncomeExpenseChart = lazy(
  () =>
    import(
      "../../components/analytics/IncomeExpenseChart"
    )
);

const MonthlyTrendChart = lazy(
  () =>
    import(
      "../../components/analytics/MonthlyTrendChart"
    )
);

const SavingsTrendChart = lazy(
  () =>
    import(
      "../../components/analytics/SavingsTrendChart"
    )
);

const CategoryPieChart = lazy(
  () =>
    import(
      "../../components/analytics/CategoryPieChart"
    )
);

/* =========================================================
   DATE HELPERS
========================================================= */

function getDateInputValue(date) {
  if (
    !(date instanceof Date)
  ) {
    return "";
  }

  const year =
    date.getFullYear();

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
    transaction?.created_at ||
    transaction?.updatedAt ||
    transaction?.updated_at;

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
   CHART SECTION FALLBACK
========================================================= */

function TwoChartFallback() {
  return (
    <div
      className="
        grid
        min-w-0
        gap-6
        xl:grid-cols-2
      "
    >
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
  );
}

/* =========================================================
   ANALYTICS
========================================================= */

function Analytics() {
  const finance =
    useFinance() || {};

  const {
    transactions:
      rawTransactions = [],
  } = finance;

  const transactions =
    Array.isArray(
      rawTransactions
    )
      ? rawTransactions
      : [];

  const [range, setRange] =
    useState("6m");

  const initialStart =
    useMemo(() => {
      return getDateInputValue(
        getPresetStartDate(
          "6m"
        )
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

      const presetEnd =
        new Date();

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

  const filteredTransactions =
    useMemo(() => {
      if (range === "all") {
        return transactions;
      }

      return transactions.filter(
        (transaction) => {
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

  const handleRangeChange = (
    nextRange
  ) => {
    setRange(nextRange);

    if (
      nextRange === "custom"
    ) {
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

  const analyticsProps =
    useMemo(
      () => ({
        transactions:
          filteredTransactions,

        allTransactions:
          transactions,

        range,

        startDate:
          resolvedRange.startDate,

        endDate:
          resolvedRange.endDate,
      }),
      [
        filteredTransactions,
        transactions,
        range,
        resolvedRange.startDate,
        resolvedRange.endDate,
      ]
    );

  return (
    <section
      className="
        min-w-0
        space-y-6
        pt-4
        sm:pt-6
      "
    >
      <SectionReveal>
        <AnalyticsHeader
          {...analyticsProps}
        />
      </SectionReveal>

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

      <SectionReveal delay={0.07}>
        <AnalyticsSummary
          {...analyticsProps}
        />
      </SectionReveal>



      {/* Primary charts */}

      <DeferredRender
        rootMargin="650px 0px"
        minHeight={320}
        fallback={
          <TwoChartFallback />
        }
      >
        <div
          className="
            grid
            min-w-0
            gap-6
            xl:grid-cols-2
          "
        >
          <SectionReveal
            delay={0.12}
            className="min-w-0"
          >
            <Suspense
              fallback={
                <ChartSkeleton />
              }
            >
              <IncomeExpenseChart
                {...analyticsProps}
              />
            </Suspense>
          </SectionReveal>

          <SectionReveal
            delay={0.14}
            className="min-w-0"
          >
            <Suspense
              fallback={
                <ChartSkeleton />
              }
            >
              <ExpensePieChart
                {...analyticsProps}
              />
            </Suspense>
          </SectionReveal>
        </div>
      </DeferredRender>

      {/* Trend charts */}

      <DeferredRender
        rootMargin="650px 0px"
        minHeight={320}
        fallback={
          <TwoChartFallback />
        }
      >
        <div
          className="
            grid
            min-w-0
            gap-6
            xl:grid-cols-2
          "
        >
          <SectionReveal
            delay={0.08}
            className="min-w-0"
          >
            <Suspense
              fallback={
                <ChartSkeleton />
              }
            >
              <MonthlyTrendChart
                {...analyticsProps}
              />
            </Suspense>
          </SectionReveal>

          <SectionReveal
            delay={0.1}
            className="min-w-0"
          >
            <Suspense
              fallback={
                <ChartSkeleton />
              }
            >
              <SavingsTrendChart
                {...analyticsProps}
              />
            </Suspense>
          </SectionReveal>
        </div>
      </DeferredRender>

      {/* Category analytics */}

      <DeferredRender
        rootMargin="650px 0px"
        minHeight={320}
        fallback={
          <div
            className="
              grid
              min-w-0
              gap-6
              xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]
            "
          >
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        }
      >
        <div
          className="
            grid
            min-w-0
            gap-6
            xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]
          "
        >
          <SectionReveal
            delay={0.08}
            className="min-w-0"
          >
            <Suspense
              fallback={
                <ChartSkeleton />
              }
            >
              <CategoryPieChart
                {...analyticsProps}
              />
            </Suspense>
          </SectionReveal>

          <SectionReveal
            delay={0.1}
            className="min-w-0"
          >
            <TopCategories
              {...analyticsProps}
            />
          </SectionReveal>
        </div>
      </DeferredRender>

      <SectionReveal
        delay={0.1}
        className="min-w-0"
      >
        <FinancialHealth
          {...analyticsProps}
        />
      </SectionReveal>

      <SectionReveal
        delay={0.12}
        className="min-w-0"
      >
        <SmartInsights
          {...analyticsProps}
        />
      </SectionReveal>

      <SectionReveal
        delay={0.14}
        className="min-w-0"
      >
        <RecentActivity
          {...analyticsProps}
        />
      </SectionReveal>

      <SectionReveal
        delay={0.16}
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