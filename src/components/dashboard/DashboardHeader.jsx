
function DashboardHeader() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Dashboard 👋
        </h1>

        <p className="mt-2 text-slate-400">
          Welcome back, Devjit.
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {today}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-3">
        <p className="text-sm text-slate-400">
          Total Accounts
        </p>

        <h2 className="mt-1 text-2xl font-bold text-white">
          4
        </h2>
      </div>
    </div>
  );
}

export default DashboardHeader;