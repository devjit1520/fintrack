import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Target,
  Wallet,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import ProfileCard from "./ProfileCard";
import useProfile from "../../hooks/useProfile";

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function formatCurrency(
  amount,
  currency = "INR"
) {
  try {
    return new Intl.NumberFormat(
      currency === "INR"
        ? "en-IN"
        : "en-US",
      {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }
    ).format(amount);
  } catch {
    return `₹${amount.toLocaleString(
      "en-IN"
    )}`;
  }
}

function FinancialGoalCard() {
  const {
    profile,
    updateMonthlySavingGoal,
    addMonthlySavings,
    resetMonthlySavingGoal,
  } = useProfile();

  const currency =
    profile.preferences?.currency ||
    "INR";

  const goal =
    profile.monthlySavingGoal || {
      target: 0,
      saved: 0,
    };

  const target =
    getSafeNumber(goal.target);

  const saved =
    getSafeNumber(goal.saved);

  const progress = useMemo(() => {
    if (target <= 0) {
      return 0;
    }

    return Math.min(
      Math.round(
        (saved / target) * 100
      ),
      100
    );
  }, [saved, target]);

  const remaining = Math.max(
    target - saved,
    0
  );

  const completed =
    target > 0 &&
    saved >= target;

  const today = new Date();

  const lastDayOfMonth =
    new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

  const daysLeft = Math.max(
    lastDayOfMonth.getDate() -
      today.getDate(),
    0
  );

  const [editOpen, setEditOpen] =
    useState(false);

  const [addOpen, setAddOpen] =
    useState(false);

  const [targetInput, setTargetInput] =
    useState(String(target));

  const [savingInput, setSavingInput] =
    useState("");

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    setTargetInput(String(target));
  }, [target]);

  useEffect(() => {
    if (!successMessage) return;

    const timeout =
      window.setTimeout(() => {
        setSuccessMessage("");
      }, 2500);

    return () =>
      window.clearTimeout(timeout);
  }, [successMessage]);

  const handleTargetSave = () => {
    const numericTarget =
      Number(targetInput);

    if (
      !Number.isFinite(numericTarget) ||
      numericTarget <= 0
    ) {
      setError(
        "Enter a valid target amount greater than zero."
      );

      return;
    }

    updateMonthlySavingGoal({
      target: numericTarget,
    });

    setEditOpen(false);
    setError("");
    setSuccessMessage(
      "Monthly saving target updated."
    );
  };

  const handleAddSavings = () => {
    const numericAmount =
      Number(savingInput);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setError(
        "Enter a valid savings amount greater than zero."
      );

      return;
    }

    const added =
      addMonthlySavings(
        numericAmount
      );

    if (!added) {
      setError(
        "Unable to add savings."
      );

      return;
    }

    setSavingInput("");
    setAddOpen(false);
    setError("");
    setSuccessMessage(
      "Savings added successfully."
    );
  };

  const handleReset = () => {
    const confirmed =
      window.confirm(
        "Reset your monthly saving goal and saved amount?"
      );

    if (!confirmed) return;

    resetMonthlySavingGoal();

    setEditOpen(false);
    setAddOpen(false);
    setSavingInput("");
    setError("");
    setSuccessMessage(
      "Monthly saving goal reset."
    );
  };

  return (
    <ProfileCard title="Monthly Saving Goal">
      <div className="space-y-6">
        {completed && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-emerald-200
              bg-emerald-50
              p-4
              text-emerald-700
              dark:border-emerald-900
              dark:bg-emerald-950/30
              dark:text-emerald-400
            "
          >
            <CheckCircle2 size={22} />

            <div>
              <p className="font-semibold">
                Goal completed
              </p>

              <p className="text-sm">
                You reached your monthly saving target.
              </p>
            </div>
          </motion.div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div
            className="
              rounded-2xl
              border
              border-cyan-200
              bg-cyan-50
              p-5
              dark:border-cyan-900
              dark:bg-cyan-950/30
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-cyan-100
                  text-cyan-600
                  dark:bg-cyan-900/50
                  dark:text-cyan-400
                "
              >
                <Target size={21} />
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditOpen(true);
                  setAddOpen(false);
                  setError("");
                }}
                className="
                  rounded-lg
                  p-2
                  text-cyan-600
                  transition
                  hover:bg-cyan-100
                  dark:text-cyan-400
                  dark:hover:bg-cyan-900/50
                "
                aria-label="Edit saving target"
              >
                <Pencil size={17} />
              </button>
            </div>

            <p
              className="
                mt-4
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Monthly target
            </p>

            <h3
              className="
                mt-1
                text-2xl
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              {formatCurrency(
                target,
                currency
              )}
            </h3>
          </div>

          <div
            className="
              rounded-2xl
              border
              border-emerald-200
              bg-emerald-50
              p-5
              dark:border-emerald-900
              dark:bg-emerald-950/30
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-100
                  text-emerald-600
                  dark:bg-emerald-900/50
                  dark:text-emerald-400
                "
              >
                <Wallet size={21} />
              </div>

              <button
                type="button"
                onClick={() => {
                  setAddOpen(true);
                  setEditOpen(false);
                  setError("");
                }}
                className="
                  rounded-lg
                  p-2
                  text-emerald-600
                  transition
                  hover:bg-emerald-100
                  dark:text-emerald-400
                  dark:hover:bg-emerald-900/50
                "
                aria-label="Add savings"
              >
                <Plus size={18} />
              </button>
            </div>

            <p
              className="
                mt-4
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Amount saved
            </p>

            <h3
              className="
                mt-1
                text-2xl
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              {formatCurrency(
                saved,
                currency
              )}
            </h3>
          </div>
        </div>

        <div>
          <div
            className="
              mb-2
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <span
              className="
                text-sm
                font-medium
                text-slate-600
                dark:text-slate-300
              "
            >
              Monthly progress
            </span>

            <span
              className="
                text-sm
                font-semibold
                text-cyan-600
                dark:text-cyan-400
              "
            >
              {progress}%
            </span>
          </div>

          <div
            className="
              h-4
              overflow-hidden
              rounded-full
              bg-slate-200
              dark:bg-slate-800
            "
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${progress}%`,
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
              "
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              p-4
              dark:border-slate-800
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                text-orange-500
              "
            >
              <CircleDollarSign size={18} />

              <span className="text-sm font-medium">
                Remaining
              </span>
            </div>

            <p
              className="
                mt-2
                text-xl
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              {formatCurrency(
                remaining,
                currency
              )}
            </p>
          </div>

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              p-4
              dark:border-slate-800
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                text-violet-500
              "
            >
              <CalendarDays size={18} />

              <span className="text-sm font-medium">
                Days left
              </span>
            </div>

            <p
              className="
                mt-2
                text-xl
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              {daysLeft} days
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {editOpen && (
            <motion.div
              key="edit-target"
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="
                overflow-hidden
                rounded-2xl
                border
                border-cyan-200
                bg-cyan-50
                dark:border-cyan-900
                dark:bg-cyan-950/20
              "
            >
              <div className="p-5">
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <h4
                    className="
                      font-semibold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    Edit monthly target
                  </h4>

                  <button
                    type="button"
                    onClick={() => {
                      setEditOpen(false);
                      setTargetInput(
                        String(target)
                      );
                      setError("");
                    }}
                    className="
                      rounded-lg
                      p-2
                      text-slate-500
                      transition
                      hover:bg-white
                      dark:hover:bg-slate-900
                    "
                  >
                    <X size={18} />
                  </button>
                </div>

                <input
                  type="number"
                  min="1"
                  value={targetInput}
                  onChange={(event) => {
                    setTargetInput(
                      event.target.value
                    );
                    setError("");
                  }}
                  className="
                    mt-4
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
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
                  placeholder="Enter target amount"
                />

                <button
                  type="button"
                  onClick={handleTargetSave}
                  className="
                    mt-4
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-cyan-500
                    px-5
                    py-3
                    font-semibold
                    text-white
                    transition
                    hover:bg-cyan-600
                  "
                >
                  <Save size={17} />
                  Save Target
                </button>
              </div>
            </motion.div>
          )}

          {addOpen && (
            <motion.div
              key="add-savings"
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="
                overflow-hidden
                rounded-2xl
                border
                border-emerald-200
                bg-emerald-50
                dark:border-emerald-900
                dark:bg-emerald-950/20
              "
            >
              <div className="p-5">
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <h4
                    className="
                      font-semibold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    Add savings
                  </h4>

                  <button
                    type="button"
                    onClick={() => {
                      setAddOpen(false);
                      setSavingInput("");
                      setError("");
                    }}
                    className="
                      rounded-lg
                      p-2
                      text-slate-500
                      transition
                      hover:bg-white
                      dark:hover:bg-slate-900
                    "
                  >
                    <X size={18} />
                  </button>
                </div>

                <input
                  type="number"
                  min="1"
                  value={savingInput}
                  onChange={(event) => {
                    setSavingInput(
                      event.target.value
                    );
                    setError("");
                  }}
                  className="
                    mt-4
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    text-slate-900
                    outline-none
                    transition
                    focus:border-emerald-500
                    focus:ring-4
                    focus:ring-emerald-500/10
                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-white
                  "
                  placeholder="Enter amount to add"
                />

                <button
                  type="button"
                  onClick={handleAddSavings}
                  className="
                    mt-4
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-emerald-500
                    px-5
                    py-3
                    font-semibold
                    text-white
                    transition
                    hover:bg-emerald-600
                  "
                >
                  <Plus size={17} />
                  Add Savings
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div
            className="
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              font-medium
              text-red-600
              dark:border-red-900
              dark:bg-red-950/30
            "
          >
            {error}
          </div>
        )}

        {successMessage && (
          <div
            className="
              rounded-xl
              border
              border-emerald-200
              bg-emerald-50
              px-4
              py-3
              text-sm
              font-medium
              text-emerald-700
              dark:border-emerald-900
              dark:bg-emerald-950/30
              dark:text-emerald-400
            "
          >
            {successMessage}
          </div>
        )}

        <div
          className="
            flex
            flex-col
            gap-3
            sm:flex-row
          "
        >
          <button
            type="button"
            onClick={() => {
              setAddOpen(true);
              setEditOpen(false);
              setError("");
            }}
            className="
              flex
              flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-cyan-500
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-cyan-600
            "
          >
            <Plus size={18} />
            Add Savings
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-300
              px-5
              py-3
              font-medium
              text-slate-700
              transition
              hover:bg-slate-100
              dark:border-slate-700
              dark:text-slate-200
              dark:hover:bg-slate-800
            "
          >
            <RotateCcw size={17} />
            Reset
          </button>
        </div>
      </div>
    </ProfileCard>
  );
}

export default FinancialGoalCard;