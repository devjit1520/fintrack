import { Wallet } from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center gap-3 p-5">

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg">
        <Wallet size={26} className="text-white" />
      </div>

      <div>
        <h1 className="text-xl font-bold text-white">
          FinTrack
        </h1>

        <p className="text-xs text-slate-400">
          Personal Finance
        </p>
      </div>

    </div>
  );
}

export default Logo; 