import {
  BadgeCheck,
  BriefcaseBusiness,
  Globe2,
  Mail,
  MapPin,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import useProfile from "../../hooks/useProfile";

import AvatarUploader from "./AvatarUploader";

function ProfileHeader() {
  const { profile } = useProfile();

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
        duration: 0.4,
      }}
      className="
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div
        className="
          h-36
          bg-gradient-to-r
          from-cyan-500
          via-blue-600
          to-indigo-600
        "
      />

      <div className="px-6 pb-8 md:px-8">
        <div
          className="
            -mt-16
            flex
            flex-col
            items-center
            gap-7
            lg:flex-row
            lg:items-end
          "
        >
          <AvatarUploader />

          <div
            className="
              flex-1
              text-center
              lg:pb-4
              lg:text-left
            "
          >
            <div
              className="
                flex
                items-center
                justify-center
                gap-2
                lg:justify-start
              "
            >
              <h2
                className="
                  text-3xl
                  font-bold
                  text-slate-900
                  dark:text-white
                "
              >
                {profile.name}
              </h2>

              <BadgeCheck
                size={24}
                className="text-cyan-500"
              />
            </div>

            <div
              className="
                mt-2
                flex
                items-center
                justify-center
                gap-2
                text-slate-600
                dark:text-slate-300
                lg:justify-start
              "
            >
              <BriefcaseBusiness
                size={17}
              />

              <span>{profile.role}</span>
            </div>

            <div
              className="
                mt-4
                flex
                flex-wrap
                justify-center
                gap-x-5
                gap-y-2
                text-sm
                text-slate-500
                dark:text-slate-400
                lg:justify-start
              "
            >
              <span
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <Mail size={15} />
                {profile.email}
              </span>

              <span
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <MapPin size={15} />
                {profile.location}
              </span>

              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    flex
                    items-center
                    gap-2
                    transition
                    hover:text-cyan-500
                  "
                >
                  <Globe2 size={15} />
                  Portfolio
                </a>
              )}
            </div>

            {profile.bio && (
              <p
                className="
                  mt-4
                  max-w-2xl
                  text-sm
                  leading-6
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {profile.bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default ProfileHeader;