import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  CheckCircle2,
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
import TextareaField from "../common/TextareaField";

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

function getGoalTitle(goal) {
  return String(
    goal?.title ||
      goal?.name ||
      ""
  ).trim();
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

function getTodayDate() {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatCurrency(value) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(getSafeNumber(value));
}

function formatDate(value) {
  if (!value) {
    return "No deadline selected";
  }

  const date = new Date(
    `${value}T00:00:00`
  );

  if (
    Number.isNaN(date.getTime())
  ) {
    return "Invalid deadline";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

function getInitialForm(goal) {
  return {
    title: getGoalTitle(goal),

    targetAmount: String(
      getGoalTarget(goal) || ""
    ),

    savedAmount: String(
      getGoalSaved(goal)
    ),

    deadline:
      goal?.deadline || "",

    description:
      goal?.description ||
      goal?.note ||
      "",
  };
}

/* =========================================================
   COMPONENT
========================================================= */

function EditGoalModal({
  goal,
  open = Boolean(goal),
  onClose,
}) {
  const goalContext =
    useContext(GoalContext) || {};

  const {
    goals: rawGoals = [],
  } = goalContext;

  const updateGoalAction =
    goalContext.updateGoal ||
    goalContext.editGoal ||
    goalContext.updateGoalRecord;

  const goals = Array.isArray(
    rawGoals
  )
    ? rawGoals
    : [];

  const [form, setForm] =
    useState(() =>
      getInitialForm(goal)
    );

  const [errors, setErrors] =
    useState({});

  const [submitting, setSubmitting] =
    useState(false);

  const goalId = getGoalId(goal);

  const today = getTodayDate();

  const originalDeadline =
    goal?.deadline || "";

  /* =======================================================
     PREFILL FORM
  ======================================================= */

  useEffect(() => {
    if (!open || !goal) {
      return;
    }

    setForm(
      getInitialForm(goal)
    );

    setErrors({});
    setSubmitting(false);
  }, [
    goal,
    open,
  ]);

  /* =======================================================
     PREVIEW VALUES
  ======================================================= */

  const targetAmount =
    getSafeNumber(
      form.targetAmount
    );

  const savedAmount =
    getSafeNumber(
      form.savedAmount
    );

  const remainingAmount = Math.max(
    targetAmount - savedAmount,
    0
  );

  const progress =
    targetAmount > 0
      ? (
          savedAmount /
          targetAmount
        ) * 100
      : 0;

  const progressWidth = Math.min(
    Math.max(progress, 0),
    100
  );

  const isCompleted =
    targetAmount > 0 &&
    savedAmount >= targetAmount;

  const formattedDeadline =
    useMemo(
      () =>
        formatDate(
          form.deadline
        ),
      [form.deadline]
    );

  const hasChanges = useMemo(() => {
    const original =
      getInitialForm(goal);

    return (
      form.title.trim() !==
        original.title.trim() ||
      String(form.targetAmount) !==
        String(
          original.targetAmount
        ) ||
      String(form.savedAmount) !==
        String(
          original.savedAmount
        ) ||
      form.deadline !==
        original.deadline ||
      form.description.trim() !==
        original.description.trim()
    );
  }, [
    form,
    goal,
  ]);

  /* =======================================================
     INPUT HANDLER
  ======================================================= */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm = () => {
    const nextErrors = {};

    const normalizedTitle =
      form.title.trim();

    const numericTarget =
      Number(form.targetAmount);

    const numericSaved =
      form.savedAmount === ""
        ? 0
        : Number(
            form.savedAmount
          );

    if (!normalizedTitle) {
      nextErrors.title =
        "Enter a goal title.";
    } else if (
      normalizedTitle.length < 3
    ) {
      nextErrors.title =
        "Goal title must contain at least 3 characters.";
    } else if (
      normalizedTitle.length > 60
    ) {
      nextErrors.title =
        "Goal title cannot exceed 60 characters.";
    }

    const duplicateTitle =
      goals.some(
        (item) => {
          const itemId =
            getGoalId(item);

          if (
            itemId === goalId
          ) {
            return false;
          }

          return (
            getGoalTitle(item)
              .toLowerCase() ===
            normalizedTitle
              .toLowerCase()
          );
        }
      );

    if (duplicateTitle) {
      nextErrors.title =
        "Another goal already uses this title.";
    }

    if (
      form.targetAmount === "" ||
      !Number.isFinite(
        numericTarget
      ) ||
      numericTarget <= 0
    ) {
      nextErrors.targetAmount =
        "Enter a target amount greater than zero.";
    } else if (
      numericTarget >
      1000000000
    ) {
      nextErrors.targetAmount =
        "Target amount is too large.";
    }

    if (
      form.savedAmount === "" ||
      !Number.isFinite(
        numericSaved
      ) ||
      numericSaved < 0
    ) {
      nextErrors.savedAmount =
        "Saved amount cannot be negative.";
    } else if (
      Number.isFinite(
        numericTarget
      ) &&
      numericTarget > 0 &&
      numericSaved >
        numericTarget
    ) {
      nextErrors.savedAmount =
        "Saved amount cannot exceed the target amount.";
    }

    if (!form.deadline) {
      nextErrors.deadline =
        "Select a target deadline.";
    } else {
      const deadlineChanged =
        form.deadline !==
        originalDeadline;

      if (
        deadlineChanged &&
        form.deadline < today
      ) {
        nextErrors.deadline =
          "A new deadline cannot be in the past.";
      }
    }

    if (
      form.description.trim()
        .length > 250
    ) {
      nextErrors.description =
        "Description cannot exceed 250 characters.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors)
        .length === 0
    );
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!validateForm()) {
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

    const numericTarget =
      Number(form.targetAmount);

    const numericSaved =
      Number(form.savedAmount);

    const completed =
      numericSaved >=
      numericTarget;

    const timestamp =
      new Date().toISOString();

    const updatedGoal = {
      ...goal,

      id:
        goal?.id ??
        goalId,

      title:
        form.title.trim(),

      name:
        form.title.trim(),

      targetAmount:
        numericTarget,

      amount:
        numericTarget,

      target:
        numericTarget,

      savedAmount:
        numericSaved,

      saved:
        numericSaved,

      currentAmount:
        numericSaved,

      deadline:
        form.deadline,

      description:
        form.description.trim(),

      note:
        form.description.trim(),

      status: completed
        ? "completed"
        : "active",

      completedAt: completed
        ? (
            goal?.completedAt ||
            timestamp
          )
        : null,

      updatedAt: timestamp,
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
            "Unable to update goal."
        );
      }

      toast.success(
        completed
          ? `"${updatedGoal.title}" updated and marked as completed.`
          : `"${updatedGoal.title}" updated successfully.`
      );

      setErrors({});
      onClose?.();
    } catch (updateError) {
      console.error(
        "Unable to update goal:",
        updateError
      );

      toast.error(
        updateError?.message ||
          "Unable to update goal."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     CLOSE
  ======================================================= */

  const handleClose = () => {
    if (submitting) {
      return;
    }

    setErrors({});
    onClose?.();
  };

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="Edit Financial Goal"
      description="Update your savings target, progress and completion deadline."
      size="lg"
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
            form="edit-goal-form"
            loading={submitting}
            disabled={
              submitting ||
              !hasChanges
            }
            leftIcon={
              isCompleted
                ? CheckCircle2
                : Target
            }
          >
            Save Changes
          </Button>
        </div>
      }
    >
      <form
        id="edit-goal-form"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Information banner */}
        <div
          className={[
            "rounded-2xl border p-4",
            isCompleted
              ? "border-emerald-500/20 bg-emerald-500/10"
              : "border-violet-500/20 bg-violet-500/10",
          ].join(" ")}
        >
          <div className="flex items-start gap-3">
            <div
              className={[
                "flex size-10 shrink-0",
                "items-center justify-center",
                "rounded-xl",
                isCompleted
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-violet-500/10 text-violet-600 dark:text-violet-400",
              ].join(" ")}
            >
              {isCompleted ? (
                <CheckCircle2
                  size={19}
                />
              ) : (
                <Target size={19} />
              )}
            </div>

            <div>
              <p
                className={[
                  "text-sm font-bold",
                  isCompleted
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-violet-700 dark:text-violet-300",
                ].join(" ")}
              >
                {isCompleted
                  ? "This goal will be marked completed"
                  : "Update your financial milestone"}
              </p>

              <p
                className={[
                  "mt-1 text-xs leading-5",
                  isCompleted
                    ? "text-emerald-600/80 dark:text-emerald-300/80"
                    : "text-violet-600/80 dark:text-violet-300/80",
                ].join(" ")}
              >
                Completion status updates
                automatically when saved money
                reaches the target amount.
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <FormField
          label="Goal title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="Example: Emergency Fund"
          icon={Target}
          error={errors.title}
          helperText="Choose a short and recognizable title."
          maxLength={60}
          required
        />

        {/* Amounts */}
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Target amount"
            name="targetAmount"
            type="number"
            value={
              form.targetAmount
            }
            onChange={handleChange}
            placeholder="Example: 100000"
            icon={IndianRupee}
            error={
              errors.targetAmount
            }
            helperText="Total amount needed to complete this goal."
            min="1"
            step="1"
            required
          />

          <FormField
            label="Saved amount"
            name="savedAmount"
            type="number"
            value={
              form.savedAmount
            }
            onChange={handleChange}
            placeholder="Example: 25000"
            icon={PiggyBank}
            error={
              errors.savedAmount
            }
            helperText="Current amount saved toward this goal."
            min="0"
            max={
              targetAmount > 0
                ? targetAmount
                : undefined
            }
            step="1"
            required
          />
        </div>

        {/* Deadline */}
        <FormField
          label="Target deadline"
          name="deadline"
          type="date"
          value={form.deadline}
          onChange={handleChange}
          icon={CalendarDays}
          error={errors.deadline}
          helperText="Existing past deadlines can remain unchanged."
          required
        />

        {/* Description */}
        <TextareaField
          label="Description"
          name="description"
          value={
            form.description
          }
          onChange={handleChange}
          placeholder="Describe why this goal is important..."
          rows={3}
          maxLength={250}
          error={
            errors.description
          }
          helperText="Optional motivation or additional details."
        />

        {/* Live preview */}
        {form.title.trim() &&
          targetAmount > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/30 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={[
                      "flex size-11 shrink-0",
                      "items-center justify-center",
                      "rounded-2xl",
                      isCompleted
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-violet-500/10 text-violet-600 dark:text-violet-400",
                    ].join(" ")}
                  >
                    {isCompleted ? (
                      <CheckCircle2
                        size={21}
                      />
                    ) : (
                      <Target
                        size={21}
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Updated preview
                    </p>

                    <h3 className="mt-1 truncate text-base font-black text-slate-900 dark:text-white">
                      {form.title.trim()}
                    </h3>

                    <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <CalendarDays
                        size={13}
                      />

                      {formattedDeadline}
                    </p>
                  </div>
                </div>

                <span
                  className={[
                    "inline-flex w-fit",
                    "shrink-0 items-center",
                    "gap-1.5 rounded-full",
                    "border px-3 py-1",
                    "text-xs font-bold",
                    isCompleted
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400",
                  ].join(" ")}
                >
                  {isCompleted ? (
                    <CheckCircle2
                      size={13}
                    />
                  ) : (
                    <Target size={13} />
                  )}

                  {isCompleted
                    ? "Completed"
                    : "Active"}
                </span>
              </div>

              {/* Progress */}
              <div className="mt-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Goal progress
                  </span>

                  <span
                    className={[
                      "text-sm font-black",
                      isCompleted
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-violet-600 dark:text-violet-400",
                    ].join(" ")}
                  >
                    {progress.toFixed(1)}
                    %
                  </span>
                </div>

                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className={[
                      "h-full rounded-full",
                      "bg-gradient-to-r",
                      "transition-[width]",
                      "duration-500",
                      isCompleted
                        ? "from-emerald-500 to-teal-500"
                        : "from-violet-500 to-purple-500",
                    ].join(" ")}
                    style={{
                      width: `${progressWidth}%`,
                    }}
                  />
                </div>
              </div>

              {/* Amount preview */}
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Target
                  </p>

                  <p className="mt-2 truncate text-sm font-black text-blue-600 dark:text-blue-400">
                    {formatCurrency(
                      targetAmount
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Saved
                  </p>

                  <p className="mt-2 truncate text-sm font-black text-violet-600 dark:text-violet-400">
                    {formatCurrency(
                      savedAmount
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Remaining
                  </p>

                  <p
                    className={[
                      "mt-2 truncate",
                      "text-sm font-black",
                      remainingAmount === 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400",
                    ].join(" ")}
                  >
                    {formatCurrency(
                      remainingAmount
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
      </form>
    </ModalShell>
  );
}

export default EditGoalModal;