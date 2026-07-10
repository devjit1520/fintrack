import IncomeExpenseChart from "./IncomeExpenseChart";
import ExpensePieChart from "./ExpensePieChart";

function AnalyticsOverview() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <IncomeExpenseChart />

      <ExpensePieChart />
    </div>
  );
}

export default AnalyticsOverview;