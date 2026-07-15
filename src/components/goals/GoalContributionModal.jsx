import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  IndianRupee,
  PiggyBank,
  Target,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  GoalContext,
} from "../../context/GoalContext";

import Button from "../common/Button";
import FormField from "../common/FormField";
import ModalShell from "../common/ModalShell";

/* =========================================================
   HELPERS
========================================================= */

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function getGoalId(goal) {
  return (
    goal?.id ??
    goal?._id ??
    goal?.goalId ??
    null
  );
}

function getGoalTarget(goal) {
  return getSafeNumber(
    goal?.targetAmount ??
      goal?.amount ??
      goal?.target
  );
}

function getGoalSaved(goal) {
  return getSafeNumber(
    goal?.savedAmount ??
      goal?.saved ??
      goal?.currentAmount
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(getSafeNumber(value));
}

/* =========================================================
   COMPONENT
========================================================= */

function GoalContributionModal({
  goal,
  open = Boolean(goal),
  onClose,
}) {
  const goalContext =
    useContext(GoalContext) || {};

  const updateGoalAction =
    goalContext.updateGoal ||
    goalContext.editGoal ||
    goalContext.updateGoalRecord;

  const [amount, setAmount] =
    useState("");

  const [error, setError] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const goalId = getGoalId(goal);
  const target = getGoalTarget(goal);
  const currentSaved =
    getGoalSaved(goal);

  const remaining = Math.max(
    target - currentSaved,
    0
  );

  const contribution =
    Number(amount) || 0;

  const previewSaved =
    currentSaved + contribution;

  const previewProgress =
    target > 0
      ? (
          previewSaved /
          target
        ) * 100
      : 0;

  const previewWidth = Math.min(
    Math.max(previewProgress, 0),
    100
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    setAmount("");
    setError("");
    setSubmitting(false);
  }, [
    open,
    goal,
  ]);

  const handleAmountChange = (
    event
  ) => {
    setAmount(event.target.value);
    setError("");
  };

  const validate = () => {
    const numericAmount =
      Number(amount);

    if (
      amount === "" ||
      !Number.isFinite(
        numericAmount
      ) ||
      numericAmount <= 0
    ) {
      setError(
        "Enter a savings amount greater than zero."
      );

      return false;
    }

    if (remaining <= 0) {
      setError(
        "This goal is already completed."
      );

      return false;
    }

    if (
      numericAmount > remaining
    ) {
      setError(
        `You can add up to ${formatCurrency(
          remaining
        )} to complete this goal.`
      );

      return false;
    }

    return true;
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    if (
      goalId === null ||
      goalId === undefined
    ) {
      toast.error(
        "Unable to identify this goal."
      );

      return;
    }

    if (
      typeof updateGoalAction !==
      "function"
    ) {
      toast.error(
        "Update goal function is unavailable."
      );

      return;
    }

    const nextSaved =
      currentSaved +
      Number(amount);

    const completed =
      target > 0 &&
      nextSaved >= target;

    const updatedGoal = {
      ...goal,

      id:
        goal?.id ??
        goalId,

      savedAmount: nextSaved,
      saved: nextSaved,
      currentAmount: nextSaved,

      status: completed
        ? "completed"
        : "active",

      completedAt: completed
        ? (
            goal?.completedAt ||
            new Date().toISOString()
          )
        : null,

      updatedAt:
        new Date().toISOString(),
    };

    try {
      setSubmitting(true);

      let result;

      if (
        updateGoalAction.length >= 2
      ) {
        result =
          await updateGoalAction(
            goalId,
            updatedGoal
          );
      } else {
        result =
          await updateGoalAction(
            updatedGoal
          );
      }

      if (
        result?.success === false
      ) {
        throw new Error(
          result?.error ||
            "Unable to add savings."
        );
      }

      toast.success(
        completed
          ? "Goal completed successfully!"
          : `${formatCurrency(
              Number(amount)
            )} added to your goal.`
      );

      setAmount("");
      setError("");
      onClose?.();
    } catch (updateError) {
      console.error(
        "Unable to update goal:",
        updateError
      );

      toast.error(
        updateError?.message ||
          "Unable to add savings."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) {
      return;
    }

    setAmount("");
    setError("");
    onClose?.();
  };

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="Add Savings"
      description={`Add money toward "${
        goal?.title ||
        goal?.name ||
        "your financial goal"
      }".`}
      size="md"
      closeOnBackdrop={!submitting}
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="goal-contribution-form"
            loading={submitting}
            leftIcon={PiggyBank}
          >
            Add Savings
          </Button>
        </div>
      }
    >
      <form
        id="goal-contribution-form"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Goal overview */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Target size={19} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-emerald-700 dark:text-emerald-300">
                {goal?.title ||
                  goal?.name ||
                  "Financial Goal"}
              </p>

              <p className="mt-1 text-xs leading-5 text-emerald-600/80 dark:text-emerald-300/80">
                {formatCurrency(
                  currentSaved
                )}{" "}
                saved out of{" "}
                {formatCurrency(target)}
              </p>
            </div>
          </div>
        </div>

        {/* Contribution amount */}
        <FormField
          label="Savings amount"
          name="amount"
          type="number"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Example: 5000"
          icon={IndianRupee}
          error={error}
          helperText={`Remaining amount: ${formatCurrency(
            remaining
          )}`}
          min="1"
          max={remaining}
          step="1"
          required
        />

        {/* Quick amounts */}
        {remaining > 0 && (
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Quick amount
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[
                0.25,
                0.5,
                1,
              ].map((ratio) => {
                const quickAmount =
                  Math.max(
                    1,
                    Math.round(
                      remaining * ratio
                    )
                  );

                return (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => {
                      setAmount(
                        String(
                          Math.min(
                            quickAmount,
                            remaining
                          )
                        )
                      );

                      setError("");
                    }}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-600 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-300 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                  >
                    {ratio === 1
                      ? "Complete"
                      : `${ratio * 100}%`}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Preview */}
        {contribution > 0 &&
          contribution <= remaining && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/30">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    New saved amount
                  </p>

                  <p className="mt-2 text-lg font-black text-slate-900 dark:text-white">
                    {formatCurrency(
                      previewSaved
                    )}
                  </p>
                </div>

                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {previewProgress.toFixed(
                    1
                  )}
                  %
                </p>
              </div>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-[width] duration-500"
                  style={{
                    width: `${previewWidth}%`,
                  }}
                />
              </div>
            </div>
          )}
      </form>
    </ModalShell>
  );
}

export default GoalContributionModal;