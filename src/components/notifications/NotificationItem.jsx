import {
  CheckCircle,
  AlertTriangle,
  Wallet,
} from "lucide-react";

function NotificationItem({ item }) {
  const Icon =
    item.type === "warning"
      ? AlertTriangle
      : item.type === "success"
      ? CheckCircle
      : Wallet;

  return (
    <div className="flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4">

      <Icon
        size={22}
        className="mt-1 text-cyan-400"
      />

      <div>

        <h3 className="font-semibold">
          {item.title}
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          {item.message}
        </p>

      </div>

    </div>
  );
}

export default NotificationItem;