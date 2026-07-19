import {
  useMemo,
  useState,
} from "react";

import {
  Activity,
  ArrowRight,
  History,
  LogIn,
} from "lucide-react";

import useActivity from "../../hooks/useActivity";
import useProfile from "../../hooks/useProfile";

import ProfileCard from "./ProfileCard";
import HistoryRecordRow from "./HistoryRecordRow";
import HistoryDetailsModal from "./HistoryDetailsModal";

import {
  getHistoryArray,
  normalizeActivities,
  normalizeLoginHistory,
} from "./historyUtils";

const PREVIEW_LIMIT = 5;

function ActivityHistoryCard() {
  const activityContext =
    useActivity() || {};

  const profileContext =
    useProfile() || {};

  const profile =
    profileContext.profile || {};

  const [
    activeTab,
    setActiveTab,
  ] = useState("activity");

  const [
    historyModalOpen,
    setHistoryModalOpen,
  ] = useState(false);

  const [
    historyFilter,
    setHistoryFilter,
  ] = useState("all");

  /* =======================================================
     READ DIFFERENT POSSIBLE CONTEXT PROPERTY NAMES
  ======================================================= */

  const rawActivities =
    activityContext.activities ??
    activityContext.activityHistory ??
    activityContext.history ??
    profile.activities ??
    [];

  const rawLoginHistory =
    activityContext.loginHistory ??
    activityContext.loginRecords ??
    activityContext.logins ??
    profile.loginHistory ??
    profile.login_history ??
    [];

  /* =======================================================
     NORMALIZED RECORDS
  ======================================================= */

  const activityRecords =
    useMemo(
      () =>
        normalizeActivities(
          getHistoryArray(
            rawActivities
          )
        ),
      [rawActivities]
    );

  const loginRecords =
    useMemo(
      () =>
        normalizeLoginHistory(
          getHistoryArray(
            rawLoginHistory
          )
        ),
      [rawLoginHistory]
    );

  const currentRecords =
    activeTab === "activity"
      ? activityRecords
      : loginRecords;

  const previewRecords =
    currentRecords.slice(
      0,
      PREVIEW_LIMIT
    );

  const hiddenRecordCount =
    Math.max(
      currentRecords.length -
        PREVIEW_LIMIT,
      0
    );

  const openCompleteHistory =
    () => {
      setHistoryFilter("all");

      setHistoryModalOpen(true);
    };

  return (
    <>
      <ProfileCard title="Activity & Login History">
        <div className="space-y-5">
          {/* Description */}

          <div
            className="
              flex
              flex-col
              gap-4
              rounded-2xl
              border
              border-cyan-500/15
              bg-gradient-to-r
              from-cyan-500/[0.07]
              via-blue-500/[0.04]
              to-violet-500/[0.07]
              p-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-start gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-cyan-500/10
                  text-cyan-500
                "
              >
                <History size={18} />
              </div>

              <div>
                <p
                  className="
                    text-sm
                    font-bold
                    text-slate-950
                    dark:text-white
                  "
                >
                  Recent account history
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Showing only your latest five records to keep this page compact.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                openCompleteHistory
              }
              className="
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-cyan-500/20
                bg-cyan-500/10
                px-4
                py-2.5
                text-xs
                font-bold
                text-cyan-600
                transition
                hover:border-cyan-500/40
                hover:bg-cyan-500/15
                dark:text-cyan-400
                sm:w-auto
              "
            >
              View all history

              <ArrowRight
                size={15}
              />
            </button>
          </div>

          {/* Tabs */}

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
                setActiveTab(
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
                      hover:text-slate-950
                      dark:text-slate-400
                      dark:hover:text-white
                    `
                }
              `}
            >
              <Activity size={16} />

              Recent Activity

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
                setActiveTab(
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
                      hover:text-slate-950
                      dark:text-slate-400
                      dark:hover:text-white
                    `
                }
              `}
            >
              <LogIn size={16} />

              Login History

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

          {/* Preview records */}

          {previewRecords.length >
          0 ? (
            <div className="space-y-3">
              {previewRecords.map(
                (record) => (
                  <HistoryRecordRow
                    key={record.id}
                    record={record}
                    compact
                  />
                )
              )}
            </div>
          ) : (
            <div
              className="
                flex
                min-h-52
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-dashed
                border-slate-300
                px-5
                text-center
                dark:border-slate-700
              "
            >
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-slate-100
                  text-slate-400
                  dark:bg-slate-800
                "
              >
                {activeTab ===
                "activity" ? (
                  <Activity
                    size={25}
                  />
                ) : (
                  <LogIn size={25} />
                )}
              </div>

              <h3
                className="
                  mt-4
                  font-bold
                  text-slate-900
                  dark:text-white
                "
              >
                {activeTab ===
                "activity"
                  ? "No recent activity"
                  : "No login history"}
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
                {activeTab ===
                "activity"
                  ? "Account changes and financial actions will appear here."
                  : "New login sessions will appear here after they are recorded."}
              </p>
            </div>
          )}

          {/* Compact footer */}

          <div
            className="
              flex
              flex-col
              gap-3
              border-t
              border-slate-200
              pt-4
              dark:border-slate-800
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <p
              className="
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              Showing{" "}
              {previewRecords.length}{" "}
              of{" "}
              {currentRecords.length}{" "}
              record
              {currentRecords.length ===
              1
                ? ""
                : "s"}
              {hiddenRecordCount > 0
                ? ` • ${hiddenRecordCount} more available`
                : ""}
            </p>

            {currentRecords.length >
              PREVIEW_LIMIT && (
              <button
                type="button"
                onClick={
                  openCompleteHistory
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-xs
                  font-bold
                  text-cyan-600
                  transition
                  hover:text-cyan-500
                  dark:text-cyan-400
                "
              >
                View remaining records

                <ArrowRight
                  size={14}
                />
              </button>
            )}
          </div>
        </div>
      </ProfileCard>

      <HistoryDetailsModal
        open={historyModalOpen}
        onClose={() =>
          setHistoryModalOpen(false)
        }
        activeTab={activeTab}
        onTabChange={
          setActiveTab
        }
        filter={historyFilter}
        onFilterChange={
          setHistoryFilter
        }
        activityRecords={
          activityRecords
        }
        loginRecords={
          loginRecords
        }
      />
    </>
  );
}

export default ActivityHistoryCard;