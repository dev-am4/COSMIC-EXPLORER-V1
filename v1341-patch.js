(()=>{
  window.__V1341_PATCH=(code)=>{
    code=code.split('?v=134').join('?v=1341');

    code=code.replace("function spawnEnemy(){",`function v1341Init(){
    if(state.v1341Perf)return state.v1341Perf;
    let cfg={};try{cfg=JSON.parse(localStorage.getItem('cosmicExplorerV12Settings')||'{}')||{};}catch(_){ }
    const mobile=W<760||matchMedia('(pointer:coarse)').matches;
    const cores=Number(navigator.hardwareConcurrency||8),mem=Number(navigator.deviceMemory||8);
    const weak=cores<=4||mem<=4;
    const mode=['auto','high','balanced','low'].includes(cfg.performanceMode)?cfg.performanceMode:'auto';
    const initial=mode==='high'?'high':mode==='low'?'low':mode==='balanced'?'balanced':(weak?'balanced':(mobile?'balanced':'high'));
    state.v1341Perf={mode,quality:initial,fps:60,frame:0,acc:0,bad:0,good:0,mobile,weak,lastChange:performance.now()};
    return state.v1341Perf;
  }

  function v1341Budget(high,balanced,low){const q=v1341Init().quality;return q==='low'?low:q==='balanced'?balanced:high;}
  function v1341Blur(n){const q=v1341Init().quality;return q==='low'?0:q==='balanced'?Math.min(Number(n)||0,9):Number(n)||0;}

  function v1341ApplyCaps(){
    const p=v1341Init(),q=p.quality,m=p.mobile;
    const particleCap=q==='high'?(m?180:260):q==='balanced'?(m?120:190):(m?72:120);
    const enemyBulletCap=q==='high'?(m?125:190):q==='balanced'?(m?95:150):(m?72:110);
    const playerBulletCap=q==='high'?(m?105:170):q==='balanced'?(m?82:135):(m?64:100);
    const starCap=q==='high'?(m?95:130):q==='balanced'?(m?72:105):(m?54:78);
    const trim=(arr,cap)=>{if(arr&&arr.length>cap)arr.splice(0,arr.length-cap);};
    trim(state.particles,particleCap);trim(state.enemyBullets,enemyBulletCap);trim(state.bullets,playerBulletCap);trim(state.stars,starCap);
  }

  function v1341SetQuality(q){
    const p=v1341Init();if(!['high','balanced','low'].includes(q)||p.quality===q)return p.quality;
    p.quality=q;p.bad=0;p.good=0;p.lastChange=performance.now();
    try{document.documentElement.dataset.cosmicPerf=q;}catch(_){ }
    window.dispatchEvent(new CustomEvent('cosmic:performance',{detail:{quality:q,fps:Math.round(p.fps),mode:p.mode}}));
    return q;
  }

  function v1341SetMode(mode){
    const p=v1341Init();if(!['auto','high','balanced','low'].includes(mode))mode='auto';p.mode=mode;
    if(mode!=='auto')v1341SetQuality(mode);
    else if(p.weak||p.mobile)v1341SetQuality('balanced');
    return p.mode;
  }

  function v1341PerfTick(dt){
    const p=v1341Init();p.frame=(p.frame+1)%1000000;
    if(dt>0&&dt<.22){const inst=Math.min(120,1/dt);p.fps=p.fps*.91+inst*.09;p.acc+=dt;}
    if(p.acc>=.55){
      p.acc=0;
      if(p.mode==='auto'){
        if(p.fps<43){p.bad++;p.good=Math.max(0,p.good-1);}else if(p.fps>56){p.good++;p.bad=Math.max(0,p.bad-1);}else{p.bad=Math.max(0,p.bad-1);p.good=Math.max(0,p.good-1);}
        if(p.bad>=3){v1341SetQuality(p.quality==='high'?'balanced':'low');}
        else if(p.good>=9){v1341SetQuality(p.quality==='low'?'balanced':'high');}
      }
      v1341ApplyCaps();
    }
  }

  function spawnEnemy(){`);

    code=code.replace("state.v134WeakFlash=Math.max(0,(state.v134WeakFlash||0)-dt);",`state.v134WeakFlash=Math.max(0,(state.v134WeakFlash||0)-dt);v1341PerfTick(dt);`);

    // Reduce procedural background work before gameplay logic is touched.
    code=code.replace("for(let i=0;i<20;i++){ const x=", "for(let i=0;i<v1341Budget(20,14,9);i++){ const x=");
    code=code.replace("for(let i=0;i<16;i++){ const y=", "for(let i=0;i<v1341Budget(16,11,7);i++){ const y=");
    code=code.replace("for(let i=0;i<5;i++){ ctx.strokeStyle='rgba('+(155+i*16)", "for(let i=0;i<v1341Budget(5,4,3);i++){ ctx.strokeStyle='rgba('+(155+i*16)");

    // Canvas shadow blur is one of the most expensive effects on low-end mobile GPUs.
    code=code.replace(/ctx\.shadowBlur\s*=\s*(\d+(?:\.\d+)?);/g,(m,n)=>`ctx.shadowBlur=v1341Blur(${n});`);

    // Keep status/diagnostics lightweight and available to Operator/QA tools.
    code=code.replace("bossArmor:Math.round(state.v134Armor||0),",`fps:Math.round(v1341Init().fps||0),performanceMode:v1341Init().mode,performanceQuality:v1341Init().quality,particles:state.particles?.length||0,enemyBulletCount:state.enemyBullets?.length||0,
        bossArmor:Math.round(state.v134Armor||0),`);

    // Extend service API with performance forcing and boss QA shortcuts.
    code=code.replace("spawnBoss();updateHud();return true;}",`spawnBoss();updateHud();return true;},
      setPerformance:(mode)=>v1341SetMode(mode),
      bossQA:(action)=>{const b=state.boss;if(!b)return false;if(action==='breakArmor'){state.v134Armor=0;state.v134ArmorBroken=true;state.v134Transform=.55;state.v134WeakFlash=.8;state.enemyBullets=[];return true;}if(action==='phase2'){b.hp=Math.min(b.hp,b.maxHp*.62);return true;}if(action==='phase3'){b.hp=Math.min(b.hp,b.maxHp*.30);return true;}if(action==='kill'){b.hp=0;return true;}return false;},
      diagnostics:()=>({fps:Math.round(v1341Init().fps||0),mode:v1341Init().mode,quality:v1341Init().quality,particles:state.particles?.length||0,enemyBullets:state.enemyBullets?.length||0,playerBullets:state.bullets?.length||0,stars:state.stars?.length||0})`);

    // Never let attract/demo sessions write a local high score.
    code=code.replace("if(score>best){best=score;localStorage.setItem('cosmicExplorerV11HighScore',String(score));}","if(!state.v11Attract&&score>best){best=score;localStorage.setItem('cosmicExplorerV11HighScore',String(score));}");

    // Initialize the governor once the game engine is ready.
    code=code.replace("function setupControls(){",`function setupControls(){v1341Init();try{document.documentElement.dataset.cosmicPerf=v1341Init().quality;}catch(_){ }`);

    return code;
  };

  const previous=window.__V11_PHASE2_PATCH;
  if(typeof previous==='function'&&!previous.__v1341Wrapped){
    const wrapped=(code)=>window.__V1341_PATCH(previous(code));
    wrapped.__v1341Wrapped=true;
    window.__V11_PHASE2_PATCH=wrapped;
  }
})();