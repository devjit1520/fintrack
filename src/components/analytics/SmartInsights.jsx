import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function SmartInsights() {
  const { transactions } = useFinance();

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + Number(b.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + Number(b.amount), 0);

  const balance = income - expense;

  const insights = [];

  if (income === 0)
    insights.push("💰 Add an income transaction to start tracking earnings.");

  if (expense > income)
    insights.push("⚠️ Your expenses are higher than your income.");

  if (balance > 0)
    insights.push("🎉 Great job! You are saving money.");

  if (expense < income * 0.5 && income > 0)
    insights.push("🏆 Excellent expense management this month.");

  if (transactions.length < 5)
    insights.push("📈 Add more transactions for better analytics.");

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Smart Insights
      </h2>

      <div className="space-y-4">
        {insights.map((item, index) => (
          <div
            key={index}
            className="rounded-xl bg-slate-800/40 p-4 text-slate-200"
          >
            {item}
          </div>
        ))}
      </div>
    </Card>
  );
}

export default SmartInsights;