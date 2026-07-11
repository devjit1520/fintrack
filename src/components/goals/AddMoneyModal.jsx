import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useGoal from "../../hooks/useGoal";

function AddMoneyModal({ open, goal, onClose }) {
  const { updateGoal } = useGoal();

  const [amount, setAmount] = useState("");

  if (!open || !goal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = Number(amount);

    if (value <= 0) return;

    updateGoal({
      ...goal,
      saved: Number(goal.saved) + value,
    });

    setAmount("");

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
          initial={{
            scale: 0.9,
            y: 20,
          }}
          animate={{
            scale: 1,
            y: 0,
          }}
          exit={{
            scale: 0.9,
          }}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8"
        >

          <h2 className="mb-8 text-3xl font-bold text-white">
            Add Money
          </h2>

          <div className="mb-6">

            <p className="text-slate-400">
              Current Savings
            </p>

            <h3 className="mt-2 text-3xl font-bold text-cyan-400">
              ₹{Number(goal.saved).toLocaleString()}
            </h3>

          </div>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            className="mb-8 w-full rounded-xl bg-slate-800 p-4 text-white outline-none"
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-700 px-6 py-3 text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-green-600 px-6 py-3 text-white"
            >
              Add Money
            </button>

          </div>

        </motion.form>

      </motion.div>

    </AnimatePresence>
  );
}

export default AddMoneyModal;