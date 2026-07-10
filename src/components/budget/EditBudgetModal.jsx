import { useEffect, useState } from "react";
import useBudget from "../../hooks/useBudget";

function EditBudgetModal({
  open,
  budget,
  onClose,
}) {
  const { updateBudget } = useBudget();

  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (budget) {
      setAmount(budget.amount);
    }
  }, [budget]);

  if (!open || !budget) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    updateBudget({
      ...budget,
      amount: Number(amount),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-slate-900 p-8"
      >

        <h2 className="mb-6 text-2xl font-bold text-white">
          Edit Budget
        </h2>

        <input
          type="number"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          className="mb-6 w-full rounded-xl bg-slate-800 p-3 text-white"
        />

        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-700 px-5 py-3"
          >
            Cancel
          </button>

          <button
            className="rounded-xl bg-blue-600 px-5 py-3"
          >
            Save
          </button>

        </div>

      </form>

    </div>
  );
}

export default EditBudgetModal;