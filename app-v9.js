(()=>{try{const s=(window.__V9_B64||[]).join('');const bytes=Uint8Array.from(atob(s),c=>c.charCodeAt(0));let code=new TextDecoder().decode(bytes);

// V10 mobile safety retained.
code=code.replace("const side = Math.random() < .7 ? 'top' : (Math.random()<.5?'left':'right');","const side = 'top';");
code=code.replace("p.x = Math.max(34, Math.min(W-34,p.x)); p.y = Math.max(84, Math.min(H-40,p.y));","const safeX = W < 700 ? 42 : 46; const safeBottom = W < 700 ? 112 : 56; p.x = Math.max(safeX, Math.min(W-safeX,p.x)); p.y = Math.max(84, Math.min(H-safeBottom,p.y));");
code=code.replace("state.player.x = Math.min(W-50, Math.max(50, state.player.x));\n      state.player.y = Math.min(H-90, Math.max(100, state.player.y));","const mx=W<700?42:50, mb=W<700?112:90; state.player.x = Math.min(W-mx, Math.max(mx, state.player.x)); state.player.y = Math.min(H-mb, Math.max(92, state.player.y));");

// V11: richer impact particles without changing the collision system.
code=code.replace(/function addParticles\(x,y,color,count=10,speed=140\)\{[\s\S]*?\n  \}\n\n  function spawnEnemy\(\)\{/, `function addParticles(x,y,color,count=10,speed=140){
    const total=Math.min(46,Math.max(count,Math.ceil(count*1.45)));
    for(let i=0;i<total;i++){
      const a=Math.random()*Math.PI*2, v=(.35+Math.random()*.85)*speed;
      state.particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:.32+Math.random()*.52,r:1.5+Math.random()*4.5,color});
    }
    for(let i=0;i<3;i++){
      const a=Math.random()*Math.PI*2, v=25+Math.random()*55;
      state.particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:.45+Math.random()*.35,r:5+Math.random()*4,color});
    }
  }

  function spawnEnemy(){`);

// V11: formation-driven waves. Still uses the original enemy object contract.
code=code.replace(/function spawnEnemy\(\)\{[\s\S]*?function spawnBoss\(\)\{/, `function spawnEnemy(){
    if(state.bossActive) return;
    const maxEnemies = W < 700 ? 4 : 6;
    if(state.enemies.length >= maxEnemies) return;
    state.v11SpawnSlot=(state.v11SpawnSlot||0)+1;
    const slot=state.v11SpawnSlot;
    const idx=Math.floor(Math.random()*ASSETS.enemies.length);
    const pattern=(state.wave + Math.floor(state.kills/6))%4;
    const lanes=[.18,.34,.50,.66,.82,.26,.74];
    let frac=.5;
    if(pattern===0){ const v=[.5,.35,.65,.22,.78,.5]; frac=v[slot%v.length]; }
    else if(pattern===1){ frac=lanes[slot%lanes.length]; }
    else if(pattern===2){ frac=.5+Math.sin(slot*1.55)*.30; }
    else { frac=(slot%2? .22:.78) + Math.sin(slot*.7)*.06; }
    const x=Math.max(54,Math.min(W-54,W*frac));
    const hp=16 + state.sector*6 + state.wave*2;
    const e={type:'enemy',imgKey:'enemy'+idx,x,y:-58,w:58,h:58,
      hp,maxHp:hp,speed:74+Math.random()*38+state.sector*10,shotCD:1.25+Math.random()*1.55,strafe:Math.random()<.5?-1:1,
      targetY:116+(slot%4)*Math.min(54,H*.055),phase:Math.random()*6.28,formation:pattern,formationSlot:slot,originX:x};
    state.enemies.push(e);
  }

  function spawnBoss(){`);

// V11: stronger formation motion after entry.
code=code.replace("if(e.y < e.targetY) e.y += e.speed*dt; else { e.x += Math.sin(e.phase*2.1)*e.strafe*44*dt; e.y += Math.cos(e.phase*1.4)*10*dt; }",`if(e.y < e.targetY) e.y += e.speed*dt; else {
      const fm=e.formation||0, t=state.time+(e.formationSlot||0)*.38;
      if(fm===0) e.x=e.originX+Math.sin(t*1.9)*22;
      else if(fm===1) e.x=e.originX+Math.sin(t*3.1)*34;
      else if(fm===2) e.x=e.originX+Math.sin(t*2.35)*Math.min(72,W*.12);
      else e.x=e.originX+Math.sin(t*1.35)*46;
      e.y += Math.cos(t*1.2)*7*dt;
    }`);

// V11 helpers are injected into the decoded game closure so they can use state/canvas directly.
code=code.replace("function spawnEnemy(){",`function drawV11BackgroundFx(){
    if(!playing) return;
    const p=state.player;
    ctx.save();
    if(state.v11Warp>0){
      const a=Math.min(1,state.v11Warp/.9);
      ctx.globalCompositeOperation='lighter';
      for(let i=0;i<34;i++){
        const ang=(i/34)*Math.PI*2 + state.time*.12;
        const inner=28+(1-a)*120, outer=Math.max(W,H)*.72;
        const cx=W*.5, cy=H*.48;
        ctx.strokeStyle='rgba(94,225,255,'+(a*(.12+(i%5)*.012))+')';
        ctx.lineWidth=1+(i%3);
        ctx.beginPath();
        ctx.moveTo(cx+Math.cos(ang)*inner,cy+Math.sin(ang)*inner);
        ctx.lineTo(cx+Math.cos(ang)*outer,cy+Math.sin(ang)*outer);
        ctx.stroke();
      }
      ctx.fillStyle='rgba(54,119,255,'+(a*.08)+')'; ctx.fillRect(0,0,W,H);
    }
    if(p&&p.boosting){
      ctx.globalCompositeOperation='lighter';
      for(let i=1;i<=7;i++){
        const yy=p.y+p.h*.34+i*13;
        ctx.fillStyle='rgba(83,226,255,'+(0.20-i*.018)+')';
        ctx.beginPath(); ctx.ellipse(p.x,yy,10+i*2,18+i*5,0,0,Math.PI*2); ctx.fill();
      }
      for(let i=0;i<18;i++){
        const x=(i*73+state.time*410)%W, y=(i*137+state.time*780)%H;
        ctx.strokeStyle='rgba(180,245,255,.28)'; ctx.lineWidth=1.2;
        ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y+26+(i%4)*9); ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawV11OverlayFx(){
    if(!playing) return;
    ctx.save();
    if(state.v11Combo>1 && state.v11ComboTimer>0){
      const a=Math.min(1,state.v11ComboTimer/.35, (2.5-state.v11ComboTimer)/.18 + .35);
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.font='900 '+Math.min(44,26+state.v11Combo*1.4)+'px system-ui,sans-serif';
      ctx.shadowColor='#64e6ff'; ctx.shadowBlur=22; ctx.fillStyle='rgba(235,252,255,'+Math.max(.45,a)+')';
      ctx.fillText('COMBO ×'+state.v11Combo,W*.5,Math.min(138,H*.15));
    }
    if(state.v11Warp>0){
      const a=Math.min(1,state.v11Warp/.55);
      ctx.textAlign='center'; ctx.fillStyle='rgba(255,255,255,'+a+')';
      ctx.shadowColor='#57dfff'; ctx.shadowBlur=20;
      ctx.font='700 12px system-ui,sans-serif'; ctx.fillText('NOW ENTERING',W*.5,H*.42);
      ctx.font='900 '+Math.min(48,Math.max(30,W*.065))+'px system-ui,sans-serif';
      const label=ASSETS.planets[state.sector]?.key||'UNKNOWN'; ctx.fillText(label,W*.5,H*.47);
    }
    if(state.v11Pulse>0){
      const a=Math.min(.20,state.v11Pulse*.9); ctx.fillStyle='rgba(101,232,255,'+a+')'; ctx.fillRect(0,0,W,H);
    }
    ctx.restore();
  }

  function spawnEnemy(){`);

// V11: game-feel state, combo, damage feedback and warp transitions.
code=code.replace(/function update\(dt\)\{\s*if\(!playing\) return;\s*const p = state\.player;/,`function update(dt){
    if(!playing) return;
    const p = state.player;
    if(state.v11LastKills==null){ state.v11LastKills=state.kills; state.v11LastScore=state.score; state.v11LastHp=p?p.hp:0; state.v11SectorSeen=state.sector; state.v11Combo=0; state.v11ComboTimer=0; state.v11Warp=state.v11Warp||0; state.v11Pulse=0; }
    if(state.kills>state.v11LastKills){
      const n=state.kills-state.v11LastKills; state.v11Combo=(state.v11Combo||0)+n; state.v11ComboTimer=2.5; state.v11Pulse=.14;
      state.shake=Math.max(state.shake,Math.min(8,2.2+state.v11Combo*.35)); state.flash=Math.max(state.flash,.025);
      if(state.v11Combo===5||state.v11Combo===10||state.v11Combo===20) sfx('clear');
    } else { state.v11ComboTimer=Math.max(0,(state.v11ComboTimer||0)-dt); if(state.v11ComboTimer<=0) state.v11Combo=0; }
    state.v11LastKills=state.kills;
    if(p&&p.hp<state.v11LastHp){ state.shake=Math.max(state.shake,11); state.flash=Math.max(state.flash,.18); state.v11Pulse=.20; }
    state.v11LastHp=p?p.hp:0;
    if(state.sector!==state.v11SectorSeen){ state.v11SectorSeen=state.sector; state.v11Warp=1.55; state.v11Combo=0; state.v11ComboTimer=0; }
    state.v11Warp=Math.max(0,(state.v11Warp||0)-dt);
    state.v11Pulse=Math.max(0,(state.v11Pulse||0)-dt*2.8);`);

// V11: direct touch drag on mobile, mouse-follow on desktop, keyboard remains available.
code=code.replace("function setupControls(){",`function setupControls(){
    const v11Pointer={id:null,active:false};
    const v11SetPlayerFromPointer=(e)=>{
      if(!playing||!state.player) return;
      const r=canvas.getBoundingClientRect();
      let x=(e.clientX-r.left)*(W/Math.max(1,r.width));
      let y=(e.clientY-r.top)*(H/Math.max(1,r.height));
      if(e.pointerType!=='mouse') y-=Math.min(90,H*.07);
      const mx=W<700?42:50, mb=W<700?112:72;
      state.player.x=Math.max(mx,Math.min(W-mx,x));
      state.player.y=Math.max(88,Math.min(H-mb,y));
    };
    canvas.style.touchAction='none';
    canvas.addEventListener('pointerdown',e=>{
      if(!playing) return;
      if(e.pointerType!=='mouse'){
        v11Pointer.id=e.pointerId; v11Pointer.active=true;
        try{canvas.setPointerCapture(e.pointerId);}catch(_){ }
        v11SetPlayerFromPointer(e); e.preventDefault();
      }
    },{passive:false});
    canvas.addEventListener('pointermove',e=>{
      if(!playing) return;
      if(e.pointerType==='mouse'){ v11SetPlayerFromPointer(e); return; }
      if(v11Pointer.active&&e.pointerId===v11Pointer.id){ v11SetPlayerFromPointer(e); e.preventDefault(); }
    },{passive:false});
    const v11Release=e=>{ if(v11Pointer.id===null||!e||e.pointerId===v11Pointer.id){v11Pointer.active=false;v11Pointer.id=null;} };
    canvas.addEventListener('pointerup',v11Release,{passive:false}); canvas.addEventListener('pointercancel',v11Release,{passive:false});`);

// V11: initial mission warp and combo reset.
code=code.replace("resetGame(); playing=true; startMusic();",`resetGame(); playing=true; state.v11Warp=1.35; state.v11SectorSeen=state.sector; state.v11Combo=0; state.v11ComboTimer=0; state.v11LastKills=state.kills; state.v11LastHp=state.player?state.player.hp:0; startMusic();`);

// V10.2 enemy orientation retained; V11 adds render FX around the original scene.
code=code.replace("ctx.save(); ctx.globalAlpha=alpha; ctx.translate(x,y); ctx.rotate(rotation); if(img) ctx.drawImage(img,-w/2,-h/2,w,h); else { ctx.fillStyle='#fff'; ctx.fillRect(-w/2,-h/2,w,h);} ctx.restore();","ctx.save(); ctx.globalAlpha=alpha; ctx.translate(x,y); let rr=rotation; if(String(imgKey).startsWith('enemy')||String(imgKey).startsWith('boss')) rr+=Math.PI; ctx.rotate(rr); if(img){ ctx.drawImage(img,-w/2,-h/2,w,h); } else if(String(imgKey).startsWith('player')){ ctx.shadowColor='#62eaff'; ctx.shadowBlur=18; ctx.fillStyle='#f4fbff'; ctx.strokeStyle='#58cfff'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(0,-h*.42); ctx.lineTo(w*.33,h*.22); ctx.lineTo(w*.12,h*.16); ctx.lineTo(0,h*.40); ctx.lineTo(-w*.12,h*.16); ctx.lineTo(-w*.33,h*.22); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle='#7de8ff'; ctx.beginPath(); ctx.ellipse(0,-h*.08,w*.10,h*.14,0,0,Math.PI*2); ctx.fill(); } else { ctx.shadowColor='#61e7ff'; ctx.shadowBlur=14; ctx.strokeStyle='#61e7ff'; ctx.lineWidth=3; ctx.fillStyle='rgba(22,54,98,.58)'; ctx.beginPath(); ctx.arc(0,0,Math.min(w,h)*.34,0,Math.PI*2); ctx.fill(); ctx.stroke(); } ctx.restore();");
code=code.replace("drawBackground();\n    const p=state.player;\n    ctx.save(); if(state.shake>0) ctx.translate((Math.random()-.5)*state.shake,(Math.random()-.5)*state.shake);\n    if(!p) return;","drawBackground(); drawV11BackgroundFx(); const p=state.player; if(!p) return; ctx.save(); if(state.shake>0) ctx.translate((Math.random()-.5)*state.shake,(Math.random()-.5)*state.shake);");
code=code.replace("ctx.restore();\n    if(state.flash>0){", "ctx.restore(); drawV11OverlayFx();\n    if(state.flash>0){");

if(typeof window.__V11_PHASE2_PATCH==='function') code=window.__V11_PHASE2_PATCH(code);
(0,eval)(code);}catch(e){console.error('V11.2 boot failed',e);document.body.dataset.v11BootError='1';}})();