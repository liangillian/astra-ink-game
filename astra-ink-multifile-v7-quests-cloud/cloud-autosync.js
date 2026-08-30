
import { supabase, cloudConfigured } from "./supabase-client.js";
import { uploadSave, getCurrentUser } from "./cloudsave.js";

let timer=null;
async function syncSoon(){
 if(!cloudConfigured || !supabase)return;
 clearTimeout(timer);
 timer=setTimeout(async()=>{
  try{
   const user=await getCurrentUser();
   if(user) await uploadSave();
  }catch(e){
   console.warn("ASTRA cloud autosync:",e.message);
  }
 },1800);
}
window.addEventListener("astra-save-changed",syncSoon);
