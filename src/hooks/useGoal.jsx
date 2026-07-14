import { useContext } from "react";

import {
  GoalContext,
} from "../context/GoalContext";

function useGoal() {
  const context =
    useContext(GoalContext);

  if (!context) {
    throw new Error(
      "useGoal must be used inside GoalProvider."
    );
  }

  return context;
}

export default useGoal;