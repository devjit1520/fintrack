import { NavLink } from "react-router-dom";

function SidebarItem({
  title,
  path,
  icon: Icon,
}) {
  return (
    <NavLink
      to={path}
      end={path === "/"}
      className={({ isActive }) =>
        `
        group
        flex
        items-center
        gap-4
        rounded-2xl
        px-5
        py-4
        font-medium
        transition-all
        duration-300

        ${
          isActive
            ? "bg-cyan-600 text-white shadow-lg"
            : `
              text-slate-700
              dark:text-slate-400

              hover:bg-slate-100
              dark:hover:bg-slate-800

              hover:text-cyan-600
              dark:hover:text-white
            `
        }
        `
      }
    >
      <Icon size={22} />

      <span>{title}</span>
    </NavLink>
  );
}

export default SidebarItem;