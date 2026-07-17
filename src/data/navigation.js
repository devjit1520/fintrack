import {
  ArrowLeftRight,
  BarChart3,
  LayoutDashboard,
  Target,
  WalletCards,
} from "lucide-react";

export const navigation = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "transactions",
    label: "Transactions",
    path: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    id: "budget",
    label: "Budget",
    path: "/budget",
    icon: WalletCards,
  },
  {
    id: "goals",
    label: "Goals",
    path: "/goals",
    icon: Target,
  },
  {
    id: "analytics",
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
];

export default navigation;