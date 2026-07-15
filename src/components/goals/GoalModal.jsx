import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
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
   INITIAL FORM
========================================================= */

const initialForm = {
  title: "",
  targetAmount: "",
  savedAmount: "",
  deadline: "",
  description: "",
};

/* =========================================================
   HELPERS
========================================================= */

function getTodayDate() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(getSafeNumber(value));
}

function getGoalTitle(goal) {
  return String(
    goal?.title ||
      goal?.name ||
      ""
  )
    .trim()
    .toLowerCase();
}

/* =========================================================
   COMPONENT
========================================================= */

function GoalModal({
  open,
  onClose,
}) {
  const goalContext =
    useContext(GoalContext) || {};

  const {
    goals: rawGoals = [],
  } = goalContext;

  const addGoalAction =
    goalContext.addGoal ||
    goalContext.createGoal ||
    goalContext.addGoalRecord;

  const goals = Array.isArray(
    rawGoals
  )
    ? rawGoals
    : [];

  const [form, setForm] =
    useState(initialForm);

  const [errors, setErrors] =
    useState({});

  const [submitting, setSubmitting] =
    useState(false);

  const today = getTodayDate();

  /* =======================================================
     RESET WHEN OPENED
  ======================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm(initialForm);
    setErrors({});
    setSubmitting(false);
  }, [open]);

  /* =======================================================
     FORM VALUES
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

  const previewStatus =
    targetAmount > 0 &&
    savedAmount >= targetAmount
      ? "completed"
      : "active";

  const formattedDeadline =
    useMemo(() => {
      if (!form.deadline) {
        return "No deadline selected";
      }

      const date =
        new Date(
          `${form.deadline}T00:00:00`
        );

      if (
        Number.isNaN(
          date.getTime()
        )
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
    }, [form.deadline]);

  /* =======================================================
     CHANGE HANDLER
  ======================================================= */

  const handleChange = (event) => {
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
        : Number(form.savedAmount);

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

    const titleAlreadyExists =
      goals.some(
        (goal) =>
          getGoalTitle(goal) ===
          normalizedTitle.toLowerCase()
      );

    if (titleAlreadyExists) {
      nextErrors.title =
        "A goal with this title already exists.";
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
      numericTarget > 1000000000
    ) {
      nextErrors.targetAmount =
        "Target amount is too large.";
    }

    if (
      form.savedAmount !== "" &&
      (
        !Number.isFinite(
          numericSaved
        ) ||
        numericSaved < 0
      )
    ) {
      nextErrors.savedAmount =
        "Starting savings cannot be negative.";
    } else if (
      Number.isFinite(
        numericTarget
      ) &&
      numericTarget > 0 &&
      numericSaved > numericTarget
    ) {
      nextErrors.savedAmount =
        "Starting savings cannot exceed the target amount.";
    }

    if (!form.deadline) {
      nextErrors.deadline =
        "Select a target deadline.";
    } else if (
      form.deadline < today
    ) {
      nextErrors.deadline =
        "Deadline cannot be in the past.";
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
      typeof addGoalAction !==
      "function"
    ) {
      toast.error(
        "Add goal function is unavailable."
      );

      return;
    }

    const numericTarget =
      Number(form.targetAmount);

    const numericSaved =
      form.savedAmount === ""
        ? 0
        : Number(form.savedAmount);

    const completed =
      numericTarget > 0 &&
      numericSaved >= numericTarget;

    const timestamp =
      new Date().toISOString();

    const newGoal = {
      id: Date.now(),

      title: form.title.trim(),
      name: form.title.trim(),

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

      createdAt: timestamp,
      updatedAt: timestamp,

      completedAt: completed
        ? timestamp
        : null,
    };

    try {
      setSubmitting(true);

      const result =
        await addGoalAction(
          newGoal
        );

      if (
        result?.success === false
      ) {
        throw new Error(
          result?.error ||
            "Unable to create goal."
        );
      }

      toast.success(
        completed
          ? "Goal created and marked as completed."
          : `"${newGoal.title}" created successfully.`
      );

      setForm(initialForm);
      setErrors({});

      onClose?.();
    } catch (addError) {
      console.error(
        "Unable to create goal:",
        addError
      );

      toast.error(
        addError?.message ||
          "Unable to create goal."
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

    setForm(initialForm);
    setErrors({});

    onClose?.();
  };

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="Create Financial Goal"
      description="Set a savings target and track your progress toward it."
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
            form="create-goal-form"
            loading={submitting}
            leftIcon={Target}
          >
            Create Goal
          </Button>
        </div>
      }
    >
      <form
        id="create-goal-form"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Information banner */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Target size={19} />
            </div>

            <div>
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                Create a clear financial milestone
              </p>

              <p className="mt-1 text-xs leading-5 text-emerald-600/80 dark:text-emerald-300/80">
                Set a realistic target, choose a deadline and add any money
                you have already saved.
              </p>
            </div>
          </div>
        </div>

        {/* Goal title */}
        <FormField
          label="Goal title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="Example: Emergency Fund"
          icon={Target}
          error={errors.title}
          helperText="Choose a short and recognizable goal name."
          maxLength={60}
          required
        />

        {/* Amounts */}
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Target amount"
            name="targetAmount"
            type="number"
            value={form.targetAmount}
            onChange={handleChange}
            placeholder="Example: 100000"
            icon={IndianRupee}
            error={
              errors.targetAmount
            }
            helperText="Total amount required to complete this goal."
            min="1"
            step="1"
            required
          />

          <FormField
            label="Already saved"
            name="savedAmount"
            type="number"
            value={form.savedAmount}
            onChange={handleChange}
            placeholder="Example: 10000"
            icon={PiggyBank}
            error={
              errors.savedAmount
            }
            helperText="Optional starting savings amount."
            min="0"
            max={
              targetAmount > 0
                ? targetAmount
                : undefined
            }
            step="1"
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
          helperText="Choose when you plan to complete this goal."
          min={today}
          required
        />

        {/* Description */}
        <TextareaField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe why this financial goal is important..."
          rows={3}
          maxLength={250}
          error={
            errors.description
          }
          helperText="Optional motivation or additional information."
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
                      previewStatus ===
                      "completed"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-violet-500/10 text-violet-600 dark:text-violet-400",
                    ].join(" ")}
                  >
                    {previewStatus ===
                    "completed" ? (
                      <PiggyBank
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
                      Goal preview
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
                    "shrink-0 rounded-full",
                    "border px-3 py-1",
                    "text-xs font-bold",
                    previewStatus ===
                    "completed"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400",
                  ].join(" ")}
                >
                  {previewStatus ===
                  "completed"
                    ? "Completed"
                    : "Active"}
                </span>
              </div>

              {/* Preview progress */}
              <div className="mt-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Starting progress
                  </span>

                  <span
                    className={[
                      "text-sm font-black",
                      previewStatus ===
                      "completed"
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
                      previewStatus ===
                      "completed"
                        ? "from-emerald-500 to-teal-500"
                        : "from-violet-500 to-purple-500",
                    ].join(" ")}
                    style={{
                      width: `${progressWidth}%`,
                    }}
                  />
                </div>
              </div>

              {/* Preview amounts */}
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

export default GoalModal;