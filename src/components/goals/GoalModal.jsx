import { useState } from "react";

function GoalModal({ open, onClose }) {
  const [goal, setGoal] = useState({
    title: "",
    amount: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setGoal({
      ...goal,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    localStorage.setItem(
      "goal",
      JSON.stringify(goal)
    );

    alert("Goal Saved Successfully!");

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 p-8">

        <h2 className="mb-6 text-2xl font-bold text-white">
          Set Savings Goal
        </h2>

        <input
          className="mb-4 w-full rounded-xl bg-slate-800 p-3 text-white"
          placeholder="Goal Name"
          name="title"
          value={goal.title}
          onChange={handleChange}
        />

        <input
          className="mb-4 w-full rounded-xl bg-slate-800 p-3 text-white"
          type="number"
          placeholder="Target Amount"
          name="amount"
          value={goal.amount}
          onChange={handleChange}
        />

        <input
          className="mb-6 w-full rounded-xl bg-slate-800 p-3 text-white"
          type="date"
          name="deadline"
          value={goal.deadline}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-700 px-5 py-3"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="rounded-xl bg-blue-600 px-5 py-3 text-white"
          >
            Save Goal
          </button>

        </div>

      </div>
    </div>
  );
}

export default GoalModal;