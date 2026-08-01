import {
  calculateRemainingAmount,
  formatDebtDateInput,
  getNextDebtDueDate,
  getPositiveDebtNumber,
  normalizeDebtRecord,
} from "../utils/debtCalculations";

/* =========================================================
   STORAGE CONFIGURATION
========================================================= */

export const DEBT_STORAGE_KEY =
  "fintrack-debts";

export const DEBT_STORAGE_EVENT =
  "fintrack:debts-updated";

const STORAGE_VERSION = 1;

const LEGACY_STORAGE_KEYS = [
  "debts",
  "fintrack-debt-records",
];

/* =========================================================
   BROWSER CHECK
========================================================= */

/**
 * Checks whether localStorage is available.
 *
 * During React rendering or testing, window may not exist.
 */
function isBrowserAvailable() {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !==
      "undefined"
  );
}

/* =========================================================
   ID GENERATOR
========================================================= */

/**
 * Creates a unique ID for debts and payments.
 *
 * Modern browsers use crypto.randomUUID().
 * Older browsers use a timestamp fallback.
 */
export function createDebtId(
  prefix = "debt"
) {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

/* =========================================================
   USER STORAGE KEY
========================================================= */

/**
 * Removes unsupported characters from a user ID.
 */
function normalizeStorageUserId(
  userId
) {
  return String(userId || "")
    .trim()
    .replace(
      /[^a-zA-Z0-9_-]/g,
      "_"
    );
}

/**
 * Creates a separate storage key for each authenticated user.
 *
 * Without user:
 * fintrack-debts
 *
 * With user:
 * fintrack-debts:user-uuid
 */
export function getDebtStorageKey(
  userId = ""
) {
  const safeUserId =
    normalizeStorageUserId(userId);

  if (!safeUserId) {
    return DEBT_STORAGE_KEY;
  }

  return `${DEBT_STORAGE_KEY}:${safeUserId}`;
}

/* =========================================================
   NORMALIZE DEBT LIST
========================================================= */

/**
 * Normalizes every debt record before it reaches the UI.
 *
 * It also prevents duplicate IDs.
 */
function normalizeDebtList(
  records
) {
  const safeRecords =
    Array.isArray(records)
      ? records
      : [];

  const usedIds = new Set();

  return safeRecords
    .filter(
      (record) =>
        record &&
        typeof record === "object"
    )
    .map((record) => {
      let recordId = String(
        record.id || ""
      ).trim();

      if (
        !recordId ||
        usedIds.has(recordId)
      ) {
        recordId =
          createDebtId("debt");
      }

      usedIds.add(recordId);

      return normalizeDebtRecord({
        ...record,
        id: recordId,
      });
    });
}

/* =========================================================
   READ STORAGE PAYLOAD
========================================================= */

/**
 * Supports both storage formats:
 *
 * Old format:
 * [record, record]
 *
 * New format:
 * {
 *   version: 1,
 *   records: [...]
 * }
 */
function extractStoredRecords(
  parsedData
) {
  if (Array.isArray(parsedData)) {
    return parsedData;
  }

  if (
    parsedData &&
    typeof parsedData === "object" &&
    Array.isArray(
      parsedData.records
    )
  ) {
    return parsedData.records;
  }

  return [];
}

/**
 * Reads and parses one localStorage key.
 */
function readStorageKey(
  storageKey
) {
  if (!isBrowserAvailable()) {
    return [];
  }

  try {
    const storedValue =
      window.localStorage.getItem(
        storageKey
      );

    if (!storedValue) {
      return [];
    }

    const parsedValue =
      JSON.parse(storedValue);

    return extractStoredRecords(
      parsedValue
    );
  } catch {
    return [];
  }
}

/* =========================================================
   READ ALL DEBTS
========================================================= */

/**
 * Reads all saved debts.
 *
 * userId is optional.
 */
export function getStoredDebts(
  userId = ""
) {
  if (!isBrowserAvailable()) {
    return [];
  }

  const storageKey =
    getDebtStorageKey(userId);

  const currentRecords =
    readStorageKey(storageKey);

  if (currentRecords.length > 0) {
    return normalizeDebtList(
      currentRecords
    );
  }

  /*
   * Legacy keys are checked only when no user ID is provided.
   * This prevents another user's data from being loaded.
   */
  if (!userId) {
    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      const legacyRecords =
        readStorageKey(legacyKey);

      if (
        legacyRecords.length > 0
      ) {
        const normalizedRecords =
          normalizeDebtList(
            legacyRecords
          );

        saveStoredDebts(
          normalizedRecords
        );

        return normalizedRecords;
      }
    }
  }

  return [];
}

