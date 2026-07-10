import Logo from "./Logo";
import SidebarItem from "./SidebarItem";

import { navigation } from "../../data/navigation";

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-slate-800 bg-slate-950 lg:flex lg:flex-col">

      <Logo />

      <nav className="flex-1 space-y-2 p-4">

        {navigation.map((item) => (
          <SidebarItem
            key={item.id}
            {...item}
          />
        ))}

      </nav>

      <div className="border-t border-slate-800 p-5">

        <div className="rounded-2xl bg-slate-900 p-5">

          <h3 className="font-semibold">
            Portfolio Project
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            React • Tailwind CSS
          </p>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;