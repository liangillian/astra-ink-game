
const state=loadSave();
let currentKey=(location.hash||"#viren").slice(1);if(!CHARACTERS[currentKey])currentKey="viren";
let currentMeeting=null;
function renderMemberNav(){
 const nav=document.getElementById("memberNav");nav.innerHTML="";
 Object.entries(CHARACTERS).forEach(([k,c])=>{
  const b=document.createElement("button");b.className="btn";b.textContent=c.name;b.onclick=()=>{currentKey=k;history.replaceState(null,"","#"+k);renderMember();};nav.appendChild(b)
 })
}
function newMeeting(){
 currentMeeting=randomItem(FIRST_MEETINGS[currentKey]);
 renderMeeting()
}
function renderMember(){
 const c=CHARACTERS[currentKey],v=VOICE_GUIDE[currentKey],g=state.growth.members[currentKey];
 document.getElementById("memberInfo").innerHTML=`<div class="memberLayout"><img class="memberPortrait" src="${c.image}"><div><div class="kicker">${c.code} · ${c.element}</div><h1>${c.name}</h1><div class="mini">${c.role} · 成長階段 ${growthRank(g)}</div><p>${c.personality}</p><div class="infoGrid"><div class="infoBox"><b>說話方式</b><div class="mini">${c.speech}</div></div><div class="infoBox"><b>節奏／標點</b><div class="mini">${v.pace}<br>${v.punctuation}</div></div><div class="infoBox"><b>目前好感</b><div style="font-size:26px;font-weight:900">${state.aff[currentKey]||0}</div></div><div class="infoBox"><b>養成狀態</b><div class="mini">聲樂 ${g.vocal} · 舞蹈 ${g.dance} · 舞台 ${g.stage}<br>團隊 ${g.teamwork} · 壓力 ${g.stress}</div></div></div><div class="cardSpec"><b>角色表達原則</b><div class="mini">會做：${v.habits.join("、")}<br>避免：${v.avoid.join("、")}</div></div></div></div>`;
 newMeeting()
}
function renderMeeting(){
 const scene=document.getElementById("meetingScene");
 scene.innerHTML=`<div class="badge">${currentMeeting.title}</div><div class="dialogue" id="dialogueBox">${currentMeeting.intro.map(x=>`<div class="bubble them">${esc(injectPlayer(x,state))}</div>`).join("")}</div><div class="choiceList" id="meetingChoices"></div><button class="btn" style="margin-top:10px" onclick="newMeeting()">換一個第一次相遇版本</button>`;
 const choices=document.getElementById("meetingChoices");
 currentMeeting.choices.forEach(([t,reply,aff])=>{
  const b=document.createElement("button");b.className="btn";b.textContent=injectPlayer(t,state);b.onclick=()=>{
   document.getElementById("dialogueBox").innerHTML+=`<div class="bubble me">${esc(injectPlayer(t,state))}</div>`+reply.map(x=>`<div class="bubble them">${esc(injectPlayer(x,state))}</div>`).join("");
   state.aff[currentKey]=(state.aff[currentKey]||0)+aff;
   state.memories.push({type:"first_meeting",character:currentKey,title:currentMeeting.title,choice:t,reply,time:Date.now()});
   saveGame(state);choices.innerHTML=`<div class="mini">這段已記錄到記憶檔案。</div>`;
   renderMemberStatsOnly()
  };choices.appendChild(b)
 })
}
function renderMemberStatsOnly(){
 const c=CHARACTERS[currentKey];
 const info=document.querySelector("#memberInfo .infoGrid");
 if(info) info.children[2].innerHTML=`<b>目前好感</b><div style="font-size:26px;font-weight:900">${state.aff[currentKey]||0}</div>`;
}
renderMemberNav();renderMember();
