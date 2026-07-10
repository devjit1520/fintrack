import { Search } from "lucide-react";

function TransactionSearch({
  search = "",
  setSearch = () => {},
}) {
  return (
    <div className="relative">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        placeholder="Search by title or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
          py-4
          pl-12
          pr-4
          text-white
          outline-none
          transition
          focus:border-blue-500
        "
      />
    </div>
  );
}

export default TransactionSearch;