import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CircleDollarSign,
  Loader2,
  Pencil,
  Plus,
  Target,
  Trash2,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import useGoal from "../../hooks/useGoal";

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function DashboardGoalModal({
  open,
  mode,
  goal,
  onClose,
}) {
  const {
    updateGoal,
    deleteGoal,
  } = useGoal();

  const [amount, setAmount] =
    useState("");

  const [formData, setFormData] =
    useState({
      title: "",
      targetAmount: "",
      savedAmount: "",
      deadline: "",
    });

  const [errors, setErrors] =
    useState({});

  const [submitting, setSubmitting] =
    useState(false);

  const targetAmount = getSafeNumber(
    goal?.targetAmount ??
      goal?.target ??
      goal?.amount
  );

  const savedAmount = getSafeNumber(
    goal?.savedAmount ??
      goal?.saved
  );

  const remaining = Math.max(
    targetAmount - savedAmount,
    0
  );

  const modalContent = useMemo(() => {
    if (mode === "edit") {
      return {
        title: "Edit savings goal",
        description:
          "Update the goal details and current savings progress.",
        icon: Pencil,
        iconClasses:
          "bg-blue-500/10 text-blue-500",
        buttonText: "Save Changes",
        buttonClasses:
          "from-blue-500 to-cyan-500 shadow-blue-500/20",
      };
    }

    if (mode === "delete") {
      return {
        title: "Delete savings goal",
        description:
          "This action permanently removes the selected goal.",
        icon: Trash2,
        iconClasses:
          "bg-red-500/10 text-red-500",
        buttonText: "Delete Goal",
        buttonClasses:
          "from-red-500 to-rose-600 shadow-red-500/20",
      };
    }

    return {
      title: "Add savings",
      description:
        "Add a contribution toward your financial goal.",
      icon: Plus,
      iconClasses:
        "bg-emerald-500/10 text-emerald-500",
      buttonText: "Add Savings",
      buttonClasses:
        "from-emerald-500 to-green-600 shadow-emerald-500/20",
    };
  }, [mode]);

  const ModalIcon =
    modalContent.icon;

  useEffect(() => {
    if (!open || !goal) {
      return;
    }

    setAmount("");

    setFormData({
      title: goal.title || "",
      targetAmount: String(
        targetAmount || ""
      ),
      savedAmount: String(
        savedAmount || ""
      ),
      deadline: goal.deadline || "",
    });

    setErrors({});
    setSubmitting(false);
  }, [
    open,
    goal,
    targetAmount,
    savedAmount,
  ]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  if (!open || !goal) {
    return null;
  }

  const handleFieldChange = (
    event
  ) => {
    const { name, value } =
      event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
      general: "",
    }));
  };

  const validateSavings = () => {
    const nextErrors = {};
    const numericAmount =
      getSafeNumber(amount);

    if (!amount) {
      nextErrors.amount =
        "Enter a savings amount.";
    } else if (numericAmount <= 0) {
      nextErrors.amount =
        "Amount must be greater than zero.";
    } else if (
      remaining > 0 &&
      numericAmount > remaining
    ) {
      nextErrors.amount = `Maximum remaining amount is ₹${remaining.toLocaleString(
        "en-IN"
      )}.`;
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const validateEdit = () => {
    const nextErrors = {};

    const nextTarget =
      getSafeNumber(
        formData.targetAmount
      );

    const nextSaved =
      getSafeNumber(
        formData.savedAmount
      );

    if (!formData.title.trim()) {
      nextErrors.title =
        "Goal title is required.";
    }

    if (nextTarget <= 0) {
      nextErrors.targetAmount =
        "Target must be greater than zero.";
    }

    if (nextSaved < 0) {
      nextErrors.savedAmount =
        "Saved amount cannot be negative.";
    }

    if (nextSaved > nextTarget) {
      nextErrors.savedAmount =
        "Saved amount cannot exceed the target.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setErrors({});

      if (mode === "savings") {
        if (!validateSavings()) {
          return;
        }

        const contribution =
          getSafeNumber(amount);

        const nextSavedAmount =
          targetAmount > 0
            ? Math.min(
                savedAmount +
                  contribution,
                targetAmount
              )
            : savedAmount +
              contribution;

        const result =
          await updateGoal(
            goal.id,
            {
              savedAmount:
                nextSavedAmount,

              status:
                targetAmount > 0 &&
                nextSavedAmount >=
                  targetAmount
                  ? "completed"
                  : "active",
            }
          );

        if (!result?.success) {
          throw new Error(
            result?.error ||
              "Unable to add savings."
          );
        }

        toast.success(
          "Savings added successfully."
        );

        onClose();
        return;
      }

      if (mode === "edit") {
        if (!validateEdit()) {
          return;
        }

        const nextTarget =
          getSafeNumber(
            formData.targetAmount
          );

        const nextSaved =
          getSafeNumber(
            formData.savedAmount
          );

        const result =
          await updateGoal(
            goal.id,
            {
              title:
                formData.title.trim(),

              targetAmount:
                nextTarget,

              savedAmount:
                nextSaved,

              deadline:
                formData.deadline,

              status:
                nextSaved >= nextTarget
                  ? "completed"
                  : "active",
            }
          );

        if (!result?.success) {
          throw new Error(
            result?.error ||
              "Unable to update goal."
          );
        }

        toast.success(
          "Goal updated successfully."
        );

        onClose();
        return;
      }

      if (mode === "delete") {
        const result =
          await deleteGoal(goal.id);

        if (!result?.success) {
          throw new Error(
            result?.error ||
              "Unable to delete goal."
          );
        }

        toast.success(
          "Goal deleted successfully."
        );

        onClose();
      }
    } catch (submitError) {
      console.error(
        "Goal action failed:",
        submitError
      );

      setErrors({
        general:
          submitError.message ||
          "Something went wrong.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-slate-950/70
        p-4
        backdrop-blur-sm
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
      <form
        onSubmit={handleSubmit}
        className="
          relative
          w-full
          max-w-lg
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-2xl
          dark:border-slate-800
          dark:bg-slate-900
          sm:p-7
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            h-52
            w-52
            rounded-full
            bg-cyan-500/10
            blur-3xl
          "
        />

        <div className="relative">
          <div
            className="
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <div className="flex gap-3">
              <div
                className={`
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  ${modalContent.iconClasses}
                `}
              >
                <ModalIcon size={21} />
              </div>

              <div>
                <h2
                  className="
                    text-xl
                    font-black
                    text-slate-950
                    dark:text-white
                  "
                >
                  {modalContent.title}
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    leading-6
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {modalContent.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                text-slate-500
                transition
                hover:bg-slate-100
                hover:text-slate-900
                dark:hover:bg-slate-800
                dark:hover:text-white
              "
              aria-label="Close modal"
            >
              <X size={19} />
            </button>
          </div>

          {errors.general && (
            <div
              className="
                mt-5
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-600
                dark:border-red-900
                dark:bg-red-950/30
                dark:text-red-400
              "
            >
              {errors.general}
            </div>
          )}

          {mode === "savings" && (
            <div className="mt-6">
              <div
                className="
                  mb-5
                  grid
                  grid-cols-2
                  gap-3
                "
              >
                <div
                  className="
                    rounded-2xl
                    bg-slate-50
                    p-4
                    dark:bg-slate-950/40
                  "
                >
                  <p
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    Currently saved
                  </p>

                  <p
                    className="
                      mt-1
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    ₹
                    {savedAmount.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>

                <div
                  className="
                    rounded-2xl
                    bg-cyan-50
                    p-4
                    dark:bg-cyan-950/20
                  "
                >
                  <p
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    Remaining
                  </p>

                  <p
                    className="
                      mt-1
                      font-bold
                      text-cyan-600
                      dark:text-cyan-400
                    "
                  >
                    ₹
                    {remaining.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
              </div>

              <label
                htmlFor="goalContribution"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  dark:text-slate-300
                "
              >
                Savings amount
              </label>

              <div className="relative">
                <CircleDollarSign
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  id="goalContribution"
                  type="number"
                  min="1"
                  max={
                    remaining || undefined
                  }
                  step="1"
                  value={amount}
                  onChange={(event) => {
                    setAmount(
                      event.target.value
                    );

                    setErrors({});
                  }}
                  placeholder="Enter amount"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    pl-12
                    pr-4
                    outline-none
                    transition
                    focus:border-cyan-500
                    focus:ring-4
                    focus:ring-cyan-500/10
                    dark:border-slate-700
                    dark:bg-slate-950/40
                    dark:text-white
                  "
                />
              </div>

              {errors.amount && (
                <p
                  className="
                    mt-2
                    text-xs
                    font-medium
                    text-red-500
                  "
                >
                  {errors.amount}
                </p>
              )}
            </div>
          )}

          {mode === "edit" && (
            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="goalTitle"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    dark:text-slate-300
                  "
                >
                  Goal title
                </label>

                <input
                  id="goalTitle"
                  name="title"
                  value={formData.title}
                  onChange={
                    handleFieldChange
                  }
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    outline-none
                    transition
                    focus:border-cyan-500
                    focus:ring-4
                    focus:ring-cyan-500/10
                    dark:border-slate-700
                    dark:bg-slate-950/40
                    dark:text-white
                  "
                />

                {errors.title && (
                  <p
                    className="
                      mt-2
                      text-xs
                      text-red-500
                    "
                  >
                    {errors.title}
                  </p>
                )}
              </div>

              <div
                className="
                  grid
                  gap-4
                  sm:grid-cols-2
                "
              >
                <div>
                  <label
                    htmlFor="targetAmount"
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    Target amount
                  </label>

                  <input
                    id="targetAmount"
                    name="targetAmount"
                    type="number"
                    min="1"
                    value={
                      formData.targetAmount
                    }
                    onChange={
                      handleFieldChange
                    }
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      outline-none
                      focus:border-cyan-500
                      focus:ring-4
                      focus:ring-cyan-500/10
                      dark:border-slate-700
                      dark:bg-slate-950/40
                      dark:text-white
                    "
                  />

                  {errors.targetAmount && (
                    <p
                      className="
                        mt-2
                        text-xs
                        text-red-500
                      "
                    >
                      {errors.targetAmount}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="savedAmount"
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    Saved amount
                  </label>

                  <input
                    id="savedAmount"
                    name="savedAmount"
                    type="number"
                    min="0"
                    value={
                      formData.savedAmount
                    }
                    onChange={
                      handleFieldChange
                    }
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      outline-none
                      focus:border-cyan-500
                      focus:ring-4
                      focus:ring-cyan-500/10
                      dark:border-slate-700
                      dark:bg-slate-950/40
                      dark:text-white
                    "
                  />

                  {errors.savedAmount && (
                    <p
                      className="
                        mt-2
                        text-xs
                        text-red-500
                      "
                    >
                      {errors.savedAmount}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="goalDeadline"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    dark:text-slate-300
                  "
                >
                  Deadline
                </label>

                <input
                  id="goalDeadline"
                  name="deadline"
                  type="date"
                  value={
                    formData.deadline
                  }
                  onChange={
                    handleFieldChange
                  }
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    outline-none
                    focus:border-cyan-500
                    focus:ring-4
                    focus:ring-cyan-500/10
                    dark:border-slate-700
                    dark:bg-slate-950/40
                    dark:text-white
                  "
                />
              </div>
            </div>
          )}

          {mode === "delete" && (
            <div
              className="
                mt-6
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-5
                dark:border-red-900
                dark:bg-red-950/20
              "
            >
              <p
                className="
                  text-sm
                  leading-6
                  text-slate-700
                  dark:text-slate-300
                "
              >
                Delete{" "}
                <strong>
                  {goal.title}
                </strong>
                ? The goal and its current
                progress will be permanently
                removed.
              </p>
            </div>
          )}

          <div
            className="
              mt-7
              flex
              flex-col-reverse
              gap-3
              sm:flex-row
              sm:justify-end
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="
                rounded-xl
                border
                border-slate-200
                px-5
                py-3
                font-semibold
                text-slate-700
                transition
                hover:bg-slate-50
                disabled:opacity-60
                dark:border-slate-700
                dark:text-slate-300
                dark:hover:bg-slate-800
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className={`
                flex
                min-w-40
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                px-5
                py-3
                font-bold
                text-white
                shadow-lg
                transition
                hover:-translate-y-0.5
                disabled:cursor-not-allowed
                disabled:opacity-60
                ${modalContent.buttonClasses}
              `}
            >
              {submitting ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  Processing...
                </>
              ) : (
                <>
                  <ModalIcon size={17} />
                  {modalContent.buttonText}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default DashboardGoalModal;