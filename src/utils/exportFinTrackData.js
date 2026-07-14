function readStorageItem(key, fallback) {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error(
      `Unable to read ${key}:`,
      error
    );

    return fallback;
  }
}

export function createFinTrackBackup() {
  return {
    app: "FinTrack Pro",
    exportedAt: new Date().toISOString(),

    profile: readStorageItem(
      "fintrack-profile",
      null
    ),

    transactions: readStorageItem(
      "transactions",
      []
    ),

    budgets: readStorageItem(
      "budgets",
      []
    ),

    goals: readStorageItem(
      "goals",
      []
    ),

    theme:
      localStorage.getItem("theme") ||
      "dark",

    accent:
      localStorage.getItem("accent") ||
      "#06b6d4",
  };
}

export function downloadFinTrackBackup() {
  const backup =
    createFinTrackBackup();

  const fileContent = JSON.stringify(
    backup,
    null,
    2
  );

  const blob = new Blob(
    [fileContent],
    {
      type: "application/json",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const date = new Date()
    .toISOString()
    .slice(0, 10);

  const link =
    document.createElement("a");

  link.href = url;
  link.download = `fintrack-backup-${date}.json`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}