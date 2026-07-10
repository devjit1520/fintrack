import { Search } from "lucide-react";
import { budgetCategories } from "../../data/budgetCategories";

function BudgetToolbar({
  search,
  setSearch,
  category,
  setCategory,
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="relative">
        <Search
          className="absolute left-3 top-3 text-slate-400"
          size={18}
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search budget..."
          className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-10 pr-4 text-white"
        />
      </div>

      <select
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
        className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-white"
      >
        <option value="all">All Categories</option>

        {budgetCategories.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </div>
  );
}

export default BudgetToolbar;