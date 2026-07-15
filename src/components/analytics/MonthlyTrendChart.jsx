import { useMemo } from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  TrendingUp,
} from "lucide-react";

import useFinance from "../../hooks/useFinance";

function formatCurrency(value) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(Number(value || 0));
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function CustomTooltip({
  active,
  payload,
  label,
}) {
  if (
    !active ||
    !payload ||
    !payload.length
  )
    return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">

      <h4 className="font-bold">
        {label}
      </h4>

      <p className="mt-2 text-green-500">
        Income :
        {formatCurrency(
          payload[0].value
        )}
      </p>

      <p className="text-red-500">
        Expense :
        {formatCurrency(
          payload[1].value
        )}
      </p>

    </div>
  );
}

function MonthlyTrendChart() {

  const {
    transactions=[],
    loading,
  } = useFinance();

  const data = useMemo(()=>{

    const monthly =
      months.map((month)=>({

        month,

        income:0,

        expense:0,

      }));

    transactions.forEach((t)=>{

      const date =
        new Date(
          t.date
        );

      const index =
        date.getMonth();

      if(
        t.type==="income"
      ){

        monthly[index].income+=
          Number(t.amount);

      }

      else{

        monthly[index].expense+=
          Number(t.amount);

      }

    });

    return monthly;

  },[transactions]);

  if(loading){

    return(

<div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">

<div className="h-80 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800"/>

</div>

    );

  }

  return(

<section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

<div className="mb-6 flex items-center justify-between">

<div className="flex items-center gap-3">

<div className="rounded-2xl bg-cyan-500/10 p-3">

<TrendingUp
size={24}
className="text-cyan-500"
/>

</div>

<div>

<h2 className="text-2xl font-bold text-slate-900 dark:text-white">

Monthly Trend

</h2>

<p className="text-sm text-slate-500">

Income vs Expense Comparison

</p>

</div>

</div>

</div>

<div className="h-[350px]">

<ResponsiveContainer>

<AreaChart
data={data}
>

<defs>

<linearGradient
id="income"
x1="0"
y1="0"
x2="0"
y2="1"
>

<stop
offset="5%"
stopColor="#22c55e"
stopOpacity={0.35}
/>

<stop
offset="95%"
stopColor="#22c55e"
stopOpacity={0}
/>

</linearGradient>

<linearGradient
id="expense"
x1="0"
y1="0"
x2="0"
y2="1"
>

<stop
offset="5%"
stopColor="#ef4444"
stopOpacity={0.35}
/>

<stop
offset="95%"
stopColor="#ef4444"
stopOpacity={0}
/>

</linearGradient>

</defs>

<CartesianGrid
strokeDasharray="4"
/>

<XAxis
dataKey="month"
/>

<YAxis/>

<Tooltip
content={<CustomTooltip/>}
/>

<Area
type="monotone"
dataKey="income"
stroke="#22c55e"
strokeWidth={3}
fill="url(#income)"
/>

<Area
type="monotone"
dataKey="expense"
stroke="#ef4444"
strokeWidth={3}
fill="url(#expense)"
/>

</AreaChart>

</ResponsiveContainer>

</div>

</section>

  );

}

export default MonthlyTrendChart;