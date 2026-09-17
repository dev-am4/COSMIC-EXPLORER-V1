(()=>{
  const previous=window.__V11_PHASE2_PATCH;
  const replace=(code,re,repl,key,status)=>{
    const next=code.replace(re,repl);
    status[key]=next!==code;
    return next;
  };
  const bossPatch=(input)=>{
    let code=input;
    const status={version:'13.4.5'};
    code=code.split('?v=1344').join('?v=1345').replaceAll("13.4.4","13.4.5");

    code=replace(code,/function spawnBoss\(\)\{[\s\S]*?\n  \}\n\n  function dropPickup/,`function spawnBoss(){
    if(state.bossActive) return;
    state.bossActive=true;
    const idx=state.sector, hpBase=210+idx*95;
    state.boss={type:'boss',imgKey:'boss'+idx,x:W*.5,y:-145,w:168,h:168,hp:hpBase,maxHp:hpBase,speed:48+idx*7,shotCD:1.15,phase:0,v1345Phase:1};
    state.enemyBullets=[]; state.v1345BossIntro=1.25; state.v1345PhaseFlash=0;
    state.shake=Math.max(state.shake,6); showBanner(ASSETS.planets[state.sector].boss,'boss'+idx); sfx('boss'); updateHud();
  }

  function dropPickup`,'spawn',status);

    code=replace(code,/function bossShoot\(b\)\{[\s\S]*?\n  \}\n\n  function drawBackground/,`function bossShoot(b){
    const p=state.player;if(!p)return;
    const sec=state.sector,ph=b.v1345Phase||1,aim=Math.atan2(p.y-b.y,p.x-b.x);
    const cols=['#62eaff','#dce9ff','#ff9a55','#c979ff'],col=cols[sec]||'#ff6bd1';
    const push=(ang,spd=180,dmg=8,size=15)=>state.enemyBullets.push({x:b.x,y:b.y+20,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd,w:size,h:size,damage:dmg,color:col});
    const fan=(center,count,spread,spd,dmg=8)=>{for(let i=0;i<count;i++){const u=count===1?0:i/(count-1)-.5;push(center+u*spread,spd,dmg,ph>=3?17:15);}};
    if(sec===0){ if(ph===1)fan(aim,3,.42,175,7); else if(ph===2){fan(Math.PI/2,5,.9,185,8);push(aim,220,8);} else fan(aim,7,1.05,205,9); }
    else if(sec===1){ if(ph===1)fan(aim,3,.34,180,7); else if(ph===2)fan(aim,5,.72,195,8); else {fan(aim,7,1.0,210,9);push(Math.PI/2,220,9);} }
    else if(sec===2){ if(ph===1)fan(Math.PI/2,5,.86,185,8); else if(ph===2){fan(aim,4,.55,205,8);fan(Math.PI/2,3,.72,185,8);} else fan(Math.PI/2,9,1.38,215,9); }
    else { const wob=Math.sin(b.phase*.9)*.28; if(ph===1)fan(Math.PI/2+wob,5,.82,180,8); else if(ph===2)fan(aim,7,.95,200,9); else {fan(aim,7,1.1,215,9);for(let i=0;i<6;i++)push((Math.PI*2/6)*i+b.phase*.3,145,7,14);} }
  }

  function drawBackground`,'shoot',status);

    code=replace(code,/if\(state\.boss\)\{[\s\S]*?\n    \}\n\n    state\.bullets\.forEach/,`if(state.boss){
      const b=state.boss;b.phase+=dt;
      const ratio=Math.max(0,b.hp/b.maxHp),nextPhase=ratio>.66?1:ratio>.33?2:3;
      if(nextPhase!==(b.v1345Phase||1)){
        b.v1345Phase=nextPhase;state.v1345PhaseFlash=.8;state.enemyBullets=[];
        state.shake=Math.max(state.shake,8+nextPhase*2);state.flash=Math.max(state.flash,.10);
        addParticles(b.x,b.y,nextPhase===2?'#ffe077':'#ff68cc',18+nextPhase*4,190+nextPhase*25);sfx('boss');
      }
      if(b.y<140)b.y+=Math.max(52,b.speed)*dt;
      else{const amp=Math.min(155,W*.21)+(b.v1345Phase-1)*18;b.x=W*.5+Math.sin(b.phase*(.74+b.v1345Phase*.16))*amp;b.y=140+Math.sin(b.phase*.52)*10;}
      b.x=Math.max(86,Math.min(W-86,b.x));b.shotCD-=dt;
      if((state.v1345BossIntro||0)<=0&&b.y>=126&&b.shotCD<=0){bossShoot(b);const base=b.v1345Phase===1?1.18:b.v1345Phase===2?.86:.66;b.shotCD=Math.max(.52,base-state.sector*.035);}
      if(b.hp<=0){
        addParticles(b.x,b.y,'#fff0a0',34,250);addParticles(b.x,b.y,'#ff69ca',22,220);state.shake=15;state.flash=.18;
        state.score+=1200;state.bossKills++;state.progress=0;state.boss=null;state.bossActive=false;state.wave=1;
        state.sector=(state.sector+1)%ASSETS.planets.length;state.kills=0;showBanner(ASSETS.planets[state.sector].key,'planet'+state.sector);sfx('clear');
      }
    }

    state.bullets.forEach`,'controller',status);

    code=replace(code,/state\.v11Pulse=Math\.max\(0,\(state\.v11Pulse\|\|0\)-dt\*2\.8\);/,`state.v11Pulse=Math.max(0,(state.v11Pulse||0)-dt*2.8);
    state.v1345BossIntro=Math.max(0,(state.v1345BossIntro||0)-dt);
    state.v1345PhaseFlash=Math.max(0,(state.v1345PhaseFlash||0)-dt);`,'timers',status);

    code=replace(code,/if\(state\.v11Pulse>0\)\{\n      const a=Math\.min\(\.20,state\.v11Pulse\*\.9\); ctx\.fillStyle='rgba\(101,232,255,'\+a\+'\)'; ctx\.fillRect\(0,0,W,H\);\n    \}/,`if(state.boss){
      const b=state.boss,bw=Math.min(W*.64,520),bx=(W-bw)/2,by=W<700?74:88;
      ctx.shadowBlur=0;ctx.textBaseline='alphabetic';ctx.font='700 10px system-ui,sans-serif';ctx.fillStyle='rgba(238,247,255,.78)';ctx.textAlign='left';ctx.fillText(ASSETS.planets[state.sector].boss,bx,by-8);ctx.textAlign='right';ctx.fillText('PHASE '+(b.v1345Phase||1),bx+bw,by-8);
      ctx.fillStyle='rgba(255,255,255,.11)';ctx.fillRect(bx,by,bw,7);ctx.fillStyle='#ff669f';ctx.fillRect(bx,by,bw*Math.max(0,b.hp/b.maxHp),7);
      if((state.v1345BossIntro||0)>0){ctx.textAlign='center';ctx.font='900 '+Math.min(34,Math.max(24,W*.05))+'px system-ui,sans-serif';ctx.fillStyle='rgba(255,225,235,.95)';ctx.shadowColor='#ff365c';ctx.shadowBlur=18;ctx.fillText('WARNING',W*.5,H*.36);}
      if((state.v1345PhaseFlash||0)>0){ctx.textAlign='center';ctx.font='900 '+Math.min(42,Math.max(28,W*.06))+'px system-ui,sans-serif';ctx.fillStyle='rgba(255,245,255,.94)';ctx.shadowColor='#ff77dc';ctx.shadowBlur=20;ctx.fillText('PHASE '+(b.v1345Phase||1),W*.5,H*.32);}
    }
    if(state.v11Pulse>0){
      const a=Math.min(.20,state.v11Pulse*.9); ctx.fillStyle='rgba(101,232,255,'+a+')'; ctx.fillRect(0,0,W,H);
    }`,'overlay',status);

    window.__COSMIC_PATCH_STATUS=status;
    if(!status.spawn||!status.shoot||!status.controller)console.warn('[V13.4.5 boss patch partial]',status);
    return code;
  };
  if(typeof previous==='function')window.__V11_PHASE2_PATCH=(code)=>bossPatch(previous(code));
})();