import { supabase } from "../lib/supabase";

export async function getBudgets(userId) {
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  return {
    data: data || [],
    error,
  };
}

export async function createBudget(
  userId,
  budget
) {
  const { data, error } = await supabase
    .from("budgets")
    .insert({
      user_id: userId,
      category: budget.category,
      amount: Number(budget.amount),
    })
    .select()
    .single();

  return {
    data,
    error,
  };
}

export async function updateBudgetRecord(
  userId,
  budgetId,
  updates
) {
  const { data, error } = await supabase
    .from("budgets")
    .update({
      category: updates.category,
      amount: Number(updates.amount),
    })
    .eq("id", budgetId)
    .eq("user_id", userId)
    .select()
    .single();

  return {
    data,
    error,
  };
}

export async function deleteBudgetRecord(
  userId,
  budgetId
) {
  const { error } = await supabase
    .from("budgets")
    .delete()
    .eq("id", budgetId)
    .eq("user_id", userId);

  return {
    error,
  };
}