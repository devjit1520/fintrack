import { useRef } from "react";

import AnalyticsHeader from "../../components/analytics/AnalyticsHeader";
import AnalyticsSummary from "../../components/analytics/AnalyticsSummary";
import IncomeExpenseChart from "../../components/analytics/IncomeExpenseChart";
import MonthlyTrendChart from "../../components/analytics/MonthlyTrendChart";
import CategoryPieChart from "../../components/analytics/CategoryPieChart";
import TopCategories from "../../components/analytics/TopCategories";
import FinancialHealth from "../../components/analytics/FinancialHealth";
import RecentActivity from "../../components/analytics/RecentActivity";
import SmartInsights from "../../components/analytics/SmartInsights";
import ExportAnalytics from "../../components/analytics/ExportAnalytics";

function Analytics() {
  const analyticsRef = useRef(null);

  return (
    <>
      <section
        ref={analyticsRef}
        className="space-y-8"
      >
        <AnalyticsHeader />

        <AnalyticsSummary />

        <div className="grid gap-8 xl:grid-cols-2">
          <IncomeExpenseChart />
          <MonthlyTrendChart />
        </div>

        <div className="grid gap-8 xl:grid-cols-2">
          <CategoryPieChart />
          <TopCategories />
        </div>

        <FinancialHealth />

        <div className="grid gap-8 xl:grid-cols-2">
          <RecentActivity />
          <SmartInsights />
        </div>
      </section>

      <div className="mt-8">
        <ExportAnalytics analyticsRef={analyticsRef} />
      </div>
    </>
  );
}

export default Analytics;