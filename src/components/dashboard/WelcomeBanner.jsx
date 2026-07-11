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
    const timer = setInterval(
      () => setTime(new Date()),
      1000
    );

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
    "Consistency beats intensity."
  ];

  const quote =
    quotes[time.getDate() % quotes.length];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-8
        backdrop-blur-xl
      "
    >
      {/* Glow */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative flex flex-col justify-between gap-8 lg:flex-row">

        <div>

          <div className="mb-4 flex items-center gap-3">

            <Sparkles className="text-cyan-400" />

            <span className="text-cyan-400 font-semibold">
              Welcome Back
            </span>

          </div>

          <h1 className="text-5xl font-bold text-white">
            {greeting}, Devjit 👋
          </h1>

          <p className="mt-6 max-w-xl text-lg text-slate-300">
            {quote}
          </p>

        </div>

        <div className="space-y-5">

          <div className="flex items-center gap-3 text-slate-300">

            <Clock3 className="text-cyan-400" />

            <span className="text-2xl font-bold">
              {time.toLocaleTimeString()}
            </span>

          </div>

          <div className="flex items-center gap-3 text-slate-300">

            <CalendarDays className="text-cyan-400" />

            <span className="text-lg">
              {time.toLocaleDateString(undefined,{
                weekday:"long",
                day:"numeric",
                month:"long",
                year:"numeric"
              })}
            </span>

          </div>

        </div>

      </div>

    </motion.div>
  );
}

export default WelcomeHero;