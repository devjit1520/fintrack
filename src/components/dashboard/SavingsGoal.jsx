import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function SavingsGoal() {
  const { summary } = useFinance();

  const goal = 100000;

  const savings = summary.savings;

  const progress = Math.min(
    (savings / goal) * 100,
    100
  );

  return (
    <Card>
      <h2 className="text-xl font-bold text-white">
        Savings Goal
      </h2>

      <p className="mt-2 text-slate-400">
        ₹{savings.toLocaleString()} / ₹
        {goal.toLocaleString()}
      </p>

      <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-700"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <p className="mt-5 text-right text-sm text-blue-400">
        {progress.toFixed(1)}% Complete
      </p>
    </Card>
  );
}

export default SavingsGoal;