import {
  Activity,
  CircleDollarSign,
  Clock3,
  KeyRound,
  LogIn,
  MapPin,
  MonitorSmartphone,
  Pencil,
  ShieldAlert,
  ShieldCheck,
  Target,
  Trash2,
  UserRound,
  WalletCards,
} from "lucide-react";

import {
  formatHistoryDate,
  formatShortHistoryDate,
} from "./historyUtils";

/* =========================================================
   ICON CONFIGURATION
========================================================= */

function getIconDesign(
  iconType
) {
  switch (iconType) {
    case "transaction":
      return {
        icon: CircleDollarSign,
        classes:
          "bg-emerald-500/10 text-emerald-500",
      };

    case "budget":
      return {
        icon: WalletCards,
        classes:
          "bg-amber-500/10 text-amber-500",
      };

    case "goal":
      return {
        icon: Target,
        classes:
          "bg-violet-500/10 text-violet-500",
      };

    case "profile":
      return {
        icon: UserRound,
        classes:
          "bg-cyan-500/10 text-cyan-500",
      };

    case "security":
      return {
        icon: KeyRound,
        classes:
          "bg-rose-500/10 text-rose-500",
      };

    case "edit":
      return {
        icon: Pencil,
        classes:
          "bg-blue-500/10 text-blue-500",
      };

    case "delete":
      return {
        icon: Trash2,
        classes:
          "bg-rose-500/10 text-rose-500",
      };

    case "login-success":
      return {
        icon: ShieldCheck,
        classes:
          "bg-emerald-500/10 text-emerald-500",
      };

    case "login-failed":
      return {
        icon: ShieldAlert,
        classes:
          "bg-rose-500/10 text-rose-500",
      };

    default:
      return {
        icon: Activity,
        classes:
          "bg-cyan-500/10 text-cyan-500",
      };
  }
}

/* =========================================================
   HISTORY ROW
========================================================= */

function HistoryRecordRow({
  record,
  compact = false,
}) {
  const design =
    getIconDesign(
      record.iconType
    );

  const Icon = design.icon;

  return (
    <article
      className={`
        group
        relative
        flex
        min-w-0
        items-start
        gap-3
        rounded-2xl
        border
        border-slate-200/80
        bg-slate-50/70
        transition
        hover:border-cyan-500/25
        hover:bg-white
        dark:border-white/10
        dark:bg-white/[0.025]
        dark:hover:bg-white/[0.045]
        ${
          compact
            ? "p-3.5"
            : "p-4"
        }
      `}
    >
      <div
        className={`
          flex
          shrink-0
          items-center
          justify-center
          rounded-xl
          ${design.classes}
          ${
            compact
              ? "h-10 w-10"
              : "h-11 w-11"
          }
        `}
      >
        <Icon
          size={
            compact
              ? 17
              : 19
          }
        />
      </div>

      <div className="min-w-0 flex-1">
        <div
          className="
            flex
            min-w-0
            flex-col
            gap-1
            sm:flex-row
            sm:items-start
            sm:justify-between
            sm:gap-4
          "
        >
          <div className="min-w-0">
            <h4
              className="
                break-words
                text-sm
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              {record.title}
            </h4>

            {record.description && (
              <p
                className={`
                  mt-1
                  break-words
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                  ${
                    compact
                      ? "line-clamp-1"
                      : "leading-5"
                  }
                `}
              >
                {record.description}
              </p>
            )}
          </div>

          <div
            className="
              flex
              shrink-0
              items-center
              gap-1.5
              text-[10px]
              font-medium
              uppercase
              tracking-wide
              text-slate-400
            "
            title={
              formatHistoryDate(
                record.timestamp
              )
            }
          >
            <Clock3 size={12} />

            {formatShortHistoryDate(
              record.timestamp
            )}
          </div>
        </div>

        {record.kind === "login" && (
          <div
            className="
              mt-3
              flex
              flex-wrap
              gap-2
            "
          >
            <span
              className="
                inline-flex
                max-w-full
                items-center
                gap-1.5
                rounded-lg
                bg-slate-200/60
                px-2.5
                py-1.5
                text-[10px]
                font-medium
                text-slate-600
                dark:bg-white/[0.05]
                dark:text-slate-300
              "
            >
              <MonitorSmartphone
                size={12}
                className="shrink-0"
              />

              <span className="truncate">
                {record.device}
              </span>
            </span>

            <span
              className="
                inline-flex
                max-w-full
                items-center
                gap-1.5
                rounded-lg
                bg-slate-200/60
                px-2.5
                py-1.5
                text-[10px]
                font-medium
                text-slate-600
                dark:bg-white/[0.05]
                dark:text-slate-300
              "
            >
              <MapPin
                size={12}
                className="shrink-0"
              />

              <span className="truncate">
                {record.location}
              </span>
            </span>

            <span
              className={`
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                px-2.5
                py-1.5
                text-[10px]
                font-bold
                ${
                  record.status ===
                  "failed"
                    ? "bg-rose-500/10 text-rose-500"
                    : "bg-emerald-500/10 text-emerald-500"
                }
              `}
            >
              <LogIn size={12} />

              {record.status ===
              "failed"
                ? "Failed"
                : "Successful"}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

export default HistoryRecordRow;