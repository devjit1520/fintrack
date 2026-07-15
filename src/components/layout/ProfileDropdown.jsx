import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  ChevronRight,
  LogOut,
  Mail,
  MapPin,
  Settings,
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
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { profile } = useProfile();

  const {
    user,
    logout,
  } = useAuth();

  const [loggingOut, setLoggingOut] =
    useState(false);

  const [logoutError, setLogoutError] =
    useState("");

  const fallbackName =
    profile?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "FinTrack User";

  const avatarSource =
    profile?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fallbackName
    )}&background=06b6d4&color=ffffff&size=128`;

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {
        onClose();
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

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
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      setLogoutError("");
    }
  }, [open]);

  const goToPage = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      setLogoutError("");

      const result = await logout();

      if (!result.success) {
        setLogoutError(
          result.error ||
            "Unable to sign out."
        );

        return;
      }

      /*
       * Remove only local user-interface
       * caches here.
       *
       * Later, finance records will move
       * to Supabase and should not depend
       * on shared localStorage.
       */
      sessionStorage.removeItem(
        "fintrack-session-recorded"
      );

      onClose();

      navigate("/login", {
        replace: true,
        state: {
          message:
            "You have signed out successfully.",
        },
      });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dropdownRef}
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
            top-14
            z-50
            w-[310px]
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-2xl
            dark:border-slate-700
            dark:bg-slate-900
          "
        >
          <div
            className="
              border-b
              border-slate-200
              p-5
              dark:border-slate-800
            "
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={avatarSource}
                  alt={fallbackName}
                  className="
                    h-14
                    w-14
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
                    h-4
                    w-4
                    rounded-full
                    border-2
                    border-white
                    bg-green-500
                    dark:border-slate-900
                  "
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  className="
                    truncate
                    font-semibold
                    text-slate-900
                    dark:text-white
                  "
                >
                  {fallbackName}
                </h3>

                <p
                  className="
                    truncate
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {profile?.role ||
                    "FinTrack Member"}
                </p>
              </div>
            </div>

            <div
              className="
                mt-4
                space-y-2
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              <p className="flex items-center gap-2">
                <Mail size={14} />

                <span className="truncate">
                  {profile?.email ||
                    user?.email}
                </span>
              </p>

              {profile?.location && (
                <p className="flex items-center gap-2">
                  <MapPin size={14} />

                  <span className="truncate">
                    {profile.location}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="p-2">
            <button
              type="button"
              onClick={() =>
                goToPage("/profile")
              }
              className="
                flex
                w-full
                items-center
                justify-between
                rounded-xl
                px-4
                py-3
                text-left
                text-slate-700
                transition
                hover:bg-slate-100
                dark:text-slate-200
                dark:hover:bg-slate-800
              "
            >
              <span className="flex items-center gap-3">
                <UserRound size={18} />
                My Profile
              </span>

              <ChevronRight size={17} />
            </button>

            <button
              type="button"
              onClick={() =>
                goToPage("/settings")
              }
              className="
                flex
                w-full
                items-center
                justify-between
                rounded-xl
                px-4
                py-3
                text-left
                text-slate-700
                transition
                hover:bg-slate-100
                dark:text-slate-200
                dark:hover:bg-slate-800
              "
            >
              <span className="flex items-center gap-3">
                <Settings size={18} />
                Settings
              </span>

              <ChevronRight size={17} />
            </button>
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
              "
            >
              {logoutError}
            </div>
          )}

          <div
            className="
              border-t
              border-slate-200
              p-2
              dark:border-slate-800
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
                rounded-xl
                px-4
                py-3
                text-red-600
                transition
                hover:bg-red-50
                disabled:cursor-not-allowed
                disabled:opacity-60
                dark:hover:bg-red-950/30
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