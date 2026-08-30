
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
  pulls:0,
  collection:{},
  music:{volume:.55,time:0,playing:false},
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
function saveGame(s){localStorage.setItem(SAVE_KEY,JSON.stringify(s))}
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
