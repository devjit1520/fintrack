import {
  Activity,
  DatabaseBackup,
  Settings2,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  UserRound,
  WalletCards,
} from "lucide-react";

import ProfileHeader from "../../components/profile/ProfileHeader";
import PersonalInfoCard from "../../components/profile/PersonalInfoCard";
import PreferencesCard from "../../components/profile/PreferencesCard";
import FinancialGoalCard from "../../components/profile/FinancialGoalCard";
import StatisticsCard from "../../components/profile/StatisticsCard";
import SecurityCard from "../../components/profile/SecurityCard";
import NotificationCard from "../../components/profile/NotificationCard";
import ActivityTimeline from "../../components/profile/ActivityTimeline";
import LoginHistoryCard from "../../components/profile/LoginHistoryCard";
import DangerZoneCard from "../../components/profile/DangerZoneCard";

import DataManagementCard from "../../components/settings/DataManagementCard";
import SectionReveal from "../../components/common/SectionReveal";

const TONES = {
  cyan: {
    icon: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    badge:
      "border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
  },
  violet: {
    icon: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    badge:
      "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-400",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    badge:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    badge:
      "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  rose: {
    icon: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    badge:
      "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400",
  },
};

function ProfileSectionHeading({
  icon: Icon,
  title,
  description,
  badge,
  tone = "cyan",
}) {
  const styles = TONES[tone] || TONES.cyan;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${styles.icon}`}
        >
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
          <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>

      {badge && (
        <span
          className={`self-start rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] sm:self-auto ${styles.badge}`}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

function Profile() {
  return (
    <section className=" min-w-0 space-y-8">
      <SectionReveal>
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-6 lg:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-cyan-600 shadow-lg shadow-cyan-500/10 dark:text-cyan-400">
                <UserRound size={24} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    User Profile
                  </h1>

                  <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">
                    <Sparkles size={11} />
                    Personal center
                  </span>
                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Manage personal details, finance preferences, security, activity and locally stored FinTrack data.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 self-start rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 text-xs leading-5 text-emerald-700 dark:text-emerald-400 lg:max-w-xs">
              <ShieldCheck size={17} className="mt-0.5 shrink-0" />
              Profile and finance information remains under your control.
            </div>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal delay={0.04}>
        <ProfileHeader />
      </SectionReveal>

      <div className="space-y-4">
        <SectionReveal delay={0.06}>
          <ProfileSectionHeading
            icon={Settings2}
            title="Personal Settings"
            description="Update your identity, contact information and application preferences."
            badge="Profile"
            tone="cyan"
          />
        </SectionReveal>

        <div className="grid min-w-0 items-start gap-6 xl:grid-cols-2">
          <SectionReveal delay={0.08} className="min-w-0">
            <PersonalInfoCard />
          </SectionReveal>
          <SectionReveal delay={0.1} className="min-w-0">
            <PreferencesCard />
          </SectionReveal>
        </div>
      </div>

      <div className="space-y-4">
        <SectionReveal delay={0.12}>
          <ProfileSectionHeading
            icon={WalletCards}
            title="Financial Profile"
            description="Review your savings target and overall finance activity."
            badge="Finance"
            tone="violet"
          />
        </SectionReveal>

        <div className="grid min-w-0 items-start gap-6 xl:grid-cols-2">
          <SectionReveal delay={0.14} className="min-w-0">
            <FinancialGoalCard />
          </SectionReveal>
          <SectionReveal delay={0.16} className="min-w-0">
            <StatisticsCard />
          </SectionReveal>
        </div>
      </div>

      <div className="space-y-4">
        <SectionReveal delay={0.18}>
          <ProfileSectionHeading
            icon={ShieldCheck}
            title="Security & Notifications"
            description="Control account protection and the alerts you receive."
            badge="Protected"
            tone="emerald"
          />
        </SectionReveal>

        <div className="grid min-w-0 items-start gap-6 xl:grid-cols-2">
          <SectionReveal delay={0.2} className="min-w-0">
            <SecurityCard />
          </SectionReveal>
          <SectionReveal delay={0.22} className="min-w-0">
            <NotificationCard />
          </SectionReveal>
        </div>
      </div>

      <div className="space-y-4">
        <SectionReveal delay={0.24}>
          <ProfileSectionHeading
            icon={Activity}
            title="Account Activity"
            description="Review recent profile events and locally recorded login history."
            badge="History"
            tone="amber"
          />
        </SectionReveal>

        <div className="grid min-w-0 items-start gap-6 xl:grid-cols-2">
          <SectionReveal delay={0.26} className="min-w-0">
            <ActivityTimeline />
          </SectionReveal>
          <SectionReveal delay={0.28} className="min-w-0">
            <LoginHistoryCard />
          </SectionReveal>
        </div>
      </div>

      <div className="space-y-4">
        <SectionReveal delay={0.3}>
          <ProfileSectionHeading
            icon={DatabaseBackup}
            title="Data Management"
            description="Export, restore or safely clear locally stored finance information."
            badge="Backup ready"
            tone="cyan"
          />
        </SectionReveal>

        <SectionReveal delay={0.32} className="min-w-0">
          <DataManagementCard />
        </SectionReveal>
      </div>

      <div className="space-y-4">
        <SectionReveal delay={0.34}>
          <ProfileSectionHeading
            icon={TriangleAlert}
            title="Danger Zone"
            description="Sensitive operations that may permanently affect local data."
            badge="Use caution"
            tone="rose"
          />
        </SectionReveal>

        <SectionReveal delay={0.36} className="min-w-0">
          <DangerZoneCard />
        </SectionReveal>
      </div>
    </section>
  );
}

export default Profile;
