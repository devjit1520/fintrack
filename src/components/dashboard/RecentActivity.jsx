import {
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function RecentActivity() {
  const { transactions } = useFinance();

  const recent = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.date) - new Date(a.date)
    )
    .slice(0, 6);

  return (
    <Card>
      <h2 className="mb-6 text-xl font-bold text-white">
        Recent Activity
      </h2>

      {recent.length === 0 ? (
        <p className="text-slate-400">
          No recent activity.
        </p>
      ) : (
        <div className="space-y-5">
          {recent.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${
                    item.type === "income"
                      ? "bg-green-500/20"
                      : "bg-red-500/20"
                  }`}
                >
                  {item.type === "income" ? (
                    <ArrowDownLeft
                      className="text-green-400"
                      size={20}
                    />
                  ) : (
                    <ArrowUpRight
                      className="text-red-400"
                      size={20}
                    />
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-400">
                    {item.category}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`font-bold ${
                    item.type === "income"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {item.type === "income"
                    ? "+"
                    : "-"}
                  ₹
                  {Number(
                    item.amount
                  ).toLocaleString("en-IN")}
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

export default RecentActivity;