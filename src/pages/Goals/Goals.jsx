import { useState } from "react";

import GoalHeader from "../../components/goals/GoalHeader";
import GoalStats from "../../components/goals/GoalStats";
import GoalProgress from "../../components/goals/GoalProgress";
import GoalDeadlineAlerts from "../../components/goals/GoalDeadlineAlerts";
import GoalList from "../../components/goals/GoalList";
import GoalToolbar from "../../components/goals/GoalToolbar";
import GoalModal from "../../components/goals/GoalModal";
import EditGoalModal from "../../components/goals/EditGoalModal";

import SectionReveal from "../../components/common/SectionReveal";

function Goals() {
  /* =======================================================
     FILTER STATE
  ======================================================= */

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("deadline-soon");

  /* =======================================================
     MODAL STATE
  ======================================================= */

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  /* =======================================================
     MODAL HANDLERS
  ======================================================= */

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
  };

  const handleOpenEditModal = (goal) => {
    if (!goal) {
      return;
    }

    setEditingGoal(goal);
  };

  const handleCloseEditModal = () => {
    setEditingGoal(null);
  };

  /* =======================================================
     FILTER RESET
  ======================================================= */

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setSort("deadline-soon");
  };

  return (
    <section className="min-w-0 space-y-6">
      {/* Page header */}
      <SectionReveal>
        <GoalHeader onAddClick={handleOpenAddModal} />
      </SectionReveal>

      {/* Goal statistics */}
      <SectionReveal delay={0.05}>
        <GoalStats />
      </SectionReveal>

      {/* Overall goal progress */}
      <SectionReveal delay={0.08}>
        <GoalProgress />
      </SectionReveal>

      {/* Deadline alerts */}
      <SectionReveal delay={0.1}>
        <GoalDeadlineAlerts />
      </SectionReveal>

      {/* Goals and toolbar */}
      <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
        {/* Goal list */}
        <SectionReveal
          delay={0.12}
          className="min-w-0"
        >
          <GoalList
            search={search}
            status={status}
            sort={sort}
            onEdit={handleOpenEditModal}
            onAdd={handleOpenAddModal}
          />
        </SectionReveal>

        {/* Goal controls */}
        <SectionReveal
          delay={0.16}
          direction="left"
          className="min-w-0 xl:sticky xl:top-24"
        >
          <GoalToolbar
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

      {/* Add goal modal */}
      {addModalOpen && (
        <GoalModal
          open={addModalOpen}
          onClose={handleCloseAddModal}
        />
      )}

      {/* Edit goal modal */}
      {editingGoal && (
        <EditGoalModal
          goal={editingGoal}
          open={Boolean(editingGoal)}
          onClose={handleCloseEditModal}
        />
      )}
    </section>
  );
}

export default Goals;