import {
  lazy,
  Suspense,
  useState,
} from "react";

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
import BudgetProgress from "../../components/dashboard/BudgetProgress";
import FinancialInsights from "../../components/dashboard/FinancialInsights";
import FinanceTips from "../../components/dashboard/FinanceTips";
import Achievements from "../../components/dashboard/Achievements";
import RecentActivity from "../../components/dashboard/RecentActivity";

import SavingsGoal from "../../components/goals/SavingsGoal";
import GoalModal from "../../components/goals/GoalModal";

import AddTransactionForm from "../../components/transactions/AddTransactionForm";
import EditTransactionModal from "../../components/transactions/EditTransactionModal";
import TransactionTable from "../../components/transactions/TransactionTable";

import ChartSkeleton from "../../components/common/ChartSkeleton";
import DeferredRender from "../../components/common/DeferredRender";

/* =========================================================
   LAZY CHART COMPONENTS
========================================================= */

const ExpenseByCategory = lazy(
  () =>
    import(
      "../../components/dashboard/ExpenseByCategory"
    )
);

const MonthlyTrendChart = lazy(
  () =>
    import(
      "../../components/analytics/MonthlyTrendChart"
    )
);

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

        <div className="min-w-0">
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

  const [
    defaultType,
    setDefaultType,
  ] = useState("expense");

  const [
    goalModalOpen,
    setGoalModalOpen,
  ] = useState(false);

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

  const closeTransactionModal =
    () => {
      setTransactionModalOpen(false);
    };

  return (
    <section
      className="
        relative
        min-w-0
        space-y-10
        pb-10
      "
    >
      {/* Background decoration */}

      <div
        className="
          pointer-events-none
          fixed
          right-0
          top-20
          -z-10
          hidden
          h-96
          w-96
          rounded-full
          bg-cyan-500/5
          blur-[140px]
          lg:block
        "
      />

      <div
        className="
          pointer-events-none
          fixed
          bottom-0
          left-72
          -z-10
          hidden
          h-96
          w-96
          rounded-full
          bg-violet-500/5
          blur-[140px]
          lg:block
        "
      />

      <WelcomeBanner
        onAddIncome={() =>
          openTransactionModal(
            "income"
          )
        }
        onAddExpense={() =>
          openTransactionModal(
            "expense"
          )
        }
      />

      <PremiumStats />

      <AnalyticsCards />

      {/* Quick actions */}

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

      {/* Financial analytics */}

      <div className="space-y-5">
        <SectionHeader
          icon={BarChart3}
          title="Financial Analytics"
          description="Understand how your income and expenses are changing."
        />

        <DeferredRender
          rootMargin="650px 0px"
          minHeight={320}
          fallback={
            <div
              className="
                grid
                min-w-0
                gap-6
                2xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]
              "
            >
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
          }
        >
          <div
            className="
              grid
              min-w-0
              gap-6
              2xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]
            "
          >
            <Suspense
              fallback={
                <ChartSkeleton />
              }
            >
              <ExpenseByCategory />
            </Suspense>

            <Suspense
              fallback={
                <ChartSkeleton />
              }
            >
              <MonthlyTrendChart />
            </Suspense>
          </div>
        </DeferredRender>
      </div>

      {/* Transactions */}

      <div className="space-y-5">
        <SectionHeader
          icon={CreditCard}
          title="Transaction Overview"
          description="Review recent records and manage your complete transaction history."
        />

        <div
          className="
            grid
            min-w-0
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

      {/* Budget and goals */}

      <div className="space-y-5">
        <SectionHeader
          icon={Target}
          title="Budget & Saving Goals"
          description="Monitor spending limits and track progress toward your financial targets."
        />

        <div
          className="
            grid
            min-w-0
            items-start
            gap-6
            2xl:grid-cols-2
          "
        >
          <BudgetProgress />
          <SavingsGoal />
        </div>
      </div>

      {/* Insights */}

      <div className="space-y-5">
        <SectionHeader
          icon={Activity}
          title="Insights & Activity"
          description="View recent actions and personalized financial recommendations."
        />

        <div
          className="
            grid
            min-w-0
            items-start
            gap-6
            2xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]
          "
        >
          <RecentActivity />
          <FinancialInsights />
        </div>
      </div>

<div
  className="
    grid
    min-w-0
    items-start
    gap-6
    2xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]
  "
>
  <div className="min-w-0">
    <FinanceTips />
  </div>

  <div className="min-w-0">
    <Achievements />
  </div>
</div>

      <AddTransactionForm
        open={
          transactionModalOpen
        }
        onClose={
          closeTransactionModal
        }
        defaultType={
          defaultType
        }
      />

      <GoalModal
        open={goalModalOpen}
        onClose={() =>
          setGoalModalOpen(false)
        }
      />

      {editingTransaction && (
        <EditTransactionModal
          transaction={
            editingTransaction
          }
          onClose={() =>
            setEditingTransaction(
              null
            )
          }
        />
      )}
    </section>
  );
}

export default Dashboard;