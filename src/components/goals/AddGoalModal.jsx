import { useState } from "react";
import useGoal from "../../hooks/useGoal";
import { goalCategories } from "../../data/goalCategories";

function AddGoalModal({ open, onClose }) {
  const { addGoal } = useGoal();

  const [form, setForm] = useState({
    title: "",
    category: "Emergency Fund",
    target: "",
    saved: "",
    deadline: "",
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
      alert("Please enter a goal title.");
      return;
    }

    if (!form.target || Number(form.target) <= 0) {
      alert("Please enter a valid target amount.");
      return;
    }

    addGoal({
      title: form.title,
      category: form.category,
      target: Number(form.target),
      saved: Number(form.saved || 0),
      deadline: form.deadline,
    });

    setForm({
      title: "",
      category: "Emergency Fund",
      target: "",
      saved: "",
      deadline: "",
    });

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="w-full max-w-xl rounded-3xl border border-slate-700 bg-slate-900 p-8">

        <h2 className="mb-6 text-3xl font-bold text-white">
          Add New Goal
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="mb-2 block text-slate-300">
              Goal Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Emergency Fund"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-slate-300">
              Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
            >
              {goalCategories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-slate-300">
                Target Amount
              </label>

              <input
                type="number"
                name="target"
                value={form.target}
                onChange={handleChange}
                placeholder="50000"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-slate-300">
                Current Saved
              </label>

              <input
                type="number"
                name="saved"
                value={form.saved}
                onChange={handleChange}
                placeholder="10000"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
              />
            </div>

          </div>

          <div>
            <label className="mb-2 block text-slate-300">
              Deadline
            </label>

            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-700 px-6 py-3 text-white hover:bg-slate-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white hover:scale-105 transition"
            >
              Save Goal
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddGoalModal;