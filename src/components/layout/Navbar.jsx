import {
  Search,
  Bell,
  Sun,
  UserCircle2,
} from "lucide-react";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-8 backdrop-blur-xl">

      {/* Search */}

      <div className="relative hidden w-96 lg:block">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500"
        />

      </div>

      {/* Right */}

      <div className="ml-auto flex items-center gap-4">

        <button className="rounded-xl bg-slate-900 p-3 transition hover:bg-slate-800">

          <Sun size={20} />

        </button>

        <button className="rounded-xl bg-slate-900 p-3 transition hover:bg-slate-800">

          <Bell size={20} />

        </button>

        <div className="flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-2">

          <UserCircle2 size={34} />

          <div>

            <h3 className="font-semibold">
              Devjit
            </h3>

            <p className="text-xs text-slate-400">
              Frontend Developer
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;