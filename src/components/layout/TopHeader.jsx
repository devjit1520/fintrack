import { Menu, Search, User } from "lucide-react";
import NotificationBell from "../notifications/NotificationBell";
import ThemeToggle from "../common/ThemeToggle";

function TopHeader({
  openSidebar,
  openSearch,
}) {
  return (
    <header
      className="
        sticky
        top-0
        z-40
        flex
        h-16
        items-center
        justify-between

        border-b
        border-slate-200
        dark:border-slate-800

        bg-white
        dark:bg-slate-950/90

        backdrop-blur-xl

        px-4

        transition-colors
        duration-300
      "
    >
      {/* Left */}
      <div className="flex items-center gap-3">

        {/* Mobile Menu */}
        <button
          onClick={openSidebar}
          className="
            rounded-xl
            p-2
            transition

            hover:bg-slate-100
            dark:hover:bg-slate-800

            text-slate-700
            dark:text-white

            lg:hidden
          "
        >
          <Menu size={24} />
        </button>

      </div>

      {/* Search */}

      <button
        onClick={openSearch}
        className="
          mx-6
          hidden
          w-full
          max-w-xl
          items-center
          gap-3

          rounded-2xl

          border
          border-slate-200
          dark:border-slate-700

          bg-white
          dark:bg-slate-900

          px-4
          py-2

          text-left

          transition-all

          hover:border-cyan-500

          md:flex
        "
      >

        <Search
          size={18}
          className="text-slate-500 dark:text-slate-400"
        />

        <span className="flex-1 text-slate-500 dark:text-slate-400">
          Search transactions, budgets...
        </span>

        <kbd
          className="
            rounded-lg

            bg-slate-200
            dark:bg-slate-800

            px-2
            py-1

            text-xs

            text-slate-600
            dark:text-slate-400
          "
        >
          Ctrl K
        </kbd>

      </button>

      {/* Right */}

      <div className="flex items-center gap-3">

        {/* Mobile Search */}

        <button
          onClick={openSearch}
          className="
            rounded-xl
            p-2

            transition

            hover:bg-slate-100
            dark:hover:bg-slate-800

            text-slate-700
            dark:text-white

            md:hidden
          "
        >
          <Search size={22} />
        </button>

        <NotificationBell />

        <ThemeToggle />

        <button
          className="
            flex
            h-10
            w-10
            items-center
            justify-center

            rounded-full

            bg-cyan-500

            text-white

            shadow-lg

            transition

            hover:scale-105
          "
        >
          <User size={18} />
        </button>

      </div>

    </header>
  );
}

export default TopHeader;