import {
  Bell,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  Save,
  Smartphone,
  Target,
  Volume2,
  Wallet,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import ProfileCard from "./ProfileCard";
import useProfile from "../../hooks/useProfile";

const notificationItems = [
  {
    key: "budgetAlerts",
    title: "Budget Alerts",
    description:
      "Receive a warning when your spending approaches a budget limit.",
    icon: Wallet,
    iconColor:
      "text-emerald-600 dark:text-emerald-400",
    iconBackground:
      "bg-emerald-100 dark:bg-emerald-900/40",
  },

  {
    key: "goalReminders",
    title: "Goal Reminders",
    description:
      "Get reminders to contribute toward your financial goals.",
    icon: Target,
    iconColor:
      "text-cyan-600 dark:text-cyan-400",
    iconBackground:
      "bg-cyan-100 dark:bg-cyan-900/40",
  },

  {
    key: "monthlyReports",
    title: "Monthly Reports",
    description:
      "Receive a summary of your monthly income, expenses and savings.",
    icon: FileText,
    iconColor:
      "text-violet-600 dark:text-violet-400",
    iconBackground:
      "bg-violet-100 dark:bg-violet-900/40",
  },

  {
    key: "emailNotifications",
    title: "Email Notifications",
    description:
      "Receive important finance updates at your email address.",
    icon: Mail,
    iconColor:
      "text-orange-600 dark:text-orange-400",
    iconBackground:
      "bg-orange-100 dark:bg-orange-900/40",
  },

  {
    key: "pushNotifications",
    title: "Push Notifications",
    description:
      "Allow FinTrack to display browser notifications.",
    icon: Smartphone,
    iconColor:
      "text-blue-600 dark:text-blue-400",
    iconBackground:
      "bg-blue-100 dark:bg-blue-900/40",
  },

  {
    key: "sound",
    title: "Notification Sound",
    description:
      "Play a sound for important alerts and reminders.",
    icon: Volume2,
    iconColor:
      "text-pink-600 dark:text-pink-400",
    iconBackground:
      "bg-pink-100 dark:bg-pink-900/40",
  },
];

function NotificationSwitch({
  checked,
  onChange,
  label,
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`
        relative
        h-8
        w-14
        shrink-0
        rounded-full
        transition-colors
        focus:outline-none
        focus:ring-4
        focus:ring-cyan-500/20
        ${
          checked
            ? "bg-cyan-500"
            : "bg-slate-300 dark:bg-slate-700"
        }
      `}
    >
      <motion.span
        animate={{
          x: checked ? 24 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 32,
        }}
        className="
          absolute
          left-1
          top-1
          h-6
          w-6
          rounded-full
          bg-white
          shadow
        "
      />
    </button>
  );
}

