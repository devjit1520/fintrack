import { motion } from "framer-motion";

import ProfileHeader from "../../components/Profile/ProfileHeader";
import PersonalInfoCard from "../../components/Profile/PersonalInfoCard";
import PreferencesCard from "../../components/Profile/PreferencesCard";
import FinancialGoalCard from "../../components/Profile/FinancialGoalCard";
import StatisticsCard from "../../components/Profile/StatisticsCard";
import SecurityCard from "../../components/Profile/SecurityCard";
import NotificationCard from "../../components/Profile/NotificationCard";
import DangerZoneCard from "../../components/Profile/DangerZoneCard";

function Profile() {
  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        px-1
        py-2
        text-slate-900
        transition-colors
        dark:bg-slate-950
        dark:text-white
        sm:px-2
      "
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h1
            className="
              text-3xl
              font-bold
              text-slate-900
              dark:text-white
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
            Manage your profile, preferences,
            security and account information.
          </p>
        </motion.div>

        <ProfileHeader />

        <div className="grid gap-6 xl:grid-cols-2">
          <PersonalInfoCard />
          <PreferencesCard />
          <FinancialGoalCard />
          <StatisticsCard />
          <SecurityCard />
          <NotificationCard />
        </div>

        <DangerZoneCard />
      </div>
    </div>
  );
}

export default Profile;