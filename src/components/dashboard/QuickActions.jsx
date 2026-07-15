import {
  Download,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import useFinance from "../../hooks/useFinance";

import {
  exportTransactionsToCsv,
} from "../../utils/exportTransactions";

function ActionCard({
  title,
  subtitle,
  icon: Icon,
  iconBg,
  border,
  hover,
  onClick,
  disabled,
  children,
}) {
  return (
    <motion.button
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      disabled={disabled}
      onClick={onClick}
      className={`
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        bg-white
        dark:bg-slate-900

        ${border}

        p-6

        text-left

        transition-all

        shadow-sm

        hover:shadow-xl

        disabled:opacity-50
        disabled:cursor-not-allowed
      `}
    >
      <div
        className={`
          absolute
          -right-10
          -top-10
          h-32
          w-32
          rounded-full
          blur-3xl
          opacity-0
          transition-all
          group-hover:opacity-100
          ${hover}
        `}
      />

      <div className="relative">

        <div
          className={`
            mb-5
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            ${iconBg}
          `}
        >
          {children || <Icon size={30} />}
        </div>

        <h3
          className="
            text-lg
            font-bold
            text-slate-900
            dark:text-white
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-slate-500
            dark:text-slate-400
          "
        >
          {subtitle}
        </p>

      </div>
    </motion.button>
  );
}

function QuickActions({
  openTransaction,
  openGoal,
}) {
  const navigate = useNavigate();

  const {
    transactions = [],
    loading,
  } = useFinance();

  const [
    exporting,
    setExporting,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    messageType,
    setMessageType,
  ] = useState("success");

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  const handleGoalClick = () => {
    if (openGoal) {
      openGoal();
      return;
    }

    navigate("/goals");
  };

  const handleExport = () => {
    try {
      setExporting(true);

      const result =
        exportTransactionsToCsv(
          transactions
        );

      if (!result.success) {
        setMessageType("error");
        setMessage(result.error);
        return;
      }

      setMessageType("success");

      setMessage(
        `${transactions.length} transaction${
          transactions.length > 1
            ? "s"
            : ""
        } exported successfully`
      );
    } catch (err) {
      setMessageType("error");
      setMessage(
        err.message ||
          "Export failed"
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <section className="space-y-5">

      <div
        className="
          grid
          gap-6
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        <ActionCard
          title="Add Income"
          subtitle="Record new income"
          icon={TrendingUp}
          iconBg="bg-emerald-500/15 text-emerald-500"
          border="border-emerald-200 dark:border-emerald-900"
          hover="bg-emerald-500/20"
          onClick={() =>
            openTransaction?.("income")
          }
        />

        <ActionCard
          title="Add Expense"
          subtitle="Track your spending"
          icon={TrendingDown}
          iconBg="bg-red-500/15 text-red-500"
          border="border-red-200 dark:border-red-900"
          hover="bg-red-500/20"
          onClick={() =>
            openTransaction?.("expense")
          }
        />

        <ActionCard
          title="Savings Goal"
          subtitle="Manage financial goals"
          icon={Target}
          iconBg="bg-violet-500/15 text-violet-500"
          border="border-violet-200 dark:border-violet-900"
          hover="bg-violet-500/20"
          onClick={handleGoalClick}
        />

        <ActionCard
          title={
            exporting
              ? "Exporting..."
              : "Export CSV"
          }
          subtitle={
            transactions.length
              ? `${transactions.length} transactions`
              : "No transactions"
          }
          icon={Download}
          iconBg="bg-cyan-500/15 text-cyan-500"
          border="border-cyan-200 dark:border-cyan-900"
          hover="bg-cyan-500/20"
          onClick={handleExport}
          disabled={
            exporting ||
            loading ||
            transactions.length === 0
          }
        >
          {exporting ? (
            <span
              className="
                h-8
                w-8
                animate-spin
                rounded-full
                border-2
                border-cyan-500
                border-t-transparent
              "
            />
          ) : (
            <Download size={30} />
          )}
        </ActionCard>

      </div>

      {message && (
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className={`
            rounded-2xl
            border
            px-5
            py-4
            text-sm
            font-medium

            ${
              messageType === "success"
                ? `
                border-emerald-500/20
                bg-emerald-500/10
                text-emerald-600
                dark:text-emerald-400
                `
                : `
                border-red-500/20
                bg-red-500/10
                text-red-500
                `
            }
          `}
        >
          {message}
        </motion.div>
      )}

    </section>
  );
}

export default QuickActions;