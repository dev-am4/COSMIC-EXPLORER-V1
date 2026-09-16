(()=>{
  const $=s=>document.querySelector(s);
  const getBest=()=>{try{return Number(localStorage.getItem('cosmicExplorerV11HighScore')||0)}catch(_){return 0}};
  function mount(){
    const card=$('#home .home-card'); if(!card||$('#v11BestChip')) return false;
    const best=document.createElement('div'); best.id='v11BestChip'; best.className='v11-best-chip'; best.textContent='BEST  '+getBest().toLocaleString(); card.appendChild(best);
    const row=$('#home .start-row');
    if(row){ const note=document.createElement('div'); note.className='v11-attract-note'; note.innerHTML='NO INPUT · <b>AUTO DEMO</b> STARTS IN 15 SEC'; row.appendChild(note); }
    return true;
  }
  const syncBest=()=>{const el=$('#v11BestChip'); if(el) el.textContent='BEST  '+getBest().toLocaleString();};
  window.addEventListener('cosmic:report',()=>setTimeout(syncBest,0));
  const t=setInterval(()=>{if(mount())clearInterval(t)},80);
  window.addEventListener('load',()=>{mount();syncBest()},{once:true});
})();