import { WalletCards } from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center gap-3 border-b border-slate-800 p-6">

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg">

        <WalletCards className="text-white" size={26} />

      </div>

      <div>

        <h1 className="text-xl font-bold">
          FinTrack
        </h1>

        <p className="text-sm text-slate-400">
          Personal Finance
        </p>

      </div>

    </div>
  );
}

export default Logo;