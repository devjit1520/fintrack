import { motion } from "framer-motion";
// import CountUp from "react-countup";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";
import useBudget from "../../hooks/useBudget";
import useGoal from "../../hooks/useGoal";

function FinancialHealth() {
  const { transactions } = useFinance();
  const { budgets } = useBudget();
  const { goals } = useGoal();

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expense;

  const savingsRate =
    income > 0 ? (balance / income) * 100 : 0;

  const totalBudget = budgets.reduce(
    (sum, b) => sum + Number(b.amount),
    0
  );

  const budgetUsage =
    totalBudget > 0
      ? (expense / totalBudget) * 100
      : 0;

  const completedGoals = goals.filter(
    (g) => Number(g.saved) >= Number(g.target)
  ).length;

  const goalScore =
    goals.length > 0
      ? (completedGoals / goals.length) * 100
      : 100;

  let score = 0;

  score += Math.min(savingsRate, 40);
  score += Math.max(0, 30 - Math.max(0, budgetUsage - 70));
  score += goalScore * 0.3;

  score = Math.max(0, Math.min(100, score));

  const status =
    score >= 80
      ? "Excellent"
      : score >= 60
      ? "Good"
      : score >= 40
      ? "Fair"
      : "Needs Improvement";

  const color =
    score >= 80
      ? "#22c55e"
      : score >= 60
      ? "#3b82f6"
      : score >= 40
      ? "#f59e0b"
      : "#ef4444";

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">

        <h2 className="mb-8 text-2xl font-bold text-white">
          Financial Health
        </h2>

        <div className="grid gap-8 lg:grid-cols-2">

          <div className="mx-auto w-48">

            <CircularProgressbar
              value={score}
              text={`${Math.round(score)}`}
              styles={buildStyles({
                pathColor: color,
                textColor: "#fff",
                trailColor: "#1e293b",
              })}
            />

          </div>

          <div className="space-y-5">

            <div>
              <p className="text-slate-400">
                Status
              </p>

              <h2
                className="text-3xl font-bold"
                style={{ color }}
              >
                {status}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-5">

              <div>

                <p className="text-slate-400">
                  Savings Rate
                </p>

                <h3 className="text-xl font-bold text-green-400">
                  {savingsRate.toFixed(1)}%
                </h3>

              </div>

              <div>

                <p className="text-slate-400">
                  Budget Used
                </p>

                <h3 className="text-xl font-bold text-red-400">
                  {budgetUsage.toFixed(1)}%
                </h3>

              </div>

              <div>

                <p className="text-slate-400">
                  Balance
                </p>

                <h3 className="text-xl font-bold text-cyan-400">
                  ₹{balance.toLocaleString("en-IN")}
                </h3>

              </div>

              <div>

                <p className="text-slate-400">
                  Goals Completed
                </p>

                <h3 className="text-xl font-bold text-yellow-400">
                  {completedGoals}/{goals.length}
                </h3>

              </div>

            </div>

          </div>

        </div>

      </Card>
    </motion.div>
  );
}

export default FinancialHealth;