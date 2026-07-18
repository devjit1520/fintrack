import { WalletCards } from "lucide-react";

function PageLoader() {
  return (
    <div
      className="
        flex
        min-h-dvh
        items-center
        justify-center
        bg-slate-50
        px-4
        transition-colors
        dark:bg-[#020617]
      "
    >
      <div className="text-center">
        <div className="relative mx-auto h-20 w-20">
          <div
            className="
              absolute
              inset-0
              animate-ping
              rounded-3xl
              bg-cyan-500/20
            "
          />

          <div
            className="
              relative
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-3xl
              bg-gradient-to-br
              from-cyan-400
              via-blue-500
              to-violet-600
              text-white
              shadow-xl
              shadow-cyan-500/20
            "
          >
            <WalletCards size={32} />
          </div>
        </div>

        <h2
          className="
            mt-5
            text-xl
            font-black
            text-slate-950
            dark:text-white
          "
        >
          FinTrack
        </h2>

        <p
          className="
            mt-2
            text-sm
            text-slate-500
            dark:text-slate-400
          "
        >
          Loading your financial workspace...
        </p>

        <div
          className="
            mx-auto
            mt-5
            h-1.5
            w-40
            overflow-hidden
            rounded-full
            bg-slate-200
            dark:bg-slate-800
          "
        >
          <div
            className="
              h-full
              w-1/2
              animate-[loading_1.2s_ease-in-out_infinite]
              rounded-full
              bg-gradient-to-r
              from-cyan-400
              via-blue-500
              to-violet-500
            "
          />
        </div>
      </div>
    </div>
  );
}

export default PageLoader;