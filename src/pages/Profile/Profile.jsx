import {
  Activity,
  Bell,
  Database,
  Settings2,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";

import SectionReveal from "../../components/common/SectionReveal";

import ProfileHeader from "../../components/profile/ProfileHeader";
import PersonalInfoCard from "../../components/profile/PersonalInfoCard";
import PreferencesCard from "../../components/profile/PreferencesCard";
import FinancialGoalCard from "../../components/profile/FinancialGoalCard";
import StatisticsCard from "../../components/profile/StatisticsCard";
import SecurityCard from "../../components/profile/SecurityCard";
import NotificationCard from "../../components/profile/NotificationCard";
import ActivityHistoryCard from "../../components/profile/ActivityHistoryCard";
import DangerZoneCard from "../../components/profile/DangerZoneCard";

import DataManagementCard from "../../components/settings/DataManagementCard";

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div
      className="
        flex
        items-start
        gap-3
      "
    >
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
        "
      >
        <Icon size={20} />
      </div>

      <div className="min-w-0">
        <h2
          className="
            text-xl
            font-black
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
            max-w-3xl
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
        pt-4
        sm:pt-6
      "
    >
      {/* Profile header */}

      <SectionReveal>
        <ProfileHeader />
      </SectionReveal>

      {/* Personal information */}


        <SectionReveal delay={0.04}>
          <PersonalInfoCard />
        </SectionReveal>


      {/* Preferences and financial goal */}


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
            delay={0.06}
            className="min-w-0"
          >
            <PreferencesCard />
          </SectionReveal>

          <SectionReveal
            delay={0.08}
            className="min-w-0"
          >
            <FinancialGoalCard />
          </SectionReveal>
        </div>


      {/* Statistics */}



        <SectionReveal delay={0.1}>
          <StatisticsCard />
        </SectionReveal>


      {/* Security and notifications */}



        <div
          className="
            grid
            min-w-0
            items-start
            gap-6
            2xl:grid-cols-2
          "
        >
          <SectionReveal
            delay={0.12}
            className="min-w-0"
          >
            <SecurityCard />
          </SectionReveal>

          <SectionReveal
            delay={0.14}
            className="min-w-0"
          >
            <NotificationCard />
          </SectionReveal>
        </div>


      {/* Combined activity and login history */}



        <SectionReveal
          delay={0.16}
          className="min-w-0"
        >
          <ActivityHistoryCard />
        </SectionReveal>


      {/* Data management */}



        <SectionReveal
          delay={0.18}
          className="min-w-0"
        >
          <DataManagementCard />
        </SectionReveal>


      {/* Account management */}



        <SectionReveal
          delay={0.2}
          className="min-w-0"
        >
          <DangerZoneCard />
        </SectionReveal>
      </section>

  );
}

export default Profile;