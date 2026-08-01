import {
  BarChart3,
  LayoutDashboard,
  Landmark,
  ReceiptText,
  Target,
  WalletCards,
} from "lucide-react";

/* =========================================================
   MAIN APPLICATION NAVIGATION
========================================================= */

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    description:
      "View your financial overview",
  },

  {
    id: "transactions",
    label: "Transactions",
    path: "/transactions",
    icon: ReceiptText,
    description:
      "Manage income and expenses",
  },

  {
    id: "budget",
    label: "Budget",
    path: "/budget",
    icon: WalletCards,
    description:
      "Plan and monitor budgets",
  },

  {
    id: "goals",
    label: "Goals",
    path: "/goals",
    icon: Target,
    description:
      "Track financial goals",
  },

  {
    id: "analytics",
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
    description:
      "Review financial analytics",
  },

  {
    id: "debt-center",
    label: "Debt Center",
    path: "/debt-center",
    icon: Landmark,
    description:
      "Manage loans and repayments",
  },
];

export const navigation =
  navigationItems;

export { navigationItems };

export default navigationItems;