import { useState } from "react";
import { Menu, Search, MapPin } from "lucide-react";

import NotificationBell from "../notifications/NotificationBell";
import ThemeToggle from "../common/ThemeToggle";
import ProfileDropdown from "./ProfileDropdown";
import useProfile from "../../hooks/useProfile";

function TopHeader({
  openSidebar,
  openSearch,
}) {
  const [profileOpen, setProfileOpen] = useState(false);

  const { profile } = useProfile();

  const hour = new Date().getHours();

  
const avatar =
  profile.avatar ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    profile.name || "FinTrack User"
  )}&background=06b6d4&color=ffffff`;

  return (
    <header
      className="
        sticky
        top-0
        z-40
        h-20
        border-b
        border-slate-200
        dark:border-slate-800
        bg-white/90
        dark:bg-slate-950/90
        backdrop-blur-xl
        transition-colors
      "
    >
      <div className="flex h-full items-center justify-between px-4 lg:px-8">

        {/* LEFT */}

        <div className="flex items-center gap-4">

          <button
            onClick={openSidebar}
            className="
              rounded-xl
              p-2
              transition
              hover:bg-slate-100
              dark:hover:bg-slate-800
              lg:hidden
            "
          >
            <Menu
              size={24}
              className="text-slate-700 dark:text-white"
            />
          </button>

          {/* <div className="hidden lg:block">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              {greeting}, {profile.name} 👋
            </h2>

            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <MapPin size={15} />
              <span>{profile.location}</span>
            </div>
          </div> */}

        </div>

        {/* SEARCH */}

        <button
          onClick={openSearch}
          className="
            mx-8
            hidden
            w-full
            max-w-xl
            items-center
            gap-3
            rounded-2xl
            border
            border-slate-200
            dark:border-slate-700
            bg-white
            dark:bg-slate-900
            px-5
            py-3
            transition-all
            hover:border-cyan-500
            md:flex
          "
        >
          <Search
            size={18}
            className="text-slate-400"
          />

          <span className="flex-1 text-left text-slate-500">
            Search transactions, goals, budgets...
          </span>

          <kbd
            className="
              rounded-lg
              bg-slate-100
              dark:bg-slate-800
              px-2
              py-1
              text-xs
              text-slate-500
            "
          >
            Ctrl K
          </kbd>
        </button>

        {/* RIGHT */}

        <div className="flex items-center gap-4">

          {/* Mobile Search */}

          <button
            onClick={openSearch}
            className="
              rounded-xl
              p-2
              hover:bg-slate-100
              dark:hover:bg-slate-800
              md:hidden
            "
          >
            <Search
              size={22}
              className="text-slate-700 dark:text-white"
            />
          </button>

          {/* Notification */}

          <div className="relative">

            <NotificationBell />

            <span
              className="
                absolute
                -right-1
                -top-1
                flex
                h-5
                min-w-[20px]
                items-center
                justify-center
                rounded-full
                bg-red-500
                px-1
                text-[10px]
                font-bold
                text-white
              "
            >
              3
            </span>

          </div>

          {/* Theme */}

          <ThemeToggle />

          {/* Avatar */}

<div className="relative">
  <button
    type="button"
    onClick={() =>
      setProfileOpen(
        (current) => !current
      )
    }
    className="
      flex
      items-center
      gap-3
      rounded-xl
      p-1
      transition
      hover:bg-slate-100
      dark:hover:bg-slate-800
    "
  >
    <div className="relative">
      <img
        src={avatar}
        alt={profile.name}
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
          bg-green-500
          dark:border-slate-950
        "
      />
    </div>

    <div className="hidden text-left xl:block">
      <p
        className="
          max-w-36
          truncate
          font-semibold
          text-slate-800
          dark:text-white
        "
      >
        {profile.name}
      </p>

      <p
        className="
          max-w-36
          truncate
          text-xs
          text-slate-500
          dark:text-slate-400
        "
      >
        {profile.role}
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