/* =========================================================
   STORAGE UPDATE EVENT
========================================================= */

/**
 * Sends a custom browser event after data changes.
 *
 * This allows DebtContext to update immediately without
 * refreshing the page.
 */
function dispatchDebtStorageEvent(
  records,
  userId = ""
) {
  if (!isBrowserAvailable()) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(
      DEBT_STORAGE_EVENT,
      {
        detail: {
          userId,
          storageKey:
            getDebtStorageKey(
              userId
            ),
          records,
        },
      }
    )
  );
}

/* =========================================================
   SAVE ALL DEBTS
========================================================= */

/**
 * Saves the complete debt list.
 */
export function saveStoredDebts(
  debts,
  userId = ""
) {
  const normalizedRecords =
    normalizeDebtList(debts);

  if (!isBrowserAvailable()) {
    return normalizedRecords;
  }

  const storageKey =
    getDebtStorageKey(userId);

  const storagePayload = {
    version: STORAGE_VERSION,
    updatedAt:
      new Date().toISOString(),
    records: normalizedRecords,
  };

  try {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify(
        storagePayload
      )
    );

    dispatchDebtStorageEvent(
      normalizedRecords,
      userId
    );
  } catch (error) {
    throw new Error(
      error?.message ||
        "Unable to save debt records."
    );
  }

  return normalizedRecords;
}

/* =========================================================
   GET ONE DEBT
========================================================= */

/**
 * Finds one debt by its ID.
 */
export function getStoredDebtById(
  debtId,
  userId = ""
) {
  const safeDebtId = String(
    debtId || ""
  ).trim();

  if (!safeDebtId) {
    return null;
  }

  const debts =
    getStoredDebts(userId);

  return (
    debts.find(
      (debt) =>
        debt.id === safeDebtId
    ) || null
  );
}

/* =========================================================
   CREATE DEBT
========================================================= */

/**
 * Creates and saves a new loan, EMI, borrowed amount,
 * lent amount, or other due.
 */
export function createStoredDebt(
  debtData,
  userId = ""
) {
  if (
    !debtData ||
    typeof debtData !== "object"
  ) {
    throw new Error(
      "Valid debt information is required."
    );
  }

  const now =
    new Date().toISOString();

  const newDebt =
    normalizeDebtRecord({
      ...debtData,

      id:
        debtData.id ||
        createDebtId("debt"),

      payments:
        Array.isArray(
          debtData.payments
        )
          ? debtData.payments
          : [],

      createdAt:
        debtData.createdAt ||
        now,

      updatedAt: now,
    });

  const currentDebts =
    getStoredDebts(userId);

  const updatedDebts = [
    newDebt,
    ...currentDebts,
  ];

  saveStoredDebts(
    updatedDebts,
    userId
  );

  return newDebt;
}

/* =========================================================
   UPDATE DEBT
========================================================= */

/**
 * Updates an existing debt record.
 */
