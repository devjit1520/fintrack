import {
  createContext,
  useEffect,
  useState,
} from "react";

export const ProfileContext = createContext(null);

const defaultProfile = {
  firstName: "Devjit",
  lastName: "Mondal",
  name: "Devjit Mondal",

  role: "Frontend Developer",
  email: "devjit@example.com",
  phone: "+91 9876543210",

  city: "Kolkata",
  state: "West Bengal",
  country: "India",
  location: "Kolkata, West Bengal, India",

  website: "",
  bio: "Frontend developer focused on building modern, responsive and user-friendly web applications.",

  avatar: "",

  preferences: {
    currency: "INR",
    language: "English",
    dateFormat: "DD/MM/YYYY",
  },

  monthlySavingGoal: {
    target: 20000,
    saved: 13600,
  },

  notifications: {
    budgetAlerts: true,
    goalReminders: true,
    monthlyReports: true,
    emailNotifications: true,
    pushNotifications: false,
    sound: true,
    frequency: "instant",
  },

  security: {
    twoFactorEnabled: false,
    passwordUpdatedAt: "",
  },
};

function buildLocation(profileData) {
  return [
    profileData.city?.trim(),
    profileData.state?.trim(),
    profileData.country?.trim(),
  ]
    .filter(Boolean)
    .join(", ");
}

function loadProfile() {
  try {
    const savedProfile = localStorage.getItem(
      "fintrack-profile"
    );

    if (!savedProfile) {
      return defaultProfile;
    }

    const parsedProfile = JSON.parse(savedProfile);

    return {
      ...defaultProfile,
      ...parsedProfile,

      preferences: {
        ...defaultProfile.preferences,
        ...(parsedProfile.preferences || {}),
      },

      monthlySavingGoal: {
        ...defaultProfile.monthlySavingGoal,
        ...(parsedProfile.monthlySavingGoal || {}),
      },

      notifications: {
        ...defaultProfile.notifications,
        ...(parsedProfile.notifications || {}),
      },

      security: {
        ...defaultProfile.security,
        ...(parsedProfile.security || {}),
      },
    };
  } catch (error) {
    console.error(
      "Failed to load saved profile:",
      error
    );

    return defaultProfile;
  }
}

function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(
    loadProfile
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        "fintrack-profile",
        JSON.stringify(profile)
      );
    } catch (error) {
      console.error(
        "Failed to save profile:",
        error
      );
    }
  }, [profile]);

  const updateProfile = (newData) => {
    setProfile((currentProfile) => {
      const mergedProfile = {
        ...currentProfile,
        ...newData,
      };

      const firstName =
        mergedProfile.firstName?.trim() || "";

      const lastName =
        mergedProfile.lastName?.trim() || "";

      const generatedName =
        `${firstName} ${lastName}`.trim();

      const generatedLocation =
        buildLocation(mergedProfile);

      return {
        ...mergedProfile,

        firstName,
        lastName,

        name:
          generatedName ||
          mergedProfile.name ||
          "FinTrack User",

        location:
          generatedLocation ||
          mergedProfile.location ||
          "Location not added",
      };
    });
  };

  const updateAvatar = (avatar) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      avatar,
    }));
  };

  const removeAvatar = () => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      avatar: "",
    }));
  };

  const updatePreferences = (
    newPreferences
  ) => {
    setProfile((currentProfile) => ({
      ...currentProfile,

      preferences: {
        ...currentProfile.preferences,
        ...newPreferences,
      },
    }));
  };

  const updateMonthlySavingGoal = (
    newGoalData
  ) => {
    setProfile((currentProfile) => ({
      ...currentProfile,

      monthlySavingGoal: {
        ...currentProfile.monthlySavingGoal,
        ...newGoalData,
      },
    }));
  };

  const addMonthlySavings = (amount) => {
    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return false;
    }

    setProfile((currentProfile) => {
      const currentSaved = Number(
        currentProfile.monthlySavingGoal?.saved ||
          0
      );

      return {
        ...currentProfile,

        monthlySavingGoal: {
          ...currentProfile.monthlySavingGoal,
          saved: currentSaved + numericAmount,
        },
      };
    });

    return true;
  };

  const resetMonthlySavingGoal = () => {
    setProfile((currentProfile) => ({
      ...currentProfile,

      monthlySavingGoal: {
        target: 20000,
        saved: 0,
      },
    }));
  };

  const updateNotifications = (
    newNotificationSettings
  ) => {
    setProfile((currentProfile) => ({
      ...currentProfile,

      notifications: {
        ...currentProfile.notifications,
        ...newNotificationSettings,
      },
    }));
  };

  const updateSecurity = (
    newSecurityData
  ) => {
    setProfile((currentProfile) => ({
      ...currentProfile,

      security: {
        ...currentProfile.security,
        ...newSecurityData,
      },
    }));
  };

  const resetProfile = () => {
    setProfile({
      ...defaultProfile,

      preferences: {
        ...defaultProfile.preferences,
      },

      monthlySavingGoal: {
        ...defaultProfile.monthlySavingGoal,
      },

      notifications: {
        ...defaultProfile.notifications,
      },

      security: {
        ...defaultProfile.security,
      },
    });
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,

        updateProfile,

        updateAvatar,
        removeAvatar,

        updatePreferences,

        updateMonthlySavingGoal,
        addMonthlySavings,
        resetMonthlySavingGoal,

        updateNotifications,
        updateSecurity,

        resetProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export default ProfileProvider;