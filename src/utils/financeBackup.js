/* =========================================================
   FINTRACK BACKUP CONFIGURATION
========================================================= */

export const FINTRACK_BACKUP_FORMAT =
  "fintrack-pro-backup";

export const FINTRACK_BACKUP_VERSION = 1;

export const MAX_BACKUP_FILE_SIZE =
  5 * 1024 * 1024;

const STORAGE_KEYS = {
  transactions: "transactions",
  budgets: "budgets",
  goals: "goals",
  profile: "fintrack-profile",
  theme: "theme",
  accent: "accent",

  lastBackupAt:
    "fintrack-last-backup-at",

  lastRestoreAt:
    "fintrack-last-restore-at",
};

const ROLLBACK_STORAGE_KEY =
  "fintrack-before-restore-backup";

/* =========================================================
   BASIC HELPERS
========================================================= */

function isBrowser() {
  return (
    typeof window !== "undefined" &&
    typeof localStorage !== "undefined"
  );
}

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function readJsonStorage(
  key,
  fallbackValue
) {
  if (!isBrowser()) {
    return fallbackValue;
  }

  try {
    const storedValue =
      localStorage.getItem(key);

    if (!storedValue) {
      return fallbackValue;
    }

    return JSON.parse(storedValue);
  } catch (error) {
    console.error(
      `Failed to read "${key}" from localStorage:`,
      error
    );

    return fallbackValue;
  }
}

function writeJsonStorage(key, value) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(
    key,
    JSON.stringify(value)
  );
}

function getSafeArray(value) {
  return Array.isArray(value)
    ? value.filter(isPlainObject)
    : [];
}

function getSafeProfile(value) {
  return isPlainObject(value)
    ? value
    : {};
}

function getSafeTheme(value) {
  const allowedThemes = [
    "light",
    "dark",
    "system",
  ];

  return allowedThemes.includes(value)
    ? value
    : "dark";
}

function getSafeAccent(value) {
  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value.trim();
  }

  return "#06b6d4";
}

function formatFileTimestamp(
  date = new Date()
) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const hours = String(
    date.getHours()
  ).padStart(2, "0");

  const minutes = String(
    date.getMinutes()
  ).padStart(2, "0");

  return `${year}-${month}-${day}-${hours}-${minutes}`;
}

function downloadJsonFile(
  content,
  filename
) {
  const blob = new Blob(
    [JSON.stringify(content, null, 2)],
    {
      type: "application/json;charset=utf-8",
    }
  );

  const objectUrl =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = filename;

  document.body.appendChild(anchor);

  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(objectUrl);
}

/* =========================================================
   CREATE BACKUP
========================================================= */

export function createFinanceBackup() {
  const transactions = getSafeArray(
    readJsonStorage(
      STORAGE_KEYS.transactions,
      []
    )
  );

  const budgets = getSafeArray(
    readJsonStorage(
      STORAGE_KEYS.budgets,
      []
    )
  );

  const goals = getSafeArray(
    readJsonStorage(
      STORAGE_KEYS.goals,
      []
    )
  );

  const profile = getSafeProfile(
    readJsonStorage(
      STORAGE_KEYS.profile,
      {}
    )
  );

  const theme = getSafeTheme(
    isBrowser()
      ? localStorage.getItem(
          STORAGE_KEYS.theme
        )
      : "dark"
  );

  const accent = getSafeAccent(
    isBrowser()
      ? localStorage.getItem(
          STORAGE_KEYS.accent
        )
      : "#06b6d4"
  );

  return {
    format: FINTRACK_BACKUP_FORMAT,

    version:
      FINTRACK_BACKUP_VERSION,

    app: "FinTrack Pro",

    exportedAt:
      new Date().toISOString(),

    data: {
      transactions,
      budgets,
      goals,
      profile,

      appearance: {
        theme,
        accent,
      },
    },

    metadata: {
      transactionCount:
        transactions.length,

      budgetCount:
        budgets.length,

      goalCount:
        goals.length,

      profileIncluded:
        Object.keys(profile).length > 0,
    },
  };
}

/* =========================================================
   DOWNLOAD BACKUP
========================================================= */

