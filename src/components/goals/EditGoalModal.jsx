import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Target,
  IndianRupee,
  CalendarDays,
  PiggyBank,
} from "lucide-react";

import useGoal from "../../hooks/useGoal";

function EditGoalModal({ open, goal, onClose }) {
  const { updateGoal } = useGoal();

  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    savedAmount: "",
    deadline: "",
    category: "",
  });

  useEffect(() => {
    if (goal) {
      setForm({
        name: goal.name || goal.title || "",
        targetAmount:
          goal.targetAmount ||
          goal.target ||
          goal.amount ||
          "",
        savedAmount:
          goal.savedAmount ||
          goal.saved ||
          "",
        deadline: goal.deadline || "",
        category:
          goal.category || "Savings",
      });
    }
  }, [goal]);

  if (!open || !goal) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateGoal({
      ...goal,

      name: form.name,

      targetAmount: Number(
        form.targetAmount
      ),

      savedAmount: Number(
        form.savedAmount
      ),

      deadline: form.deadline,

      category: form.category,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      >
        <motion.form
          onSubmit={handleSubmit}
          initial={{
            scale: 0.9,
            y: 40,
          }}
          animate={{
            scale: 1,
            y: 0,
          }}
          exit={{
            scale: 0.9,
            opacity: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="
            relative
            w-full
            max-w-xl
            overflow-hidden
            rounded-3xl
            border
            border-slate-700
            bg-white
            dark:bg-slate-900
            shadow-2xl
          "
        >
          {/* Glow */}

          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

          {/* Header */}

          <div className="relative flex items-center justify-between border-b border-slate-200 dark:border-slate-800 p-7">

            <div>

              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Edit Goal
              </h2>

              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Update your savings goal.
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

          <div className="space-y-5 p-7">

            {/* Goal Name */}

            <div>

              <label className="mb-2 flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">

                <Target size={18} />

                Goal Name

              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Buy Car"
                className="
                text-black
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-slate-50
                  p-4
                  outline-none
                  focus:border-cyan-500
                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-white
                "
              />

            </div>

            {/* Target */}

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
                className="w-full text-black rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

            </div>

            {/* Saved */}

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
                className="w-full text-black rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

            </div>

            {/* Deadline */}

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
                className="w-full text-black rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

            </div>

          </div>

          {/* Footer */}

          <div className="flex justify-end gap-4 border-t border-slate-200 dark:border-slate-800 p-7">

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
              Save Changes
            </button>

          </div>

        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}

export default EditGoalModal;