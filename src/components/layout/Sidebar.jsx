import { NavLink } from "react-router-dom";

import {
  ChevronRight,
  CircleUserRound,
  Landmark,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import navigationItems from "../../data/navigation";

/* =========================================================
   SIDEBAR NAVIGATION ITEM
========================================================= */

function SidebarNavigationItem({
  item,
  collapsed,
}) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === "/dashboard"}
      aria-label={item.label}
      title={
        collapsed
          ? item.label
          : undefined
      }
      className={({ isActive }) => `
        group
        relative
        flex
        min-h-[58px]
        items-center
        rounded-2xl
        border
        transition-all
        duration-200
        focus:outline-none
        focus:ring-4
        focus:ring-blue-500/10

        ${
          collapsed
            ? "justify-center px-1"
            : "gap-3 px-3"
        }

        ${
          isActive
            ? `
              border-blue-500/20
              bg-gradient-to-r
              from-cyan-500/10
              via-blue-500/10
              to-violet-500/10
              text-blue-600
              shadow-sm
              dark:border-blue-400/15
              dark:text-blue-300
            `
            : `
              border-transparent
              text-slate-500
              hover:border-slate-200/80
              hover:bg-slate-100/80
              hover:text-slate-950
              dark:text-slate-400
              dark:hover:border-white/[0.07]
              dark:hover:bg-white/[0.045]
              dark:hover:text-white
            `
        }
      `}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span
              className="
                absolute
                -left-1
                top-1/2
                h-8
                w-1
                -translate-y-1/2
                rounded-full
                bg-gradient-to-b
                from-cyan-400
                via-blue-500
                to-violet-500
                shadow-[0_0_14px_rgba(59,130,246,0.65)]
              "
            />
          )}

          <span
            className={`
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-2xl
              transition-all
              duration-200

              ${
                isActive
                  ? `
                    bg-gradient-to-br
                    from-cyan-500
                    via-blue-500
                    to-violet-500
                    text-white
                    shadow-lg
                    shadow-blue-500/25
                  `
                  : `
                    bg-slate-100
                    text-slate-500
                    group-hover:bg-white
                    group-hover:text-blue-600
                    dark:bg-white/[0.055]
                    dark:text-slate-400
                    dark:group-hover:bg-white/[0.08]
                    dark:group-hover:text-blue-300
                  `
              }
            `}
          >
            <Icon size={18} />
          </span>

          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span
                  className="
                    block
                    truncate
                    text-sm
                    font-black
                  "
                >
                  {item.label}
                </span>

                <span
                  className="
                    mt-0.5
                    block
                    truncate
                    text-[9px]
                    font-medium
                    text-slate-400
                    dark:text-slate-500
                  "
                >
                  {item.description}
                </span>
              </span>

              <ChevronRight
                size={15}
                className={`
                  shrink-0
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? `
                        translate-x-0
                        text-blue-500
                        opacity-100
                        dark:text-blue-300
                      `
                      : `
                        -translate-x-1
                        text-slate-400
                        opacity-0
                        group-hover:translate-x-0
                        group-hover:opacity-100
                      `
                  }
                `}
              />
            </>
          )}

          {collapsed && (
            <span
              className="
                pointer-events-none
                absolute
                left-[calc(100%+12px)]
                top-1/2
                z-[120]
                -translate-y-1/2
                whitespace-nowrap
                rounded-xl
                border
                border-slate-200
                bg-white
                px-3
                py-2
                text-xs
                font-bold
                text-slate-800
                opacity-0
                shadow-xl
                transition-all
                duration-200
                group-hover:opacity-100
                dark:border-white/[0.09]
                dark:bg-slate-900
                dark:text-white
              "
            >
              {item.label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

/* =========================================================
   PROFILE NAVIGATION
========================================================= */

function ProfileNavigation({
  collapsed,
}) {
  return (
    <NavLink
      to="/profile"
      end
      aria-label="My Profile"
      title={
        collapsed
          ? "My Profile"
          : undefined
      }
      className={({ isActive }) => `
        group
        relative
        flex
        items-center
        rounded-2xl
        border
        transition-all
        duration-200

        ${
          collapsed
            ? `
              mx-auto
              h-14
              w-14
              justify-center
              p-1.5
            `
            : `
              min-h-[64px]
              gap-3
              px-3
            `
        }

        ${
          isActive
            ? `
              border-violet-500/30
              bg-violet-500/10
              text-violet-600
              shadow-sm
              dark:text-violet-300
            `
            : `
              border-slate-200/80
              bg-slate-50/70
              text-slate-700
              hover:border-violet-500/20
              hover:bg-violet-500/[0.06]
              hover:text-violet-600
              dark:border-white/[0.08]
              dark:bg-white/[0.025]
              dark:text-slate-300
              dark:hover:text-violet-300
            `
        }
      `}
    >
      {({ isActive }) => (
        <>
          <span
            className={`
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              transition-all
              duration-200

              ${
                isActive
                  ? `
                    bg-gradient-to-br
                    from-violet-500
                    to-blue-500
                    text-white
                    shadow-lg
                    shadow-violet-500/20
                  `
                  : `
                    bg-violet-500/10
                    text-violet-600
                    dark:text-violet-300
                  `
              }
            `}
          >
            <CircleUserRound size={20} />
          </span>

          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span
                  className="
                    block
                    truncate
                    text-xs
                    font-black
                  "
                >
                  My Profile
                </span>

                <span
                  className="
                    mt-0.5
                    block
                    truncate
                    text-[9px]
                    font-medium
                    text-slate-400
                    dark:text-slate-500
                  "
                >
                  Account and preferences
                </span>
              </span>

              <ChevronRight
                size={15}
                className={
                  isActive
                    ? "text-violet-500"
                    : "text-slate-400"
                }
              />
            </>
          )}

          {collapsed && (
            <span
              className="
                pointer-events-none
                absolute
                bottom-1/2
                left-[calc(100%+12px)]
                z-[120]
                translate-y-1/2
                whitespace-nowrap
                rounded-xl
                border
                border-slate-200
                bg-white
                px-3
                py-2
                text-xs
                font-bold
                text-slate-800
                opacity-0
                shadow-xl
                transition-all
                duration-200
                group-hover:opacity-100
                dark:border-white/[0.09]
                dark:bg-slate-900
                dark:text-white
              "
            >
              My Profile
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

/* =========================================================
   SIDEBAR BRAND
========================================================= */

function SidebarBrand({
  collapsed,
  onToggleCollapse,
}) {
  return (
    <div
      className={`
        flex
        h-24
        shrink-0
        items-center
        border-b
        border-slate-200/80
        transition-all
        duration-300
        dark:border-white/[0.07]

        ${
          collapsed
            ? `
              justify-center
              gap-1
              px-1.5
            `
            : `
              gap-3
              px-5
            `
        }
      `}
    >
      {/* Logo */}

      <div
        className={`
          flex
          shrink-0
          items-center
          justify-center
          rounded-2xl
          bg-gradient-to-br
          from-cyan-500
          via-blue-500
          to-violet-500
          text-white
          shadow-lg
          shadow-blue-500/25
          transition-all
          duration-300

          ${
            collapsed
              ? "h-10 w-10"
              : "h-12 w-12"
          }
        `}
      >
        <Landmark
          size={
            collapsed
              ? 19
              : 22
          }
        />
      </div>

      {/* Brand text */}

      {!collapsed && (
        <div className="min-w-0 flex-1">
          <p
            className="
              truncate
              text-xl
              font-black
              tracking-tight
              text-slate-950
              dark:text-white
            "
          >
            FinTrack
          </p>

          <p
            className="
              mt-0.5
              truncate
              text-[9px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-slate-400
            "
          >
            Finance Manager
          </p>
        </div>
      )}

      {/* Integrated collapse button */}

      <button
        type="button"
        onClick={() =>
          onToggleCollapse?.()
        }
        aria-label={
          collapsed
            ? "Expand sidebar"
            : "Collapse sidebar"
        }
        title={
          collapsed
            ? "Expand sidebar"
            : "Collapse sidebar"
        }
        className={`
          flex
          shrink-0
          items-center
          justify-center
          rounded-lg
          text-slate-400
          transition-all
          duration-200
          hover:bg-blue-500/10
          hover:text-blue-600
          focus:outline-none
          focus:ring-4
          focus:ring-blue-500/10
          dark:text-slate-500
          dark:hover:bg-white/[0.06]
          dark:hover:text-blue-300

          ${
            collapsed
              ? `
                h-6
                w-6
              `
              : `
                h-9
                w-9
              `
          }
        `}
      >
        {collapsed ? (
          <PanelLeftOpen
            size={14}
          />
        ) : (
          <PanelLeftClose
            size={17}
          />
        )}
      </button>
    </div>
  );
}

/* =========================================================
   DESKTOP SIDEBAR
========================================================= */

function Sidebar({
  collapsed = false,
  onToggleCollapse,
}) {
  return (
    <aside
      className={`
        fixed
        inset-y-0
        left-0
        z-[70]
        hidden
        h-dvh
        flex-col
        overflow-visible
        border-r
        border-slate-200/80
        bg-white/95
        shadow-xl
        backdrop-blur-2xl
        transition-[width]
        duration-300
        ease-in-out
        dark:border-white/[0.07]
        dark:bg-[#081225]/95
        lg:flex

        ${
          collapsed
            ? "w-20"
            : "w-72"
        }
      `}
    >
      <SidebarBrand
        collapsed={collapsed}
        onToggleCollapse={
          onToggleCollapse
        }
      />

      {/* Navigation */}

      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overflow-x-visible
          px-3
          py-5
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {!collapsed && (
          <p
            className="
              mb-4
              px-3
              text-[9px]
              font-black
              uppercase
              tracking-[0.18em]
              text-slate-400
            "
          >
            Main Menu
          </p>
        )}

        <nav
          aria-label="Main navigation"
          className="space-y-2"
        >
          {navigationItems.map(
            (item) => (
              <SidebarNavigationItem
                key={item.id}
                item={item}
                collapsed={collapsed}
              />
            )
          )}
        </nav>
      </div>

      {/* Profile */}

      <div
        className={`
          shrink-0
          border-t
          border-slate-200/80
          dark:border-white/[0.07]

          ${
            collapsed
              ? "px-2 py-4"
              : "p-3"
          }
        `}
      >
        <ProfileNavigation
          collapsed={collapsed}
        />
      </div>
    </aside>
  );
}

export default Sidebar;