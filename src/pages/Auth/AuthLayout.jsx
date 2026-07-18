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
    description:
      "Record and organize income and expenses.",
    gradient:
      "from-cyan-500/20 to-blue-500/5",
  },
  {
    icon: PiggyBank,
    title: "Control budgets",
    description:
      "Monitor category limits and spending.",
    gradient:
      "from-violet-500/20 to-fuchsia-500/5",
  },
  {
    icon: Goal,
    title: "Reach your goals",
    description:
      "Measure savings and financial progress.",
    gradient:
      "from-emerald-500/20 to-cyan-500/5",
  },
  {
    icon: BarChart3,
    title: "View analytics",
    description:
      "Understand your financial performance.",
    gradient:
      "from-amber-500/20 to-rose-500/5",
  },
];

function AuthLayout() {
  const location = useLocation();

  const isRegisterPage =
    location.pathname === "/register";

  return (
    <main
      className="
        relative
        min-h-dvh
        overflow-x-hidden
        bg-[#020617]
        text-white
        lg:h-dvh
        lg:overflow-hidden
      "
    >
      {/* =====================================================
          PREMIUM BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 70, 0],
            y: [0, 45, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -left-52
            -top-52
            h-[620px]
            w-[620px]
            rounded-full
            bg-cyan-500/20
            blur-[150px]
          "
        />

        <motion.div
          animate={{
            x: [0, -60, 0],
            y: [0, 60, 0],
            scale: [1.08, 0.96, 1.08],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -right-52
            top-[8%]
            h-[650px]
            w-[650px]
            rounded-full
            bg-violet-600/20
            blur-[160px]
          "
        />

        <motion.div
          animate={{
            x: [0, 50, 0],
            scale: [1, 1.16, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -bottom-72
            left-[30%]
            h-[620px]
            w-[620px]
            rounded-full
            bg-blue-600/20
            blur-[160px]
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)]
            bg-[size:68px_68px]
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.9)_80%)]
          "
        />
      </div>

      {/* =====================================================
          MAIN GRID
      ====================================================== */}

      <div
        className="
          relative
          z-10
          min-h-dvh
          lg:grid
          lg:h-full
          lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]
        "
      >
        {/* ===================================================
            LEFT INFORMATION PANEL
        ==================================================== */}

        <section
          className="
            relative
            hidden
            h-full
            min-h-0
            overflow-hidden
            border-r
            border-white/[0.08]
            lg:flex
            lg:flex-col
          "
        >
          <div
            className="
              flex
              h-full
              min-h-0
              flex-col
              px-9
              py-7
              xl:px-12
              2xl:px-16
            "
          >
            {/* Brand header */}

            <header
              className="
                flex
                shrink-0
                items-center
                justify-between
                gap-5
              "
            >
              <Link
                to="/"
                className="group flex items-center gap-3"
              >
                <div className="relative">
                  <div
                    className="
                      absolute
                      -inset-2
                      rounded-3xl
                      bg-gradient-to-r
                      from-cyan-400/40
                      to-violet-500/40
                      blur-xl
                    "
                  />

                  <div
                    className="
                      relative
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-br
                      from-cyan-300
                      via-blue-500
                      to-violet-600
                      text-white
                      shadow-xl
                      transition
                      group-hover:scale-105
                    "
                  >
                    <WalletCards size={24} />
                  </div>
                </div>

                <div>
                  <h1 className="text-xl font-black tracking-tight">
                    FinTrack Pro
                  </h1>

                  <p
                    className="
                      bg-gradient-to-r
                      from-cyan-300
                      to-violet-400
                      bg-clip-text
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.24em]
                      text-transparent
                    "
                  >
                    Personal Finance
                  </p>
                </div>
              </Link>

              <Link
                to="/"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-400
                  backdrop-blur-xl
                  transition
                  hover:border-cyan-400/30
                  hover:bg-white/[0.07]
                  hover:text-cyan-300
                "
              >
                <ArrowLeft size={16} />

                Home
              </Link>
            </header>

            {/* Main information */}

            <div
              className="
                flex
                min-h-0
                flex-1
                flex-col
                justify-center
                py-5
              "
            >
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
                  duration: 0.55,
                }}
              >
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-cyan-400/20
                    bg-gradient-to-r
                    from-cyan-400/10
                    to-violet-500/10
                    px-3.5
                    py-2
                    text-xs
                    font-semibold
                    text-cyan-300
                  "
                >
                  <Sparkles size={14} />

                  Your smarter financial workspace
                </div>

                <h2
                  className="
                    mt-6
                    max-w-2xl
                    text-4xl
                    font-black
                    leading-[1.1]
                    tracking-tight
                    xl:text-5xl
                  "
                >
                  Manage your money with

                  <span
                    className="
                      mt-2
                      block
                      bg-gradient-to-r
                      from-cyan-300
                      via-blue-400
                      to-violet-400
                      bg-clip-text
                      text-transparent
                    "
                  >
                    clarity and confidence.
                  </span>
                </h2>

                <p
                  className="
                    mt-5
                    max-w-xl
                    text-sm
                    leading-7
                    text-slate-400
                    xl:text-base
                  "
                >
                  Track transactions, control budgets,
                  create savings goals and understand
                  your complete financial journey.
                </p>
              </motion.div>

              {/* Feature cards */}

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
                  duration: 0.55,
                  delay: 0.12,
                }}
                className="
                  mt-6
                  grid
                  max-w-2xl
                  grid-cols-2
                  gap-3
                "
              >
                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <article
                      key={feature.title}
                      className="
                        group
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-white/[0.09]
                        bg-white/[0.035]
                        p-3.5
                        backdrop-blur-xl
                        transition
                        hover:-translate-y-0.5
                        hover:border-cyan-400/25
                      "
                    >
                      <div
                        className={`
                          pointer-events-none
                          absolute
                          inset-0
                          bg-gradient-to-br
                          opacity-0
                          transition
                          group-hover:opacity-100
                          ${feature.gradient}
                        `}
                      />

                      <div className="relative flex items-start gap-3">
                        <div
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-white/10
                            bg-white/[0.06]
                            text-cyan-300
                          "
                        >
                          <Icon size={17} />
                        </div>

                        <div className="min-w-0">
                          <h3
                            className="
                              text-sm
                              font-bold
                              text-white
                            "
                          >
                            {feature.title}
                          </h3>

                          <p
                            className="
                              mt-1
                              text-[11px]
                              leading-5
                              text-slate-500
                            "
                          >
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </motion.div>

              {/* Bottom message */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.55,
                  delay: 0.22,
                }}
                className="
                  mt-5
                  flex
                  max-w-2xl
                  items-center
                  justify-between
                  gap-5
                  rounded-2xl
                  border
                  border-white/10
                  bg-gradient-to-r
                  from-emerald-500/[0.08]
                  via-cyan-500/[0.06]
                  to-violet-500/[0.08]
                  px-4
                  py-3
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-emerald-500/10
                      text-emerald-300
                    "
                  >
                    <TrendingUp size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      Build healthier financial habits
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Make better decisions using clear data.
                    </p>
                  </div>
                </div>

                <span
                  className="
                    hidden
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-emerald-500/20
                    bg-emerald-500/10
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-emerald-300
                    xl:flex
                  "
                >
                  <ShieldCheck size={14} />

                  Protected
                </span>
              </motion.div>
            </div>

            <footer
              className="
                flex
                shrink-0
                items-center
                justify-between
                border-t
                border-white/[0.07]
                pt-4
                text-xs
                text-slate-600
              "
            >
              <span>
                © {new Date().getFullYear()} FinTrack Pro
              </span>

              <span className="flex items-center gap-2">
                <ShieldCheck size={13} />

                Secure authentication
              </span>
            </footer>
          </div>
        </section>

        {/* ===================================================
            RIGHT AUTHENTICATION PANEL
        ==================================================== */}

        <section
          className="
            relative
            flex
            min-h-dvh
            items-center
            justify-center
            px-4
            pb-6
            pt-24
            sm:px-6
            lg:h-full
            lg:min-h-0
            lg:px-8
            lg:py-4
            xl:px-12
          "
        >
          {/* Mobile header */}

          <div
            className="
              absolute
              left-0
              right-0
              top-0
              z-20
              flex
              h-18
              items-center
              justify-between
              border-b
              border-white/[0.08]
              bg-[#020617]/85
              px-5
              backdrop-blur-2xl
              lg:hidden
            "
          >
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-gradient-to-br
                  from-cyan-300
                  via-blue-500
                  to-violet-600
                  text-white
                "
              >
                <WalletCards size={20} />
              </div>

              <div>
                <p className="font-black">
                  FinTrack Pro
                </p>

                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-cyan-400
                  "
                >
                  Personal Finance
                </p>
              </div>
            </Link>

            <Link
              to="/"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                bg-white/[0.05]
                text-slate-400
              "
              aria-label="Return home"
            >
              <ArrowLeft size={18} />
            </Link>
          </div>

          {/* Auth card */}

          <motion.div
            key={location.pathname}
            initial={{
              opacity: 0,
              y: 18,
              scale: 0.985,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.42,
              ease: "easeOut",
            }}
            className={`
              relative
              mx-auto
              w-full
              ${
                isRegisterPage
                  ? "max-w-[720px]"
                  : "max-w-[590px]"
              }
            `}
          >
            {/* Gradient border */}

            <div
              className="
                pointer-events-none
                absolute
                -inset-[1px]
                rounded-[33px]
                bg-gradient-to-br
                from-cyan-400/80
                via-blue-500/35
                to-violet-500/70
              "
            />

            {/* Outer glow */}

            <div
              className="
                pointer-events-none
                absolute
                -inset-7
                rounded-[45px]
                bg-gradient-to-r
                from-cyan-500/15
                via-blue-500/10
                to-violet-500/15
                blur-3xl
              "
            />

            <div
              className="
                relative
                overflow-hidden
                rounded-[32px]
                bg-[#03091a]/95
                shadow-2xl
                shadow-black/50
                backdrop-blur-3xl
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-x-0
                  top-0
                  h-36
                  bg-gradient-to-b
                  from-cyan-400/[0.07]
                  via-blue-500/[0.025]
                  to-transparent
                "
              />

              <div
                className={`
                  relative
                  px-5
                  py-5
                  sm:px-7
                  ${
                    isRegisterPage
                      ? `
                        max-h-none
                        overflow-visible
                        lg:max-h-[calc(100dvh-34px)]
                        lg:overflow-y-auto
                        lg:[scrollbar-width:none]
                        lg:[&::-webkit-scrollbar]:hidden
                      `
                      : `
                        overflow-visible
                        lg:max-h-[calc(100dvh-34px)]
                      `
                  }
                `}
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