import { useState } from "react";
import { Wallet } from "lucide-react";
import AddBudgetModal from "./AddBudgetModal";

function BudgetHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Budget
          </h1>

          <p className="mt-2 text-slate-400">
            Manage monthly spending limits
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition"
        >
          <Wallet className="mr-2 inline" size={18} />
          Add Budget
        </button>
      </div>

      <AddBudgetModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export default BudgetHeader;