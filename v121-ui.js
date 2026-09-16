(()=>{
  const $=s=>document.querySelector(s);
  const SETTINGS='cosmicExplorerV12Settings';
  const readSettings=()=>{try{return Object.assign({difficulty:'normal',attractDelay:15,returnHomeDelay:20,sound:true,kiosk:false,fps:false,watchdog:true},JSON.parse(localStorage.getItem(SETTINGS)||'{}'));}catch(_){return {difficulty:'normal',attractDelay:15,returnHomeDelay:20,sound:true,kiosk:false,fps:false,watchdog:true};}};

  function normalizeHero(){
    const img=$('#v11ShipImg'); if(!img||img.dataset.v121Ready==='1') return;
    img.dataset.v121Ready='1';
    const fixSrc=()=>{const raw=img.getAttribute('src')||'';if(raw.includes('?v=110'))img.setAttribute('src',raw.replace('?v=110','?v=121'));};
    fixSrc();
    const mo=new MutationObserver(fixSrc); mo.observe(img,{attributes:true,attributeFilter:['src']});
    img.addEventListener('error',()=>{
      const raw=img.getAttribute('src')||'';
      const m=raw.match(/player([1-4])\.webp/i); const n=Number(m?.[1]||1);
      const tries=Number(img.dataset.retry||0);
      if(tries<2){img.dataset.retry=String(tries+1);img.src=`/assets/v9/player${n}.webp?v=121&r=${Date.now()}`;}
      else if(n!==1){img.dataset.retry='0';img.src=`/assets/v9/player1.webp?v=121&r=${Date.now()}`;}
    });
    img.addEventListener('load',()=>{img.dataset.retry='0';});
  }

  function repairDomImages(){
    normalizeHero();
    const data=window.V9_ASSET_DATA||{};
    const route=['planet-earth','planet-moon','planet-mars','planet-hole'];
    document.querySelectorAll('#routeIcons img').forEach((img,i)=>{
      if(img.dataset.assetGuard==='1') return; img.dataset.assetGuard='1';
      img.addEventListener('error',()=>{const src=data[route[i]];if(src)img.src=src;},{once:true});
    });
    document.querySelectorAll('#shipSelect img').forEach((img,i)=>{
      if(img.dataset.assetGuard==='1') return; img.dataset.assetGuard='1';
      img.addEventListener('error',()=>{img.src=`/assets/v9/player${(i%4)+1}.webp?v=121&r=${Date.now()}`;},{once:true});
    });
  }

  function buildStatus(){
    if($('#v121Status')) return;
    const el=document.createElement('div');el.id='v121Status';el.className='v121-status';document.body.appendChild(el);
    const sync=()=>{
      let s=window.__COSMIC_ASSET_STATUS||null;
      if(!s){try{s=JSON.parse(localStorage.getItem('cosmicExplorerV121AssetStatus')||'null');}catch(_){}}
      if(!s){el.textContent='ASSETS …';return;}
      const okay=(s.loaded||0)+(s.fallback?.length||0)>=s.total;
      el.textContent=`ASSETS ${Math.min(s.total,(s.loaded||0)+(s.fallback?.length||0))}/${s.total}${s.fallback?.length?' · RECOVERED '+s.fallback.length:''}`;
      el.dataset.ok=okay?'1':'0';
    };
    sync();window.addEventListener('cosmic:assets-ready',sync);
    if(!new URLSearchParams(location.search).has('debug'))el.classList.add('hidden');
  }

  function buildFps(){
    if($('#v121Fps'))return;
    const cfg=readSettings(),el=document.createElement('div');el.id='v121Fps';el.className='v121-fps';el.textContent='-- FPS';document.body.appendChild(el);
    el.classList.toggle('hidden',!cfg.fps);
    let frames=0,last=performance.now();
    const loop=now=>{frames++;if(now-last>=500){el.textContent=Math.round(frames*1000/(now-last))+' FPS';frames=0;last=now;}requestAnimationFrame(loop);};requestAnimationFrame(loop);
  }

  function installHardening(){
    const cfg=readSettings();
    let lastTime=null,lastAdvance=performance.now(),lastResultInteraction=performance.now();
    const mark=()=>{lastResultInteraction=performance.now();};
    window.addEventListener('pointerdown',mark,true);window.addEventListener('keydown',mark,true);window.addEventListener('touchstart',mark,{capture:true,passive:true});

    const recover=reason=>{
      const now=Date.now(),prev=Number(sessionStorage.getItem('cosmicV121RecoverAt')||0);
      if(now-prev<20000)return;
      sessionStorage.setItem('cosmicV121RecoverAt',String(now));
      try{localStorage.setItem('cosmicV121LastRecovery',JSON.stringify({ts:now,reason}));}catch(_){ }
      const u=new URL(location.href);u.searchParams.set('recovered','1');location.replace(u.pathname+'?'+u.searchParams.toString());
    };

    setInterval(()=>{
      if(document.body.dataset.v11BootError==='1'){if(cfg.watchdog!==false)recover('boot-error');return;}
      const api=window.__COSMIC_V12,st=api?.status?.();
      if(st?.playing&&!st.paused){
        if(lastTime===null||Math.abs((st.time||0)-lastTime)>.001){lastTime=st.time||0;lastAdvance=performance.now();}
        else if(cfg.watchdog!==false&&performance.now()-lastAdvance>9000)recover('stalled-game-loop');
      }else{lastTime=st?.time??lastTime;lastAdvance=performance.now();}

      const over=$('#gameOver');
      if(over&&!over.classList.contains('hidden')){
        const delay=Math.max(8,Number(cfg.returnHomeDelay||20))*1000;
        if(performance.now()-lastResultInteraction>delay){api?.home?.();lastResultInteraction=performance.now();}
      }else lastResultInteraction=performance.now();
    },1500);
  }

  function operatorLaunch(){
    const p=new URLSearchParams(location.search);if(p.get('operatorTest')!=='1')return;
    const sector=Math.max(0,Math.min(3,Number(p.get('sector')||0))),boss=p.get('boss')==='1';
    let tries=0;const t=setInterval(()=>{
      const api=window.__COSMIC_V12;if(!api){if(++tries>80)clearInterval(t);return;}
      clearInterval(t);boss?api.testBoss?.(sector):api.jumpSector?.(sector);
      setTimeout(()=>history.replaceState({},'',location.pathname),400);
    },100);
  }

  function polishLabels(){
    const tag=$('.v11tag');if(tag)tag.textContent='ARCADE SPACE MISSION · V12.1 EXHIBITION HARDENED';
    const note=$('.v11-attract-note');if(note){const c=readSettings();note.innerHTML=`NO INPUT · <b>AUTO DEMO</b> STARTS IN ${Math.max(8,Number(c.attractDelay||15))} SEC`;}
  }

  const mo=new MutationObserver(()=>repairDomImages());mo.observe(document.documentElement,{childList:true,subtree:true});
  const ready=()=>{repairDomImages();buildStatus();buildFps();installHardening();operatorLaunch();polishLabels();};
  if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();