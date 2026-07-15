import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Coins,
  Languages,
  MonitorCog,
  RotateCcw,
  Save,
} from "lucide-react";

import ProfileCard from "./ProfileCard";
import useProfile from "../../hooks/useProfile";

const DEFAULT_PREFERENCES = {
  theme: "system",
  currency: "INR",
  language: "English",
  dateFormat: "DD/MM/YYYY",
};

function getStoredTheme() {
  if (typeof window === "undefined") {
    return "system";
  }

  const stored = localStorage.getItem("theme");
  return ["light", "dark", "system"].includes(stored) ? stored : "system";
}

function applyTheme(theme) {
  if (typeof window === "undefined") {
    return;
  }

  const shouldUseDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  document.documentElement.classList.toggle("dark", shouldUseDark);
  localStorage.setItem("theme", theme);
}

function PreferencesCard() {
  const { profile = {}, updatePreferences } = useProfile() || {};

  const savedPreferences = useMemo(
    () => ({
      ...DEFAULT_PREFERENCES,
      ...(profile.preferences || {}),
      theme: getStoredTheme(),
    }),
    [profile.preferences]
  );

  const [preferences, setPreferences] = useState(savedPreferences);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPreferences(savedPreferences);
  }, [savedPreferences]);

  useEffect(() => {
    if (!saved) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setSaved(false), 2400);
    return () => window.clearTimeout(timeout);
  }, [saved]);

  const hasChanges = JSON.stringify(preferences) !== JSON.stringify(savedPreferences);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setPreferences((current) => ({ ...current, [name]: value }));
    setSaved(false);

    if (name === "theme") {
      applyTheme(value);
    }
  };

  const handleReset = () => {
    setPreferences(savedPreferences);
    applyTheme(savedPreferences.theme);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!hasChanges || saving) {
      return;
    }

    try {
      setSaving(true);

      const { theme, ...profilePreferences } = preferences;
      await Promise.resolve(updatePreferences?.(profilePreferences));

      localStorage.setItem("fintrack_preferences", JSON.stringify(preferences));
      applyTheme(theme);
      setSaved(true);
    } catch (error) {
      console.error("Failed to save preferences:", error);
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    {
      name: "theme",
      label: "Theme",
      icon: MonitorCog,
      options: [
        ["system", "System preference"],
        ["light", "Light mode"],
        ["dark", "Dark mode"],
      ],
    },
    {
      name: "currency",
      label: "Currency",
      icon: Coins,
      options: [
        ["INR", "₹ INR — Indian Rupee"],
        ["USD", "$ USD — US Dollar"],
        ["EUR", "€ EUR — Euro"],
        ["GBP", "£ GBP — British Pound"],
      ],
    },
    {
      name: "language",
      label: "Language",
      icon: Languages,
      options: [
        ["English", "English"],
        ["Hindi", "Hindi"],
        ["Bengali", "Bengali"],
      ],
    },
    {
      name: "dateFormat",
      label: "Date format",
      icon: CalendarDays,
      options: [
        ["DD/MM/YYYY", "DD/MM/YYYY"],
        ["MM/DD/YYYY", "MM/DD/YYYY"],
        ["YYYY/MM/DD", "YYYY/MM/DD"],
      ],
    },
  ];

  return (
    <ProfileCard title="Preferences" badge="Personalized">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field, index) => {
          const Icon = field.icon;

          return (
            <motion.label
              key={field.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: index * 0.04 }}
              className="block rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <Icon size={17} className="text-cyan-500" />
                {field.label}
              </span>

              <select
                name={field.name}
                value={preferences[field.name]}
                onChange={handleChange}
                className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              >
                {field.options.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </motion.label>
          );
        })}
      </div>

      {saved && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 size={17} />
          Preferences saved successfully.
        </div>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-white/10 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasChanges || saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/[0.05]"
        >
          <RotateCcw size={16} />
          Reset
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="inline-flex min-w-40 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {saving ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </ProfileCard>
  );
}

export default PreferencesCard;
