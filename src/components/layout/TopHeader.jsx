import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Menu,
  Search,
} from "lucide-react";

import NotificationBell from "../notifications/NotificationBell";
import ThemeToggle from "../common/ThemeToggle";
import ProfileDropdown from "./ProfileDropdown";

import useProfile from "../../hooks/useProfile";

/* =========================================================
   TOP HEADER
========================================================= */

function TopHeader({
  openSidebar,
  openSearch,
}) {
  /* =======================================================
     REFS
  ======================================================= */

  const profileWrapperRef =
    useRef(null);

  /* =======================================================
     STATE
  ======================================================= */

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);

  /* =======================================================
     PROFILE
  ======================================================= */

  const {
    profile = {},
  } = useProfile() || {};

  const displayName =
    profile.name ||
    [
      profile.firstName,
      profile.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    "FinTrack User";

  const avatar =
    profile.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName
    )}&background=06b6d4&color=ffffff&size=128&bold=true`;

  /* =======================================================
     CLOSE PROFILE DROPDOWN
  ======================================================= */

  useEffect(() => {
    if (!profileOpen) {
      return undefined;
    }

    const handleOutsideClick = (
      event
    ) => {
      if (
        profileWrapperRef.current &&
        !profileWrapperRef.current.contains(
          event.target
        )
      ) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (
      event
    ) => {
      if (
        event.key === "Escape"
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [profileOpen]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <header
      className="
        sticky
        top-0
        z-[60]

        h-24
        shrink-0

        border-b
        border-white/[0.07]

        bg-[#020617]/95

        shadow-[0_1px_0_rgba(255,255,255,0.015)]

        backdrop-blur-2xl
      "
    >
      <div
        className="
          flex
          h-full
          min-w-0
          items-center
          gap-3

          px-4

          sm:px-6

          lg:px-8
        "
      >
        {/* =================================================
            MOBILE SIDEBAR BUTTON
        ================================================== */}

        <button
          type="button"
          onClick={() =>
            openSidebar?.()
          }
          aria-label="Open sidebar"
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center

            rounded-xl

            border
            border-transparent

            text-slate-300

            transition
            duration-200

            hover:border-white/[0.07]
            hover:bg-white/[0.06]
            hover:text-white

            focus:outline-none
            focus:ring-4
            focus:ring-blue-500/10

            lg:hidden
          "
        >
          <Menu size={22} />
        </button>

        {/* =================================================
            DESKTOP SEARCH
        ================================================== */}

        <button
          type="button"
          onClick={() =>
            openSearch?.()
          }
          className="
            group

            mx-auto
            hidden

            h-14
            w-full
            max-w-2xl
            min-w-0

            items-center
            gap-3

            rounded-[18px]

            border
            border-slate-700/90

            bg-[#0b1426]/90

            px-5

            text-left

            shadow-sm

            transition
            duration-200

            hover:border-cyan-500/30
            hover:bg-[#0e192e]
            hover:shadow-lg
            hover:shadow-black/10

            focus:outline-none
            focus:ring-4
            focus:ring-cyan-500/10

            md:flex
          "
        >
          {/* Search icon */}

          <Search
            size={19}
            className="
              shrink-0

              text-slate-400

              transition
              duration-200

              group-hover:text-cyan-400
            "
          />

          {/* Search placeholder */}

          <span
            className="
              min-w-0
              flex-1
              truncate

              text-sm
              font-medium
              text-slate-400

              transition

              group-hover:text-slate-300
            "
          >
            Search FinTrack...
          </span>

          {/* Keyboard shortcut */}

          <span
            className="
              flex
              shrink-0
              items-center
              justify-center

              rounded-lg

              border
              border-slate-700

              bg-slate-800/90

              px-2.5
              py-1

              text-[10px]
              font-bold
              text-slate-500

              shadow-sm

              transition

              group-hover:border-slate-600
              group-hover:text-slate-400
            "
          >
            Ctrl K
          </span>
        </button>

        {/* =================================================
            RIGHT ACTIONS
        ================================================== */}

        <div
          className="
            ml-auto

            flex
            shrink-0
            items-center

            gap-2

            sm:gap-3
          "
        >
          {/* ===============================================
              MOBILE SEARCH
          ================================================ */}

          <button
            type="button"
            onClick={() =>
              openSearch?.()
            }
            aria-label="Open search"
            className="
              flex
              h-11
              w-11
              items-center
              justify-center

              rounded-xl

              border
              border-transparent

              text-slate-300

              transition
              duration-200

              hover:border-white/[0.07]
              hover:bg-white/[0.06]
              hover:text-cyan-300

              focus:outline-none
              focus:ring-4
              focus:ring-cyan-500/10

              md:hidden
            "
          >
            <Search size={20} />
          </button>

          {/* ===============================================
              NOTIFICATION
          ================================================ */}

          <div
            className="
              flex
              items-center
              justify-center
            "
          >
            <NotificationBell />
          </div>

          {/* ===============================================
              THEME TOGGLE

              Theme toggle still works.
              Only the main shell/header stays dark.
          ================================================ */}

          <div
            className="
              flex
              items-center
              justify-center
            "
          >
            <ThemeToggle />
          </div>

          {/* ===============================================
              PROFILE
          ================================================ */}

          <div
            ref={
              profileWrapperRef
            }
            className="
              relative
              ml-1
            "
          >
            <button
              type="button"
              onClick={() =>
                setProfileOpen(
                  (current) =>
                    !current
                )
              }
              aria-expanded={
                profileOpen
              }
              aria-haspopup="menu"
              aria-label="Open profile menu"
              className={`
                flex
                items-center
                gap-3

                rounded-2xl

                border

                p-1.5

                transition
                duration-200

                focus:outline-none
                focus:ring-4
                focus:ring-cyan-500/10

                ${
                  profileOpen
                    ? `
                      border-cyan-500/30
                      bg-cyan-500/[0.07]
                      shadow-lg
                      shadow-cyan-500/[0.05]
                    `
                    : `
                      border-transparent

                      hover:border-white/[0.08]
                      hover:bg-white/[0.05]
                    `
                }
              `}
            >
              {/* ===========================================
                  AVATAR
              ============================================ */}

              <div className="relative">
                <img
                  src={avatar}
                  alt={displayName}
                  className="
                    h-11
                    w-11

                    rounded-full

                    border-2
                    border-cyan-500

                    bg-slate-800

                    object-cover

                    shadow-lg
                    shadow-cyan-500/10
                  "
                />

                {/* Online status */}

                <span
                  className="
                    absolute
                    bottom-0
                    right-0

                    h-3
                    w-3

                    rounded-full

                    border-2
                    border-[#020617]

                    bg-emerald-500

                    shadow-sm
                  "
                />
              </div>
            </button>

            {/* ===========================================
                PROFILE DROPDOWN
            ============================================ */}

            <ProfileDropdown
              open={
                profileOpen
              }
              onClose={() =>
                setProfileOpen(
                  false
                )
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopHeader;