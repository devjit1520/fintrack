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

function TopHeader({
  openSidebar,
  openSearch,
}) {
  const profileWrapperRef =
    useRef(null);

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);

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
      if (event.key === "Escape") {
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

  return (
    <header
      className="
        sticky
        top-0
        z-50
        h-20
        overflow-visible
        border-b
        border-slate-200
        bg-white/90
        backdrop-blur-2xl
        transition-colors
        dark:border-slate-800
        dark:bg-slate-950/90
      "
    >
      <div
        className="
          flex
          h-full
          items-center
          justify-between
          gap-4
          px-4
          lg:px-8
        "
      >
        {/* Mobile menu */}

        <button
          type="button"
          onClick={() =>
            openSidebar?.()
          }
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            text-slate-700
            transition
            hover:bg-slate-100
            dark:text-white
            dark:hover:bg-slate-800
            lg:hidden
          "
          aria-label="Open sidebar"
        >
          <Menu size={23} />
        </button>

        {/* Search */}

<button
  type="button"
  onClick={() => openSearch?.()}
  className="
    group
    mx-auto
    hidden
    w-full
    max-w-2xl
    items-center
    gap-3
    rounded-2xl
    border
    border-slate-200
    bg-slate-50/80
    px-5
    py-3
    text-left
    shadow-sm
    transition
    hover:border-cyan-500/40
    hover:bg-white
    hover:shadow-md
    dark:border-slate-700
    dark:bg-slate-900/80
    dark:hover:bg-slate-900
    md:flex
  "
>
  <Search
    size={19}
    className="
      shrink-0
      text-slate-400
      transition
      group-hover:text-cyan-500
    "
  />

  <span
    className="
      min-w-0
      flex-1
      truncate
      text-slate-500
      dark:text-slate-400
    "
  >
    Search FinTrack...
  </span>

  <span
    className="
      flex
      items-center
      gap-1
      rounded-lg
      border
      border-slate-200
      bg-white
      px-2
      py-1
      text-[11px]
      font-medium
      text-slate-500
      shadow-sm
      dark:border-slate-700
      dark:bg-slate-800
    "
  >
    Ctrl K
  </span>
</button>

        {/* Right actions */}

        <div
          className="
            ml-auto
            flex
            items-center
            gap-2
            sm:gap-3
          "
        >
          <button
            type="button"
            onClick={() =>
              openSearch?.()
            }
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              text-slate-700
              transition
              hover:bg-slate-100
              dark:text-white
              dark:hover:bg-slate-800
              md:hidden
            "
            aria-label="Open search"
          >
            <Search size={21} />
          </button>

          {/* NotificationBell now owns its badge */}

          <NotificationBell />

          <ThemeToggle />

          {/* Profile */}

          <div
            ref={profileWrapperRef}
            className="relative"
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
              className={`
                flex
                items-center
                gap-3
                rounded-2xl
                border
                p-1.5
                pr-2
                transition
                ${
                  profileOpen
                    ? `
                      border-cyan-500/30
                      bg-cyan-500/[0.06]
                    `
                    : `
                      border-transparent
                      hover:border-slate-200
                      hover:bg-slate-100
                      dark:hover:border-slate-700
                      dark:hover:bg-slate-800
                    `
                }
              `}
            >
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
                    object-cover
                  "
                />

                <span
                  className="
                    absolute
                    bottom-0
                    right-0
                    h-3
                    w-3
                    rounded-full
                    border-2
                    border-white
                    bg-emerald-500
                    dark:border-slate-950
                  "
                />
              </div>

              <div
                className="
                  hidden
                  max-w-40
                  text-left
                  xl:block
                "
              >
                <p
                  className="
                    truncate
                    font-semibold
                    text-slate-800
                    dark:text-white
                  "
                >
                  {displayName}
                </p>

                <p
                  className="
                    truncate
                    text-xs
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {profile.role ||
                    "FinTrack Member"}
                </p>
              </div>
            </button>

            <ProfileDropdown
              open={profileOpen}
              onClose={() =>
                setProfileOpen(false)
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopHeader;