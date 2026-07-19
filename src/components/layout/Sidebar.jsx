import navigation from "../../data/navigation";
import SidebarItem from "./SidebarItem";
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
                shrink-0
                border-t
                border-slate-200
                p-4
                dark:border-slate-800
              "
            >
              <div
                className="
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-cyan-500/15
                  bg-gradient-to-br
                  from-cyan-500/[0.09]
                  via-blue-500/[0.05]
                  to-violet-500/[0.09]
                  p-4
                "
              >
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-10
                    -top-10
                    h-24
                    w-24
                    rounded-full
                    bg-violet-500/15
                    blur-2xl
                  "
                />

                <div className="relative flex items-start gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-emerald-500/10
                      text-emerald-500
                    "
                  >
                    <ShieldCheck size={18} />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        text-sm
                        font-bold
                        text-slate-950
                        dark:text-white
                      "
                    >
                      FinTrack Pro
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        leading-5
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Your financial data stays protected and
                      organized.
                    </p>
                  </div>
                </div>
              </div>
            </div>
    </aside>
  );
}

export default Sidebar;