import { CreditCard, Plus } from "lucide-react";

function TransactionHeader() {
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900 p-8 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-2xl bg-blue-500/20 p-3">
            <CreditCard
              className="text-blue-400"
              size={28}
            />
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

      <button className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white transition hover:scale-105">
        <Plus size={20} />
        Add Transaction
      </button>
    </div>
  );
}

export default TransactionHeader;