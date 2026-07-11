import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Monitor, Palette } from "lucide-react";

function AppearanceSettings() {
  const [theme, setTheme] = useState("dark");
  const [accent, setAccent] = useState("#06b6d4");

  const colors = [
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#22c55e",
    "#f97316",
    "#ef4444",
  ];

  const themes = [
    {
      id: "light",
      name: "Light",
      icon: Sun,
    },
    {
      id: "dark",
      name: "Dark",
      icon: Moon,
    },
    {
      id: "system",
      name: "System",
      icon: Monitor,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ y: -5 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >
      <div className="mb-8 flex items-center gap-3">
        <Palette className="text-cyan-400" size={28} />
        <h2 className="text-2xl font-bold text-white">
          Appearance
        </h2>
      </div>

      <div className="space-y-5">

        {themes.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setTheme(item.id)}
              className={`flex w-full items-center justify-between rounded-2xl border p-4 transition ${
                theme === item.id
                  ? "border-cyan-500 bg-cyan-500/10"
                  : "border-white/10 bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <Icon
                  size={22}
                  className="text-cyan-400"
                />

                <span className="font-medium text-white">
                  {item.name}
                </span>
              </div>

              {theme === item.id && (
                <div className="h-3 w-3 rounded-full bg-cyan-400" />
              )}
            </button>
          );
        })}

      </div>

      <div className="mt-10">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Accent Color
        </h3>

        <div className="flex gap-4">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setAccent(color)}
              className={`h-10 w-10 rounded-full border-4 transition ${
                accent === color
                  ? "border-white scale-110"
                  : "border-transparent"
              }`}
              style={{
                backgroundColor: color,
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-2xl bg-slate-800/60 p-5">
        <p className="text-sm text-slate-400">
          Preview
        </p>

        <button
          className="mt-4 rounded-xl px-6 py-3 font-semibold text-white"
          style={{
            backgroundColor: accent,
          }}
        >
          Example Button
        </button>
      </div>
    </motion.div>
  );
}

export default AppearanceSettings;