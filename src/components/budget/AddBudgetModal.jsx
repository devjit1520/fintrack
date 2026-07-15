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

import { BudgetContext } from "../../context/BudgetContext";

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

const initialForm = {
  category: "Food",
  amount: "",
  note: "",
};

/* =========================================================
   HELPERS
========================================================= */

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

/* =========================================================
   COMPONENT
========================================================= */

function AddBudgetModal({
  open,
  onClose,
}) {
  const budgetContext =
    useContext(BudgetContext) || {};

  const {
    budgets = [],
    addBudget,
  } = budgetContext;

  const safeBudgets = Array.isArray(budgets)
    ? budgets
    : [];

  const [form, setForm] =
    useState(initialForm);

  const [errors, setErrors] =
    useState({});

  const [submitting, setSubmitting] =
    useState(false);

  /* =======================================================
     RESET FORM WHEN MODAL OPENS
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
     AVAILABLE CATEGORY OPTIONS
  ======================================================= */

  const availableCategoryOptions =
    useMemo(() => {
      const usedCategories = new Set(
        safeBudgets.map(
          getBudgetCategory
        )
      );

      const available =
        categoryOptions.filter(
          (option) =>
            !usedCategories.has(
              option.value.toLowerCase()
            )
        );

      /*
       * Keep all categories available when every
       * category already has a budget.
       */
      return available.length > 0
        ? available
        : categoryOptions;
    }, [safeBudgets]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const categoryIsAvailable =
      availableCategoryOptions.some(
        (option) =>
          option.value === form.category
      );

    if (!categoryIsAvailable) {
      setForm((previous) => ({
        ...previous,
        category:
          availableCategoryOptions[0]
            ?.value || "Other",
      }));
    }
  }, [
    open,
    form.category,
    availableCategoryOptions,
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
      safeBudgets.some(
        (budget) =>
          getBudgetCategory(budget) ===
          form.category
            .trim()
            .toLowerCase()
      );

    if (categoryAlreadyExists) {
      nextErrors.category =
        "A budget already exists for this category.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (
      typeof addBudget !== "function"
    ) {
      toast.error(
        "Add budget function is unavailable."
      );

      return;
    }

    const newBudget = {
      id: Date.now(),
      category: form.category,
      title: form.category,
      amount: Number(form.amount),
      limit: Number(form.amount),
      spent: 0,
      note: form.note.trim(),
      period: "monthly",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      setSubmitting(true);

      const result =
        await addBudget(newBudget);

      if (result?.success === false) {
        throw new Error(
          result?.error ||
            "Unable to create budget."
        );
      }

      toast.success(
        `${form.category} budget created successfully.`
      );

      setForm(initialForm);
      setErrors({});
      onClose?.();
    } catch (addError) {
      console.error(
        "Unable to create budget:",
        addError
      );

      toast.error(
        addError?.message ||
          "Unable to create budget."
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
      title="Add Budget"
      description="Create a monthly spending limit for a financial category."
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
            form="add-budget-form"
            loading={submitting}
          >
            Create Budget
          </Button>
        </div>
      }
    >
      <form
        id="add-budget-form"
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
                Monthly category budget
              </p>

              <p className="mt-1 text-xs leading-5 text-violet-600/80 dark:text-violet-300/80">
                Expenses added to this category
                will automatically count toward
                its budget limit.
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
          helperText="Enter the maximum amount you plan to spend in this category."
          min="1"
          step="1"
          required
        />

        {/* Preview */}
        {Number(form.amount) > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/30">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Budget preview
            </p>

            <div className="mt-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {form.category}
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Monthly spending limit
                </p>
              </div>

              <p className="shrink-0 text-lg font-black text-violet-600 dark:text-violet-400">
                ₹
                {Number(
                  form.amount
                ).toLocaleString("en-IN")}
              </p>
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

export default AddBudgetModal;