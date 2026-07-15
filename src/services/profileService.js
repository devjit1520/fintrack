import { supabase } from "../lib/supabase";

export async function getProfile(userId) {
  if (!userId) {
    return {
      data: null,
      error: new Error(
        "User ID is required."
      ),
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  return {
    data,
    error,
  };
}

export async function updateProfileRecord(
  userId,
  profileData
) {
  if (!userId) {
    return {
      data: null,
      error: new Error(
        "User ID is required."
      ),
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(profileData)
    .eq("id", userId)
    .select()
    .single();

  return {
    data,
    error,
  };
}

export async function upsertProfile(
  userId,
  profileData
) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        ...profileData,
      },
      {
        onConflict: "id",
      }
    )
    .select()
    .single();

  return {
    data,
    error,
  };
}