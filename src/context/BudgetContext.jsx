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
  createBudget,
  deleteBudgetRecord,
  getBudgets,
  updateBudgetRecord,
} from "../services/budgetService";

export const BudgetContext =
  createContext(null);

function mapBudget(row) {
  return {
    id: row.id,
    userId: row.user_id,

    category: row.category,
    amount: Number(row.amount),

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function BudgetProvider({ children }) {
  const { user, loading: authLoading } =
    useAuth();

  const { addActivity } =
    useActivity();

  const [budgets, setBudgets] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadBudgets =
    useCallback(async () => {
      if (!user?.id) {
        setBudgets([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const result =
          await getBudgets(user.id);

        if (result.error) {
          throw result.error;
        }

        setBudgets(
          result.data.map(mapBudget)
        );
      } catch (loadError) {
        console.error(
          "Failed to load budgets:",
          loadError
        );

        setBudgets([]);

        setError(
          loadError.message ||
            "Unable to load budgets."
        );
      } finally {
        setLoading(false);
      }
    }, [user?.id]);

  useEffect(() => {
    if (authLoading) return;

    loadBudgets();
  }, [
    authLoading,
    loadBudgets,
  ]);

  const addBudget = useCallback(
    async (budgetData) => {
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
          await createBudget(
            user.id,
            budgetData
          );

        if (result.error) {
          throw result.error;
        }

        const newBudget =
          mapBudget(result.data);

        setBudgets((current) => [
          newBudget,
          ...current,
        ]);

        addActivity({
          type: "budget",
          title: "Budget created",
          description: `${
            newBudget.category
          } • ₹${newBudget.amount.toLocaleString(
            "en-IN"
          )}`,
          metadata: {
            budgetId:
              newBudget.id,
          },
        });

        return {
          success: true,
          data: newBudget,
        };
      } catch (addError) {
        console.error(
          "Failed to add budget:",
          addError
        );

        const message =
          addError.message ||
          "Unable to add budget.";

        setError(message);

        return {
          success: false,
          error: message,
        };
      }
    },
    [user?.id, addActivity]
  );

  const updateBudget =
    useCallback(
      async (budgetId, updates) => {
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
            await updateBudgetRecord(
              user.id,
              budgetId,
              updates
            );

          if (result.error) {
            throw result.error;
          }

          const updatedBudget =
            mapBudget(result.data);

          setBudgets((current) =>
            current.map((budget) =>
              budget.id === budgetId
                ? updatedBudget
                : budget
            )
          );

          addActivity({
            type: "budget",
            title: "Budget updated",
            description:
              updatedBudget.category,
          });

          return {
            success: true,
            data: updatedBudget,
          };
        } catch (updateError) {
          console.error(
            "Failed to update budget:",
            updateError
          );

          const message =
            updateError.message ||
            "Unable to update budget.";

          setError(message);

          return {
            success: false,
            error: message,
          };
        }
      },
      [user?.id, addActivity]
    );

  const deleteBudget =
    useCallback(
      async (budgetId) => {
        if (!user?.id) {
          return {
            success: false,
            error:
              "You must be logged in.",
          };
        }

        const existing =
          budgets.find(
            (budget) =>
              budget.id === budgetId
          );

        try {
          setError("");

          const result =
            await deleteBudgetRecord(
              user.id,
              budgetId
            );

          if (result.error) {
            throw result.error;
          }

          setBudgets((current) =>
            current.filter(
              (budget) =>
                budget.id !== budgetId
            )
          );

          addActivity({
            type: "budget",
            title: "Budget deleted",
            description:
              existing?.category ||
              "A budget was removed.",
          });

          return {
            success: true,
          };
        } catch (deleteError) {
          console.error(
            "Failed to delete budget:",
            deleteError
          );

          const message =
            deleteError.message ||
            "Unable to delete budget.";

          setError(message);

          return {
            success: false,
            error: message,
          };
        }
      },
      [
        user?.id,
        budgets,
        addActivity,
      ]
    );

  const clearBudgets =
    useCallback(async () => {
      if (!user?.id) return;

      try {
        const results =
          await Promise.all(
            budgets.map((budget) =>
              deleteBudgetRecord(
                user.id,
                budget.id
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

        setBudgets([]);

        addActivity({
          type: "budget",
          title:
            "All budgets cleared",
          description:
            "All budget records were removed.",
        });
      } catch (clearError) {
        console.error(
          "Unable to clear budgets:",
          clearError
        );

        setError(
          clearError.message ||
            "Unable to clear budgets."
        );
      }
    }, [
      user?.id,
      budgets,
      addActivity,
    ]);

  const totalBudget = useMemo(
    () =>
      budgets.reduce(
        (total, budget) =>
          total +
          Number(budget.amount),
        0
      ),
    [budgets]
  );

  const value = useMemo(
    () => ({
      budgets,
      totalBudget,

      loading,
      error,

      loadBudgets,

      addBudget,
      updateBudget,
      deleteBudget,
      clearBudgets,
    }),
    [
      budgets,
      totalBudget,
      loading,
      error,
      loadBudgets,
      addBudget,
      updateBudget,
      deleteBudget,
      clearBudgets,
    ]
  );

  return (
    <BudgetContext.Provider
      value={value}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export default BudgetProvider;