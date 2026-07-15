import GoalCard from "./GoalCard";
import EmptyGoals from "./EmptyGoals";

function GoalGrid({
  goals,
  hasFilters,
  onCreateGoal,
  onEditGoal,
}) {
  if (!goals.length) {
    return (
      <EmptyGoals
        hasFilters={hasFilters}
        onCreateGoal={onCreateGoal}
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onEdit={() => onEditGoal(goal)}
        />
      ))}
    </div>
  );
}

export default GoalGrid;