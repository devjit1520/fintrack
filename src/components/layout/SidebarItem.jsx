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
        `group flex items-center gap-4 rounded-2xl px-5 py-4 font-medium transition-all duration-300 ${
          isActive
            ? "bg-blue-600 text-white shadow-lg"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`
      }
    >
      <Icon size={22} />

      <span>{title}</span>
    </NavLink>
  );
}

export default SidebarItem;