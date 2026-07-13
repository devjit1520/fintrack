import SettingsHeader from "../../components/settings/SettingsHeader";
import ProfileCard from "../../components/settings/ProfileCard";
import AppearanceSettings from "../../components/settings/AppearanceSettings";
// import CurrencySettings from "../../components/settings/CurrencySettings";
import NotificationSettings from "../../components/settings/NotificationSettings";
import DataManagement from "../../components/settings/DataManagement";
import SecuritySettings from "../../components/settings/SecuritySettings";
import AboutCard from "../../components/settings/AboutCard";

function Settings() {
  return (
    <section className="space-y-8">

      <SettingsHeader />

      {/* Settings Cards */}
      <div className="grid gap-8 lg:grid-cols-2">

        <ProfileCard />

        <AppearanceSettings />

        {/* <CurrencySettings /> */}

        <NotificationSettings />

        <DataManagement />

        <SecuritySettings />

        <AboutCard />



      </div>

    </section>
  );
}

export default Settings;