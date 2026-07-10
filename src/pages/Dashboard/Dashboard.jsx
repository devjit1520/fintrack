import { useState } from "react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import { dashboardStats } from "../../data/dashboardData";
import StatsCard from "../../components/dashboard/StatsCard";
import QuickActions from "../../components/dashboard/QuickActions";
import AddTransactionForm from "../../components/forms/AddTransactionForm";
// import AddTransactionForm from "../../components/forms/AddTransactionForm";
import TransactionTable from "../../components/transactions/TransactionTable";
import AnalyticsCards from "../../components/dashboard/AnalyticsCards";
import ExpensePieChart from "../../components/charts/ExpensePieChart";
import IncomeExpenseChart from "../../components/charts/IncomeExpenseChart";
import MonthlyTrendChart from "../../components/charts/MonthlyTrendChart";
import BudgetProgress from "../../components/dashboard/BudgetProgress";
import SavingsGoal from "../../components/dashboard/SavingsGoal";
import RecentActivity from "../../components/dashboard/RecentActivity";
import FinancialInsights from "../../components/dashboard/FinancialInsights";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import FinanceTips from "../../components/dashboard/FinanceTips";
import Achievements from "../../components/dashboard/Achievements";
import EditTransactionModal from "../../components/transactions/EditTransactionModal";

function Dashboard() {
  const [editing, setEditing] = useState(null);
  
  return (
    <section className="space-y-8">

        <WelcomeBanner />


      {/* <DashboardHeader /> */}

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
  {dashboardStats.map((card) => (
    <StatsCard
      key={card.id}
      {...card}
    />
  ))}
  </div>

      {/* Analytics */}
      <AnalyticsCards />


      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div>
          <AddTransactionForm />
        </div>

        <div className="lg:col-span-2">
          <TransactionTable
            onEdit={setEditing}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ExpensePieChart />
        <IncomeExpenseChart />

        {/* <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">
            Income vs Expense
          </h2>
        </div> */}
      </div>
      <div className="mt-6">
        <MonthlyTrendChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <BudgetProgress />
        <SavingsGoal />
      </div>

      <div className="mt-6">

        <RecentActivity />

      </div>

      <div className="mt-6">
        
        {/* Financial Insights */}
        <FinancialInsights />

      </div>

      <div className="grid gap-6 lg:grid-cols-2">
          <FinanceTips />
          <Achievements />
      </div>



          {/*  */}

          {editing && (
            <EditTransactionModal
              transaction={editing}
              onClose={() => setEditing(null)}
            />
          )}

    </section>
  );
}

export default Dashboard;