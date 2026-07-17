import { Wallet } from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center gap-3  border-slate-200 dark:border-slate-800 p-5">

      {/* Logo Icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 shadow-lg shadow-cyan-500/30">

        <Wallet
          size={26}
          className="text-white"
        />

      </div>

      {/* Logo Text */}
      <div>

        <h1 className="text-xl font-extrabold tracking-wide text-slate-900 dark:text-white">
          FinTrack
        </h1>

        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Personal Finance Manager
        </p>

      </div>

    </div>
  );
}

export default Logo;