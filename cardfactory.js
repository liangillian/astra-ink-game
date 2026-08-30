
const state=loadSave();
let currentGenerated=[];

const charSel=document.getElementById("characterSel");
Object.entries(CHARACTERS).forEach(([k,c])=>{
 const o=document.createElement("option");o.value=k;o.textContent=c.name+" / "+c.code;charSel.appendChild(o);
});
const rand=a=>a[Math.floor(Math.random()*a.length)];

function chooseStar(){
 const v=document.getElementById("starSel").value;
 if(v!=="random") return Number(v);
 const r=Math.random();
 if(r<.08)return 5;
 if(r<.25)return 4;
 if(r<.55)return 3;
 if(r<.8)return 2;
 return 1;
}
function chooseKey(id, obj){
 const v=document.getElementById(id).value;
 return v==="random"?rand(Object.keys(obj)):v;
}
function buildCard(){
 const key=charSel.value;
 const c=CHARACTERS[key], cs=CARD_STYLE_SYSTEM.characterStyle[key];
 const seasonKey=chooseKey("seasonSel",CARD_STYLE_SYSTEM.seasons);
 const regionKey=chooseKey("regionSel",CARD_STYLE_SYSTEM.regions);
 const season=CARD_STYLE_SYSTEM.seasons[seasonKey];
 const region=CARD_STYLE_SYSTEM.regions[regionKey];
 const stars=chooseStar();
 const palette=rand(season.palette);
 const outfit=rand(region.outfits);
 const detail=rand(region.details);
 const twist=rand(cs.outfitTwists);
 const bg=Math.random()<.55?rand(cs.backgrounds):rand(season.backgrounds);
 const theme=rand(cs.themes);
 const title=`${c.code} · ${season.label}${region.label} ${theme}`;
 const id=`auto_${key}_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
 return {
  id,key,code:c.code,name:title,stars,image:c.image,
  season:season.label,region:region.label,outfit,detail,twist,background:bg,theme,palette,
  prompt:`${c.name}，${theme}，${season.label}季，${region.label}，${outfit}，${twist}，配件：${detail}，背景：${bg}。角色個性維持 ${c.personality}。`
 };
}
function render(){
 const box=document.getElementById("generated");
 box.innerHTML=currentGenerated.map((c,i)=>`
  <div>
   <div class="generatedCard" style="--theme-bg:radial-gradient(circle at 25% 15%,${c.palette}88,transparent 38%),linear-gradient(135deg,transparent 30%,${c.palette}44 100%)">
    <img src="${c.image}">
    <div class="theme"></div><div class="shade2"></div>
    <div class="stars">${"★".repeat(c.stars)}</div><div class="tag">${c.season} · ${c.region}</div>
    <div class="cardText"><small>${c.code}</small><b>${c.name}</b><div class="mini">${c.outfit} · ${c.background}</div></div>
   </div>
   <div class="cardSpec">
    <b>服裝</b><div class="mini">${c.outfit}＋${c.twist}＋${c.detail}</div>
    <b style="display:block;margin-top:6px">背景</b><div class="mini">${c.background}</div>
   </div>
  </div>`).join("");
}
document.getElementById("generateBtn").onclick=()=>{currentGenerated=[buildCard()];render()};
document.getElementById("generateSixBtn").onclick=()=>{currentGenerated=Array.from({length:6},buildCard);render()};
document.getElementById("saveToPoolBtn").onclick=()=>{
 if(!currentGenerated.length)return alert("先產出卡牌");
 const custom=JSON.parse(localStorage.getItem("astra_custom_card_pool")||"[]");
 currentGenerated.forEach(c=>custom.push(c));
 localStorage.setItem("astra_custom_card_pool",JSON.stringify(custom));
 alert(`已加入 ${currentGenerated.length} 張到自訂卡池`);
};
currentGenerated=[buildCard(),buildCard(),buildCard()];
render();
