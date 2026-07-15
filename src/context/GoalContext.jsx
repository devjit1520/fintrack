import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import useAuth from "../hooks/useAuth";
import useActivity from "../hooks/useActivity";

import {
  createGoal,
  deleteGoalRecord,
  getGoals,
  updateGoalRecord,
} from "../services/goalService";

export const GoalContext =
  createContext(null);
function mapGoal(row) {
  return {
    id: row.id,
    userId: row.user_id,

    title: row.title || "Untitled Goal",

    // Supabase database values
    targetAmount: Number(
      row.target_amount ??
      row.targetAmount ??
      row.target ??
      row.amount ??
      0
    ),

    savedAmount: Number(
      row.saved_amount ??
      row.savedAmount ??
      row.saved ??
      row.currentAmount ??
      0
    ),

    // Compatibility with older UI components
    target: Number(
      row.target_amount ??
      row.targetAmount ??
      row.target ??
      row.amount ??
      0
    ),

    amount: Number(
      row.target_amount ??
      row.targetAmount ??
      row.target ??
      row.amount ??
      0
    ),

    saved: Number(
      row.saved_amount ??
      row.savedAmount ??
      row.saved ??
      row.currentAmount ??
      0
    ),

    deadline: row.deadline || "",

    status: String(
      row.status || "active"
    ).toLowerCase(),

    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
  };
}

function GoalProvider({ children }) {
  const { user, loading: authLoading } =
    useAuth();

  const { addActivity } =
    useActivity();

  const [goals, setGoals] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadGoals =
    useCallback(async () => {
      if (!user?.id) {
        setGoals([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const result =
          await getGoals(user.id);

        if (result.error) {
          throw result.error;
        }

        setGoals(
          result.data.map(mapGoal)
        );
      } catch (loadError) {
        console.error(
          "Failed to load goals:",
          loadError
        );

        setGoals([]);

        setError(
          loadError.message ||
            "Unable to load goals."
        );
      } finally {
        setLoading(false);
      }
    }, [user?.id]);

  useEffect(() => {
    if (authLoading) return;

    loadGoals();
  }, [
    authLoading,
    loadGoals,
  ]);

  const addGoal = useCallback(
    async (goalData) => {
      if (!user?.id) {
        return {
          success: false,
          error:
            "You must be logged in.",
        };
      }

      try {
        setError("");

        const result =
          await createGoal(
            user.id,
            goalData
          );

        if (result.error) {
          throw result.error;
        }

const newGoal = mapGoal(result.data);

setGoals((current) => [
  newGoal,
  ...current,
]);

        addActivity({
          type: "goal",
          title: "Goal created",
          description: newGoal.title,
          metadata: {
            goalId: newGoal.id,
          },
        });

        return {
          success: true,
          data: newGoal,
        };
      } catch (addError) {
        console.error(
          "Failed to create goal:",
          addError
        );

        const message =
          addError.message ||
          "Unable to create goal.";

        setError(message);

        return {
          success: false,
          error: message,
        };
      }
    },
    [user?.id, addActivity]
  );

  const updateGoal =
    useCallback(
      async (goalId, updates) => {
        if (!user?.id) {
          return {
            success: false,
            error:
              "You must be logged in.",
          };
        }

        try {
          setError("");

          const result =
            await updateGoalRecord(
              user.id,
              goalId,
              updates
            );

          if (result.error) {
            throw result.error;
          }

          const updatedGoal =
            mapGoal(result.data);

          setGoals((current) =>
            current.map((goal) =>
              goal.id === goalId
                ? updatedGoal
                : goal
            )
          );

          addActivity({
            type: "goal",
            title: "Goal updated",
            description:
              updatedGoal.title,
          });

          return {
            success: true,
            data: updatedGoal,
          };
        } catch (updateError) {
          console.error(
            "Failed to update goal:",
            updateError
          );

          const message =
            updateError.message ||
            "Unable to update goal.";

          setError(message);

          return {
            success: false,
            error: message,
          };
        }
      },
      [user?.id, addActivity]
    );

  const deleteGoal =
    useCallback(
      async (goalId) => {
        if (!user?.id) {
          return {
            success: false,
            error:
              "You must be logged in.",
          };
        }

        const existing =
          goals.find(
            (goal) =>
              goal.id === goalId
          );

        try {
          setError("");

          const result =
            await deleteGoalRecord(
              user.id,
              goalId
            );

          if (result.error) {
            throw result.error;
          }

          setGoals((current) =>
            current.filter(
              (goal) =>
                goal.id !== goalId
            )
          );

          addActivity({
            type: "goal",
            title: "Goal deleted",
            description:
              existing?.title ||
              "A goal was removed.",
          });

          return {
            success: true,
          };
        } catch (deleteError) {
          console.error(
            "Failed to delete goal:",
            deleteError
          );

          const message =
            deleteError.message ||
            "Unable to delete goal.";

          setError(message);

          return {
            success: false,
            error: message,
          };
        }
      },
      [
        user?.id,
        goals,
        addActivity,
      ]
    );

  const clearGoals =
    useCallback(async () => {
      if (!user?.id) return;

      try {
        const results =
          await Promise.all(
            goals.map((goal) =>
              deleteGoalRecord(
                user.id,
                goal.id
              )
            )
          );

        const failed =
          results.find(
            (result) =>
              result.error
          );

        if (failed?.error) {
          throw failed.error;
        }

        setGoals([]);

        addActivity({
          type: "goal",
          title:
            "All goals cleared",
          description:
            "All goal records were removed.",
        });
      } catch (clearError) {
        console.error(
          "Unable to clear goals:",
          clearError
        );

        setError(
          clearError.message ||
            "Unable to clear goals."
        );
      }
    }, [
      user?.id,
      goals,
      addActivity,
    ]);

  const totalGoals =
    goals.length;

  const totalTarget =
    useMemo(
      () =>
        goals.reduce(
          (total, goal) =>
            total +
            Number(
              goal.targetAmount
            ),
          0
        ),
      [goals]
    );

  const totalSaved =
    useMemo(
      () =>
        goals.reduce(
          (total, goal) =>
            total +
            Number(
              goal.savedAmount
            ),
          0
        ),
      [goals]
    );

  const value = useMemo(
    () => ({
      goals,

      totalGoals,
      totalTarget,
      totalSaved,

      loading,
      error,

      loadGoals,

      addGoal,
      updateGoal,
      deleteGoal,
      clearGoals,
    }),
    [
      goals,
      totalGoals,
      totalTarget,
      totalSaved,
      loading,
      error,
      loadGoals,
      addGoal,
      updateGoal,
      deleteGoal,
      clearGoals,
    ]
  );

  return (
    <GoalContext.Provider
      value={value}
    >
      {children}
    </GoalContext.Provider>
  );
}

export default GoalProvider;