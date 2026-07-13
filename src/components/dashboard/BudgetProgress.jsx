import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";
import { Wallet } from "lucide-react";

function BudgetProgress() {
  const { summary } = useFinance();

  const monthlyBudget = 50000;

  const spent = summary.expense;

  const percentage = Math.min(
    (spent / monthlyBudget) * 100,
    100
  );

  const remaining = Math.max(monthlyBudget - spent, 0);

  const progressColor =
    percentage < 50
      ? "from-green-500 to-emerald-600"
      : percentage < 80
      ? "from-yellow-500 to-orange-500"
      : "from-red-500 to-pink-600";

  return (
    <Card
      className="
        relative
        overflow-hidden

        bg-white
        dark:bg-slate-900

        border-slate-200
        dark:border-slate-800
      "
    >
      {/* Background Glow */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-green-500/10 blur-3xl" />

      <div className="relative">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Monthly Budget
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              ₹{monthlyBudget.toLocaleString("en-IN")}
            </h2>

          </div>

          <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-4 shadow-lg">
            <Wallet
              size={28}
              className="text-white"
            />
          </div>

        </div>

        <div className="mt-6">

          <div className="mb-2 flex justify-between text-sm">

            <span className="text-slate-500 dark:text-slate-400">
              Spent
            </span>

            <span className="font-semibold text-slate-900 dark:text-white">
              ₹{spent.toLocaleString("en-IN")}
            </span>

          </div>

          <div className="h-4 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">

            <div
              className={`h-full rounded-full bg-gradient-to-r ${progressColor} transition-all duration-700`}
              style={{
                width: `${percentage}%`,
              }}
            />

          </div>

        </div>

        <div className="mt-6 flex items-center justify-between">

          <div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Budget Used
            </p>

            <h3 className="font-bold text-slate-900 dark:text-white">
              {percentage.toFixed(1)}%
            </h3>

          </div>

          <div className="text-right">

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Remaining
            </p>

            <h3 className="font-bold text-green-500">
              ₹{remaining.toLocaleString("en-IN")}
            </h3>

          </div>

        </div>

      </div>
    </Card>
  );
}

export default BudgetProgress;