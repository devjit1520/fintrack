import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  ArrowDown,
  ArrowLeftRight,
  ArrowUp,
  BarChart3,
  BriefcaseBusiness,
  Clock3,
  CornerDownLeft,
  LayoutDashboard,
  Mail,
  MapPin,
  PiggyBank,
  ReceiptText,
  Search,
  Sparkles,
  Target,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import useFinance from "../../hooks/useFinance";
import useBudget from "../../hooks/useBudget";
import useGoal from "../../hooks/useGoal";
import useProfile from "../../hooks/useProfile";

/* =========================================================
   CONSTANTS
========================================================= */

const RECENT_SEARCH_KEY =
  "fintrack-recent-searches";

const SITE_PAGES = [
  {
    id: "page-dashboard",
    group: "Pages",
    title: "Dashboard",
    description:
      "View your financial overview, balance and recent activity.",
    path: "/dashboard",
    icon: LayoutDashboard,
    keywords:
      "home overview balance income expense recent activity statistics",
  },
  {
    id: "page-transactions",
    group: "Pages",
    title: "Transactions",
    description:
      "Search, filter, add, edit and delete transactions.",
    path: "/transactions",
    icon: ArrowLeftRight,
    keywords:
      "transactions income expenses records payments history add edit delete",
  },
  {
    id: "page-budget",
    group: "Pages",
    title: "Budget",
    description:
      "Create category budgets and monitor spending limits.",
    path: "/budget",
    icon: WalletCards,
    keywords:
      "budget spending limit category remaining warning overspending",
  },
  {
    id: "page-goals",
    group: "Pages",
    title: "Goals",
    description:
      "Create and manage financial savings goals.",
    path: "/goals",
    icon: Target,
    keywords:
      "goals savings target deadline progress contribution",
  },
  {
    id: "page-analytics",
    group: "Pages",
    title: "Analytics",
    description:
      "Explore income, expense and savings reports.",
    path: "/analytics",
    icon: BarChart3,
    keywords:
      "analytics charts reports insights trends category pie monthly",
  },
  {
    id: "page-profile",
    group: "Pages",
    title: "Profile",
    description:
      "Manage your personal information and account settings.",
    path: "/profile",
    icon: UserRound,
    keywords:
      "profile personal information avatar security notifications preferences backup",
  },
  {
    id: "feature-add-income",
    group: "Features",
    title: "Add Income",
    description:
      "Record salary, freelance income or other money received.",
    path: "/transactions",
    icon: ReceiptText,
    keywords:
      "add income salary money received transaction",
  },
  {
    id: "feature-add-expense",
    group: "Features",
    title: "Add Expense",
    description:
      "Record a new purchase, bill or other expense.",
    path: "/transactions",
    icon: ReceiptText,
    keywords:
      "add expense purchase bill spending transaction",
  },
  {
    id: "feature-create-budget",
    group: "Features",
    title: "Create Budget",
    description:
      "Create a new spending limit for a category.",
    path: "/budget",
    icon: PiggyBank,
    keywords:
      "new budget create category limit",
  },
  {
    id: "feature-create-goal",
    group: "Features",
    title: "Create Savings Goal",
    description:
      "Set a financial target and deadline.",
    path: "/goals",
    icon: Target,
    keywords:
      "new goal create savings target deadline",
  },
  {
    id: "feature-profile-info",
    group: "Features",
    title: "Edit Personal Information",
    description:
      "Update your name, profession, email and location.",
    path: "/profile",
    icon: UserRound,
    keywords:
      "edit personal information name profession email phone city state country",
  },
];

const GROUP_ORDER = [
  "Pages",
  "Features",
  "Transactions",
  "Budgets",
  "Goals",
  "Profile",
];

/* =========================================================
   HELPERS
========================================================= */

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(getSafeNumber(value));
}

