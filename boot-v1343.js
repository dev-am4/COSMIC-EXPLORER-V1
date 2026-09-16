(()=>{
  const VERSION='13.4.3',SAFE=new URLSearchParams(location.search).get('safe')==='1';
  const bootAt=performance.now();
  let pending=sessionStorage.getItem('cosmicPendingStart')==='1',ready=!!window.__COSMIC_ENGINE_READY,recovering=false;
  const $=s=>document.querySelector(s);
  const btn=()=>$('#startBtn');

  window.__COSMIC_BOOT={version:VERSION,startedAt:bootAt,get ready(){return ready},get pending(){return pending}};

  function note(text,kind='loading'){
    const b=btn(); if(!b)return;
    b.dataset.boot=kind;
    if(kind==='loading') b.textContent=text||'STARTING…';
    else if(kind==='error') b.textContent=text||'RETRY GAME';
    else b.textContent='START MISSION';
  }

  function markPending(){
    pending=true;window.__COSMIC_START_PENDING=true;
    try{sessionStorage.setItem('cosmicPendingStart','1')}catch(_){ }
    note('STARTING…','loading');
  }

  function clearPending(){
    pending=false;window.__COSMIC_START_PENDING=false;
    try{sessionStorage.removeItem('cosmicPendingStart')}catch(_){ }
  }

  function recover(reason){
    if(recovering)return;recovering=true;
    try{localStorage.setItem('cosmicLastBootRecovery',JSON.stringify({ts:Date.now(),reason,version:VERSION,safe:SAFE}))}catch(_){ }
    if(SAFE){
      note('TAP TO RETRY','error');recovering=false;
      return;
    }
    let tried=false;try{tried=sessionStorage.getItem('cosmicSafeBootTried')==='1'}catch(_){ }
    if(tried){note('TAP TO RETRY','error');recovering=false;return;}
    try{sessionStorage.setItem('cosmicSafeBootTried','1');sessionStorage.setItem('cosmicPendingStart',pending?'1':'0')}catch(_){ }
    const p=new URLSearchParams(location.search);p.set('safe','1');p.set('recovered',reason||'boot');
    location.replace(location.pathname+'?'+p.toString());
  }

  function onReady(){
    if(ready)return;ready=true;window.__COSMIC_ENGINE_READY=true;
    const ms=Math.round(performance.now()-bootAt);
    try{localStorage.setItem('cosmicLastBootMs',String(ms));if(!SAFE)sessionStorage.removeItem('cosmicSafeBootTried')}catch(_){ }
    note('', 'ready');
    if(pending){
      clearPending();
      setTimeout(()=>{const b=btn();if(b&&!$('#home')?.classList.contains('hidden'))b.click()},0);
    }
  }

  document.addEventListener('pointerdown',()=>{window.__COSMIC_USER_INTERACTED=true},{capture:true,passive:true});
  document.addEventListener('touchstart',()=>{window.__COSMIC_USER_INTERACTED=true},{capture:true,passive:true});

  const attach=()=>{
    const b=btn();if(!b){setTimeout(attach,30);return;}
    b.addEventListener('click',e=>{
      if(ready||window.__COSMIC_ENGINE_READY){ready=true;return;}
      e.preventDefault();e.stopImmediatePropagation();markPending();
      setTimeout(()=>{if(!ready&&!window.__COSMIC_ENGINE_READY)recover('start-timeout')},2600);
    },true);
    if(pending)note('STARTING…','loading');
    if(SAFE)b.title='Recovery mode';
    b.addEventListener('click',()=>{if(SAFE&&!ready&&b.dataset.boot==='error')location.reload()},false);
  };
  attach();

  window.addEventListener('cosmic:engine-ready',onReady);
  window.addEventListener('cosmic:runtime-error',()=>recover('runtime-error'));
  window.addEventListener('error',e=>{
    if(!ready&&/app-v9|v13|v134|phase/i.test(String(e?.filename||'')))setTimeout(()=>recover('script-error'),50);
  });

  const poll=setInterval(()=>{
    if(window.__COSMIC_ENGINE_READY){clearInterval(poll);onReady();return;}
    if(document.body?.dataset?.v11BootError==='1'){clearInterval(poll);recover('engine-eval');}
  },120);
  setTimeout(()=>{if(!ready&&!window.__COSMIC_ENGINE_READY)recover('boot-timeout')},5600);
})();