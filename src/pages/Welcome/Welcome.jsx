import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  DatabaseBackup,
  Download,
  Fingerprint,
  Goal,
  LayoutDashboard,
  LockKeyhole,
  MoonStar,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  UserRound,
  WalletCards,
  Zap,
} from "lucide-react";

/* =========================================================
   PAGE DATA
========================================================= */

const mainFeatures = [
  {
    icon: ReceiptText,
    title: "Transaction Management",
    description:
      "Add, edit, delete, search, filter, and organize your income and expenses.",
  },
  {
    icon: PiggyBank,
    title: "Smart Budget Tracking",
    description:
      "Create category-based budgets and receive warnings before overspending.",
  },
  {
    icon: Goal,
    title: "Financial Goals",
    description:
      "Set savings targets, track progress, and stay focused on your deadlines.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Understand income, expenses, savings trends, and category performance.",
  },
  {
    icon: UserRound,
    title: "Personalized Profile",
    description:
      "Manage your profile, financial preferences, notifications, and currency.",
  },
  {
    icon: DatabaseBackup,
    title: "Backup and Restore",
    description:
      "Download your finance data and safely restore it whenever necessary.",
  },
];

const benefits = [
  "Track income and expenses",
  "Monitor your current balance",
  "Create category budgets",
  "Set and manage savings goals",
  "View interactive financial charts",
  "Export and back up your data",
  "Use dark and light themes",
  "Access protected user accounts",
];

const steps = [
  {
    number: "01",
    icon: UserRound,
    title: "Create your account",
    description:
      "Register securely and create your personal FinTrack Pro account.",
  },
  {
    number: "02",
    icon: ReceiptText,
    title: "Add financial records",
    description:
      "Start recording income, expenses, budgets, and savings goals.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Understand your progress",
    description:
      "Use dashboards and analytics to improve your financial decisions.",
  },
];

const dashboardStats = [
  {
    label: "Total balance",
    value: "₹84,500",
    icon: WalletCards,
    change: "+12.8%",
    positive: true,
  },
  {
    label: "Monthly income",
    value: "₹65,000",
    icon: TrendingUp,
    change: "+8.4%",
    positive: true,
  },
  {
    label: "Monthly expense",
    value: "₹32,400",
    icon: TrendingDown,
    change: "-4.2%",
    positive: false,
  },
];

/* =========================================================
   ANIMATION SETTINGS
========================================================= */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

/* =========================================================
   REUSABLE FEATURE CARD
========================================================= */

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.article
      variants={itemVariants}
      whileHover={{
        y: -6,
      }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-xl shadow-black/10 backdrop-blur-xl transition duration-300 hover:border-cyan-400/30 hover:bg-white/[0.07]"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl transition group-hover:bg-cyan-400/20" />

      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-950/30">
          <Icon size={22} />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-white">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          {description}
        </p>
      </div>
    </motion.article>
  );
}

/* =========================================================
   DASHBOARD PREVIEW
========================================================= */

