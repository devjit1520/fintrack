import Card from "../common/Card";
import useBudget from "../../hooks/useBudget";
import BudgetCard from "./BudgetCard";

function BudgetList({
  search = "",
  category = "all",
}) {
  const { budgets } = useBudget();

  const filteredBudgets = budgets.filter((budget) => {
    const matchesSearch = budget.category
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "all" ||
      budget.category === category;

    return matchesSearch && matchesCategory;
  });

  if (filteredBudgets.length === 0) {
    return (
      <Card>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold text-white">
            No Budgets Found
          </h2>

          <p className="mt-2 text-slate-400">
            Try changing your search or category.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {filteredBudgets.map((budget) => (
        <BudgetCard
          key={budget.id}
          budget={budget}
        />
      ))}
    </div>
  );
}

export default BudgetList;