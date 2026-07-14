import {
  AlertTriangle,
  Download,
  RotateCcw,
  Trash2,
  UserRoundX,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import useFinance from "../../hooks/useFinance";
import useGoal from "../../hooks/useGoal";
import useBudget from "../../hooks/useBudget";
import useProfile from "../../hooks/useProfile";

import {
  downloadFinTrackBackup,
} from "../../utils/exportFinTrackData";

import ConfirmActionModal from "./ConfirmActionModal";

const ACTIONS = {
  RESET_PROFILE: "reset-profile",
  RESET_ALL: "reset-all",
  DELETE_ACCOUNT: "delete-account",
};

function ActionRow({
  icon: Icon,
  title,
  description,
  buttonLabel,
  onClick,
  color = "red",
}) {
  const styles = {
    blue: {
      icon:
        "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",

      button:
        "bg-blue-600 hover:bg-blue-700",

      border:
        "border-blue-200 dark:border-blue-900",
    },

    orange: {
      icon:
        "bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400",

      button:
        "bg-orange-500 hover:bg-orange-600",

      border:
        "border-orange-200 dark:border-orange-900",
    },

    red: {
      icon:
        "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400",

      button:
        "bg-red-600 hover:bg-red-700",

      border:
        "border-red-200 dark:border-red-900",
    },
  };

  const current = styles[color];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`
        flex
        flex-col
        gap-5
        rounded-2xl
        border
        p-5
        sm:flex-row
        sm:items-center
        sm:justify-between
        ${current.border}
      `}
    >
      <div className="flex gap-4">
        <div
          className={`
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${current.icon}
          `}
        >
          <Icon size={22} />
        </div>

        <div>
          <h3
            className="
              font-semibold
              text-slate-900
              dark:text-white
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-1
              max-w-2xl
              text-sm
              leading-6
              text-slate-500
              dark:text-slate-400
            "
          >
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClick}
        className={`
          shrink-0
          rounded-xl
          px-5
          py-3
          font-semibold
          text-white
          transition
          ${current.button}
        `}
      >
        {buttonLabel}
      </button>
    </motion.div>
  );
}

