import { useState } from "react";

import {
  ArchiveRestore,
  CalendarClock,
  DatabaseBackup,
  Download,
  Goal,
  HardDrive,
  ReceiptText,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound,
  WalletCards,
} from "lucide-react";

import toast from "react-hot-toast";

import Card from "../common/Card";

import ImportBackupModal from "./ImportBackupModal";
import ClearDataModal from "./ClearDataModal";

import {
  downloadFinanceBackup,
  getFinanceStorageSummary,
} from "../../utils/financeBackup";

/* =========================================================
   FORMATTERS
========================================================= */

function formatFileSize(bytes) {
  const numericBytes =
    Number(bytes) || 0;

  if (numericBytes < 1024) {
    return `${numericBytes} B`;
  }

  if (
    numericBytes <
    1024 * 1024
  ) {
    return `${(
      numericBytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    numericBytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

function formatDate(value) {
  if (!value) {
    return "Never";
  }

  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "Never";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryItem({
  icon: Icon,
  label,
  value,
  iconClassName = "",
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 ${iconClassName}`}
      >
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-bold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   ACTION CARD
========================================================= */

function ActionCard({
  icon: Icon,
  title,
  description,
  buttonLabel,
  onClick,
  variant = "primary",
}) {
  const variants = {
    primary: {
      icon:
        "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",

      button:
        "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/20 hover:-translate-y-0.5",
    },

    secondary: {
      icon:
        "bg-violet-500/10 text-violet-600 dark:text-violet-400",

      button:
        "border border-slate-200 bg-white text-slate-700 hover:border-violet-500/30 hover:bg-violet-500/5 hover:text-violet-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:text-violet-400",
    },

    danger: {
      icon:
        "bg-rose-500/10 text-rose-600 dark:text-rose-400",

      button:
        "border border-rose-500/20 bg-rose-500/10 text-rose-600 hover:bg-rose-500/15 dark:text-rose-400",
    },
  };

  const styles =
    variants[variant];

  return (
    <article className="flex h-full min-w-0 flex-col rounded-3xl border border-slate-200 bg-white/60 p-5 transition hover:border-cyan-500/20 dark:border-white/10 dark:bg-white/[0.025]">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${styles.icon}`}
      >
        <Icon size={21} />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-lg transition ${styles.button}`}
      >
        {variant === "primary" && (
          <Download size={16} />
        )}

        {variant ===
          "secondary" && (
          <Upload size={16} />
        )}

        {variant === "danger" && (
          <Trash2 size={16} />
        )}

        {buttonLabel}
      </button>
    </article>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function DataManagementCard() {
  const [importOpen, setImportOpen] =
    useState(false);

  const [clearOpen, setClearOpen] =
    useState(false);

  const [summary, setSummary] =
    useState(() =>
      getFinanceStorageSummary()
    );

  const refreshSummary = () => {
    setSummary(
      getFinanceStorageSummary()
    );
  };

  const handleExport = () => {
    try {
      const result =
        downloadFinanceBackup();

      toast.success(
        "Backup downloaded successfully"
      );

      setSummary((current) => ({
        ...current,

        lastBackupAt:
          result.backupTime,
      }));
    } catch (error) {
      console.error(
        "Backup download failed:",
        error
      );

      toast.error(
        "Could not create backup"
      );
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative">
          {/* Decorative glow */}

          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative">
            {/* Header */}

            <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 dark:border-white/10 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-cyan-600 dark:text-cyan-400">
                  <DatabaseBackup
                    size={24}
                  />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Data Management
                    </h2>

                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
                      Local & private
                    </span>
                  </div>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Back up, restore or clear
                    locally stored FinTrack
                    financial information.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                <ShieldCheck
                  size={16}
                  className="mt-0.5 shrink-0 text-emerald-500"
                />

                <span>
                  Authentication sessions are
                  never exported.
                </span>
              </div>
            </div>

            {/* Data summary */}

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
              <SummaryItem
                icon={ReceiptText}
                label="Transactions"
                value={
                  summary.transactionCount
                }
              />

              <SummaryItem
                icon={WalletCards}
                label="Budgets"
                value={
                  summary.budgetCount
                }
              />

              <SummaryItem
                icon={Goal}
                label="Goals"
                value={summary.goalCount}
              />

              <SummaryItem
                icon={UserRound}
                label="Profile"
                value={
                  summary.profileIncluded
                    ? "Included"
                    : "Empty"
                }
              />

              <SummaryItem
                icon={HardDrive}
                label="Backup size"
                value={formatFileSize(
                  summary.approximateBytes
                )}
              />

              <SummaryItem
                icon={CalendarClock}
                label="Last backup"
                value={formatDate(
                  summary.lastBackupAt
                )}
              />
            </div>

            {/* Actions */}

            <div className="mt-6 grid items-stretch gap-4 md:grid-cols-3">
              <ActionCard
                icon={DatabaseBackup}
                title="Export Backup"
                description="Download transactions, budgets, goals, profile details and appearance settings as one secure JSON file."
                buttonLabel="Download Backup"
                onClick={handleExport}
                variant="primary"
              />

              <ActionCard
                icon={ArchiveRestore}
                title="Restore Backup"
                description="Validate and preview a previous FinTrack backup before replacing the current local data."
                buttonLabel="Import Backup"
                onClick={() =>
                  setImportOpen(true)
                }
                variant="secondary"
              />

              <ActionCard
                icon={Trash2}
                title="Clear Local Data"
                description="Remove transactions, budgets and goals with optional profile and appearance preservation."
                buttonLabel="Clear Data"
                onClick={() =>
                  setClearOpen(true)
                }
                variant="danger"
              />
            </div>

            {/* Footer */}

            <div className="mt-5 flex items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-xs leading-5 text-slate-500 dark:border-white/10 dark:bg-white/[0.025] dark:text-slate-400">
              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-emerald-500"
              />

              Backups are generated entirely
              inside the browser. Supabase
              authentication tokens and
              account sessions are excluded.
            </div>
          </div>
        </div>
      </Card>

      <ImportBackupModal
        open={importOpen}
        onClose={() => {
          setImportOpen(false);
          refreshSummary();
        }}
      />

      <ClearDataModal
        open={clearOpen}
        onClose={() => {
          setClearOpen(false);
          refreshSummary();
        }}
      />
    </>
  );
}

export default DataManagementCard;