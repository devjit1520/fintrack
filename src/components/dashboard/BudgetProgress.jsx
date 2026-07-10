import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function BudgetProgress() {
  const { summary } = useFinance();

  // You can later make this user-configurable
  const monthlyBudget = 50000;

  const spent = summary.expense;

  const percentage = Math.min(
    (spent / monthlyBudget) * 100,
    100
  );

  const remaining = monthlyBudget - spent;

  const progressColor =
    percentage < 50
      ? "bg-green-500"
      : percentage < 80
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <Card>
      <h2 className="text-xl font-bold text-white">
        Monthly Budget
      </h2>

      <p className="mt-2 text-slate-400">
        ₹{spent.toLocaleString()} spent of ₹
        {monthlyBudget.toLocaleString()}
      </p>

      <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`${progressColor} h-full rounded-full transition-all duration-700`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <div className="mt-5 flex justify-between text-sm">
        <span className="text-slate-400">
          {percentage.toFixed(1)}% Used
        </span>

        <span className="font-semibold text-green-400">
          ₹{remaining.toLocaleString()} Left
        </span>
      </div>
    </Card>
  );
}

export default BudgetProgress;