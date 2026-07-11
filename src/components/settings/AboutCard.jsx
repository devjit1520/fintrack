import { motion } from "framer-motion";
import {
  Info,
  Globe,
  Mail,
  Code2,
  Heart,
  Laptop,
  BadgeCheck,
} from "lucide-react";

import { FaGithub } from "react-icons/fa";

function AboutCard() {
  const version = "v1.0.0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >
      {/* Background Glow */}
      <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative">

        <div className="mb-8 flex items-center gap-3">

          <Info
            size={30}
            className="text-cyan-400"
          />

          <h2 className="text-3xl font-bold text-white">
            About FinTrack Pro
          </h2>

        </div>

        {/* Logo */}
        <div className="mb-8 flex justify-center">

          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-cyan-500/20">

            <Laptop
              size={52}
              className="text-cyan-400"
            />

          </div>

        </div>

        {/* App Info */}
        <div className="space-y-5">

          <InfoRow
            icon={<BadgeCheck />}
            label="Version"
            value={version}
          />

          <InfoRow
            icon={<Code2 />}
            label="Developer"
            value="Devjit Mondal"
          />

          <InfoRow
            icon={<Heart />}
            label="Built With"
            value="React • Tailwind CSS • Vite"
          />

        </div>

        {/* Buttons */}
        <div className="mt-8 grid gap-4">

          <a
            href="https://github.com/devjit1520"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 rounded-2xl bg-slate-800 py-4 text-white transition hover:bg-slate-700"
          >
            <FaGithub size={22} />
            GitHub
          </a>

          <a
            href="https://your-portfolio-link.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 rounded-2xl bg-cyan-600 py-4 text-white transition hover:bg-cyan-500"
          >
            <Globe size={22} />
            Portfolio
          </a>

          <a
            href="mailto:your@email.com"
            className="flex items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 text-white transition hover:bg-blue-500"
          >
            <Mail size={22} />
            Contact
          </a>

        </div>

      </div>

    </motion.div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-slate-800/50 p-4">

      <div className="rounded-xl bg-cyan-500/20 p-3 text-cyan-400">
        {icon}
      </div>

      <div>

        <p className="text-sm text-slate-400">
          {label}
        </p>

        <h4 className="font-semibold text-white">
          {value}
        </h4>

      </div>

    </div>
  );
}

export default AboutCard;