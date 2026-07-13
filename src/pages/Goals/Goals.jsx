import { useState } from "react";

import GoalsHeader from "../../components/goals/GoalsHeader";
import GoalStats from "../../components/goals/GoalStats";
import GoalList from "../../components/goals/GoalList";
import AddGoalModal from "../../components/goals/AddGoalModal";

function Goals() {
  const [open, setOpen] = useState(false);

  return (
    <section className="space-y-8">
      <GoalsHeader onAdd={() => setOpen(true)} />

      <GoalStats />

      <GoalList />

      <AddGoalModal
      open={open}
      onClose={() => setOpen(false)}
    />
    </section>
  );
}

export default Goals;