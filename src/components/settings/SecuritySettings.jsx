import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Fingerprint,
  KeyRound,
  Clock3,
  LogOut,
} from "lucide-react";

function SecuritySettings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("securitySettings");

    return saved
      ? JSON.parse(saved)
      : {
          autoLock: true,
          biometric: false,
          twoFactor: false,
          sessionTimeout: "15 Minutes",
        };
  });

  useEffect(() => {
    localStorage.setItem(
      "securitySettings",
      JSON.stringify(settings)
    );
  }, [settings]);

  const toggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const sessionOptions = [
    "5 Minutes",
    "15 Minutes",
    "30 Minutes",
    "1 Hour",
    "Never",
  ];

  const Switch = ({ enabled, onClick }) => (
    <button
      onClick={onClick}
      className={`relative h-7 w-14 rounded-full transition ${
        enabled ? "bg-cyan-500" : "bg-slate-600"
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
          left: enabled ? "34px" : "4px",
        }}
      />
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >
      <div className="mb-8 flex items-center gap-3">
        <Shield
          className="text-cyan-400"
          size={28}
        />

        <h2 className="text-2xl font-bold text-white">
          Security
        </h2>
      </div>

      <div className="space-y-5">

        <div className="flex items-center justify-between rounded-2xl bg-slate-800/50 p-5">
          <div className="flex items-center gap-4">
            <Lock className="text-cyan-400" />
            <div>
              <h3 className="text-white font-semibold">
                Auto Lock
              </h3>
              <p className="text-sm text-slate-400">
                Lock app after inactivity
              </p>
            </div>
          </div>

          <Switch
            enabled={settings.autoLock}
            onClick={() => toggle("autoLock")}
          />
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-800/50 p-5">
          <div className="flex items-center gap-4">
            <Fingerprint className="text-cyan-400" />
            <div>
              <h3 className="text-white font-semibold">
                Biometric Login
              </h3>
              <p className="text-sm text-slate-400">
                Fingerprint / Face ID
              </p>
            </div>
          </div>

          <Switch
            enabled={settings.biometric}
            onClick={() => toggle("biometric")}
          />
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-800/50 p-5">
          <div className="flex items-center gap-4">
            <KeyRound className="text-cyan-400" />
            <div>
              <h3 className="text-white font-semibold">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-slate-400">
                Extra account security
              </p>
            </div>
          </div>

          <Switch
            enabled={settings.twoFactor}
            onClick={() => toggle("twoFactor")}
          />
        </div>

        <div className="rounded-2xl bg-slate-800/50 p-5">
          <div className="mb-3 flex items-center gap-3">
            <Clock3 className="text-cyan-400" />

            <h3 className="font-semibold text-white">
              Session Timeout
            </h3>
          </div>

          <select
            value={settings.sessionTimeout}
            onChange={(e) =>
              setSettings({
                ...settings,
                sessionTimeout: e.target.value,
              })
            }
            className="w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white"
          >
            {sessionOptions.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        <button className="w-full rounded-2xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-500">
          Change Password
        </button>

        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-4 font-semibold text-white transition hover:bg-red-500">
          <LogOut size={20} />
          Logout
        </button>

      </div>
    </motion.div>
  );
}

export default SecuritySettings;