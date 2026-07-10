import Card from "../common/Card";
import useGoal from "../../hooks/useGoal";

function GoalStats() {
  const { totalGoals, totalTarget } = useGoal();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <h3 className="text-slate-400">
          Total Goals
        </h3>

        <h2 className="mt-4 text-4xl font-bold text-white">
          {totalGoals}
        </h2>
      </Card>

      <Card>
        <h3 className="text-slate-400">
          Total Target
        </h3>

        <h2 className="mt-4 text-4xl font-bold text-green-400">
          ₹{totalTarget.toLocaleString("en-IN")}
        </h2>
      </Card>
    </div>
  );
}

export default GoalStats;