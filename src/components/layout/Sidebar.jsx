import navigation from "../../data/navigation";
import SidebarItem from "./SidebarItem";
import SidebarProfileCard from "./SidebarProfileCard";
import {
  ShieldCheck,

} from "lucide-react";

function Sidebar() {
  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-50
        hidden
        h-dvh
        w-72
        flex-col
        border-r
        border-slate-200
        bg-white
        transition-colors
        dark:border-slate-800
        dark:bg-slate-950
        lg:flex
      "
    >
      {/* Logo area */}

      <div
        className="
          flex
          h-20
          shrink-0
          items-center
          border-b
          border-slate-200
          px-5
          dark:border-slate-800
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-cyan-400
              via-blue-500
              to-violet-600
              text-white
              shadow-lg
              shadow-cyan-500/20
            "
          >
            <span className="text-xl font-black">
              F
            </span>
          </div>

          <div>
            <h1 className="text-xl font-black text-slate-950 dark:text-white">
              FinTrack
            </h1>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personal Finance Manager
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}

      <nav
        className="
          flex-1
          space-y-2
          overflow-y-auto
          px-4
          py-6
        "
      >
        {navigation.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
          />
        ))}
      </nav>

      {/* Bottom project card */}
<div
  className="
    mt-auto
    border-t
    border-white/[0.08]
    p-4
  "
>
  <SidebarProfileCard />
</div> 

    </aside>
  );
}

export default Sidebar;