import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  BellRing,
  CheckCheck,
  CircleDollarSign,
  PiggyBank,
  Target,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";

import useNotifications from "../../hooks/useNotifications";

/* =========================================================
   DATE FORMATTER
========================================================= */

function formatNotificationDate(value) {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/* =========================================================
   NOTIFICATION DESIGN
========================================================= */

function getNotificationDesign(type) {
  switch (type) {
    case "income":
      return {
        icon: CircleDollarSign,
        iconClasses:
          "bg-emerald-500/10 text-emerald-500",
      };

    case "expense":
      return {
        icon: CircleDollarSign,
        iconClasses:
          "bg-rose-500/10 text-rose-500",
      };

    case "warning":
      return {
        icon: TriangleAlert,
        iconClasses:
          "bg-amber-500/10 text-amber-500",
      };

    case "danger":
      return {
        icon: TriangleAlert,
        iconClasses:
          "bg-rose-500/10 text-rose-500",
      };

    case "success":
      return {
        icon: Target,
        iconClasses:
          "bg-violet-500/10 text-violet-500",
      };

    default:
      return {
        icon: PiggyBank,
        iconClasses:
          "bg-cyan-500/10 text-cyan-500",
      };
  }
}

/* =========================================================
   NOTIFICATION PANEL
========================================================= */

function NotificationPanel({
  open,
  onClose,
}) {
  const {
    notifications = [],
    unreadCount = 0,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
  } = useNotifications();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -10,
            scale: 0.97,
          }}
          transition={{
            duration: 0.18,
            ease: "easeOut",
          }}
          className="
            fixed
            inset-x-3
            top-[5.5rem]
            z-[120]
            flex
            max-h-[calc(100dvh-6.5rem)]
            flex-col
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-2xl
            shadow-slate-950/30
            dark:border-slate-700
            dark:bg-[#0d172a]
            dark:shadow-black/60

            sm:absolute
            sm:inset-x-auto
            sm:right-0
            sm:top-full
            sm:mt-3
            sm:w-[min(92vw,420px)]
          "
        >
          {/* =================================================
              HEADER
          ================================================== */}

          <div
            className="
              flex
              shrink-0
              items-start
              justify-between
              gap-3
              border-b
              border-slate-200
              bg-gradient-to-r
              from-cyan-500/[0.08]
              via-blue-500/[0.04]
              to-violet-500/[0.08]
              px-4
              py-4
              dark:border-slate-700
              sm:items-center
              sm:px-5
            "
          >
            <div className="flex min-w-0 items-start gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-cyan-500/10
                  text-cyan-500
                "
              >
                <BellRing size={20} />
              </div>

              <div className="min-w-0">
                <h3
                  className="
                    truncate
                    font-bold
                    text-slate-950
                    dark:text-white
                  "
                >
                  Notifications
                </h3>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${
                        unreadCount === 1
                          ? ""
                          : "s"
                      }`
                    : "You are all caught up"}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="
                    inline-flex
                    h-10
                    items-center
                    justify-center
                    gap-1.5
                    rounded-xl
                    border
                    border-cyan-500/20
                    bg-cyan-500/10
                    px-3
                    text-xs
                    font-semibold
                    text-cyan-600
                    transition
                    hover:bg-cyan-500/15
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    dark:text-cyan-400
                  "
                >
                  <CheckCheck size={15} />

                  <span className="hidden min-[390px]:inline">
                    Mark all
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close notifications"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  text-slate-500
                  transition
                  hover:bg-slate-100
                  hover:text-slate-900
                  dark:hover:bg-slate-800
                  dark:hover:text-white
                "
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* =================================================
              NOTIFICATION LIST
          ================================================== */}

          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              overscroll-contain
              p-3
            "
          >
            {notifications.length === 0 ? (
              <div
                className="
                  flex
                  min-h-64
                  flex-col
                  items-center
                  justify-center
                  px-5
                  text-center
                "
              >
                <div
                  className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-slate-100
                    text-slate-400
                    dark:bg-slate-800
                    dark:text-slate-500
                  "
                >
                  <BellRing size={30} />
                </div>

                <h4
                  className="
                    mt-5
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  No notifications
                </h4>

                <p
                  className="
                    mt-2
                    max-w-xs
                    text-sm
                    leading-6
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Transactions, budget warnings and completed
                  goals will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map(
                  (notification) => {
                    const design =
                      getNotificationDesign(
                        notification.type
                      );

                    const Icon =
                      design.icon;

                    return (
                      <motion.article
                        layout
                        key={notification.id}
                        className={`
                          group
                          relative
                          overflow-hidden
                          rounded-2xl
                          border
                          p-4
                          transition
                          ${
                            notification.read
                              ? `
                                border-slate-200
                                bg-slate-50/70
                                dark:border-slate-700
                                dark:bg-slate-900/50
                              `
                              : `
                                border-cyan-500/25
                                bg-cyan-500/[0.07]
                                dark:border-cyan-500/25
                                dark:bg-cyan-500/[0.07]
                              `
                          }
                        `}
                      >
                        {!notification.read && (
                          <span
                            className="
                              absolute
                              right-4
                              top-4
                              h-2.5
                              w-2.5
                              rounded-full
                              bg-cyan-500
                              shadow
                              shadow-cyan-500/40
                            "
                          />
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            markAsRead?.(
                              notification.id
                            )
                          }
                          className="
                            flex
                            w-full
                            items-start
                            gap-3
                            pr-7
                            text-left
                          "
                        >
                          <div
                            className={`
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              ${design.iconClasses}
                            `}
                          >
                            <Icon size={18} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p
                              className="
                                break-words
                                text-sm
                                font-bold
                                text-slate-900
                                dark:text-white
                              "
                            >
                              {notification.title}
                            </p>

                            <p
                              className="
                                mt-1
                                break-words
                                text-xs
                                leading-5
                                text-slate-500
                                dark:text-slate-400
                              "
                            >
                              {notification.message}
                            </p>

                            <p
                              className="
                                mt-2
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-wider
                                text-slate-400
                              "
                            >
                              {formatNotificationDate(
                                notification.createdAt
                              )}
                            </p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            dismissNotification?.(
                              notification.id
                            )
                          }
                          aria-label="Dismiss notification"
                          className="
                            absolute
                            bottom-3
                            right-3
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            text-slate-400
                            opacity-100
                            transition
                            hover:bg-rose-500/10
                            hover:text-rose-500
                            sm:opacity-0
                            sm:group-hover:opacity-100
                            sm:focus:opacity-100
                          "
                        >
                          <X size={15} />
                        </button>
                      </motion.article>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* =================================================
              FOOTER
          ================================================== */}

          {notifications.length > 0 && (
            <div
              className="
                shrink-0
                border-t
                border-slate-200
                bg-white
                p-3
                dark:border-slate-700
                dark:bg-[#0d172a]
              "
            >
              <button
                type="button"
                onClick={clearAll}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-500
                  transition
                  hover:bg-rose-500/10
                  hover:text-rose-500
                  dark:text-slate-400
                "
              >
                <Trash2 size={16} />

                Clear all notifications
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default NotificationPanel;