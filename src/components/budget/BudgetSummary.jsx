import Card from "../common/Card";
import useBudget from "../../hooks/useBudget";
import useFinance from "../../hooks/useFinance";

function BudgetSummary() {
  const { budgets } = useBudget();
  const { transactions } = useFinance();

  const totalBudget = budgets.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const totalSpent = transactions
    .filter((item) => item.type === "expense")
    .reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

  const remaining = totalBudget - totalSpent;

  return (
    <Card>
      <h2 className="mb-6 text-2xl font-bold text-white">
        Budget Summary
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <p className="text-slate-400">Budget</p>
          <h2 className="text-3xl font-bold text-green-400">
            ₹{totalBudget.toLocaleString("en-IN")}
          </h2>
        </div>

        <div>
          <p className="text-slate-400">Spent</p>
          <h2 className="text-3xl font-bold text-red-400">
            ₹{totalSpent.toLocaleString("en-IN")}
          </h2>
        </div>

        <div>
          <p className="text-slate-400">Remaining</p>
          <h2
            className={`text-3xl font-bold ${
              remaining >= 0
                ? "text-cyan-400"
                : "text-red-500"
            }`}
          >
            ₹{remaining.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>
    </Card>
  );
}

export default BudgetSummary;