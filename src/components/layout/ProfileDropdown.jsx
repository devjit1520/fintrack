import {
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import useProfile from "../../hooks/useProfile";
import useAuth from "../../hooks/useAuth";

function ProfileDropdown({
  open,
  onClose,
}) {
  const navigate = useNavigate();

  const {
    profile = {},
  } = useProfile() || {};

  const {
    user,
    logout,
  } = useAuth();

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);

  const [
    logoutError,
    setLogoutError,
  ] = useState("");

  const displayName =
    profile.name ||
    [
      profile.firstName,
      profile.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    user?.user_metadata
      ?.full_name ||
    user?.email?.split("@")[0] ||
    "FinTrack User";

  const avatarSource =
    profile.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName
    )}&background=06b6d4&color=ffffff&size=128&bold=true`;

  const goToPage = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      setLogoutError("");

      const result =
        await logout();

      if (!result?.success) {
        setLogoutError(
          result?.error ||
            "Unable to sign out."
        );

        return;
      }

      sessionStorage.removeItem(
        "fintrack-session-recorded"
      );

      onClose();

      navigate("/", {
        replace: true,

        state: {
          message:
            "You have signed out successfully.",
        },
      });
    } catch (error) {
      setLogoutError(
        error?.message ||
          "Unable to sign out."
      );
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -10,
            scale: 0.97,
          }}
          transition={{
            duration: 0.18,
          }}
          className="
            absolute
            right-0
            top-full
            z-[80]
            mt-3
            w-[min(92vw,350px)]
            origin-top-right
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-2xl
            shadow-slate-900/20
            dark:border-slate-700
            dark:bg-[#0d172a]
            dark:shadow-black/50
          "
        >
          {/* Profile summary */}

          <div
            className="
              relative
              overflow-hidden
              border-b
              border-slate-200
              bg-gradient-to-br
              from-cyan-500/[0.12]
              via-blue-500/[0.07]
              to-violet-500/[0.12]
              p-5
              dark:border-slate-700
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-12
                -top-12
                h-32
                w-32
                rounded-full
                bg-violet-500/20
                blur-3xl
              "
            />

            <div
              className="
                relative
                flex
                items-center
                gap-4
              "
            >
              <div className="relative">
                <div
                  className="
                    rounded-full
                    bg-gradient-to-br
                    from-cyan-400
                    via-blue-500
                    to-violet-500
                    p-0.5
                  "
                >
                  <img
                    src={avatarSource}
                    alt={displayName}
                    className="
                      h-16
                      w-16
                      rounded-full
                      border-2
                      border-white
                      object-cover
                      dark:border-[#0d172a]
                    "
                  />
                </div>

                <span
                  className="
                    absolute
                    bottom-0
                    right-0
                    h-4
                    w-4
                    rounded-full
                    border-2
                    border-white
                    bg-emerald-500
                    dark:border-[#0d172a]
                  "
                />
              </div>

              <div className="min-w-0 flex-1">
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <h3
                    className="
                      truncate
                      font-bold
                      text-slate-950
                      dark:text-white
                    "
                  >
                    {displayName}
                  </h3>

                  <ShieldCheck
                    size={16}
                    className="shrink-0 text-emerald-500"
                  />
                </div>

                <p
                  className="
                    mt-1
                    truncate
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {profile.role ||
                    "FinTrack Member"}
                </p>

                <span
                  className="
                    mt-2
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-emerald-500/10
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-emerald-600
                    dark:text-emerald-400
                  "
                >
                  <span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-emerald-500
                    "
                  />

                  Active account
                </span>
              </div>
            </div>

            <div
              className="
                relative
                mt-4
                space-y-2
                rounded-2xl
                border
                border-white/40
                bg-white/40
                p-3
                text-xs
                text-slate-600
                backdrop-blur-xl
                dark:border-white/10
                dark:bg-white/[0.04]
                dark:text-slate-300
              "
            >
              <p
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <Mail
                  size={14}
                  className="shrink-0 text-cyan-500"
                />

                <span className="truncate">
                  {profile.email ||
                    user?.email ||
                    "No email available"}
                </span>
              </p>

              {profile.location && (
                <p
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <MapPin
                    size={14}
                    className="shrink-0 text-violet-500"
                  />

                  <span className="truncate">
                    {profile.location}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Navigation */}

          <div className="p-3">
            <button
              type="button"
              onClick={() =>
                goToPage("/profile")
              }
              className="
                group
                flex
                w-full
                items-center
                justify-between
                rounded-2xl
                px-4
                py-3
                text-left
                text-slate-700
                transition
                hover:bg-cyan-500/[0.08]
                hover:text-cyan-600
                dark:text-slate-200
                dark:hover:text-cyan-400
              "
            >
              <span
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-cyan-500/10
                    text-cyan-500
                  "
                >
                  <UserRound
                    size={17}
                  />
                </span>

                <span>
                  <span
                    className="
                      block
                      text-sm
                      font-semibold
                    "
                  >
                    My Profile
                  </span>

                  <span
                    className="
                      mt-0.5
                      block
                      text-[10px]
                      text-slate-400
                    "
                  >
                    Personal information
                  </span>
                </span>
              </span>

              <ChevronRight
                size={17}
                className="
                  transition-transform
                  group-hover:translate-x-0.5
                "
              />
            </button>

            {/* <button
              type="button"
              onClick={() =>
                goToPage(
                  "/dashboard"
                )
              }
              className="
                group
                mt-1
                flex
                w-full
                items-center
                justify-between
                rounded-2xl
                px-4
                py-3
                text-left
                text-slate-700
                transition
                hover:bg-violet-500/[0.08]
                hover:text-violet-600
                dark:text-slate-200
                dark:hover:text-violet-400
              "
            >
              <span
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-violet-500/10
                    text-violet-500
                  "
                >
                  <LayoutDashboard
                    size={17}
                  />
                </span>

                <span>
                  <span
                    className="
                      block
                      text-sm
                      font-semibold
                    "
                  >
                    Dashboard
                  </span>

                  <span
                    className="
                      mt-0.5
                      block
                      text-[10px]
                      text-slate-400
                    "
                  >
                    Financial overview
                  </span>
                </span>
              </span>

              <ChevronRight
                size={17}
                className="
                  transition-transform
                  group-hover:translate-x-0.5
                "
              />
            </button> */}
          </div>

          {logoutError && (
            <div
              className="
                mx-3
                mb-2
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-3
                py-2
                text-xs
                text-red-600
                dark:border-red-900
                dark:bg-red-950/30
                dark:text-red-400
              "
            >
              {logoutError}
            </div>
          )}

          {/* Logout */}

          <div
            className="
              border-t
              border-slate-200
              p-3
              dark:border-slate-700
            "
          >
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-3
                rounded-2xl
                border
                border-red-500/15
                bg-red-500/[0.06]
                px-4
                py-3
                font-semibold
                text-red-600
                transition
                hover:border-red-500/30
                hover:bg-red-500/10
                disabled:cursor-not-allowed
                disabled:opacity-60
                dark:text-red-400
              "
            >
              {loggingOut ? (
                <>
                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-red-500
                      border-t-transparent
                    "
                  />

                  Signing out...
                </>
              ) : (
                <>
                  <LogOut size={18} />

                  Sign Out
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ProfileDropdown;