(()=>{
  window.__V121_PATCH=(code)=>{
    // Robust asset loader: retry local files, keep decoded references, and guarantee a visual donor per category.
    code=code.replace(/function loadImages\(\)\{[\s\S]*?\n  \}\n\n  function fit/,`function loadImages(){
    const entries=[];
    ASSETS.players.forEach((a,i)=>entries.push({key:'player'+i,src:a.src,local:'/assets/v9/player'+(i+1)+'.webp?v=121'}));
    ASSETS.enemies.forEach((s,i)=>entries.push({key:'enemy'+i,src:s}));
    ASSETS.bosses.forEach((s,i)=>entries.push({key:'boss'+i,src:s}));
    ASSETS.planets.forEach((a,i)=>entries.push({key:'planet'+i,src:a.src}));
    Object.entries(ASSETS.pickups).forEach(([k,v])=>entries.push({key:k,src:v.src}));

    const loadOne=(entry)=>new Promise(resolve=>{
      const candidates=[];
      const add=s=>{if(s&&typeof s==='string'&&!candidates.includes(s))candidates.push(s);};
      add(entry.src); add(entry.local);
      if(entry.local) add(entry.local+(entry.local.includes('?')?'&':'?')+'retry=1');
      let done=false,idx=0,timer=null;
      const finish=(ok,img)=>{if(done)return;done=true;if(timer)clearTimeout(timer);if(ok&&img)images[entry.key]=img;resolve({key:entry.key,ok});};
      const attempt=()=>{
        if(idx>=candidates.length){finish(false);return;}
        const src=candidates[idx++],img=new Image();
        img.decoding='async';
        img.onload=()=>{if(timer)clearTimeout(timer);try{img.decode?.().catch(()=>{});}catch(_){ }finish(true,img);};
        img.onerror=()=>{if(timer)clearTimeout(timer);attempt();};
        timer=setTimeout(()=>{try{img.src='';}catch(_){ }attempt();},6500);
        img.src=src;
      };
      attempt();
    });

    return Promise.all(entries.map(loadOne)).then(results=>{
      const missing=results.filter(r=>!r.ok).map(r=>r.key),fallback=[];
      const groups=[['player0','player1','player2','player3'],['enemy0','enemy1','enemy2','enemy3'],['boss0','boss1','boss2','boss3'],['planet0','planet1','planet2','planet3'],['energy','repair','shield','weapon','rocket','bomb']];
      groups.forEach(group=>{
        const donor=group.find(k=>images[k]);
        if(!donor)return;
        group.forEach(k=>{if(!images[k]){images[k]=images[donor];fallback.push(k);}});
      });
      const status={ts:Date.now(),total:entries.length,loaded:entries.length-missing.length,fallback,missing};
      window.__COSMIC_ASSET_STATUS=status;
      try{localStorage.setItem('cosmicExplorerV121AssetStatus',JSON.stringify(status));}catch(_){ }
      window.dispatchEvent(new CustomEvent('cosmic:assets-ready',{detail:status}));
    });
  }

  function fit`);

    // Extend the V12 runtime API for field servicing and watchdog telemetry.
    code=code.replace("status:()=>({playing,paused:!!state.v12Paused,difficulty:v12Difficulty().label,attractDelay:state.v12AttractDelay})",`status:()=>({playing,paused:!!state.v12Paused,difficulty:v12Difficulty().label,attractDelay:state.v12AttractDelay,time:state.time||0,sector:state.sector,bossActive:!!state.bossActive}),
      home:()=>{playing=false;state.v12Paused=false;state.v11Attract=false;stopMusic();$('#gameOver').classList.add('hidden');$('#controls').classList.add('hidden');$('#topHud').classList.add('hidden');$('#sectorBanner').classList.add('hidden');$('#toast').classList.add('hidden');$('#home').classList.remove('hidden');window.dispatchEvent(new CustomEvent('cosmic:v121-home'));return true;},
      jumpSector:(value)=>{if(!playing)start();const sec=Math.max(0,Math.min(ASSETS.planets.length-1,Number(value)||0));state.sector=sec;state.bossKills=sec;state.kills=0;state.progress=0;state.wave=1;state.enemies=[];state.enemyBullets=[];state.bullets=[];state.boss=null;state.bossActive=false;state.v11Finale=false;state.v11MissionComplete=0;state.v11Warp=1.35;state.v11SectorSeen=sec;showBanner(ASSETS.planets[sec].key,'planet'+sec);updateHud();return sec;},
      testBoss:(value)=>{if(!playing)start();const sec=Math.max(0,Math.min(ASSETS.planets.length-1,Number(value)||0));state.sector=sec;state.bossKills=sec;state.kills=0;state.progress=0;state.wave=1;state.enemies=[];state.enemyBullets=[];state.bullets=[];state.boss=null;state.bossActive=false;state.v11Finale=false;state.v11MissionComplete=0;state.v11Warp=.55;state.v11SectorSeen=sec;showBanner(ASSETS.planets[sec].key,'planet'+sec);spawnBoss();updateHud();return true;}`);

    return code;
  };

  const previous=window.__V11_PHASE2_PATCH;
  if(typeof previous==='function'&&!previous.__v121Wrapped){
    const wrapped=(code)=>window.__V121_PATCH(previous(code));
    wrapped.__v121Wrapped=true;
    window.__V11_PHASE2_PATCH=wrapped;
  }
})();