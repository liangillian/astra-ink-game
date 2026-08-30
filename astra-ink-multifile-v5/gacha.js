
const state=loadSave();
function rand(){const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]/4294967296}
function chooseByStars(){
 const r=rand()*100;
 const rates=CARD_POOL_INFO.rates;
 let acc=0;
 for(const s of [5,4,3,2,1]){
  acc+=rates[s]||0;
  if(r<acc)return s;
 }
 return 1;
}
function pickWeighted(cards){
 const total=cards.reduce((s,c)=>s+(c.weight||1),0);
 let r=rand()*total;
 for(const c of cards){r-=(c.weight||1);if(r<0)return c}
 return cards[cards.length-1];
}
function draw(){
 if(state.gems<CARD_POOL_INFO.costSingle){alert("星鑽不足");return}
 state.gems-=CARD_POOL_INFO.costSingle;state.pulls++;
 const stars=chooseByStars();
 const cards=CARD_POOL_INFO.cards.filter(c=>c.stars===stars);
 const c=pickWeighted(cards.length?cards:CARD_POOL_INFO.cards);
 state.collection[c.id]=(state.collection[c.id]||0)+1;
 state.memories.push({type:"gacha",title:c.name,stars:c.stars,time:Date.now()});
 saveGame(state);renderResult(c);renderStats()
}
function renderResult(c){
 document.getElementById("result").innerHTML=`<div class="gachaCard"><img src="${c.image}"><div class="stars">${"★".repeat(c.stars)}</div><b>${c.name}</b><div class="mini">${c.code}${c.limited?" · LIMITED":""}</div></div>`
}
function renderStats(){document.getElementById("gems").textContent=state.gems;document.getElementById("pulls").textContent=state.pulls}
document.getElementById("drawBtn").onclick=draw;
renderStats();
