import { useState } from "react";

import useBudget from "../../hooks/useBudget";
import { budgetCategories } from "../../data/budgetCategories";

function AddBudgetModal({
  open,
  onClose,
}) {
  const { addBudget } = useBudget();

  const [form, setForm] = useState({
    category: "Food",
    amount: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.amount) return;

    addBudget({
      category: form.category,
      amount: Number(form.amount),
    });

    setForm({
      category: "Food",
      amount: "",
    });

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-slate-900 p-8"
      >

        <h2 className="mb-6 text-2xl font-bold text-white">
          Add Budget
        </h2>

        <select
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value,
            })
          }
          className="mb-4 w-full rounded-xl bg-slate-800 p-3 text-white"
        >
          {budgetCategories.map((item) => (
            <option key={item}>
              {item}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Budget Amount"
          value={form.amount}
          onChange={(e) =>
            setForm({
              ...form,
              amount: e.target.value,
            })
          }
          className="mb-6 w-full rounded-xl bg-slate-800 p-3 text-white"
        />

        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-700 px-5 py-3 text-white"
          >
            Cancel
          </button>

          <button
            className="rounded-xl bg-blue-600 px-5 py-3 text-white"
          >
            Save
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddBudgetModal;