import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Trash2,
  UserRoundX,
} from "lucide-react";

import useFinance from "../../hooks/useFinance";
import useGoal from "../../hooks/useGoal";
import useBudget from "../../hooks/useBudget";
import useProfile from "../../hooks/useProfile";
import ConfirmActionModal from "./ConfirmActionModal";

const ACTIONS = {
  RESET_PROFILE: "reset-profile",
  RESET_FINANCE: "reset-finance",
  DELETE_LOCAL_DATA: "delete-local-data",
};

const ACTION_CONFIG = {
  [ACTIONS.RESET_PROFILE]: {
    title: "Reset profile information?",
    description:
      "This restores your profile details, avatar, preferences, notifications and profile security settings to their defaults. Transactions, budgets and goals remain unchanged.",
    confirmText: "RESET PROFILE",
    buttonText: "Reset Profile",
  },
  [ACTIONS.RESET_FINANCE]: {
    title: "Reset all finance records?",
    description:
      "This removes transactions, budgets and goals from this browser. Your profile and appearance settings remain available.",
    confirmText: "RESET FINANCE",
    buttonText: "Reset Finance Data",
  },
  [ACTIONS.DELETE_LOCAL_DATA]: {
    title: "Delete all local FinTrack data?",
    description:
      "This permanently removes profile information, transactions, budgets, goals and appearance settings stored in this browser. It does not delete a Supabase authentication account.",
    confirmText: "DELETE LOCAL DATA",
    buttonText: "Delete Local Data",
  },
};

const ROW_STYLES = {
  amber: {
    icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    button:
      "border-amber-500/20 bg-amber-500/10 text-amber-700 hover:bg-amber-500/15 dark:text-amber-400",
  },
  rose: {
    icon: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    button:
      "border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500/15 dark:text-rose-400",
  },
};

function DangerAction({ icon: Icon, title, description, buttonLabel, onClick, tone }) {
  const styles = ROW_STYLES[tone] || ROW_STYLES.rose;

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between sm:p-5"
    >
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${styles.icon}`}
        >
          <Icon size={20} />
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClick}
        className={`inline-flex shrink-0 items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${styles.button}`}
      >
        {buttonLabel}
      </button>
    </motion.article>
  );
}

function DangerZoneCard() {
  const navigate = useNavigate();
  const finance = useFinance() || {};
  const goal = useGoal() || {};
  const budget = useBudget() || {};
  const profileData = useProfile() || {};

  const [activeAction, setActiveAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const showMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2800);
  };

  const closeModal = () => {
    if (!loading) {
      setActiveAction(null);
    }
  };

  const clearFinanceData = async () => {
    await Promise.resolve(finance.clearTransactions?.());
    await Promise.resolve(goal.clearGoals?.());
    await Promise.resolve(budget.clearBudgets?.());

    localStorage.removeItem("transactions");
    localStorage.removeItem("goals");
    localStorage.removeItem("budgets");
  };

  const handleConfirmedAction = async () => {
    if (!activeAction) {
      return;
    }

    try {
      setLoading(true);

      if (activeAction === ACTIONS.RESET_PROFILE) {
        await Promise.resolve(profileData.resetProfile?.());
        showMessage("Profile information was reset.");
      }

      if (activeAction === ACTIONS.RESET_FINANCE) {
        await clearFinanceData();
        showMessage("Transactions, budgets and goals were cleared.");
      }

      if (activeAction === ACTIONS.DELETE_LOCAL_DATA) {
        await clearFinanceData();

        [
          "fintrack-profile",
          "fintrack_preferences",
          "fintrack-last-backup-at",
          "fintrack-last-restore-at",
          "theme",
          "accent",
        ].forEach((key) => localStorage.removeItem(key));

        await Promise.resolve(profileData.resetProfile?.());
        navigate("/");
        window.setTimeout(() => window.location.reload(), 200);
      }

      setActiveAction(null);
    } catch (error) {
      console.error("Danger-zone action failed:", error);
      showMessage("The requested action could not be completed.");
    } finally {
      setLoading(false);
    }
  };

  const currentModal = ACTION_CONFIG[activeAction];

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl border border-rose-500/20 bg-white shadow-sm dark:bg-slate-900">
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-rose-500/10 blur-3xl" />

        <header className="relative flex items-start gap-4 border-b border-rose-500/15 bg-rose-500/[0.05] p-5 sm:p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <ShieldAlert size={23} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Danger Zone</h2>
              <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-rose-600 dark:text-rose-400">
                Destructive actions
              </span>
            </div>
            <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
              Create a backup in Data Management before removing important information.
            </p>
          </div>
        </header>

        <div className="relative space-y-4 p-5 sm:p-6">
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-4">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
            />
            <p className="text-xs leading-5 text-amber-700 dark:text-amber-400">
              Local data deletion does not delete your Supabase authentication account. Account deletion requires a secure backend function.
            </p>
          </div>

          <DangerAction
            icon={RotateCcw}
            title="Reset Profile"
            description="Restore profile information and profile preferences to their default values."
            buttonLabel="Reset Profile"
            tone="amber"
            onClick={() => setActiveAction(ACTIONS.RESET_PROFILE)}
          />

          <DangerAction
            icon={Trash2}
            title="Reset Finance Data"
            description="Remove all transactions, budgets and goals while preserving your profile."
            buttonLabel="Reset Finance"
            tone="rose"
            onClick={() => setActiveAction(ACTIONS.RESET_FINANCE)}
          />

          <DangerAction
            icon={UserRoundX}
            title="Delete Local Application Data"
            description="Remove all FinTrack information stored in this browser, including profile and appearance data."
            buttonLabel="Delete Local Data"
            tone="rose"
            onClick={() => setActiveAction(ACTIONS.DELETE_LOCAL_DATA)}
          />

          {message && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              {message}
            </div>
          )}
        </div>
      </section>

      <ConfirmActionModal
        open={Boolean(activeAction)}
        onClose={closeModal}
        onConfirm={handleConfirmedAction}
        title={currentModal?.title || ""}
        description={currentModal?.description || ""}
        confirmText={currentModal?.confirmText || "CONFIRM"}
        buttonText={currentModal?.buttonText || "Confirm"}
        loading={loading}
      />
    </>
  );
}

export default DangerZoneCard;
