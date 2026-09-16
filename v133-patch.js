(()=>{
  window.__V133_PATCH=(code)=>{
    code=code.split('?v=132').join('?v=133');

    code=code.replace("function spawnEnemy(){",`function v133Init(){
    if(!state.v133Orbital) state.v133Orbital=[];
    if(!state.v133Heat) state.v133Heat=[];
    if(state.v133BossSector==null) state.v133BossSector=-1;
    if(state.v133LastPhase==null) state.v133LastPhase=0;
    if(state.v133MechanicCD==null) state.v133MechanicCD=.8;
    if(state.v133MoonPulse==null) state.v133MoonPulse=0;
    if(state.v133VoidPulse==null) state.v133VoidPulse=0;
    if(state.v133PhaseFx==null) state.v133PhaseFx=0;
  }

  function v133HitPlayer(amount,color='#ff6a72'){
    const p=state.player;if(!p||amount<=0)return;
    if((p.shield||0)>0){const use=Math.min(p.shield,amount);p.shield-=use;amount-=use;}
    if(amount>0)p.hp=Math.max(0,p.hp-amount);
    addParticles(p.x,p.y,color,12,150);state.flash=Math.max(state.flash,.14);state.shake=Math.max(state.shake,8);updateHud();
  }

  function v133ResetBossMechanics(sec,ph){
    state.v133BossSector=sec;state.v133LastPhase=ph;state.v133Orbital=[];state.v133Heat=[];state.v133MoonPulse=0;state.v133VoidPulse=0;state.v133MechanicCD=.75;state.v133PhaseFx=.55;
  }

  function v133BossMechanics(dt){
    v133Init();const b=state.boss,p=state.player;
    state.v133PhaseFx=Math.max(0,(state.v133PhaseFx||0)-dt);
    if(!b||!p){state.v133BossSector=-1;state.v133Orbital=[];state.v133Heat=[];state.v133MoonPulse=0;state.v133VoidPulse=0;return;}
    const sec=state.sector||0,ph=b.v11Phase||1;
    if(state.v133BossSector!==sec){v133ResetBossMechanics(sec,ph);}
    if(state.v133LastPhase!==ph){state.v133LastPhase=ph;state.v133MechanicCD=.35;state.v133PhaseFx=.85;state.shake=Math.max(state.shake,9+ph*2);}
    if((state.v11BossWarning||0)>0||b.y<125)return;

    state.v133MechanicCD-=dt;

    if(sec===0){
      state.v133Orbital.forEach(z=>{z.t-=dt;if(z.t<=.30&&!z.hit&&Math.abs(p.x-z.x)<z.w*.58){z.hit=true;v133HitPlayer(11+ph*2,'#9feaff');}});
      state.v133Orbital=state.v133Orbital.filter(z=>z.t>0);
      if(state.v133MechanicCD<=0){
        const count=ph>=3?2:1,margin=Math.min(90,W*.15);
        for(let i=0;i<count;i++){let x=margin+Math.random()*Math.max(1,W-margin*2);if(i&&Math.abs(x-state.v133Orbital[0]?.x)<85)x=x<W*.5?Math.min(W-margin,x+110):Math.max(margin,x-110);state.v133Orbital.push({x,w:50+ph*7,t:1.36,hit:false});}
        state.v133MechanicCD=Math.max(1.75,3.65-ph*.48);
      }
    }else if(sec===1){
      state.v133MoonPulse=Math.max(0,(state.v133MoonPulse||0)-dt);
      if(state.v133MechanicCD<=0){state.v133MoonPulse=1.68;state.v133MechanicCD=Math.max(2.3,4.65-ph*.52);state.shake=Math.max(state.shake,4);}
      if(state.v133MoonPulse>0&&state.v133MoonPulse<.82){
        const dx=b.x-p.x,dy=(b.y+30)-p.y,l=Math.max(1,Math.hypot(dx,dy));let pull=(32+ph*16)*(p.boosting ? .56 : 1);const pulse=1+Math.sin((1.68-state.v133MoonPulse)*Math.PI*5)*.18;pull*=pulse;p.x+=dx/l*pull*dt;p.y+=dy/l*pull*.58*dt;
        const mx=W<700?42:50,mb=W<700?112:72;p.x=Math.max(mx,Math.min(W-mx,p.x));p.y=Math.max(88,Math.min(H-mb,p.y));
      }
    }else if(sec===2){
      for(const z of state.v133Heat){z.t-=dt;z.hitCD=Math.max(0,(z.hitCD||0)-dt);if(z.t<.98){const d=Math.hypot(p.x-z.x,p.y-z.y);if(d<z.r&&z.hitCD<=0){z.hitCD=.48;v133HitPlayer(5+ph*2,'#ff9a55');}}}
      state.v133Heat=state.v133Heat.filter(z=>z.t>0);
      if(state.v133MechanicCD<=0){
        const count=ph>=3?2:1;
        for(let i=0;i<count;i++){const ox=i?((Math.random()<.5?-1:1)*(70+Math.random()*50)):0,oy=i?-40:0;state.v133Heat.push({x:Math.max(72,Math.min(W-72,p.x+ox)),y:Math.max(180,Math.min(H-110,p.y+oy)),r:68+ph*8,t:2.22,hitCD:0});}
        state.v133MechanicCD=Math.max(1.9,3.85-ph*.45);
      }
    }else{
      state.v133VoidPulse=Math.max(0,(state.v133VoidPulse||0)-dt);
      if(state.v133MechanicCD<=0){state.v133VoidPulse=1.18;state.v133MechanicCD=Math.max(2.4,4.45-ph*.46);state.shake=Math.max(state.shake,5);}
      const dx=b.x-p.x,dy=(b.y+38)-p.y,l=Math.max(1,Math.hypot(dx,dy));let pull=(10+ph*7)*(p.boosting ? .52 : 1);if(state.v133VoidPulse>0&&state.v133VoidPulse<.72)pull*=2.35;p.x+=dx/l*pull*dt;p.y+=dy/l*pull*.52*dt;
      const mx=W<700?42:50,mb=W<700?112:72;p.x=Math.max(mx,Math.min(W-mx,p.x));p.y=Math.max(88,Math.min(H-mb,p.y));
    }
  }

  function drawV133Fx(){
    if(!playing)return;v133Init();ctx.save();const sec=state.sector||0,b=state.boss;
    if(sec===0){
      for(const z of state.v133Orbital){const tele=z.t>.30,a=tele?Math.min(.46,(1.36-z.t)*.34+.12):.86;ctx.save();ctx.globalCompositeOperation='lighter';if(tele){ctx.fillStyle='rgba(90,205,255,'+(a*.12)+')';ctx.fillRect(z.x-z.w*.5,0,z.w,H);ctx.strokeStyle='rgba(160,238,255,'+a+')';ctx.lineWidth=1.5;ctx.setLineDash([10,9]);ctx.beginPath();ctx.moveTo(z.x,0);ctx.lineTo(z.x,H);ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle='rgba(220,250,255,'+(a*.7)+')';ctx.beginPath();ctx.arc(z.x,H*.78,18+(1.36-z.t)*9,0,Math.PI*2);ctx.stroke();}else{const g=ctx.createLinearGradient(z.x-z.w,0,z.x+z.w,0);g.addColorStop(0,'rgba(80,210,255,0)');g.addColorStop(.45,'rgba(190,250,255,.42)');g.addColorStop(.5,'rgba(255,255,255,.95)');g.addColorStop(.55,'rgba(190,250,255,.42)');g.addColorStop(1,'rgba(80,210,255,0)');ctx.fillStyle=g;ctx.shadowColor='#8cecff';ctx.shadowBlur=28;ctx.fillRect(z.x-z.w,0,z.w*2,H);}ctx.restore();}
    }else if(sec===1&&state.v133MoonPulse>0&&b){
      const prog=1-state.v133MoonPulse/1.68,r=55+prog*Math.max(W,H)*.72,a=state.v133MoonPulse<.82?.62:.32;ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(205,230,255,'+a+')';ctx.lineWidth=state.v133MoonPulse<.82?4:2;ctx.shadowColor='#d7edff';ctx.shadowBlur=18;ctx.beginPath();ctx.arc(b.x,b.y,r,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='rgba(130,180,255,'+(a*.45)+')';ctx.lineWidth=9;ctx.beginPath();ctx.arc(b.x,b.y,r+14,0,Math.PI*2);ctx.stroke();
    }else if(sec===2){
      for(const z of state.v133Heat){const active=z.t<.98,pulse=.75+.25*Math.sin((state.time||0)*10);ctx.save();if(active){const g=ctx.createRadialGradient(z.x,z.y,5,z.x,z.y,z.r);g.addColorStop(0,'rgba(255,220,105,'+(.15*pulse)+')');g.addColorStop(.55,'rgba(255,95,45,.13)');g.addColorStop(1,'rgba(255,70,35,0)');ctx.fillStyle=g;ctx.fillRect(z.x-z.r,z.y-z.r,z.r*2,z.r*2);ctx.strokeStyle='rgba(255,125,65,'+(.65*pulse)+')';ctx.lineWidth=3;}else{ctx.strokeStyle='rgba(255,184,95,.48)';ctx.lineWidth=2;ctx.setLineDash([8,7]);}ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
    }else if(sec===3&&b){
      const pulse=state.v133VoidPulse||0,t=state.time||0;ctx.globalCompositeOperation='lighter';for(let i=0;i<4;i++){ctx.strokeStyle='rgba('+(150+i*18)+','+(75+i*8)+',255,'+(.12+i*.025+(pulse>0?.08:0))+')';ctx.lineWidth=1.5+i*.7;ctx.beginPath();ctx.ellipse(b.x,b.y+18,70+i*24,18+i*7,t*.12+i*.18,0,Math.PI*2);ctx.stroke();}if(pulse>0){const prog=1-pulse/1.18,r=55+prog*Math.max(W,H)*.48;ctx.strokeStyle='rgba(205,150,255,'+(.22+prog*.28)+')';ctx.lineWidth=3;ctx.beginPath();ctx.arc(b.x,b.y,r,0,Math.PI*2);ctx.stroke();}
    }
    if(state.v133PhaseFx>0){const cols=['90,220,255','205,230,255','255,112,55','176,92,255'],a=Math.min(.14,state.v133PhaseFx*.18);ctx.fillStyle='rgba('+cols[sec]+','+a+')';ctx.fillRect(0,0,W,H);}
    ctx.restore();
  }

  function spawnEnemy(){`);

    code=code.replace("state.v132ThreatPulse=Math.max(0,(state.v132ThreatPulse||0)-dt);",`state.v132ThreatPulse=Math.max(0,(state.v132ThreatPulse||0)-dt);v133BossMechanics(dt);`);

    code=code.replace("const push=(ang,spd=175,dmg=8,size=16,ox=0,oy=18)=>state.enemyBullets.push({x:b.x+ox,y:b.y+oy,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd,w:size,h:size,damage:dmg,color:col});",`const push=(ang,spd=175,dmg=8,size=16,ox=0,oy=18)=>state.enemyBullets.push({x:b.x+ox,y:b.y+oy,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd,w:size,h:size,damage:dmg,color:col,v133Curve:sec===3,v133CurveSign:sec===3?(Math.random()<.5?-1:1):0});`);

    code=code.replace("state.enemyBullets.forEach(b=>{ b.x += b.vx*dt; b.y += b.vy*dt; });",`state.enemyBullets.forEach(b=>{if(b.v133Curve&&state.sector===3){const sp=Math.max(1,Math.hypot(b.vx,b.vy)),rot=(b.v133CurveSign||1)*(.18+.055*(state.boss?.v11Phase||1))*dt,a=Math.atan2(b.vy,b.vx)+rot;b.vx=Math.cos(a)*sp;b.vy=Math.sin(a)*sp;}b.x+=(b.vx||0)*dt;b.y+=(b.vy||0)*dt;});`);

    code=code.replace("drawV11Phase3Fx(); drawV13Fx(); drawV131Fx(); drawV132Fx();","drawV11Phase3Fx(); drawV13Fx(); drawV131Fx(); drawV132Fx(); drawV133Fx();");

    code=code.replace("state.v132BossMinionCD=4.8;state.v132ThreatPulse=0;",`state.v132BossMinionCD=4.8;state.v132ThreatPulse=0;state.v133BossSector=-1;state.v133LastPhase=0;state.v133MechanicCD=.8;state.v133Orbital=[];state.v133Heat=[];state.v133MoonPulse=0;state.v133VoidPulse=0;state.v133PhaseFx=0;`);

    code=code.replace("shieldEnemies:state.enemies?state.enemies.filter(e=>e.v132Role==='shield'&&e.v132ShieldHP>0).length:0,supportEnemies:state.enemies?state.enemies.filter(e=>e.v132Role==='support').length:0,",`shieldEnemies:state.enemies?state.enemies.filter(e=>e.v132Role==='shield'&&e.v132ShieldHP>0).length:0,supportEnemies:state.enemies?state.enemies.filter(e=>e.v132Role==='support').length:0,
        bossPhase:state.boss?.v11Phase||0,bossSignature:state.bossActive?(['ORBITAL CANNON','GRAVITY PULSE','HEAT ZONE','EVENT HORIZON'][state.sector]||'UNKNOWN'):'',
        orbitalHazards:state.v133Orbital?.length||0,heatHazards:state.v133Heat?.length||0,moonPulse:state.v133MoonPulse||0,voidPulse:state.v133VoidPulse||0,`);

    return code;
  };

  const previous=window.__V11_PHASE2_PATCH;
  if(typeof previous==='function'&&!previous.__v133Wrapped){
    const wrapped=(code)=>window.__V133_PATCH(previous(code));
    wrapped.__v133Wrapped=true;
    window.__V11_PHASE2_PATCH=wrapped;
  }
})();