
import { supabase } from "./supabase-client.js";
import { signInWithGoogle, signOutCloud, uploadSave, downloadSave, getCurrentUser } from "./cloudsave.js";

const stateEl = document.getElementById("accountState");
const msgEl = document.getElementById("syncMsg");

async function refresh(){
  try{
    const user = await getCurrentUser();
    if(user){
      stateEl.innerHTML = `已登入：<b>${user.email || user.id}</b>`;
    }else{
      stateEl.textContent = "尚未登入。";
    }
  }catch(e){
    stateEl.textContent = "帳號設定尚未完成。請先填寫 cloud-config.js。";
  }
}
document.getElementById("loginBtn").onclick=async()=>{
  try{ await signInWithGoogle(); }catch(e){ msgEl.textContent="登入失敗："+e.message; }
};
document.getElementById("logoutBtn").onclick=async()=>{
  await signOutCloud(); msgEl.textContent="已登出。"; refresh();
};
document.getElementById("uploadBtn").onclick=async()=>{
  try{
    await uploadSave(); msgEl.textContent="目前進度已上傳到雲端。";
  }catch(e){msgEl.textContent="上傳失敗："+e.message}
};
document.getElementById("downloadBtn").onclick=async()=>{
  try{
    const data=await downloadSave();
    msgEl.textContent=data ? "已下載雲端存檔。重新整理遊戲即可看到進度。" : "雲端目前沒有存檔。";
  }catch(e){msgEl.textContent="下載失敗："+e.message}
};

supabase.auth.onAuthStateChange(()=>refresh());
refresh();
