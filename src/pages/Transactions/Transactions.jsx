import { useState } from "react";

import useFinance from "../../hooks/useFinance";

import TransactionHeader from "../../components/transactions/TransactionHeader";
import TransactionStats from "../../components/transactions/TransactionStats";
import TransactionSearch from "../../components/transactions/TransactionSearch";
import TransactionFilters from "../../components/transactions/TransactionFilters";
import TransactionTable from "../../components/transactions/TransactionTable";
import EditTransactionModal from "../../components/transactions/EditTransactionModal";
import AddTransactionForm from "../../components/transactions/AddTransactionForm";

import SectionReveal from "../../components/common/SectionReveal";

function Transactions() {
  const finance = useFinance() || {};

  const transactions = Array.isArray(
    finance.transactions
  )
    ? finance.transactions
    : [];

  /* =======================================================
     FILTER STATE
  ======================================================= */

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");

  /* =======================================================
     MODAL STATE
  ======================================================= */

  const [editing, setEditing] = useState(null);

  const [addModalOpen, setAddModalOpen] =
    useState(false);

  /* =======================================================
     TRANSACTION COUNTS
  ======================================================= */

  const transactionCount =
    transactions.length;

  const incomeCount = transactions.filter(
    (transaction) =>
      String(
        transaction.type || ""
      ).toLowerCase() === "income"
  ).length;

  const expenseCount = transactions.filter(
    (transaction) =>
      String(
        transaction.type || ""
      ).toLowerCase() === "expense"
  ).length;

  /* =======================================================
     HANDLERS
  ======================================================= */

  const handleOpenAddModal = () => {
    setEditing(null);
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
  };

  const handleOpenEditModal = (
    transaction
  ) => {
    setAddModalOpen(false);
    setEditing(transaction);
  };

  const handleCloseEditModal = () => {
    setEditing(null);
  };

  const handleResetFilters = () => {
    setSearch("");
    setFilter("all");
    setCategory("all");
    setSort("newest");
  };

  return (
    <section className="min-w-0 space-y-6">
      {/* Header */}

      <SectionReveal className="pt-10">
        <TransactionHeader
          onAddClick={
            handleOpenAddModal
          }
          transactionCount={
            transactionCount
          }
          incomeCount={incomeCount}
          expenseCount={expenseCount}
        />
      </SectionReveal>

      {/* Statistics */}

      <SectionReveal delay={0.05}>
        <TransactionStats />
      </SectionReveal>

      {/* Transactions layout */}

      <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_244px]">
        {/* Search and transaction table */}

        <SectionReveal
          delay={0.1}
          className="min-w-0 space-y-5"
        >
          <TransactionSearch
            search={search}
            setSearch={setSearch}
          />

          <TransactionTable
            search={search}
            filter={filter}
            category={category}
            sort={sort}
            onEdit={
              handleOpenEditModal
            }
            onAdd={
              handleOpenAddModal
            }
          />
        </SectionReveal>

        {/* Filter sidebar */}

        <SectionReveal
          delay={0.14}
          direction="left"
          className="min-w-0 xl:sticky xl:top-24"
        >
          <TransactionFilters
            filter={filter}
            setFilter={setFilter}
            category={category}
            setCategory={setCategory}
            sort={sort}
            setSort={setSort}
            onReset={
              handleResetFilters
            }
          />
        </SectionReveal>
      </div>

      {/* Add transaction modal */}

      <AddTransactionForm
        open={addModalOpen}
        onClose={handleCloseAddModal}
      />

      {/* Edit transaction modal */}

      {editing && (
        <EditTransactionModal
          transaction={editing}
          onClose={
            handleCloseEditModal
          }
        />
      )}
    </section>
  );
}

export default Transactions;