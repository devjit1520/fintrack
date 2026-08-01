/* =========================================================
   SAFE NUMBER HELPERS
========================================================= */
export function getSafeDebtNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

/**
 * Makes sure an amount never becomes negative.
 */
export function getPositiveDebtNumber(value) {
  return Math.max(
    getSafeDebtNumber(value),
    0
  );
}

/* =========================================================
   DATE HELPERS
========================================================= */

/**
 * Converts a date value into a valid Date object.
 */
export function getSafeDebtDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return date;
}

/**
 * Converts a date into YYYY-MM-DD format.
 *
 * This format is useful for:
 * input type="date"
 * localStorage
 * comparing due dates
 */
export function formatDebtDateInput(
  value
) {
  const date =
    getSafeDebtDate(value);

  if (!date) {
    return "";
  }

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Displays a readable date.
 *
 * Example:
 * 2026-08-05 → 05 Aug 2026
 */
export function formatDebtDate(
  value
) {
  const date =
    getSafeDebtDate(value);

  if (!date) {
    return "No date";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

/**
 * Returns today's date without the current time.
 */
export function getTodayStart() {
  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  return today;
}

/**
 * Returns the number of days between today and a due date.
 *
 * Positive result:
 * payment is in the future
 *
 * Zero:
 * payment is due today
 *
 * Negative result:
 * payment is overdue
 */
export function getDaysUntilDue(
  dueDate
) {
  const date =
    getSafeDebtDate(dueDate);

  if (!date) {
    return null;
  }

  const today =
    getTodayStart();

  date.setHours(
    0,
    0,
    0,
    0
  );

  const difference =
    date.getTime() -
    today.getTime();

  return Math.ceil(
    difference /
      (1000 * 60 * 60 * 24)
  );
}

/* =========================================================
   CURRENCY
========================================================= */

/**
 * Formats a number as Indian Rupees.
 *
 * Example:
 * 15000 → ₹15,000
 */
export function formatDebtCurrency(
  value,
  currency = "INR"
) {
  const amount =
    getSafeDebtNumber(value);

  try {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }
    ).format(amount);
  } catch {
    return `₹${amount.toLocaleString(
      "en-IN"
    )}`;
  }
}

/* =========================================================
   DEBT TYPE HELPERS
========================================================= */

/**
 * Returns whether a debt record is payable or receivable.
 *
 * Payable:
 * You need to pay money.
 *
 * Receivable:
 * Another person needs to pay you.
 */
export function getDebtDirection(
  type
) {
  const normalizedType =
    String(type || "")
      .trim()
      .toLowerCase();

  if (
    normalizedType === "lent"
  ) {
    return "receivable";
  }

  return "payable";
}

/**
 * Returns a readable debt type.
 */
export function getDebtTypeLabel(
  type
) {
  const labels = {
    loan: "Loan",
    emi: "EMI",
    borrowed: "Money Borrowed",
    lent: "Money Lent",
    due: "Other Due",
  };

  return (
    labels[type] ||
    "Debt Record"
  );
}

/**
 * Returns a readable payment action.
 */
export function getPaymentActionLabel(
  direction
) {
  if (
    direction === "receivable"
  ) {
    return "Record Received Payment";
  }

  return "Record Payment";
}

/* =========================================================
   AMOUNT CALCULATIONS
========================================================= */

/**
 * Calculates how much has been paid or received.
 *
 * It first checks payments.
 * If no payment array is available, it uses paidAmount.
 */
export function calculatePaidAmount(
  debt
) {
  if (!debt) {
    return 0;
  }

  const payments =
    Array.isArray(debt.payments)
      ? debt.payments
      : [];

  if (payments.length > 0) {
    return payments.reduce(
      (total, payment) =>
        total +
        getPositiveDebtNumber(
          payment.amount
        ),
      0
    );
  }

  return getPositiveDebtNumber(
    debt.paidAmount
  );
}

/**
 * Calculates the complete amount payable or receivable.
 *
 * Priority:
 * 1. totalAmount
 * 2. originalAmount
 */
export function calculateTotalDebtAmount(
  debt
) {
  if (!debt) {
    return 0;
  }

  const totalAmount =
    getPositiveDebtNumber(
      debt.totalAmount
    );

  if (totalAmount > 0) {
    return totalAmount;
  }

  return getPositiveDebtNumber(
    debt.originalAmount
  );
}

/**
 * Calculates the amount still remaining.
 */
export function calculateRemainingAmount(
  debt
) {
  const totalAmount =
    calculateTotalDebtAmount(
      debt
    );

  const paidAmount =
    calculatePaidAmount(debt);

  return Math.max(
    totalAmount - paidAmount,
    0
  );
}

/**
 * Calculates progress percentage.
 */
export function calculateDebtProgress(
  debt
) {
  const totalAmount =
    calculateTotalDebtAmount(
      debt
    );

  const paidAmount =
    calculatePaidAmount(debt);

  if (totalAmount <= 0) {
    return 0;
  }

  return Math.min(
    Math.max(
      Math.round(
        (paidAmount /
          totalAmount) *
          100
      ),
      0
    ),
    100
  );
}

/* =========================================================
   INSTALLMENT CALCULATIONS
========================================================= */

/**
 * Calculates completed installments.
 */
export function calculateCompletedInstallments(
  debt
) {
  const installmentAmount =
    getPositiveDebtNumber(
      debt?.installmentAmount
    );

  const paidAmount =
    calculatePaidAmount(debt);

  if (installmentAmount <= 0) {
    return 0;
  }

  return Math.floor(
    paidAmount /
      installmentAmount
  );
}

/**
 * Calculates remaining installments.
 */
export function calculateRemainingInstallments(
  debt
) {
  const totalInstallments =
    getPositiveDebtNumber(
      debt?.totalInstallments
    );

  if (
    totalInstallments <= 0
  ) {
    return 0;
  }

  const completedInstallments =
    calculateCompletedInstallments(
      debt
    );

  return Math.max(
    totalInstallments -
      completedInstallments,
    0
  );
}

/* =========================================================
   STATUS CALCULATIONS
========================================================= */

/**
 * Returns true when a debt has been completely paid.
 */
export function isDebtCompleted(
  debt
) {
  const totalAmount =
    calculateTotalDebtAmount(
      debt
    );

  const remainingAmount =
    calculateRemainingAmount(
      debt
    );

  return (
    totalAmount > 0 &&
    remainingAmount <= 0
  );
}

/**
 * Returns true when a debt is overdue.
 */
export function isDebtOverdue(
  debt
) {
  if (
    !debt ||
    isDebtCompleted(debt)
  ) {
    return false;
  }

  const daysUntilDue =
    getDaysUntilDue(
      debt.nextDueDate
    );

  return (
    daysUntilDue !== null &&
    daysUntilDue < 0
  );
}

/**
 * Returns true when a debt is due today.
 */
export function isDebtDueToday(
  debt
) {
  if (
    !debt ||
    isDebtCompleted(debt)
  ) {
    return false;
  }

  return (
    getDaysUntilDue(
      debt.nextDueDate
    ) === 0
  );
}

/**
 * Returns true when a debt is due soon.
 */
export function isDebtDueSoon(
  debt,
  numberOfDays = 7
) {
  if (
    !debt ||
    isDebtCompleted(debt)
  ) {
    return false;
  }

  const daysUntilDue =
    getDaysUntilDue(
      debt.nextDueDate
    );

  return (
    daysUntilDue !== null &&
    daysUntilDue >= 0 &&
    daysUntilDue <=
      numberOfDays
  );
}

/**
 * Creates the final status for a debt.
 */
export function calculateDebtStatus(
  debt
) {
  if (!debt) {
    return "active";
  }

  if (isDebtCompleted(debt)) {
    return "completed";
  }

  if (isDebtOverdue(debt)) {
    return "overdue";
  }

  const paidAmount =
    calculatePaidAmount(debt);

  if (paidAmount > 0) {
    return "partially-paid";
  }

  if (
    isDebtDueSoon(debt, 7)
  ) {
    return "upcoming";
  }

  return "active";
}

/**
 * Converts the status into readable text.
 */
export function getDebtStatusLabel(
  status
) {
  const labels = {
    active: "Active",
    upcoming: "Upcoming",
    overdue: "Overdue",
    "partially-paid":
      "Partially Paid",
    completed: "Completed",
  };

  return (
    labels[status] ||
    "Active"
  );
}

/* =========================================================
   PAYMENT DATE CALCULATION
========================================================= */

/**
 * Adds one payment period to a date.
 */
export function getNextDebtDueDate(
  currentDueDate,
  frequency = "monthly"
) {
  const date =
    getSafeDebtDate(
      currentDueDate
    ) || new Date();

  const normalizedFrequency =
    String(frequency)
      .trim()
      .toLowerCase();

  switch (
    normalizedFrequency
  ) {
    case "weekly":
      date.setDate(
        date.getDate() + 7
      );
      break;

    case "biweekly":
      date.setDate(
        date.getDate() + 14
      );
      break;

    case "quarterly":
      date.setMonth(
        date.getMonth() + 3
      );
      break;

    case "yearly":
      date.setFullYear(
        date.getFullYear() + 1
      );
      break;

    case "monthly":
    default:
      date.setMonth(
        date.getMonth() + 1
      );
      break;
  }

  return formatDebtDateInput(date);
}

/* =========================================================
   NORMALIZE DEBT
========================================================= */

/**
 * Creates a safe debt object.
 *
 * This protects the UI from:
 * undefined amounts
 * missing arrays
 * missing statuses
 * invalid directions
 */
export function normalizeDebtRecord(
  debt
) {
  const safeDebt =
    debt || {};

  const type =
    safeDebt.type || "loan";

  const direction =
    safeDebt.direction ||
    getDebtDirection(type);

  const originalAmount =
    getPositiveDebtNumber(
      safeDebt.originalAmount
    );

  const totalAmount =
    getPositiveDebtNumber(
      safeDebt.totalAmount
    ) || originalAmount;

  const paidAmount =
    calculatePaidAmount({
      ...safeDebt,
      totalAmount,
    });

  const remainingAmount =
    Math.max(
      totalAmount -
        paidAmount,
      0
    );

  const normalizedDebt = {
    ...safeDebt,

    id:
      safeDebt.id ||
      `debt-${Date.now()}`,

    type,
    direction,

    title:
      safeDebt.title ||
      getDebtTypeLabel(type),

    partyName:
      safeDebt.partyName || "",

    originalAmount,
    totalAmount,
    paidAmount,
    remainingAmount,

    installmentAmount:
      getPositiveDebtNumber(
        safeDebt.installmentAmount
      ),

    interestRate:
      getPositiveDebtNumber(
        safeDebt.interestRate
      ),

    totalInstallments:
      getPositiveDebtNumber(
        safeDebt.totalInstallments
      ),

    frequency:
      safeDebt.frequency ||
      "monthly",

    startDate:
      formatDebtDateInput(
        safeDebt.startDate
      ),

    nextDueDate:
      formatDebtDateInput(
        safeDebt.nextDueDate
      ),

    reminderDays:
      getPositiveDebtNumber(
        safeDebt.reminderDays
      ) || 3,

    notes:
      safeDebt.notes || "",

    payments:
      Array.isArray(
        safeDebt.payments
      )
        ? safeDebt.payments
        : [],

    createdAt:
      safeDebt.createdAt ||
      new Date().toISOString(),

    updatedAt:
      safeDebt.updatedAt ||
      new Date().toISOString(),
  };

  normalizedDebt.progress =
    calculateDebtProgress(
      normalizedDebt
    );

  normalizedDebt.completedInstallments =
    calculateCompletedInstallments(
      normalizedDebt
    );

  normalizedDebt.remainingInstallments =
    calculateRemainingInstallments(
      normalizedDebt
    );

  normalizedDebt.status =
    calculateDebtStatus(
      normalizedDebt
    );

  return normalizedDebt;
}

/* =========================================================
   SUMMARY CALCULATIONS
========================================================= */

/**
 * Calculates complete Debt Center statistics.
 */
export function calculateDebtSummary(
  debts
) {
  const records =
    Array.isArray(debts)
      ? debts.map(
          normalizeDebtRecord
        )
      : [];

  return records.reduce(
    (summary, debt) => {
      const remainingAmount =
        calculateRemainingAmount(
          debt
        );

      const installmentAmount =
        getPositiveDebtNumber(
          debt.installmentAmount
        );

      const isCompleted =
        debt.status ===
        "completed";

      const isOverdue =
        debt.status ===
        "overdue";

      if (
        debt.direction ===
        "receivable"
      ) {
        summary.totalReceivable +=
          remainingAmount;
      } else {
        summary.totalPayable +=
          remainingAmount;
      }

      if (!isCompleted) {
        summary.activeRecords += 1;
      }

      if (isCompleted) {
        summary.completedRecords += 1;
      }

      if (isOverdue) {
        summary.overdueRecords += 1;
        summary.overdueAmount +=
          installmentAmount > 0
            ? Math.min(
                installmentAmount,
                remainingAmount
              )
            : remainingAmount;
      }

      if (
        !isCompleted &&
        isDebtDueSoon(debt, 30)
      ) {
        summary.dueThisMonth +=
          installmentAmount > 0
            ? Math.min(
                installmentAmount,
                remainingAmount
              )
            : remainingAmount;
      }

      summary.totalPaid +=
        calculatePaidAmount(debt);

      return summary;
    },
    {
      totalPayable: 0,
      totalReceivable: 0,
      dueThisMonth: 0,
      overdueAmount: 0,
      totalPaid: 0,
      activeRecords: 0,
      completedRecords: 0,
      overdueRecords: 0,
      totalRecords:
        records.length,
    }
  );
}

/* =========================================================
   SORTING
========================================================= */

/**
 * Sorts debts by the closest due date.
 *
 * Overdue items appear first.
 * Records without due dates appear last.
 */
export function sortDebtsByDueDate(
  debts
) {
  const records =
    Array.isArray(debts)
      ? [...debts]
      : [];

  return records.sort(
    (first, second) => {
      const firstDate =
        getSafeDebtDate(
          first.nextDueDate
        );

      const secondDate =
        getSafeDebtDate(
          second.nextDueDate
        );

      if (
        !firstDate &&
        !secondDate
      ) {
        return 0;
      }

      if (!firstDate) {
        return 1;
      }

      if (!secondDate) {
        return -1;
      }

      return (
        firstDate.getTime() -
        secondDate.getTime()
      );
    }
  );
}

/**
 * Returns the closest active payment.
 */
export function getNextDebtPayment(
  debts
) {
  const activeDebts =
    Array.isArray(debts)
      ? debts.filter(
          (debt) =>
            !isDebtCompleted(debt)
        )
      : [];

  return (
    sortDebtsByDueDate(
      activeDebts
    )[0] || null
  );
}