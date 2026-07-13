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
      <div
        className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${color} opacity-10 blur-3xl`}
      />

      <div className="relative flex items-center justify-between">

        {/* Left */}
        <div>

          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            ₹
            <CountUp
              end={Number(amount)}
              separator=","
              duration={1.5}
            />
          </h2>

          <div
            className={`mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
              status === "positive"
                ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
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

        {/* Right Icon */}
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg`}
        >
          <Icon
            size={30}
            className="text-white"
          />
        </div>

      </div>
    </Card>
  );
}

export default StatsCard;