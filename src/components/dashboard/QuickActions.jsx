import QuickActionCard from "./QuickActionCard";
import { quickActions } from "../../data/quickActions";

function QuickActions() {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      {quickActions.map((item) => (
        <QuickActionCard
          key={item.id}
          {...item}
        />
      ))}
    </div>
  );
}

export default QuickActions;