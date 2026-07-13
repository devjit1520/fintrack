import { motion } from "framer-motion";
import {
  Lightbulb,
  Sparkles,
} from "lucide-react";

import Card from "../common/Card";

const tips = [
  "💰 Save at least 20% of your monthly income.",
  "📈 Review your spending every week.",
  "🎯 Set realistic financial goals.",
  "💳 Avoid unnecessary subscriptions.",
  "🏦 Build an emergency fund covering 3–6 months of expenses.",
  "📊 Track every expense to understand your spending habits.",
  "💡 Invest regularly instead of trying to time the market.",
  "🚀 Automate your savings to stay consistent.",
];

function FinanceTips() {
  const randomTip =
    tips[Math.floor(Math.random() * tips.length)];

  return (
    <Card
      className="
        relative
        overflow-hidden

        bg-white
        dark:bg-slate-900

        border-slate-200
        dark:border-slate-800
      "
    >
      {/* Background Glow */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-yellow-400/20 blur-3xl" />

      <div className="relative">

        {/* Header */}
        <div className="flex items-center gap-4">

          <div className="rounded-2xl bg-yellow-100 p-3 dark:bg-yellow-500/20">
            <Lightbulb
              size={26}
              className="text-yellow-600 dark:text-yellow-400"
            />
          </div>

          <div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Smart Finance Tip
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Improve your financial habits
            </p>

          </div>

        </div>

        {/* Tip */}
        <motion.div
          key={randomTip}
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="
            mt-6
            rounded-2xl

            bg-slate-100
            dark:bg-slate-800

            p-5
          "
        >

          <div className="flex items-start gap-3">

            <Sparkles
              className="mt-1 text-cyan-500"
              size={20}
            />

            <p className="leading-7 text-slate-700 dark:text-slate-300">
              {randomTip}
            </p>
            

          </div>

        </motion.div>

      </div>
    </Card>
  );
}

export default FinanceTips;