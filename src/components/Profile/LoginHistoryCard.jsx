import {
  Clock3,
  Laptop,
  Languages,
  Monitor,
  Smartphone,
  Trash2,
} from "lucide-react";

import ProfileCard from "./ProfileCard";
import useActivity from "../../hooks/useActivity";

import {
  formatActivityDate,
  timeAgo,
} from "../../utils/timeAgo";

function getDeviceIcon(deviceType) {
  if (deviceType === "Mobile") {
    return Smartphone;
  }

  return Monitor;
}

function LoginHistoryCard() {
  const {
    loginHistory,
    clearLoginHistory,
  } = useActivity();

  const handleClearHistory = () => {
    const confirmed =
      window.confirm(
        "Clear saved login history?"
      );

    if (confirmed) {
      clearLoginHistory();
    }
  };

  return (
    <ProfileCard title="Login History">
      <div className="space-y-5">
        <div
          className="
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-blue-200
            bg-blue-50
            p-4
            dark:border-blue-900
            dark:bg-blue-950/30
          "
        >
          <Laptop
            size={22}
            className="
              mt-0.5
              shrink-0
              text-blue-600
              dark:text-blue-400
            "
          />

          <div>
            <p
              className="
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              Local session history
            </p>

            <p
              className="
                mt-1
                text-sm
                leading-6
                text-slate-500
                dark:text-slate-400
              "
            >
              These records are stored only
              in this browser and are not real
              server login records.
            </p>
          </div>
        </div>

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
          "
        >
          <p
            className="
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            {loginHistory.length} saved{" "}
            {loginHistory.length === 1
              ? "session"
              : "sessions"}
          </p>

          {loginHistory.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                px-3
                py-2
                text-sm
                font-medium
                text-red-600
                transition
                hover:bg-red-50
                dark:hover:bg-red-950/30
              "
            >
              <Trash2 size={16} />
              Clear history
            </button>
          )}
        </div>

        {loginHistory.length === 0 ? (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-slate-300
              py-12
              text-center
              dark:border-slate-700
            "
          >
            <Monitor
              size={34}
              className="
                mx-auto
                text-slate-400
              "
            />

            <p
              className="
                mt-4
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              No login history
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {loginHistory.map(
              (session) => {
                const DeviceIcon =
                  getDeviceIcon(
                    session.deviceType
                  );

                return (
                  <article
                    key={session.id}
                    className="
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-4
                      dark:border-slate-800
                      dark:bg-slate-950
                    "
                  >
                    <div
                      className="
                        flex
                        items-start
                        gap-4
                      "
                    >
                      <div
                        className="
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-blue-100
                          text-blue-600
                          dark:bg-blue-950/50
                          dark:text-blue-400
                        "
                      >
                        <DeviceIcon
                          size={20}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div
                          className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                          "
                        >
                          <h4
                            className="
                              font-medium
                              text-slate-900
                              dark:text-white
                            "
                          >
                            {session.browser} on{" "}
                            {
                              session.operatingSystem
                            }
                          </h4>

                          {session.current && (
                            <span
                              className="
                                rounded-full
                                bg-emerald-100
                                px-2
                                py-1
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wide
                                text-emerald-700
                                dark:bg-emerald-950/50
                                dark:text-emerald-400
                              "
                            >
                              Current
                            </span>
                          )}
                        </div>

                        <div
                          className="
                            mt-3
                            grid
                            gap-2
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                            sm:grid-cols-2
                          "
                        >
                          <span
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >
                            <Monitor
                              size={14}
                            />
                            {
                              session.deviceType
                            }{" "}
                            • {session.screen}
                          </span>

                          <span
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >
                            <Languages
                              size={14}
                            />
                            {
                              session.language
                            }
                          </span>

                          <span
                            title={formatActivityDate(
                              session.loggedInAt
                            )}
                            className="
                              flex
                              items-center
                              gap-2
                              sm:col-span-2
                            "
                          >
                            <Clock3
                              size={14}
                            />
                            {timeAgo(
                              session.loggedInAt
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </div>
    </ProfileCard>
  );
}

export default LoginHistoryCard;