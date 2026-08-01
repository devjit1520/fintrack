import {
  useCallback,
  useState,
} from "react";

import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  AlertTriangle,
  CheckCircle2,
  Plus,
  ShieldCheck,
} from "lucide-react";

import useDebt from "../../hooks/useDebt";

import DebtHeader from "../../components/debt/DebtHeader";
import DebtSummary from "../../components/debt/DebtSummary";
import DebtTabs from "../../components/debt/DebtTabs";
import DebtOverview from "../../components/debt/DebtOverview";
import DebtList from "../../components/debt/DebtList";
import DebtAlerts from "../../components/debt/DebtAlerts";
import UpcomingDebtPayments from "../../components/debt/UpcomingDebtPayments";
import DebtPaymentHistory from "../../components/debt/DebtPaymentHistory";
import DebtFormModal from "../../components/debt/DebtFormModal";
import DebtPaymentModal from "../../components/debt/DebtPaymentModal";

/* =========================================================
   TAB CONFIGURATION
========================================================= */

const VALID_TABS = [
  "overview",
  "loans",
  "borrowed",
  "lent",
  "history",
];

/* =========================================================
   GET DEFAULT RECORD TYPE
========================================================= */

function getDefaultTypeForTab(activeTab) {
  switch (activeTab) {
    case "borrowed":
      return "borrowed";

    case "lent":
      return "lent";

    case "loans":
      return "loan";

    default:
      return "loan";
  }
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div
      className="
        flex
        min-w-0
        flex-col
        gap-4
        sm:flex-row
        sm:items-end
        sm:justify-between
      "
    >
      <div className="min-w-0">
        {eyebrow && (
          <p
            className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.18em]
              text-cyan-600
              dark:text-cyan-400
            "
          >
            {eyebrow}
          </p>
        )}

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
          {title}
        </h2>

        {description && (
          <p
            className="
              mt-1.5
              max-w-2xl
              text-xs
              leading-5
              text-slate-500
              dark:text-slate-400
            "
          >
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PRIMARY ACTION BUTTON
========================================================= */

function AddButton({
  children,
  onClick,
  variant = "primary",
}) {
  const variants = {
    primary: `
      bg-gradient-to-r
      from-cyan-500
      via-blue-500
      to-violet-500
      shadow-blue-500/20
    `,

    borrowed: `
      bg-gradient-to-r
      from-rose-500
      to-orange-500
      shadow-rose-500/15
    `,

    lent: `
      bg-gradient-to-r
      from-emerald-500
      to-cyan-500
      shadow-emerald-500/15
    `,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex
        min-h-11
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
        hover:shadow-xl
        ${variants[variant] || variants.primary}
      `}
    >
      <Plus size={16} />
      {children}
    </button>
  );
}

/* =========================================================
   DEBT CENTER
========================================================= */

function DebtCenter() {
  const {
    error,
    removeDebt,
    clearDebtError,
  } = useDebt();

  /* =======================================================
     TAB STATE
  ======================================================= */

  const [
    activeTab,
    setActiveTab,
  ] = useState("overview");

  /* =======================================================
     DEBT MODAL STATE
  ======================================================= */

  const [
    debtModalOpen,
    setDebtModalOpen,
  ] = useState(false);

  const [
    editingDebt,
    setEditingDebt,
  ] = useState(null);

  const [
    defaultDebtType,
    setDefaultDebtType,
  ] = useState("loan");

  /* =======================================================
     PAYMENT MODAL STATE
  ======================================================= */

  const [
    paymentModalOpen,
    setPaymentModalOpen,
  ] = useState(false);

  const [
    paymentDebt,
    setPaymentDebt,
  ] = useState(null);

  /* =======================================================
     TAB CHANGE
  ======================================================= */

  const handleTabChange =
    useCallback((tab) => {
      if (!VALID_TABS.includes(tab)) {
        return;
      }

      setActiveTab(tab);
    }, []);

  /* =======================================================
     ADD DEBT
  ======================================================= */

  const openAddDebt =
    useCallback(
      (type = "") => {
        setEditingDebt(null);

        setDefaultDebtType(
          type ||
            getDefaultTypeForTab(
              activeTab
            )
        );

        setDebtModalOpen(true);
      },
      [activeTab]
    );

  /* =======================================================
     EDIT DEBT
  ======================================================= */

  const openEditDebt =
    useCallback((record) => {
      if (!record?.id) {
        toast.error(
          "Unable to edit this record."
        );
        return;
      }

      setEditingDebt(record);

      setDefaultDebtType(
        record.type || "loan"
      );

      setDebtModalOpen(true);
    }, []);

  /* =======================================================
     PAYMENT
  ======================================================= */

  const openPaymentModal =
    useCallback((record) => {
      if (!record?.id) {
        toast.error(
          "Unable to select this debt record."
        );
        return;
      }

      if (
        record.status ===
        "completed"
      ) {
        toast.success(
          record.direction ===
            "receivable"
            ? "This amount has already been fully received."
            : "This debt has already been fully repaid."
        );
        return;
      }

      setPaymentDebt(record);
      setPaymentModalOpen(true);
    }, []);

  /* =======================================================
     DELETE DEBT
  ======================================================= */

  const handleDeleteDebt =
    useCallback(
      async (record) => {
        if (!record?.id) {
          return;
        }

        const confirmed =
          window.confirm(
            `Delete "${
              record.title ||
              "Debt record"
            }"?\n\nIts payment history will also be removed.`
          );

        if (!confirmed) {
          return;
        }

        try {
          await Promise.resolve(
            removeDebt(record.id)
          );

          toast.success(
            "Debt record deleted."
          );
        } catch (deleteError) {
          toast.error(
            deleteError?.message ||
              "Unable to delete this record."
          );
        }
      },
      [removeDebt]
    );

  /* =======================================================
     CLOSE MODALS
  ======================================================= */

  const closeDebtModal =
    useCallback(() => {
      setDebtModalOpen(false);
      setEditingDebt(null);
    }, []);

  const closePaymentModal =
    useCallback(() => {
      setPaymentModalOpen(false);
      setPaymentDebt(null);
    }, []);

  /* =======================================================
     TAB CONTENT
  ======================================================= */

  const renderTabContent = () => {
    switch (activeTab) {
      /* ===================================================
         LOANS & EMI
      =================================================== */

      case "loans":
        return (
          <section
            className="
              min-w-0
              space-y-5
            "
          >
            <SectionHeader
              eyebrow="Loans & installments"
              title="Loans & EMI"
              description="Track loan balances, EMIs, installment progress and upcoming repayments."
              action={
                <AddButton
                  onClick={() =>
                    openAddDebt(
                      "loan"
                    )
                  }
                >
                  Add Loan
                </AddButton>
              }
            />

            <DebtList
              view="loans"
              onAddDebt={() =>
                openAddDebt(
                  "loan"
                )
              }
              onEditDebt={
                openEditDebt
              }
              onDeleteDebt={
                handleDeleteDebt
              }
              onRecordPayment={
                openPaymentModal
              }
              onViewDetails={
                openEditDebt
              }
            />
          </section>
        );

      /* ===================================================
         MONEY BORROWED
      =================================================== */

      case "borrowed":
        return (
          <section
            className="
              min-w-0
              space-y-5
            "
          >
            <SectionHeader
              eyebrow="Money you owe"
              title="Money Borrowed"
              description="Keep track of money borrowed from friends, family or other people."
              action={
                <AddButton
                  variant="borrowed"
                  onClick={() =>
                    openAddDebt(
                      "borrowed"
                    )
                  }
                >
                  Add Borrowed
                </AddButton>
              }
            />

            <DebtList
              view="borrowed"
              onAddDebt={() =>
                openAddDebt(
                  "borrowed"
                )
              }
              onEditDebt={
                openEditDebt
              }
              onDeleteDebt={
                handleDeleteDebt
              }
              onRecordPayment={
                openPaymentModal
              }
              onViewDetails={
                openEditDebt
              }
            />
          </section>
        );

      /* ===================================================
         MONEY LENT
      =================================================== */

      case "lent":
        return (
          <section
            className="
              min-w-0
              space-y-5
            "
          >
            <SectionHeader
              eyebrow="Money to collect"
              title="Money Lent"
              description="Monitor money lent to others and repayments you are waiting to receive."
              action={
                <AddButton
                  variant="lent"
                  onClick={() =>
                    openAddDebt(
                      "lent"
                    )
                  }
                >
                  Add Money Lent
                </AddButton>
              }
            />

            <DebtList
              view="lent"
              onAddDebt={() =>
                openAddDebt(
                  "lent"
                )
              }
              onEditDebt={
                openEditDebt
              }
              onDeleteDebt={
                handleDeleteDebt
              }
              onRecordPayment={
                openPaymentModal
              }
              onViewDetails={
                openEditDebt
              }
            />
          </section>
        );

      /* ===================================================
         PAYMENT HISTORY
      =================================================== */

      case "history":
        return (
          <section
            className="
              min-w-0
              space-y-5
            "
          >
            <SectionHeader
              eyebrow="Repayment records"
              title="Payment History"
              description="Review payments made toward debt and repayments received from others."
            />

            <DebtPaymentHistory
              onAddDebt={() =>
                openAddDebt()
              }
            />
          </section>
        );

      /* ===================================================
         OVERVIEW
      =================================================== */

      case "overview":
      default:
        return (
          <div
            className="
              min-w-0
              space-y-8
            "
          >
            <section
              className="
                min-w-0
                space-y-5
              "
            >
              <SectionHeader
                eyebrow="Debt position"
                title="Debt Overview"
                description="Understand what you owe, what others owe you, and the records that need attention."
              />

              <DebtOverview
                onAddDebt={() =>
                  openAddDebt()
                }
                onRecordPayment={
                  openPaymentModal
                }
                onOpenHistory={() =>
                  handleTabChange(
                    "history"
                  )
                }
                onViewLoans={() =>
                  handleTabChange(
                    "loans"
                  )
                }
                onViewBorrowed={() =>
                  handleTabChange(
                    "borrowed"
                  )
                }
                onViewLent={() =>
                  handleTabChange(
                    "lent"
                  )
                }
              />
            </section>

            {/* =============================================
                ALERTS
            ============================================== */}

            <section
              className="
                min-w-0
                space-y-5
              "
            >
              <SectionHeader
                eyebrow="Attention required"
                title="Payment Alerts"
                description="Overdue payments and repayments that are approaching their due date."
              />

              <DebtAlerts
                limit={5}
                onAddDebt={() =>
                  openAddDebt()
                }
                onRecordPayment={
                  openPaymentModal
                }
                onViewAll={() => {
                  document
                    .getElementById(
                      "upcoming-debt-payments"
                    )
                    ?.scrollIntoView({
                      behavior:
                        "smooth",
                      block: "start",
                    });
                }}
              />
            </section>

            {/* =============================================
                UPCOMING PAYMENTS
            ============================================== */}

            <section
              id="upcoming-debt-payments"
              className="
                min-w-0
                scroll-mt-28
                space-y-5
              "
            >
              <SectionHeader
                eyebrow="Repayment calendar"
                title="Upcoming Payments"
                description="See overdue payments and everything scheduled during the next 30 days."
              />

              <UpcomingDebtPayments
                limit={8}
                onAddDebt={() =>
                  openAddDebt()
                }
                onRecordPayment={
                  openPaymentModal
                }
                onViewAll={() =>
                  handleTabChange(
                    "loans"
                  )
                }
              />
            </section>
          </div>
        );
    }
  };

  return (
    <div
      className="
        min-w-0
        space-y-8
        pb-10
      "
    >
      {/* ===================================================
          NEW REUSABLE DEBT HEADER
      =================================================== */}

      <DebtHeader
        onAddDebt={() =>
          openAddDebt(
            getDefaultTypeForTab(
              activeTab
            )
          )
        }
        onOpenHistory={() =>
          handleTabChange(
            "history"
          )
        }
      />

      {/* ===================================================
          SUMMARY
      =================================================== */}

      <section
        className="
          min-w-0
          space-y-5
        "
      >
        <SectionHeader
          eyebrow="Financial position"
          title="Debt Summary"
          description="A complete snapshot of your liabilities, receivables, repayments and overdue balances."
        />

        <DebtSummary />
      </section>

      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (
        <section
          className="
            flex
            min-w-0
            items-start
            justify-between
            gap-4
            rounded-2xl
            border
            border-rose-500/20
            bg-rose-500/[0.06]
            p-4
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
            <AlertTriangle
              size={18}
              className="
                mt-0.5
                shrink-0
                text-rose-500
              "
            />

            <div className="min-w-0">
              <p
                className="
                  text-xs
                  font-black
                  text-rose-600
                  dark:text-rose-300
                "
              >
                Unable to load some debt
                information
              </p>

              <p
                className="
                  mt-1
                  break-words
                  text-[10px]
                  leading-5
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {typeof error ===
                "string"
                  ? error
                  : error?.message ||
                    "An unexpected Debt Center error occurred."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              clearDebtError?.()
            }
            className="
              shrink-0
              text-[10px]
              font-black
              text-rose-600
              dark:text-rose-300
            "
          >
            Dismiss
          </button>
        </section>
      )}

      {/* ===================================================
          TAB NAVIGATION
      =================================================== */}

      <section
        className="
          min-w-0
          space-y-4
        "
      >
        <SectionHeader
          eyebrow="Debt management"
          title="Manage Your Records"
          description="Switch between the complete overview, loans, borrowed money, money lent and repayment history."
        />

        <DebtTabs
          activeTab={activeTab}
          onTabChange={
            handleTabChange
          }
        />
      </section>

      {/* ===================================================
          ACTIVE CONTENT
      =================================================== */}

      <motion.div
        key={activeTab}
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.25,
        }}
        className="min-w-0"
      >
        {renderTabContent()}
      </motion.div>

      {/* ===================================================
          FOOTER INFORMATION
      =================================================== */}

      <section
        className="
          relative
          min-w-0
          overflow-hidden
          rounded-[28px]
          border
          border-slate-200/80
          bg-white
          p-5
          shadow-sm
          dark:border-white/[0.08]
          dark:bg-[#0a1427]
          sm:p-6
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            h-48
            w-48
            rounded-full
            bg-cyan-500/[0.08]
            blur-[80px]
          "
        />

        <div
          className="
            relative
            flex
            min-w-0
            flex-col
            gap-4
            md:flex-row
            md:items-center
            md:justify-between
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
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-emerald-500/10
                text-emerald-600
                dark:text-emerald-300
              "
            >
              <ShieldCheck
                size={19}
              />
            </div>

            <div className="min-w-0">
              <h3
                className="
                  text-sm
                  font-black
                  text-slate-950
                  dark:text-white
                "
              >
                Keep your liabilities
                organized
              </h3>

              <p
                className="
                  mt-1
                  max-w-2xl
                  text-[10px]
                  leading-5
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Every repayment automatically
                updates your outstanding
                balance, progress, due status
                and payment history.
              </p>
            </div>
          </div>

          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-emerald-500/20
              bg-emerald-500/10
              px-3
              py-2
              text-[10px]
              font-black
              text-emerald-700
              dark:text-emerald-300
            "
          >
            <CheckCircle2
              size={14}
            />

            Debt tracking active
          </div>
        </div>
      </section>

      {/* ===================================================
          ADD / EDIT MODAL
      =================================================== */}

      <DebtFormModal
        open={debtModalOpen}
        editingDebt={
          editingDebt
        }
        defaultType={
          defaultDebtType
        }
        onClose={
          closeDebtModal
        }
      />

      {/* ===================================================
          PAYMENT MODAL
      =================================================== */}

      <DebtPaymentModal
        open={
          paymentModalOpen
        }
        debt={paymentDebt}
        onClose={
          closePaymentModal
        }
      />
    </div>
  );
}

export default DebtCenter;