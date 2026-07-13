import { Search, X } from "lucide-react";

function TransactionSearch({
  search = "",
  setSearch = () => {},
}) {
  return (
    <div className="relative">

      <Search
        size={20}
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
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
          border-slate-200
          dark:border-slate-800

          bg-white
          dark:bg-slate-900

          py-4
          pl-12
          pr-12

          text-slate-900
          dark:text-white

          placeholder:text-slate-400
          dark:placeholder:text-slate-500

          outline-none
          transition

          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/20
        "
      />


      {search && (
        <button
          onClick={() => setSearch("")}
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2

            text-slate-400

            hover:text-slate-900
            dark:hover:text-white

            transition
          "
        >
          <X size={18} />
        </button>
      )}

    </div>
  );
}

export default TransactionSearch;