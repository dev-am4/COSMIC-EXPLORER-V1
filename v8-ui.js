(()=>{
  const $=s=>document.querySelector(s);
  const arena=$('#arena'), game=$('#screenGame');
  if(!arena||!game) return;

  const syncGameMode=()=>{
    const on=game.classList.contains('active');
    document.body.classList.toggle('v8-game',on);
    if(on){
      requestAnimationFrame(()=>{
        window.dispatchEvent(new Event('resize'));
        setTimeout(()=>window.dispatchEvent(new Event('resize')),80);
      });
    }
  };
  new MutationObserver(syncGameMode).observe(game,{attributes:true,attributeFilter:['class']});
  syncGameMode();

  const strip=document.createElement('div');
  strip.className='v8-weapon-strip';
  strip.innerHTML='<div class="v8-weapon-chip"><small>WEAPON</small><b data-v8-weapon>PULSE CANNON</b></div><div class="v8-weapon-chip"><small>SPECIAL</small><b data-v8-special>NO SPECIAL</b></div>';
  arena.appendChild(strip);
  const copyCombatText=()=>{
    const w=$('#weaponName'),s=$('#specialName');
    if(w) strip.querySelector('[data-v8-weapon]').textContent=w.textContent;
    if(s) strip.querySelector('[data-v8-special]').textContent=s.textContent;
  };
  ['#weaponName','#specialName'].map($).filter(Boolean).forEach(el=>new MutationObserver(copyCombatText).observe(el,{childList:true,subtree:true,characterData:true}));
  copyCombatText();

  const score=$('#hudScore'); let lastScore=Number((score?.textContent||'0').replace(/\D/g,''))||0;
  if(score)new MutationObserver(()=>{
    const now=Number((score.textContent||'0').replace(/\D/g,''))||0;
    const d=now-lastScore;lastScore=now;
    if(d>=80){
      const p=document.createElement('div');p.className='v8-score-pop';p.textContent='+'+d.toLocaleString();arena.appendChild(p);setTimeout(()=>p.remove(),650);
    }
  }).observe(score,{childList:true,subtree:true,characterData:true});

  const combo=$('#hudCombo'); const syncCombo=()=>{const n=parseInt((combo?.textContent||'').replace(/\D/g,''),10)||1;arena.classList.toggle('v8-fever',n>=4)};
  if(combo)new MutationObserver(syncCombo).observe(combo,{childList:true,subtree:true,characterData:true});syncCombo();
})();
