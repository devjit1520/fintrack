import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getDeviceInfo,
} from "../utils/deviceInfo";

export const ActivityContext =
  createContext(null);

const ACTIVITY_STORAGE_KEY =
  "fintrack-activities";

const LOGIN_STORAGE_KEY =
  "fintrack-login-history";

const SESSION_STORAGE_KEY =
  "fintrack-session-recorded";

const MAX_ACTIVITIES = 100;
const MAX_LOGIN_RECORDS = 15;

function createId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function readStoredArray(key) {
  try {
    const saved =
      localStorage.getItem(key);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch (error) {
    console.error(
      `Unable to read ${key}:`,
      error
    );

    return [];
  }
}

function ActivityProvider({ children }) {
  const [activities, setActivities] =
    useState(() =>
      readStoredArray(
        ACTIVITY_STORAGE_KEY
      )
    );

  const [
    loginHistory,
    setLoginHistory,
  ] = useState(() =>
    readStoredArray(
      LOGIN_STORAGE_KEY
    )
  );

  const sessionRecordedRef =
    useRef(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        ACTIVITY_STORAGE_KEY,
        JSON.stringify(activities)
      );
    } catch (error) {
      console.error(
        "Unable to save activities:",
        error
      );
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(
        LOGIN_STORAGE_KEY,
        JSON.stringify(loginHistory)
      );
    } catch (error) {
      console.error(
        "Unable to save login history:",
        error
      );
    }
  }, [loginHistory]);

  const addActivity = useCallback(
    ({
      type = "general",
      title,
      description = "",
      metadata = null,
    }) => {
      if (!title) {
        return;
      }

      const newActivity = {
        id: createId(),
        type,
        title,
        description,
        metadata,
        createdAt:
          new Date().toISOString(),
      };

      setActivities(
        (currentActivities) => [
          newActivity,
          ...currentActivities,
        ].slice(0, MAX_ACTIVITIES)
      );
    },
    []
  );

  const clearActivities =
    useCallback(() => {
      setActivities([]);
    }, []);

  const removeActivity =
    useCallback((activityId) => {
      setActivities(
        (currentActivities) =>
          currentActivities.filter(
            (activity) =>
              activity.id !== activityId
          )
      );
    }, []);

  const clearLoginHistory =
    useCallback(() => {
      setLoginHistory([]);
      sessionStorage.removeItem(
        SESSION_STORAGE_KEY
      );
      sessionRecordedRef.current =
        false;
    }, []);

  useEffect(() => {
    const alreadyRecorded =
      sessionStorage.getItem(
        SESSION_STORAGE_KEY
      );

    if (
      alreadyRecorded ||
      sessionRecordedRef.current
    ) {
      return;
    }

    const deviceInfo =
      getDeviceInfo();

    const loginRecord = {
      id: createId(),
      ...deviceInfo,
      loggedInAt:
        new Date().toISOString(),
      current: true,
    };

    setLoginHistory(
      (currentHistory) => {
        const previousHistory =
          currentHistory.map((item) => ({
            ...item,
            current: false,
          }));

        return [
          loginRecord,
          ...previousHistory,
        ].slice(
          0,
          MAX_LOGIN_RECORDS
        );
      }
    );

    addActivity({
      type: "login",
      title: "New session started",
      description: `${deviceInfo.browser} on ${deviceInfo.operatingSystem}`,
      metadata: deviceInfo,
    });

    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      "true"
    );

    sessionRecordedRef.current = true;
  }, [addActivity]);

  const value = useMemo(
    () => ({
      activities,
      loginHistory,
      addActivity,
      removeActivity,
      clearActivities,
      clearLoginHistory,
    }),
    [
      activities,
      loginHistory,
      addActivity,
      removeActivity,
      clearActivities,
      clearLoginHistory,
    ]
  );

  return (
    <ActivityContext.Provider
      value={value}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export default ActivityProvider;