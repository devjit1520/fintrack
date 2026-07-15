import { supabase } from "../lib/supabase";

export async function getGoals(userId) {
  if (!userId) {
    return {
      data: [],
      error: new Error("User ID is required."),
    };
  }

  const { data, error } = await supabase
    .from("goals")
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

export async function createGoal(userId, goal) {
  if (!userId) {
    return {
      data: null,
      error: new Error("User ID is required."),
    };
  }

  const title = goal.title?.trim();

  const targetAmount = Number(
    goal.targetAmount ??
      goal.target ??
      goal.amount
  );

  const savedAmount = Number(
    goal.savedAmount ??
      goal.saved ??
      0
  );

  if (!title) {
    return {
      data: null,
      error: new Error("Goal title is required."),
    };
  }

  if (
    !Number.isFinite(targetAmount) ||
    targetAmount <= 0
  ) {
    return {
      data: null,
      error: new Error(
        "Target amount must be greater than zero."
      ),
    };
  }

  if (
    !Number.isFinite(savedAmount) ||
    savedAmount < 0
  ) {
    return {
      data: null,
      error: new Error(
        "Saved amount cannot be negative."
      ),
    };
  }

  const status =
    savedAmount >= targetAmount
      ? "completed"
      : String(
          goal.status || "active"
        ).toLowerCase();

  const { data, error } = await supabase
    .from("goals")
    .insert({
      user_id: userId,
      title,
      target_amount: targetAmount,
      saved_amount: savedAmount,
      deadline: goal.deadline || null,
      status,
    })
    .select()
    .single();

  return {
    data,
    error,
  };
}

export async function updateGoalRecord(
  userId,
  goalId,
  updates
) {
  if (!userId) {
    return {
      data: null,
      error: new Error("User ID is required."),
    };
  }

  if (!goalId) {
    return {
      data: null,
      error: new Error("Goal ID is required."),
    };
  }

  const databaseUpdates = {};

  if (updates.title !== undefined) {
    databaseUpdates.title =
      updates.title.trim();
  }

  if (
    updates.targetAmount !== undefined ||
    updates.target !== undefined ||
    updates.amount !== undefined
  ) {
    const targetAmount = Number(
      updates.targetAmount ??
        updates.target ??
        updates.amount
    );

    if (
      !Number.isFinite(targetAmount) ||
      targetAmount <= 0
    ) {
      return {
        data: null,
        error: new Error(
          "Target amount must be greater than zero."
        ),
      };
    }

    databaseUpdates.target_amount =
      targetAmount;
  }

  if (
    updates.savedAmount !== undefined ||
    updates.saved !== undefined
  ) {
    const savedAmount = Number(
      updates.savedAmount ??
        updates.saved
    );

    if (
      !Number.isFinite(savedAmount) ||
      savedAmount < 0
    ) {
      return {
        data: null,
        error: new Error(
          "Saved amount cannot be negative."
        ),
      };
    }

    databaseUpdates.saved_amount =
      savedAmount;
  }

  if (updates.deadline !== undefined) {
    databaseUpdates.deadline =
      updates.deadline || null;
  }

  if (updates.status !== undefined) {
    databaseUpdates.status =
      String(updates.status).toLowerCase();
  }

  const { data, error } = await supabase
    .from("goals")
    .update(databaseUpdates)
    .eq("id", goalId)
    .eq("user_id", userId)
    .select()
    .single();

  return {
    data,
    error,
  };
}

export async function deleteGoalRecord(
  userId,
  goalId
) {
  if (!userId) {
    return {
      error: new Error("User ID is required."),
    };
  }

  if (!goalId) {
    return {
      error: new Error("Goal ID is required."),
    };
  }

  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", goalId)
    .eq("user_id", userId);

  return {
    error,
  };
}