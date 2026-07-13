import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  Sparkles,
} from "lucide-react";

function WelcomeHero() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hour = time.getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";

  const quotes = [
    "Every small saving builds a stronger future.",
    "Track today. Prosper tomorrow.",
    "Financial discipline creates financial freedom.",
    "Your money should work for you.",
    "Consistency beats intensity.",
  ];

  const quote = quotes[time.getDate() % quotes.length];

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="
        relative
        overflow-hidden
        rounded-3xl

        border
        border-slate-200
        dark:border-slate-800

        bg-white
        dark:bg-slate-900

        p-8

        shadow-lg
        dark:shadow-xl
        dark:shadow-cyan-500/5

        transition-all
        duration-300
      "
    >
      {/* Background Glow */}
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-[130px]" />

      <div className="relative flex flex-col justify-between gap-8 lg:flex-row">

        {/* Left */}
        <div>

          <div className="mb-4 flex items-center gap-3">

            <Sparkles
              size={22}
              className="text-cyan-500"
            />

            <span className="font-semibold text-cyan-500">
              Welcome Back
            </span>

          </div>

          <h1 className="text-4xl font-bold text-slate-900 dark:text-white lg:text-5xl">
            {greeting}, Devjit 👋
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            {quote}
          </p>

        </div>

        {/* Right */}
        <div className="space-y-5">

          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">

            <Clock3
              size={22}
              className="text-cyan-500"
            />

            <span className="text-2xl font-bold">
              {time.toLocaleTimeString()}
            </span>

          </div>

          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">

            <CalendarDays
              size={22}
              className="text-cyan-500"
            />

            <span className="text-lg">
              {time.toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>

          </div>

        </div>

      </div>
    </motion.section>
  );
}

export default WelcomeHero;