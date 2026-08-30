
const state=loadSave();
const STORY=[
 {
  title:"Chapter 01｜報到",
  text:`第一天上班，你提前七分鐘到練習室。

門沒關緊。

夏曜安：「不是，我真的可以再快半拍。你們相信我一次。」
白予澈：「上次相信你的結果是第三段喘到唱不出來。」
夏曜安：「那是——那是空調太悶。」
沈律衡：「嗯。空調會害人少一顆肺。」
「哥。」
陸燼靠著鏡子，懶洋洋地笑了一聲。
「讓他跳啊。暈了就知道答案了。」

你推門。

四個人一起轉過來。

夏曜安先看到你手上的流程表。
「……欸，新企劃？」

白予澈看了眼牆上的鐘。
「提前七分鐘。」

他頓了一下。

「可以。」

陸燼：「第一句就被打分。辛苦了。」
沈律衡沒接話，只順手把擋在門口的水瓶踢開。

你突然很確定——
這四個人，會很難帶。`,
  choices:[
   ["「先不要評分我。今天流程改了兩版，誰先看？」",{silas:2,noir:1}],
   ["「所以我第一天上班，先看到你們拿肺開玩笑？」",{viren:2,nova:2}],
   ["「好。提前七分鐘可以，那你們準時下班也可以吧？」",{silas:1,viren:1,noir:1}]
  ]
 },
 {
  title:"Chapter 02｜Ink the Stars",
  text:`主打歌會議開到第四十分鐘，桌上的咖啡已經沒人碰了。

陸燼：「副歌太乖。」
白予澈：「你已經說第三次。」
「因為它第三次聽還是乖。」
夏曜安趴在桌邊轉筆。
「我站陸燼一半。Hook 沒問題，可是上台之後……嗯，少一個會讓人記住的東西。」
沈律衡：「Bridge。」
白予澈抬眼。
沈律衡把節拍往後拖了半拍。
「這裡留空。」

房間安靜了兩秒。

夏曜安：「喔。」
陸燼：「這個可以。」
白予澈沒有立刻答應。他把 Demo 拉回去，又聽一次。

然後陸燼突然看你。
「{PLAYER}。」

你：「嗯？」

「妳坐那邊安靜半天了。」
他用筆敲了敲桌面。
「有答案，還是在等我們自己吵完？」`,
  choices:[
   ["「副歌不加。Bridge 留空，讓那一下真的掉下去。」",{viren:2,silas:2,noir:3}],
   ["「先讓陸燼唱新版本。聽結果，不猜。」",{viren:3,silas:1}],
   ["「Hook 不動，舞台記憶點交給夏曜安。」",{nova:3,silas:1}]
  ]
 },
 {
  title:"Chapter 03｜第一次團體失誤",
  text:`第一次完整彩排，第二段直接撞在一起。

不是形容詞。

夏曜安退太快，陸燼往前多走半步，兩個人肩膀真的「碰」了一聲。

音樂停了。

夏曜安：「……痛。」
陸燼：「你撞我欸。」
「你也有走錯！」
「我沒有。」
沈律衡：「有。」
陸燼轉頭：「你哪邊的？」
沈律衡：「正確的那邊。」

白予澈已經走到監看螢幕前。
「都別吵。回放。」

沒有人真的生氣。
但誰都不想承認是自己先錯。

這才像一個剛開始磨合的團。`,
  choices:[
   ["「先看回放。誰錯誰請飲料，省時間。」",{nova:2,noir:2,silas:1}],
   ["「先休息三分鐘。現在繼續只會越跳越爛。」",{silas:2,viren:1,nova:1}],
   ["「我猜兩個都有錯。」",{viren:2,noir:1}]
  ]
 }
];
let step=Number(localStorage.getItem("astra_story_step")||0);
function renderStory(){
 const s=STORY[Math.min(step,STORY.length-1)];
 document.getElementById("storyTitle").textContent=step>=STORY.length?"主線暫告一段落":s.title;
 document.getElementById("storyText").textContent=step>=STORY.length?"FIRST ORBIT 已進入養成期。接下來的成長不只靠主線，請到「養成」安排每天的訓練、舞台與休息。":injectPlayer(s.text,state);
 const box=document.getElementById("storyChoices");box.innerHTML="";
 if(step>=STORY.length)return;
 s.choices.forEach(([t,aff])=>{
  const b=document.createElement("button");b.className="btn";b.textContent=injectPlayer(t,state);b.onclick=()=>{
   Object.entries(aff).forEach(([k,v])=>state.aff[k]=(state.aff[k]||0)+v);
   state.memories.push({type:"main",title:s.title,choice:t,time:Date.now()});
   step++;localStorage.setItem("astra_story_step",step);saveGame(state);renderStory()
  };box.appendChild(b)
 })
}
function renderMembers(){
 const box=document.getElementById("memberCards");box.innerHTML="";
 Object.entries(CHARACTERS).forEach(([k,c])=>{
  const s=state.growth?.members?.[k]||BASE_GROWTH[k];
  box.innerHTML+=`<a class="charCard" href="members.html#${k}"><img src="${c.image}"><div class="charInfo"><small>${c.code} · ${c.element}</small><b>${c.name}</b><div class="mini">${c.role} · ${growthRank(s)}</div></div></a>`
 })
}
renderStory();renderMembers();
