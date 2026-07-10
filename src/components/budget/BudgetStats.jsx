import Card from "../common/Card";
import useBudget from "../../hooks/useBudget";

function BudgetStats() {
  const { budgets, totalBudget } = useBudget();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <h3 className="text-slate-400">
          Total Budgets
        </h3>

        <h2 className="mt-4 text-4xl font-bold text-white">
          {budgets.length}
        </h2>
      </Card>

      <Card>
        <h3 className="text-slate-400">
          Total Budget
        </h3>

        <h2 className="mt-4 text-4xl font-bold text-green-400">
          ₹{totalBudget.toLocaleString("en-IN")}
        </h2>
      </Card>
    </div>
  );
}

export default BudgetStats;