import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { createPortal } from "react-dom";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

import {
  Banknote,
  CalendarDays,
  Check,
  CircleDollarSign,
  FileText,
  HandCoins,
  Landmark,
  PiggyBank,
  Plus,
  ReceiptText,
  Save,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";

import useDebt from "../../hooks/useDebt";

/* =========================================================
   DEBT TYPE CONFIGURATION
========================================================= */

const DEBT_TYPES = [
  {
    id: "loan",
    label: "Loan",
    description:
      "Personal, bank or business loan.",
    Icon: Landmark,
    activeClass:
      "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-300",
    iconClass:
      "bg-blue-500/10 text-blue-500 dark:text-blue-300",
  },

  {
    id: "emi",
    label: "EMI",
    description:
      "Installment-based repayment.",
    Icon: ReceiptText,
    activeClass:
      "border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-300",
    iconClass:
      "bg-violet-500/10 text-violet-500 dark:text-violet-300",
  },

  {
    id: "borrowed",
    label: "Borrowed",
    description:
      "Money borrowed from someone.",
    Icon: HandCoins,
    activeClass:
      "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-300",
    iconClass:
      "bg-rose-500/10 text-rose-500 dark:text-rose-300",
  },

  {
    id: "lent",
    label: "Money Lent",
    description:
      "Money someone owes you.",
    Icon: PiggyBank,
    activeClass:
      "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    iconClass:
      "bg-emerald-500/10 text-emerald-500 dark:text-emerald-300",
  },

  {
    id: "other",
    label: "Other",
    description:
      "Other unpaid financial obligation.",
    Icon: WalletCards,
    activeClass:
      "border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300",
    iconClass:
      "bg-cyan-500/10 text-cyan-500 dark:text-cyan-300",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function getToday() {
  const now = new Date();

  const year =
    now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toInputDate(value) {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDirection(type) {
  return type === "lent"
    ? "receivable"
    : "payable";
}

function getInitialForm(
  editingDebt,
  defaultType
) {
  const type =
    editingDebt?.type ||
    defaultType ||
    "loan";

  return {
    type,

    title:
      editingDebt?.title ||
      "",

    partyName:
      editingDebt?.partyName ||
      editingDebt?.personName ||
      editingDebt?.lenderName ||
      editingDebt?.borrowerName ||
      "",

    totalAmount:
      editingDebt?.totalAmount ??
      editingDebt?.amount ??
      "",

    interestRate:
      editingDebt?.interestRate ??
      "",

    installmentAmount:
      editingDebt?.installmentAmount ??
      "",

    totalInstallments:
      editingDebt?.totalInstallments ??
      "",

    startDate:
      toInputDate(
        editingDebt?.startDate
      ) || getToday(),

    nextDueDate:
      toInputDate(
        editingDebt?.nextDueDate
      ),

    notes:
      editingDebt?.notes ||
      editingDebt?.note ||
      "",
  };
}

/* =========================================================
   LABEL
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
        text-[10px]
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
   INPUT CLASS
========================================================= */

const inputClass = `
  h-12
  w-full
  rounded-2xl
  border
  border-slate-200
  bg-slate-50
  px-4
  text-sm
  font-semibold
  text-slate-900
  outline-none
  transition

  placeholder:text-slate-400

  focus:border-blue-500
  focus:bg-white
  focus:ring-4
  focus:ring-blue-500/10

  dark:border-white/[0.08]
  dark:bg-white/[0.04]
  dark:text-white
  dark:placeholder:text-slate-600
  dark:focus:border-cyan-500/40
  dark:focus:bg-white/[0.055]
  dark:focus:ring-cyan-500/10
`;

/* =========================================================
   DEBT FORM MODAL
========================================================= */

function DebtFormModal({
  open = false,
  editingDebt = null,
  defaultType = "loan",
  onClose,
}) {
  /* =======================================================
     CONTEXT
  ======================================================= */

  const debtContext =
    useDebt() || {};

  const {
    addDebt,
    editDebt,
  } = debtContext;

  /* =======================================================
     STATE
  ======================================================= */

  const [
    formData,
    setFormData,
  ] = useState(() =>
    getInitialForm(
      editingDebt,
      defaultType
    )
  );

  const [
    errors,
    setErrors,
  ] = useState({});

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  /* =======================================================
     RESET FORM WHEN OPENING
  ======================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormData(
      getInitialForm(
        editingDebt,
        defaultType
      )
    );

    setErrors({});
    setSubmitting(false);
  }, [
    open,
    editingDebt,
    defaultType,
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
     ESCAPE CLOSE
  ======================================================= */

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (
      event
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        if (!submitting) {
          onClose?.();
        }
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
  }, [
    open,
    submitting,
    onClose,
  ]);

  /* =======================================================
     SELECTED TYPE
  ======================================================= */

  const selectedType =
    useMemo(() => {
      return (
        DEBT_TYPES.find(
          (item) =>
            item.id ===
            formData.type
        ) ||
        DEBT_TYPES[0]
      );
    }, [formData.type]);

  /*
    IMPORTANT FIX:

    Do NOT write:

    <selectedType.icon />

    React component variables must begin
    with an uppercase character.
  */

  const SelectedTypeIcon =
    selectedType.Icon;

  /* =======================================================
     INSTALLMENT TYPE
  ======================================================= */

  const showInstallments =
    formData.type ===
      "loan" ||
    formData.type === "emi";

  /* =======================================================
     UPDATE FIELD
  ======================================================= */

  const updateField = (
    name,
    value
  ) => {
    setFormData(
      (current) => ({
        ...current,
        [name]: value,
      })
    );

    setErrors(
      (current) => {
        if (
          !current[name]
        ) {
          return current;
        }

        const next = {
          ...current,
        };

        delete next[name];

        return next;
      }
    );
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm = () => {
    const nextErrors = {};

    const title =
      formData.title.trim();

    const amount =
      Number(
        formData.totalAmount
      );

    const interestRate =
      formData.interestRate ===
      ""
        ? 0
        : Number(
            formData.interestRate
          );

    const installmentAmount =
      formData
        .installmentAmount ===
      ""
        ? 0
        : Number(
            formData
              .installmentAmount
          );

    const totalInstallments =
      formData
        .totalInstallments ===
      ""
        ? 0
        : Number(
            formData
              .totalInstallments
          );

    if (!title) {
      nextErrors.title =
        "Debt title is required.";
    }

    if (
      !Number.isFinite(
        amount
      ) ||
      amount <= 0
    ) {
      nextErrors.totalAmount =
        "Enter a valid amount greater than 0.";
    }

    if (
      !Number.isFinite(
        interestRate
      ) ||
      interestRate < 0 ||
      interestRate > 100
    ) {
      nextErrors.interestRate =
        "Interest rate must be between 0 and 100.";
    }

    if (
      showInstallments &&
      formData
        .installmentAmount !==
        "" &&
      (!Number.isFinite(
        installmentAmount
      ) ||
        installmentAmount <=
          0)
    ) {
      nextErrors.installmentAmount =
        "Enter a valid installment amount.";
    }

    if (
      showInstallments &&
      formData
        .totalInstallments !==
        "" &&
      (!Number.isInteger(
        totalInstallments
      ) ||
        totalInstallments <=
          0)
    ) {
      nextErrors.totalInstallments =
        "Installments must be a positive whole number.";
    }

    if (
      formData.startDate &&
      formData.nextDueDate
    ) {
      const start =
        new Date(
          `${formData.startDate}T00:00:00`
        );

      const due =
        new Date(
          `${formData.nextDueDate}T00:00:00`
        );

      if (
        due.getTime() <
        start.getTime()
      ) {
        nextErrors.nextDueDate =
          "Due date cannot be before the start date.";
      }
    }

    setErrors(
      nextErrors
    );

    return (
      Object.keys(
        nextErrors
      ).length === 0
    );
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (submitting) {
        return;
      }

      if (!validateForm()) {
        toast.error(
          "Please check the highlighted fields."
        );

        return;
      }

      const isEditing =
        Boolean(
          editingDebt?.id
        );

      /*
        This check makes debugging much easier.
        If DebtContext is not exposing addDebt,
        you will now see an actual toast instead
        of a dead button.
      */

      if (
        !isEditing &&
        typeof addDebt !==
          "function"
      ) {
        toast.error(
          "Debt add function is unavailable."
        );

        console.error(
          "DebtFormModal: addDebt is not available from DebtContext."
        );

        return;
      }

      if (
        isEditing &&
        typeof editDebt !==
          "function"
      ) {
        toast.error(
          "Debt edit function is unavailable."
        );

        console.error(
          "DebtFormModal: editDebt is not available from DebtContext."
        );

        return;
      }

      setSubmitting(true);

      try {
        const totalAmount =
          Number(
            formData.totalAmount
          );

        const interestRate =
          Number(
            formData
              .interestRate ||
              0
          );

        const installmentAmount =
          Number(
            formData
              .installmentAmount ||
              0
          );

        const totalInstallments =
          Number(
            formData
              .totalInstallments ||
              0
          );

        const payload = {
          type:
            formData.type,

          direction:
            getDirection(
              formData.type
            ),

          title:
            formData.title.trim(),

          partyName:
            formData.partyName.trim(),

          totalAmount,

          amount:
            totalAmount,

          interestRate,

          installmentAmount:
            showInstallments
              ? installmentAmount
              : 0,

          totalInstallments:
            showInstallments
              ? totalInstallments
              : 0,

          startDate:
            formData.startDate ||
            getToday(),

          nextDueDate:
            formData.nextDueDate ||
            "",

          notes:
            formData.notes.trim(),
        };

        if (isEditing) {
          await Promise.resolve(
            editDebt(
              editingDebt.id,
              payload
            )
          );

          toast.success(
            "Debt record updated successfully."
          );
        } else {
          await Promise.resolve(
            addDebt(payload)
          );

          toast.success(
            formData.type ===
              "lent"
              ? "Money lent record added."
              : formData.type ===
                  "borrowed"
                ? "Borrowed money added."
                : formData.type ===
                    "emi"
                  ? "EMI added successfully."
                  : "Debt record added successfully."
          );
        }

        onClose?.();
      } catch (error) {
        console.error(
          "DebtFormModal submit error:",
          error
        );

        toast.error(
          error?.message ||
            "Unable to save debt record."
        );
      } finally {
        setSubmitting(false);
      }
    };

  /* =======================================================
     DON'T RENDER WHEN CLOSED
  ======================================================= */

  if (
    !open ||
    typeof document ===
      "undefined"
  ) {
    return null;
  }

  /* =======================================================
     PORTAL
  ======================================================= */

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={
        editingDebt
          ? "Edit debt record"
          : "Add debt record"
      }
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
      className="
        fixed
        inset-0
        z-[99999]

        flex
        items-center
        justify-center

        overflow-y-auto

        bg-slate-950/80

        px-4
        py-6

        backdrop-blur-md
      "
    >
      <motion.div
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
        transition={{
          duration: 0.22,
        }}
        onMouseDown={(
          event
        ) =>
          event.stopPropagation()
        }
        className="
          relative
          my-auto
          w-full
          max-w-3xl

          overflow-hidden

          rounded-[30px]

          border
          border-slate-200

          bg-white

          shadow-2xl
          shadow-black/30

          dark:border-white/[0.09]
          dark:bg-[#081326]
        "
      >
        {/* =================================================
            HEADER BACKGROUND
        ================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-64
            w-64
            rounded-full
            bg-cyan-500/10
            blur-[100px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -left-24
            top-1/3
            h-64
            w-64
            rounded-full
            bg-violet-500/[0.07]
            blur-[110px]
          "
        />

        {/* =================================================
            HEADER
        ================================================== */}

        <div
          className="
            relative
            flex
            items-start
            justify-between
            gap-4

            border-b
            border-slate-200

            p-5

            dark:border-white/[0.07]

            sm:p-6
          "
        >
          <div
            className="
              flex
              min-w-0
              items-start
              gap-4
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
                ${selectedType.iconClass}
              `}
            >
              <SelectedTypeIcon
                size={21}
              />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-cyan-600

                  dark:text-cyan-300
                "
              >
                {editingDebt
                  ? "Update liability"
                  : "New debt record"}
              </p>

              <h2
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
                {editingDebt
                  ? "Edit Debt"
                  : "Add Debt Record"}
              </h2>

              <p
                className="
                  mt-1.5

                  text-[10px]
                  leading-5
                  text-slate-500

                  dark:text-slate-400
                "
              >
                Track loans, EMIs,
                borrowed money and money
                you have lent.
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

              text-slate-500

              transition

              hover:bg-slate-100
              hover:text-slate-900

              disabled:cursor-not-allowed
              disabled:opacity-50

              dark:border-white/[0.08]
              dark:bg-white/[0.03]
              dark:text-slate-400
              dark:hover:bg-white/[0.07]
              dark:hover:text-white
            "
          >
            <X size={17} />
          </button>
        </div>

        {/* =================================================
            FORM
        ================================================== */}

        <form
          onSubmit={
            handleSubmit
          }
          className="
            relative
            max-h-[calc(100vh-140px)]
            overflow-y-auto
          "
        >
          <div
            className="
              space-y-7
              p-5
              sm:p-6
            "
          >
            {/* =============================================
                TYPE
            ============================================== */}

            <section>
              <div className="mb-3">
                <p
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.12em]
                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  01 · Record type
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
                  What are you tracking?
                </h3>
              </div>

              <div
                className="
                  grid
                  gap-3

                  sm:grid-cols-2
                  lg:grid-cols-5
                "
              >
                {DEBT_TYPES.map(
                  (item) => {
                    const TypeIcon =
                      item.Icon;

                    const active =
                      formData.type ===
                      item.id;

                    return (
                      <button
                        key={
                          item.id
                        }
                        type="button"
                        onClick={() =>
                          updateField(
                            "type",
                            item.id
                          )
                        }
                        className={`
                          relative

                          flex
                          min-h-[115px]
                          flex-col
                          items-start

                          rounded-2xl

                          border

                          p-3

                          text-left

                          transition
                          duration-200

                          ${
                            active
                              ? item.activeClass
                              : `
                                border-slate-200
                                bg-slate-50
                                text-slate-600

                                hover:border-blue-500/30
                                hover:bg-blue-500/[0.04]

                                dark:border-white/[0.07]
                                dark:bg-white/[0.03]
                                dark:text-slate-300
                              `
                          }
                        `}
                      >
                        <div
                          className={`
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-xl
                            ${item.iconClass}
                          `}
                        >
                          <TypeIcon
                            size={16}
                          />
                        </div>

                        <span
                          className="
                            mt-3
                            text-[10px]
                            font-black
                          "
                        >
                          {item.label}
                        </span>

                        <span
                          className="
                            mt-1
                            text-[8px]
                            leading-4
                            opacity-70
                          "
                        >
                          {
                            item.description
                          }
                        </span>

                        {active && (
                          <span
                            className="
                              absolute
                              right-2.5
                              top-2.5

                              flex
                              h-5
                              w-5
                              items-center
                              justify-center

                              rounded-full

                              bg-blue-500
                              text-white
                            "
                          >
                            <Check
                              size={11}
                            />
                          </span>
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            </section>

            {/* =============================================
                BASIC INFORMATION
            ============================================== */}

            <section>
              <div className="mb-4">
                <p
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.12em]
                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  02 · Basic information
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
                  Debt details
                </h3>
              </div>

              <div
                className="
                  grid
                  gap-4

                  md:grid-cols-2
                "
              >
                <div>
                  <FieldLabel
                    required
                  >
                    Title
                  </FieldLabel>

                  <div className="relative">
                    <FileText
                      size={16}
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
                      type="text"
                      value={
                        formData.title
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "title",
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="Example: Personal Loan"
                      className={`${inputClass} pl-11`}
                    />
                  </div>

                  {errors.title && (
                    <p
                      className="
                        mt-2
                        text-[10px]
                        font-semibold
                        text-rose-500
                      "
                    >
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <FieldLabel>
                    Person /
                    Institution
                  </FieldLabel>

                  <div className="relative">
                    <UserRound
                      size={16}
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
                      type="text"
                      value={
                        formData.partyName
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "partyName",
                          event
                            .target
                            .value
                        )
                      }
                      placeholder={
                        formData.type ===
                        "lent"
                          ? "Who owes you?"
                          : "Bank, lender or person"
                      }
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* =============================================
                AMOUNT
            ============================================== */}

            <section>
              <div className="mb-4">
                <p
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.12em]
                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  03 · Financial details
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
                  Amount information
                </h3>
              </div>

              <div
                className="
                  grid
                  gap-4
                  md:grid-cols-2
                "
              >
                <div>
                  <FieldLabel
                    required
                  >
                    Total Amount
                  </FieldLabel>

                  <div className="relative">
                    <CircleDollarSign
                      size={16}
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
                      min="0"
                      step="0.01"
                      value={
                        formData.totalAmount
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "totalAmount",
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="0"
                      className={`${inputClass} pl-11`}
                    />
                  </div>

                  {errors.totalAmount && (
                    <p
                      className="
                        mt-2
                        text-[10px]
                        font-semibold
                        text-rose-500
                      "
                    >
                      {
                        errors.totalAmount
                      }
                    </p>
                  )}
                </div>

                <div>
                  <FieldLabel>
                    Interest Rate
                  </FieldLabel>

                  <div className="relative">
                    <Banknote
                      size={16}
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
                      min="0"
                      max="100"
                      step="0.01"
                      value={
                        formData.interestRate
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "interestRate",
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="0%"
                      className={`${inputClass} pl-11`}
                    />
                  </div>

                  {errors.interestRate && (
                    <p
                      className="
                        mt-2
                        text-[10px]
                        font-semibold
                        text-rose-500
                      "
                    >
                      {
                        errors.interestRate
                      }
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* =============================================
                INSTALLMENTS
            ============================================== */}

            {showInstallments && (
              <section>
                <div className="mb-4">
                  <p
                    className="
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.12em]
                      text-slate-500

                      dark:text-slate-400
                    "
                  >
                    04 · Repayment plan
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
                    Installment details
                  </h3>
                </div>

                <div
                  className="
                    grid
                    gap-4

                    md:grid-cols-2
                  "
                >
                  <div>
                    <FieldLabel>
                      Installment
                      Amount
                    </FieldLabel>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        formData.installmentAmount
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "installmentAmount",
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="Example: 5000"
                      className={
                        inputClass
                      }
                    />

                    {errors.installmentAmount && (
                      <p
                        className="
                          mt-2
                          text-[10px]
                          font-semibold
                          text-rose-500
                        "
                      >
                        {
                          errors.installmentAmount
                        }
                      </p>
                    )}
                  </div>

                  <div>
                    <FieldLabel>
                      Total
                      Installments
                    </FieldLabel>

                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={
                        formData.totalInstallments
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "totalInstallments",
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="Example: 12"
                      className={
                        inputClass
                      }
                    />

                    {errors.totalInstallments && (
                      <p
                        className="
                          mt-2
                          text-[10px]
                          font-semibold
                          text-rose-500
                        "
                      >
                        {
                          errors.totalInstallments
                        }
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* =============================================
                DATES
            ============================================== */}

            <section>
              <div className="mb-4">
                <p
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.12em]
                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  {showInstallments
                    ? "05"
                    : "04"}{" "}
                  · Schedule
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
                  Important dates
                </h3>
              </div>

              <div
                className="
                  grid
                  gap-4

                  md:grid-cols-2
                "
              >
                <div>
                  <FieldLabel>
                    Start Date
                  </FieldLabel>

                  <div className="relative">
                    <CalendarDays
                      size={16}
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
                        formData.startDate
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "startDate",
                          event
                            .target
                            .value
                        )
                      }
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>
                    Next Due Date
                  </FieldLabel>

                  <div className="relative">
                    <CalendarDays
                      size={16}
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
                        formData.nextDueDate
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "nextDueDate",
                          event
                            .target
                            .value
                        )
                      }
                      className={`${inputClass} pl-11`}
                    />
                  </div>

                  {errors.nextDueDate && (
                    <p
                      className="
                        mt-2
                        text-[10px]
                        font-semibold
                        text-rose-500
                      "
                    >
                      {
                        errors.nextDueDate
                      }
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* =============================================
                NOTES
            ============================================== */}

            <section>
              <FieldLabel>
                Notes
              </FieldLabel>

              <textarea
                rows={4}
                value={
                  formData.notes
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "notes",
                    event.target
                      .value
                  )
                }
                placeholder="Add optional information about this debt..."
                className="
                  w-full
                  resize-none

                  rounded-2xl

                  border
                  border-slate-200

                  bg-slate-50

                  px-4
                  py-3

                  text-sm
                  font-medium
                  text-slate-900

                  outline-none

                  transition

                  placeholder:text-slate-400

                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-500/10

                  dark:border-white/[0.08]
                  dark:bg-white/[0.04]
                  dark:text-white
                  dark:placeholder:text-slate-600
                  dark:focus:border-cyan-500/40
                  dark:focus:bg-white/[0.055]
                "
              />
            </section>
          </div>

          {/* =================================================
              FOOTER
          ================================================== */}

          <div
            className="
              sticky
              bottom-0

              flex
              flex-col-reverse
              gap-3

              border-t
              border-slate-200

              bg-white/95

              p-5

              backdrop-blur-xl

              dark:border-white/[0.07]
              dark:bg-[#081326]/95

              sm:flex-row
              sm:items-center
              sm:justify-end
              sm:p-6
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
                items-center
                justify-center

                rounded-2xl

                border
                border-slate-200

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
                dark:bg-white/[0.03]
                dark:text-slate-300
                dark:hover:bg-white/[0.06]
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                submitting
              }
              className="
                inline-flex
                min-h-11
                min-w-[170px]
                items-center
                justify-center
                gap-2

                rounded-2xl

                bg-gradient-to-r
                from-cyan-500
                via-blue-500
                to-violet-500

                px-5
                py-3

                text-xs
                font-black
                text-white

                shadow-lg
                shadow-blue-500/20

                transition

                hover:-translate-y-0.5
                hover:shadow-xl

                disabled:cursor-not-allowed
                disabled:opacity-60
                disabled:hover:translate-y-0
              "
            >
              {submitting ? (
                <>
                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-white/30
                      border-t-white
                    "
                  />

                  Saving...
                </>
              ) : editingDebt ? (
                <>
                  <Save
                    size={16}
                  />

                  Save Changes
                </>
              ) : (
                <>
                  <Plus
                    size={16}
                  />

                  Add Debt Record
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
}

export default DebtFormModal;