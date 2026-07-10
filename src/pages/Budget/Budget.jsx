import { useState } from "react";

import BudgetHeader from "../../components/budget/BudgetHeader";
import BudgetStats from "../../components/budget/BudgetStats";
import BudgetToolbar from "../../components/budget/BudgetToolbar";
import BudgetSummary from "../../components/budget/BudgetSummary";
import BudgetAlert from "../../components/budget/BudgetAlert";
import BudgetList from "../../components/budget/BudgetList";


function Budget() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  return (
    <section className="space-y-8">
      <BudgetHeader />

      <BudgetStats />

      <BudgetSummary />

      <BudgetAlert />

      <BudgetToolbar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      <BudgetList
        search={search}
        category={category}
      />
    </section>
  );
}

export default Budget;