export function updateStoredDebt(
  debtId,
  updates,
  userId = ""
) {
  const safeDebtId = String(
    debtId || ""
  ).trim();

  if (!safeDebtId) {
    throw new Error(
      "Debt ID is required."
    );
  }

  if (
    !updates ||
    typeof updates !== "object"
  ) {
    throw new Error(
      "Debt updates are required."
    );
  }

  const currentDebts =
    getStoredDebts(userId);

  const existingDebt =
    currentDebts.find(
      (debt) =>
        debt.id === safeDebtId
    );

  if (!existingDebt) {
    throw new Error(
      "Debt record was not found."
    );
  }

  const updatedDebt =
    normalizeDebtRecord({
      ...existingDebt,
      ...updates,

      id: existingDebt.id,

      createdAt:
        existingDebt.createdAt,

      payments:
        updates.payments !==
        undefined
          ? updates.payments
          : existingDebt.payments,

      updatedAt:
        new Date().toISOString(),
    });

  const updatedDebts =
    currentDebts.map((debt) =>
      debt.id === safeDebtId
        ? updatedDebt
        : debt
    );

  saveStoredDebts(
    updatedDebts,
    userId
  );

  return updatedDebt;
}

/* =========================================================
   DELETE DEBT
========================================================= */

/**
 * Deletes a debt and its payment history.
 */
export function deleteStoredDebt(
  debtId,
  userId = ""
) {
  const safeDebtId = String(
    debtId || ""
  ).trim();

  if (!safeDebtId) {
    throw new Error(
      "Debt ID is required."
    );
  }

  const currentDebts =
    getStoredDebts(userId);

  const debtExists =
    currentDebts.some(
      (debt) =>
        debt.id === safeDebtId
    );

  if (!debtExists) {
    return false;
  }

  const updatedDebts =
    currentDebts.filter(
      (debt) =>
        debt.id !== safeDebtId
    );

  saveStoredDebts(
    updatedDebts,
    userId
  );

  return true;
}

/* =========================================================
   PAYMENT NORMALIZATION
========================================================= */

/**
 * Creates a safe payment object.
 */
function normalizeDebtPayment(
  paymentData,
  debt,
  remainingBeforePayment
) {
  const requestedAmount =
    getPositiveDebtNumber(
      paymentData.amount
    );

  if (requestedAmount <= 0) {
    throw new Error(
      "Payment amount must be greater than zero."
    );
  }

  if (
    remainingBeforePayment <= 0
  ) {
    throw new Error(
      "This debt has already been completed."
    );
  }

  /*
   * Prevents a payment from becoming greater than
   * the outstanding amount.
   */
  const amount = Math.min(
    requestedAmount,
    remainingBeforePayment
  );

  const interestAmount =
    Math.min(
      getPositiveDebtNumber(
        paymentData.interestAmount
      ),
      amount
    );

  const amountAfterInterest =
    Math.max(
      amount - interestAmount,
      0
    );

  const lateFee = Math.min(
    getPositiveDebtNumber(
      paymentData.lateFee
    ),
    amountAfterInterest
  );

  const availablePrincipal =
    Math.max(
      amount -
        interestAmount -
        lateFee,
      0
    );

  const providedPrincipal =
    paymentData.principalAmount !==
    undefined
      ? getPositiveDebtNumber(
          paymentData.principalAmount
        )
      : availablePrincipal;

  const principalAmount =
    Math.min(
      providedPrincipal,
      availablePrincipal
    );

  const otherAmount =
    Math.max(
      amount -
        principalAmount -
        interestAmount -
        lateFee,
      0
    );

  const now =
    new Date().toISOString();

  return {
    id:
      paymentData.id ||
      createDebtId("payment"),

    debtId: debt.id,

    type:
      debt.direction ===
      "receivable"
        ? "received"
        : "paid",

    amount,
    principalAmount,
    interestAmount,
    lateFee,
    otherAmount,

    paymentDate:
      formatDebtDateInput(
        paymentData.paymentDate ||
          new Date()
      ),

    paymentMethod:
      paymentData.paymentMethod ||
      "cash",

    referenceNumber:
      paymentData.referenceNumber ||
      "",

    notes:
      paymentData.notes || "",

    createdAt:
      paymentData.createdAt ||
      now,

    updatedAt: now,
  };
}

