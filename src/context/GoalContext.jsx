import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const GoalContext = createContext();

function GoalProvider({ children }) {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem("goals");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "goals",
      JSON.stringify(goals)
    );
  }, [goals]);

  // Add Goal
  const addGoal = (goal) => {
    setGoals((prev) => [
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...goal,
      },
      ...prev,
    ]);
  };

  // Update Goal
  const updateGoal = (updatedGoal) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === updatedGoal.id
          ? updatedGoal
          : goal
      )
    );
  };

  // Delete Goal
  const deleteGoal = (id) => {
    setGoals((prev) =>
      prev.filter((goal) => goal.id !== id)
    );
  };

  const totalGoals = useMemo(
    () => goals.length,
    [goals]
  );

  const totalTarget = useMemo(
    () =>
      goals.reduce(
        (sum, goal) => sum + Number(goal.target || 0),
        0
      ),
    [goals]
  );

  return (
    <GoalContext.Provider
      value={{
        goals,
        totalGoals,
        totalTarget,
        addGoal,
        updateGoal,
        deleteGoal,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
}

export default GoalProvider;