import {
  motion,
} from "framer-motion";

import ProfileHeader from "../../components/Profile/ProfileHeader";
import PersonalInfoCard from "../../components/Profile/PersonalInfoCard";
import PreferencesCard from "../../components/Profile/PreferencesCard";
import FinancialGoalCard from "../../components/Profile/FinancialGoalCard";
import StatisticsCard from "../../components/Profile/StatisticsCard";
import SecurityCard from "../../components/Profile/SecurityCard";
import NotificationCard from "../../components/Profile/NotificationCard";
import ActivityTimeline from "../../components/Profile/ActivityTimeline";
import LoginHistoryCard from "../../components/Profile/LoginHistoryCard";
import DangerZoneCard from "../../components/Profile/DangerZoneCard";

function Profile() {
  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        py-2
        text-slate-900
        transition-colors
        dark:bg-slate-950
        dark:text-white
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
          space-y-6
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            y: -16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <h1
            className="
              text-3xl
              font-bold
              md:text-4xl
            "
          >
            User Profile
          </h1>

          <p
            className="
              mt-2
              text-slate-500
              dark:text-slate-400
            "
          >
            Manage your personal details,
            preferences, security and account
            activity.
          </p>
        </motion.div>

        <ProfileHeader />

        <div
          className="
            grid
            gap-6
            xl:grid-cols-2
          "
        >
          <PersonalInfoCard />
          <PreferencesCard />

          <FinancialGoalCard />
          <StatisticsCard />

          <SecurityCard />
          <NotificationCard />

          <ActivityTimeline />
          <LoginHistoryCard />
        </div>

        <DangerZoneCard />
      </div>
    </div>
  );
}

export default Profile;