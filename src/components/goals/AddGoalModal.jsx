import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Target,
  IndianRupee,
  PiggyBank,
  CalendarDays,
  FolderOpen,
} from "lucide-react";

import useGoal from "../../hooks/useGoal";
import { goalCategories } from "../../data/goalCategories";


function AddGoalModal({ open, onClose }) {
  const { addGoal } = useGoal();

  const [form, setForm] = useState({
    name: "",
    category: "Emergency Fund",
    targetAmount: "",
    savedAmount: "",
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

    if (!form.name.trim()) {
      alert("Please enter goal name.");
      return;
    }

    if (Number(form.targetAmount) <= 0) {
      alert("Enter a valid target amount.");
      return;
    }

    addGoal({
      id: Date.now(),

      name: form.name,

      category: form.category,

      targetAmount: Number(form.targetAmount),

      savedAmount: Number(form.savedAmount || 0),

      deadline: form.deadline,

      status: "Active",

      createdAt: new Date().toISOString(),
    });

    setForm({
      name: "",
      category: "Emergency Fund",
      targetAmount: "",
      savedAmount: "",
      deadline: "",
    });

    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>

      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >

        <motion.form
          onSubmit={handleSubmit}
          initial={{
            scale: 0.9,
            y: 30,
          }}
          animate={{
            scale: 1,
            y: 0,
          }}
          exit={{
            scale: 0.9,
            opacity: 0,
          }}
          className="
          relative
          w-full
          max-w-2xl
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-white
          shadow-2xl

          dark:border-slate-700
          dark:bg-slate-900
          "
        >

          {/* Glow */}

          <div className="absolute -right-24 -top-24 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />

          {/* Header */}

          <div className="flex items-center justify-between border-b border-slate-200 p-7 dark:border-slate-800">

            <div>

              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Create New Goal
              </h2>

              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Start tracking your financial dream.
              </p>

            </div>

<button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-200 p-2 transition hover:rotate-90 dark:bg-slate-800"
            >
              <X />
            </button>

          </div>

          {/* Body */}

          <div className="space-y-6 p-7">

            {/* Goal */}

            <div>

              <label className="mb-2 flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">

                <Target size={18} />

                Goal Name

              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Buy New Car"
                className="w-full text-black rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

            </div>

            {/* Category */}

            <div>

              <label className="mb-2 flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">

                <FolderOpen size={18} />

                Category

              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl text-black border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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

                <label className="mb-2 flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">

                  <IndianRupee size={18} />

                  Target Amount

                </label>

                <input
                  type="number"
                  name="targetAmount"
                  value={form.targetAmount}
                  onChange={handleChange}
                  className="w-full text-black rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

              </div>

              <div>

                <label className="mb-2 flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">

                  <PiggyBank size={18} />

                  Saved Amount

                </label>

                <input
                  type="number"
                  name="savedAmount"
                  value={form.savedAmount}
                  onChange={handleChange}
                  className="w-full text-black rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

              </div>

            </div>

            <div>

              <label className="mb-2 flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">

                <CalendarDays size={18} />

                Deadline

              </label>

              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="w-full text-black rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

            </div>

          </div>

          {/* Footer */}

          <div className="flex justify-end gap-4 border-t border-slate-200 p-7 dark:border-slate-800">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-200 px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
            >
              Create Goal
            </button>

          </div>

        </motion.form>

      </motion.div>

    </AnimatePresence>
  );
}

export default AddGoalModal;