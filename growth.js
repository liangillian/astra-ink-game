
const state=loadSave();
const memberSel=document.getElementById("trainMember");
const actionSel=document.getElementById("trainAction");

Object.entries(CHARACTERS).forEach(([k,c])=>{
 const o=document.createElement("option");o.value=k;o.textContent=c.name+" / "+c.code;memberSel.appendChild(o);
});
Object.entries(TRAINING_ACTIONS).forEach(([k,a])=>{
 const o=document.createElement("option");o.value=k;o.textContent=a.label;actionSel.appendChild(o);
});
function updateActionDesc(){document.getElementById("actionDesc").textContent=TRAINING_ACTIONS[actionSel.value].desc}
actionSel.onchange=updateActionDesc;updateActionDesc();

function statBar(label,val){
 const width=Math.max(0,Math.min(100,val));
 return `<div style="margin:7px 0"><div class="mini" style="display:flex;justify-content:space-between"><span>${label}</span><b>${val}</b></div><div style="height:7px;background:rgba(255,255,255,.08);border-radius:99px;overflow:hidden"><i style="display:block;height:100%;width:${width}%;background:linear-gradient(90deg,#7764ff,#f0cb72)"></i></div></div>`;
}
function renderGrowthCards(){
 const box=document.getElementById("growthCards");
 box.innerHTML=Object.entries(CHARACTERS).map(([k,c])=>{
  const s=state.growth.members[k];
  return `<div class="panel">
   <div class="memberLayout" style="grid-template-columns:110px 1fr;gap:12px">
    <img class="memberPortrait" style="aspect-ratio:1/1.3" src="${c.image}">
    <div><div class="kicker">${c.code}</div><h2>${c.name}</h2><div class="badge">${growthRank(s)}</div><div class="mini" style="margin-top:6px">壓力 ${s.stress}｜粉絲 ${s.fans}</div></div>
   </div>
   ${statBar("聲樂",s.vocal)}${statBar("舞蹈",s.dance)}${statBar("舞台",s.stage)}${statBar("表現力",s.expression)}${statBar("團隊",s.teamwork)}${statBar("體力",s.stamina)}${statBar("自信",s.confidence)}
  </div>`;
 }).join("");
 document.getElementById("week").textContent=state.growth.week;
 document.getElementById("day").textContent=state.growth.day;
 document.getElementById("fans").textContent=state.growth.companyFans;
}

function maybeUnlock(k){
 const s=state.growth.members[k];
 const unlocked=state.growth.unlocked[k]||[];
 const fresh=[];
 (GROWTH_UNLOCKS[k]||[]).forEach(u=>{
  if(s[u.stat]>=u.at && !unlocked.includes(u.id)){
   unlocked.push(u.id);fresh.push(u);
   state.memories.push({type:"growth_unlock",character:k,title:u.title,text:u.text,time:Date.now()});
  }
 });
 state.growth.unlocked[k]=unlocked;
 return fresh;
}

function train(){
 const k=memberSel.value,aKey=actionSel.value,a=TRAINING_ACTIONS[aKey],s=state.growth.members[k],c=CHARACTERS[k];
 Object.entries(a.effects).forEach(([stat,v])=>{
  if(stat==="stress") s.stress=clamp(s.stress+v,0,100);
  else s[stat]=clamp((s[stat]||0)+v,0,99);
 });
 // fatigue consequences and small fan growth from stage/variety
 if(s.stress>=75){s.confidence=clamp(s.confidence-2,0,99);s.stamina=clamp(s.stamina-2,0,99)}
 let fanGain=0;
 if(aKey==="stage"||aKey==="variety"){
  fanGain=Math.max(8,Math.round((s.stage+s.expression+s.confidence)/9));
  s.fans+=fanGain;state.growth.companyFans+=fanGain;
 }
 const line=randomItem(a.reactions[k]);
 const unlocks=maybeUnlock(k);

 state.growth.history.unshift({
  day:state.growth.day,week:state.growth.week,character:k,action:aKey,line,fanGain,time:Date.now()
 });
 state.memories.push({type:"training",character:k,title:`第 ${state.growth.week} 週 Day ${state.growth.day}｜${a.label}`,text:line,time:Date.now()});
 addQuestProgress(state,"training",1);
 if(aKey==="stage")addQuestProgress(state,"stage",1);
 if(aKey==="variety")addQuestProgress(state,"variety",1);
 if(aKey==="rest")addQuestProgress(state,"rest",1);

 state.growth.day++;
 if(state.growth.day>7){state.growth.day=1;state.growth.week++}

 // Natural scene: sometimes another member cuts in.
 const interjections={
  viren:["NOVA：「你今天居然沒偷懶？」","NOIR：「他有。只是沒被妳看到。」","SILAS：「休息兩分鐘。再來。」"],
  silas:["NOVA：「隊長你剛剛是不是笑了？」","VIREN：「別問，他會收回去。」","NOIR：「繼續。」"],
  nova:["NOIR：「水。」","VIREN：「讓他喘一下，不然等等又說我們欺負忙內。」","SILAS：「三分鐘後重來。」"],
  noir:["NOVA：「哥你剛剛那個很帥欸！」","NOIR：「知道了。」","VIREN：「他今天話好多。」"]
 };
 const scene=[`${c.name}｜${a.label}`,line];
 if(Math.random()<.6) scene.push(randomItem(interjections[k]));
 if(fanGain) scene.push(`系統：這次曝光帶來 ${fanGain} 名新粉絲。`);
 unlocks.forEach(u=>scene.push(`成長突破：${u.title}——${u.text}`));
 if(s.stress>=75) scene.push(`系統：${c.name} 的壓力已經偏高。再硬排訓練，狀態會開始掉。`);

 document.getElementById("sceneLog").innerHTML=scene.map((x,i)=>`<div class="bubble ${i===0?"sys":"them"}">${esc(x)}</div>`).join("");
 saveGame(state);renderGrowthCards();renderHistory();
}

function renderHistory(){
 const box=document.getElementById("growthHistory");
 const h=state.growth.history||[];
 box.innerHTML=h.length?h.slice(0,30).map(x=>{
  const c=CHARACTERS[x.character],a=TRAINING_ACTIONS[x.action];
  return `<div><b>W${x.week} D${x.day}｜${c.name}｜${a.label}</b><div class="mini">${esc(x.line)}${x.fanGain?` · +${x.fanGain} 粉絲`:""}</div></div>`
 }).join(""):`<div class="mini">還沒有訓練紀錄。</div>`;
}
document.getElementById("trainBtn").onclick=train;
renderGrowthCards();renderHistory();
