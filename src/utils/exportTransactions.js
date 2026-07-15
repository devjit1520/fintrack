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

export function exportTransactionsToCsv(
  transactions = []
) {
  if (!Array.isArray(transactions)) {
    return {
      success: false,
      error:
        "Invalid transaction data.",
    };
  }

  if (transactions.length === 0) {
    return {
      success: false,
      error:
        "No transactions are available to export.",
    };
  }

  const headers = [
    "Title",
    "Amount",
    "Type",
    "Category",
    "Date",
    "Note",
  ];

  const rows = transactions.map(
    (transaction) => [
      transaction.title || "",
      Number(transaction.amount) || 0,
      transaction.type || "",
      transaction.category || "Other",
      transaction.date || "",
      transaction.note || "",
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

  const blob = new Blob(
    [`\uFEFF${csvContent}`],
    {
      type:
        "text/csv;charset=utf-8;",
    }
  );

  const fileUrl =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = fileUrl;

  link.download =
    `fintrack-transactions-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

  document.body.appendChild(link);

  link.click();
  link.remove();

  URL.revokeObjectURL(fileUrl);

  return {
    success: true,
  };
}