function getSearchScore(result, query) {
  const normalizedQuery =
    normalizeText(query);

  const normalizedTitle =
    normalizeText(result.title);

  const searchableText =
    normalizeText(
      [
        result.title,
        result.description,
        result.keywords,
      ].join(" ")
    );

  if (!normalizedQuery) {
    return 0;
  }

  let score = 0;

  if (
    normalizedTitle === normalizedQuery
  ) {
    score += 150;
  }

  if (
    normalizedTitle.startsWith(
      normalizedQuery
    )
  ) {
    score += 100;
  }

  if (
    normalizedTitle.includes(
      normalizedQuery
    )
  ) {
    score += 70;
  }

  if (
    searchableText.includes(
      normalizedQuery
    )
  ) {
    score += 40;
  }

  normalizedQuery
    .split(" ")
    .filter(Boolean)
    .forEach((word) => {
      if (
        normalizedTitle.includes(word)
      ) {
        score += 20;
      } else if (
        searchableText.includes(word)
      ) {
        score += 8;
      }
    });

  return score;
}

function readRecentSearches() {
  try {
    const stored =
      localStorage.getItem(
        RECENT_SEARCH_KEY
      );

    const parsed = stored
      ? JSON.parse(stored)
      : [];

    return Array.isArray(parsed)
      ? parsed.slice(0, 6)
      : [];
  } catch {
    return [];
  }
}

function HighlightedText({
  text,
  query,
}) {
  const value = String(text || "");

  if (!query.trim()) {
    return value;
  }

  const escapedQuery =
    query.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

  const parts = value.split(
    new RegExp(
      `(${escapedQuery})`,
      "gi"
    )
  );

  return parts.map((part, index) =>
    part.toLowerCase() ===
    query.toLowerCase() ? (
      <mark
        key={`${part}-${index}`}
        className="rounded bg-cyan-500/15 px-0.5 text-cyan-600 dark:text-cyan-300"
      >
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>
        {part}
      </span>
    )
  );
}

/* =========================================================
   RESULT ITEM
========================================================= */

