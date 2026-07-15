import { motion } from "framer-motion";
import {
  Activity,
  Bell,
  BarChart3,
  CircleDollarSign,
  KeyRound,
  Settings2,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const CARD_META = {
  "Personal Information": {
    icon: UserRound,
    description: "Keep your identity, contact details and professional information current.",
    tone: "cyan",
  },
  Preferences: {
    icon: Settings2,
    description: "Customize appearance, currency, language and date formatting.",
    tone: "violet",
  },
  "Monthly Saving Goal": {
    icon: CircleDollarSign,
    description: "Set a monthly target and monitor your savings progress.",
    tone: "emerald",
  },
  "Account Statistics": {
    icon: BarChart3,
    description: "Review a live summary of your finance and goal activity.",
    tone: "blue",
  },
  Security: {
    icon: ShieldCheck,
    description: "Manage password preferences and additional account protection.",
    tone: "rose",
  },
  Notifications: {
    icon: Bell,
    description: "Choose which financial alerts and reminders you receive.",
    tone: "amber",
  },
  "Recent Activity": {
    icon: Activity,
    description: "Review recent profile, finance and security events.",
    tone: "cyan",
  },
  "Login History": {
    icon: KeyRound,
    description: "Review sessions recorded locally in this browser.",
    tone: "blue",
  },
};

const TONES = {
  cyan: {
    icon: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    glow: "bg-cyan-500/10",
    badge:
      "border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
  },
  violet: {
    icon: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    glow: "bg-violet-500/10",
    badge:
      "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-400",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    glow: "bg-emerald-500/10",
    badge:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  blue: {
    icon: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    glow: "bg-blue-500/10",
    badge:
      "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  },
  rose: {
    icon: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    glow: "bg-rose-500/10",
    badge:
      "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    glow: "bg-amber-500/10",
    badge:
      "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
};

function ProfileCard({
  title,
  description,
  icon: CustomIcon,
  badge,
  actions,
  children,
  tone,
  className = "",
  bodyClassName = "",
}) {
  const meta = CARD_META[title] || {};
  const Icon = CustomIcon || meta.icon || Settings2;
  const resolvedTone = tone || meta.tone || "cyan";
  const styles = TONES[resolvedTone] || TONES.cyan;
  const resolvedDescription = description || meta.description;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`relative h-full min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900 ${className}`}
    >
      <div
        className={`pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full blur-3xl ${styles.glow}`}
      />

      <header className="relative flex flex-col gap-4 border-b border-slate-200/80 p-5 dark:border-white/10 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${styles.icon}`}
          >
            <Icon size={21} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h2>

              {badge && (
                <span
                  className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${styles.badge}`}
                >
                  {badge}
                </span>
              )}
            </div>

            {resolvedDescription && (
              <p className="mt-1 max-w-xl text-sm leading-5 text-slate-500 dark:text-slate-400">
                {resolvedDescription}
              </p>
            )}
          </div>
        </div>

        {actions && <div className="shrink-0">{actions}</div>}
      </header>

      <div className={`relative p-5 sm:p-6 ${bodyClassName}`}>{children}</div>
    </motion.section>
  );
}

export default ProfileCard;
