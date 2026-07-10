import { Search } from "lucide-react";

function SearchFilter({
  search,
  setSearch,
  filter,
  setFilter,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:w-80">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search transaction..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-11 pr-4 text-white outline-none focus:border-blue-500"
        />
      </div>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
      >
        <option value="all">All</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
    </div>
  );
}

export default SearchFilter;