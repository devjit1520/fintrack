import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function ExportAnalytics({ analyticsRef }) {
  const { transactions } = useFinance();

  const exportCSV = () => {
    if (!transactions.length) {
      alert("No transactions available.");
      return;
    }

    const header = [
      "Title",
      "Category",
      "Type",
      "Amount",
      "Date",
    ];

    const rows = transactions.map((t) => [
      t.title,
      t.category,
      t.type,
      t.amount,
      t.date,
    ]);

    const csv = [
      header.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "FinTrack_Report.csv";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  const exportPDF = async () => {
    try {
      const page = analyticsRef?.current;

      if (!page) {
        alert("Analytics page not found.");
        return;
      }

      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0f172a",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();

      const pdfHeight =
        (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      pdf.save("FinTrack_Analytics.pdf");
    } catch (err) {
      console.error(err);
      alert("Failed to export PDF.");
    }
  };

  const printReport = () => {
    window.print();
  };

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Export Reports
      </h2>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={exportCSV}
          className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:scale-105"
        >
          📄 Export CSV
        </button>

        <button
          onClick={exportPDF}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:scale-105"
        >
          📑 Export PDF
        </button>

        <button
          onClick={printReport}
          className="rounded-xl bg-slate-700 px-6 py-3 font-semibold text-white transition hover:scale-105"
        >
          🖨 Print Report
        </button>
      </div>
    </Card>
  );
}

export default ExportAnalytics;