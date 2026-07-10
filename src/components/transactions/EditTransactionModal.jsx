import { useEffect, useState } from "react";
import useFinance from "../../hooks/useFinance";

function EditTransactionModal({ transaction, onClose }) {
  const { updateTransaction } = useFinance();

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    type: "",
    date: "",
  });

  useEffect(() => {
    if (transaction) {
      setForm({
        title: transaction.title || "",
        amount: transaction.amount || "",
        category: transaction.category || "",
        type: transaction.type || "expense",
        date: transaction.date || "",
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateTransaction({
      ...transaction,
      ...form,
      amount: Number(form.amount),
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-slate-900 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-2xl font-bold text-white">
          Edit Transaction
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full rounded-xl bg-slate-800 p-3 text-white"
          />

          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="w-full rounded-xl bg-slate-800 p-3 text-white"
          />

          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full rounded-xl bg-slate-800 p-3 text-white"
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full rounded-xl bg-slate-800 p-3 text-white"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full rounded-xl bg-slate-800 p-3 text-white"
          />

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-700 px-5 py-3 text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-3 text-white"
            >
              Save Changes
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTransactionModal;