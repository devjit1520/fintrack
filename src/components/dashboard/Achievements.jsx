import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function Achievements() {
  const { transactions } = useFinance();

  const badges = [
    {
      title: "First Transaction",
      unlocked: transactions.length >= 1,
    },
    {
      title: "10 Transactions",
      unlocked: transactions.length >= 10,
    },
    {
      title: "50 Transactions",
      unlocked: transactions.length >= 50,
    },
  ];

  return (
    <Card>
      <h2 className="mb-6 text-xl font-bold">
        Achievements
      </h2>

      <div className="space-y-4">
        {badges.map((badge) => (
          <div
            key={badge.title}
            className="flex items-center justify-between rounded-xl bg-slate-800 p-4"
          >
            <span>{badge.title}</span>

            <span
              className={`font-bold ${
                badge.unlocked
                  ? "text-green-400"
                  : "text-slate-500"
              }`}
            >
              {badge.unlocked
                ? "Unlocked"
                : "Locked"}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default Achievements;