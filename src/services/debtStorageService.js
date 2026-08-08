/* =========================================================
   DEBT STORAGE SERVICE
========================================================= */

const STORAGE_PREFIX =
  "fintrack-debts-v1";

const STORAGE_EVENT =
  "fintrack:debts-updated";

/* =========================================================
   BASIC HELPERS
========================================================= */

function isBrowser() {
  return (
    typeof window !==
      "undefined" &&
    typeof window.localStorage !==
      "undefined"
  );
}

function createId(
  prefix = "debt"
) {
  if (
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function safeNumber(
  value,
  fallback = 0
) {
  const number =
    Number(value);

  return Number.isFinite(
    number
  )
    ? number
    : fallback;
}

function positiveNumber(
  value,
  fallback = 0
) {
  return Math.max(
    0,
    safeNumber(
      value,
      fallback
    )
  );
}

function getToday() {
  const now = new Date();

  const year =
    now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================================================
   USER / STORAGE KEY
========================================================= */

function getUserIdentifier(
  user
) {
  if (
    typeof user ===
    "string"
  ) {
    return (
      user.trim() ||
      "guest"
    );
  }

  return (
    user?.id ||
    user?.email ||
    "guest"
  );
}

export function getDebtStorageKey(
  user
) {
  return `${STORAGE_PREFIX}:${getUserIdentifier(
    user
  )}`;
}

/* =========================================================
   LEGACY STORAGE KEYS

   This helps preserve older Debt Center data.
========================================================= */

function getLegacyKeys(user) {
  const id =
    getUserIdentifier(
      user
    );

  return [
    `fintrack-debts:${id}`,
    `fintrack:debts:${id}`,
    `fintrack_debts_${id}`,
    `debts_${id}`,
    "fintrack-debts",
    "fintrack_debts",
    "debts",
  ];
}

/* =========================================================
   SAFE JSON
========================================================= */

function safeParse(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(
      value
    );
  } catch {
    return null;
  }
}

/* =========================================================
   PAYMENT NORMALIZATION
========================================================= */

function normalizePayment(
  payment = {},
  record = {}
) {
  const amount =
    positiveNumber(
      payment.amount ??
        payment.paidAmount ??
        payment.value
    );

  const date =
    payment.paymentDate ||
    payment.date ||
    getToday();

  const receivable =
    record.direction ===
      "receivable" ||
    record.type === "lent";

  return {
    ...payment,

    id:
      payment.id ||
      createId(
        "payment"
      ),

    amount,

    paymentDate: date,

    date,

    notes:
      payment.notes ??
      payment.note ??
      "",

    note:
      payment.note ??
      payment.notes ??
      "",

    type:
      payment.type ||
      payment.paymentType ||
      (receivable
        ? "received"
        : "paid"),

    paymentType:
      payment.paymentType ||
      payment.type ||
      (receivable
        ? "received"
        : "paid"),

    direction:
      payment.direction ||
      (receivable
        ? "receivable"
        : "payable"),

    createdAt:
      payment.createdAt ||
      new Date().toISOString(),
  };
}

/* =========================================================
   PAYMENT TOTAL
========================================================= */

function calculatePaymentsTotal(
  record
) {
  const payments =
    Array.isArray(
      record?.payments
    )
      ? record.payments
      : Array.isArray(
            record?.paymentHistory
          )
        ? record.paymentHistory
        : [];

  return payments.reduce(
    (total, payment) =>
      total +
      positiveNumber(
        payment?.amount
      ),
    0
  );
}

/* =========================================================
   RECORD NORMALIZATION
========================================================= */

function normalizeStoredRecord(
  record = {}
) {
  const type =
    record.type ||
    "loan";

  const direction =
    record.direction ||
    (type === "lent"
      ? "receivable"
      : "payable");

  const totalAmount =
    positiveNumber(
      record.totalAmount ??
        record.amount
    );

  const rawPayments =
    Array.isArray(
      record.payments
    )
      ? record.payments
      : Array.isArray(
            record.paymentHistory
          )
        ? record.paymentHistory
        : [];

  const payments =
    rawPayments.map(
      (payment) =>
        normalizePayment(
          payment,
          {
            ...record,
            type,
            direction,
          }
        )
    );

  const paidAmount =
    payments.reduce(
      (total, payment) =>
        total +
        positiveNumber(
          payment.amount
        ),
      0
    );

  const completed =
    totalAmount > 0 &&
    paidAmount >=
      totalAmount;

  return {
    ...record,

    id:
      record.id ||
      createId(),

    type,

    direction,

    title:
      record.title ||
      "Untitled Debt",

    partyName:
      record.partyName ||
      record.personName ||
      record.lenderName ||
      record.borrowerName ||
      "",

    totalAmount,

    amount: totalAmount,

    interestRate:
      positiveNumber(
        record.interestRate
      ),

    installmentAmount:
      positiveNumber(
        record.installmentAmount
      ),

    totalInstallments:
      Math.max(
        0,
        Math.floor(
          positiveNumber(
            record.totalInstallments
          )
        )
      ),

    startDate:
      record.startDate ||
      getToday(),

    nextDueDate:
      record.nextDueDate ||
      "",

    notes:
      record.notes ??
      record.note ??
      "",

    payments,

    paymentHistory:
      payments,

    status: completed
      ? "completed"
      : record.status ===
          "completed"
        ? "active"
        : record.status ||
          "active",

    createdAt:
      record.createdAt ||
      new Date().toISOString(),

    updatedAt:
      record.updatedAt ||
      new Date().toISOString(),
  };
}

/* =========================================================
   READ RAW STORAGE
========================================================= */

function readRawRecords(
  key
) {
  if (!isBrowser()) {
    return [];
  }

  const parsed =
    safeParse(
      window.localStorage.getItem(
        key
      )
    );

  if (
    Array.isArray(parsed)
  ) {
    return parsed;
  }

  if (
    Array.isArray(
      parsed?.debts
    )
  ) {
    return parsed.debts;
  }

  if (
    Array.isArray(
      parsed?.records
    )
  ) {
    return parsed.records;
  }

  return [];
}

/* =========================================================
   LOAD RECORDS
========================================================= */

export function loadDebtRecords(
  user
) {
  if (!isBrowser()) {
    return [];
  }

  const primaryKey =
    getDebtStorageKey(
      user
    );

  const primaryRecords =
    readRawRecords(
      primaryKey
    );

  if (
    primaryRecords.length >
    0
  ) {
    return primaryRecords.map(
      normalizeStoredRecord
    );
  }

  /*
    Try old keys so previous
    Debt Center records are not
    accidentally lost.
  */

  const legacyKeys =
    getLegacyKeys(user);

  for (
    const key of legacyKeys
  ) {
    const records =
      readRawRecords(key);

    if (
      records.length === 0
    ) {
      continue;
    }

    const normalized =
      records.map(
        normalizeStoredRecord
      );

    /*
      Migrate old data into
      the new storage key.
    */

    try {
      window.localStorage.setItem(
        primaryKey,
        JSON.stringify(
          normalized
        )
      );
    } catch {
      // Ignore migration failure.
    }

    return normalized;
  }

  return [];
}

/* =========================================================
   NOTIFY STORAGE UPDATE
========================================================= */

function dispatchDebtUpdate(
  user
) {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(
      STORAGE_EVENT,
      {
        detail: {
          key:
            getDebtStorageKey(
              user
            ),
        },
      }
    )
  );
}

/* =========================================================
   SAVE RECORDS
========================================================= */

export function saveDebtRecords(
  user,
  records
) {
  if (!isBrowser()) {
    return [];
  }

  const normalized =
    (
      Array.isArray(records)
        ? records
        : []
    ).map(
      normalizeStoredRecord
    );

  window.localStorage.setItem(
    getDebtStorageKey(
      user
    ),
    JSON.stringify(
      normalized
    )
  );

  dispatchDebtUpdate(
    user
  );

  return normalized;
}

/* =========================================================
   ADD RECORD
========================================================= */

export function createDebtRecord(
  user,
  payload = {}
) {
  const records =
    loadDebtRecords(
      user
    );

  const now =
    new Date().toISOString();

  const type =
    payload.type ||
    "loan";

  const totalAmount =
    positiveNumber(
      payload.totalAmount ??
        payload.amount
    );

  const newRecord =
    normalizeStoredRecord({
      ...payload,

      id: createId(),

      type,

      direction:
        payload.direction ||
        (type === "lent"
          ? "receivable"
          : "payable"),

      totalAmount,

      amount: totalAmount,

      payments: [],

      paymentHistory: [],

      status: "active",

      createdAt: now,

      updatedAt: now,
    });

  saveDebtRecords(
    user,
    [
      newRecord,
      ...records,
    ]
  );

  return newRecord;
}

/* =========================================================
   UPDATE RECORD
========================================================= */

export function updateDebtRecord(
  user,
  recordId,
  updates = {}
) {
  if (!recordId) {
    throw new Error(
      "Debt record ID is required."
    );
  }

  const records =
    loadDebtRecords(
      user
    );

  let updatedRecord =
    null;

  const nextRecords =
    records.map(
      (record) => {
        if (
          record.id !==
          recordId
        ) {
          return record;
        }

        const type =
          updates.type ||
          record.type ||
          "loan";

        const merged =
          normalizeStoredRecord({
            ...record,
            ...updates,

            id: record.id,

            type,

            direction:
              updates.direction ||
              (type === "lent"
                ? "receivable"
                : "payable"),

            payments:
              record.payments ||
              [],

            createdAt:
              record.createdAt,

            updatedAt:
              new Date().toISOString(),
          });

        updatedRecord =
          merged;

        return merged;
      }
    );

  if (!updatedRecord) {
    throw new Error(
      "Debt record not found."
    );
  }

  saveDebtRecords(
    user,
    nextRecords
  );

  return updatedRecord;
}

/* =========================================================
   DELETE RECORD
========================================================= */

export function deleteDebtRecord(
  user,
  recordId
) {
  if (!recordId) {
    return false;
  }

  const records =
    loadDebtRecords(
      user
    );

  const nextRecords =
    records.filter(
      (record) =>
        record.id !==
        recordId
    );

  if (
    nextRecords.length ===
    records.length
  ) {
    return false;
  }

  saveDebtRecords(
    user,
    nextRecords
  );

  return true;
}

/* =========================================================
   ADVANCE MONTHLY DUE DATE
========================================================= */

function advanceMonthlyDate(
  dateValue
) {
  if (!dateValue) {
    return "";
  }

  const date =
    new Date(
      `${dateValue}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return dateValue;
  }

  date.setMonth(
    date.getMonth() + 1
  );

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================================================
   ADD PAYMENT
========================================================= */

export function createDebtPayment(
  user,
  recordId,
  paymentPayload = {}
) {
  if (!recordId) {
    throw new Error(
      "Debt record ID is required."
    );
  }

  const records =
    loadDebtRecords(
      user
    );

  let createdPayment =
    null;

  let found = false;

  const nextRecords =
    records.map(
      (record) => {
        if (
          record.id !==
          recordId
        ) {
          return record;
        }

        found = true;

        const alreadyPaid =
          calculatePaymentsTotal(
            record
          );

        const remaining =
          Math.max(
            0,
            positiveNumber(
              record.totalAmount
            ) - alreadyPaid
          );

        if (
          remaining <= 0
        ) {
          throw new Error(
            "This debt is already completed."
          );
        }

        const requestedAmount =
          positiveNumber(
            paymentPayload.amount
          );

        if (
          requestedAmount <=
          0
        ) {
          throw new Error(
            "Payment amount must be greater than 0."
          );
        }

        /*
          Prevent accidental
          overpayment.
        */

        const amount =
          Math.min(
            requestedAmount,
            remaining
          );

        const payment =
          normalizePayment(
            {
              ...paymentPayload,
              amount,
            },
            record
          );

        createdPayment =
          payment;

        const payments = [
          ...(record.payments ||
            []),
          payment,
        ];

        const newPaidTotal =
          payments.reduce(
            (
              total,
              item
            ) =>
              total +
              positiveNumber(
                item.amount
              ),
            0
          );

        const completed =
          newPaidTotal >=
          positiveNumber(
            record.totalAmount
          );

        const installmentAmount =
          positiveNumber(
            record.installmentAmount
          );

        let nextDueDate =
          record.nextDueDate ||
          "";

        if (completed) {
          nextDueDate = "";
        } else if (
          installmentAmount >
            0 &&
          amount >=
            installmentAmount
        ) {
          nextDueDate =
            advanceMonthlyDate(
              nextDueDate
            );
        }

        return normalizeStoredRecord({
          ...record,

          payments,

          paymentHistory:
            payments,

          status: completed
            ? "completed"
            : "active",

          nextDueDate,

          updatedAt:
            new Date().toISOString(),
        });
      }
    );

  if (!found) {
    throw new Error(
      "Debt record not found."
    );
  }

  saveDebtRecords(
    user,
    nextRecords
  );

  return createdPayment;
}

/* =========================================================
   DELETE PAYMENT
========================================================= */

export function deleteDebtPayment(
  user,
  recordId,
  paymentId
) {
  if (
    !recordId ||
    !paymentId
  ) {
    return false;
  }

  const records =
    loadDebtRecords(
      user
    );

  let removed = false;

  const nextRecords =
    records.map(
      (record) => {
        if (
          record.id !==
          recordId
        ) {
          return record;
        }

        const currentPayments =
          record.payments ||
          [];

        const payments =
          currentPayments.filter(
            (payment) =>
              payment.id !==
              paymentId
          );

        if (
          payments.length ===
          currentPayments.length
        ) {
          return record;
        }

        removed = true;

        const paidTotal =
          payments.reduce(
            (
              total,
              payment
            ) =>
              total +
              positiveNumber(
                payment.amount
              ),
            0
          );

        const completed =
          paidTotal >=
          positiveNumber(
            record.totalAmount
          );

        return normalizeStoredRecord({
          ...record,

          payments,

          paymentHistory:
            payments,

          status: completed
            ? "completed"
            : "active",

          updatedAt:
            new Date().toISOString(),
        });
      }
    );

  if (!removed) {
    return false;
  }

  saveDebtRecords(
    user,
    nextRecords
  );

  return true;
}

/* =========================================================
   CLEAR ALL RECORDS
========================================================= */

export function clearDebtRecords(
  user
) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(
    getDebtStorageKey(
      user
    )
  );

  dispatchDebtUpdate(
    user
  );
}

/* =========================================================
   STORAGE SUBSCRIPTION
========================================================= */

export function subscribeToDebtStorage(
  user,
  callback
) {
  if (
    !isBrowser() ||
    typeof callback !==
      "function"
  ) {
    return () => {};
  }

  const targetKey =
    getDebtStorageKey(
      user
    );

  const handleCustomEvent =
    (event) => {
      if (
        event?.detail?.key &&
        event.detail.key !==
          targetKey
      ) {
        return;
      }

      callback();
    };

  const handleStorageEvent =
    (event) => {
      if (
        event.key !==
        targetKey
      ) {
        return;
      }

      callback();
    };

  window.addEventListener(
    STORAGE_EVENT,
    handleCustomEvent
  );

  window.addEventListener(
    "storage",
    handleStorageEvent
  );

  return () => {
    window.removeEventListener(
      STORAGE_EVENT,
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
  getDebtStorageKey,

  loadDebtRecords,
  saveDebtRecords,

  createDebtRecord,
  updateDebtRecord,
  deleteDebtRecord,

  createDebtPayment,
  deleteDebtPayment,

  clearDebtRecords,
  subscribeToDebtStorage,
};

export default debtStorageService;