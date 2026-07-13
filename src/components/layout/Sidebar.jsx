import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import { navigation } from "../../data/navigation";

function Sidebar() {
  return (
    <aside
      className="
        fixed
        left-0
        top-0
        hidden
        h-screen
        w-72
        lg:flex
        lg:flex-col

        bg-white
        dark:bg-slate-950

        border-r
        border-slate-200
        dark:border-slate-800

        transition-colors
        duration-300
      "
    >
      {/* Logo */}
      <Logo />

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item) => (
          <SidebarItem
            key={item.id}
            {...item}
          />
        ))}
      </nav>

      {/* Footer Card */}
      <div
        className="
          border-t
          border-slate-200
          dark:border-slate-800
          p-5
        "
      >
        <div
          className="
            rounded-2xl

            bg-slate-100
            dark:bg-slate-900

            border
            border-slate-200
            dark:border-slate-800

            p-5

            transition-all
            duration-300
          "
        >
          <h3 className="font-semibold text-slate-900 dark:text-white">
            FinTrack Pro
          </h3>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            React • Tailwind CSS
          </p>

          <div className="mt-4">
            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-600 dark:text-cyan-400">
              Portfolio Project
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;