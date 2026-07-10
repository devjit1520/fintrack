import Card from "../common/Card";

const tips = [
  "💰 Save at least 20% of your monthly income.",
  "📈 Review your spending every week.",
  "🎯 Set realistic financial goals.",
  "💳 Avoid unnecessary subscriptions.",
];

function FinanceTips() {
  const randomTip =
    tips[Math.floor(Math.random() * tips.length)];

  return (
    <Card>
      <h2 className="text-xl font-bold">
        Smart Finance Tip
      </h2>

      <p className="mt-4 text-slate-300">
        {randomTip}
      </p>
    </Card>
  );
}

export default FinanceTips;