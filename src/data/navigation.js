import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Target,
  BarChart3,
  Settings,
} from "lucide-react";

export const navigation = [
  {
    id: 1,
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    id: 2,
    title: "Transactions",
    path: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    id: 3,
    title: "Budget",
    path: "/budget",
    icon: Wallet,
  },
  {
    id: 4,
    title: "Goals",
    path: "/goals",
    icon: Target,
  },
  {
    id: 5,
    title: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  // {
  //   id: 6,
  //   title: "Settings",
  //   path: "/settings",
  //   icon: Settings,
  // },
];