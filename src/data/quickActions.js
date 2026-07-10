import {
  Plus,
  Wallet,
  Target,
  Download,
} from "lucide-react";

export const quickActions = [
  {
    id: 1,
    title: "Add Income",
    icon: Plus,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 2,
    title: "Add Expense",
    icon: Wallet,
    color: "from-red-500 to-rose-500",
  },
  {
    id: 3,
    title: "Set Goal",
    icon: Target,
    color: "from-purple-500 to-fuchsia-500",
  },
  {
    id: 4,
    title: "Export Data",
    icon: Download,
    color: "from-blue-500 to-cyan-500",
  },
];