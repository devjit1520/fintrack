import { motion } from "framer-motion";

import {
  ArrowDownLeft,
  ArrowUpRight,
  History,
  LayoutDashboard,
  Landmark,
} from "lucide-react";

/* =========================================================
   TAB CONFIGURATION
========================================================= */

const debtTabs = [
  {
    id: "overview",
    label: "Overview",
    shortLabel: "Overview",
    description: "Complete debt summary",
    icon: LayoutDashboard,
  },

  {
    id: "loans",
    label: "Loans & EMI",
    shortLabel: "Loans",
    description: "Loans and installments",
    icon: Landmark,
  },

  {
    id: "borrowed",
    label: "Money Borrowed",
    shortLabel: "Borrowed",
    description: "Money you currently owe",
    icon: ArrowDownLeft,
  },

  {
    id: "lent",
    label: "Money Lent",
    shortLabel: "Lent",
    description: "Money others owe you",
    icon: ArrowUpRight,
  },

  {
    id: "history",
    label: "Payment History",
    shortLabel: "History",
    description: "Repayment activity",
    icon: History,
  },
];

/* =========================================================
   DEBT TAB BUTTON
========================================================= */

function DebtTabButton({
  tab,
  active,
  onClick,
}) {
  const Icon = tab.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-selected={active}
      role="tab"
      className={`
        group
        relative
        min-w-[145px]
        flex-1
        overflow-hidden
        rounded-2xl
        border
        px-3
        py-3
        text-left
        outline-none
        transition-all
        duration-300
        focus-visible:ring-4
        focus-visible:ring-blue-500/10
        sm:min-w-[160px]
        ${
          active
            ? `
              border-blue-500/20
              bg-white
              shadow-md
              shadow-blue-500/[0.06]
              dark:border-blue-400/15
              dark:bg-white/[0.07]
            `
            : `
              border-transparent
              bg-transparent
              hover:border-slate-200
              hover:bg-white/70
              dark:hover:border-white/[0.06]
              dark:hover:bg-white/[0.035]
            `
        }
      `}
    >
      {/* Active background */}

      {active && (
        <motion.div
          layoutId="debt-tab-active-background"
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 36,
          }}
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-br
            from-cyan-500/[0.05]
            via-blue-500/[0.04]
            to-violet-500/[0.06]
          "
        />
      )}

      {/* Active bottom indicator */}

      {active && (
        <motion.div
          layoutId="debt-tab-indicator"
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 36,
          }}
          className="
            absolute
            bottom-0
            left-3
            right-3
            h-[3px]
            rounded-full
            bg-gradient-to-r
            from-cyan-400
            via-blue-500
            to-violet-500
            shadow-[0_0_12px_rgba(59,130,246,0.45)]
          "
        />
      )}

      <div
        className="
          relative
          flex
          min-w-0
          items-center
          gap-3
        "
      >
        {/* Icon */}

        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            transition-all
            duration-300
            ${
              active
                ? `
                  bg-gradient-to-br
                  from-cyan-500
                  via-blue-500
                  to-violet-500
                  text-white
                  shadow-lg
                  shadow-blue-500/20
                `
                : `
                  bg-slate-100
                  text-slate-500
                  group-hover:bg-blue-500/10
                  group-hover:text-blue-600
                  dark:bg-white/[0.05]
                  dark:text-slate-400
                  dark:group-hover:text-blue-300
                `
            }
          `}
        >
          <Icon size={17} />
        </div>

        {/* Text */}

        <div className="min-w-0">
          <p
            className={`
              truncate
              text-[11px]
              font-black
              transition-colors
              ${
                active
                  ? `
                    text-blue-700
                    dark:text-blue-300
                  `
                  : `
                    text-slate-700
                    group-hover:text-slate-950
                    dark:text-slate-300
                    dark:group-hover:text-white
                  `
              }
            `}
          >
            <span className="sm:hidden">
              {tab.shortLabel}
            </span>

            <span className="hidden sm:inline">
              {tab.label}
            </span>
          </p>

          <p
            className="
              mt-0.5
              hidden
              truncate
              text-[8px]
              font-medium
              text-slate-400
              xl:block
              dark:text-slate-500
            "
          >
            {tab.description}
          </p>
        </div>
      </div>
    </button>
  );
}

/* =========================================================
   DEBT TABS
========================================================= */

function DebtTabs({
  activeTab = "overview",
  onTabChange,
}) {
  const handleTabChange = (
    tabId
  ) => {
    if (
      tabId === activeTab
    ) {
      return;
    }

    onTabChange?.(tabId);
  };

  return (
    <div
      className="
        relative
        min-w-0
        overflow-hidden
        rounded-[24px]
        border
        border-slate-200/80
        bg-slate-100/80
        p-2
        shadow-sm
        backdrop-blur-xl
        dark:border-white/[0.07]
        dark:bg-[#081326]/90
      "
    >
      {/* Decorative glow */}

      <div
        className="
          pointer-events-none
          absolute
          -left-16
          -top-20
          h-40
          w-40
          rounded-full
          bg-cyan-500/[0.05]
          blur-[70px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          right-10
          h-44
          w-44
          rounded-full
          bg-violet-500/[0.05]
          blur-[80px]
        "
      />

      {/* Scrollable tab area */}

      <div
        role="tablist"
        aria-label="Debt Center navigation"
        className="
          relative
          flex
          min-w-0
          gap-2
          overflow-x-auto
          scroll-smooth
          pb-1
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
          xl:overflow-visible
          xl:pb-0
        "
      >
        {debtTabs.map((tab) => (
          <DebtTabButton
            key={tab.id}
            tab={tab}
            active={
              activeTab === tab.id
            }
            onClick={() =>
              handleTabChange(
                tab.id
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

export default DebtTabs; 