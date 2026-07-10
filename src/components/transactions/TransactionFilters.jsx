function TransactionFilters({
  filter,
  setFilter,
  category,
  setCategory,
  sort,
  setSort,
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">

      {/* Type */}
      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Type
        </label>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white"
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Category
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white"
        >
          <option value="all">All Categories</option>
          <option value="Salary">Salary</option>
          <option value="Food">Food</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Travel">Travel</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Health">Health</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Sort By
        </label>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>
      </div>

      <button
        onClick={() => {
          setFilter("all");
          setCategory("all");
          setSort("newest");
        }}
        className="w-full rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
      >
        Clear Filters
      </button>

    </div>
  );
}

export default TransactionFilters;