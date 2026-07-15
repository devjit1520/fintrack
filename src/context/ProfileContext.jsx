import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import useAuth from "../hooks/useAuth";
import useActivity from "../hooks/useActivity";

import {
  getProfile,
  upsertProfile,
  updateProfileRecord,
} from "../services/profileService";

export const ProfileContext =
  createContext(null);

const defaultProfile = {
  firstName: "",
  lastName: "",
  name: "FinTrack User",

  role: "FinTrack Member",
  email: "",
  phone: "",

  city: "",
  state: "",
  country: "",
  location: "",

  website: "",
  bio: "",
  avatar: "",

  preferences: {
    currency: "INR",
    language: "English",
    dateFormat: "DD/MM/YYYY",
  },

  monthlySavingGoal: {
    target: 20000,
    saved: 0,
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

function mapDatabaseProfile(row, user) {
  if (!row) {
    const metadataName =
      user?.user_metadata
        ?.full_name || "";

    return {
      ...defaultProfile,

      name:
        metadataName ||
        user?.email?.split("@")[0] ||
        "FinTrack User",

      email: user?.email || "",
    };
  }

  return {
    firstName:
      row.first_name || "",

    lastName:
      row.last_name || "",

    name:
      row.full_name ||
      `${row.first_name || ""} ${
        row.last_name || ""
      }`.trim() ||
      "FinTrack User",

    role:
      row.role ||
      "FinTrack Member",

    email:
      row.email ||
      user?.email ||
      "",

    phone: row.phone || "",

    city: row.city || "",
    state: row.state || "",
    country: row.country || "",
    location: row.location || "",

    website: row.website || "",
    bio: row.bio || "",

    avatar:
      row.avatar_url || "",

    preferences: {
      currency:
        row.currency || "INR",

      language:
        row.language ||
        "English",

      dateFormat:
        row.date_format ||
        "DD/MM/YYYY",
    },

    monthlySavingGoal: {
      target: Number(
        row.monthly_goal_target ||
          20000
      ),

      saved: Number(
        row.monthly_goal_saved || 0
      ),
    },

    notifications: {
      ...defaultProfile.notifications,
      ...(row.notifications || {}),
    },

    security: {
      ...defaultProfile.security,
      ...(row.security_preferences ||
        {}),
    },
  };
}

function buildLocation(data) {
  return [
    data.city?.trim(),
    data.state?.trim(),
    data.country?.trim(),
  ]
    .filter(Boolean)
    .join(", ");
}

function ProfileProvider({ children }) {
  const { user, loading: authLoading } =
    useAuth();

  const { addActivity } =
    useActivity();

  const [profile, setProfile] =
    useState(defaultProfile);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadProfile =
    useCallback(async () => {
      if (!user?.id) {
        setProfile(defaultProfile);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const result =
          await getProfile(user.id);

        if (result.error) {
          throw result.error;
        }

        if (!result.data) {
          const metadataName =
            user.user_metadata
              ?.full_name || "";

          const createdResult =
            await upsertProfile(
              user.id,
              {
                full_name:
                  metadataName ||
                  user.email?.split(
                    "@"
                  )[0] ||
                  "FinTrack User",

                email:
                  user.email || "",
              }
            );

          if (createdResult.error) {
            throw createdResult.error;
          }

          setProfile(
            mapDatabaseProfile(
              createdResult.data,
              user
            )
          );

          return;
        }

        setProfile(
          mapDatabaseProfile(
            result.data,
            user
          )
        );
      } catch (loadError) {
        console.error(
          "Unable to load profile:",
          loadError
        );

        setProfile(
          mapDatabaseProfile(
            null,
            user
          )
        );

        setError(
          loadError.message ||
            "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    }, [user]);

  useEffect(() => {
    if (authLoading) return;

    loadProfile();
  }, [
    authLoading,
    loadProfile,
  ]);

  const saveProfileChanges =
    useCallback(
      async (
        nextProfile,
        activity
      ) => {
        if (!user?.id) {
          return {
            success: false,
            error:
              "You must be logged in.",
          };
        }

        const databaseData = {
          first_name:
            nextProfile.firstName,

          last_name:
            nextProfile.lastName,

          full_name:
            nextProfile.name,

          role: nextProfile.role,

          email:
            nextProfile.email,

          phone:
            nextProfile.phone,

          city: nextProfile.city,
          state: nextProfile.state,
          country:
            nextProfile.country,

          location:
            nextProfile.location,

          website:
            nextProfile.website,

          bio: nextProfile.bio,

          avatar_url:
            nextProfile.avatar,

          currency:
            nextProfile.preferences
              .currency,

          language:
            nextProfile.preferences
              .language,

          date_format:
            nextProfile.preferences
              .dateFormat,

          monthly_goal_target:
            nextProfile
              .monthlySavingGoal
              .target,

          monthly_goal_saved:
            nextProfile
              .monthlySavingGoal
              .saved,

          notifications:
            nextProfile.notifications,

          security_preferences:
            nextProfile.security,
        };

        const result =
          await updateProfileRecord(
            user.id,
            databaseData
          );

        if (result.error) {
          return {
            success: false,
            error:
              result.error.message,
          };
        }

        const savedProfile =
          mapDatabaseProfile(
            result.data,
            user
          );

        setProfile(savedProfile);

        if (activity) {
          addActivity(activity);
        }

        return {
          success: true,
          data: savedProfile,
        };
      },
      [user, addActivity]
    );

  const updateProfile =
    useCallback(
      async (newData) => {
        const merged = {
          ...profile,
          ...newData,
        };

        const firstName =
          merged.firstName?.trim() ||
          "";

        const lastName =
          merged.lastName?.trim() ||
          "";

        const name =
          `${firstName} ${lastName}`.trim() ||
          merged.name ||
          "FinTrack User";

        const location =
          buildLocation(merged) ||
          merged.location ||
          "";

        return saveProfileChanges(
          {
            ...merged,
            firstName,
            lastName,
            name,
            location,
          },
          {
            type: "profile",
            title:
              "Profile information updated",
            description:
              "Personal information was changed.",
          }
        );
      },
      [
        profile,
        saveProfileChanges,
      ]
    );

  const updateAvatar =
    useCallback(
      async (avatar) => {
        return saveProfileChanges(
          {
            ...profile,
            avatar,
          },
          {
            type: "profile",
            title:
              "Profile photo updated",
            description:
              "A new profile image was selected.",
          }
        );
      },
      [
        profile,
        saveProfileChanges,
      ]
    );

  const removeAvatar =
    useCallback(async () => {
      return saveProfileChanges(
        {
          ...profile,
          avatar: "",
        },
        {
          type: "profile",
          title:
            "Profile photo removed",
          description:
            "The custom profile image was removed.",
        }
      );
    }, [
      profile,
      saveProfileChanges,
    ]);

  const updatePreferences =
    useCallback(
      async (preferences) => {
        return saveProfileChanges(
          {
            ...profile,

            preferences: {
              ...profile.preferences,
              ...preferences,
            },
          },
          {
            type: "preference",
            title:
              "Preferences updated",
            description:
              "Profile preferences were changed.",
          }
        );
      },
      [
        profile,
        saveProfileChanges,
      ]
    );

  const updateMonthlySavingGoal =
    useCallback(
      async (goalData) => {
        return saveProfileChanges(
          {
            ...profile,

            monthlySavingGoal: {
              ...profile.monthlySavingGoal,
              ...goalData,
            },
          },
          {
            type: "goal",
            title:
              "Monthly saving goal updated",
            description:
              "The monthly target was changed.",
          }
        );
      },
      [
        profile,
        saveProfileChanges,
      ]
    );

  const addMonthlySavings =
    useCallback(
      async (amount) => {
        const numericAmount =
          Number(amount);

        if (
          !Number.isFinite(
            numericAmount
          ) ||
          numericAmount <= 0
        ) {
          return false;
        }

        const result =
          await saveProfileChanges(
            {
              ...profile,

              monthlySavingGoal: {
                ...profile.monthlySavingGoal,

                saved:
                  Number(
                    profile
                      .monthlySavingGoal
                      .saved
                  ) + numericAmount,
              },
            },
            {
              type: "goal",
              title:
                "Monthly savings added",

              description: `₹${numericAmount.toLocaleString(
                "en-IN"
              )} was added.`,
            }
          );

        return result.success;
      },
      [
        profile,
        saveProfileChanges,
      ]
    );

  const resetMonthlySavingGoal =
    useCallback(async () => {
      return saveProfileChanges(
        {
          ...profile,

          monthlySavingGoal: {
            target: 20000,
            saved: 0,
          },
        },
        {
          type: "goal",
          title:
            "Monthly saving goal reset",
          description:
            "The target and saved amount were reset.",
        }
      );
    }, [
      profile,
      saveProfileChanges,
    ]);

  const updateNotifications =
    useCallback(
      async (notifications) => {
        return saveProfileChanges(
          {
            ...profile,

            notifications: {
              ...profile.notifications,
              ...notifications,
            },
          },
          {
            type: "notification",
            title:
              "Notification settings updated",
            description:
              "Notification preferences were changed.",
          }
        );
      },
      [
        profile,
        saveProfileChanges,
      ]
    );

  const updateSecurity =
    useCallback(
      async (security) => {
        return saveProfileChanges(
          {
            ...profile,

            security: {
              ...profile.security,
              ...security,
            },
          },
          {
            type: "security",
            title:
              "Security settings updated",
            description:
              "Security preferences were changed.",
          }
        );
      },
      [
        profile,
        saveProfileChanges,
      ]
    );

  const resetProfile =
    useCallback(async () => {
      const userName =
        user?.user_metadata
          ?.full_name ||
        user?.email?.split("@")[0] ||
        "FinTrack User";

      return saveProfileChanges(
        {
          ...defaultProfile,

          name: userName,
          email:
            user?.email || "",
        },
        {
          type: "profile",
          title: "Profile reset",
          description:
            "Profile information was restored to defaults.",
        }
      );
    }, [
      user,
      saveProfileChanges,
    ]);

  const value = useMemo(
    () => ({
      profile,
      setProfile,

      loading,
      error,

      loadProfile,

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
    }),
    [
      profile,
      loading,
      error,
      loadProfile,
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
    ]
  );

  return (
    <ProfileContext.Provider
      value={value}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export default ProfileProvider;