import { ChevronRight, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useProfile from "../../hooks/useProfile";

function getInitials(profile = {}) {
  const fullName =
    profile.name ||
    `${profile.firstName || ""} ${profile.lastName || ""}`.trim();

  if (!fullName) {
    return "FT";
  }

  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function SidebarProfileCard({
  onNavigate,
  compact = false,
}) {
  const navigate = useNavigate();

  const profileContext =
    useProfile() || {};

  const profile =
    profileContext.profile || {};

  const displayName =
    profile.name ||
    `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
    "FinTrack User";

  const role =
    profile.role ||
    "Personal Finance User";

  const avatar =
    profile.avatar ||
    profile.avatarUrl ||
    profile.photoURL ||
    "";

  const initials =
    getInitials(profile);

  const openProfile = () => {
    navigate("/profile");
    onNavigate?.();
  };

  return (
    <button
      type="button"
      onClick={openProfile}
      className="
        group
        relative
        flex
        w-full
        min-w-0
        items-center
        gap-3
        overflow-hidden
        rounded-2xl
        border
        border-white/[0.08]
        bg-gradient-to-r
        from-cyan-500/[0.07]
        via-blue-500/[0.04]
        to-violet-500/[0.08]
        p-3
        text-left
        transition
        duration-300
        hover:border-cyan-500/25
        hover:bg-white/[0.045]
        hover:shadow-lg
        hover:shadow-cyan-950/20
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-10
          -top-10
          h-24
          w-24
          rounded-full
          bg-violet-500/10
          blur-3xl
        "
      />

      <div className="relative shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={displayName}
            className="
              h-11
              w-11
              rounded-xl
              border
              border-cyan-400/30
              object-cover
              shadow-md
            "
          />
        ) : (
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-cyan-500/20
              bg-gradient-to-br
              from-cyan-500
              via-blue-500
              to-violet-500
              text-sm
              font-black
              text-white
              shadow-md
            "
          >
            {initials}
          </div>
        )}

        <span
          className="
            absolute
            -bottom-0.5
            -right-0.5
            h-3
            w-3
            rounded-full
            border-2
            border-[#071020]
            bg-emerald-400
          "
        />
      </div>

      {!compact && (
        <div className="relative min-w-0 flex-1">
          <p
            className="
              truncate
              text-sm
              font-black
              text-white
            "
          >
            {displayName}
          </p>

          <div
            className="
              mt-1
              flex
              min-w-0
              items-center
              gap-1.5
            "
          >
            <UserRound
              size={12}
              className="
                shrink-0
                text-cyan-400
              "
            />

            <p
              className="
                truncate
                text-[11px]
                text-slate-400
              "
            >
              {role}
            </p>
          </div>
        </div>
      )}

      {!compact && (
        <ChevronRight
          size={17}
          className="
            relative
            shrink-0
            text-slate-500
            transition
            group-hover:translate-x-0.5
            group-hover:text-cyan-400
          "
        />
      )}
    </button>
  );
}

export default SidebarProfileCard;