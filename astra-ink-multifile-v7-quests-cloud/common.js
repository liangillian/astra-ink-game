
const SAVE_KEY="astra_ink_multifile_v2";

const BASE_GROWTH={
 viren:{vocal:82,dance:64,stage:86,expression:84,teamwork:58,stamina:66,confidence:78,stress:28,fans:0},
 silas:{vocal:76,dance:58,stage:72,expression:68,teamwork:82,stamina:71,confidence:74,stress:34,fans:0},
 nova:{vocal:65,dance:87,stage:84,expression:80,teamwork:70,stamina:75,confidence:72,stress:24,fans:0},
 noir:{vocal:68,dance:71,stage:77,expression:72,teamwork:79,stamina:80,confidence:69,stress:22,fans:0}
};

function defaultSave(){
 return {
  player:{name:"",nickname:""},
  aff:{viren:0,silas:0,nova:0,noir:0},
  memories:[],
  gems:600,
  lifetimeGems:600,
  pulls:0,
  collection:{},
  music:{volume:.55,time:0,playing:false},
  quests:{
    counters:{training:0,gacha:0,story:0,login:0,stage:0,variety:0,rest:0},
    daily:{date:"",claimed:{}},
    weekly:{week:"",claimed:{}},
    achievements:{claimed:{}}
  },
  growth:{
   day:1,
   week:1,
   companyFans:0,
   members:JSON.parse(JSON.stringify(BASE_GROWTH)),
   history:[],
   unlocked:{viren:[],silas:[],nova:[],noir:[],group:[]}
  }
 }
}
function deepMerge(base, incoming){
 if(Array.isArray(base)) return Array.isArray(incoming)?incoming:base;
 if(base && typeof base==="object"){
  const out={...base};
  if(incoming && typeof incoming==="object"){
   Object.keys(incoming).forEach(k=>{
    out[k]=k in base?deepMerge(base[k],incoming[k]):incoming[k];
   });
  }
  return out;
 }
 return incoming===undefined?base:incoming;
}
function loadSave(){
 try{
  const raw=JSON.parse(localStorage.getItem(SAVE_KEY));
  return deepMerge(defaultSave(),raw||{});
 }catch(e){return defaultSave()}
}
function saveGame(s){
 localStorage.setItem(SAVE_KEY,JSON.stringify(s));
 window.dispatchEvent(new CustomEvent("astra-save-changed",{detail:{time:Date.now()}}));
}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function randomItem(arr){return arr[Math.floor(Math.random()*arr.length)]}
function playerName(state){
 const n=(state?.player?.nickname||state?.player?.name||"企劃").trim();
 return n||"企劃";
}
function injectPlayer(text,state){
 return String(text).replaceAll("{PLAYER}",playerName(state));
}
function clamp(n,min,max){return Math.max(min,Math.min(max,n))}
function growthRank(stats){
 const avg=(stats.vocal+stats.dance+stats.stage+stats.expression+stats.teamwork+stats.stamina+stats.confidence)/7;
 if(avg>=88)return "ACE";
 if(avg>=80)return "BREAKTHROUGH";
 if(avg>=72)return "RISING";
 if(avg>=64)return "ROOKIE+";
 return "ROOKIE";
}


function todayKey(){
 const d=new Date();
 return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function weekKey(){
 const d=new Date(), tmp=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));
 const day=tmp.getUTCDay()||7; tmp.setUTCDate(tmp.getUTCDate()+4-day);
 const yearStart=new Date(Date.UTC(tmp.getUTCFullYear(),0,1));
 const week=Math.ceil((((tmp-yearStart)/86400000)+1)/7);
 return `${tmp.getUTCFullYear()}-W${String(week).padStart(2,"0")}`;
}
function ensureQuestPeriods(state){
 state.quests=state.quests||defaultSave().quests;
 const td=todayKey(), wk=weekKey();
 if(state.quests.daily.date!==td){state.quests.daily={date:td,claimed:{}}}
 if(state.quests.weekly.week!==wk){state.quests.weekly={week:wk,claimed:{}}}
}
function addQuestProgress(state,type,amount=1){
 ensureQuestPeriods(state);
 state.quests.counters[type]=(state.quests.counters[type]||0)+amount;
}
function addGems(state,amount,reason=""){
 state.gems=(state.gems||0)+amount;
 state.lifetimeGems=(state.lifetimeGems||0)+amount;
 state.memories.push({type:"gem_gain",title:`獲得 ${amount} 星鑽`,text:reason,time:Date.now()});
}
function spendGems(state,amount){
 if((state.gems||0)<amount)return false;
 state.gems-=amount;
 return true;
}
function nextGemMilestone(total){
 const marks=[1000,2500,5000,10000,20000,50000,100000];
 for(const m of marks) if(total<m) return m;
 return Math.ceil((total+1)/50000)*50000;
}
