
const state=loadSave();
const nameInput=document.getElementById("playerName");
const nickInput=document.getElementById("playerNickname");
nameInput.value=state.player?.name||"";
nickInput.value=state.player?.nickname||"";
function refreshPreview(){
 const temp={player:{name:nameInput.value,nickname:nickInput.value}};
 document.querySelectorAll("[data-preview]").forEach(el=>el.textContent=playerName(temp));
}
nameInput.addEventListener("input",refreshPreview);
nickInput.addEventListener("input",refreshPreview);
document.getElementById("saveProfileBtn").onclick=()=>{
 state.player={name:nameInput.value.trim(),nickname:nickInput.value.trim()};
 saveGame(state);
 document.getElementById("profileSaved").textContent="已儲存。之後角色會用這個稱呼叫你。";
 refreshPreview();
};
refreshPreview();
