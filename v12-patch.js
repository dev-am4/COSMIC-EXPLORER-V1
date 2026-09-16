(()=>{
  window.__V12_PATCH=(code)=>{
    // Runtime configuration shared with Operator Mode.
    code=code.replace("function drawV11Phase3Fx(){",`function v12Config(){
    let cfg={difficulty:'normal',attractDelay:15,sound:true,kiosk:false};
    try{ cfg=Object.assign(cfg,JSON.parse(localStorage.getItem('cosmicExplorerV12Settings')||'{}')); }catch(_){ }
    return cfg;
  }
  function v12Difficulty(){
    const key=state.v12Difficulty||v12Config().difficulty||'normal';
    return key==='easy'?{hp:.78,speed:.88,fire:.88,damage:.78,label:'EASY'}:key==='hard'?{hp:1.28,speed:1.14,fire:1.22,damage:1.18,label:'HARD'}:{hp:1,speed:1,fire:1,damage:1,label:'NORMAL'};
  }
  function v12Sound(type){
    try{
      if(!sounds.enabled) return;
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC) return;
      const ac=sounds.ctx||(sounds.ctx=new AC());
      if(ac.state==='suspended') ac.resume().catch(()=>{});
      const now=ac.currentTime;
      const tone=(freq,dur,gain=.05,wave='sine',delay=0,endFreq=null)=>{
        const o=ac.createOscillator(),g=ac.createGain(); o.type=wave; o.frequency.setValueAtTime(freq,now+delay);
        if(endFreq) o.frequency.exponentialRampToValueAtTime(Math.max(30,endFreq),now+delay+dur);
        g.gain.setValueAtTime(.0001,now+delay); g.gain.exponentialRampToValueAtTime(gain,now+delay+.015); g.gain.exponentialRampToValueAtTime(.0001,now+delay+dur);
        o.connect(g);g.connect(ac.destination);o.start(now+delay);o.stop(now+delay+dur+.03);
      };
      if(type==='warning'){ tone(95,.42,.065,'sawtooth',0,48); tone(76,.48,.055,'square',.28,42); }
      else if(type==='phase'){ tone(180,.20,.04,'square',0,360); tone(360,.28,.035,'triangle',.11,720); }
      else if(type==='complete'){ tone(130,.55,.06,'sawtooth',0,65); tone(330,.34,.035,'triangle',.18,660); tone(660,.46,.03,'sine',.38,990); }
      else if(type==='pause'){ tone(220,.12,.025,'triangle',0,150); }
      else if(type==='resume'){ tone(180,.10,.024,'triangle',0,290); }
      else if(type==='report'){ tone(330,.16,.025,'triangle',0,440); tone(440,.22,.022,'sine',.13,660); }
    }catch(_){ }
  }

  function drawV11Phase3Fx(){`);

    // Difficulty scaling for regular enemies and bosses.
    code=code.replace("const hp=16 + state.sector*6 + state.wave*2;","const hp=(16 + state.sector*6 + state.wave*2)*v12Difficulty().hp;");
    code=code.replace("speed:74+Math.random()*38+state.sector*10,shotCD:","speed:(74+Math.random()*38+state.sector*10)*v12Difficulty().speed,shotCD:");
    code=code.replace("const hpBase = 210 + idx*110;","const hpBase = (210 + idx*110)*v12Difficulty().hp;");
    code=code.replace("const s = e.type==='boss'? 170 : 130;","const s = (e.type==='boss'?170:130)*v12Difficulty().speed;");
    code=code.replace("damage:e.type==='boss'?8:5,color:'#ff6bd1'","damage:(e.type==='boss'?8:5)*v12Difficulty().damage,color:'#ff6bd1'");
    code=code.replace("const push=(ang,spd=175,dmg=8,size=16,ox=0,oy=18)=>state.enemyBullets.push({x:b.x+ox,y:b.y+oy,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd,w:size,h:size,damage:dmg,color:col});","const push=(ang,spd=175,dmg=8,size=16,ox=0,oy=18)=>{const d=v12Difficulty();state.enemyBullets.push({x:b.x+ox,y:b.y+oy,vx:Math.cos(ang)*spd*d.speed,vy:Math.sin(ang)*spd*d.speed,w:size,h:size,damage:dmg*d.damage,color:col});};");
    code=code.replace("b.shotCD=Math.max(.42,base-state.sector*.045);","b.shotCD=Math.max(.34,(base-state.sector*.045)/v12Difficulty().fire);");

    // Pause stops simulation but keeps the renderer alive.
    code=code.replace("function update(dt){\n    if(!playing) return;\n    const p = state.player;","function update(dt){\n    if(!playing) return;\n    if(state.v12Paused) return;\n    const p = state.player;");

    // Configurable exhibition attract delay.
    code=code.replace("performance.now()-(state.v11LastInputAt||0)>15000","performance.now()-(state.v11LastInputAt||0)>(state.v12AttractDelay||15000)");

    // V12 control API exposed to the lightweight UI layer.
    code=code.replace("function setupControls(){",`function setupControls(){
    const v12cfg=v12Config();
    state.v12Difficulty=v12cfg.difficulty||'normal'; state.v12AttractDelay=Math.max(8,Number(v12cfg.attractDelay||15))*1000; state.v12Paused=false;
    sounds.enabled=v12cfg.sound!==false;
    const v12SetPause=(on)=>{
      if(!playing) return false;
      state.v12Paused=typeof on==='boolean'?on:!state.v12Paused;
      if(state.v12Paused){ stopMusic(); v12Sound('pause'); } else { if(sounds.enabled) startMusic(); v12Sound('resume'); }
      window.dispatchEvent(new CustomEvent('cosmic:v12-pause-state',{detail:{paused:state.v12Paused}}));
      return state.v12Paused;
    };
    window.__COSMIC_V12={
      pause:v12SetPause,
      restart:()=>{ state.v12Paused=false; start(); window.dispatchEvent(new CustomEvent('cosmic:v12-pause-state',{detail:{paused:false}})); },
      settings:(cfg)=>{ state.v12Difficulty=(cfg&&cfg.difficulty)||state.v12Difficulty; state.v12AttractDelay=Math.max(8,Number((cfg&&cfg.attractDelay)||15))*1000; if(cfg&&typeof cfg.sound==='boolean'){sounds.enabled=cfg.sound;if(!sounds.enabled)stopMusic();else if(playing&&!state.v12Paused)startMusic();} },
      status:()=>({playing,paused:!!state.v12Paused,difficulty:v12Difficulty().label,attractDelay:state.v12AttractDelay})
    };
    window.addEventListener('cosmic:v12-toggle-pause',()=>v12SetPause());
    window.addEventListener('cosmic:v12-settings',e=>window.__COSMIC_V12.settings(e.detail||{}));`);

    // Reset pause state and advertise mission start.
    code=code.replace("resetGame(); playing=true; state.v11Warp=1.35;","resetGame(); playing=true; state.v12Paused=false; state.v11Warp=1.35;");
    code=code.replace("startMusic(); canvas.focus();","startMusic(); window.dispatchEvent(new CustomEvent('cosmic:v12-start',{detail:{difficulty:v12Difficulty().label}})); canvas.focus();");

    // Layer richer cinematic audio on top of the existing SFX.
    code=code.replace("state.v11BossWarning=2.15;","state.v11BossWarning=2.15; v12Sound('warning');");
    code=code.replace("addParticles(b.x,b.y,nextPhase===2?'#ffe077':'#ff68cc',26+nextPhase*5,210+nextPhase*35); sfx('boss');","addParticles(b.x,b.y,nextPhase===2?'#ffe077':'#ff68cc',26+nextPhase*5,210+nextPhase*35); sfx('boss'); v12Sound('phase');");
    code=code.replace("state.v11Finale=true; state.bossActive=true; state.v11MissionComplete=2.6; state.v11BossDefeat=2.2; state.enemyBullets=[]; sfx('clear');","state.v11Finale=true; state.bossActive=true; state.v11MissionComplete=2.6; state.v11BossDefeat=2.2; state.enemyBullets=[]; sfx('clear'); v12Sound('complete');");
    code=code.replace("window.dispatchEvent(new CustomEvent('cosmic:report',{detail:{score,best,rank,kills,bosses,combo,hp,elapsed,completed}}));","window.dispatchEvent(new CustomEvent('cosmic:report',{detail:{score,best,rank,kills,bosses,combo,hp,elapsed,completed}})); v12Sound('report');");

    return code;
  };

  // Phase 3 already wraps Phase 2. Wrap the resulting pipeline once more for V12.
  const previous=window.__V11_PHASE2_PATCH;
  if(typeof previous==='function'&&!previous.__v12Wrapped){
    const wrapped=(code)=>window.__V12_PATCH(previous(code));
    wrapped.__v12Wrapped=true;
    window.__V11_PHASE2_PATCH=wrapped;
  }
})();