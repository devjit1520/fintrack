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
  WalletCards,
} from "lucide-react";

import useProfile from "../../hooks/useProfile";
import AvatarUploader from "./AvatarUploader";

/* =========================================================
   HELPERS
========================================================= */

function getSafeWebsite(value) {
  const website = String(value || "").trim();

  if (!website) {
    return "";
  }

  return /^https?:\/\//i.test(website)
    ? website
    : `https://${website}`;
}

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

/* =========================================================
   STATUS ITEM
========================================================= */

function StatusItem({
  icon: Icon,
  label,
  value,
  iconClasses,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-slate-200/80
        bg-white/70
        p-4
        backdrop-blur-xl
        transition
        hover:-translate-y-0.5
        hover:shadow-lg
        dark:border-white/10
        dark:bg-white/[0.035]
      "
    >
      <div
        className={`
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          ${iconClasses}
        `}
      >
        <Icon size={19} />
      </div>

      <div className="min-w-0">
        <p
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-[0.14em]
            text-slate-500
            dark:text-slate-400
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1
            truncate
            text-sm
            font-bold
            text-slate-950
            dark:text-white
          "
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   PROFILE HEADER
========================================================= */

function ProfileHeader() {
  const { profile = {} } =
    useProfile() || {};

  const displayName =
    profile.name ||
    [
      profile.firstName,
      profile.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    "FinTrack User";

  const location =
    profile.location ||
    [
      profile.city,
      profile.state,
      profile.country,
    ]
      .filter(Boolean)
      .join(", ") ||
    "Location not added";

  const website =
    getSafeWebsite(profile.website);

  const savingGoal =
    profile.monthlySavingGoal || {};

  const goalTarget =
    getSafeNumber(savingGoal.target);

  const goalSaved =
    getSafeNumber(savingGoal.saved);

  const goalProgress =
    goalTarget > 0
      ? Math.min(
          Math.round(
            (goalSaved / goalTarget) *
              100
          ),
          100
        )
      : 0;

  const profileCompletion = useMemo(() => {
    const values = [
      profile.firstName ||
        profile.name,
      profile.lastName,
      profile.role,
      profile.email,
      profile.phone,
      profile.city ||
        profile.location,
      profile.country,
      profile.bio,
      profile.avatar,
      profile.website,
    ];

    const completed =
      values.filter((value) =>
        String(value || "").trim()
      ).length;

    return Math.round(
      (completed / values.length) *
        100
    );
  }, [
    profile.firstName,
    profile.lastName,
    profile.name,
    profile.role,
    profile.email,
    profile.phone,
    profile.city,
    profile.location,
    profile.country,
    profile.bio,
    profile.avatar,
    profile.website,
  ]);

  const circleRadius = 39;

  const circleCircumference =
    2 * Math.PI * circleRadius;

  const circleOffset =
    circleCircumference *
    (1 -
      profileCompletion / 100);

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
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
        dark:border-white/10
        dark:bg-[#0c1528]
        dark:shadow-black/20
      "
    >
      {/* Premium background */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-br
          from-cyan-500/[0.08]
          via-transparent
          to-violet-500/[0.1]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-28
          -top-28
          h-72
          w-72
          rounded-full
          bg-violet-500/15
          blur-[100px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-32
          left-1/4
          h-72
          w-72
          rounded-full
          bg-cyan-500/10
          blur-[110px]
        "
      />

      <div className="relative p-5 sm:p-7 lg:p-8">
        {/* Top label */}

        <div
          className="
            mb-6
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-cyan-500/20
              bg-cyan-500/10
              px-3.5
              py-2
              text-xs
              font-bold
              text-cyan-700
              dark:text-cyan-300
            "
          >
            <Sparkles size={14} />

            Personal finance profile
          </div>

          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-emerald-500/20
              bg-emerald-500/10
              px-3
              py-1.5
              text-xs
              font-bold
              text-emerald-700
              dark:text-emerald-400
            "
          >
            <ShieldCheck size={14} />

            Account active
          </div>
        </div>

        {/* Main profile grid */}

        <div
          className="
            grid
            items-start
            gap-6
            lg:grid-cols-[220px_minmax(0,1fr)]
            xl:grid-cols-[220px_minmax(0,1fr)_270px]
          "
        >
          {/* Avatar */}

          <AvatarUploader />

          {/* Profile information */}

          <div
            className="
              min-w-0
              rounded-3xl
              border
              border-slate-200/70
              bg-white/60
              p-5
              backdrop-blur-xl
              dark:border-white/10
              dark:bg-white/[0.025]
              sm:p-6
            "
          >
            <div
              className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-start
                sm:justify-between
              "
            >
              <div className="min-w-0">
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <h2
                    className="
                      truncate
                      text-2xl
                      font-black
                      tracking-tight
                      text-slate-950
                      dark:text-white
                      sm:text-3xl
                    "
                  >
                    {displayName}
                  </h2>

                  <BadgeCheck
                    size={23}
                    className="shrink-0 text-cyan-500"
                    aria-label="Verified profile"
                  />
                </div>

                <div
                  className="
                    mt-2
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-slate-600
                    dark:text-slate-300
                  "
                >
                  <BriefcaseBusiness
                    size={17}
                    className="text-cyan-500"
                  />

                  <span>
                    {profile.role ||
                      "FinTrack member"}
                  </span>
                </div>
              </div>

              <div
                className="
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-violet-500/20
                  bg-violet-500/10
                  px-3
                  py-2
                  text-xs
                  font-semibold
                  text-violet-700
                  dark:text-violet-300
                "
              >
                <WalletCards size={15} />

                Personal account
              </div>
            </div>

            {/* Contact chips */}

            <div
              className="
                mt-5
                flex
                flex-wrap
                gap-2
              "
            >
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="
                    inline-flex
                    max-w-full
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-slate-600
                    transition
                    hover:border-cyan-500/30
                    hover:text-cyan-600
                    dark:border-white/10
                    dark:bg-white/[0.04]
                    dark:text-slate-300
                    dark:hover:text-cyan-400
                  "
                >
                  <Mail
                    size={14}
                    className="shrink-0 text-cyan-500"
                  />

                  <span className="truncate">
                    {profile.email}
                  </span>
                </a>
              )}

              <span
                className="
                  inline-flex
                  max-w-full
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-slate-600
                  dark:border-white/10
                  dark:bg-white/[0.04]
                  dark:text-slate-300
                "
              >
                <MapPin
                  size={14}
                  className="shrink-0 text-violet-500"
                />

                <span className="truncate">
                  {location}
                </span>
              </span>

              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-slate-600
                    transition
                    hover:border-cyan-500/30
                    hover:text-cyan-600
                    dark:border-white/10
                    dark:bg-white/[0.04]
                    dark:text-slate-300
                    dark:hover:text-cyan-400
                  "
                >
                  <Globe2 size={14} />

                  Portfolio
                </a>
              )}
            </div>

            {/* Biography */}

            <div
              className="
                mt-5
                rounded-2xl
                border
                border-slate-200/70
                bg-slate-50/70
                p-4
                dark:border-white/10
                dark:bg-slate-950/30
              "
            >
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Professional summary
              </p>

              <p
                className="
                  mt-2
                  max-w-4xl
                  text-sm
                  leading-7
                  text-slate-600
                  dark:text-slate-300
                "
              >
                {profile.bio ||
                  "Add a professional introduction from the Personal Information section."}
              </p>
            </div>
          </div>

          {/* Progress panel */}

          <div
            className="
              grid
              gap-3
              sm:grid-cols-3
              lg:col-span-2
              xl:col-span-1
              xl:grid-cols-1
            "
          >
            {/* Completion ring */}

            <div
              className="
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-slate-200/80
                bg-white/70
                p-4
                backdrop-blur-xl
                dark:border-white/10
                dark:bg-white/[0.035]
              "
            >
              <div
                className="
                  relative
                  flex
                  h-20
                  w-20
                  shrink-0
                  items-center
                  justify-center
                "
              >
                <svg
                  viewBox="0 0 100 100"
                  className="h-20 w-20 -rotate-90"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r={circleRadius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-200 dark:text-slate-700"
                  />

                  <motion.circle
                    cx="50"
                    cy="50"
                    r={circleRadius}
                    fill="none"
                    stroke="url(#profileCompletionGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={
                      circleCircumference
                    }
                    initial={{
                      strokeDashoffset:
                        circleCircumference,
                    }}
                    animate={{
                      strokeDashoffset:
                        circleOffset,
                    }}
                    transition={{
                      duration: 1,
                      ease: "easeOut",
                    }}
                  />

                  <defs>
                    <linearGradient
                      id="profileCompletionGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#06b6d4"
                      />

                      <stop
                        offset="55%"
                        stopColor="#3b82f6"
                      />

                      <stop
                        offset="100%"
                        stopColor="#8b5cf6"
                      />
                    </linearGradient>
                  </defs>
                </svg>

                <span
                  className="
                    absolute
                    text-sm
                    font-black
                    text-slate-950
                    dark:text-white
                  "
                >
                  {profileCompletion}%
                </span>
              </div>

              <div>
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-slate-500
                  "
                >
                  Profile completion
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    font-bold
                    text-slate-950
                    dark:text-white
                  "
                >
                  {profileCompletion >= 100
                    ? "Complete"
                    : "Keep improving"}
                </p>
              </div>
            </div>

            <StatusItem
              icon={Target}
              label="Monthly goal"
              value={
                goalTarget > 0
                  ? `${goalProgress}% funded`
                  : "Not configured"
              }
              iconClasses="
                bg-violet-500/10
                text-violet-600
                dark:text-violet-400
              "
            />

            <StatusItem
              icon={CalendarCheck2}
              label="Data status"
              value="Protected locally"
              iconClasses="
                bg-emerald-500/10
                text-emerald-600
                dark:text-emerald-400
              "
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default ProfileHeader;