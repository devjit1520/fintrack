import { useState } from "react";

export default function AddTransactionForm({ onAdd, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a title.");
      return;
    }

    if (!formData.amount || formData.amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const transaction = {
      id: Date.now(),
      ...formData,
    };

    if (onAdd) {
      onAdd(transaction);
    }

    setFormData({
      title: "",
      amount: "",
      type: "expense",
      category: "",
      date: new Date().toISOString().split("T")[0],
      note: "",
    });

    if (onClose) {
      onClose();
    }
  };

 return (
  <div
    className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/60
      backdrop-blur-sm
      p-4
    "
  >
    <div
      className="
        relative
        w-full
        max-w-2xl
        max-h-[90vh]
        overflow-y-auto
        rounded-3xl
        border
        border-slate-700
        bg-gradient-to-br
        from-slate-950
        via-slate-900
        to-slate-800
        shadow-[0_25px_80px_rgba(0,0,0,0.6)]
      "
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="
          absolute
          right-5
          top-5
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-slate-800
          text-slate-300
          transition
          hover:bg-red-500
          hover:text-white
        "
      >
        ✕
      </button>

      {/* Your Existing Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-8"
      >
        {/* Header */}
  <div className="space-y-2">
    <h2 className="text-3xl font-bold text-white">
      Add Transaction
    </h2>

    <p className="text-slate-400">
      Record your income or expense securely.
    </p>
  </div>

  {/* Title */}
  <input
    type="text"
    name="title"
    placeholder="Transaction Title"
    value={formData.title}
    onChange={handleChange}
    className="
      w-full
      rounded-2xl
      border
      border-slate-700
      bg-slate-800/60
      px-5
      py-3
      text-white
      placeholder:text-slate-500
      outline-none
      transition
      focus:border-blue-500
      focus:ring-2
      focus:ring-blue-500/30
    "
  />

  {/* Amount */}
  <input
    type="number"
    name="amount"
    placeholder="Amount"
    value={formData.amount || ""}
    onChange={handleChange}
    className="
      w-full
      rounded-2xl
      border
      border-slate-700
      bg-slate-800/60
      px-5
      py-3
      text-white
      placeholder:text-slate-500
      outline-none
      transition
      focus:border-blue-500
      focus:ring-2
      focus:ring-blue-500/30
    "
  />

  {/* Type */}
 <div className="space-y-3">

  <label className="text-sm font-semibold text-slate-300">
    Transaction Type
  </label>

  <div className="grid grid-cols-2 gap-4">

    <button
      type="button"
      onClick={() =>
        setFormData({
          ...formData,
          type: "expense",
          category: "",
        })
      }
      className={`rounded-2xl border p-5 transition-all duration-300 ${
        formData.type === "expense"
          ? "border-red-500 bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30"
          : "border-slate-700 bg-slate-800 text-slate-300 hover:border-red-400"
      }`}
    >
      <div className="text-3xl">💸</div>

      <p className="mt-2 text-lg font-semibold">
        Expense
      </p>

      <p className="text-sm opacity-80">
        Money Out
      </p>
    </button>

    <button
      type="button"
      onClick={() =>
        setFormData({
          ...formData,
          type: "income",
          category: "",
        })
      }
      className={`rounded-2xl border p-5 transition-all duration-300 ${
        formData.type === "income"
          ? "border-green-500 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
          : "border-slate-700 bg-slate-800 text-slate-300 hover:border-green-400"
      }`}
    >
      <div className="text-3xl">💰</div>

      <p className="mt-2 text-lg font-semibold">
        Income
      </p>

      <p className="text-sm opacity-80">
        Money In
      </p>
    </button>

  </div>

</div>

  {/* Category */}
<div className="space-y-2">

<label className="text-sm font-medium text-slate-300">
Category
</label>

<div className="relative">

<select
  name="category"
  value={formData.category}
  onChange={handleChange}
  className="
  appearance-none
  w-full
  rounded-2xl
  border
  border-slate-700
  bg-slate-800
  px-5
  py-4
  text-white
  outline-none
  transition-all
  duration-300
  hover:border-blue-500
  focus:border-blue-500
  focus:ring-4
  focus:ring-blue-500/20
"
>

<option value="">📂 Select Category</option>

<option value="Food">🍔 Food</option>

<option value="Shopping">🛍 Shopping</option>

<option value="Transport">🚗 Transport</option>

<option value="Travel">✈️ Travel</option>

<option value="Healthcare">🏥 Healthcare</option>

<option value="Education">📚 Education</option>

<option value="Bills">💡 Bills</option>

<option value="Entertainment">🎬 Entertainment</option>

<option value="Salary">💼 Salary</option>

<option value="Business">🏢 Business</option>

<option value="Freelance">💻 Freelance</option>

<option value="Investment">📈 Investment</option>

</select>

<div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">

⌄

</div>

</div>

</div> 

  {/* Date */}
  <input
    type="date"
    name="date"
    value={formData.date}
    onChange={handleChange}
    className="
      w-full
      rounded-2xl
      border
      border-slate-700
      bg-slate-800/60
      px-5
      py-3
      text-white
      outline-none
      focus:border-blue-500
      focus:ring-2
      focus:ring-blue-500/30
    "
  />

  {/* Note */}
  {/* <textarea
    rows={4}
    name="note"
    placeholder="Write a note..."
    value={formData.note}
    onChange={handleChange}
    className="
      w-full
      rounded-2xl
      border
      border-slate-700
      bg-slate-800/60
      px-5
      py-3
      text-white
      placeholder:text-slate-500
      outline-none
      resize-none
      focus:border-blue-500
      focus:ring-2
      focus:ring-blue-500/30
    "
  /> */}

  {/* Buttons */}
  <div className="flex justify-end gap-4 pt-4">

    <button
      type="button"
      onClick={onClose}
      className="
        rounded-2xl
        border
        border-slate-700
        bg-slate-800
        px-6
        py-3
        font-medium
        text-slate-300
        transition
        hover:bg-slate-700
        hover:text-white
      "
    >
      Cancel
    </button>

    <button
      type="submit"
      className="
        rounded-2xl
        bg-gradient-to-r
        from-blue-600
        to-indigo-600
        px-8
        py-3
        font-semibold
        text-white
        transition-all
        duration-300
        hover:scale-105
        hover:from-blue-500
        hover:to-indigo-500
        hover:shadow-lg
        hover:shadow-blue-500/30
      "
    >
      + Add Transaction
    </button>

  </div>


      </form>
    </div>
  </div>
);
}