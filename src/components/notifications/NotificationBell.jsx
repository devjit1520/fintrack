import { useState } from "react";
import { Bell } from "lucide-react";

import useNotifications from "../../hooks/useNotifications";
import NotificationPanel from "./NotificationPanel";

function NotificationBell() {
  const { notifications } = useNotifications();

  const [open, setOpen] = useState(false);

  const [items, setItems] = useState(notifications);

  const clearNotifications = () => {
    setItems([]);
  };

  return (
    <div className="relative text-black/60 dark:text-white">

      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-xl p-2 transition  hover:bg-slate-800 hover:text-white"
      >

        <Bell size={22} />

        {items.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {items.length}
          </span>
        )}

      </button>

      <NotificationPanel
        open={open}
        onClose={() => setOpen(false)}
        notifications={items}
        clearNotifications={clearNotifications}
      />

    </div>
  );
}

export default NotificationBell;