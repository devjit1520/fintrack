import { NavLink } from "react-router-dom";

function SidebarItem({
  item,
  onClick,
}) {
  const Icon = item.icon;

  /*
    Dashboard must match only /dashboard.
    Other pages may stay active for nested routes,
    such as /goals/edit or /transactions/details.
  */

  const exactMatch =
    item.path === "/dashboard" ||
    item.path === "/";

  return (
    <NavLink
      to={item.path}
      end={exactMatch}
      onClick={() => {
        onClick?.();
      }}
      className="group relative block"
    >
      {({ isActive }) => (
        <div
          className={`
            relative
            flex
            min-h-13
            items-center
            gap-3
            overflow-hidden
            rounded-2xl
            px-4
            py-3
            text-sm
            font-semibold
            transition-all
            duration-300
            ${
              isActive
                ? `
                  bg-gradient-to-r
                  from-cyan-500
                  via-blue-500
                  to-violet-500
                  text-white
                  shadow-lg
                  shadow-cyan-500/20
                `
                : `
                  text-slate-600
                  hover:bg-slate-100
                  hover:text-slate-950
                  dark:text-slate-400
                  dark:hover:bg-white/[0.06]
                  dark:hover:text-white
                `
            }
          `}
        >
          {/* Active glow */}

          {isActive && (
            <>
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-white/[0.08]
                  via-transparent
                  to-white/[0.06]
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-8
                  -top-8
                  h-24
                  w-24
                  rounded-full
                  bg-white/15
                  blur-2xl
                "
              />
            </>
          )}

          {/* Icon */}

          <span
            className={`
              relative
              z-10
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              transition-all
              duration-300
              ${
                isActive
                  ? `
                    bg-white/15
                    text-white
                    shadow-inner
                  `
                  : `
                    bg-slate-100
                    text-slate-500
                    group-hover:bg-cyan-500/10
                    group-hover:text-cyan-600
                    dark:bg-white/[0.05]
                    dark:text-slate-400
                    dark:group-hover:text-cyan-400
                  `
              }
            `}
          >
            <Icon size={20} />
          </span>

          {/* Label */}

          <span className="relative z-10 flex-1">
            {item.label}
          </span>

          {/* Active dot */}

          {isActive && (
            <span
              className="
                relative
                z-10
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
                bg-white/15
              "
            >
              <span className="h-2 w-2 rounded-full bg-white" />
            </span>
          )}
        </div>
      )}
    </NavLink>
  );
}

export default SidebarItem;