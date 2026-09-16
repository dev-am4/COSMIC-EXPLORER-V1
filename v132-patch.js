(()=>{
  window.__V132_PATCH=(code)=>{
    code=code.split('?v=131').join('?v=132');

    code=code.replace("function spawnEnemy(){",`function v132Init(){
    if(state.v132BossMinionCD==null) state.v132BossMinionCD=4.8;
    if(state.v132ThreatPulse==null) state.v132ThreatPulse=0;
  }

  function v132ClassifyTactics(e){
    v132Init(); if(!e||e.v13Mini) return e;
    const slot=(e.formationSlot||0),sec=(state.sector||0),elite=e.v13Elite?1:0;
    const roll=(slot+sec*3+elite)%5;
    e.v132Role=roll===0?'flanker':roll===1?'kamikaze':roll===2?'shield':roll===3?'support':'hunter';
    e.v132AIT=0;e.v132DodgeCD=.2+Math.random()*.6;e.v132ActionCD=.9+Math.random()*1.4;e.v132BaseSpeed=e.speed;
    if(e.v132Role==='flanker'){e.speed*=1.10;e.v13Worth=Math.max(e.v13Worth||120,elite?330:180);}
    if(e.v132Role==='kamikaze'){e.speed*=1.16;e.v132Arming=1.25+Math.random()*.45;e.v13Worth=Math.max(e.v13Worth||120,elite?350:190);}
    if(e.v132Role==='shield'){e.v132ShieldMax=Math.max(20,Math.round(e.maxHp*.70));e.v132ShieldHP=e.v132ShieldMax;e.speed*=.88;e.v13Worth=Math.max(e.v13Worth||120,elite?390:210);}
    if(e.v132Role==='support'){e.hp*=1.22;e.maxHp=e.hp;e.speed*=.82;e.v132HealCD=1.4+Math.random();e.v13Worth=Math.max(e.v13Worth||120,elite?420:230);}
    return e;
  }

  function v132DamageTarget(t,dmg,color='#8ff7ff'){
    if(!t||dmg<=0)return 0;
    if(t.v132ShieldHP>0){
      const use=Math.min(t.v132ShieldHP,dmg);t.v132ShieldHP-=use;dmg-=use;
      addParticles(t.x,t.y,'#74bfff',4,80);state.v132ThreatPulse=.12;
    }
    if(dmg>0)t.hp-=dmg;
    return dmg;
  }

  function v132NearestBullet(e){
    let best=null,bd=1e18;for(const b of state.bullets){if(!b)continue;const dx=(b.x||0)-e.x,dy=(b.y||0)-e.y,d=dx*dx+dy*dy;if(d<bd){bd=d;best=b;}}
    return bd<125*125?best:null;
  }

  function v132Heal(e){
    let target=null,best=1e18;
    if(state.boss&&state.boss.hp>0&&state.boss.hp<state.boss.maxHp*.9){target=state.boss;best=0;}
    for(const a of state.enemies){if(a===e||!a||a.hp<=0||a.hp>=a.maxHp)continue;const d=(a.x-e.x)**2+(a.y-e.y)**2;if(d<best){best=d;target=a;}}
    if(target){const amount=Math.max(4,Math.round(target.maxHp*.045));target.hp=Math.min(target.maxHp,target.hp+amount);addParticles(target.x,target.y,'#72ffb5',7,80);state.v131Fx?.arcs?.push({pts:[{x:e.x,y:e.y},{x:target.x,y:target.y}],life:.20,max:.20,v132Heal:true});}
  }

  function v132EnemyAI(e,dt,p){
    v132Init();e.v132AIT=(e.v132AIT||0)+dt;e.v132DodgeCD=(e.v132DodgeCD||0)-dt;e.v132ActionCD=(e.v132ActionCD||0)-dt;
    if(e.y<e.targetY){e.y+=e.speed*dt;return;}
    const role=e.v132Role||'hunter',t=state.time+(e.formationSlot||0)*.31;
    const bullet=e.v132DodgeCD<=0?v132NearestBullet(e):null;
    if(bullet&&role!=='kamikaze'&&role!=='support'){
      const side=(bullet.x<e.x?1:-1);e.x+=side*(e.v13Elite?150:115)*dt;e.v132DodgeCD=.42+Math.random()*.38;
    }
    if(role==='flanker'){
      const flank=p.x<W*.5?W*.78:W*.22;e.x+=(flank-e.x)*Math.min(1,dt*1.8);e.y+=Math.sin(t*2.6)*14*dt;
      if(e.v132ActionCD<=0){e.v132ActionCD=1.8;e.x+=(p.x-e.x)*.10;}
    }else if(role==='kamikaze'){
      e.v132Arming=Math.max(0,(e.v132Arming||0)-dt);
      if(e.v132Arming>0){e.x+=(p.x-e.x)*dt*.65;e.y+=Math.sin(t*5)*8*dt;}
      else {const dx=p.x-e.x,dy=p.y-e.y,l=Math.max(1,Math.hypot(dx,dy));e.x+=dx/l*(e.speed*2.55)*dt;e.y+=dy/l*(e.speed*2.55)*dt;e.v132Charge=true;
        if(l<48){if(p.shield>0)p.shield=Math.max(0,p.shield-28);else p.hp-=22;addParticles(e.x,e.y,'#ff755d',26,220);state.shake=Math.max(state.shake,12);state.flash=Math.max(state.flash,.18);e.hp=0;updateHud();}}
    }else if(role==='support'){
      e.x=e.originX+Math.sin(t*.85)*42;e.y+=Math.cos(t*1.2)*5*dt;e.v132HealCD=(e.v132HealCD||0)-dt;if(e.v132HealCD<=0){v132Heal(e);e.v132HealCD=2.2+Math.random()*.8;}
    }else if(role==='shield'){
      e.x=e.originX+Math.sin(t*1.2)*28;e.y+=Math.cos(t*.9)*5*dt;if(e.v132ShieldHP<e.v132ShieldMax)e.v132ShieldHP=Math.min(e.v132ShieldMax,e.v132ShieldHP+dt*1.3);
    }else{
      const desired=p.x+(Math.sin(t*1.3)>0?1:-1)*Math.min(115,W*.15);e.x+=(desired-e.x)*Math.min(1,dt*.75);e.y+=Math.cos(t*1.4)*8*dt;
    }
    e.x=Math.max(48,Math.min(W-48,e.x));
  }

  function v132SpawnBossMinion(b){
    if(!b||state.enemies.length>=(W<700?4:6))return;
    const idx=Math.floor(Math.random()*ASSETS.enemies.length),side=Math.random()<.5?.22:.78,x=W*side;
    const hp=24+state.sector*8+(b.v11Phase||1)*6;
    const e={type:'enemy',imgKey:'enemy'+idx,x,y:-55,w:58,h:58,hp,maxHp:hp,speed:88+state.sector*9,shotCD:.8+Math.random(),strafe:side<.5?-1:1,targetY:135+Math.random()*70,phase:Math.random()*6.28,formation:1,formationSlot:(state.v11SpawnSlot||0)+1,originX:x,v13Elite:true,v13Worth:300};
    e.v131Type=(b.v11Phase||1)>=3?'striker':'tank';v132ClassifyTactics(e);e.v132Role=(b.v11Phase||1)>=3?'kamikaze':(Math.random()<.5?'support':'flanker');state.enemies.push(e);state.v132ThreatPulse=.28;
  }

  function v132BossAI(dt){
    v132Init();state.v132BossMinionCD-=dt;if(state.boss&&(state.boss.v11Phase||1)>=2&&state.v132BossMinionCD<=0){v132SpawnBossMinion(state.boss);state.v132BossMinionCD=(state.boss.v11Phase||1)>=3?3.2:4.5;}
    state.v132ThreatPulse=Math.max(0,(state.v132ThreatPulse||0)-dt);
  }

  function drawV132Fx(){
    if(!playing)return;ctx.save();
    for(const e of state.enemies){if(!e||e.hp<=0)continue;const r=Math.max(e.w,e.h)*.54;
      if(e.v132Role==='kamikaze'&&(e.v132Arming||0)>0){const a=.35+.35*Math.sin((state.time||0)*12);ctx.strokeStyle='rgba(255,90,75,'+a+')';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(e.x,e.y,r+10,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(e.x-18,e.y+r+18);ctx.lineTo(e.x+18,e.y+r+18);ctx.stroke();}
      if(e.v132Role==='shield'&&e.v132ShieldHP>0){ctx.shadowColor='#65aaff';ctx.shadowBlur=15;ctx.strokeStyle='rgba(105,175,255,.62)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(e.x,e.y,r+7,0,Math.PI*2);ctx.stroke();}
      if(e.v132Role==='support'){ctx.shadowColor='#6dffad';ctx.shadowBlur=13;ctx.strokeStyle='rgba(109,255,173,.52)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,r+5,0,Math.PI*2);ctx.stroke();ctx.fillStyle='rgba(150,255,195,.9)';ctx.font='900 8px system-ui,sans-serif';ctx.textAlign='center';ctx.fillText('+',e.x,e.y+3);}
      if(e.v132Role==='flanker'){ctx.strokeStyle='rgba(255,202,92,.42)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,r+4,-1.2,1.2);ctx.stroke();}
    }
    if(state.v132ThreatPulse>0){ctx.fillStyle='rgba(255,90,80,'+Math.min(.10,state.v132ThreatPulse*.25)+')';ctx.fillRect(0,0,W,H);}
    ctx.restore();
  }

  function spawnEnemy(){`);

    code=code.replace("v13MutateEnemy(e); v131ClassifyEnemy(e); state.enemies.push(e);","v13MutateEnemy(e); v131ClassifyEnemy(e); v132ClassifyTactics(e); state.enemies.push(e);");

    code=code.replace(`if(e.y < e.targetY) e.y += e.speed*dt; else {
      const fm=e.formation||0, t=state.time+(e.formationSlot||0)*.38;
      if(fm===0) e.x=e.originX+Math.sin(t*1.9)*22;
      else if(fm===1) e.x=e.originX+Math.sin(t*3.1)*34;
      else if(fm===2) e.x=e.originX+Math.sin(t*2.35)*Math.min(72,W*.12);
      else e.x=e.originX+Math.sin(t*1.35)*46;
      e.y += Math.cos(t*1.2)*7*dt;
    }`,`v132EnemyAI(e,dt,p);`);

    code=code.replace("e.hp -= b.damage || 10; hit=true;",`const v132d=b.damage||10;v132DamageTarget(e,v132d,b.color||'#8ff7ff');hit=true;`);
    code=code.replace("const dmg=8+mods.laser*5;t.hp-=dmg;",`const dmg=8+mods.laser*5;v132DamageTarget(t,dmg,'#73efff');`);
    code=code.replace("used.push(t);t.hp-=6+mods.arc*3;",`used.push(t);v132DamageTarget(t,6+mods.arc*3,'#d78cff');`);

    code=code.replace("state.v131Fx.arcs.forEach(f=>f.life-=dt);state.v131Fx.arcs=state.v131Fx.arcs.filter(f=>f.life>0);",`state.v131Fx.arcs.forEach(f=>f.life-=dt);state.v131Fx.arcs=state.v131Fx.arcs.filter(f=>f.life>0);v132BossAI(dt);`);

    code=code.replace("drawV11Phase3Fx(); drawV13Fx(); drawV131Fx();","drawV11Phase3Fx(); drawV13Fx(); drawV131Fx(); drawV132Fx();");

    code=code.replace("state.v131Modules={laser:0,arc:0,missile:0};state.v131Fx={beams:[],arcs:[]};state.v131LaserCD=0;state.v131ArcCD=0;state.v131MissileCD=0;",`state.v131Modules={laser:0,arc:0,missile:0};state.v131Fx={beams:[],arcs:[]};state.v131LaserCD=0;state.v131ArcCD=0;state.v131MissileCD=0;state.v132BossMinionCD=4.8;state.v132ThreatPulse=0;`);

    code=code.replace("laserLevel:state.v131Modules?.laser||0,arcLevel:state.v131Modules?.arc||0,missileLevel:state.v131Modules?.missile||0,",`laserLevel:state.v131Modules?.laser||0,arcLevel:state.v131Modules?.arc||0,missileLevel:state.v131Modules?.missile||0,
        flankers:state.enemies?state.enemies.filter(e=>e.v132Role==='flanker').length:0,kamikaze:state.enemies?state.enemies.filter(e=>e.v132Role==='kamikaze').length:0,
        shieldEnemies:state.enemies?state.enemies.filter(e=>e.v132Role==='shield'&&e.v132ShieldHP>0).length:0,supportEnemies:state.enemies?state.enemies.filter(e=>e.v132Role==='support').length:0,`);

    return code;
  };

  const previous=window.__V11_PHASE2_PATCH;
  if(typeof previous==='function'&&!previous.__v132Wrapped){
    const wrapped=(code)=>window.__V132_PATCH(previous(code));
    wrapped.__v132Wrapped=true;
    window.__V11_PHASE2_PATCH=wrapped;
  }
})();