function NotificationCard() {
  const {
    profile,
    updateNotifications,
  } = useProfile();

  const storedSettings =
    profile.notifications || {};

  const [formData, setFormData] =
    useState({
      budgetAlerts:
        storedSettings.budgetAlerts ??
        true,

      goalReminders:
        storedSettings.goalReminders ??
        true,

      monthlyReports:
        storedSettings.monthlyReports ??
        true,

      emailNotifications:
        storedSettings.emailNotifications ??
        true,

      pushNotifications:
        storedSettings.pushNotifications ??
        false,

      sound:
        storedSettings.sound ??
        true,

      frequency:
        storedSettings.frequency ||
        "instant",
    });

  const [saved, setSaved] =
    useState(false);

  const [
    permissionMessage,
    setPermissionMessage,
  ] = useState("");

  useEffect(() => {
    const settings =
      profile.notifications || {};

    setFormData({
      budgetAlerts:
        settings.budgetAlerts ??
        true,

      goalReminders:
        settings.goalReminders ??
        true,

      monthlyReports:
        settings.monthlyReports ??
        true,

      emailNotifications:
        settings.emailNotifications ??
        true,

      pushNotifications:
        settings.pushNotifications ??
        false,

      sound:
        settings.sound ??
        true,

      frequency:
        settings.frequency ||
        "instant",
    });
  }, [profile.notifications]);

  useEffect(() => {
    if (!saved) return;

    const timeout =
      window.setTimeout(() => {
        setSaved(false);
      }, 2500);

    return () =>
      window.clearTimeout(timeout);
  }, [saved]);

  useEffect(() => {
    if (!permissionMessage) return;

    const timeout =
      window.setTimeout(() => {
        setPermissionMessage("");
      }, 3500);

    return () =>
      window.clearTimeout(timeout);
  }, [permissionMessage]);

  const hasChanges = useMemo(() => {
    const current =
      profile.notifications || {};

    return (
      formData.budgetAlerts !==
        current.budgetAlerts ||
      formData.goalReminders !==
        current.goalReminders ||
      formData.monthlyReports !==
        current.monthlyReports ||
      formData.emailNotifications !==
        current.emailNotifications ||
      formData.pushNotifications !==
        current.pushNotifications ||
      formData.sound !==
        current.sound ||
      formData.frequency !==
        current.frequency
    );
  }, [
    formData,
    profile.notifications,
  ]);

  const handleToggle = async (key) => {
    if (
      key === "pushNotifications" &&
      !formData.pushNotifications
    ) {
      if (
        !("Notification" in window)
      ) {
        setPermissionMessage(
          "This browser does not support push notifications."
        );

        return;
      }

      if (
        Notification.permission ===
        "denied"
      ) {
        setPermissionMessage(
          "Push notifications are blocked in your browser settings."
        );

        return;
      }

      if (
        Notification.permission !==
        "granted"
      ) {
        try {
          const permission =
            await Notification.requestPermission();

          if (
            permission !== "granted"
          ) {
            setPermissionMessage(
              "Notification permission was not granted."
            );

            return;
          }

          setPermissionMessage(
            "Browser notification permission enabled."
          );
        } catch (error) {
          console.error(error);

          setPermissionMessage(
            "Unable to request notification permission."
          );

          return;
        }
      }
    }

    setFormData(
      (currentSettings) => ({
        ...currentSettings,
        [key]:
          !currentSettings[key],
      })
    );

    setSaved(false);
  };

  const handleFrequencyChange = (
    event
  ) => {
    setFormData(
      (currentSettings) => ({
        ...currentSettings,
        frequency:
          event.target.value,
      })
    );

    setSaved(false);
  };

  const handleSave = () => {
    updateNotifications(formData);
    setSaved(true);

    if (
      formData.pushNotifications &&
      "Notification" in window &&
      Notification.permission ===
        "granted"
    ) {
      try {
        new Notification(
          "FinTrack notifications enabled",
          {
            body:
              "Your notification preferences were saved successfully.",
          }
        );
      } catch (error) {
        console.error(
          "Unable to display test notification:",
          error
        );
      }
    }
  };

  return (
    <ProfileCard title="Notifications">
      <div className="space-y-5">
        <div
          className="
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-cyan-200
            bg-cyan-50
            p-4
            dark:border-cyan-900
            dark:bg-cyan-950/30
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
              rounded-xl
              bg-cyan-100
              text-cyan-600
              dark:bg-cyan-900/50
              dark:text-cyan-400
            "
          >
            <Bell size={21} />
          </div>

          <div>
            <h3
              className="
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              Stay informed
            </h3>

            <p
              className="
                mt-1
                text-sm
                leading-6
                text-slate-500
                dark:text-slate-400
              "
            >
              Choose which finance alerts
              and reports you want to
              receive.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {notificationItems.map(
            (item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.key}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                    transition
                    hover:border-cyan-300
                    dark:border-slate-800
                    dark:bg-slate-950
                    dark:hover:border-cyan-800
                  "
                >
                  <div
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-4
                    "
                  >
                    <div
                      className={`
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${item.iconBackground}
                      `}
                    >
                      <Icon
                        size={20}
                        className={
                          item.iconColor
                        }
                      />
                    </div>

                    <div className="min-w-0">
                      <h4
                        className="
                          font-medium
                          text-slate-900
                          dark:text-white
                        "
                      >
                        {item.title}
                      </h4>

                      <p
                        className="
                          mt-1
                          text-sm
                          leading-5
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        {
                          item.description
                        }
                      </p>
                    </div>
                  </div>

                  <NotificationSwitch
                    checked={
                      formData[
                        item.key
                      ]
                    }
                    onChange={() =>
                      handleToggle(
                        item.key
                      )
                    }
                    label={`Toggle ${item.title}`}
                  />
                </div>
              );
            }
          )}
        </div>

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            p-4
            dark:border-slate-800
          "
        >
          <label
            htmlFor="notificationFrequency"
            className="
              mb-2
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-700
              dark:text-slate-300
            "
          >
            <Clock3 size={17} />
            Notification Frequency
          </label>

          <select
            id="notificationFrequency"
            value={formData.frequency}
            onChange={
              handleFrequencyChange
            }
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              text-slate-900
              outline-none
              transition
              focus:border-cyan-500
              focus:ring-4
              focus:ring-cyan-500/10
              dark:border-slate-700
              dark:bg-slate-950
              dark:text-white
            "
          >
            <option value="instant">
              Instant
            </option>

            <option value="daily">
              Daily summary
            </option>

            <option value="weekly">
              Weekly summary
            </option>

            <option value="monthly">
              Monthly summary
            </option>
          </select>
        </div>

        {permissionMessage && (
          <div
            className="
              rounded-xl
              border
              border-amber-200
              bg-amber-50
              px-4
              py-3
              text-sm
              font-medium
              text-amber-700
              dark:border-amber-900
              dark:bg-amber-950/30
              dark:text-amber-400
            "
          >
            {permissionMessage}
          </div>
        )}

        {saved && (
          <div
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-emerald-200
              bg-emerald-50
              px-4
              py-3
              text-sm
              font-medium
              text-emerald-700
              dark:border-emerald-900
              dark:bg-emerald-950/30
              dark:text-emerald-400
            "
          >
            <CheckCircle2 size={18} />

            Notification settings saved
            successfully.
          </div>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-cyan-500
            px-5
            py-3
            font-semibold
            text-white
            transition
            hover:bg-cyan-600
            focus:outline-none
            focus:ring-4
            focus:ring-cyan-500/20
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <Save size={18} />
          Save Notification Settings
        </button>
      </div>
    </ProfileCard>
  );
}

export default NotificationCard;