export function downloadFinanceBackup() {
  if (!isBrowser()) {
    throw new Error(
      "Backup is only available in the browser."
    );
  }

  const backup =
    createFinanceBackup();

  const filename = `fintrack-backup-${formatFileTimestamp()}.json`;

  downloadJsonFile(
    backup,
    filename
  );

  const backupTime =
    new Date().toISOString();

  localStorage.setItem(
    STORAGE_KEYS.lastBackupAt,
    backupTime
  );

  return {
    backup,
    filename,
    backupTime,
  };
}

/* =========================================================
   BACKUP VALIDATION
========================================================= */

function sanitizeObjectArray(
  value,
  fieldName,
  warnings
) {
  if (!Array.isArray(value)) {
    warnings.push(
      `${fieldName} was missing or invalid and will be restored as an empty list.`
    );

    return [];
  }

  const validItems =
    value.filter(isPlainObject);

  const removedCount =
    value.length - validItems.length;

  if (removedCount > 0) {
    warnings.push(
      `${removedCount} invalid ${fieldName.toLowerCase()} record(s) will be ignored.`
    );
  }

  return validItems;
}

export function validateFinanceBackup(
  value
) {
  const errors = [];
  const warnings = [];

  if (!isPlainObject(value)) {
    return {
      valid: false,
      errors: [
        "The selected file does not contain a valid backup object.",
      ],
      warnings: [],
      backup: null,
      preview: null,
    };
  }

  if (
    value.format !==
    FINTRACK_BACKUP_FORMAT
  ) {
    errors.push(
      "This file is not a valid FinTrack Pro backup."
    );
  }

  const backupVersion =
    Number(value.version);

  if (
    !Number.isInteger(
      backupVersion
    )
  ) {
    errors.push(
      "The backup version is missing or invalid."
    );
  } else if (
    backupVersion >
    FINTRACK_BACKUP_VERSION
  ) {
    errors.push(
      "This backup was created by a newer version of FinTrack Pro."
    );
  } else if (
    backupVersion <
    FINTRACK_BACKUP_VERSION
  ) {
    warnings.push(
      "This is an older backup. FinTrack will attempt to migrate it safely."
    );
  }

  if (!isPlainObject(value.data)) {
    errors.push(
      "The backup data section is missing or corrupted."
    );
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      warnings,
      backup: null,
      preview: null,
    };
  }

  const rawData = value.data;

  const transactions =
    sanitizeObjectArray(
      rawData.transactions,
      "Transactions",
      warnings
    );

  const budgets =
    sanitizeObjectArray(
      rawData.budgets,
      "Budgets",
      warnings
    );

  const goals =
    sanitizeObjectArray(
      rawData.goals,
      "Goals",
      warnings
    );

  const profile = isPlainObject(
    rawData.profile
  )
    ? rawData.profile
    : {};

  if (
    !isPlainObject(rawData.profile)
  ) {
    warnings.push(
      "Profile data was missing or invalid and will be restored as an empty profile."
    );
  }

  const appearance =
    isPlainObject(
      rawData.appearance
    )
      ? rawData.appearance
      : {};

  const normalizedBackup = {
    format:
      FINTRACK_BACKUP_FORMAT,

    version:
      FINTRACK_BACKUP_VERSION,

    app:
      value.app || "FinTrack Pro",

    exportedAt:
      value.exportedAt ||
      new Date().toISOString(),

    data: {
      transactions,
      budgets,
      goals,
      profile,

      appearance: {
        theme: getSafeTheme(
          appearance.theme
        ),

        accent: getSafeAccent(
          appearance.accent
        ),
      },
    },
  };

  const preview = {
    transactionCount:
      transactions.length,

    budgetCount:
      budgets.length,

    goalCount:
      goals.length,

    profileIncluded:
      Object.keys(profile).length > 0,

    profileName:
      profile.name ||
      [
        profile.firstName,
        profile.lastName,
      ]
        .filter(Boolean)
        .join(" ") ||
      "No profile name",

    theme:
      normalizedBackup.data
        .appearance.theme,

    accent:
      normalizedBackup.data
        .appearance.accent,

    exportedAt:
      normalizedBackup.exportedAt,
  };

  return {
    valid: true,
    errors,
    warnings,
    backup: normalizedBackup,
    preview,
  };
}

/* =========================================================
   READ BACKUP FILE
========================================================= */