function DashboardPreview() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 35,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.75,
        delay: 0.2,
        ease: "easeOut",
      }}
      className="relative"
    >
      <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-violet-500/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-[30px] border border-white/15 bg-slate-900/85 p-3 shadow-2xl shadow-cyan-950/40 backdrop-blur-2xl">
        <div className="rounded-[24px] border border-white/10 bg-slate-950/80">
          {/* Browser header */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-1.5 text-[10px] text-slate-500">
              fintrack-pro.app/dashboard
            </div>

            <MoonStar
              size={16}
              className="text-slate-500"
            />
          </div>

          <div className="grid min-h-[470px] grid-cols-[76px_1fr]">
            {/* Mini sidebar */}
            <aside className="border-r border-white/10 p-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950">
                <WalletCards size={21} />
              </div>

              <div className="mt-7 space-y-3">
                {[
                  LayoutDashboard,
                  ReceiptText,
                  PiggyBank,
                  Target,
                  BarChart3,
                ].map((Icon, index) => (
                  <div
                    key={index}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      index === 0
                        ? "bg-cyan-400/15 text-cyan-300"
                        : "text-slate-600"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                ))}
              </div>
            </aside>

            {/* Dashboard content */}
            <div className="min-w-0 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400">
                    Financial overview
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-white">
                    Welcome Fintrack Pro
                  </h3>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Here is your financial performance.
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-xs font-semibold text-cyan-300">
                  User
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {dashboardStats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                          <Icon size={15} />
                        </div>

                        <span
                          className={`text-[9px] font-medium ${
                            stat.positive
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }`}
                        >
                          {stat.change}
                        </span>
                      </div>

                      <p className="mt-3 text-[9px] text-slate-500">
                        {stat.label}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        {stat.value}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[1.4fr_0.8fr]">
                {/* Chart */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-white">
                        Income and expenses
                      </p>

                      <p className="mt-1 text-[9px] text-slate-500">
                        Last six months
                      </p>
                    </div>

                    <BarChart3
                      size={16}
                      className="text-cyan-300"
                    />
                  </div>

                  <div className="mt-6 flex h-28 items-end justify-between gap-2">
                    {[48, 72, 55, 84, 65, 94, 70, 88].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="flex h-full flex-1 items-end"
                        >
                          <div
                            className="w-full rounded-t-md bg-gradient-to-t from-cyan-500/25 to-cyan-300"
                            style={{
                              height: `${height}%`,
                            }}
                          />
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-3 flex justify-between text-[8px] text-slate-600">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                  </div>
                </div>

                {/* Budget progress */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-medium text-white">
                    Monthly budget
                  </p>

                  <div className="mt-5 flex justify-center">
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[conic-gradient(#22d3ee_0deg,#22d3ee_255deg,rgba(255,255,255,0.07)_255deg)]">
                      <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-slate-950">
                        <span className="text-base font-semibold text-white">
                          71%
                        </span>
                        <span className="text-[8px] text-slate-500">
                          used
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between text-[9px]">
                      <span className="text-slate-500">
                        Budget
                      </span>
                      <span className="text-white">
                        ₹45,000
                      </span>
                    </div>

                    <div className="flex justify-between text-[9px]">
                      <span className="text-slate-500">
                        Remaining
                      </span>
                      <span className="text-emerald-400">
                        ₹12,600
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent transaction */}
              <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                      <ReceiptText size={16} />
                    </div>

                    <div>
                      <p className="text-[10px] font-medium text-white">
                        Recent transaction
                      </p>

                      <p className="mt-0.5 text-[9px] text-slate-500">
                        Grocery shopping · Food
                      </p>
                    </div>
                  </div>

                  <p className="text-[10px] font-semibold text-rose-400">
                    - ₹2,450
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-4 top-20 hidden rounded-2xl border border-white/15 bg-slate-900/90 p-3 shadow-xl backdrop-blur-xl sm:block"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <TrendingUp size={16} />
          </div>

          <div>
            <p className="text-[9px] text-slate-500">
              Savings growth
            </p>
            <p className="text-xs font-semibold text-white">
              +18.4%
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{
          y: [0, 8, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-5 right-8 hidden rounded-2xl border border-white/15 bg-slate-900/90 p-3 shadow-xl backdrop-blur-xl sm:block"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <ShieldCheck size={16} />
          </div>

          <div>
            <p className="text-[9px] text-slate-500">
              Account status
            </p>
            <p className="text-xs font-semibold text-white">
              Protected
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   WELCOME PAGE
========================================================= */

function Welcome() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[120px]" />

        <div className="absolute right-[-180px] top-[15%] h-[480px] w-[480px] rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="absolute bottom-[-200px] left-[35%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[130px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:70px_70px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_78%)]" />
      </div>

      <div className="relative z-10">
        {/* =====================================================
            NAVBAR
        ====================================================== */}

        <header className="border-b border-white/10 bg-slate-950/60 backdrop-blur-2xl">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
            <Link
              to="/"
              className="flex items-center gap-3"
              aria-label="FinTrack Pro home"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20">
                <WalletCards size={23} />
              </div>

              <div>
                <p className="text-lg font-bold tracking-tight">
                  FinTrack Pro
                </p>

                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Personal Finance
                </p>
              </div>
            </Link>

            <div className="hidden items-center gap-7 text-sm text-slate-400 md:flex">
              <a
                href="#features"
                className="transition hover:text-cyan-300"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                className="transition hover:text-cyan-300"
              >
                How it works
              </a>

              <a
                href="#security"
                className="transition hover:text-cyan-300"
              >
                Security
              </a>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="group flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300"
              >
                <span className="hidden sm:inline">
                  Get started
                </span>

                <span className="sm:hidden">
                  Register
                </span>

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </nav>
        </header>

        {/* =====================================================
            HERO SECTION
        ====================================================== */}

        <section className="mx-auto grid min-h-[calc(100vh-78px)] max-w-7xl items-center gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.08] px-3.5 py-2 text-xs font-semibold text-cyan-300"
            >
              <Sparkles size={15} />
              A smarter way to manage your money
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mt-7 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Take complete control of your
              <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                financial future.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg"
            >
              FinTrack Pro brings your transactions, budgets,
              savings goals, financial analytics, and profile
              preferences together inside one secure and modern
              dashboard.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                to="/register"
                className="group flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-cyan-500 px-6 py-3.5 font-semibold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:shadow-cyan-400/30"
              >
                Create free account

                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.05] px-6 py-3.5 font-semibold text-white backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-white/[0.08]"
              >
                Login to dashboard
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-9 flex flex-wrap gap-x-6 gap-y-3"
            >
              {[
                "Secure authentication",
                "Responsive design",
                "No complicated setup",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-slate-400"
                >
                  <CheckCircle2
                    size={16}
                    className="text-emerald-400"
                  />

                  {item}
                </div>
              ))}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-10 grid max-w-xl grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.035] py-4 backdrop-blur-xl"
            >
              <div className="px-3 text-center">
                <p className="text-xl font-bold text-white sm:text-2xl">
                  6+
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500 sm:text-xs">
                  Core modules
                </p>
              </div>

              <div className="px-3 text-center">
                <p className="text-xl font-bold text-white sm:text-2xl">
                  100%
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500 sm:text-xs">
                  Responsive
                </p>
              </div>

              <div className="px-3 text-center">
                <p className="text-xl font-bold text-white sm:text-2xl">
                  24/7
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500 sm:text-xs">
                  Access
                </p>
              </div>
            </motion.div>
          </motion.div>

          <DashboardPreview />
        </section>

        {/* =====================================================
            TRUST STRIP
        ====================================================== */}

        <section className="border-y border-white/10 bg-white/[0.025]">
          <div className="mx-auto grid max-w-7xl gap-4 px-5 py-7 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-10">
            {[
              {
                icon: LockKeyhole,
                title: "Protected access",
                text: "Secure account authentication",
              },
              {
                icon: Zap,
                title: "Fast experience",
                text: "Built using React and Vite",
              },
              {
                icon: BarChart3,
                title: "Visual reports",
                text: "Interactive finance analytics",
              },
              {
                icon: MoonStar,
                title: "Premium interface",
                text: "Dark and light mode support",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-2xl px-3 py-2"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                    <Icon size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.title}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            FEATURES
        ====================================================== */}

        <section
          id="features"
          className="scroll-mt-24 px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.55,
              }}
              className="mx-auto max-w-3xl text-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.08] px-3 py-1.5 text-xs font-semibold text-cyan-300">
                <CircleDollarSign size={14} />
                Everything in one place
              </span>

              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Powerful tools for better
                <span className="block text-cyan-300">
                  financial decisions
                </span>
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-400">
                FinTrack Pro gives you the essential tools required
                to record, understand, and improve your financial
                activity.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.15,
              }}
              className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            >
              {mainFeatures.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  {...feature}
                />
              ))}
            </motion.div>
          </div>
        </section>

        {/* =====================================================
            COMPLETE BENEFITS
        ====================================================== */}

        <section className="px-5 pb-24 sm:px-8 lg:px-10 lg:pb-32">
          <div className="mx-auto grid max-w-7xl gap-12 overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.025] p-7 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-14">
            <motion.div
              initial={{
                opacity: 0,
                x: -25,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
              }}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                Complete finance control
              </span>

              <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
                One dashboard for your entire financial journey.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-400">
                From your first transaction to long-term savings
                goals, FinTrack Pro keeps your most important
                financial information organized and easy to
                understand.
              </p>

              <Link
                to="/register"
                className="group mt-8 inline-flex items-center gap-2 font-semibold text-cyan-300 transition hover:text-cyan-200"
              >
                Start managing your finances

                <ChevronRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: 25,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
              }}
              className="grid gap-3 sm:grid-cols-2"
            >
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/30 p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <CheckCircle2 size={17} />
                  </div>

                  <span className="text-sm font-medium text-slate-300">
                    {benefit}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* =====================================================
            HOW IT WORKS
        ====================================================== */}

        <section
          id="how-it-works"
          className="scroll-mt-24 border-y border-white/10 bg-white/[0.02] px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                Simple process
              </span>

              <h2 className="mt-5 text-3xl font-bold sm:text-4xl lg:text-5xl">
                Start in three easy steps
              </h2>

              <p className="mt-5 leading-7 text-slate-400">
                No complicated setup. Create your account and begin
                building healthier financial habits.
              </p>
            </div>

            <div className="relative mt-16 grid gap-6 lg:grid-cols-3">
              <div className="absolute left-[16%] right-[16%] top-12 hidden h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent lg:block" />

              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <motion.article
                    key={step.number}
                    initial={{
                      opacity: 0,
                      y: 25,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.12,
                    }}
                    className="relative rounded-3xl border border-white/10 bg-slate-950/60 p-7 text-center backdrop-blur-xl"
                  >
                    <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-xl shadow-cyan-950/20">
                      <Icon size={28} />

                      <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-bold text-slate-950">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-semibold text-white">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {step.description}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            SECURITY
        ====================================================== */}

        <section
          id="security"
          className="scroll-mt-24 px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
            <motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
              }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-[100px]" />

              <div className="relative mx-auto flex aspect-square max-w-md items-center justify-center rounded-full border border-white/10 bg-white/[0.025]">
                <div className="absolute h-[78%] w-[78%] rounded-full border border-cyan-400/10" />
                <div className="absolute h-[56%] w-[56%] rounded-full border border-cyan-400/15" />

                <div className="flex h-32 w-32 items-center justify-center rounded-[38px] border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 shadow-2xl shadow-cyan-500/15">
                  <Fingerprint size={62} />
                </div>

                <div className="absolute left-3 top-1/3 rounded-2xl border border-white/10 bg-slate-900/90 p-3 shadow-xl">
                  <ShieldCheck
                    size={20}
                    className="text-emerald-400"
                  />
                </div>

                <div className="absolute bottom-8 right-5 rounded-2xl border border-white/10 bg-slate-900/90 p-3 shadow-xl">
                  <LockKeyhole
                    size={20}
                    className="text-cyan-300"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: 30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
              }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1.5 text-xs font-semibold text-emerald-300">
                <ShieldCheck size={14} />
                Secure authentication
              </span>

              <h2 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Your account access is protected.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-400">
                FinTrack Pro uses Supabase authentication to manage
                registration, login, logout, active sessions, and
                protected dashboard routes.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    icon: LockKeyhole,
                    title: "Protected application routes",
                    text: "Logged-out visitors cannot access private dashboard pages.",
                  },
                  {
                    icon: Fingerprint,
                    title: "Secure session checking",
                    text: "Your active authentication session is checked before access.",
                  },
                  {
                    icon: DatabaseBackup,
                    title: "Backup controls",
                    text: "Export and restore your application data when required.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                        <Icon size={18} />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ====================================================== */}

        <section className="px-5 pb-24 sm:px-8 lg:px-10 lg:pb-32">
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
            className="relative mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/15 via-blue-500/10 to-violet-500/10 px-6 py-16 text-center shadow-2xl shadow-cyan-950/30 sm:px-10 lg:py-20"
          >
            <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-[100px]" />

            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-400 text-slate-950 shadow-xl shadow-cyan-400/20">
                <WalletCards size={30} />
              </div>

              <h2 className="mx-auto mt-7 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Start building a better financial future today.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-300">
                Create your account, organize your financial data,
                and understand where your money is going.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="group flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Create your account

                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/login"
                  className="flex items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-3.5 font-semibold text-white transition hover:bg-white/[0.1]"
                >
                  Already have an account
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <footer className="border-t border-white/10 bg-slate-950/70">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
                <WalletCards size={20} />
              </div>

              <div>
                <p className="font-semibold text-white">
                  FinTrack Pro
                </p>

                <p className="text-xs text-slate-500">
                  Personal Finance Management
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
              <a
                href="#features"
                className="transition hover:text-cyan-300"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                className="transition hover:text-cyan-300"
              >
                How it works
              </a>

              <Link
                to="/login"
                className="transition hover:text-cyan-300"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="transition hover:text-cyan-300"
              >
                Register
              </Link>
            </div>

            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} FinTrack Pro | Devjit Mondal | All rights reserved. 
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default Welcome;