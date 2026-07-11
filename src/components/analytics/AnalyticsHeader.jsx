import { BarChart3 } from "lucide-react";

function AnalyticsHeader() {
  return (
    <div className="flex items-center justify-between">

      <div>

        <h1 className="flex items-center gap-3 text-4xl font-bold text-white">

          <BarChart3
            size={34}
            className="text-cyan-400"
          />

          Analytics

        </h1>

        <p className="mt-2 text-slate-400">
          Track your financial performance
        </p>

      </div>

    </div>
  );
}

export default AnalyticsHeader;