function DangerZoneCard() {
  const navigate = useNavigate();

  const {
    clearTransactions,
  } = useFinance();

  const {
    clearGoals,
  } = useGoal();

  const {
    clearBudgets,
  } = useBudget();

  const {
    resetProfile,
  } = useProfile();

  const [activeAction, setActiveAction] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const closeModal = () => {
    if (!loading) {
      setActiveAction(null);
    }
  };

  const showMessage = (text) => {
    setMessage(text);

    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleExport = () => {
    downloadFinTrackBackup();

    showMessage(
      "Your FinTrack backup was downloaded."
    );
  };

  const handleConfirmedAction = async () => {
    try {
      setLoading(true);

      await new Promise((resolve) =>
        window.setTimeout(
          resolve,
          450
        )
      );

      if (
        activeAction ===
        ACTIONS.RESET_PROFILE
      ) {
        resetProfile();

        showMessage(
          "Profile information was reset."
        );
      }

      if (
        activeAction ===
        ACTIONS.RESET_ALL
      ) {
        clearTransactions?.();
        clearGoals?.();
        clearBudgets?.();
        resetProfile();

        localStorage.removeItem(
          "theme"
        );

        localStorage.removeItem(
          "accent"
        );

        showMessage(
          "All FinTrack data was reset."
        );

        navigate("/");
      }

      if (
        activeAction ===
        ACTIONS.DELETE_ACCOUNT
      ) {
        clearTransactions?.();
        clearGoals?.();
        clearBudgets?.();

        const keysToRemove = [
          "fintrack-profile",
          "transactions",
          "goals",
          "budgets",
          "theme",
          "accent",
        ];

        keysToRemove.forEach((key) =>
          localStorage.removeItem(key)
        );

        resetProfile();

        navigate("/");
      }

      setActiveAction(null);
    } catch (error) {
      console.error(
        "Danger-zone action failed:",
        error
      );

      showMessage(
        "The action could not be completed."
      );
    } finally {
      setLoading(false);
    }
  };

  const modalConfiguration = {
    [ACTIONS.RESET_PROFILE]: {
      title: "Reset profile information?",
      description:
        "This restores your name, avatar, personal information, preferences, notifications and profile settings to their default values. Transactions, budgets and goals will remain.",
      confirmText: "RESET PROFILE",
      buttonText: "Reset Profile",
    },

    [ACTIONS.RESET_ALL]: {
      title: "Reset all FinTrack data?",
      description:
        "This removes all transactions, budgets, goals and profile settings from this browser. Download a backup before continuing.",
      confirmText: "RESET ALL",
      buttonText: "Reset Everything",
    },

    [ACTIONS.DELETE_ACCOUNT]: {
      title: "Delete local account?",
      description:
        "This permanently removes all locally stored FinTrack data from this browser. This action cannot be undone.",
      confirmText: "DELETE",
      buttonText: "Delete Account",
    },
  };

  const currentModal =
    modalConfiguration[activeAction];

  return (
    <>
      <section
        className="
          overflow-hidden
          rounded-3xl
          border
          border-red-200
          bg-white
          shadow-sm
          dark:border-red-900
          dark:bg-slate-900
        "
      >
        <div
          className="
            border-b
            border-red-200
            bg-red-50
            p-6
            dark:border-red-900
            dark:bg-red-950/20
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-red-100
                text-red-600
                dark:bg-red-950/60
              "
            >
              <AlertTriangle
                size={23}
              />
            </div>

            <div>
              <h2
                className="
                  text-2xl
                  font-bold
                  text-red-600
                "
              >
                Danger Zone
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Export your data before
                performing destructive actions.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6">
          <ActionRow
            icon={Download}
            title="Export All Data"
            description="Download your profile, transactions, budgets, goals, theme and preferences as a JSON backup."
            buttonLabel="Export Backup"
            color="blue"
            onClick={handleExport}
          />

          <ActionRow
            icon={RotateCcw}
            title="Reset Profile"
            description="Restore only profile information and profile preferences to their defaults."
            buttonLabel="Reset Profile"
            color="orange"
            onClick={() =>
              setActiveAction(
                ACTIONS.RESET_PROFILE
              )
            }
          />

          <ActionRow
            icon={Trash2}
            title="Reset All Application Data"
            description="Remove transactions, budgets, goals and all user preferences saved in this browser."
            buttonLabel="Reset All Data"
            color="red"
            onClick={() =>
              setActiveAction(
                ACTIONS.RESET_ALL
              )
            }
          />

          <ActionRow
            icon={UserRoundX}
            title="Delete Account"
            description="Permanently remove all locally stored account and finance data from this browser."
            buttonLabel="Delete Account"
            color="red"
            onClick={() =>
              setActiveAction(
                ACTIONS.DELETE_ACCOUNT
              )
            }
          />

          {message && (
            <div
              className="
                rounded-xl
                border
                border-emerald-200
                bg-emerald-50
                px-4
                py-3
                text-sm
                font-medium
                text-emerald-700
                dark:border-emerald-900
                dark:bg-emerald-950/30
                dark:text-emerald-400
              "
            >
              {message}
            </div>
          )}
        </div>
      </section>

      <ConfirmActionModal
        open={Boolean(activeAction)}
        onClose={closeModal}
        onConfirm={
          handleConfirmedAction
        }
        title={
          currentModal?.title || ""
        }
        description={
          currentModal?.description ||
          ""
        }
        confirmText={
          currentModal?.confirmText ||
          "CONFIRM"
        }
        buttonText={
          currentModal?.buttonText ||
          "Confirm"
        }
        loading={loading}
      />
    </>
  );
}

export default DangerZoneCard;