(()=>{
  const $=s=>document.querySelector(s);
  const VERSION='13.4.4';

  async function clearOldWorkers(){
    if(!('serviceWorker' in navigator))return;
    try{
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r=>r.unregister().catch(()=>false)));
      if('caches' in window){
        const names=await caches.keys();
        await Promise.all(names.filter(n=>n.startsWith('cosmic-explorer-')).map(n=>caches.delete(n)));
      }
      if(navigator.serviceWorker.controller&&!sessionStorage.getItem('cosmic1344Reloaded')){
        sessionStorage.setItem('cosmic1344Reloaded','1');
        location.reload();
      }
    }catch(e){console.warn('[V13.4.4 worker cleanup]',e);}
  }

  function ready(){
    const tag=$('.v11tag');if(tag)tag.textContent='ARCADE SPACE MISSION · V13.4.4 STABLE CORE';
    const b=$('#startBtn');
    if(b){
      b.textContent='START MISSION';
      b.disabled=false;
      b.addEventListener('click',()=>{
        b.textContent='LAUNCHING…';
        setTimeout(()=>{if(!$('#home')?.classList.contains('hidden'))b.textContent='START MISSION';},900);
      });
    }
    window.addEventListener('cosmic:engine-ready',()=>{if(b){b.disabled=false;b.textContent='START MISSION';}},{once:true});
    window.addEventListener('cosmic:runtime-error',()=>{
      if(!b)return;
      b.textContent='RETRY MISSION';b.disabled=false;
    });
    clearOldWorkers();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
  window.__COSMIC_UI_VERSION=VERSION;
})();