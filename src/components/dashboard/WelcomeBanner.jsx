import {
  Sparkles,
  CalendarDays,
} from "lucide-react";

function WelcomeBanner() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 shadow-2xl">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          {/* <div className="flex items-center gap-2">
            <Sparkles className="text-yellow-300" />
            <span className="font-semibold text-yellow-300">
              Premium Dashboard
            </span>
          </div> */}

          <h1 className="mt-3 text-4xl font-bold text-white">
            Welcome , Devjit Mondal 👋
          </h1>

          <p className="mt-2 text-blue-100">
            Track your income, expenses and financial growth.
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
          <CalendarDays className="mb-2 text-white" />

          <p className="text-white">
            {today}
          </p>
        </div>
      </div>
    </div>
  );
}

export default WelcomeBanner;