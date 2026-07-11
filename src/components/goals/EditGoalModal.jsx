import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useGoal from "../../hooks/useGoal";

function EditGoalModal({ open, goal, onClose }) {
  const { updateGoal } = useGoal();

  const [form, setForm] = useState({
    name: "",
    target: "",
    saved: "",
    deadline: "",
  });

  useEffect(() => {
    if (goal) {
      setForm({
        name: goal.name || "",
        target: goal.target || "",
        saved: goal.saved || 0,
        deadline: goal.deadline || "",
      });
    }
  }, [goal]);

  if (!open || !goal) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateGoal({
      ...goal,
      ...form,
      target: Number(form.target),
      saved: Number(form.saved),
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.form
          onSubmit={handleSubmit}
          initial={{ scale: 0.9, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9 }}
          className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-8"
        >
          <h2 className="mb-8 text-3xl font-bold text-white">
            Edit Goal
          </h2>

          <div className="space-y-5">

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Goal Name"
              className="w-full rounded-xl bg-slate-800 p-4 text-white outline-none"
            />

            <input
              name="target"
              type="number"
              value={form.target}
              onChange={handleChange}
              placeholder="Target Amount"
              className="w-full rounded-xl bg-slate-800 p-4 text-white outline-none"
            />

            <input
              name="saved"
              type="number"
              value={form.saved}
              onChange={handleChange}
              placeholder="Current Savings"
              className="w-full rounded-xl bg-slate-800 p-4 text-white outline-none"
            />

            <input
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-800 p-4 text-white outline-none"
            />

          </div>

          <div className="mt-8 flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-700 px-6 py-3 text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-cyan-600 px-6 py-3 text-white"
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