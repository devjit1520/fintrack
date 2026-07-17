import { useState } from "react";

import {
  Activity,
  BarChart3,
  CreditCard,
  Target,
} from "lucide-react";

import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import PremiumStats from "../../components/dashboard/PremiumStats";
import AnalyticsCards from "../../components/dashboard/AnalyticsCards";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import ExpenseByCategory from "../../components/dashboard/ExpenseByCategory";
import BudgetProgress from "../../components/dashboard/BudgetProgress";
import FinancialInsights from "../../components/dashboard/FinancialInsights";
import FinanceTips from "../../components/dashboard/FinanceTips";
import Achievements from "../../components/dashboard/Achievements";
import RecentActivity from "../../components/dashboard/RecentActivity";

import MonthlyTrendChart from "../../components/analytics/MonthlyTrendChart";

import SavingsGoal from "../../components/goals/SavingsGoal";
import GoalModal from "../../components/goals/GoalModal";

import AddTransactionForm from "../../components/transactions/AddTransactionForm";
import EditTransactionModal from "../../components/transactions/EditTransactionModal";
import TransactionTable from "../../components/transactions/TransactionTable";

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div
      className="
        flex
        flex-col
        gap-3
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      <div className="flex items-start gap-3">
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border
            border-cyan-500/20
            bg-cyan-500/10
            text-cyan-500
          "
        >
          <Icon size={21} />
        </div>

        <div>
          <h2
            className="
              text-xl
              font-bold
              text-slate-900
              dark:text-white
              md:text-2xl
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const [
    editingTransaction,
    setEditingTransaction,
  ] = useState(null);

  const [
    transactionModalOpen,
    setTransactionModalOpen,
  ] = useState(false);

  const [defaultType, setDefaultType] =
    useState("expense");

  const [
    goalModalOpen,
    setGoalModalOpen,
  ] = useState(false);

  /* =======================================================
     TRANSACTION MODAL
  ======================================================= */

  const openTransactionModal = (
    type = "expense"
  ) => {
    setDefaultType(
      type === "income"
        ? "income"
        : "expense"
    );

    setTransactionModalOpen(true);
  };

  const closeTransactionModal = () => {
    setTransactionModalOpen(false);
  };

  return (
    <section
      className="
        relative
        space-y-10
        pb-10
      "
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          right-0
          top-20
          -z-10
          h-96
          w-96
          rounded-full
          bg-cyan-500/5
          blur-[140px]
        "
      />

      <div
        className="
          pointer-events-none
          fixed
          bottom-0
          left-72
          -z-10
          h-96
          w-96
          rounded-full
          bg-violet-500/5
          blur-[140px]
        "
      />

      {/* =====================================================
          WELCOME
      ====================================================== */}

      <WelcomeBanner
        onAddIncome={() =>
          openTransactionModal("income")
        }
        onAddExpense={() =>
          openTransactionModal("expense")
        }
      />

      {/* =====================================================
          MAIN STATISTICS
      ====================================================== */}

      <PremiumStats />

      {/* =====================================================
          ANALYTICS CARDS
      ====================================================== */}

      <AnalyticsCards />

      {/* =====================================================
          QUICK ACTIONS
      ====================================================== */}

      <div className="space-y-5">
        <SectionHeader
          icon={CreditCard}
          title="Quick Actions"
          description="Manage your most important financial actions."
        />

        <QuickActions
          openTransaction={
            openTransactionModal
          }
          openGoal={() =>
            setGoalModalOpen(true)
          }
        />
      </div>

      {/* =====================================================
          FINANCIAL ANALYTICS
      ====================================================== */}

      <div className="space-y-5">
        <SectionHeader
          icon={BarChart3}
          title="Financial Analytics"
          description="Understand how your income and expenses are changing."
        />

        <div
          className="
            grid
            gap-6
            2xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]
          "
        >
          <ExpenseByCategory />

          <MonthlyTrendChart />
        </div>
      </div>

      {/* =====================================================
          TRANSACTIONS
      ====================================================== */}

      <div className="space-y-5">
        <SectionHeader
          icon={CreditCard}
          title="Transaction Overview"
          description="Review recent records and manage your complete transaction history."
        />

        <div
          className="
            grid
            gap-6
            2xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]
          "
        >
          <RecentTransactions />

          <div
            className="
              min-w-0
              overflow-hidden
              rounded-3xl
              border
              border-slate-200/80
              bg-white/90
              shadow-sm
              backdrop-blur-xl
              dark:border-slate-800
              dark:bg-slate-900/80
            "
          >
            <TransactionTable
              onEdit={
                setEditingTransaction
              }
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          BUDGET AND SAVINGS GOALS
      ====================================================== */}

      <div className="space-y-5">
        <SectionHeader
          icon={Target}
          title="Budget & Saving Goals"
          description="Monitor spending limits and track progress toward your financial targets."
        />

        <div
          className="
            grid
            items-start
            gap-6
            2xl:grid-cols-2
          "
        >
          <BudgetProgress />

          {/*
            SavingsGoal now manages these actions internally:

            - Add Savings
            - Edit Goal
            - Delete Goal
            - DashboardGoalModal
          */}

          <SavingsGoal />
        </div>
      </div>

      {/* =====================================================
          INSIGHTS AND ACTIVITY
      ====================================================== */}

      <div className="space-y-5">
        <SectionHeader
          icon={Activity}
          title="Insights & Activity"
          description="View recent actions and personalized financial recommendations."
        />

        <div
          className="
            grid
            items-start
            gap-6
            2xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]
          "
        >
          <RecentActivity />

          <FinancialInsights />
        </div>
      </div>

      {/* =====================================================
          TIPS AND ACHIEVEMENTS
      ====================================================== */}

      <div
        className="
          grid
          items-start
          gap-6
          xl:grid-cols-2
        "
      >
        <FinanceTips />

        <Achievements />
      </div>

      {/* =====================================================
          ADD TRANSACTION MODAL
      ====================================================== */}

      <AddTransactionForm
        open={transactionModalOpen}
        onClose={
          closeTransactionModal
        }
        defaultType={defaultType}
      />

      {/* =====================================================
          CREATE GOAL MODAL
      ====================================================== */}

      <GoalModal
        open={goalModalOpen}
        onClose={() =>
          setGoalModalOpen(false)
        }
      />

      {/* =====================================================
          EDIT TRANSACTION MODAL
      ====================================================== */}

      {editingTransaction && (
        <EditTransactionModal
          transaction={
            editingTransaction
          }
          onClose={() =>
            setEditingTransaction(null)
          }
        />
      )}
    </section>
  );
}

export default Dashboard;