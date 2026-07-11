import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Wallet,
  Target,
  CalendarDays,
  Mail,
  Smartphone,
} from "lucide-react";

function NotificationSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("notificationSettings");

    return saved
      ? JSON.parse(saved)
      : {
          budgetAlert: true,
          goalReminder: true,
          weeklySummary: false,
          emailNotification: true,
          pushNotification: false,
        };
  });

  useEffect(() => {
    localStorage.setItem(
      "notificationSettings",
      JSON.stringify(settings)
    );
  }, [settings]);

  const toggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const items = [
    {
      key: "budgetAlert",
      title: "Budget Alerts",
      subtitle: "Warn when spending exceeds budget",
      icon: Wallet,
    },
    {
      key: "goalReminder",
      title: "Goal Reminder",
      subtitle: "Receive reminders for savings goals",
      icon: Target,
    },
    {
      key: "weeklySummary",
      title: "Weekly Summary",
      subtitle: "Receive weekly finance reports",
      icon: CalendarDays,
    },
    {
      key: "emailNotification",
      title: "Email Notifications",
      subtitle: "Send reports to your email",
      icon: Mail,
    },
    {
      key: "pushNotification",
      title: "Push Notifications",
      subtitle: "Browser notifications",
      icon: Smartphone,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >
      <div className="mb-8 flex items-center gap-3">
        <Bell
          size={28}
          className="text-cyan-400"
        />

        <h2 className="text-2xl font-bold text-white">
          Notifications
        </h2>
      </div>

      <div className="space-y-5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-2xl bg-slate-800/50 p-5"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-cyan-500/20 p-3">
                  <Icon
                    size={22}
                    className="text-cyan-400"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-400">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggle(item.key)}
                className={`relative h-7 w-14 rounded-full transition ${
                  settings[item.key]
                    ? "bg-cyan-500"
                    : "bg-slate-600"
                }`}
              >
                <motion.div
                  layout
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                  className="absolute top-1 h-5 w-5 rounded-full bg-white"
                  style={{
                    left: settings[item.key]
                      ? "34px"
                      : "4px",
                  }}
                />
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default NotificationSettings;