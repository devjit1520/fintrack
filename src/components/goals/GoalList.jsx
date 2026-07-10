import Card from "../common/Card";
import useGoal from "../../hooks/useGoal";
import GoalCard from "./GoalCard";

function GoalList() {
  const { goals } = useGoal();

  if (goals.length === 0) {
    return (
      <Card>
        <div className="py-16 text-center">
          <h2 className="text-2xl font-bold text-white">
            No Goals Yet
          </h2>

          <p className="mt-2 text-slate-400">
            Click "Add Goal" to create your first goal.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
        />
      ))}
    </div>
  );
}

export default GoalList;