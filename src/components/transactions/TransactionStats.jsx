import {
  ArrowDownRight,
  ArrowUpRight,
  ReceiptText,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import useFinance from "../../hooks/useFinance";
import AnimatedNumber from "../common/AnimatedNumber";
import PremiumCard from "../common/PremiumCard";
import PremiumGrid from "../common/PremiumGrid";

function TransactionStats() {
  const {
    summary = {},
    transactions = [],
  } = useFinance();

  const totalIncome =
    Number(summary?.income) || 0;

  const totalExpense =
    Number(summary?.expense) || 0;

  const stats = [
    {
      title: "Total Transactions",
      value: transactions.length,
      prefix: "",
      icon: ReceiptText,
      valueClass:
        "text-blue-600 dark:text-blue-400",
      iconClass:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      trend: "All transaction records",
      trendIcon: null,
      trendClass:
        "text-slate-500 dark:text-slate-400",
    },
    {
      title: "Total Income",
      value: totalIncome,
      prefix: "₹",
      icon: TrendingUp,
      valueClass:
        "text-emerald-600 dark:text-emerald-400",
      iconClass:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      trend: "Money received",
      trendIcon: ArrowUpRight,
      trendClass:
        "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Total Expenses",
      value: totalExpense,
      prefix: "₹",
      icon: TrendingDown,
      valueClass:
        "text-rose-600 dark:text-rose-400",
      iconClass:
        "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      trend: "Money spent",
      trendIcon: ArrowDownRight,
      trendClass:
        "text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <PremiumGrid size="small">
      {stats.map((item, index) => {
        const Icon = item.icon;
        const TrendIcon = item.trendIcon;

        return (
          <PremiumCard
            key={item.title}
            delay={index * 0.06}
            className="min-h-[170px]"
          >
            <div className="flex h-full items-start justify-between gap-4">
              {/* Content */}
              <div className="min-w-0">
                <p className="metric-label">
                  {item.title}
                </p>

                <AnimatedNumber
                  value={item.value}
                  prefix={item.prefix}
                  className={[
                    "mt-4 block",
                    "text-2xl font-black",
                    "tracking-tight sm:text-3xl",
                    item.valueClass,
                  ].join(" ")}
                />

                <p
                  className={[
                    "mt-4 flex items-center gap-1.5",
                    "text-xs font-medium",
                    item.trendClass,
                  ].join(" ")}
                >
                  {TrendIcon && (
                    <TrendIcon
                      size={15}
                      strokeWidth={2.2}
                    />
                  )}

                  {item.trend}
                </p>
              </div>

              {/* Icon */}
              <div
                className={[
                  "flex size-12 shrink-0",
                  "items-center justify-center",
                  "rounded-2xl",
                  item.iconClass,
                ].join(" ")}
              >
                <Icon
                  size={23}
                  strokeWidth={2}
                />
              </div>
            </div>
          </PremiumCard>
        );
      })}
    </PremiumGrid>
  );
}

export default TransactionStats;