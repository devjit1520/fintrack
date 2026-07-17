import { motion } from "framer-motion";
import {
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  ArrowLeft,
  BarChart3,
  Goal,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react";

const features = [
  {
    icon: ReceiptText,
    title: "Track transactions",
    description: "Record and organize income and expenses.",
    gradient: "from-cyan-400/20 to-blue-500/10",
  },
  {
    icon: PiggyBank,
    title: "Control budgets",
    description: "Monitor spending across every category.",
    gradient: "from-violet-400/20 to-fuchsia-500/10",
  },
  {
    icon: Goal,
    title: "Reach your goals",
    description: "Track savings and financial milestones.",
    gradient: "from-emerald-400/20 to-cyan-500/10",
  },
  {
    icon: BarChart3,
    title: "View analytics",
    description: "Understand trends using visual reports.",
    gradient: "from-orange-400/20 to-rose-500/10",
  },
];

function AuthLayout() {
  const location = useLocation();

  const isRegisterPage =
    location.pathname === "/register";

  return (
    <main className="relative h-dvh overflow-hidden bg-[#020617] text-white">
      {/* Premium gradient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, 40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-52 -top-52 h-[600px] w-[600px] rounded-full bg-cyan-500/20 blur-[140px]"
        />

        <motion.div
          animate={{
            x: [0, -70, 0],
            y: [0, 70, 0],
            scale: [1.1, 0.95, 1.1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-52 top-[10%] h-[650px] w-[650px] rounded-full bg-violet-600/20 blur-[150px]"
        />

        <motion.div
          animate={{
            x: [0, 60, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-64 left-[30%] h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[150px]"
        />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:65px_65px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.88)_78%)]" />
      </div>

      <div className="relative z-10 grid h-full lg:grid-cols-[0.95fr_1.05fr]">
        {/* Left premium information section */}
        <section className="relative hidden h-full overflow-hidden border-r border-white/[0.08] lg:block">
          <div className="flex h-full flex-col px-10 py-8 xl:px-14">
            <header className="flex shrink-0 items-center justify-between">
              <Link
                to="/"
                className="group flex items-center gap-3"
              >
                <div className="relative">
                  <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-400/40 to-blue-500/40 blur-xl opacity-70" />

                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-500 text-slate-950 shadow-xl">
                    <WalletCards size={24} />
                  </div>
                </div>

                <div>
                  <h1 className="text-xl font-bold tracking-tight">
                    FinTrack Pro
                  </h1>

                  <p className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-[10px] font-semibold uppercase tracking-[0.25em] text-transparent">
                    Personal Finance
                  </p>
                </div>
              </Link>

              <Link
                to="/"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-400 backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-white/[0.08] hover:text-cyan-300"
              >
                <ArrowLeft size={16} />
                Home
              </Link>
            </header>

            <div className="flex min-h-0 flex-1 flex-col justify-center py-6">
              <motion.div
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 px-3.5 py-2 text-xs font-semibold text-cyan-300 backdrop-blur-xl">
                  <Sparkles size={14} />
                  Your smarter financial workspace
                </div>

                <h2 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight xl:text-5xl">
                  Manage your money with
                  <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                    clarity and confidence.
                  </span>
                </h2>

                <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
                  Track transactions, control budgets, create
                  savings goals, and understand your financial
                  journey through one premium dashboard.
                </p>
              </motion.div>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 24,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.15,
                }}
                className="mt-7 grid max-w-2xl grid-cols-2 gap-3"
              >
                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <article
                      key={feature.title}
                      className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.035] p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/25 hover:bg-white/[0.06]"
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition group-hover:opacity-100`}
                      />

                      <div className="relative flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-cyan-300 shadow-lg">
                          <Icon size={18} />
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold text-white">
                            {feature.title}
                          </h3>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </motion.div>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.25,
                }}
                className="relative mt-6 max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-400/[0.08] via-cyan-400/[0.06] to-blue-500/[0.08] px-4 py-3.5 backdrop-blur-xl"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-400/20 blur-3xl" />

                <div className="relative flex items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/10 text-emerald-300">
                      <TrendingUp size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        Build healthier financial habits
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Make decisions using clear financial data.
                      </p>
                    </div>
                  </div>

                  <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300 xl:flex">
                    <ShieldCheck size={14} />
                    Protected
                  </div>
                </div>
              </motion.div>
            </div>

            <footer className="flex shrink-0 items-center justify-between border-t border-white/[0.07] pt-5 text-xs text-slate-600">
              <p>© {new Date().getFullYear()} FinTrack Pro</p>

              <div className="flex items-center gap-2">
                <ShieldCheck size={13} />
                Secure Supabase authentication
              </div>
            </footer>
          </div>
        </section>

        {/* Right authentication section */}
        <section className="relative flex h-full min-h-0 items-center justify-center px-4 py-3 sm:px-6 lg:px-8 xl:px-12">
          {/* Mobile header */}
          <div className="absolute left-0 right-0 top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.08] bg-[#020617]/80 px-5 backdrop-blur-2xl lg:hidden">
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-500 text-slate-950">
                <WalletCards size={20} />
              </div>

              <div>
                <p className="font-bold">FinTrack Pro</p>

                <p className="text-[8px] uppercase tracking-[0.18em] text-cyan-400">
                  Personal Finance
                </p>
              </div>
            </Link>

            <Link
              to="/"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-400"
              aria-label="Return home"
            >
              <ArrowLeft size={18} />
            </Link>
          </div>

          <motion.div
            key={location.pathname}
            initial={{
              opacity: 0,
              y: 24,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className={`relative mt-16 w-full lg:mt-0 ${
              isRegisterPage
                ? "max-w-[740px]"
                : "max-w-[590px]"
            }`}
          >
            {/* Premium gradient border */}
            <div className="absolute -inset-[1px] rounded-[32px] bg-gradient-to-br from-cyan-400/70 via-blue-500/30 to-violet-500/60 opacity-80" />

            <div className="absolute -inset-7 rounded-[45px] bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-violet-500/15 blur-3xl" />

            <div className="relative max-h-[calc(100dvh-24px)] overflow-hidden rounded-[31px] bg-[#03091a]/95 shadow-2xl shadow-black/50 backdrop-blur-3xl lg:max-h-[calc(100dvh-30px)]">
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cyan-400/[0.06] to-transparent" />

              <div
                className={`relative max-h-[calc(100dvh-26px)] px-5 py-5 sm:px-7 lg:max-h-[calc(100dvh-32px)] ${
                  isRegisterPage
                    ? "overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    : "overflow-hidden"
                }`}
              >
                <Outlet />
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

export default AuthLayout;