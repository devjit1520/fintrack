import { Link } from "react-router-dom";
import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function RecentTransactions() {
  const { transactions } = useFinance();

  const recentTransactions = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.date) -
        new Date(a.createdAt || a.date)
    )
    .slice(0, 5);

  return (
    <Card>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Recent Transactions
          </h2>

          <p className="text-sm text-slate-400">
            Latest activity
          </p>
        </div>

        <Link
          to="/transactions"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
        >
          View All
        </Link>
      </div>

      {recentTransactions.length === 0 ? (
        <div className="py-10 text-center text-slate-400">
          No transactions yet.
        </div>
      ) : (
        <div className="space-y-4">
          {recentTransactions.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-800/40 p-4"
            >
              <div>
                <h3 className="font-semibold text-white">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-400">
                  {item.category}
                </p>
              </div>

              <div className="text-right">
                <p
                  className={`font-bold ${
                    item.type === "income"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {item.type === "income" ? "+" : "-"}₹
                  {Number(item.amount).toLocaleString("en-IN")}
                </p>

                <p className="text-xs text-slate-500">
                  {item.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default RecentTransactions;