import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import toast from "react-hot-toast";

import {
  AlertCircle,
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  HandCoins,
  IndianRupee,
  Landmark,
  ReceiptText,
  Save,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react";

import useDebt from "../../hooks/useDebt";

import {
  calculateDebtProgress,
  calculatePaidAmount,
  calculateRemainingAmount,
  formatDebtCurrency,
  formatDebtDateInput,
  getDebtTypeLabel,
  normalizeDebtRecord,
} from "../../utils/debtCalculations";

/* =========================================================
   TODAY FOR DATE INPUT
========================================================= */

function getTodayInputValue() {
  return formatDebtDateInput(
    new Date()
  );
}

/* =========================================================
   SAFE NUMBER
========================================================= */

function toSafeNumber(value) {
  const number =
    Number(value);

  return Number.isFinite(number)
    ? Math.max(0, number)
    : 0;
}

/* =========================================================
   PREVIEW METRIC
========================================================= */

function PreviewMetric({
  label,
  value,
  icon: Icon,
  classes,
}) {
  return (
    <div
      className="
        min-w-0
        rounded-2xl
        border
        border-slate-200/80
        bg-slate-50/70
        p-3.5
        dark:border-white/[0.07]
        dark:bg-white/[0.025]
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        <span
          className={`
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${classes}
          `}
        >
          <Icon size={14} />
        </span>

        <span
          className="
            truncate
            text-[8px]
            font-black
            uppercase
            tracking-wide
            text-slate-500
            dark:text-slate-400
          "
        >
          {label}
        </span>
      </div>

      <p
        className="
          mt-3
          truncate
          text-sm
          font-black
          text-slate-950
          dark:text-white
        "
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   FIELD LABEL
========================================================= */

function FieldLabel({
  children,
  required = false,
}) {
  return (
    <label
      className="
        mb-2
        block
        text-[9px]
        font-black
        uppercase
        tracking-[0.1em]
        text-slate-500
        dark:text-slate-400
      "
    >
      {children}

      {required && (
        <span className="ml-1 text-rose-500">
          *
        </span>
      )}
    </label>
  );
}

/* =========================================================
   QUICK AMOUNT BUTTON
========================================================= */

function QuickAmountButton({
  label,
  description,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        min-w-0
        rounded-2xl
        border
        px-3
        py-3
        text-left
        transition-all
        duration-200

        ${
          active
            ? `
              border-blue-500/30
              bg-blue-500/[0.08]
              ring-4
              ring-blue-500/10
            `
            : `
              border-slate-200
              bg-white
              hover:border-blue-500/20
              hover:bg-blue-500/[0.025]
              dark:border-white/[0.07]
              dark:bg-[#091426]
              dark:hover:bg-white/[0.035]
            `
        }
      `}
    >
      <p
        className={`
          truncate
          text-[10px]
          font-black

          ${
            active
              ? `
                text-blue-600
                dark:text-blue-300
              `
              : `
                text-slate-800
                dark:text-white
              `
          }
        `}
      >
        {label}
      </p>

      <p
        className="
          mt-1
          truncate
          text-[8px]
          font-medium
          text-slate-500
          dark:text-slate-400
        "
      >
        {description}
      </p>
    </button>
  );
}

/* =========================================================
   PROGRESS PREVIEW
========================================================= */

function ProgressPreview({
  currentProgress,
  nextProgress,
  receivable,
}) {
  return (
    <div
      className="
        rounded-[22px]
        border
        border-slate-200/80
        bg-slate-50/60
        p-4
        dark:border-white/[0.07]
        dark:bg-white/[0.025]
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
        <div>
          <p
            className="
              text-[8px]
              font-black
              uppercase
              tracking-wide
              text-slate-500
              dark:text-slate-400
            "
          >
            {receivable
              ? "Collection Progress"
              : "Repayment Progress"}
          </p>

          <p
            className="
              mt-1
              text-[10px]
              text-slate-500
              dark:text-slate-400
            "
          >
            {currentProgress}% →{" "}
            <span
              className="
                font-black
                text-slate-950
                dark:text-white
              "
            >
              {nextProgress}%
            </span>
          </p>
        </div>

        <span
          className={`
            rounded-full
            px-3
            py-1.5
            text-[9px]
            font-black

            ${
              receivable
                ? `
                  bg-emerald-500/10
                  text-emerald-600
                  dark:text-emerald-300
                `
                : `
                  bg-blue-500/10
                  text-blue-600
                  dark:text-blue-300
                `
            }
          `}
        >
          +{Math.max(
            0,
            nextProgress -
              currentProgress
          )}
          %
        </span>
      </div>

      <div
        className="
          relative
          mt-4
          h-2.5
          overflow-hidden
          rounded-full
          bg-slate-200
          dark:bg-white/[0.07]
        "
      >
        <div
          style={{
            width: `${currentProgress}%`,
          }}
          className="
            absolute
            inset-y-0
            left-0
            rounded-full
            bg-slate-400/50
          "
        />

        <motion.div
          animate={{
            width: `${nextProgress}%`,
          }}
          transition={{
            duration: 0.35,
          }}
          className={`
            absolute
            inset-y-0
            left-0
            rounded-full

            ${
              receivable
                ? `
                  bg-gradient-to-r
                  from-emerald-500
                  to-cyan-500
                `
                : `
                  bg-gradient-to-r
                  from-cyan-500
                  via-blue-500
                  to-violet-500
                `
            }
          `}
        />
      </div>
    </div>
  );
}

/* =========================================================
   DEBT PAYMENT MODAL
========================================================= */

function DebtPaymentModal({
  open,
  debt,
  onClose,
}) {
  const {
    addPayment,
  } = useDebt();

  const [
    amount,
    setAmount,
  ] = useState("");

  const [
    paymentDate,
    setPaymentDate,
  ] = useState(
    getTodayInputValue
  );

  const [
    notes,
    setNotes,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  /* =======================================================
     NORMALIZED DEBT
  ======================================================= */

  const record =
    useMemo(() => {
      if (!debt) {
        return null;
      }

      return normalizeDebtRecord(
        debt
      );
    }, [debt]);

  /* =======================================================
     VALUES
  ======================================================= */

  const remainingAmount =
    useMemo(() => {
      if (!record) {
        return 0;
      }

      return calculateRemainingAmount(
        record
      );
    }, [record]);

  const paidAmount =
    useMemo(() => {
      if (!record) {
        return 0;
      }

      return calculatePaidAmount(
        record
      );
    }, [record]);

  const totalAmount =
    useMemo(() => {
      if (!record) {
        return 0;
      }

      return (
        toSafeNumber(
          record.totalAmount
        ) ||
        toSafeNumber(
          record.amount
        )
      );
    }, [record]);

  const installmentAmount =
    useMemo(() => {
      if (!record) {
        return 0;
      }

      return Math.min(
        toSafeNumber(
          record.installmentAmount
        ),
        remainingAmount
      );
    }, [
      record,
      remainingAmount,
    ]);

  const enteredAmount =
    toSafeNumber(amount);

  const receivable =
    record?.direction ===
    "receivable";

  /* =======================================================
     SUGGESTED AMOUNT
  ======================================================= */

  const suggestedAmount =
    installmentAmount > 0
      ? installmentAmount
      : remainingAmount;

  /* =======================================================
     PREVIEW
  ======================================================= */

  const remainingAfterPayment =
    Math.max(
      0,
      remainingAmount -
        enteredAmount
    );

  const paidAfterPayment =
    Math.min(
      totalAmount,
      paidAmount +
        enteredAmount
    );

  const currentProgress =
    record
      ? calculateDebtProgress(
          record
        )
      : 0;

  const nextProgress =
    totalAmount > 0
      ? Math.min(
          100,
          Math.round(
            (paidAfterPayment /
              totalAmount) *
              100
          )
        )
      : 0;

  const completesDebt =
    enteredAmount > 0 &&
    remainingAfterPayment <= 0;

  /* =======================================================
     RESET WHEN MODAL OPENS
  ======================================================= */

  useEffect(() => {
    if (!open || !record) {
      return;
    }

    const defaultAmount =
      installmentAmount > 0
        ? installmentAmount
        : remainingAmount;

    setAmount(
      defaultAmount > 0
        ? String(defaultAmount)
        : ""
    );

    setPaymentDate(
      getTodayInputValue()
    );

    setNotes("");
    setError("");
    setSubmitting(false);
  }, [
    open,
    record,
    installmentAmount,
    remainingAmount,
  ]);

  /* =======================================================
     BODY SCROLL LOCK
  ======================================================= */

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  /* =======================================================
     ESCAPE
  ======================================================= */

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleEscape = (
      event
    ) => {
      if (
        event.key ===
          "Escape" &&
        !submitting
      ) {
        onClose?.();
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [
    open,
    submitting,
    onClose,
  ]);

  /* =======================================================
     AMOUNT CHANGE
  ======================================================= */

  const handleAmountChange = (
    value
  ) => {
    setAmount(value);

    if (error) {
      setError("");
    }
  };

  /* =======================================================
     QUICK AMOUNT
  ======================================================= */

  const setQuickAmount = (
    value
  ) => {
    const safeValue =
      Math.min(
        Math.max(0, value),
        remainingAmount
      );

    setAmount(
      safeValue > 0
        ? String(safeValue)
        : ""
    );

    setError("");
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validate = () => {
    const numericAmount =
      Number(amount);

    if (
      !Number.isFinite(
        numericAmount
      ) ||
      numericAmount <= 0
    ) {
      setError(
        "Enter a valid payment amount greater than 0."
      );

      return false;
    }

    if (
      numericAmount >
      remainingAmount
    ) {
      setError(
        `Amount cannot exceed the remaining balance of ${formatDebtCurrency(
          remainingAmount
        )}.`
      );

      return false;
    }

    if (!paymentDate) {
      setError(
        "Payment date is required."
      );

      return false;
    }

    return true;
  };

  /* =======================================================
     SUBMIT PAYMENT
  ======================================================= */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (
      submitting ||
      !record?.id ||
      !validate()
    ) {
      return;
    }

    const numericAmount =
      Number(amount);

    const paymentPayload = {
      amount:
        numericAmount,

      paymentDate,

      date:
        paymentDate,

      notes:
        notes.trim(),

      note:
        notes.trim(),

      type:
        receivable
          ? "received"
          : "paid",

      paymentType:
        receivable
          ? "received"
          : "paid",

      direction:
        receivable
          ? "receivable"
          : "payable",
    };

    try {
      setSubmitting(true);

      await Promise.resolve(
        addPayment(
          record.id,
          paymentPayload
        )
      );

      toast.success(
        completesDebt
          ? receivable
            ? "Full repayment received. Record completed."
            : "Debt fully repaid."
          : receivable
            ? "Repayment received."
            : "Payment recorded."
      );

      onClose?.();
    } catch (submitError) {
      toast.error(
        submitError?.message ||
          `Unable to record ${
            receivable
              ? "received payment"
              : "payment"
          }.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     DO NOT RENDER WITHOUT RECORD
  ======================================================= */

  if (!record) {
    return null;
  }

  /* =======================================================
     MODAL
  ======================================================= */

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
            z-[160]
            flex
            items-end
            justify-center
            bg-slate-950/70
            p-0
            backdrop-blur-sm
            sm:items-center
            sm:p-4
          "
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
                event.currentTarget &&
              !submitting
            ) {
              onClose?.();
            }
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 28,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 18,
              scale: 0.98,
            }}
            transition={{
              duration: 0.22,
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="debt-payment-modal-title"
            className="
              flex
              max-h-[94dvh]
              w-full
              max-w-3xl
              flex-col
              overflow-hidden
              rounded-t-[30px]
              border
              border-slate-200
              bg-white
              shadow-2xl
              dark:border-white/[0.08]
              dark:bg-[#071225]
              sm:rounded-[30px]
            "
          >
            {/* =================================================
                HEADER
            ================================================== */}

            <div
              className="
                relative
                shrink-0
                overflow-hidden
                border-b
                border-slate-200/80
                px-5
                py-5
                dark:border-white/[0.07]
                sm:px-6
              "
            >
              <div
                className={`
                  pointer-events-none
                  absolute
                  -right-24
                  -top-24
                  h-52
                  w-52
                  rounded-full
                  blur-[80px]

                  ${
                    receivable
                      ? "bg-emerald-500/[0.1]"
                      : "bg-blue-500/[0.1]"
                  }
                `}
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-24
                  left-1/3
                  h-44
                  w-44
                  rounded-full
                  bg-violet-500/[0.07]
                  blur-[80px]
                "
              />

              <div
                className="
                  relative
                  flex
                  items-start
                  justify-between
                  gap-4
                "
              >
                <div
                  className="
                    flex
                    min-w-0
                    items-start
                    gap-3
                  "
                >
                  <div
                    className={`
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl

                      ${
                        receivable
                          ? `
                            bg-emerald-500/10
                            text-emerald-600
                            dark:text-emerald-300
                          `
                          : `
                            bg-blue-500/10
                            text-blue-600
                            dark:text-blue-300
                          `
                      }
                    `}
                  >
                    {receivable ? (
                      <HandCoins
                        size={20}
                      />
                    ) : (
                      <Banknote
                        size={20}
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.14em]

                        ${
                          receivable
                            ? `
                              text-emerald-600
                              dark:text-emerald-300
                            `
                            : `
                              text-blue-600
                              dark:text-blue-300
                            `
                        }
                      `}
                    >
                      {receivable
                        ? "Incoming repayment"
                        : "Outgoing repayment"}
                    </p>

                    <h2
                      id="debt-payment-modal-title"
                      className="
                        mt-1
                        text-xl
                        font-black
                        tracking-tight
                        text-slate-950
                        dark:text-white
                        sm:text-2xl
                      "
                    >
                      {receivable
                        ? "Record Money Received"
                        : "Record Debt Payment"}
                    </h2>

                    <p
                      className="
                        mt-1.5
                        max-w-lg
                        text-[10px]
                        leading-5
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Update repayment activity
                      for{" "}
                      <span
                        className="
                          font-black
                          text-slate-700
                          dark:text-slate-300
                        "
                      >
                        {record.title}
                      </span>
                      .
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={
                    submitting
                  }
                  onClick={() =>
                    onClose?.()
                  }
                  aria-label="Close payment modal"
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    text-slate-500
                    transition
                    hover:border-rose-500/20
                    hover:bg-rose-500/10
                    hover:text-rose-600
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    dark:border-white/[0.08]
                    dark:bg-white/[0.04]
                    dark:text-slate-400
                    dark:hover:text-rose-300
                  "
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* =================================================
                SCROLL CONTENT
            ================================================== */}

            <form
              id="debt-payment-form"
              onSubmit={
                handleSubmit
              }
              className="
                min-h-0
                flex-1
                overflow-y-auto
                overscroll-contain
                px-4
                py-5
                [scrollbar-width:thin]
                sm:px-6
              "
            >
              <div className="space-y-5">
                {/* =============================================
                    DEBT INFORMATION
                ============================================== */}

                <section
                  className="
                    relative
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-slate-200/80
                    bg-slate-50/60
                    p-4
                    dark:border-white/[0.07]
                    dark:bg-white/[0.025]
                    sm:p-5
                  "
                >
                  <div
                    className="
                      flex
                      min-w-0
                      flex-col
                      gap-4
                      sm:flex-row
                      sm:items-start
                      sm:justify-between
                    "
                  >
                    <div
                      className="
                        flex
                        min-w-0
                        items-start
                        gap-3
                      "
                    >
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-violet-500/10
                          text-violet-600
                          dark:text-violet-300
                        "
                      >
                        {record.type ===
                        "loan" ? (
                          <Landmark
                            size={17}
                          />
                        ) : (
                          <WalletCards
                            size={17}
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className="
                            break-words
                            text-sm
                            font-black
                            text-slate-950
                            dark:text-white
                          "
                        >
                          {record.title}
                        </p>

                        <p
                          className="
                            mt-1
                            text-[9px]
                            text-slate-500
                            dark:text-slate-400
                          "
                        >
                          {getDebtTypeLabel(
                            record.type
                          )}

                          {record.partyName
                            ? ` • ${record.partyName}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`
                        inline-flex
                        w-fit
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        px-3
                        py-1.5
                        text-[8px]
                        font-black

                        ${
                          receivable
                            ? `
                              border-emerald-500/20
                              bg-emerald-500/10
                              text-emerald-600
                              dark:text-emerald-300
                            `
                            : `
                              border-rose-500/20
                              bg-rose-500/10
                              text-rose-600
                              dark:text-rose-300
                            `
                        }
                      `}
                    >
                      {receivable ? (
                        <ArrowDownLeft
                          size={11}
                        />
                      ) : (
                        <ArrowUpRight
                          size={11}
                        />
                      )}

                      {receivable
                        ? "Receivable"
                        : "Payable"}
                    </span>
                  </div>

                  <div
                    className="
                      mt-5
                      grid
                      gap-3
                      grid-cols-2
                      lg:grid-cols-3
                    "
                  >
                    <PreviewMetric
                      label="Original"
                      value={formatDebtCurrency(
                        totalAmount
                      )}
                      icon={
                        CircleDollarSign
                      }
                      classes="
                        bg-violet-500/10
                        text-violet-600
                        dark:text-violet-300
                      "
                    />

                    <PreviewMetric
                      label={
                        receivable
                          ? "Received"
                          : "Already Paid"
                      }
                      value={formatDebtCurrency(
                        paidAmount
                      )}
                      icon={
                        receivable
                          ? HandCoins
                          : Banknote
                      }
                      classes="
                        bg-emerald-500/10
                        text-emerald-600
                        dark:text-emerald-300
                      "
                    />

                    <div className="col-span-2 lg:col-span-1">
                      <PreviewMetric
                        label="Outstanding"
                        value={formatDebtCurrency(
                          remainingAmount
                        )}
                        icon={
                          WalletCards
                        }
                        classes="
                          bg-blue-500/10
                          text-blue-600
                          dark:text-blue-300
                        "
                      />
                    </div>
                  </div>
                </section>

                {/* =============================================
                    AMOUNT
                ============================================== */}

                <section
                  className="
                    rounded-[24px]
                    border
                    border-slate-200/80
                    bg-slate-50/60
                    p-4
                    dark:border-white/[0.07]
                    dark:bg-white/[0.025]
                    sm:p-5
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >
                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl

                        ${
                          receivable
                            ? `
                              bg-emerald-500/10
                              text-emerald-600
                              dark:text-emerald-300
                            `
                            : `
                              bg-blue-500/10
                              text-blue-600
                              dark:text-blue-300
                            `
                        }
                      `}
                    >
                      <IndianRupee
                        size={17}
                      />
                    </div>

                    <div>
                      <p
                        className="
                          text-[9px]
                          font-black
                          uppercase
                          tracking-[0.13em]
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        Payment amount
                      </p>

                      <h3
                        className="
                          mt-1
                          text-sm
                          font-black
                          text-slate-950
                          dark:text-white
                        "
                      >
                        {receivable
                          ? "How much did you receive?"
                          : "How much did you pay?"}
                      </h3>
                    </div>
                  </div>

                  {/* Input */}

                  <div className="mt-5">
                    <FieldLabel
                      required
                    >
                      Amount
                    </FieldLabel>

                    <div className="relative">
                      <IndianRupee
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
                        type="number"
                        min="0.01"
                        max={
                          remainingAmount
                        }
                        step="0.01"
                        value={amount}
                        onChange={(
                          event
                        ) =>
                          handleAmountChange(
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="0.00"
                        autoFocus
                        className="
                          h-14
                          w-full
                          rounded-2xl
                          border
                          border-slate-200
                          bg-white
                          pl-12
                          pr-4
                          text-lg
                          font-black
                          text-slate-950
                          outline-none
                          transition
                          placeholder:text-slate-300
                          focus:border-blue-500/40
                          focus:ring-4
                          focus:ring-blue-500/10
                          dark:border-white/[0.08]
                          dark:bg-[#091426]
                          dark:text-white
                          dark:placeholder:text-slate-600
                        "
                      />
                    </div>

                    {error && (
                      <p
                        className="
                          mt-2
                          flex
                          items-start
                          gap-1.5
                          text-[9px]
                          font-bold
                          text-rose-500
                        "
                      >
                        <AlertCircle
                          size={12}
                          className="
                            mt-0.5
                            shrink-0
                          "
                        />

                        {error}
                      </p>
                    )}
                  </div>

                  {/* Quick amounts */}

                  <div
                    className="
                      mt-4
                      grid
                      gap-2
                      grid-cols-2
                      sm:grid-cols-4
                    "
                  >
                    {installmentAmount >
                      0 && (
                      <QuickAmountButton
                        label="Installment"
                        description={formatDebtCurrency(
                          installmentAmount
                        )}
                        active={
                          enteredAmount ===
                          installmentAmount
                        }
                        onClick={() =>
                          setQuickAmount(
                            installmentAmount
                          )
                        }
                      />
                    )}

                    <QuickAmountButton
                      label="25%"
                      description={formatDebtCurrency(
                        Math.min(
                          remainingAmount,
                          remainingAmount *
                            0.25
                        )
                      )}
                      active={
                        enteredAmount ===
                        Math.min(
                          remainingAmount,
                          remainingAmount *
                            0.25
                        )
                      }
                      onClick={() =>
                        setQuickAmount(
                          remainingAmount *
                            0.25
                        )
                      }
                    />

                    <QuickAmountButton
                      label="50%"
                      description={formatDebtCurrency(
                        remainingAmount *
                          0.5
                      )}
                      active={
                        enteredAmount ===
                        remainingAmount *
                          0.5
                      }
                      onClick={() =>
                        setQuickAmount(
                          remainingAmount *
                            0.5
                        )
                      }
                    />

                    <QuickAmountButton
                      label="Full"
                      description={formatDebtCurrency(
                        remainingAmount
                      )}
                      active={
                        enteredAmount ===
                        remainingAmount
                      }
                      onClick={() =>
                        setQuickAmount(
                          remainingAmount
                        )
                      }
                    />
                  </div>

                  {suggestedAmount > 0 && (
                    <div
                      className="
                        mt-4
                        flex
                        items-start
                        gap-3
                        rounded-2xl
                        border
                        border-blue-500/15
                        bg-blue-500/[0.045]
                        px-4
                        py-3
                      "
                    >
                      <Sparkles
                        size={15}
                        className="
                          mt-0.5
                          shrink-0
                          text-blue-500
                        "
                      />

                      <p
                        className="
                          text-[9px]
                          leading-5
                          text-slate-600
                          dark:text-slate-400
                        "
                      >
                        Suggested amount:{" "}
                        <span
                          className="
                            font-black
                            text-blue-600
                            dark:text-blue-300
                          "
                        >
                          {formatDebtCurrency(
                            suggestedAmount
                          )}
                        </span>

                        {installmentAmount >
                        0
                          ? " based on this record's installment amount."
                          : " based on the current outstanding balance."}
                      </p>
                    </div>
                  )}
                </section>

                {/* =============================================
                    BALANCE PREVIEW
                ============================================== */}

                <section
                  className="
                    rounded-[24px]
                    border
                    border-slate-200/80
                    bg-slate-50/60
                    p-4
                    dark:border-white/[0.07]
                    dark:bg-white/[0.025]
                    sm:p-5
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
                    <div>
                      <p
                        className="
                          text-[9px]
                          font-black
                          uppercase
                          tracking-[0.13em]
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        Balance preview
                      </p>

                      <h3
                        className="
                          mt-1
                          text-sm
                          font-black
                          text-slate-950
                          dark:text-white
                        "
                      >
                        After this transaction
                      </h3>
                    </div>

                    {completesDebt && (
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          border
                          border-emerald-500/20
                          bg-emerald-500/10
                          px-3
                          py-1.5
                          text-[8px]
                          font-black
                          text-emerald-600
                          dark:text-emerald-300
                        "
                      >
                        <CheckCircle2
                          size={11}
                        />

                        Fully settled
                      </span>
                    )}
                  </div>

                  <div
                    className="
                      mt-4
                      grid
                      gap-3
                      sm:grid-cols-3
                    "
                  >
                    <PreviewMetric
                      label="This Payment"
                      value={formatDebtCurrency(
                        enteredAmount
                      )}
                      icon={
                        receivable
                          ? HandCoins
                          : Banknote
                      }
                      classes={
                        receivable
                          ? `
                            bg-emerald-500/10
                            text-emerald-600
                            dark:text-emerald-300
                          `
                          : `
                            bg-blue-500/10
                            text-blue-600
                            dark:text-blue-300
                          `
                      }
                    />

                    <PreviewMetric
                      label="Remaining After"
                      value={formatDebtCurrency(
                        remainingAfterPayment
                      )}
                      icon={
                        WalletCards
                      }
                      classes="
                        bg-violet-500/10
                        text-violet-600
                        dark:text-violet-300
                      "
                    />

                    <PreviewMetric
                      label="New Progress"
                      value={`${nextProgress}%`}
                      icon={
                        CheckCircle2
                      }
                      classes="
                        bg-emerald-500/10
                        text-emerald-600
                        dark:text-emerald-300
                      "
                    />
                  </div>

                  <div className="mt-4">
                    <ProgressPreview
                      currentProgress={
                        currentProgress
                      }
                      nextProgress={
                        nextProgress
                      }
                      receivable={
                        receivable
                      }
                    />
                  </div>
                </section>

                {/* =============================================
                    DATE + NOTES
                ============================================== */}

                <section
                  className="
                    rounded-[24px]
                    border
                    border-slate-200/80
                    bg-slate-50/60
                    p-4
                    dark:border-white/[0.07]
                    dark:bg-white/[0.025]
                    sm:p-5
                  "
                >
                  <div
                    className="
                      grid
                      gap-4
                      md:grid-cols-2
                    "
                  >
                    {/* Payment date */}

                    <div>
                      <FieldLabel
                        required
                      >
                        {receivable
                          ? "Received Date"
                          : "Payment Date"}
                      </FieldLabel>

                      <div className="relative">
                        <CalendarDays
                          size={15}
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
                          type="date"
                          value={
                            paymentDate
                          }
                          onChange={(
                            event
                          ) => {
                            setPaymentDate(
                              event
                                .target
                                .value
                            );

                            setError(
                              ""
                            );
                          }}
                          className="
                            h-12
                            w-full
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            pl-11
                            pr-4
                            text-xs
                            font-semibold
                            text-slate-900
                            outline-none
                            transition
                            focus:border-blue-500/40
                            focus:ring-4
                            focus:ring-blue-500/10
                            dark:border-white/[0.08]
                            dark:bg-[#091426]
                            dark:text-white
                          "
                        />
                      </div>
                    </div>

                    {/* Transaction type */}

                    <div>
                      <FieldLabel>
                        Transaction
                      </FieldLabel>

                      <div
                        className={`
                          flex
                          h-12
                          items-center
                          gap-3
                          rounded-2xl
                          border
                          px-4

                          ${
                            receivable
                              ? `
                                border-emerald-500/15
                                bg-emerald-500/[0.05]
                              `
                              : `
                                border-blue-500/15
                                bg-blue-500/[0.05]
                              `
                          }
                        `}
                      >
                        {receivable ? (
                          <ArrowDownLeft
                            size={15}
                            className="
                              text-emerald-500
                            "
                          />
                        ) : (
                          <ArrowUpRight
                            size={15}
                            className="
                              text-blue-500
                            "
                          />
                        )}

                        <span
                          className={`
                            text-[10px]
                            font-black

                            ${
                              receivable
                                ? `
                                  text-emerald-700
                                  dark:text-emerald-300
                                `
                                : `
                                  text-blue-700
                                  dark:text-blue-300
                                `
                            }
                          `}
                        >
                          {receivable
                            ? "Money Received"
                            : "Debt Payment"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}

                  <div className="mt-4">
                    <FieldLabel>
                      Notes
                    </FieldLabel>

                    <div className="relative">
                      <FileText
                        size={15}
                        className="
                          pointer-events-none
                          absolute
                          left-4
                          top-4
                          text-slate-400
                        "
                      />

                      <textarea
                        value={notes}
                        onChange={(
                          event
                        ) =>
                          setNotes(
                            event
                              .target
                              .value
                          )
                        }
                        maxLength={300}
                        rows={3}
                        placeholder={
                          receivable
                            ? "e.g. Received via UPI..."
                            : "e.g. August EMI paid via bank transfer..."
                        }
                        className="
                          w-full
                          resize-none
                          rounded-2xl
                          border
                          border-slate-200
                          bg-white
                          pb-3
                          pl-11
                          pr-4
                          pt-3
                          text-xs
                          font-medium
                          leading-6
                          text-slate-900
                          outline-none
                          transition
                          placeholder:text-slate-400
                          focus:border-blue-500/40
                          focus:ring-4
                          focus:ring-blue-500/10
                          dark:border-white/[0.08]
                          dark:bg-[#091426]
                          dark:text-white
                          dark:placeholder:text-slate-600
                        "
                      />
                    </div>

                    <div
                      className="
                        mt-1.5
                        flex
                        justify-end
                      "
                    >
                      <span
                        className="
                          text-[8px]
                          font-bold
                          text-slate-400
                        "
                      >
                        {notes.length}/300
                      </span>
                    </div>
                  </div>
                </section>
              </div>
            </form>

            {/* =================================================
                FOOTER
            ================================================== */}

            <div
              className="
                shrink-0
                border-t
                border-slate-200/80
                bg-white/95
                px-4
                py-4
                backdrop-blur-xl
                dark:border-white/[0.07]
                dark:bg-[#071225]/95
                sm:px-6
              "
            >
              <div
                className="
                  flex
                  flex-col-reverse
                  gap-3
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-2
                    text-[9px]
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  <ReceiptText
                    size={12}
                  />

                  Remaining after transaction:{" "}
                  <span
                    className="
                      font-black
                      text-slate-800
                      dark:text-slate-200
                    "
                  >
                    {formatDebtCurrency(
                      remainingAfterPayment
                    )}
                  </span>
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <button
                    type="button"
                    disabled={
                      submitting
                    }
                    onClick={() =>
                      onClose?.()
                    }
                    className="
                      inline-flex
                      min-h-11
                      flex-1
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-5
                      py-3
                      text-xs
                      font-black
                      text-slate-600
                      transition
                      hover:bg-slate-100
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      dark:border-white/[0.08]
                      dark:bg-white/[0.04]
                      dark:text-slate-300
                      dark:hover:bg-white/[0.07]
                      sm:flex-none
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    form="debt-payment-form"
                    disabled={
                      submitting ||
                      remainingAmount <= 0
                    }
                    className={`
                      inline-flex
                      min-h-11
                      flex-1
                      items-center
                      justify-center
                      gap-2
                      rounded-2xl
                      px-5
                      py-3
                      text-xs
                      font-black
                      text-white
                      shadow-lg
                      transition
                      hover:-translate-y-0.5
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      disabled:hover:translate-y-0
                      sm:flex-none

                      ${
                        receivable
                          ? `
                            bg-gradient-to-r
                            from-emerald-500
                            to-cyan-500
                            shadow-emerald-500/20
                          `
                          : `
                            bg-gradient-to-r
                            from-cyan-500
                            via-blue-500
                            to-violet-500
                            shadow-blue-500/20
                          `
                      }
                    `}
                  >
                    <Save size={15} />

                    {submitting
                      ? "Recording..."
                      : receivable
                        ? "Record Received"
                        : "Record Payment"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DebtPaymentModal;