(()=>{
  window.__V11_PHASE2_PATCH = (code)=>{
    // Boss spawn: cinematic warning and explicit phase state.
    code=code.replace(/function spawnBoss\(\)\{[\s\S]*?\n  \}\n\n  function dropPickup/, `function spawnBoss(){
    if(state.bossActive) return;
    state.bossActive = true;
    const idx = state.sector;
    const hpBase = 210 + idx*110;
    state.boss = {type:'boss', imgKey:'boss'+idx, x:W*.5, y:-150, w:176, h:176,
      hp:hpBase, maxHp:hpBase, speed:46+idx*8, shotCD:1.15, phase:0, v11Phase:1, v11LastPhase:1};
    state.enemyBullets=[];
    state.v11BossWarning=2.15;
    state.v11BossPhaseBanner=0;
    state.v11BossDefeat=0;
    state.shake=Math.max(state.shake,7);
    showBanner(ASSETS.planets[state.sector].boss,'boss'+idx);
    sfx('boss');
    updateHud();
  }

  function dropPickup`);

    // Sector-specific boss attack language with three phases.
    code=code.replace(/function bossShoot\(b\)\{[\s\S]*?\n  \}\n\n  function drawBackground/, `function bossShoot(b){
    const p=state.player; if(!p) return;
    const sec=state.sector, ph=b.v11Phase||1;
    const aim=Math.atan2(p.y-b.y,p.x-b.x);
    const colors=['#62eaff','#d8e8ff','#ff9a55','#c979ff'];
    const col=colors[sec]||'#ff6bd1';
    const push=(ang,spd=175,dmg=8,size=16,ox=0,oy=18)=>state.enemyBullets.push({x:b.x+ox,y:b.y+oy,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd,w:size,h:size,damage:dmg,color:col});
    const fan=(center,count,spread,spd,dmg=8)=>{ for(let i=0;i<count;i++){ const u=count===1?0:i/(count-1)-.5; push(center+u*spread,spd,dmg,ph>=3?18:16); } };

    if(sec===0){
      if(ph===1) fan(aim,3,.44,175,7);
      else if(ph===2){ fan(Math.PI/2,5,.95,190,8); push(aim,225,9,14); }
      else { fan(aim,7,1.18,215,9); push(Math.PI/2-.72,180,8); push(Math.PI/2+.72,180,8); }
    } else if(sec===1){
      if(ph===1) fan(aim,3,.34,185,7);
      else if(ph===2){ fan(aim,5,.78,205,8); const wob=Math.sin(b.phase*1.8)*.38; push(Math.PI/2+wob,225,8); }
      else { fan(aim,7,1.05,220,9); for(let i=0;i<4;i++) push(Math.PI/2 + (i-1.5)*.48,175,8,14,(i-1.5)*18); }
    } else if(sec===2){
      if(ph===1) fan(Math.PI/2,5,.92,190,8);
      else if(ph===2){ const side=Math.sin(b.phase*2.5)>0?-.62:.62; fan(Math.PI/2+side,4,.5,220,9); fan(aim,3,.3,195,8); }
      else { fan(Math.PI/2,9,1.48,225,10); push(aim,260,10,15); }
    } else {
      if(ph===1){ const spin=Math.sin(b.phase*.8)*.32; fan(Math.PI/2+spin,5,.9,185,8); }
      else if(ph===2){ fan(aim,7,1.05,210,9); for(let i=0;i<3;i++) push(Math.PI/2+(i-1)*.75,170,8,14); }
      else { for(let i=0;i<12;i++){ const ang=(Math.PI*2/12)*i + b.phase*.45; push(ang,145,8,14); } fan(aim,5,.55,235,10); }
    }
    if(ph>=3) state.shake=Math.max(state.shake,3.5);
  }

  function drawBackground`);

    // Four sectors now read as genuinely different levels.
    code=code.replace(/function drawBackground\(\)\{[\s\S]*?\n  \}\n\n  function drawEntity/, `function drawBackground(){
    const sec=state.sector, t=state.time||0;
    const palettes=[
      ['#0b2a58','#07162f','#02050c'],
      ['#17233d','#091221','#02050b'],
      ['#482016','#1a0b12','#04040a'],
      ['#12071f','#05020d','#000006']
    ];
    const pal=palettes[sec]||palettes[0];
    const grad=ctx.createLinearGradient(0,0,0,H); grad.addColorStop(0,pal[0]); grad.addColorStop(.55,pal[1]); grad.addColorStop(1,pal[2]); ctx.fillStyle=grad; ctx.fillRect(0,0,W,H);

    if(sec===0){
      const glow=ctx.createRadialGradient(W*.82,H*.18,10,W*.82,H*.18,Math.min(W,H)*.52); glow.addColorStop(0,'rgba(75,180,255,.17)'); glow.addColorStop(1,'rgba(50,120,255,0)'); ctx.fillStyle=glow; ctx.fillRect(0,0,W,H);
      for(let i=0;i<5;i++){ const y=((t*34+i*173)%(H+120))-60; ctx.save(); ctx.translate(45+(i%2)*(W-90),y); ctx.rotate(.2*(i%2?1:-1)); ctx.fillStyle='rgba(115,235,255,.24)'; ctx.shadowColor='#6eeaff'; ctx.shadowBlur=14; ctx.fillRect(-5,-22,10,44); ctx.restore(); }
    } else if(sec===1){
      const moonGlow=ctx.createRadialGradient(W*.78,H*.18,10,W*.78,H*.18,Math.min(W,H)*.46); moonGlow.addColorStop(0,'rgba(205,225,255,.12)'); moonGlow.addColorStop(1,'rgba(120,160,210,0)'); ctx.fillStyle=moonGlow; ctx.fillRect(0,0,W,H);
      for(let i=0;i<20;i++){ const x=(i*83+t*8)%W, y=(i*137+t*18)%H; ctx.fillStyle='rgba(210,225,245,'+(0.04+(i%4)*.018)+')'; ctx.beginPath(); ctx.arc(x,y,1+(i%3)*.8,0,Math.PI*2); ctx.fill(); }
    } else if(sec===2){
      const dust=ctx.createRadialGradient(W*.25,H*.35,20,W*.25,H*.35,Math.min(W,H)*.65); dust.addColorStop(0,'rgba(255,113,55,.15)'); dust.addColorStop(1,'rgba(255,90,30,0)'); ctx.fillStyle=dust; ctx.fillRect(0,0,W,H);
      ctx.save(); ctx.globalCompositeOperation='lighter'; for(let i=0;i<16;i++){ const y=(i*71+t*45)%H; const x=(i*119+t*30)%W; ctx.strokeStyle='rgba(255,145,86,'+(0.035+(i%3)*.02)+')'; ctx.lineWidth=1+(i%2); ctx.beginPath(); ctx.moveTo(x-60,y); ctx.lineTo(x+45,y+14); ctx.stroke(); } ctx.restore();
    } else {
      const cx=W*.72, cy=H*.25;
      const voidGlow=ctx.createRadialGradient(cx,cy,18,cx,cy,Math.min(W,H)*.62); voidGlow.addColorStop(0,'rgba(0,0,0,.95)'); voidGlow.addColorStop(.18,'rgba(112,55,180,.10)'); voidGlow.addColorStop(.45,'rgba(76,33,155,.08)'); voidGlow.addColorStop(1,'rgba(10,0,30,0)'); ctx.fillStyle=voidGlow; ctx.fillRect(0,0,W,H);
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(-.18); for(let i=0;i<5;i++){ ctx.strokeStyle='rgba('+(155+i*16)+','+(80+i*12)+',255,'+(0.10-i*.012)+')'; ctx.lineWidth=2+i*.8; ctx.beginPath(); ctx.ellipse(0,0,70+i*20,18+i*6,0,0,Math.PI*2); ctx.stroke(); } ctx.restore();
    }

    const planet=images['planet'+sec];
    if(planet){
      let s=Math.min(W,H)*(sec===3?.40:.50), px=W-s*.72, py=28;
      if(sec===2){px=W-s*.78;py=42;} if(sec===3){px=W*.72-s*.5;py=H*.25-s*.5;}
      ctx.save(); ctx.globalAlpha=sec===3?.28:.20; ctx.drawImage(planet,px,py,s,s); ctx.restore();
    }

    state.stars.forEach((st,i)=>{
      const speed=[.55,.42,.82,1.55][sec]||.55; st.y+=st.z*speed;
      if(sec===3){ const cx=W*.72,cy=H*.25,dx=cx-st.x,dy=cy-st.y; st.x+=dx*.00045*(1+st.z); st.y+=dy*.00018; }
      if(st.y>H+4){st.y=-4;st.x=Math.random()*W;} if(st.x<0||st.x>W){st.x=Math.random()*W;}
      ctx.globalAlpha=.38+st.z*.42; ctx.fillStyle=sec===2?(i%4===0?'#ffb080':'#fff'):(sec===3?(i%5===0?'#c28cff':'#fff'):'#fff');
      ctx.fillRect(st.x,st.y,st.s,sec===3?st.s*(1+st.z*1.2):st.s);
    }); ctx.globalAlpha=1;
  }

  function drawEntity`);

    // Boss controller: warning entrance + three phases + phase transitions.
    code=code.replace(/if\(state\.boss\)\{[\s\S]*?\n    \}\n\n    state\.bullets\.forEach/, `if(state.boss){
      const b=state.boss; b.phase+=dt;
      const ratio=Math.max(0,b.hp/b.maxHp); const nextPhase=ratio>.66?1:ratio>.33?2:3;
      if(nextPhase!==(b.v11Phase||1)){
        b.v11Phase=nextPhase; state.v11BossPhaseBanner=1.15; state.enemyBullets=[];
        state.shake=Math.max(state.shake,10+nextPhase*2); state.flash=Math.max(state.flash,.13);
        addParticles(b.x,b.y,nextPhase===2?'#ffe077':'#ff68cc',26+nextPhase*5,210+nextPhase*35); sfx('boss');
      }
      if(b.y<140){ b.y+=Math.max(52,b.speed)*dt; }
      else {
        const amp=Math.min(165,W*.22)+(b.v11Phase-1)*Math.min(34,W*.04);
        b.x=W*.5+Math.sin(b.phase*(.72+b.v11Phase*.18))*amp;
        b.y=140+Math.sin(b.phase*(.48+b.v11Phase*.08))*12;
      }
      b.x=Math.max(88,Math.min(W-88,b.x));
      b.shotCD-=dt;
      if((state.v11BossWarning||0)<=0 && b.y>=128 && b.shotCD<=0){
        bossShoot(b); const base=b.v11Phase===1?1.18:b.v11Phase===2?.82:.56; b.shotCD=Math.max(.42,base-state.sector*.045);
      }
      if(b.hp<=0){
        addParticles(b.x,b.y,'#fff0a0',58,300); addParticles(b.x,b.y,'#ff69ca',42,260); state.shake=18; state.flash=.22; state.v11BossDefeat=1.35;
        state.score+=1200; state.bossKills++; state.progress=0; state.boss=null; state.bossActive=false; state.wave=1;
        state.sector=(state.sector+1)%ASSETS.planets.length; state.kills=0; showBanner(ASSETS.planets[state.sector].key,'planet'+state.sector); sfx('clear');
      }
    }

    state.bullets.forEach`);

    // Phase 2 timers join the existing V11 game-feel update.
    code=code.replace("state.v11Pulse=Math.max(0,(state.v11Pulse||0)-dt*2.8);",`state.v11Pulse=Math.max(0,(state.v11Pulse||0)-dt*2.8);
    state.v11BossWarning=Math.max(0,(state.v11BossWarning||0)-dt);
    state.v11BossPhaseBanner=Math.max(0,(state.v11BossPhaseBanner||0)-dt);
    state.v11BossDefeat=Math.max(0,(state.v11BossDefeat||0)-dt);`);

    // Extend the existing V11 canvas overlay with cinematic boss UI.
    code=code.replace("if(state.v11Pulse>0){\n      const a=Math.min(.20,state.v11Pulse*.9); ctx.fillStyle='rgba(101,232,255,'+a+')'; ctx.fillRect(0,0,W,H);\n    }",`if(state.boss){
      const b=state.boss, warn=state.v11BossWarning||0;
      if(warn>0){
        const pulse=.62+.38*Math.sin(state.time*10); ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillStyle='rgba(255,34,78,'+(0.05+pulse*.045)+')'; ctx.fillRect(0,0,W,H);
        ctx.shadowColor='#ff365c'; ctx.shadowBlur=25; ctx.fillStyle='rgba(255,225,232,'+(0.76+pulse*.22)+')';
        ctx.font='900 '+Math.min(42,Math.max(28,W*.055))+'px system-ui,sans-serif'; ctx.fillText('⚠ WARNING',W*.5,H*.36);
        ctx.shadowBlur=12; ctx.font='800 '+Math.min(20,Math.max(13,W*.026))+'px system-ui,sans-serif'; ctx.fillText(ASSETS.planets[state.sector].boss,W*.5,H*.405);
        ctx.font='600 10px system-ui,sans-serif'; ctx.fillStyle='rgba(255,210,220,.72)'; ctx.fillText('LARGE ENERGY SIGNATURE DETECTED',W*.5,H*.438);
      } else {
        const bw=Math.min(W*.66,560), bh=8, bx=(W-bw)/2, by=W<700?74:88;
        ctx.shadowBlur=0; ctx.textBaseline='alphabetic'; ctx.textAlign='left'; ctx.font='700 10px system-ui,sans-serif'; ctx.fillStyle='rgba(238,247,255,.75)'; ctx.fillText(ASSETS.planets[state.sector].boss,bx,by-8);
        ctx.textAlign='right'; ctx.fillText('PHASE '+(b.v11Phase||1),bx+bw,by-8);
        ctx.fillStyle='rgba(255,255,255,.10)'; ctx.fillRect(bx,by,bw,bh);
        const g=ctx.createLinearGradient(bx,0,bx+bw,0); g.addColorStop(0,'#ff4f7b'); g.addColorStop(.55,'#ff7fd8'); g.addColorStop(1,'#ffb85b'); ctx.fillStyle=g; ctx.fillRect(bx,by,bw*Math.max(0,b.hp/b.maxHp),bh);
      }
    }
    if(state.v11BossPhaseBanner>0&&state.boss){
      const a=Math.min(1,state.v11BossPhaseBanner/.24); ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.shadowColor='#ff77dc'; ctx.shadowBlur=26; ctx.fillStyle='rgba(255,245,255,'+a+')'; ctx.font='900 '+Math.min(54,Math.max(34,W*.07))+'px system-ui,sans-serif'; ctx.fillText('PHASE '+state.boss.v11Phase,W*.5,H*.48);
    }
    if(state.v11BossDefeat>0){
      const a=Math.min(1,state.v11BossDefeat/.28); ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.shadowColor='#70f5ff'; ctx.shadowBlur=28; ctx.fillStyle='rgba(235,255,255,'+a+')'; ctx.font='900 '+Math.min(44,Math.max(28,W*.055))+'px system-ui,sans-serif'; ctx.fillText('SECTOR CLEARED',W*.5,H*.48);
    }
    if(state.v11Pulse>0){
      const a=Math.min(.20,state.v11Pulse*.9); ctx.fillStyle='rgba(101,232,255,'+a+')'; ctx.fillRect(0,0,W,H);
    }`);

    return code;
  };
})();