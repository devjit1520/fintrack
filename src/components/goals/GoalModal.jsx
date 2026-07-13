import { useState } from "react";
import { motion } from "framer-motion";
import { X, Target } from "lucide-react";

function GoalModal({
  open,
  onClose,
  onGoalAdded,
}) {
  const [goal, setGoal] = useState({
    title: "",
    amount: "",
    deadline: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setGoal({
      ...goal,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (!goal.title || !goal.amount) {
      alert("Please fill all required fields.");
      return;
    }

    const newGoal = {
      id: Date.now(),

      title: goal.title,

      target: Number(goal.amount),

      saved: 0,

      deadline: goal.deadline,

      status: "Active",

      createdAt: new Date().toISOString(),
    };

    const oldGoals =
      JSON.parse(localStorage.getItem("goals")) || [];

    const updatedGoals = [
      ...oldGoals,
      newGoal,
    ];

    localStorage.setItem(
      "goals",
      JSON.stringify(updatedGoals)
    );

    if (onGoalAdded) {
      onGoalAdded(newGoal);
    }

    setGoal({
      title: "",
      amount: "",
      deadline: "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl"
      >
        {/* Header */}

        <div className="mb-8 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-cyan-500/20 p-3">
              <Target
                size={24}
                className="text-cyan-400"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                Create Goal
              </h2>

              <p className="text-sm text-slate-400">
                Start saving smarter
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X />
          </button>

        </div>

        {/* Goal Name */}

        <div className="mb-5">

          <label className="mb-2 block text-sm text-slate-300">
            Goal Name
          </label>

          <input
            type="text"
            name="title"
            value={goal.title}
            onChange={handleChange}
            placeholder="Example: Buy Laptop"
            className="w-full rounded-2xl border border-slate-700 bg-slate-800 p-4 text-white outline-none transition focus:border-cyan-500"
          />

        </div>

        {/* Target */}

        <div className="mb-5">

          <label className="mb-2 block text-sm text-slate-300">
            Target Amount
          </label>

          <input
            type="number"
            name="amount"
            value={goal.amount}
            onChange={handleChange}
            placeholder="₹50,000"
            className="w-full rounded-2xl border border-slate-700 bg-slate-800 p-4 text-white outline-none transition focus:border-cyan-500"
          />

        </div>

        {/* Deadline */}

        <div className="mb-8">

          <label className="mb-2 block text-sm text-slate-300">
            Deadline
          </label>

          <input
            type="date"
            name="deadline"
            value={goal.deadline}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-700 bg-slate-800 p-4 text-white outline-none transition focus:border-cyan-500"
          />

        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-4">

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 px-6 py-3 text-slate-300 transition hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white transition hover:scale-105"
          >
            Save Goal
          </button>

        </div>

      </motion.div>

    </div>
  );
}

export default GoalModal;