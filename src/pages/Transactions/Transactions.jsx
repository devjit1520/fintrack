import { useState } from "react";

import TransactionHeader from "../../components/transactions/TransactionHeader";
import TransactionStats from "../../components/transactions/TransactionStats";
import TransactionSearch from "../../components/transactions/TransactionSearch";
import TransactionFilters from "../../components/transactions/TransactionFilters";
import TransactionTable from "../../components/transactions/TransactionTable";
import EditTransactionModal from "../../components/transactions/EditTransactionModal";
import AddTransactionForm from "../../components/transactions/AddTransactionForm";
import SectionReveal from "../../components/common/SectionReveal";

function Transactions() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");

  const [editing, setEditing] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
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
    <section className="space-y-6">
      {/* Header */}
      <SectionReveal>
        <TransactionHeader
          onAddClick={handleOpenAddModal}
        />
      </SectionReveal>

      {/* Statistics */}
      <SectionReveal delay={0.05}>
        <TransactionStats />
      </SectionReveal>

      {/* Main layout */}
      <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_244px]">
        {/* Left column */}
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
            onEdit={setEditing}
            onAdd={handleOpenAddModal}
          />
        </SectionReveal>

        {/* Right filter column */}
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
            onReset={handleResetFilters}
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
          onClose={handleCloseEditModal}
        />
      )}
    </section>
  );
}

export default Transactions;