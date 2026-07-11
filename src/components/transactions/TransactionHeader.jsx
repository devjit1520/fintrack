import { CreditCard } from "lucide-react";

export default function TransactionHeader({ onAddClick }) {
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900 p-8 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-2xl bg-blue-500/20 p-3">
            <CreditCard className="text-blue-400" size={28} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white">
              Transactions
            </h1>

            <p className="text-slate-400">
              Manage your income and expenses.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onAddClick}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
       +   Add Transaction
      </button>
    </div>
  );
}