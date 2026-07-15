import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  IndianRupee,
  Tags,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  BudgetContext,
} from "../../context/BudgetContext";

import Button from "../common/Button";
import FormField from "../common/FormField";
import ModalShell from "../common/ModalShell";
import SelectField from "../common/SelectField";
import TextareaField from "../common/TextareaField";

/* =========================================================
   BUDGET CATEGORIES
========================================================= */

const budgetCategories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Rent",
  "Travel",
  "Personal Care",
  "Groceries",
  "Subscriptions",
  "Other",
];

const categoryOptions = budgetCategories.map(
  (category) => ({
    label: category,
    value: category,
  })
);

/* =========================================================
   HELPERS
========================================================= */

function getBudgetId(budget) {
  return (
    budget?.id ??
    budget?._id ??
    budget?.budgetId ??
    null
  );
}

function getBudgetCategory(budget) {
  return String(
    budget?.category ||
      budget?.title ||
      budget?.name ||
      ""
  )
    .trim()
    .toLowerCase();
}

function getBudgetAmount(budget) {
  const amount = Number(
    budget?.amount ??
      budget?.limit ??
      budget?.budgetAmount ??
      budget?.targetAmount ??
      0
  );

  return Number.isFinite(amount)
    ? amount
    : 0;
}

function getBudgetSpent(budget) {
  const spent = Number(
    budget?.spent ?? 0
  );

  return Number.isFinite(spent)
    ? spent
    : 0;
}

function getInitialForm(budget) {
  return {
    category:
      budget?.category ||
      budget?.title ||
      budget?.name ||
      "Other",

    amount: String(
      getBudgetAmount(budget) || ""
    ),

    note: budget?.note || "",
  };
}

/* =========================================================
   COMPONENT
========================================================= */