export async function readFinanceBackupFile(
  file
) {
  if (!(file instanceof File)) {
    throw new Error(
      "Please select a valid JSON backup file."
    );
  }

  if (
    file.size >
    MAX_BACKUP_FILE_SIZE
  ) {
    throw new Error(
      "The selected backup is too large. Maximum file size is 5 MB."
    );
  }

  const fileExtension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase();

  if (fileExtension !== "json") {
    throw new Error(
      "Please select a .json FinTrack backup file."
    );
  }

  let parsedValue;

  try {
    const fileText =
      await file.text();

    parsedValue =
      JSON.parse(fileText);
  } catch {
    throw new Error(
      "The selected file contains invalid JSON."
    );
  }

  return validateFinanceBackup(
    parsedValue
  );
}

/* =========================================================
   RESTORE BACKUP
========================================================= */

export function restoreFinanceBackup(
  backup
) {
  if (!isBrowser()) {
    throw new Error(
      "Restore is only available in the browser."
    );
  }

  const validation =
    validateFinanceBackup(backup);

  if (!validation.valid) {
    throw new Error(
      validation.errors[0] ||
        "The backup could not be restored."
    );
  }

  /*
    Save a temporary rollback snapshot before
    replacing the user's current data.
  */

  try {
    sessionStorage.setItem(
      ROLLBACK_STORAGE_KEY,
      JSON.stringify(
        createFinanceBackup()
      )
    );
  } catch (error) {
    console.warn(
      "Could not create restore rollback snapshot:",
      error
    );
  }

  const data =
    validation.backup.data;

  writeJsonStorage(
    STORAGE_KEYS.transactions,
    data.transactions
  );

  writeJsonStorage(
    STORAGE_KEYS.budgets,
    data.budgets
  );

  writeJsonStorage(
    STORAGE_KEYS.goals,
    data.goals
  );

  writeJsonStorage(
    STORAGE_KEYS.profile,
    data.profile
  );

  localStorage.setItem(
    STORAGE_KEYS.theme,
    data.appearance.theme
  );

  localStorage.setItem(
    STORAGE_KEYS.accent,
    data.appearance.accent
  );

  const restoredAt =
    new Date().toISOString();

  localStorage.setItem(
    STORAGE_KEYS.lastRestoreAt,
    restoredAt
  );

  return {
    restoredAt,

    transactionCount:
      data.transactions.length,

    budgetCount:
      data.budgets.length,

    goalCount:
      data.goals.length,
  };
}

/* =========================================================
   CLEAR DATA
========================================================= */

export function clearFinanceData({
  keepProfile = true,
  keepAppearance = true,
} = {}) {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(
    STORAGE_KEYS.transactions
  );

  localStorage.removeItem(
    STORAGE_KEYS.budgets
  );

  localStorage.removeItem(
    STORAGE_KEYS.goals
  );

  if (!keepProfile) {
    localStorage.removeItem(
      STORAGE_KEYS.profile
    );
  }

  if (!keepAppearance) {
    localStorage.removeItem(
      STORAGE_KEYS.theme
    );

    localStorage.removeItem(
      STORAGE_KEYS.accent
    );
  }

  localStorage.removeItem(
    STORAGE_KEYS.lastRestoreAt
  );

  return {
    keepProfile,
    keepAppearance,
  };
}

/* =========================================================
   STORAGE SUMMARY
========================================================= */

export function getFinanceStorageSummary() {
  const transactions = getSafeArray(
    readJsonStorage(
      STORAGE_KEYS.transactions,
      []
    )
  );

  const budgets = getSafeArray(
    readJsonStorage(
      STORAGE_KEYS.budgets,
      []
    )
  );

  const goals = getSafeArray(
    readJsonStorage(
      STORAGE_KEYS.goals,
      []
    )
  );

  const profile = getSafeProfile(
    readJsonStorage(
      STORAGE_KEYS.profile,
      {}
    )
  );

  const backupData =
    createFinanceBackup();

  const serializedData =
    JSON.stringify(backupData);

  const approximateBytes =
    new Blob([
      serializedData,
    ]).size;

  return {
    transactionCount:
      transactions.length,

    budgetCount:
      budgets.length,

    goalCount:
      goals.length,

    profileIncluded:
      Object.keys(profile).length > 0,

    approximateBytes,

    lastBackupAt: isBrowser()
      ? localStorage.getItem(
          STORAGE_KEYS.lastBackupAt
        )
      : null,

    lastRestoreAt: isBrowser()
      ? localStorage.getItem(
          STORAGE_KEYS.lastRestoreAt
        )
      : null,
  };
}