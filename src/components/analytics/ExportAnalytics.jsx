import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  CalendarDays,
  Check,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Printer,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

/* =========================================================
   FORMATTERS
========================================================= */

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function formatCurrency(value) {
  return currencyFormatter.format(
    Number(value) || 0
  );
}

function formatPercentage(value) {
  return `${Math.round(
    Number(value) || 0
  )}%`;
}

/* =========================================================
   DATE HELPERS
========================================================= */

function parseTransactionDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : value;
  }

  const dateText = String(value).slice(
    0,
    10
  );

  const parts = dateText
    .split("-")
    .map(Number);

  if (
    parts.length === 3 &&
    parts.every(Number.isFinite)
  ) {
    const [year, month, day] = parts;

    const parsedDate = new Date(
      year,
      month - 1,
      day
    );

    return Number.isNaN(
      parsedDate.getTime()
    )
      ? null
      : parsedDate;
  }

  const fallbackDate = new Date(value);

  return Number.isNaN(
    fallbackDate.getTime()
  )
    ? null
    : fallbackDate;
}

function formatDate(date) {
  if (!date) {
    return "";
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

function formatFileDate() {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================================================
   RANGE LABEL
========================================================= */

function getRangeLabel(
  range,
  startDate,
  endDate
) {
  if (range === "30d") {
    return "Last 30 days";
  }

  if (range === "3m") {
    return "Last 3 months";
  }

  if (range === "6m") {
    return "Last 6 months";
  }

  if (range === "1y") {
    return "Last year";
  }

  if (range === "custom") {
    if (startDate && endDate) {
      return `${startDate} to ${endDate}`;
    }

    return "Custom range";
  }

  return "All transactions";
}

/* =========================================================
   FILE HELPERS
========================================================= */

function escapeCsvValue(value) {
  const text = String(value ?? "");

  if (
    text.includes(",") ||
    text.includes('"') ||
    text.includes("\n")
  ) {
    return `"${text.replace(
      /"/g,
      '""'
    )}"`;
  }

  return text;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function downloadFile({
  content,
  filename,
  mimeType,
}) {
  const blob = new Blob([content], {
    type: mimeType,
  });

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
   EXPORT CARD
========================================================= */

function ExportOption({
  icon: Icon,
  title,
  description,
  badge,
  buttonLabel,
  onClick,
  loading,
  disabled,
}) {
  return (
    <motion.article
      whileHover={
        disabled
          ? undefined
          : {
              y: -4,
            }
      }
      transition={{
        duration: 0.2,
      }}
      className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition hover:border-cyan-500/30 dark:border-white/10 dark:bg-white/[0.035]"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>

            {badge && (
              <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-violet-500">
                {badge}
              </span>
            )}
          </div>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-500/30 hover:bg-cyan-500/5 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.045] dark:text-slate-200 dark:hover:text-cyan-400"
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
        ) : (
          <Download size={14} />
        )}

        {buttonLabel}
      </button>
    </motion.article>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon: Icon,
  label,
  value,
  valueClassName = "",
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p
          className={`mt-1 truncate text-base font-bold text-slate-900 dark:text-white ${valueClassName}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function ExportAnalytics({
  transactions:
    filteredTransactions,
  range = "all",
  startDate = "",
  endDate = "",
}) {
  const finance = useFinance() || {};

  const contextTransactions =
    Array.isArray(finance.transactions)
      ? finance.transactions
      : [];

  const transactions = Array.isArray(
    filteredTransactions
  )
    ? filteredTransactions
    : contextTransactions;

  const [activeExport, setActiveExport] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const analyticsData = useMemo(() => {
    const normalizedTransactions = (
      Array.isArray(transactions)
        ? transactions
        : []
    )
      .map(
        (transaction, index) => {
          const rawType = String(
            transaction.type || ""
          ).toLowerCase();

          const type =
            rawType === "income"
              ? "income"
              : "expense";

          const parsedDate =
            parseTransactionDate(
              transaction.date ||
                transaction.createdAt ||
                transaction.updatedAt
            );

          return {
            id:
              transaction.id ||
              `transaction-${index}`,

            title:
              transaction.title ||
              transaction.name ||
              "Untitled transaction",

            category:
              transaction.category ||
              "Other",

            note:
              transaction.note ||
              transaction.description ||
              "",

            type,

            amount: Math.abs(
              Number(
                transaction.amount
              ) || 0
            ),

            date: parsedDate,

            dateLabel:
              formatDate(parsedDate),

            timestamp:
              parsedDate?.getTime() ||
              0,
          };
        }
      )
      .filter(
        (transaction) =>
          transaction.amount > 0
      )
      .sort(
        (first, second) =>
          second.timestamp -
          first.timestamp
      );

    const income =
      normalizedTransactions
        .filter(
          (transaction) =>
            transaction.type ===
            "income"
        )
        .reduce(
          (total, transaction) =>
            total +
            transaction.amount,
          0
        );

    const expense =
      normalizedTransactions
        .filter(
          (transaction) =>
            transaction.type ===
            "expense"
        )
        .reduce(
          (total, transaction) =>
            total +
            transaction.amount,
          0
        );

    const balance = income - expense;

    const savingsRate =
      income > 0
        ? (balance / income) * 100
        : 0;

    return {
      transactions:
        normalizedTransactions,

      transactionCount:
        normalizedTransactions.length,

      income,
      expense,
      balance,
      savingsRate,
    };
  }, [transactions]);

  const rangeLabel = getRangeLabel(
    range,
    startDate,
    endDate
  );

  const hasTransactions =
    analyticsData.transactionCount > 0;

  function showMessage(message) {
    setSuccessMessage(message);

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 2500);
  }

  function runExport(
    exportType,
    callback
  ) {
    if (!hasTransactions) {
      showMessage(
        "No transactions available to export."
      );

      return;
    }

    setActiveExport(exportType);

    try {
      callback();

      showMessage(
        `${exportType} export completed.`
      );
    } catch (error) {
      console.error(
        `${exportType} export failed:`,
        error
      );

      showMessage(
        "Export failed. Please try again."
      );
    } finally {
      window.setTimeout(() => {
        setActiveExport("");
      }, 400);
    }
  }

  /* =======================================================
     CSV EXPORT
  ======================================================= */

  function handleCsvExport() {
    runExport("CSV", () => {
      const headers = [
        "Date",
        "Type",
        "Title",
        "Category",
        "Amount",
        "Note",
      ];

      const rows =
        analyticsData.transactions.map(
          (transaction) => [
            transaction.dateLabel,
            transaction.type,
            transaction.title,
            transaction.category,
            transaction.amount.toFixed(
              2
            ),
            transaction.note,
          ]
        );

      const csvContent = [
        headers,
        ...rows,
      ]
        .map((row) =>
          row
            .map(escapeCsvValue)
            .join(",")
        )
        .join("\n");

      downloadFile({
        content: `\uFEFF${csvContent}`,

        filename: `fintrack-analytics-${formatFileDate()}.csv`,

        mimeType:
          "text/csv;charset=utf-8",
      });
    });
  }

  /* =======================================================
     JSON EXPORT
  ======================================================= */

  function handleJsonExport() {
    runExport("JSON", () => {
      const report = {
        reportName:
          "FinTrack Analytics Report",

        generatedAt:
          new Date().toISOString(),

        selectedRange: {
          range,
          label: rangeLabel,
          startDate:
            startDate || null,
          endDate:
            endDate || null,
        },

        summary: {
          transactionCount:
            analyticsData.transactionCount,

          income:
            analyticsData.income,

          expense:
            analyticsData.expense,

          balance:
            analyticsData.balance,

          savingsRate: Number(
            analyticsData.savingsRate.toFixed(
              2
            )
          ),
        },

        transactions:
          analyticsData.transactions.map(
            (transaction) => ({
              id: transaction.id,

              date:
                transaction.date?.toISOString() ||
                null,

              type: transaction.type,

              title:
                transaction.title,

              category:
                transaction.category,

              amount:
                transaction.amount,

              note: transaction.note,
            })
          ),
      };

      downloadFile({
        content: JSON.stringify(
          report,
          null,
          2
        ),

        filename: `fintrack-analytics-${formatFileDate()}.json`,

        mimeType:
          "application/json;charset=utf-8",
      });
    });
  }

  /* =======================================================
     TEXT EXPORT
  ======================================================= */

  function handleTextExport() {
    runExport("Summary", () => {
      const transactionLines =
        analyticsData.transactions
          .map(
            (
              transaction,
              index
            ) => {
              return [
                `${index + 1}.`,
                transaction.dateLabel ||
                  "Unknown date",
                transaction.type.toUpperCase(),
                transaction.title,
                transaction.category,
                formatCurrency(
                  transaction.amount
                ),
                transaction.note,
              ]
                .filter(Boolean)
                .join(" | ");
            }
          )
          .join("\n");

      const report = `
FINTRACK ANALYTICS REPORT
=========================

Generated: ${new Date().toLocaleString(
        "en-IN"
      )}

Selected period: ${rangeLabel}

FINANCIAL SUMMARY
-----------------
Transactions: ${
        analyticsData.transactionCount
      }
Income: ${formatCurrency(
        analyticsData.income
      )}
Expenses: ${formatCurrency(
        analyticsData.expense
      )}
Balance: ${formatCurrency(
        analyticsData.balance
      )}
Savings rate: ${formatPercentage(
        analyticsData.savingsRate
      )}

TRANSACTIONS
------------
${transactionLines}
      `.trim();

      downloadFile({
        content: report,

        filename: `fintrack-summary-${formatFileDate()}.txt`,

        mimeType:
          "text/plain;charset=utf-8",
      });
    });
  }

  /* =======================================================
     PRINT REPORT
  ======================================================= */

  function handlePrintReport() {
    if (!hasTransactions) {
      showMessage(
        "No transactions available to print."
      );

      return;
    }

    setActiveExport("PDF");

    const transactionRows =
      analyticsData.transactions
        .map(
          (transaction) => `
            <tr>
              <td>
                ${escapeHtml(
                  transaction.dateLabel ||
                    "Unknown"
                )}
              </td>

              <td class="${
                transaction.type
              }">
                ${escapeHtml(
                  transaction.type
                )}
              </td>

              <td>
                ${escapeHtml(
                  transaction.title
                )}
              </td>

              <td>
                ${escapeHtml(
                  transaction.category
                )}
              </td>

              <td>
                ${escapeHtml(
                  formatCurrency(
                    transaction.amount
                  )
                )}
              </td>
            </tr>
          `
        )
        .join("");

    const printWindow = window.open(
      "",
      "_blank",
      "width=1100,height=800"
    );

    if (!printWindow) {
      setActiveExport("");

      showMessage(
        "Please allow pop-ups to print the report."
      );

      return;
    }

    printWindow.document.write(`
      <!doctype html>

      <html lang="en">
        <head>
          <meta charset="UTF-8" />

          <title>
            FinTrack Analytics Report
          </title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 40px;
              color: #0f172a;
              background: #ffffff;
              font-family:
                Arial,
                sans-serif;
            }

            .report {
              max-width: 1100px;
              margin: 0 auto;
            }

            .header {
              display: flex;
              justify-content: space-between;
              gap: 24px;
              padding-bottom: 24px;
              border-bottom: 2px solid #e2e8f0;
            }

            h1 {
              margin: 0;
              font-size: 28px;
            }

            .subtitle {
              margin-top: 8px;
              color: #64748b;
              font-size: 14px;
            }

            .generated {
              color: #64748b;
              font-size: 12px;
              text-align: right;
            }

            .summary {
              display: grid;
              grid-template-columns:
                repeat(4, 1fr);
              gap: 14px;
              margin-top: 28px;
            }

            .summary-card {
              padding: 16px;
              border: 1px solid #e2e8f0;
              border-radius: 14px;
              background: #f8fafc;
            }

            .label {
              color: #64748b;
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
            }

            .value {
              margin-top: 8px;
              font-size: 19px;
              font-weight: 800;
            }

            table {
              width: 100%;
              margin-top: 30px;
              border-collapse: collapse;
              font-size: 12px;
            }

            th,
            td {
              padding: 11px;
              border-bottom: 1px solid #e2e8f0;
              text-align: left;
            }

            th {
              background: #f8fafc;
              color: #475569;
              font-size: 10px;
              text-transform: uppercase;
            }

            .income {
              color: #059669;
              font-weight: 700;
            }

            .expense {
              color: #e11d48;
              font-weight: 700;
            }

            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>

        <body>
          <main class="report">
            <header class="header">
              <div>
                <h1>
                  FinTrack Analytics Report
                </h1>

                <p class="subtitle">
                  ${escapeHtml(
                    rangeLabel
                  )}
                </p>
              </div>

              <div class="generated">
                Generated on<br />

                ${escapeHtml(
                  new Date().toLocaleString(
                    "en-IN"
                  )
                )}
              </div>
            </header>

            <section class="summary">
              <div class="summary-card">
                <div class="label">
                  Income
                </div>

                <div class="value">
                  ${escapeHtml(
                    formatCurrency(
                      analyticsData.income
                    )
                  )}
                </div>
              </div>

              <div class="summary-card">
                <div class="label">
                  Expenses
                </div>

                <div class="value">
                  ${escapeHtml(
                    formatCurrency(
                      analyticsData.expense
                    )
                  )}
                </div>
              </div>

              <div class="summary-card">
                <div class="label">
                  Balance
                </div>

                <div class="value">
                  ${escapeHtml(
                    formatCurrency(
                      analyticsData.balance
                    )
                  )}
                </div>
              </div>

              <div class="summary-card">
                <div class="label">
                  Savings rate
                </div>

                <div class="value">
                  ${escapeHtml(
                    formatPercentage(
                      analyticsData.savingsRate
                    )
                  )}
                </div>
              </div>
            </section>

            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                ${transactionRows}
              </tbody>
            </table>
          </main>

          <script>
            window.addEventListener(
              "load",
              function () {
                window.print();
              }
            );
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();

    window.setTimeout(() => {
      setActiveExport("");

      showMessage(
        "Print report opened."
      );
    }, 500);
  }

  const balanceClassName =
    analyticsData.balance >= 0
      ? "!text-emerald-600 dark:!text-emerald-400"
      : "!text-rose-600 dark:!text-rose-400";

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {/* Background decoration */}

        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative">
          {/* Header */}

          <div className="flex flex-col gap-5 border-b border-slate-200 pb-5 dark:border-white/10 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-cyan-500">
                <Download size={21} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Export Analytics
                  </h2>

                  <span className="flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-violet-500">
                    <Sparkles size={10} />

                    Premium
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Download, back up or print
                  financial data from the
                  selected analytics period.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
              <CalendarDays
                size={15}
                className="text-cyan-500"
              />

              {rangeLabel}
            </div>
          </div>

          {/* Report summary */}

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <SummaryCard
              icon={ReceiptText}
              label="Records"
              value={
                analyticsData.transactionCount
              }
            />

            <SummaryCard
              icon={WalletCards}
              label="Balance"
              value={formatCurrency(
                analyticsData.balance
              )}
              valueClassName={
                balanceClassName
              }
            />

            <SummaryCard
              icon={ShieldCheck}
              label="Savings rate"
              value={formatPercentage(
                analyticsData.savingsRate
              )}
            />
          </div>

          {/* Export options */}

          <div className="mt-5 grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ExportOption
              icon={FileSpreadsheet}
              title="CSV Spreadsheet"
              description="Use with Excel or Google Sheets."
              badge="Popular"
              buttonLabel="Download CSV"
              onClick={handleCsvExport}
              disabled={!hasTransactions}
              loading={
                activeExport === "CSV"
              }
            />

            <ExportOption
              icon={FileJson}
              title="JSON Backup"
              description="Structured backup for migration and development."
              buttonLabel="Download JSON"
              onClick={handleJsonExport}
              disabled={!hasTransactions}
              loading={
                activeExport === "JSON"
              }
            />

            <ExportOption
              icon={FileText}
              title="Text Summary"
              description="Simple readable financial report."
              buttonLabel="Download Summary"
              onClick={handleTextExport}
              disabled={!hasTransactions}
              loading={
                activeExport ===
                "Summary"
              }
            />

            <ExportOption
              icon={Printer}
              title="Printable Report"
              description="Print or save the report as a PDF."
              badge="PDF ready"
              buttonLabel="Print / Save PDF"
              onClick={handlePrintReport}
              disabled={!hasTransactions}
              loading={
                activeExport === "PDF"
              }
            />
          </div>

          {/* Footer status */}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck
                size={16}
                className="mt-0.5 shrink-0 text-emerald-500"
              />

              <span>
                Files are generated locally in
                your browser. Financial data
                is not uploaded.
              </span>
            </div>

            {successMessage && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 6,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="flex shrink-0 items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-400"
              >
                <Check size={14} />

                {successMessage}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ExportAnalytics;