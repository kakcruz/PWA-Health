import { supabase } from "../lib/supabase";

export async function saveWeight(payload) {
  if (!supabase) return { skipped: true, reason: "Supabase nao configurado" };
  const { data, error } = await supabase.from("weights").insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function saveApplication(payload) {
  if (!supabase) return { skipped: true, reason: "Supabase nao configurado" };
  const { data, error } = await supabase.from("applications").insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function savePhoto(payload) {
  if (!supabase) return { skipped: true, reason: "Supabase nao configurado" };
  const { data, error } = await supabase.from("photos").insert(payload).select().single();
  if (error) throw error;
  return data;
}
