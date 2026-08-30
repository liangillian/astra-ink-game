
const state=loadSave();
function renderMemory(){
 const root=document.getElementById("memoryRoot");root.innerHTML="";
 Object.entries(CHARACTERS).forEach(([k,c])=>{
  const personal=state.memories.filter(m=>m.character===k);
  const chapters=MEMORY_CHAPTERS[k].map((ch,i)=>`<details ${i===0?"open":""}><summary>${ch.title}</summary><ul>${ch.points.map(p=>`<li>${p}</li>`).join("")}</ul></details>`).join("");
  const logs=personal.length?personal.map((m,i)=>`<details><summary>實際記憶 ${i+1}｜${m.title}</summary><ul><li><b>你的選擇：</b>${esc(m.choice||m.text||"")}</li>${m.reply?`<li><b>他的回應：</b>${m.reply.map(esc).join(" / ")}</li>`:""}<li><b>記憶用途：</b>這筆資料可供後續事件回收與角色成長判斷。</li></ul></details>`).join(""):`<div class="mini">目前還沒有實際互動紀錄。先到「成員」或「養成」頁累積事件。</div>`;
  const gh=(state.growth.history||[]).filter(x=>x.character===k).slice(0,12);
  const growthLogs=gh.length?gh.map(x=>`<details><summary>W${x.week} D${x.day}｜${TRAINING_ACTIONS[x.action].label}</summary><ul><li>${esc(x.line)}</li><li>目前成長階段：${growthRank(state.growth.members[k])}</li></ul></details>`).join(""):`<div class="mini">尚無養成紀錄。</div>`;
  root.innerHTML+=`<div class="memoryCard" onclick="toggleMemory('${k}')"><div class="kicker">${c.code} MEMORY</div><h2>${c.name}</h2><div class="mini">好感 ${state.aff[k]||0}｜實際記憶 ${personal.length} 筆</div></div><div class="panel chapter" id="mem_${k}" style="display:none"><h2>${c.name}｜記憶結構</h2>${chapters}<h3 style="margin-top:16px">玩家實際互動紀錄</h3>${logs}<h3 style="margin-top:16px">養成成長紀錄</h3>${growthLogs}</div>`;
 })
}
function toggleMemory(k){const el=document.getElementById("mem_"+k);el.style.display=el.style.display==="none"?"block":"none"}
renderMemory();
