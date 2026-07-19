/* =========================================================
   SAFE HELPERS
========================================================= */

function getSafeText(value) {
  return String(value || "").trim();
}

function getSafeArray(value) {
  return Array.isArray(value)
    ? value
    : [];
}

export function getHistoryArray(value) {
  return getSafeArray(value);
}

/* =========================================================
   DATE HELPERS
========================================================= */

export function getHistoryTimestamp(
  record = {}
) {
  const value =
    record.createdAt ||
    record.created_at ||
    record.updatedAt ||
    record.updated_at ||
    record.timestamp ||
    record.loginAt ||
    record.login_at ||
    record.date ||
    record.time;

  if (!value) {
    return 0;
  }

  const timestamp =
    new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
}

export function formatHistoryDate(
  timestamp
) {
  if (!timestamp) {
    return "Recently";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

export function formatShortHistoryDate(
  timestamp
) {
  if (!timestamp) {
    return "Recently";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const now = new Date();

  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();

  const yesterdayStart =
    todayStart -
    24 * 60 * 60 * 1000;

  const recordDateStart =
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).getTime();

  const time = new Intl.DateTimeFormat(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);

  if (recordDateStart === todayStart) {
    return `Today, ${time}`;
  }

  if (
    recordDateStart === yesterdayStart
  ) {
    return `Yesterday, ${time}`;
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

/* =========================================================
   ACTIVITY NORMALIZER
========================================================= */

function getActivityIconType(
  record = {}
) {
  const text = [
    record.type,
    record.action,
    record.title,
    record.message,
    record.description,
  ]
    .join(" ")
    .toLowerCase();

  if (
    text.includes("transaction") ||
    text.includes("income") ||
    text.includes("expense")
  ) {
    return "transaction";
  }

  if (
    text.includes("budget")
  ) {
    return "budget";
  }

  if (
    text.includes("goal") ||
    text.includes("saving")
  ) {
    return "goal";
  }

  if (
    text.includes("password") ||
    text.includes("security")
  ) {
    return "security";
  }

  if (
    text.includes("profile") ||
    text.includes("avatar")
  ) {
    return "profile";
  }

  if (
    text.includes("delete") ||
    text.includes("remove")
  ) {
    return "delete";
  }

  if (
    text.includes("edit") ||
    text.includes("update") ||
    text.includes("change")
  ) {
    return "edit";
  }

  return "activity";
}

export function normalizeActivities(
  records = []
) {
  return getSafeArray(records)
    .map((record, index) => {
      const timestamp =
        getHistoryTimestamp(record);

      const title =
        getSafeText(
          record.title ||
            record.action ||
            record.event ||
            record.type
        ) || "Account activity";

      const description =
        getSafeText(
          record.description ||
            record.details ||
            record.message ||
            record.note
        );

      return {
        id:
          record.id ||
          record.activityId ||
          record.activity_id ||
          `activity-${timestamp}-${index}`,

        kind: "activity",

        title,
        description,

        timestamp,

        iconType:
          getActivityIconType(
            record
          ),

        status:
          getSafeText(
            record.status
          ),

        device:
          getSafeText(
            record.device ||
              record.browser
          ),

        location:
          getSafeText(
            record.location
          ),

        original: record,
      };
    })
    .sort(
      (first, second) =>
        second.timestamp -
        first.timestamp
    );
}

/* =========================================================
   LOGIN NORMALIZER
========================================================= */

export function normalizeLoginHistory(
  records = []
) {
  return getSafeArray(records)
    .map((record, index) => {
      const timestamp =
        getHistoryTimestamp(record);

      const rawStatus =
        getSafeText(
          record.status ||
            record.result ||
            record.success
        ).toLowerCase();

      const failed =
        rawStatus === "failed" ||
        rawStatus === "error" ||
        rawStatus === "false" ||
        record.success === false;

      const status =
        failed
          ? "failed"
          : "success";

      const browser =
        getSafeText(
          record.browser
        );

      const operatingSystem =
        getSafeText(
          record.os ||
            record.operatingSystem ||
            record.operating_system
        );

      const device =
        getSafeText(
          record.device ||
            record.deviceName ||
            record.device_name
        );

      const deviceText = [
        device,
        browser,
        operatingSystem,
      ]
        .filter(Boolean)
        .join(" • ");

      const location =
        getSafeText(
          record.location ||
            record.city ||
            record.country
        );

      return {
        id:
          record.id ||
          record.loginId ||
          record.login_id ||
          `login-${timestamp}-${index}`,

        kind: "login",

        title:
          getSafeText(record.title) ||
          (failed
            ? "Failed login attempt"
            : "Successful login"),

        description:
          getSafeText(
            record.description ||
              record.message
          ) ||
          (failed
            ? "A login attempt was unsuccessful."
            : "Your account was accessed successfully."),

        timestamp,

        iconType:
          failed
            ? "login-failed"
            : "login-success",

        status,

        device:
          deviceText ||
          "Unknown device",

        location:
          location ||
          "Location unavailable",

        ipAddress:
          getSafeText(
            record.ipAddress ||
              record.ip_address ||
              record.ip
          ),

        original: record,
      };
    })
    .sort(
      (first, second) =>
        second.timestamp -
        first.timestamp
    );
}

/* =========================================================
   DATE FILTER
========================================================= */

export function filterHistoryByRange(
  records,
  range
) {
  if (range === "all") {
    return records;
  }

  const now = new Date();

  const todayStart =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();

  if (range === "today") {
    return records.filter(
      (record) =>
        record.timestamp >= todayStart
    );
  }

  if (range === "week") {
    const weekStart =
      todayStart -
      6 * 24 * 60 * 60 * 1000;

    return records.filter(
      (record) =>
        record.timestamp >= weekStart
    );
  }

  if (range === "month") {
    const monthStart =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      ).getTime();

    return records.filter(
      (record) =>
        record.timestamp >= monthStart
    );
  }

  return records;
}