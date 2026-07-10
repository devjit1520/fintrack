// import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function TransactionTable({
  search = "",
  filter = "all",
  category = "all",
  sort = "newest",
  onEdit,
}) {
  const { transactions, deleteTransaction } = useFinance();

  let filteredTransactions = [...transactions].filter((item) => {
    const title = (item.title || "").toLowerCase();
    const itemCategory = (item.category || "").toLowerCase();
    const searchText = (search || "").toLowerCase();
    // const [editing, setEditing] = useState(null);

    const matchesSearch =
      title.includes(searchText) ||
      itemCategory.includes(searchText);

    const matchesType =
      filter === "all" || item.type === filter;

    const matchesCategory =
      category === "all" ||
      item.category === category;

    return (
      matchesSearch &&
      matchesType &&
      matchesCategory
    );
  });

  filteredTransactions.sort((a, b) => {
    switch (sort) {
      case "highest":
        return Number(b.amount) - Number(a.amount);

      case "lowest":
        return Number(a.amount) - Number(b.amount);

      case "oldest":
        return new Date(a.date) - new Date(b.date);

      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  return (
    <Card>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Transactions
          </h2>

          <p className="text-sm text-slate-400">
            Manage your income and expenses
          </p>
        </div>

        <div className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
          {filteredTransactions.length} Records
        </div>
      </div>

      {/* Empty State */}
      {filteredTransactions.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white">
              No Transactions Found
            </h3>

            <p className="mt-2 text-slate-400">
              Add a transaction or change the filters.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 text-left text-slate-400">
                <th className="py-4">Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Date</th>
                <th className="text-right">Amount</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-800 transition hover:bg-slate-800/40"
                >
                  <td className="py-4 font-medium text-white">
                    {item.title}
                  </td>

                  <td className="text-slate-300">
                    {item.category}
                  </td>

                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.type === "income"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>

                  <td className="text-slate-400">
                    {item.date}
                  </td>

                  <td
                    className={`text-right font-bold ${
                      item.type === "income"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {item.type === "income" ? "+" : "-"}₹
                    {Number(item.amount).toLocaleString("en-IN")}
                  </td>

                  <td>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => onEdit(item)}
                        className="rounded-lg bg-blue-500/20 p-2 text-blue-400 transition hover:bg-blue-500/30"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Delete this transaction?"
                            )
                          ) {
                            deleteTransaction(item.id);
                          }
                        }}
                        className="rounded-lg bg-red-500/20 p-2 text-red-400 transition hover:bg-red-500/30"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export default TransactionTable;