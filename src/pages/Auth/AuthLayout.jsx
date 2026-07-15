import { Outlet } from "react-router-dom";
import {
  ChartNoAxesCombined,
  PiggyBank,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

const features = [
  {
    icon: WalletCards,
    title: "Track everything",
    description:
      "Manage income, expenses, budgets and goals.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Understand your finances",
    description:
      "View clear financial analytics and reports.",
  },
  {
    icon: PiggyBank,
    title: "Build better habits",
    description:
      "Create saving goals and monitor progress.",
  },
  {
    icon: ShieldCheck,
    title: "Your private dashboard",
    description:
      "Every account receives its own secure data.",
  },
];

function AuthLayout() {
  return (
    <div
      className="
        min-h-screen
        bg-slate-100
        text-slate-900
        dark:bg-slate-950
        dark:text-white
      "
    >
      <div className="grid min-h-screen lg:grid-cols-2">
        <section
          className="
            relative
            hidden
            overflow-hidden
            bg-slate-950
            p-12
            text-white
            lg:flex
            lg:flex-col
            lg:justify-between
          "
        >
          <div
            className="
              absolute
              -left-32
              -top-32
              h-96
              w-96
              rounded-full
              bg-cyan-500/20
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -bottom-40
              -right-32
              h-[430px]
              w-[430px]
              rounded-full
              bg-blue-600/20
              blur-3xl
            "
          />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-cyan-500
                  font-bold
                  text-slate-950
                "
              >
                FT
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  FinTrack Pro
                </h1>

                <p className="text-sm text-slate-400">
                  Personal finance dashboard
                </p>
              </div>
            </div>

            <div className="mt-20 max-w-xl">
              <p
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  text-cyan-400
                "
              >
                Smarter money management
              </p>

              <h2
                className="
                  mt-5
                  text-5xl
                  font-bold
                  leading-tight
                "
              >
                Take control of your financial future.
              </h2>

              <p
                className="
                  mt-6
                  text-lg
                  leading-8
                  text-slate-400
                "
              >
                Track spending, manage budgets, build
                savings and understand your financial
                progress from one modern dashboard.
              </p>
            </div>
          </div>

          <div
            className="
              relative
              z-10
              grid
              gap-4
              xl:grid-cols-2
            "
          >
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    p-5
                    backdrop-blur-xl
                  "
                >
                  <Icon
                    size={22}
                    className="text-cyan-400"
                  />

                  <h3 className="mt-4 font-semibold">
                    {feature.title}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-slate-400
                    "
                  >
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section
          className="
            flex
            min-h-screen
            items-center
            justify-center
            p-5
            sm:p-8
            lg:p-12
          "
        >
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-cyan-500
                  font-bold
                  text-slate-950
                "
              >
                FT
              </div>

              <div>
                <h1 className="font-bold">
                  FinTrack Pro
                </h1>

                <p className="text-xs text-slate-500">
                  Personal finance dashboard
                </p>
              </div>
            </div>

            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}

export default AuthLayout;