/* =========================================================
   RECORD PAYMENT
========================================================= */

/**
 * Records:
 *
 * Loan payment
 * EMI payment
 * Borrowed-money repayment
 * Received payment from money lent
 */
export function recordDebtPayment(
  debtId,
  paymentData,
  userId = ""
) {
  const safeDebtId = String(
    debtId || ""
  ).trim();

  if (!safeDebtId) {
    throw new Error(
      "Debt ID is required."
    );
  }

  if (
    !paymentData ||
    typeof paymentData !== "object"
  ) {
    throw new Error(
      "Payment information is required."
    );
  }

  const currentDebts =
    getStoredDebts(userId);

  const existingDebt =
    currentDebts.find(
      (debt) =>
        debt.id === safeDebtId
    );

  if (!existingDebt) {
    throw new Error(
      "Debt record was not found."
    );
  }

  const remainingBeforePayment =
    calculateRemainingAmount(
      existingDebt
    );

  const newPayment =
    normalizeDebtPayment(
      paymentData,
      existingDebt,
      remainingBeforePayment
    );

  const currentPayments =
    Array.isArray(
      existingDebt.payments
    )
      ? existingDebt.payments
      : [];

  const updatedPayments = [
    newPayment,
    ...currentPayments,
  ];

  const remainingAfterPayment =
    Math.max(
      remainingBeforePayment -
        newPayment.amount,
      0
    );

  const installmentAmount =
    getPositiveDebtNumber(
      existingDebt.installmentAmount
    );

  /*
   * A due date advances when:
   *
   * 1. The debt is not completed.
   * 2. The payment covers the expected installment.
   * 3. The user did not disable date advancement.
   */
  const requiredPayment =
    installmentAmount > 0
      ? Math.min(
          installmentAmount,
          remainingBeforePayment
        )
      : remainingBeforePayment;

  const shouldAdvanceDate =
    paymentData.advanceDueDate !==
      false &&
    newPayment.amount >=
      requiredPayment;

  let nextDueDate =
    existingDebt.nextDueDate;

  if (
    remainingAfterPayment <= 0
  ) {
    nextDueDate = "";
  } else if (
    shouldAdvanceDate &&
    existingDebt.nextDueDate
  ) {
    nextDueDate =
      getNextDebtDueDate(
        existingDebt.nextDueDate,
        existingDebt.frequency
      );
  }

  const updatedDebt =
    normalizeDebtRecord({
      ...existingDebt,

      payments:
        updatedPayments,

      nextDueDate,

      updatedAt:
        new Date().toISOString(),
    });

  const updatedDebts =
    currentDebts.map((debt) =>
      debt.id === safeDebtId
        ? updatedDebt
        : debt
    );

  saveStoredDebts(
    updatedDebts,
    userId
  );

  return {
    debt: updatedDebt,
    payment: newPayment,
  };
}

/* =========================================================
   DELETE PAYMENT
========================================================= */

/**
 * Deletes one payment from a debt's payment history.
 */
export function deleteDebtPayment(
  debtId,
  paymentId,
  userId = ""
) {
  const safeDebtId = String(
    debtId || ""
  ).trim();

  const safePaymentId = String(
    paymentId || ""
  ).trim();

  if (
    !safeDebtId ||
    !safePaymentId
  ) {
    throw new Error(
      "Debt ID and payment ID are required."
    );
  }

  const existingDebt =
    getStoredDebtById(
      safeDebtId,
      userId
    );

  if (!existingDebt) {
    throw new Error(
      "Debt record was not found."
    );
  }

  const currentPayments =
    Array.isArray(
      existingDebt.payments
    )
      ? existingDebt.payments
      : [];

  const paymentExists =
    currentPayments.some(
      (payment) =>
        payment.id ===
        safePaymentId
    );

  if (!paymentExists) {
    return null;
  }

  const updatedPayments =
    currentPayments.filter(
      (payment) =>
        payment.id !==
        safePaymentId
    );

  return updateStoredDebt(
    safeDebtId,
    {
      payments:
        updatedPayments,
    },
    userId
  );
}