function SearchResultItem({
  result,
  query,
  active,
  index,
  onSelect,
  onHover,
}) {
  const Icon = result.icon;

  return (
    <button
      type="button"
      data-search-result={index}
      onMouseEnter={() =>
        onHover(index)
      }
      onClick={() =>
        onSelect(result)
      }
      className={`
        group
        flex
        w-full
        items-center
        gap-4
        rounded-2xl
        border
        px-4
        py-3.5
        text-left
        transition
        ${
          active
            ? `
              border-cyan-500/30
              bg-cyan-500/[0.08]
              shadow-sm
            `
            : `
              border-transparent
              hover:border-slate-200
              hover:bg-slate-100/70
              dark:hover:border-slate-700
              dark:hover:bg-white/[0.04]
            `
        }
      `}
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
          transition
          ${
            active
              ? "bg-cyan-500 text-white"
              : "bg-slate-100 text-slate-500 group-hover:bg-cyan-500/10 group-hover:text-cyan-500 dark:bg-slate-800"
          }
        `}
      >
        <Icon size={19} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
          <HighlightedText
            text={result.title}
            query={query}
          />
        </p>

        <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
          <HighlightedText
            text={
              result.description
            }
            query={query}
          />
        </p>
      </div>

      <div
        className={`
          hidden
          items-center
          gap-1
          text-xs
          font-medium
          sm:flex
          ${
            active
              ? "text-cyan-500"
              : "text-slate-400"
          }
        `}
      >
        Open

        <CornerDownLeft size={14} />
      </div>
    </button>
  );
}

/* =========================================================
   GLOBAL SEARCH
========================================================= */

function GlobalSearch({
  open,
  onClose,
}) {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const {
    transactions = [],
  } = useFinance() || {};

  const {
    budgets = [],
  } = useBudget() || {};

  const {
    goals = [],
  } = useGoal() || {};

  const {
    profile = {},
  } = useProfile() || {};

  const [query, setQuery] =
    useState("");

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const [
    recentSearches,
    setRecentSearches,
  ] = useState(
    readRecentSearches
  );

  /* =======================================================
     CREATE SEARCH INDEX
  ======================================================= */

  const searchIndex = useMemo(() => {
    const dynamicResults = [];

    transactions.forEach(
      (transaction, index) => {
        const title =
          transaction.title ||
          transaction.category ||
          "Transaction";

        dynamicResults.push({
          id: `transaction-${
            transaction.id || index
          }`,
          group: "Transactions",
          title,
          description: `${
            transaction.type ===
            "income"
              ? "Income"
              : "Expense"
          } • ${formatCurrency(
            transaction.amount
          )} • ${
            transaction.category ||
            "Uncategorized"
          }`,
          keywords: [
            transaction.title,
            transaction.category,
            transaction.type,
            transaction.note,
            transaction.date,
            transaction.amount,
          ].join(" "),
          path: "/transactions",
          icon: ReceiptText,
        });
      }
    );

    budgets.forEach(
      (budget, index) => {
        const category =
          budget.category ||
          "General";

        dynamicResults.push({
          id: `budget-${
            budget.id || index
          }`,
          group: "Budgets",
          title: `${category} Budget`,
          description: `Budget limit ${formatCurrency(
            budget.amount ??
              budget.limit
          )}`,
          keywords: [
            category,
            budget.amount,
            budget.limit,
            "budget spending limit",
          ].join(" "),
          path: "/budget",
          icon: PiggyBank,
        });
      }
    );

    goals.forEach(
      (goal, index) => {
        const saved =
          goal.savedAmount ??
          goal.saved ??
          0;

        const target =
          goal.targetAmount ??
          goal.target ??
          goal.amount ??
          0;

        dynamicResults.push({
          id: `goal-${
            goal.id || index
          }`,
          group: "Goals",
          title:
            goal.title ||
            "Savings Goal",
          description: `${formatCurrency(
            saved
          )} saved of ${formatCurrency(
            target
          )}`,
          keywords: [
            goal.title,
            goal.status,
            goal.deadline,
            saved,
            target,
            "goal savings target",
          ].join(" "),
          path: "/goals",
          icon: Target,
        });
      }
    );

    const displayName =
      profile.name ||
      [
        profile.firstName,
        profile.lastName,
      ]
        .filter(Boolean)
        .join(" ") ||
      "FinTrack User";

    dynamicResults.push({
      id: "profile-current-user",
      group: "Profile",
      title: displayName,
      description:
        profile.role ||
        "FinTrack profile",
      keywords: [
        displayName,
        profile.email,
        profile.phone,
        profile.role,
        profile.location,
        profile.city,
        profile.state,
        profile.country,
        profile.bio,
        profile.website,
      ].join(" "),
      path: "/profile",
      icon: UserRound,
    });

    if (profile.email) {
      dynamicResults.push({
        id: "profile-email",
        group: "Profile",
        title: profile.email,
        description:
          "Profile email address",
        keywords: `${profile.email} email contact`,
        path: "/profile",
        icon: Mail,
      });
    }

    if (
      profile.location ||
      profile.city
    ) {
      const location =
        profile.location ||
        [
          profile.city,
          profile.state,
          profile.country,
        ]
          .filter(Boolean)
          .join(", ");

      dynamicResults.push({
        id: "profile-location",
        group: "Profile",
        title: location,
        description:
          "Profile location",
        keywords: `${location} city state country address`,
        path: "/profile",
        icon: MapPin,
      });
    }

    if (profile.role) {
      dynamicResults.push({
        id: "profile-role",
        group: "Profile",
        title: profile.role,
        description:
          "Professional role",
        keywords: `${profile.role} profession job career`,
        path: "/profile",
        icon: BriefcaseBusiness,
      });
    }

    return [
      ...SITE_PAGES,
      ...dynamicResults,
    ];
  }, [
    transactions,
    budgets,
    goals,
    profile,
  ]);

  /* =======================================================
     FILTER RESULTS
  ======================================================= */

  const results = useMemo(() => {
    const cleanQuery =
      query.trim();

    if (!cleanQuery) {
      return SITE_PAGES.slice(0, 6);
    }

    return searchIndex
      .map((result) => ({
        ...result,
        score: getSearchScore(
          result,
          cleanQuery
        ),
      }))
      .filter(
        (result) =>
          result.score > 0
      )
      .sort(
        (first, second) =>
          second.score -
          first.score
      )
      .slice(0, 30);
  }, [query, searchIndex]);

  const groupedResults =
    useMemo(() => {
      return GROUP_ORDER.reduce(
        (groups, groupName) => {
          const groupItems =
            results.filter(
              (result) =>
                result.group ===
                groupName
            );

          if (groupItems.length) {
            groups[groupName] =
              groupItems;
          }

          return groups;
        },
        {}
      );
    }, [results]);

  /* =======================================================
     MODAL EFFECTS
  ======================================================= */

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    setActiveIndex(0);

    const timeoutId =
      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 80);

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      window.clearTimeout(
        timeoutId
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const selectedElement =
      document.querySelector(
        `[data-search-result="${activeIndex}"]`
      );

    selectedElement?.scrollIntoView({
      block: "nearest",
    });
  }, [activeIndex]);

  /* =======================================================
     ACTIONS
  ======================================================= */

  const saveRecentSearch = (
    searchValue
  ) => {
    const value =
      searchValue.trim();

    if (!value) {
      return;
    }

    const updated = [
      value,
      ...recentSearches.filter(
        (item) =>
          item.toLowerCase() !==
          value.toLowerCase()
      ),
    ].slice(0, 6);

    setRecentSearches(updated);

    localStorage.setItem(
      RECENT_SEARCH_KEY,
      JSON.stringify(updated)
    );
  };

  const selectResult = (
    result
  ) => {
    saveRecentSearch(
      query || result.title
    );

    navigate(result.path, {
      state: {
        globalSearch: {
          query:
            query || result.title,
          resultId: result.id,
          resultGroup:
            result.group,
        },
      },
    });

    setQuery("");
    onClose();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);

    localStorage.removeItem(
      RECENT_SEARCH_KEY
    );
  };

  const handleKeyDown = (
    event
  ) => {
    if (event.key === "Escape") {
      onClose();
      return;
    }

    if (
      event.key === "ArrowDown"
    ) {
      event.preventDefault();

      setActiveIndex(
        (current) =>
          results.length
            ? (current + 1) %
              results.length
            : 0
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex(
        (current) =>
          results.length
            ? (current - 1 +
                results.length) %
              results.length
            : 0
      );
    }

    if (
      event.key === "Enter" &&
      results[activeIndex]
    ) {
      event.preventDefault();

      selectResult(
        results[activeIndex]
      );
    }
  };

  let resultIndex = -1;

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
          className="
            fixed
            inset-0
            z-[120]
            flex
            items-start
            justify-center
            bg-slate-950/65
            px-4
            pb-8
            pt-20
            backdrop-blur-md
            sm:pt-24
          "
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: -18,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -18,
              scale: 0.97,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              w-full
              max-w-3xl
              overflow-hidden
              rounded-[28px]
              border
              border-slate-200
              bg-white
              shadow-2xl
              shadow-black/30
              dark:border-slate-700
              dark:bg-[#0d172a]
            "
            onKeyDown={
              handleKeyDown
            }
          >
            {/* Search input */}

            <div
              className="
                relative
                flex
                items-center
                gap-4
                border-b
                border-slate-200
                px-5
                py-4
                dark:border-slate-700
              "
            >
              <Search
                size={23}
                className="shrink-0 text-cyan-500"
              />

              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value
                  )
                }
                placeholder="Search FinTrack..."
                autoComplete="off"
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  text-lg
                  font-medium
                  text-slate-900
                  outline-none
                  placeholder:text-slate-400
                  dark:text-white
                "
              />

              {query && (
                <button
                  type="button"
                  onClick={() =>
                    setQuery("")
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    text-slate-400
                    transition
                    hover:bg-slate-100
                    hover:text-slate-900
                    dark:hover:bg-slate-800
                    dark:hover:text-white
                  "
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="
                  hidden
                  rounded-lg
                  border
                  border-slate-200
                  px-2
                  py-1
                  text-xs
                  font-medium
                  text-slate-500
                  dark:border-slate-700
                  sm:block
                "
              >
                ESC
              </button>
            </div>

            {/* Search description */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                border-b
                border-slate-100
                bg-slate-50/70
                px-5
                py-2.5
                text-xs
                text-slate-500
                dark:border-slate-800
                dark:bg-slate-950/30
                dark:text-slate-400
              "
            >
              <span className="flex items-center gap-2">
                <Sparkles
                  size={14}
                  className="text-cyan-500"
                />

                Search pages, transactions,
                budgets, goals and profile data
              </span>

              {query && (
                <span>
                  {results.length} result
                  {results.length === 1
                    ? ""
                    : "s"}
                </span>
              )}
            </div>

            {/* Results */}

            <div
              className="
                max-h-[min(65vh,600px)]
                overflow-y-auto
                p-3
              "
            >
              {!query &&
                recentSearches.length >
                  0 && (
                  <div className="mb-4">
                    <div
                      className="
                        mb-2
                        flex
                        items-center
                        justify-between
                        px-2
                      "
                    >
                      <p
                        className="
                          flex
                          items-center
                          gap-2
                          text-xs
                          font-bold
                          uppercase
                          tracking-[0.14em]
                          text-slate-400
                        "
                      >
                        <Clock3 size={14} />
                        Recent searches
                      </p>

                      <button
                        type="button"
                        onClick={
                          clearRecentSearches
                        }
                        className="text-xs font-medium text-slate-400 transition hover:text-rose-500"
                      >
                        Clear
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 px-2">
                      {recentSearches.map(
                        (recentSearch) => (
                          <button
                            key={
                              recentSearch
                            }
                            type="button"
                            onClick={() =>
                              setQuery(
                                recentSearch
                              )
                            }
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-full
                              border
                              border-slate-200
                              bg-slate-50
                              px-3
                              py-1.5
                              text-xs
                              text-slate-600
                              transition
                              hover:border-cyan-500/30
                              hover:text-cyan-600
                              dark:border-slate-700
                              dark:bg-slate-900
                              dark:text-slate-300
                            "
                          >
                            <Clock3
                              size={13}
                            />

                            {recentSearch}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

              {results.length === 0 ? (
                <div
                  className="
                    flex
                    min-h-72
                    flex-col
                    items-center
                    justify-center
                    px-6
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
                    <Search size={29} />
                  </div>

                  <h3 className="mt-5 font-bold text-slate-900 dark:text-white">
                    No results found
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Try searching for a page,
                    transaction, budget category,
                    savings goal or profile detail.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {Object.entries(
                    groupedResults
                  ).map(
                    ([
                      groupName,
                      groupItems,
                    ]) => (
                      <section
                        key={
                          groupName
                        }
                      >
                        <p
                          className="
                            mb-2
                            px-2
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.16em]
                            text-slate-400
                          "
                        >
                          {groupName}
                        </p>

                        <div className="space-y-1">
                          {groupItems.map(
                            (result) => {
                              resultIndex += 1;

                              return (
                                <SearchResultItem
                                  key={
                                    result.id
                                  }
                                  result={
                                    result
                                  }
                                  query={
                                    query
                                  }
                                  index={
                                    resultIndex
                                  }
                                  active={
                                    activeIndex ===
                                    resultIndex
                                  }
                                  onSelect={
                                    selectResult
                                  }
                                  onHover={
                                    setActiveIndex
                                  }
                                />
                              );
                            }
                          )}
                        </div>
                      </section>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Keyboard footer */}

            <div
              className="
                hidden
                items-center
                justify-between
                border-t
                border-slate-200
                bg-slate-50/70
                px-5
                py-3
                text-xs
                text-slate-500
                dark:border-slate-700
                dark:bg-slate-950/30
                sm:flex
              "
            >
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <kbd className="rounded border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
                    <ArrowUp size={12} />
                  </kbd>

                  <kbd className="rounded border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
                    <ArrowDown size={12} />
                  </kbd>

                  Navigate
                </span>

                <span className="flex items-center gap-2">
                  <kbd className="rounded border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
                    <CornerDownLeft
                      size={12}
                    />
                  </kbd>

                  Open
                </span>
              </div>

              <span>
                FinTrack global search
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default GlobalSearch;