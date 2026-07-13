function SearchItem({ item }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 transition hover:border-cyan-500">

      <p className="text-xs uppercase text-cyan-400">
        {item.type}
      </p>

      <h3 className="font-semibold text-white">
        {item.title}
      </h3>

      <p className="text-sm text-slate-400">
        {item.subtitle}
      </p>

    </div>
  );
}

export default SearchItem;