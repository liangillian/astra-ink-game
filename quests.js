
const state=loadSave();
ensureQuestPeriods(state);
if(!sessionStorage.getItem("astra_login_counted")){
 addQuestProgress(state,"login",1);
 sessionStorage.setItem("astra_login_counted","1");
 saveGame(state);
}

function renderGemBar(){
 const total=state.lifetimeGems||0, next=nextGemMilestone(total);
 const prevMarks=[0,1000,2500,5000,10000,20000,50000,100000].filter(x=>x<=total);
 const prev=prevMarks.length?prevMarks[prevMarks.length-1]:0;
 const pct=Math.max(0,Math.min(100,((total-prev)/(next-prev))*100));
 document.getElementById("currentGems").textContent=state.gems;
 document.getElementById("lifetimeGems").textContent=total;
 document.getElementById("gemMilestoneText").textContent=`${total} / ${next}`;
 document.getElementById("gemProgressBar").style.width=pct+"%";
}
function claim(scope,q){
 const claimed=state.quests[scope].claimed;
 if(claimed[q.id])return;
 const progress=state.quests.counters[q.counter]||0;
 if(progress<q.target)return;
 claimed[q.id]=true;
 addGems(state,q.reward,`${scope} 任務：${q.title}`);
 saveGame(state);renderAll();
}
function questRow(scope,q){
 const progress=Math.min(state.quests.counters[q.counter]||0,q.target);
 const done=progress>=q.target;
 const claimed=!!state.quests[scope].claimed[q.id];
 const pct=Math.round(progress/q.target*100);
 return `<div class="cardSpec">
   <div style="display:flex;justify-content:space-between;gap:12px;align-items:center">
    <div><b>${q.title}</b><div class="mini">${q.desc}</div></div>
    <button class="btn ${done&&!claimed?"gold":""}" ${done&&!claimed?"": "disabled"} onclick="claim('${scope}',QUESTS.${scope==="achievements"?"achievements":scope}.find(x=>x.id==='${q.id}'))">${claimed?"已領取":done?`領取 ${q.reward}`:`${progress}/${q.target}`}</button>
   </div>
   <div style="height:7px;background:rgba(255,255,255,.08);border-radius:999px;overflow:hidden;margin-top:9px"><i style="display:block;height:100%;width:${pct}%;background:linear-gradient(90deg,#7764ff,#f0cb72)"></i></div>
 </div>`;
}
function renderAll(){
 ensureQuestPeriods(state);
 document.getElementById("dailyQuests").innerHTML=QUESTS.daily.map(q=>questRow("daily",q)).join("");
 document.getElementById("weeklyQuests").innerHTML=QUESTS.weekly.map(q=>questRow("weekly",q)).join("");
 document.getElementById("achievementQuests").innerHTML=QUESTS.achievements.map(q=>questRow("achievements",q)).join("");
 renderGemBar();
}
renderAll();
