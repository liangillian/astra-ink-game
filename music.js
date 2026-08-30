
const state=loadSave();
const audio=document.getElementById("bgm");
const playBtn=document.getElementById("playBtn");
const vol=document.getElementById("volume");
vol.value=state.music?.volume??.55;
audio.volume=Number(vol.value);
audio.addEventListener("loadedmetadata",()=>{if(state.music?.time) audio.currentTime=Math.min(state.music.time,audio.duration||state.music.time)});
audio.addEventListener("timeupdate",()=>{state.music=state.music||{};state.music.time=audio.currentTime;state.music.playing=!audio.paused;saveGame(state)});
vol.addEventListener("input",()=>{audio.volume=Number(vol.value);state.music=state.music||{};state.music.volume=audio.volume;saveGame(state)});
playBtn.onclick=async()=>{if(audio.paused){try{await audio.play()}catch(e){alert("找不到音樂檔，請把 first-orbit.mp3 放進 assets/music/")}}else audio.pause();update()};
audio.addEventListener("play",update);audio.addEventListener("pause",update);
function update(){playBtn.textContent=audio.paused?"播放":"暫停"}
update();
