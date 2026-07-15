import { useState } from "react";
import { X, Target, CalendarDays, IndianRupee } from "lucide-react";

import useGoal from "../../hooks/useGoal";

function GoalModal({ open, onClose }) {
  const { addGoal } = useGoal();

  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    savedAmount: "",
    deadline: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      targetAmount: "",
      savedAmount: "",
      deadline: "",
    });

    setError("");
  };

  const handleClose = () => {
    if (submitting) return;

    resetForm();
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = formData.title.trim();
    const targetAmount = Number(formData.targetAmount);
    const savedAmount = Number(formData.savedAmount || 0);

    if (!title) {
      setError("Goal title is required.");
      return;
    }

    if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
      setError("Enter a valid target amount.");
      return;
    }

    if (!Number.isFinite(savedAmount) || savedAmount < 0) {
      setError("Saved amount cannot be negative.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const result = await addGoal({
        title,
        targetAmount,
        savedAmount,
        deadline: formData.deadline || null,
        status:
          savedAmount >= targetAmount
            ? "completed"
            : "active",
      });

      if (!result?.success) {
        setError(
          result?.error ||
            "The goal could not be created."
        );
        return;
      }

      resetForm();
      onClose();
    } catch (submitError) {
      console.error("Goal creation failed:", submitError);

      setError(
        submitError.message ||
          "The goal could not be created."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Create Saving Goal
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Set a financial target and track your progress.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Goal Name
            </label>

            <div className="relative">
              <Target
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Buy a new laptop"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="targetAmount"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Target Amount
              </label>

              <div className="relative">
                <IndianRupee
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="targetAmount"
                  name="targetAmount"
                  type="number"
                  min="1"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  placeholder="50000"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="savedAmount"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Already Saved
              </label>

              <div className="relative">
                <IndianRupee
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="savedAmount"
                  name="savedAmount"
                  type="number"
                  min="0"
                  value={formData.savedAmount}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="deadline"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Deadline
            </label>

            <div className="relative">
              <CalendarDays
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900 dark:bg-red-950/30">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex min-w-36 items-center justify-center rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GoalModal;