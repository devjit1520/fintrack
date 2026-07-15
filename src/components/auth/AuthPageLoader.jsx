import { WalletCards } from "lucide-react";

function AuthPageLoader({
  message = "Loading your account...",
}) {
  return (
    <div
      className="
        fixed
        inset-0
        z-[200]
        flex
        min-h-screen
        items-center
        justify-center
        bg-slate-100
        px-4
        dark:bg-slate-950
      "
    >
      <div className="text-center">
        <div
          className="
            relative
            mx-auto
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-3xl
            bg-cyan-500
            text-white
            shadow-2xl
            shadow-cyan-500/20
          "
        >
          <WalletCards size={34} />

          <span
            className="
              absolute
              inset-[-8px]
              animate-spin
              rounded-[28px]
              border-2
              border-transparent
              border-t-cyan-400
            "
          />
        </div>

        <h2
          className="
            mt-7
            text-xl
            font-bold
            text-slate-900
            dark:text-white
          "
        >
          FinTrack Pro
        </h2>

        <p
          className="
            mt-2
            text-sm
            text-slate-500
            dark:text-slate-400
          "
        >
          {message}
        </p>
      </div>
    </div>
  );
}

export default AuthPageLoader;