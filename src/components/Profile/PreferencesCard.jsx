import { useState } from "react";
import { motion } from "framer-motion";
import {
  Moon,
  DollarSign,
  Globe,
  Calendar,
  Save,
} from "lucide-react";

import ProfileCard from "./ProfileCard";

function PreferencesCard() {
  const [preferences, setPreferences] = useState({
    theme: "system",
    currency: "INR",
    language: "English",
    dateFormat: "DD/MM/YYYY",
  });

  const handleChange = (e) => {
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    localStorage.setItem(
      "fintrack_preferences",
      JSON.stringify(preferences)
    );

    console.log("Preferences Saved");
  };

  return (
    <ProfileCard title="Preferences">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Theme */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            <Moon size={18} />
            Theme
          </label>

          <select
            name="theme"
            value={preferences.theme}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        {/* Currency */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            <DollarSign size={18} />
            Currency
          </label>

          <select
            name="currency"
            value={preferences.currency}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
            <option value="GBP">£ GBP</option>
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            <Globe size={18} />
            Language
          </label>

          <select
            name="language"
            value={preferences.language}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Bengali</option>
          </select>
        </div>

        {/* Date Format */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            <Calendar size={18} />
            Date Format
          </label>

          <select
            name="dateFormat"
            value={preferences.dateFormat}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option>DD/MM/YYYY</option>
            <option>MM/DD/YYYY</option>
            <option>YYYY/MM/DD</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition"
        >
          <Save size={18} />
          Save Preferences
        </button>
      </motion.div>
    </ProfileCard>
  );
}

export default PreferencesCard;