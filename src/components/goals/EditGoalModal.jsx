import { useEffect, useState } from "react";
import useGoal from "../../hooks/useGoal";

function EditGoalModal({
  open,
  goal,
  onClose,
}) {
  const { updateGoal } = useGoal();

  const [form, setForm] = useState(goal);

  useEffect(() => {
    setForm(goal);
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
      ...form,
      target: Number(form.target),
      saved: Number(form.saved),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-3xl bg-slate-900 p-8"
      >

        <h2 className="mb-6 text-2xl font-bold text-white">
          Edit Goal
        </h2>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="mb-4 w-full rounded-xl bg-slate-800 p-3 text-white"
        />

        <input
          name="target"
          type="number"
          value={form.target}
          onChange={handleChange}
          className="mb-4 w-full rounded-xl bg-slate-800 p-3 text-white"
        />

        <input
          name="saved"
          type="number"
          value={form.saved}
          onChange={handleChange}
          className="mb-4 w-full rounded-xl bg-slate-800 p-3 text-white"
        />

        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="mb-6 w-full rounded-xl bg-slate-800 p-3 text-white"
        />

        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-700 px-5 py-3 text-white"
          >
            Cancel
          </button>

          <button
            className="rounded-xl bg-blue-600 px-5 py-3 text-white"
          >
            Save
          </button>

        </div>

      </form>

    </div>
  );
}

export default EditGoalModal;