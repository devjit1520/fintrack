import {
  useEffect,
  useMemo,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Activity,
  CalendarDays,
  History,
  LogIn,
  X,
} from "lucide-react";

import HistoryRecordRow from "./HistoryRecordRow";

import {
  filterHistoryByRange,
} from "./historyUtils";

const FILTERS = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "today",
    label: "Today",
  },
  {
    value: "week",
    label: "This week",
  },
  {
    value: "month",
    label: "This month",
  },
];

function HistoryDetailsModal({
  open,
  onClose,

  activeTab,
  onTabChange,

  filter,
  onFilterChange,

  activityRecords,
  loginRecords,
}) {
  const currentRecords =
    activeTab === "activity"
      ? activityRecords
      : loginRecords;

  const filteredRecords =
    useMemo(
      () =>
        filterHistoryByRange(
          currentRecords,
          filter
        ),
      [
        currentRecords,
        filter,
      ]
    );

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleEscape = (
      event
    ) => {
      if (
        event.key === "Escape"
      ) {
        onClose?.();
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [
    open,
    onClose,
  ]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              onClose?.();
            }
          }}
          className="
            fixed
            inset-0
            z-[150]
            flex
            items-center
            justify-center
            bg-slate-950/70
            p-3
            backdrop-blur-md
            sm:p-6
          "
        >
          <motion.section
            initial={{
              opacity: 0,
              y: 18,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 18,
              scale: 0.97,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="
              flex
              max-h-[92dvh]
              w-full
              max-w-3xl
              flex-col
              overflow-hidden
              rounded-[28px]
              border
              border-slate-200
              bg-white
              shadow-2xl
              dark:border-slate-700
              dark:bg-[#0d172a]
            "
          >
            {/* Header */}

            <div
              className="
                flex
                shrink-0
                items-start
                justify-between
                gap-4
                border-b
                border-slate-200
                bg-gradient-to-r
                from-cyan-500/[0.08]
                via-blue-500/[0.04]
                to-violet-500/[0.08]
                p-5
                dark:border-slate-700
                sm:p-6
              "
            >
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-cyan-500/10
                    text-cyan-500
                  "
                >
                  <History size={20} />
                </div>

                <div className="min-w-0">
                  <h2
                    className="
                      text-lg
                      font-black
                      text-slate-950
                      dark:text-white
                      sm:text-xl
                    "
                  >
                    Activity & Login History
                  </h2>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Review account changes and recent login sessions.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close history"
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  text-slate-500
                  transition
                  hover:bg-slate-100
                  hover:text-slate-950
                  dark:hover:bg-slate-800
                  dark:hover:text-white
                "
              >
                <X size={19} />
              </button>
            </div>

            {/* Tabs */}

            <div
              className="
                shrink-0
                border-b
                border-slate-200
                px-4
                py-3
                dark:border-slate-700
                sm:px-6
              "
            >
              <div
                className="
                  grid
                  grid-cols-2
                  gap-2
                  rounded-2xl
                  bg-slate-100
                  p-1.5
                  dark:bg-slate-950/60
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    onTabChange(
                      "activity"
                    )
                  }
                  className={`
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    px-3
                    py-2.5
                    text-xs
                    font-bold
                    transition
                    sm:text-sm
                    ${
                      activeTab ===
                      "activity"
                        ? `
                          bg-white
                          text-cyan-600
                          shadow-sm
                          dark:bg-slate-800
                          dark:text-cyan-400
                        `
                        : `
                          text-slate-500
                          hover:text-slate-900
                          dark:text-slate-400
                          dark:hover:text-white
                        `
                    }
                  `}
                >
                  <Activity size={16} />

                  Activity

                  <span
                    className="
                      rounded-full
                      bg-slate-200
                      px-2
                      py-0.5
                      text-[10px]
                      dark:bg-slate-700
                    "
                  >
                    {
                      activityRecords.length
                    }
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onTabChange(
                      "login"
                    )
                  }
                  className={`
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    px-3
                    py-2.5
                    text-xs
                    font-bold
                    transition
                    sm:text-sm
                    ${
                      activeTab ===
                      "login"
                        ? `
                          bg-white
                          text-violet-600
                          shadow-sm
                          dark:bg-slate-800
                          dark:text-violet-400
                        `
                        : `
                          text-slate-500
                          hover:text-slate-900
                          dark:text-slate-400
                          dark:hover:text-white
                        `
                    }
                  `}
                >
                  <LogIn size={16} />

                  Logins

                  <span
                    className="
                      rounded-full
                      bg-slate-200
                      px-2
                      py-0.5
                      text-[10px]
                      dark:bg-slate-700
                    "
                  >
                    {
                      loginRecords.length
                    }
                  </span>
                </button>
              </div>
            </div>

            {/* Date filters */}

            <div
              className="
                flex
                shrink-0
                items-center
                gap-2
                overflow-x-auto
                border-b
                border-slate-200
                px-4
                py-3
                dark:border-slate-700
                sm:px-6
              "
            >
              <CalendarDays
                size={16}
                className="
                  mr-1
                  shrink-0
                  text-slate-400
                "
              />

              {FILTERS.map(
                (option) => (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() =>
                      onFilterChange(
                        option.value
                      )
                    }
                    className={`
                      shrink-0
                      rounded-full
                      border
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      transition
                      ${
                        filter ===
                        option.value
                          ? `
                            border-cyan-500/30
                            bg-cyan-500/10
                            text-cyan-600
                            dark:text-cyan-400
                          `
                          : `
                            border-slate-200
                            text-slate-500
                            hover:border-slate-300
                            dark:border-slate-700
                            dark:text-slate-400
                          `
                      }
                    `}
                  >
                    {option.label}
                  </button>
                )
              )}
            </div>

            {/* History list */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                overscroll-contain
                p-4
                sm:p-6
              "
            >
              {filteredRecords.length >
              0 ? (
                <div className="space-y-3">
                  {filteredRecords.map(
                    (record) => (
                      <HistoryRecordRow
                        key={record.id}
                        record={record}
                      />
                    )
                  )}
                </div>
              ) : (
                <div
                  className="
                    flex
                    min-h-72
                    flex-col
                    items-center
                    justify-center
                    px-5
                    text-center
                  "
                >
                  <div
                    className="
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-2xl
                      bg-slate-100
                      text-slate-400
                      dark:bg-slate-800
                    "
                  >
                    <History size={29} />
                  </div>

                  <h3
                    className="
                      mt-5
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    No records found
                  </h3>

                  <p
                    className="
                      mt-2
                      max-w-sm
                      text-sm
                      leading-6
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    There are no records available for the selected period.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                gap-4
                border-t
                border-slate-200
                bg-slate-50/70
                px-5
                py-4
                text-xs
                text-slate-500
                dark:border-slate-700
                dark:bg-slate-950/30
                dark:text-slate-400
                sm:px-6
              "
            >
              <span>
                {filteredRecords.length}{" "}
                record
                {filteredRecords.length ===
                1
                  ? ""
                  : "s"}
              </span>

              <button
                type="button"
                onClick={onClose}
                className="
                  rounded-xl
                  bg-slate-900
                  px-4
                  py-2
                  font-semibold
                  text-white
                  transition
                  hover:bg-slate-800
                  dark:bg-white
                  dark:text-slate-950
                  dark:hover:bg-slate-200
                "
              >
                Done
              </button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default HistoryDetailsModal;