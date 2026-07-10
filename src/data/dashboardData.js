import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from "lucide-react";

export const dashboardStats = [
  {
    id: 1,
    title: "Total Balance",
    amount: 154230,
    icon: Wallet,
    color: "from-blue-500 to-cyan-500",
    change: "+12.4%",
    status: "positive",
  },
  {
    id: 2,
    title: "Income",
    amount: 98600,
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
    change: "+8.2%",
    status: "positive",
  },
  {
    id: 3,
    title: "Expenses",
    amount: 42350,
    icon: TrendingDown,
    color: "from-red-500 to-rose-500",
    change: "-3.1%",
    status: "negative",
  },
  {
    id: 4,
    title: "Savings",
    amount: 55880,
    icon: PiggyBank,
    color: "from-purple-500 to-fuchsia-500",
    change: "+18%",
    status: "positive",
  },
];