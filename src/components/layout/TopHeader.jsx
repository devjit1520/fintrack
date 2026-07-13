import { Menu, Search, Bell, User } from "lucide-react";
import NotificationBell from "../notifications/NotificationBell";

function TopHeader({
  openSidebar,
  openSearch,
}) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur-lg">

      {/* Left */}
      <div className="flex items-center gap-3">

        {/* Mobile Menu */}
        <button
          onClick={openSidebar}
          className="rounded-xl p-2 transition hover:bg-slate-800 lg:hidden"
        >
          <Menu size={24} />
        </button>

        {/* <h1 className="hidden text-xl font-bold lg:block">
          Dashboard
        </h1> */}

      </div>

      {/* Center Search */}
      <button
        onClick={openSearch}
        className="mx-6 hidden w-full max-w-xl items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2 text-left transition hover:border-cyan-500 md:flex"
      >
        <Search
          size={18}
          className="text-slate-400"
        />

        <span className="flex-1 text-slate-400">
          Search transactions, budgets...
        </span>

        <kbd className="rounded bg-slate-800 px-2 py-1 text-xs">
          Ctrl K
        </kbd>

      </button>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* Mobile Search */}
        <button
          onClick={openSearch}
          className="rounded-xl p-2 hover:bg-slate-800 md:hidden"
        >
          <Search size={22} />
        </button>

        <NotificationBell />

        <button className="rounded-full bg-cyan-600 p-2">
          <User size={18} />
        </button>

      </div>

    </header>
  );
}

export default TopHeader;