import {
  Activity,
  BellRing,
  Database,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  UserRound,
} from "lucide-react";

import SectionReveal from "../../components/common/SectionReveal";

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

/* =========================================================
   SECTION TITLE
========================================================= */

function ProfileSectionHeader({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-2xl
          border
          border-cyan-500/20
          bg-cyan-500/10
          text-cyan-500
          dark:text-cyan-400
        "
      >
        <Icon size={20} />
      </div>

      <div>
        <h2
          className="
            text-xl
            font-bold
            tracking-tight
            text-slate-950
            dark:text-white
            sm:text-2xl
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1
            max-w-2xl
            text-sm
            leading-6
            text-slate-500
            dark:text-slate-400
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   PROFILE PAGE
========================================================= */

function Profile() {
  return (
    <section
      className="
       
        relative
        min-w-0
        space-y-10
        pb-12

      "
    >
      {/* Background decoration */}

      <div
        className="
          pointer-events-none
          fixed
          right-0
          top-24
          -z-10
          h-96
          w-96
          rounded-full
          bg-cyan-500/5
          blur-[140px]
        "
      />

      <div
        className="
          pointer-events-none
          fixed
          bottom-0
          left-72
          -z-10
          h-96
          w-96
          rounded-full
          bg-violet-500/5
          blur-[140px]
        "
      />

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <SectionReveal>
        <ProfileHeader />
      </SectionReveal>

      {/* =====================================================
          PERSONAL PROFILE
      ====================================================== */}

      <div className="space-y-5">
        

        <SectionReveal delay={0.05}>
          <PersonalInfoCard />
        </SectionReveal>
      </div>

      {/* =====================================================
          PREFERENCES AND FINANCIAL GOAL
      ====================================================== */}

      <div className="space-y-5">
        <ProfileSectionHeader
          icon={SlidersHorizontal}
          title="Preferences & Financial Goals"
          description="Configure your regional preferences and manage your monthly savings target."
        />

        <div
          className="
            grid
            min-w-0
            items-start
            gap-6
            xl:grid-cols-2
          "
        >
          <SectionReveal
            delay={0.08}
            className="min-w-0"
          >
            <PreferencesCard />
          </SectionReveal>

          <SectionReveal
            delay={0.11}
            className="min-w-0"
          >
            <FinancialGoalCard />
          </SectionReveal>
        </div>
      </div>

      {/* =====================================================
          ACCOUNT STATISTICS
      ====================================================== */}

      <div className="space-y-5">
        <ProfileSectionHeader
          icon={Target}
          title="Account Statistics"
          description="Review your current finance activity and overall account progress."
        />

        <SectionReveal delay={0.14}>
          <StatisticsCard />
        </SectionReveal>
      </div>

      {/* =====================================================
          SECURITY AND NOTIFICATIONS
      ====================================================== */}

      <div className="space-y-5">
        <ProfileSectionHeader
          icon={ShieldCheck}
          title="Security & Notifications"
          description="Control account security settings and choose which financial alerts you receive."
        />

        <div
          className="
            grid
            min-w-0
            items-start
            gap-6
            xl:grid-cols-2
          "
        >
          <SectionReveal
            delay={0.16}
            className="min-w-0"
          >
            <SecurityCard />
          </SectionReveal>

          <SectionReveal
            delay={0.18}
            className="min-w-0"
          >
            <NotificationCard />
          </SectionReveal>
        </div>
      </div>

      {/* =====================================================
          ACTIVITY AND LOGIN HISTORY
      ====================================================== */}

      <div className="space-y-5">
        <ProfileSectionHeader
          icon={Activity}
          title="Activity & Login History"
          description="Review recent account actions and authentication activity."
        />

        <div
          className="
            grid
            min-w-0
            items-start
            gap-6
            xl:grid-cols-2
          "
        >
          <SectionReveal
            delay={0.2}
            className="min-w-0"
          >
            <ActivityTimeline />
          </SectionReveal>

          <SectionReveal
            delay={0.22}
            className="min-w-0"
          >
            <LoginHistoryCard />
          </SectionReveal>
        </div>
      </div>

      {/* =====================================================
          DATA MANAGEMENT
      ====================================================== */}

      <div className="space-y-5">
        <ProfileSectionHeader
          icon={Database}
          title="Data Management"
          description="Download a backup, restore saved information or clear locally stored finance data."
        />

        <SectionReveal delay={0.24}>
          <DataManagementCard />
        </SectionReveal>
      </div>

      {/* =====================================================
          DANGER ZONE
      ====================================================== */}

      <div className="space-y-5">
        <ProfileSectionHeader
          icon={BellRing}
          title="Account Management"
          description="Manage sensitive account actions carefully. Some actions cannot be reversed."
        />

        <SectionReveal delay={0.26}>
          <DangerZoneCard />
        </SectionReveal>
      </div>
    </section>
  );
}

export default Profile;