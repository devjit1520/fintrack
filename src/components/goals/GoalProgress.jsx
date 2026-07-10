import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function GoalProgress() {
  const { summary } = useFinance();

  const goal =
    JSON.parse(localStorage.getItem("goal")) || null;

  if (!goal || !goal.amount) return null;

  const current = summary.savings;
  const target = Number(goal.amount);

  const percentage = Math.min(
    (current / target) * 100,
    100
  );

  return (
    <Card>
      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-white">
            {goal.title}
          </h2>

          <p className="mt-2 text-slate-400">
            ₹{current.toLocaleString("en-IN")} /
            ₹{target.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-full bg-blue-500/20 px-4 py-2 text-blue-400 font-semibold">
          {percentage.toFixed(0)}%
        </div>

      </div>

      <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-800">

        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

      {percentage >= 100 && (
        <div className="mt-6 rounded-xl bg-green-500/20 p-4 text-center font-semibold text-green-400">
          🎉 Congratulations! Goal Achieved
        </div>
      )}
    </Card>
  );
}

export default GoalProgress;