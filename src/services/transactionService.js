import { supabase } from "../lib/supabase";

export async function getTransactions(
  userId
) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("transaction_date", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    });

  return {
    data: data || [],
    error,
  };
}

export async function createTransaction(
  userId,
  transaction
) {
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: userId,
      title: transaction.title,
      amount: Number(transaction.amount),
      type: transaction.type,
      category:
        transaction.category || "Other",
      transaction_date:
        transaction.date ||
        new Date()
          .toISOString()
          .slice(0, 10),
      note: transaction.note || "",
    })
    .select()
    .single();

  return {
    data,
    error,
  };
}

export async function updateTransactionRecord(
  userId,
  transactionId,
  updates
) {
  const databaseUpdates = {};

  if (updates.title !== undefined) {
    databaseUpdates.title =
      updates.title;
  }

  if (updates.amount !== undefined) {
    databaseUpdates.amount =
      Number(updates.amount);
  }

  if (updates.type !== undefined) {
    databaseUpdates.type =
      updates.type;
  }

  if (updates.category !== undefined) {
    databaseUpdates.category =
      updates.category;
  }

  if (updates.date !== undefined) {
    databaseUpdates.transaction_date =
      updates.date;
  }

  if (updates.note !== undefined) {
    databaseUpdates.note =
      updates.note;
  }

  const { data, error } = await supabase
    .from("transactions")
    .update(databaseUpdates)
    .eq("id", transactionId)
    .eq("user_id", userId)
    .select()
    .single();

  return {
    data,
    error,
  };
}

export async function deleteTransactionRecord(
  userId,
  transactionId
) {
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", transactionId)
    .eq("user_id", userId);

  return {
    error,
  };
}