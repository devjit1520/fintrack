import { useState, useEffect  } from "react";
import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";
import { categories } from "../../data/categories";

function AddTransactionForm({ defaultType = "expense" }) {

useEffect(() => {
  setForm((prev) => ({
    ...prev,
    type: defaultType,
  }));
}, [defaultType]);

  const { addTransaction } = useFinance();

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    type: defaultType,
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      }));
    };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter a title.");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    useEffect(() => {
      setForm((prev) => ({
        ...prev,
        type: defaultType,
      }));
    }, [defaultType]);


    addTransaction({
      title: form.title,
      amount: Number(form.amount),
      category: form.category,
      type: form.type,
      date: form.date,
    });

    setForm({
      title: "",
      amount: "",
      category: "Food",
      type: "expense",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <Card>
      <div id="transaction-form">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Add Transaction
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Title
          </label>

          <input
            type="text"
            name="title"
            placeholder="Enter transaction title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Amount
          </label>

          <input
            type="number"
            name="amount"
            placeholder="0"
            value={form.amount}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Category
          </label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Transaction Type
          </label>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Date
          </label>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-lg font-semibold text-white transition hover:scale-[1.02]"
        >
          Add
        </button>
      </form>
      </div>
    </Card>
  );
}

export default AddTransactionForm;