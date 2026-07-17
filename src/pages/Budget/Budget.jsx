import { useState } from "react";

import BudgetHeader from "../../components/budget/BudgetHeader";
import BudgetStats from "../../components/budget/BudgetStats";
import BudgetSummary from "../../components/budget/BudgetSummary";
import BudgetToolbar from "../../components/budget/BudgetToolbar";
import BudgetList from "../../components/budget/BudgetList";
import BudgetAlert from "../../components/budget/BudgetAlert";
import AddBudgetModal from "../../components/budget/AddBudgetModal";
import EditBudgetModal from "../../components/budget/EditBudgetModal";

import SectionReveal from "../../components/common/SectionReveal";

function Budget() {
  /* =======================================================
     FILTER STATE
  ======================================================= */

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("highest");

  /* =======================================================
     MODAL STATE
  ======================================================= */

  const [addModalOpen, setAddModalOpen] =
    useState(false);

  const [editingBudget, setEditingBudget] =
    useState(null);

  /* =======================================================
     MODAL HANDLERS
  ======================================================= */

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
  };

  const handleOpenEditModal = (budget) => {
    setEditingBudget(budget);
  };

  const handleCloseEditModal = () => {
    setEditingBudget(null);
  };

  /* =======================================================
     FILTER RESET
  ======================================================= */

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setSort("highest");
  };

  return (
    <section className="space-y-6 pt-10">
      {/* ===============================================
          PAGE HEADER
      =============================================== */}

      <SectionReveal>
        <BudgetHeader
          onAddClick={handleOpenAddModal}
        />
      </SectionReveal>

      {/* ===============================================
          BUDGET ALERT
      =============================================== */}

      <SectionReveal delay={0.04}>
        <BudgetAlert />
      </SectionReveal>

      {/* ===============================================
          BUDGET STATISTICS
      =============================================== */}

      <SectionReveal delay={0.08}>
        <BudgetStats />
      </SectionReveal>

      {/* ===============================================
          BUDGET SUMMARY
      =============================================== */}

      <SectionReveal delay={0.12}>
        <BudgetSummary />
      </SectionReveal>

      {/* ===============================================
          BUDGET LIST AND FILTER SIDEBAR
      =============================================== */}

      <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
        {/* Budget list */}
        <SectionReveal
          delay={0.16}
          className="min-w-0"
        >
<BudgetList
  search={search}
  status={status}
  sort={sort}
  onEdit={handleOpenEditModal}
  onAdd={handleOpenAddModal}
/>
        </SectionReveal>

        {/* Filter toolbar */}
        <SectionReveal
          delay={0.2}
          direction="left"
          className="min-w-0 xl:sticky xl:top-24"
        >
<BudgetToolbar
  search={search}
  setSearch={setSearch}
  status={status}
  setStatus={setStatus}
  sort={sort}
  setSort={setSort}
  onReset={handleResetFilters}
/>
        </SectionReveal>
      </div>

      {/* ===============================================
          ADD BUDGET MODAL
      =============================================== */}

      <AddBudgetModal
        open={addModalOpen}
        onClose={handleCloseAddModal}
      />

      {/* ===============================================
          EDIT BUDGET MODAL
      =============================================== */}

      {editingBudget && (
        <EditBudgetModal
          budget={editingBudget}
          open={Boolean(editingBudget)}
          onClose={handleCloseEditModal}
        />
      )}
    </section>
  );
}

export default Budget;