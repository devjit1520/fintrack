import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  PiggyBank,
  Wallet,
  IndianRupee,
} from "lucide-react";

import useGoal from "../../hooks/useGoal";

function AddMoneyModal({ open, goal, onClose }) {
  const { updateGoal } = useGoal();

  const [amount, setAmount] = useState("");

  if (!open || !goal) return null;

  const currentSaved = Number(
    goal.savedAmount || goal.saved || 0
  );

  const target = Number(
    goal.targetAmount ||
      goal.target ||
      goal.amount ||
      0
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = Number(amount);

    if (value <= 0) return;

    updateGoal({
      ...goal,

      savedAmount: currentSaved + value,
    });

    setAmount("");

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
          max-w-lg
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

          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-green-500/10 blur-3xl" />

          {/* Header */}

          <div className="relative flex items-center justify-between border-b border-slate-200 dark:border-slate-800 p-7">

            <div>

              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Add Money
              </h2>

              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Increase your savings.
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

            <div className="grid grid-cols-2 gap-5">

              <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">

                <div className="flex items-center gap-2 text-slate-500">

                  <PiggyBank size={18} />

                  Saved

                </div>

                <h3 className="mt-3 text-2xl font-bold text-green-500">

                  ₹{currentSaved.toLocaleString()}

                </h3>

              </div>

              <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">

                <div className="flex items-center gap-2 text-slate-500">

                  <Wallet size={18} />

                  Target

                </div>

                <h3 className="mt-3 text-2xl font-bold text-cyan-500">

                  ₹{target.toLocaleString()}

                </h3>

              </div>

            </div>

            <div>

              <label className="mb-2 flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">

                <IndianRupee size={18} />

                Amount to Add

              </label>

              <input
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                className="
                w-full
                rounded-xl
                border
                border-slate-300
                bg-slate-50
                p-4
                outline-none
                focus:border-green-500
                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
                "
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
              className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
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