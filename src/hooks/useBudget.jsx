import { useContext } from "react";

import {
  BudgetContext,
} from "../context/BudgetContext";

function useBudget() {
  const context =
    useContext(BudgetContext);

  if (!context) {
    throw new Error(
      "useBudget must be used inside BudgetProvider."
    );
  }

  return context;
}

export default useBudget;