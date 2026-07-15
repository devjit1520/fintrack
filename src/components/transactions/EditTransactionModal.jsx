import {
  useEffect,
  useMemo,
  useState,
} from "react";

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
  "Travel",
  "Other",
];

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getInitialForm(transaction) {
  return {
    title: transaction?.title || "",
    amount:
      transaction?.amount !== undefined
        ? String(transaction.amount)
        : "",
    type:
      transaction?.type === "income"
        ? "income"
        : "expense",
    category:
      transaction?.category || "Other",
    date:
      transaction?.date ||
      transaction?.createdAt?.split?.("T")?.[0] ||
      getToday(),
    note: transaction?.note || "",
  };
}

function EditTransactionModal({
  transaction,
  onClose,
}) {
  const { updateTransaction } = useFinance();

  const [form, setForm] = useState(() =>
    getInitialForm(transaction)
  );

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] =
    useState(false);

  const open = Boolean(transaction);

  useEffect(() => {
    if (!transaction) {
      return;
    }

    setForm(getInitialForm(transaction));
    setErrors({});
  }, [transaction]);

  const categoryOptions = useMemo(() => {
    const categories =
      form.type === "income"
        ? incomeCategories
        : expenseCategories;

    return categories.map((category) => ({
      label: category,
      value: category,
    }));
  }, [form.type]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => {
      if (name === "type") {
        const nextCategories =
          value === "income"
            ? incomeCategories
            : expenseCategories;

        const categoryExists =
          nextCategories.includes(
            previous.category
          );

        return {
          ...previous,
          type: value,
          category: categoryExists
            ? previous.category
            : nextCategories[0],
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

  const handleTypeChange = (type) => {
    handleChange({
      target: {
        name: "type",
        value: type,
      },
    });
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.title.trim()) {
      nextErrors.title =
        "Transaction title is required.";
    }

    const amount = Number(form.amount);

    if (
      form.amount === "" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      nextErrors.amount =
        "Enter an amount greater than zero.";
    }

    if (!form.category) {
      nextErrors.category =
        "Select a transaction category.";
    }

    if (!form.date) {
      nextErrors.date =
        "Transaction date is required.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (
      typeof updateTransaction !== "function"
    ) {
      toast.error(
        "Update transaction function is unavailable."
      );

      return;
    }

    try {
      setSubmitting(true);

      const updatedTransaction = {
        ...transaction,
        title: form.title.trim(),
        amount: Number(form.amount),
        type: form.type,
        category: form.category,
        date: form.date,
        note: form.note.trim(),
        updatedAt: new Date().toISOString(),
      };

      /*
       * Supports either:
       * updateTransaction(id, data)
       * or updateTransaction(data)
       */
      let result;

      if (updateTransaction.length >= 2) {
        result = await updateTransaction(
          transaction.id,
          updatedTransaction
        );
      } else {
        result = await updateTransaction(
          updatedTransaction
        );
      }

      if (result?.success === false) {
        throw new Error(
          result?.error ||
            "Unable to update transaction."
        );
      }

      toast.success(
        "Transaction updated successfully."
      );

      onClose?.();
    } catch (updateError) {
      console.error(
        "Unable to update transaction:",
        updateError
      );

      toast.error(
        updateError?.message ||
          "Unable to update transaction."
      );
    } finally {
      setSubmitting(false);
    }
  };

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
      title="Edit Transaction"
      description="Update your transaction details."
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
            form="edit-transaction-form"
            loading={submitting}
          >
            Save Changes
          </Button>
        </div>
      }
    >
      <form
        id="edit-transaction-form"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Transaction type */}
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Transaction type
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                handleTypeChange("income")
              }
              className={[
                "rounded-xl border px-4 py-3",
                "text-sm font-semibold",
                "transition-all duration-200",
                form.type === "income"
                  ? [
                      "border-emerald-500",
                      "bg-emerald-500/10",
                      "text-emerald-600",
                      "ring-4 ring-emerald-500/10",
                      "dark:text-emerald-400",
                    ].join(" ")
                  : [
                      "border-slate-200",
                      "text-slate-500",
                      "hover:bg-slate-50",
                      "dark:border-slate-700",
                      "dark:text-slate-400",
                      "dark:hover:bg-slate-800",
                    ].join(" "),
              ].join(" ")}
            >
              Income
            </button>

            <button
              type="button"
              onClick={() =>
                handleTypeChange("expense")
              }
              className={[
                "rounded-xl border px-4 py-3",
                "text-sm font-semibold",
                "transition-all duration-200",
                form.type === "expense"
                  ? [
                      "border-rose-500",
                      "bg-rose-500/10",
                      "text-rose-600",
                      "ring-4 ring-rose-500/10",
                      "dark:text-rose-400",
                    ].join(" ")
                  : [
                      "border-slate-200",
                      "text-slate-500",
                      "hover:bg-slate-50",
                      "dark:border-slate-700",
                      "dark:text-slate-400",
                      "dark:hover:bg-slate-800",
                    ].join(" "),
              ].join(" ")}
            >
              Expense
            </button>
          </div>
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
          options={categoryOptions}
          error={errors.category}
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

export default EditTransactionModal;