function EditBudgetModal({
  budget,
  open = Boolean(budget),
  onClose,
}) {
  const budgetContext =
    useContext(BudgetContext) || {};

  const {
    budgets = [],
    updateBudget,
  } = budgetContext;

  const safeBudgets = Array.isArray(budgets)
    ? budgets
    : [];

  const [form, setForm] = useState(() =>
    getInitialForm(budget)
  );

  const [errors, setErrors] =
    useState({});

  const [submitting, setSubmitting] =
    useState(false);

  const budgetId = getBudgetId(budget);
  const spent = getBudgetSpent(budget);

  /* =======================================================
     RESET FORM WHEN BUDGET CHANGES
  ======================================================= */

  useEffect(() => {
    if (!open || !budget) {
      return;
    }

    setForm(getInitialForm(budget));
    setErrors({});
    setSubmitting(false);
  }, [
    budget,
    open,
  ]);

  /* =======================================================
     AVAILABLE CATEGORIES

     The current category remains available.
     Categories used by other budgets are hidden.
  ======================================================= */

  const availableCategoryOptions =
    useMemo(() => {
      const currentBudgetId =
        getBudgetId(budget);

      const usedCategories = new Set(
        safeBudgets
          .filter(
            (item) =>
              getBudgetId(item) !==
              currentBudgetId
          )
          .map(getBudgetCategory)
      );

      const available =
        categoryOptions.filter(
          (option) =>
            !usedCategories.has(
              option.value.toLowerCase()
            )
        );

      const currentCategory =
        budget?.category ||
        budget?.title ||
        budget?.name;

      const currentExists =
        available.some(
          (option) =>
            option.value ===
            currentCategory
        );

      if (
        currentCategory &&
        !currentExists
      ) {
        return [
          {
            label: currentCategory,
            value: currentCategory,
          },
          ...available,
        ];
      }

      return available.length > 0
        ? available
        : categoryOptions;
    }, [
      budget,
      safeBudgets,
    ]);

  /* =======================================================
     INPUT HANDLER
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

    const amount = Number(form.amount);

    if (!form.category) {
      nextErrors.category =
        "Select a budget category.";
    }

    if (
      form.amount === "" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      nextErrors.amount =
        "Enter a budget amount greater than zero.";
    }

    if (amount > 100000000) {
      nextErrors.amount =
        "Budget amount is too large.";
    }

    const categoryAlreadyExists =
      safeBudgets.some((item) => {
        const itemId =
          getBudgetId(item);

        const isCurrentBudget =
          itemId === budgetId;

        if (isCurrentBudget) {
          return false;
        }

        return (
          getBudgetCategory(item) ===
          form.category
            .trim()
            .toLowerCase()
        );
      });

    if (categoryAlreadyExists) {
      nextErrors.category =
        "Another budget already uses this category.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  /* =======================================================
     UPDATE BUDGET
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!budgetId) {
      toast.error(
        "Unable to identify this budget."
      );

      return;
    }

    if (
      typeof updateBudget !== "function"
    ) {
      toast.error(
        "Update budget function is unavailable."
      );

      return;
    }

    const updatedBudget = {
      ...budget,

      id:
        budget?.id ??
        budgetId,

      category: form.category,
      title: form.category,

      amount: Number(form.amount),
      limit: Number(form.amount),

      spent,

      note: form.note.trim(),

      period:
        budget?.period ||
        "monthly",

      updatedAt:
        new Date().toISOString(),
    };

    try {
      setSubmitting(true);

      /*
       * Supports either:
       *
       * updateBudget(id, updatedBudget)
       *
       * or:
       *
       * updateBudget(updatedBudget)
       */

      let result;

      if (updateBudget.length >= 2) {
        result = await updateBudget(
          budgetId,
          updatedBudget
        );
      } else {
        result = await updateBudget(
          updatedBudget
        );
      }

      if (result?.success === false) {
        throw new Error(
          result?.error ||
            "Unable to update budget."
        );
      }

      toast.success(
        `${form.category} budget updated successfully.`
      );

      setErrors({});
      onClose?.();
    } catch (updateError) {
      console.error(
        "Unable to update budget:",
        updateError
      );

      toast.error(
        updateError?.message ||
          "Unable to update budget."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const handleClose = () => {
    if (submitting) {
      return;
    }

    setErrors({});
    onClose?.();
  };

  /* =======================================================
     PREVIEW CALCULATIONS
  ======================================================= */

  const previewAmount =
    Number(form.amount) || 0;

  const remaining =
    previewAmount - spent;

  const usagePercentage =
    previewAmount > 0
      ? (spent / previewAmount) * 100
      : 0;

  const progressPercentage = Math.min(
    Math.max(usagePercentage, 0),
    100
  );

  const isOverBudget =
    previewAmount > 0 &&
    spent > previewAmount;

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="Edit Budget"
      description="Update the category and monthly spending limit."
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
            form="edit-budget-form"
            loading={submitting}
          >
            Save Changes
          </Button>
        </div>
      }
    >
      <form
        id="edit-budget-form"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Information banner */}
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Tags size={17} />
            </div>

            <div>
              <p className="text-sm font-bold text-violet-700 dark:text-violet-300">
                Edit monthly budget
              </p>

              <p className="mt-1 text-xs leading-5 text-violet-600/80 dark:text-violet-300/80">
                Existing expenses will be
                compared with the updated
                budget limit.
              </p>
            </div>
          </div>
        </div>

        {/* Category */}
        <SelectField
          label="Budget category"
          name="category"
          value={form.category}
          onChange={handleChange}
          options={
            availableCategoryOptions
          }
          error={errors.category}
          required
        />

        {/* Amount */}
        <FormField
          label="Monthly budget amount"
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          placeholder="Example: 10000"
          icon={IndianRupee}
          error={errors.amount}
          helperText="Enter the maximum monthly spending amount."
          min="1"
          step="1"
          required
        />

        {/* Live preview */}
        {previewAmount > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/30">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Updated budget preview
                </p>

                <p className="mt-2 truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                  {form.category}
                </p>
              </div>

              <p className="shrink-0 text-lg font-black text-violet-600 dark:text-violet-400">
                ₹
                {previewAmount.toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>

            {/* Progress */}
            <div className="mt-5">
              <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                <span className="text-slate-500 dark:text-slate-400">
                  Current usage
                </span>

                <span
                  className={
                    isOverBudget
                      ? "text-rose-600 dark:text-rose-400"
                      : usagePercentage >= 80
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-emerald-600 dark:text-emerald-400"
                  }
                >
                  {usagePercentage.toFixed(1)}
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
                    isOverBudget
                      ? "from-rose-500 to-red-500"
                      : usagePercentage >= 80
                        ? "from-amber-400 to-orange-500"
                        : "from-cyan-500 to-blue-500",
                  ].join(" ")}
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />
              </div>
            </div>

            {/* Preview values */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Already spent
                </p>

                <p className="mt-2 truncate text-sm font-black text-rose-600 dark:text-rose-400">
                  ₹
                  {spent.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  {remaining >= 0
                    ? "Remaining"
                    : "Exceeded"}
                </p>

                <p
                  className={[
                    "mt-2 truncate text-sm",
                    "font-black",
                    remaining >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400",
                  ].join(" ")}
                >
                  ₹
                  {Math.abs(
                    remaining
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Note */}
        <TextareaField
          label="Note"
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Add an optional note about this budget..."
          rows={3}
          maxLength={150}
          helperText="Optional information about your spending plan."
        />
      </form>
    </ModalShell>
  );
}

export default EditBudgetModal;