(()=>{
  window.__V11_PHASE3_PATCH = (code)=>{
    // Prevent fresh waves during the final mission-clear cinematic.
    code=code.replace("function spawnEnemy(){\n    if(state.bossActive) return;","function spawnEnemy(){\n    if(state.bossActive||state.v11Finale) return;");

    // Phase 3 helper layer: boss-death shockwaves, finale cinematic and attract-mode overlay.
    code=code.replace("function spawnEnemy(){",`function drawV11Phase3Fx(){
    if(!playing) return;
    ctx.save();
    if(state.v11BossDefeat>0 && state.v11DeathX!=null){
      const age=Math.max(0,2.2-state.v11BossDefeat), cx=state.v11DeathX, cy=state.v11DeathY;
      ctx.globalCompositeOperation='lighter';
      for(let i=0;i<3;i++){
        const r=34+age*(150+i*42)-i*18;
        if(r>8){ ctx.strokeStyle='rgba('+(i===1?'255,112,213':'104,235,255')+','+Math.max(0,.34-age*.13-i*.05)+')'; ctx.lineWidth=5-i; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.stroke(); }
      }
      for(let i=0;i<14;i++){
        const a=(Math.PI*2/14)*i+age*.38, r=34+age*(95+(i%4)*17);
        ctx.fillStyle='rgba(255,232,160,'+Math.max(0,.26-age*.10)+')';
        ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r,cy+Math.sin(a)*r,2+(i%3),0,Math.PI*2); ctx.fill();
      }
    }
    if(state.v11Finale && state.v11MissionComplete>0){
      const total=2.6, left=state.v11MissionComplete, elapsed=total-left;
      const veil=Math.min(.58,Math.max(0,(elapsed-.18)*.28));
      ctx.fillStyle='rgba(0,2,10,'+veil+')'; ctx.fillRect(0,0,W,H);
      if(elapsed>.65){
        const a=Math.min(1,(elapsed-.65)*1.8); ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.shadowColor='#69eaff'; ctx.shadowBlur=28; ctx.fillStyle='rgba(238,253,255,'+a+')';
        ctx.font='700 11px system-ui,sans-serif'; ctx.fillText('ALL SECTORS CLEARED',W*.5,H*.43);
        ctx.font='900 '+Math.min(54,Math.max(34,W*.07))+'px system-ui,sans-serif'; ctx.fillText('MISSION COMPLETE',W*.5,H*.49);
      }
    }
    if(state.v11Attract){
      ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.shadowColor='#61eaff'; ctx.shadowBlur=16;
      ctx.fillStyle='rgba(230,252,255,.88)'; ctx.font='800 11px system-ui,sans-serif'; ctx.fillText('DEMO MODE  ·  TOUCH / CLICK TO PLAY',W*.5,H-34);
    }
    ctx.restore();
  }

  function spawnEnemy(){`);

    // Track total mission performance across sector resets.
    code=code.replace("const n=state.kills-state.v11LastKills; state.v11Combo=(state.v11Combo||0)+n; state.v11ComboTimer=2.5; state.v11Pulse=.14;",`const n=state.kills-state.v11LastKills; state.v11Combo=(state.v11Combo||0)+n; state.v11ComboTimer=2.5; state.v11Pulse=.14;
      state.v11TotalKills=(state.v11TotalKills||0)+n; state.v11MaxCombo=Math.max(state.v11MaxCombo||0,state.v11Combo||0);`);

    // Attract-mode autopilot: safe exhibition loop until a visitor interacts.
    code=code.replace("if(state.v11LastKills==null){ state.v11LastKills=state.kills;",`if(state.v11Attract&&p){
      const tt=state.time||0; p.x=W*.5+Math.sin(tt*.82)*Math.min(W*.29,240); p.y=H*.73+Math.sin(tt*1.31)*Math.min(H*.08,48);
      p.hp=p.maxHp; p.shield=Math.max(p.shield||0,30); state.keys.up=state.keys.down=state.keys.left=state.keys.right=false; state.keys.boost=(Math.sin(tt*.55)>.78);
    }
    if(state.v11LastKills==null){ state.v11LastKills=state.kills;`);

    // Phase 3 timers and final transition into Mission Report.
    code=code.replace("state.v11BossDefeat=Math.max(0,(state.v11BossDefeat||0)-dt);",`state.v11BossDefeat=Math.max(0,(state.v11BossDefeat||0)-dt);
    if(state.v11MissionComplete>0){
      const before=state.v11MissionComplete; state.v11MissionComplete=Math.max(0,before-dt);
      if(before>0&&state.v11MissionComplete<=0){ endGame('MISSION COMPLETE',''); return; }
    }`);

    // Final boss ends the expedition instead of wrapping immediately back to Earth.
    code=code.replace(`state.score+=1200; state.bossKills++; state.progress=0; state.boss=null; state.bossActive=false; state.wave=1;
        state.sector=(state.sector+1)%ASSETS.planets.length; state.kills=0; showBanner(ASSETS.planets[state.sector].key,'planet'+state.sector); sfx('clear');`,`state.score+=1200; state.bossKills++; state.progress=0; state.v11DeathX=b.x; state.v11DeathY=b.y; state.boss=null; state.wave=1; state.kills=0;
        if(state.bossKills>=ASSETS.planets.length){
          state.v11Finale=true; state.bossActive=true; state.v11MissionComplete=2.6; state.v11BossDefeat=2.2; state.enemyBullets=[]; sfx('clear');
        } else {
          state.bossActive=false; state.sector=(state.sector+1)%ASSETS.planets.length; showBanner(ASSETS.planets[state.sector].key,'planet'+state.sector); sfx('clear');
        }`);

    // New Mission Report + rank + persistent local high score.
    code=code.replace(/function endGame\(title, text\)\{[\s\S]*?\n  \}\n\n  function frame/,`function endGame(title, text){
    playing=false; stopMusic();
    const p=state.player, hp=p?Math.max(0,Math.round((p.hp/p.maxHp)*100)):0;
    const elapsed=Math.max(1,Math.round((performance.now()-(state.v11RunStartedAt||performance.now()))/1000));
    const bosses=state.bossKills||0, kills=state.v11TotalKills||0, combo=state.v11MaxCombo||0, score=state.score||0;
    const completed=title==='MISSION COMPLETE'||bosses>=ASSETS.planets.length;
    const performanceScore=score + bosses*850 + combo*55 + hp*7;
    let rank='C';
    if(completed && performanceScore>=15000 && hp>=35) rank='S';
    else if(performanceScore>=12000) rank='A';
    else if(performanceScore>=8500) rank='B';
    let best=0; try{ best=Number(localStorage.getItem('cosmicExplorerV11HighScore')||0); if(score>best){best=score;localStorage.setItem('cosmicExplorerV11HighScore',String(score));} }catch(_){best=Math.max(best,score);}
    const mm=Math.floor(elapsed/60), ss=String(elapsed%60).padStart(2,'0');
    $('#gameOver').classList.remove('hidden'); $('#controls').classList.add('hidden'); $('#topHud').classList.add('hidden');
    $('#gameOverTitle').textContent=completed?'MISSION COMPLETE':'MISSION END';
    const summary=$('#summary');
    summary.innerHTML='<div class="v11-report">'+
      '<div class="v11-rank v11-rank-'+rank.toLowerCase()+'"><small>MISSION RANK</small><strong>'+rank+'</strong></div>'+
      '<div class="v11-report-score"><span>SCORE</span><b>'+score.toLocaleString()+'</b><small>BEST '+best.toLocaleString()+'</small></div>'+
      '<div class="v11-report-grid">'+
        '<div><span>ENEMIES</span><b>'+kills+'</b></div><div><span>BOSSES</span><b>'+bosses+'/'+ASSETS.planets.length+'</b></div>'+
        '<div><span>MAX COMBO</span><b>×'+combo+'</b></div><div><span>HULL</span><b>'+hp+'%</b></div>'+
        '<div><span>TIME</span><b>'+mm+':'+ss+'</b></div><div><span>SHIP</span><b>'+ASSETS.players[state.shipIndex].name+'</b></div>'+
      '</div></div>';
    $('#restartBtn').textContent='PLAY AGAIN';
    window.dispatchEvent(new CustomEvent('cosmic:report',{detail:{score,best,rank,kills,bosses,combo,hp,elapsed,completed}}));
    if(state.v11Attract){
      setTimeout(()=>{ $('#gameOver').classList.add('hidden'); $('#home').classList.remove('hidden'); state.v11Attract=false; state.v11Finale=false; state.v11LastInputAt=performance.now()-13000; },2600);
    }
  }

  function frame`);

    // Reset run stats whenever a visitor starts a new mission.
    code=code.replace("resetGame(); playing=true; state.v11Warp=1.35;",`resetGame(); playing=true; state.v11Warp=1.35;
    state.v11RunStartedAt=performance.now(); state.v11TotalKills=0; state.v11MaxCombo=0; state.v11Finale=false; state.v11MissionComplete=0; state.v11DeathX=null; state.v11DeathY=null;`);

    // Exhibition attract mode after inactivity on the home screen.
    code=code.replace("function setupControls(){\n    const v11Pointer=",`function setupControls(){
    state.v11LastInputAt=performance.now(); state.v11Attract=false;
    const v11Wake=()=>{ state.v11LastInputAt=performance.now(); if(state.v11Attract){ state.v11Attract=false; state.v11Finale=false; } };
    window.addEventListener('pointerdown',v11Wake,true); window.addEventListener('keydown',v11Wake,true); window.addEventListener('touchstart',v11Wake,{capture:true,passive:true});
    setInterval(()=>{
      const home=$('#home'), over=$('#gameOver');
      if(!playing && home && !home.classList.contains('hidden') && over && over.classList.contains('hidden') && performance.now()-(state.v11LastInputAt||0)>15000){
        state.v11Attract=true; start(); if(state.player){state.player.hp=state.player.maxHp;state.player.shield=999;}
      }
    },1000);
    const v11Pointer=`);

    // Phase 3 overlay runs after the V11/Phase 2 overlay.
    code=code.replace("ctx.restore(); drawV11OverlayFx();\n    if(state.flash>0){","ctx.restore(); drawV11OverlayFx(); drawV11Phase3Fx();\n    if(state.flash>0){");

    return code;
  };

  // app-v9 already invokes the Phase 2 patch; wrap it so Phase 3 runs immediately after Phase 2.
  const previous=window.__V11_PHASE2_PATCH;
  if(typeof previous==='function'&&!previous.__phase3Wrapped){
    const wrapped=(code)=>window.__V11_PHASE3_PATCH(previous(code));
    wrapped.__phase3Wrapped=true;
    window.__V11_PHASE2_PATCH=wrapped;
  }
})();