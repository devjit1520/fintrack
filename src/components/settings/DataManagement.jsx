import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Database,
  Download,
  Upload,
  Trash2,
  RotateCcw,
  FileSpreadsheet,
} from "lucide-react";

import useFinance from "../../hooks/useFinance";
import useBudget from "../../hooks/useBudget";
import useGoal from "../../hooks/useGoal";

function DataManagement() {
  const fileInput = useRef(null);

  const { transactions, setTransactions } = useFinance();
  const { budgets, setBudgets } = useBudget();
  const { goals, setGoals } = useGoal();

  const backupJSON = () => {
    const data = {
      transactions,
      budgets,
      goals,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "FinTrack_Backup.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    if (!transactions.length) {
      alert("No transactions found.");
      return;
    }

    const headers = [
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
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "Transactions.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  const restoreBackup = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);

        setTransactions(data.transactions || []);
        setBudgets(data.budgets || []);
        setGoals(data.goals || []);

        alert("Backup restored successfully.");
      } catch {
        alert("Invalid backup file.");
      }
    };

    reader.readAsText(file);
  };

  const clearAll = () => {
    if (
      !window.confirm(
        "Delete ALL FinTrack data?"
      )
    )
      return;

    setTransactions([]);
    setBudgets([]);
    setGoals([]);

    localStorage.clear();

    alert("All data removed.");
  };

  const resetDemo = () => {
    if (
      !window.confirm(
        "Reset FinTrack?"
      )
    )
      return;

    window.location.reload();
  };

  const Button = ({
    icon: Icon,
    title,
    color,
    onClick,
  }) => (
    <motion.button
      whileHover={{
        scale: 1.03,
      }}
      whileTap={{
        scale: 0.97,
      }}
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-2xl ${color} p-5 text-white`}
    >
      <Icon size={24} />
      <span className="font-semibold">
        {title}
      </span>
    </motion.button>
  );

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >
      <div className="mb-8 flex items-center gap-3">
        <Database
          className="text-cyan-400"
          size={28}
        />

        <h2 className="text-2xl font-bold text-white">
          Data Management
        </h2>
      </div>

      <div className="space-y-4">

        <Button
          icon={Download}
          title="Backup JSON"
          color="bg-cyan-600"
          onClick={backupJSON}
        />

        <Button
          icon={FileSpreadsheet}
          title="Export CSV"
          color="bg-green-600"
          onClick={exportCSV}
        />

        <Button
          icon={Upload}
          title="Restore Backup"
          color="bg-blue-600"
          onClick={() =>
            fileInput.current.click()
          }
        />

        <Button
          icon={Trash2}
          title="Clear All Data"
          color="bg-red-600"
          onClick={clearAll}
        />

        <Button
          icon={RotateCcw}
          title="Reload App"
          color="bg-yellow-600"
          onClick={resetDemo}
        />

      </div>

      <input
        ref={fileInput}
        type="file"
        hidden
        accept=".json"
        onChange={restoreBackup}
      />
    </motion.div>
  );
}

export default DataManagement;