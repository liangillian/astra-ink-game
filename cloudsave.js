
import { supabase, cloudConfigured } from "./supabase-client.js";

const LOCAL_SAVE_KEY = "astra_ink_multifile_v2";

export async function getCurrentUser(){
  if(!cloudConfigured || !supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

export async function signInWithGoogle(){
  if(!cloudConfigured || !supabase) throw new Error("尚未設定 Supabase");
  const redirectTo = new URL("login.html", window.location.href).href;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo }
  });
  if(error) throw error;
}

export async function signOutCloud(){
  if(!cloudConfigured || !supabase) return;
  await supabase.auth.signOut();
}

export async function uploadSave(){
  const user = await getCurrentUser();
  if(!user) throw new Error("尚未登入 Google 帳號");
  const raw = localStorage.getItem(LOCAL_SAVE_KEY);
  const saveData = raw ? JSON.parse(raw) : {};
  const payload = {
    user_id: user.id,
    save_data: saveData,
    updated_at: new Date().toISOString()
  };
  const { error } = await supabase
    .from("game_saves")
    .upsert(payload, { onConflict: "user_id" });
  if(error) throw error;
  return payload;
}

export async function downloadSave(){
  const user = await getCurrentUser();
  if(!user) throw new Error("尚未登入 Google 帳號");
  const { data, error } = await supabase
    .from("game_saves")
    .select("save_data,updated_at")
    .eq("user_id", user.id)
    .maybeSingle();
  if(error) throw error;
  if(!data?.save_data) return null;
  localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(data.save_data));
  return data;
}

export async function autoSyncSave(){
  const user = await getCurrentUser();
  if(!user) return { synced:false, reason:"not_signed_in" };

  const localRaw = localStorage.getItem(LOCAL_SAVE_KEY);
  const localData = localRaw ? JSON.parse(localRaw) : null;

  const { data, error } = await supabase
    .from("game_saves")
    .select("save_data,updated_at")
    .eq("user_id", user.id)
    .maybeSingle();
  if(error) throw error;

  if(!data?.save_data && localData){
    await uploadSave();
    return { synced:true, direction:"upload" };
  }
  if(data?.save_data && !localData){
    localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(data.save_data));
    return { synced:true, direction:"download" };
  }
  return { synced:true, direction:"none" };
}
