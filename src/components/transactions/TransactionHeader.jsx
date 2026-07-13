import { CreditCard, Plus } from "lucide-react";

export default function TransactionHeader({ onAddClick }) {
  return (
    <div
      className="
        flex
        flex-col
        gap-6
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-8
        dark:border-slate-800
        dark:bg-slate-900
        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >

      {/* Title Section */}
      <div>
        <div className="flex items-center gap-4">

          <div
            className="
              rounded-2xl
              bg-blue-500/20
              p-3
              shadow-lg
              shadow-blue-500/10
            "
          >
            <CreditCard
              className="text-blue-500 dark:text-blue-400"
              size={28}
            />
          </div>


          <div>
            <h1
              className="
                text-3xl
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              Transactions
            </h1>

            <p
              className="
                mt-1
                text-slate-600
                dark:text-slate-400
              "
            >
              Manage your income and expenses.
            </p>
          </div>

        </div>
      </div>


      {/* Add Button */}
      <button
        onClick={onAddClick}
        className="
          flex
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-blue-600
          px-5
          py-3
          font-medium
          text-white
          transition-all
          duration-300
          hover:bg-blue-700
          hover:shadow-lg
          hover:shadow-blue-500/20
          active:scale-95
        "
      >
        <Plus size={18} />
        Add Transaction
      </button>

    </div>
  );
}