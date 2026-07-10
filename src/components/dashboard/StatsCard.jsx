import CountUp from "react-countup";
import {
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import Card from "../common/Card";

function StatsCard({
  title,
  amount,
  icon: Icon,
  color,
  change,
  status,
}) {
  return (
    <div className="border rounded-3xl p-6 bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-white">
            ₹
            {amount}
          </h2>

          <div
            className={`mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
              status === "positive"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {status === "positive" ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}

            {change}
          </div>
        </div>

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color}`}
        >
          <Icon
            size={30}
            className="text-white"
            />
        </div>
      </div>
    </div>
  );
}

export default StatsCard;