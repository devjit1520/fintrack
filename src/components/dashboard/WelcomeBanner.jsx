import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarDays,
  Clock3,
  Sparkles,
  WalletCards,
} from "lucide-react";

import useProfile from "../../hooks/useProfile";
import useFinance from "../../hooks/useFinance";

function getGreeting(hour) {
  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

function formatCurrency(value) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(Number(value) || 0);
}

function WelcomeBanner({
  onAddIncome,
  onAddExpense,
}) {
  const [time, setTime] =
    useState(new Date());

  const { profile } = useProfile();

  const {
    summary = {},
  } = useFinance();

  useEffect(() => {
    const timer = window.setInterval(
      () => {
        setTime(new Date());
      },
      1000
    );

    return () =>
      window.clearInterval(timer);
  }, []);

  const greeting = getGreeting(
    time.getHours()
  );

  const firstName =
    profile?.firstName ||
    profile?.name
      ?.trim()
      .split(" ")[0] ||
    "there";

  const quote = useMemo(() => {
    const quotes = [
      "Every small saving builds a stronger financial future.",
      "Track your money today and build freedom tomorrow.",
      "Financial discipline creates long-term confidence.",
      "Smart decisions today create better opportunities tomorrow.",
      "Consistency is the foundation of financial progress.",
    ];

    return quotes[
      time.getDate() %
        quotes.length
    ];
  }, [time]);

  const balance =
    Number(summary.balance) || 0;

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 24,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.55,
      }}
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-slate-200/80
        bg-white
        shadow-xl
        shadow-slate-200/40
        dark:border-slate-800
        dark:bg-slate-900
        dark:shadow-black/20
      "
    >
      {/* Background gradients */}

      <div
        className="
          absolute
          -right-24
          -top-28
          h-96
          w-96
          rounded-full
          bg-cyan-500/15
          blur-[110px]
        "
      />

      <div
        className="
          absolute
          -bottom-28
          left-1/3
          h-80
          w-80
          rounded-full
          bg-blue-600/10
          blur-[110px]
        "
      />

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-cyan-500/[0.04]
          via-transparent
          to-violet-500/[0.05]
        "
      />

      <div
        className="
          relative
          grid
          gap-8
          p-6
          sm:p-8
          xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]
          xl:p-10
        "
      >
        {/* Left content */}

        <div className="flex flex-col justify-between">
          <div>
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-cyan-500/20
                bg-cyan-500/10
                px-4
                py-2
                text-sm
                font-semibold
                text-cyan-600
                dark:text-cyan-400
              "
            >
              <Sparkles size={16} />
              Financial command center
            </div>

            <h1
              className="
                mt-6
                max-w-3xl
                text-3xl
                font-black
                tracking-tight
                text-slate-950
                dark:text-white
                sm:text-4xl
                xl:text-5xl
              "
            >
              {greeting},{" "}
              <span
                className="
                  bg-gradient-to-r
                  from-cyan-500
                  via-blue-500
                  to-violet-500
                  bg-clip-text
                  text-transparent
                "
              >
                {firstName}
              </span>{" "}
              👋
            </h1>

            <p
              className="
                mt-5
                max-w-2xl
                text-base
                leading-7
                text-slate-600
                dark:text-slate-400
                sm:text-lg
              "
            >
              {quote}
            </p>
          </div>

          <div
            className="
              mt-8
              flex
              flex-col
              gap-3
              sm:flex-row
            "
          >
            <button
              type="button"
              onClick={onAddIncome}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-emerald-500
                px-5
                py-3
                font-semibold
                text-white
                shadow-lg
                shadow-emerald-500/20
                transition
                hover:-translate-y-0.5
                hover:bg-emerald-600
              "
            >
              <ArrowUpCircle
                size={19}
              />
              Add Income
            </button>

            <button
              type="button"
              onClick={onAddExpense}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                border-slate-200
                bg-white/70
                px-5
                py-3
                font-semibold
                text-slate-700
                backdrop-blur-xl
                transition
                hover:-translate-y-0.5
                hover:border-red-400
                hover:text-red-500
                dark:border-slate-700
                dark:bg-slate-950/40
                dark:text-slate-200
              "
            >
              <ArrowDownCircle
                size={19}
              />
              Add Expense
            </button>
          </div>
        </div>

        {/* Right summary card */}

        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-white/60
            text-black
            dark:text-white
            dark:bg-slate-950
            p-6
            shadow-2xl
            dark:border-slate-700
          "
        >
          <div
            className="
              absolute
              -right-16
              -top-16
              h-44
              w-44
              rounded-full
              bg-cyan-500/30
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -bottom-20
              -left-12
              h-44
              w-44
              rounded-full
              bg-violet-500/20
              blur-3xl
            "
          />

          <div className="relative">
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    text-slate-400
                  "
                >
                  Available balance
                </p>

                <h2
                  className="
                    mt-2
                    text-3xl
                    font-black
                    sm:text-4xl
                  "
                >
                  {formatCurrency(balance)}
                </h2>
              </div>

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-cyan-500/15
                  text-cyan-400
                "
              >
                <WalletCards
                  size={24}
                />
              </div>
            </div>

            <div
              className="
                mt-8
                space-y-4
                rounded-2xl
                border
                border-white/10
                bg-white/[0.05]
                p-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <Clock3
                  size={19}
                  className="text-cyan-400"
                />

                <div>
                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >
                    Current time
                  </p>

                  <p
                    className="
                      mt-1
                      font-bold
                    "
                  >
                    {time.toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute:
                          "2-digit",
                        second:
                          "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>

              <div
                className="
                  h-px
                  bg-white/10
                "
              />

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <CalendarDays
                  size={19}
                  className="text-violet-400"
                />

                <div>
                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >
                    Today
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-semibold
                    "
                  >
                    {time.toLocaleDateString(
                      undefined,
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default WelcomeBanner;