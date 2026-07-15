import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarCheck2,
  Globe2,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import useProfile from "../../hooks/useProfile";
import AvatarUploader from "./AvatarUploader";

function getSafeWebsite(value) {
  const website = String(value || "").trim();

  if (!website) {
    return "";
  }

  return /^https?:\/\//i.test(website) ? website : `https://${website}`;
}

function ProfileHeader() {
  const { profile = {} } = useProfile() || {};

  const displayName =
    profile.name ||
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    "FinTrack User";

  const location =
    profile.location ||
    [profile.city, profile.state, profile.country].filter(Boolean).join(", ") ||
    "Location not added";

  const website = getSafeWebsite(profile.website);
  const savingGoal = profile.monthlySavingGoal || {};
  const goalTarget = Number(savingGoal.target) || 0;
  const goalSaved = Number(savingGoal.saved) || 0;
  const goalProgress =
    goalTarget > 0 ? Math.min(Math.round((goalSaved / goalTarget) * 100), 100) : 0;

  const profileCompletion = useMemo(() => {
    const values = [
      profile.firstName || profile.name,
      profile.lastName,
      profile.role,
      profile.email,
      profile.phone,
      profile.city || profile.location,
      profile.country,
      profile.bio,
      profile.avatar,
      profile.website,
    ];

    const completed = values.filter((value) => String(value || "").trim()).length;
    return Math.round((completed / values.length) * 100);
  }, [profile]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900"
    >
      <div className="relative h-40 overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 sm:h-44">
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_30%,white_0,transparent_24%),radial-gradient(circle_at_80%_20%,white_0,transparent_18%)]" />
        <div className="absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
          <Sparkles size={14} />
          Personal finance profile
        </div>
      </div>

      <div className="relative px-5 pb-6 sm:px-6 sm:pb-7 lg:px-8">
        <div className="-mt-16 flex flex-col items-center gap-6 lg:flex-row lg:items-end">
          <AvatarUploader />

          <div className="min-w-0 flex-1 text-center lg:pb-2 lg:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {displayName}
              </h2>

              <BadgeCheck size={23} className="text-cyan-500" aria-label="Profile active" />

              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-400">
                <ShieldCheck size={11} />
                Active
              </span>
            </div>

            <div className="mt-2 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 lg:justify-start">
              <BriefcaseBusiness size={16} className="text-cyan-500" />
              <span>{profile.role || "FinTrack member"}</span>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-slate-600 dark:text-slate-300 lg:justify-start">
              {profile.email && (
                <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-white/[0.04]">
                  <Mail size={14} className="text-cyan-500" />
                  {profile.email}
                </span>
              )}

              <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-white/[0.04]">
                <MapPin size={14} className="text-violet-500" />
                {location}
              </span>

              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-cyan-500/30 hover:text-cyan-600 dark:border-white/10 dark:bg-white/[0.04] dark:hover:text-cyan-400"
                >
                  <Globe2 size={14} />
                  Portfolio
                </a>
              )}
            </div>

            {profile.bio && (
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-3 border-t border-slate-200/80 pt-5 dark:border-white/10 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.035]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <CalendarCheck2 size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-500">
                Profile complete
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                {profileCompletion}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.035]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Target size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-500">
                Monthly goal
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                {goalTarget > 0 ? `${goalProgress}% funded` : "Not configured"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.035]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-500">
                Data status
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                Protected locally
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default ProfileHeader;
