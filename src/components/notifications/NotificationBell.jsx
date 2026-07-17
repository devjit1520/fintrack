import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bell,
} from "lucide-react";

import useNotifications from "../../hooks/useNotifications";
import NotificationPanel from "./NotificationPanel";

function NotificationBell() {
  const wrapperRef =
    useRef(null);

  const [open, setOpen] =
    useState(false);

  const {
    unreadCount,
  } = useNotifications();

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleOutsideClick = (
      event
    ) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target
        )
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (
      event
    ) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setOpen(
            (current) => !current
          )
        }
        aria-label="Open notifications"
        aria-expanded={open}
        className={`
          relative
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          border
          transition
          ${
            open
              ? `
                border-cyan-500/40
                bg-cyan-500/10
                text-cyan-600
                dark:text-cyan-400
              `
              : `
                border-transparent
                text-slate-600
                hover:border-slate-200
                hover:bg-slate-100
                dark:text-slate-300
                dark:hover:border-slate-700
                dark:hover:bg-slate-800
              `
          }
        `}
      >
        <Bell size={21} />

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -right-1
              -top-1
              flex
              h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-red-500
              px-1
              text-[10px]
              font-bold
              text-white
              shadow-lg
              shadow-red-500/30
            "
          >
            {unreadCount > 9
              ? "9+"
              : unreadCount}
          </span>
        )}
      </button>

      <NotificationPanel
        open={open}
        onClose={() =>
          setOpen(false)
        }
      />
    </div>
  );
}

export default NotificationBell;