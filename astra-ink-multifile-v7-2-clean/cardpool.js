
document.getElementById("poolName").textContent=CARD_POOL_INFO.name;
document.getElementById("singleCost").textContent=CARD_POOL_INFO.costSingle+" "+CARD_POOL_INFO.currency;
document.getElementById("tenCost").textContent=CARD_POOL_INFO.costTen+" "+CARD_POOL_INFO.currency;
document.getElementById("pity5").textContent=CARD_POOL_INFO.pity.fiveStar+" 抽";
document.getElementById("pity4").textContent=CARD_POOL_INFO.pity.fourStar+" 抽";
document.getElementById("rates").innerHTML=[5,4,3,2,1].map(s=>`<span class="badge">${s}★ ${CARD_POOL_INFO.rates[s]}%</span>`).join("");
document.getElementById("poolCards").innerHTML=CARD_POOL_INFO.cards.map(c=>`
<div class="gachaCard">
 <img src="${c.image}">
 <div class="stars">${"★".repeat(c.stars)}</div>
 <b>${c.name}</b>
 <div class="mini">${c.code}${c.limited?" · LIMITED":""}</div>
</div>`).join("");
