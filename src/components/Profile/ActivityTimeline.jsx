import {
  Bell,
  Filter,
  LogIn,
  Search,
  Settings2,
  ShieldCheck,
  Target,
  Trash2,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import ProfileCard from "./ProfileCard";
import useActivity from "../../hooks/useActivity";

import {
  formatActivityDate,
  timeAgo,
} from "../../utils/timeAgo";

const filterOptions = [
  {
    value: "all",
    label: "All Activity",
  },
  {
    value: "profile",
    label: "Profile",
  },
  {
    value: "goal",
    label: "Goals",
  },
  {
    value: "preference",
    label: "Preferences",
  },
  {
    value: "notification",
    label: "Notifications",
  },
  {
    value: "security",
    label: "Security",
  },
  {
    value: "login",
    label: "Sessions",
  },
];

const activityStyles = {
  profile: {
    icon: UserRound,
    container:
      "bg-cyan-100 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400",
  },

  goal: {
    icon: Target,
    container:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  },

  preference: {
    icon: Settings2,
    container:
      "bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
  },

  notification: {
    icon: Bell,
    container:
      "bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400",
  },

  security: {
    icon: ShieldCheck,
    container:
      "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400",
  },

  login: {
    icon: LogIn,
    container:
      "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
  },

  transaction: {
    icon: WalletCards,
    container:
      "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
  },

  general: {
    icon: Settings2,
    container:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  },
};

function ActivityTimeline() {
  const {
    activities,
    removeActivity,
    clearActivities,
  } = useActivity();

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const filteredActivities =
    useMemo(() => {
      const searchValue =
        search.trim().toLowerCase();

      return activities.filter(
        (activity) => {
          const matchesFilter =
            filter === "all" ||
            activity.type === filter;

          const matchesSearch =
            !searchValue ||
            activity.title
              ?.toLowerCase()
              .includes(searchValue) ||
            activity.description
              ?.toLowerCase()
              .includes(searchValue);

          return (
            matchesFilter &&
            matchesSearch
          );
        }
      );
    }, [
      activities,
      filter,
      search,
    ]);

  const handleClearAll = () => {
    const confirmed =
      window.confirm(
        "Clear all activity history?"
      );

    if (confirmed) {
      clearActivities();
    }
  };

  return (
    <ProfileCard title="Recent Activity">
      <div className="space-y-5">
        <div
          className="
            flex
            flex-col
            gap-3
            lg:flex-row
          "
        >
          <div className="relative flex-1">
            <Search
              size={17}
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search activity..."
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                py-3
                pl-11
                pr-4
                text-slate-900
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-4
                focus:ring-cyan-500/10
                dark:border-slate-700
                dark:bg-slate-950
                dark:text-white
              "
            />
          </div>

          <div className="relative">
            <Filter
              size={17}
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <select
              value={filter}
              onChange={(event) =>
                setFilter(
                  event.target.value
                )
              }
              className="
                min-w-48
                appearance-none
                rounded-xl
                border
                border-slate-200
                bg-white
                py-3
                pl-11
                pr-8
                text-slate-900
                outline-none
                transition
                focus:border-cyan-500
                dark:border-slate-700
                dark:bg-slate-950
                dark:text-white
              "
            >
              {filterOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>
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
            {filteredActivities.length}{" "}
            {filteredActivities.length ===
            1
              ? "activity"
              : "activities"}
          </p>

          {activities.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
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
              Clear all
            </button>
          )}
        </div>

        {filteredActivities.length ===
        0 ? (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-slate-300
              px-5
              py-12
              text-center
              dark:border-slate-700
            "
          >
            <Settings2
              size={34}
              className="
                mx-auto
                text-slate-400
              "
            />

            <h3
              className="
                mt-4
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              No activity found
            </h3>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              Profile and finance actions
              will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivities.map(
              (activity, index) => {
                const style =
                  activityStyles[
                    activity.type
                  ] ||
                  activityStyles.general;

                const Icon =
                  style.icon;

                return (
                  <motion.article
                    key={activity.id}
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        Math.min(
                          index * 0.04,
                          0.3
                        ),
                    }}
                    className="
                      group
                      flex
                      items-start
                      gap-4
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-4
                      transition
                      hover:border-cyan-300
                      dark:border-slate-800
                      dark:bg-slate-950
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
                        ${style.container}
                      `}
                    >
                      <Icon size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-4
                        "
                      >
                        <div>
                          <h4
                            className="
                              font-medium
                              text-slate-900
                              dark:text-white
                            "
                          >
                            {activity.title}
                          </h4>

                          {activity.description && (
                            <p
                              className="
                                mt-1
                                text-sm
                                leading-5
                                text-slate-500
                                dark:text-slate-400
                              "
                            >
                              {
                                activity.description
                              }
                            </p>
                          )}

                          <p
                            title={formatActivityDate(
                              activity.createdAt
                            )}
                            className="
                              mt-2
                              text-xs
                              text-slate-400
                            "
                          >
                            {timeAgo(
                              activity.createdAt
                            )}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeActivity(
                              activity.id
                            )
                          }
                          className="
                            rounded-lg
                            p-2
                            text-slate-400
                            opacity-0
                            transition
                            hover:bg-red-50
                            hover:text-red-500
                            group-hover:opacity-100
                            dark:hover:bg-red-950/30
                          "
                          aria-label="Remove activity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              }
            )}
          </div>
        )}
      </div>
    </ProfileCard>
  );
}

export default ActivityTimeline;