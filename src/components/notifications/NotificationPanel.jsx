import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck } from "lucide-react";
import NotificationItem from "./NotificationItem";

function NotificationPanel({
  open,
  onClose,
  notifications,
  clearNotifications,
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay (mobile only) */}
          <div
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          />

          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="absolute right-4 top-16 z-50 w-[360px] overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl"
          >
            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-800 p-5">

              <div className="flex items-center gap-3">

                <Bell className="text-cyan-400" />

                <h2 className="text-lg font-bold">
                  Notifications
                </h2>

              </div>

              <button
                onClick={clearNotifications}
                className="flex items-center gap-2 rounded-xl bg-cyan-500/20 px-3 py-2 text-sm text-cyan-400 transition hover:bg-cyan-500/30"
              >
                <CheckCheck size={16} />
                Mark all
              </button>

            </div>

            {/* Body */}

            <div className="max-h-[450px] space-y-3 overflow-y-auto p-5">

              {notifications.length === 0 ? (
                <div className="py-12 text-center">

                  <Bell
                    size={40}
                    className="mx-auto mb-4 text-slate-600"
                  />

                  <p className="text-slate-500">
                    No Notifications
                  </p>

                </div>
              ) : (
                notifications.map((item) => (
                  <NotificationItem
                    key={item.id}
                    item={item}
                  />
                ))
              )}

            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default NotificationPanel;