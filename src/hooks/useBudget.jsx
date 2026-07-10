import { useContext } from "react";
import { BudgetContext } from "../context/BudgetContext";

function useBudget() {
  return useContext(BudgetContext);
}

export default useBudget;