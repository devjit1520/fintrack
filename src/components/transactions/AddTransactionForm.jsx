import { useEffect, useState } from "react";
import {
  CalendarDays,
  IndianRupee,
  ReceiptText,
} from "lucide-react";
import toast from "react-hot-toast";

import useFinance from "../../hooks/useFinance";

import ModalShell from "../common/ModalShell";
import Button from "../common/Button";
import FormField from "../common/FormField";
import SelectField from "../common/SelectField";
import TextareaField from "../common/TextareaField";

const initialForm = {
  title: "",
  amount: "",
  type: "expense",
  category: "Food",
  date: new Date().toISOString().split("T")[0],
  note: "",
};

const incomeCategories = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Gift",
  "Other",
];

const expenseCategories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Rent",
  "Other",
];

function AddTransactionForm({
  open,
  onClose,
  defaultType = "expense",
}) {
  const { addTransaction } = useFinance();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    if (!open) return;

    setForm({
      ...initialForm,
      type: defaultType,
      category:
        defaultType === "income"
          ? "Salary"
          : "Food",
    });

    setErrors({});
  }, [open, defaultType]);

  const categoryOptions =
    form.type === "income"
      ? incomeCategories
      : expenseCategories;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => {
      if (name === "type") {
        return {
          ...previous,
          type: value,
          category:
            value === "income"
              ? "Salary"
              : "Food",
        };
      }

      return {
        ...previous,
        [name]: value,
      };
    });

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.title.trim()) {
      nextErrors.title =
        "Transaction title is required.";
    }

    if (
      !form.amount ||
      Number(form.amount) <= 0
    ) {
      nextErrors.amount =
        "Enter an amount greater than zero.";
    }

    if (!form.date) {
      nextErrors.date =
        "Transaction date is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      addTransaction({
        id: Date.now(),
        title: form.title.trim(),
        amount: Number(form.amount),
        type: form.type,
        category: form.category,
        date: form.date,
        note: form.note.trim(),
        createdAt: new Date().toISOString(),
      });

      toast.success("Transaction added successfully.");

      setForm(initialForm);
      setErrors({});
      onClose();
    } catch (error) {
      console.error(
        "Failed to add transaction:",
        error
      );

      toast.error("Unable to add transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;

    setErrors({});
    onClose();
  };

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="Add Transaction"
      description="Record a new income or expense."
      size="md"
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
            form="add-transaction-form"
            loading={submitting}
          >
            Save Transaction
          </Button>
        </div>
      }
    >
      <form
        id="add-transaction-form"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              handleChange({
                target: {
                  name: "type",
                  value: "income",
                },
              })
            }
            className={[
              "rounded-xl border px-4 py-3",
              "text-sm font-semibold transition-all",
              form.type === "income"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 ring-4 ring-emerald-500/10 dark:text-emerald-400"
                : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800",
            ].join(" ")}
          >
            Income
          </button>

          <button
            type="button"
            onClick={() =>
              handleChange({
                target: {
                  name: "type",
                  value: "expense",
                },
              })
            }
            className={[
              "rounded-xl border px-4 py-3",
              "text-sm font-semibold transition-all",
              form.type === "expense"
                ? "border-rose-500 bg-rose-500/10 text-rose-600 ring-4 ring-rose-500/10 dark:text-rose-400"
                : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800",
            ].join(" ")}
          >
            Expense
          </button>
        </div>

        <FormField
          label="Transaction title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Example: Grocery shopping"
          icon={ReceiptText}
          error={errors.title}
          required
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Amount"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            icon={IndianRupee}
            error={errors.amount}
            min="0"
            step="0.01"
            required
          />

          <FormField
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            icon={CalendarDays}
            error={errors.date}
            required
          />
        </div>

        <SelectField
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          options={categoryOptions.map(
            (category) => ({
              label: category,
              value: category,
            })
          )}
          required
        />

        <TextareaField
          label="Note"
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Add an optional note..."
          rows={3}
          maxLength={150}
        />
      </form>
    </ModalShell>
  );
}

export default AddTransactionForm;