/* =========================================================
   PAYMENT HISTORY
========================================================= */

/**
 * Creates one complete payment-history list from all debts.
 */
export function getDebtPaymentHistory(
  userId = ""
) {
  const debts =
    getStoredDebts(userId);

  const paymentHistory =
    debts.flatMap((debt) => {
      const payments =
        Array.isArray(
          debt.payments
        )
          ? debt.payments
          : [];

      return payments.map(
        (payment) => ({
          ...payment,

          debtId: debt.id,
          debtTitle: debt.title,
          partyName:
            debt.partyName,
          direction:
            debt.direction,
          debtType: debt.type,
        })
      );
    });

  return paymentHistory.sort(
    (first, second) => {
      const firstDate =
        new Date(
          first.paymentDate ||
            first.createdAt ||
            0
        ).getTime();

      const secondDate =
        new Date(
          second.paymentDate ||
            second.createdAt ||
            0
        ).getTime();

      return secondDate - firstDate;
    }
  );
}

/* =========================================================
   CLEAR DEBT DATA
========================================================= */

/**
 * Deletes all Debt Center records for one user.
 */
export function clearStoredDebts(
  userId = ""
) {
  if (!isBrowserAvailable()) {
    return;
  }

  const storageKey =
    getDebtStorageKey(userId);

  try {
    window.localStorage.removeItem(
      storageKey
    );

    dispatchDebtStorageEvent(
      [],
      userId
    );
  } catch (error) {
    throw new Error(
      error?.message ||
        "Unable to clear debt data."
    );
  }
}

/* =========================================================
   CHECK FOR SAVED DATA
========================================================= */

/**
 * Returns true when at least one debt record exists.
 */
export function hasStoredDebts(
  userId = ""
) {
  return (
    getStoredDebts(userId)
      .length > 0
  );
}

/* =========================================================
   STORAGE SUBSCRIPTION
========================================================= */

/**
 * Listens for:
 *
 * 1. Changes made in the current browser tab.
 * 2. Changes made in another browser tab.
 *
 * DebtContext will use this function.
 */
export function subscribeToDebtStorage(
  callback,
  userId = ""
) {
  if (
    !isBrowserAvailable() ||
    typeof callback !== "function"
  ) {
    return () => {};
  }

  const expectedStorageKey =
    getDebtStorageKey(userId);

  const handleCustomEvent = (
    event
  ) => {
    if (
      event.detail?.storageKey !==
      expectedStorageKey
    ) {
      return;
    }

    callback(
      normalizeDebtList(
        event.detail?.records
      )
    );
  };

  const handleStorageEvent = (
    event
  ) => {
    if (
      event.key !==
      expectedStorageKey
    ) {
      return;
    }

    callback(
      getStoredDebts(userId)
    );
  };

  window.addEventListener(
    DEBT_STORAGE_EVENT,
    handleCustomEvent
  );

  window.addEventListener(
    "storage",
    handleStorageEvent
  );

  return () => {
    window.removeEventListener(
      DEBT_STORAGE_EVENT,
      handleCustomEvent
    );

    window.removeEventListener(
      "storage",
      handleStorageEvent
    );
  };
}

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const debtStorageService = {
  getStoredDebts,
  getStoredDebtById,
  saveStoredDebts,
  createStoredDebt,
  updateStoredDebt,
  deleteStoredDebt,
  recordDebtPayment,
  deleteDebtPayment,
  getDebtPaymentHistory,
  clearStoredDebts,
  hasStoredDebts,
  subscribeToDebtStorage,
};

export default debtStorageService;