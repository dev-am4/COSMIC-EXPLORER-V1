(()=>{
  window.__V13_PATCH=(code)=>{
    code=code.split('?v=123').join('?v=130');

    // V13 gameplay layer: weapon evolution, drone, shield core, elite enemies, mini bosses and ultimate.
    code=code.replace("function spawnEnemy(){",`function v13Init(){
    if(state.v13WeaponLevel==null) state.v13WeaponLevel=1;
    if(state.v13Drone==null) state.v13Drone=false;
    if(state.v13DroneLevel==null) state.v13DroneLevel=0;
    if(state.v13ShieldLevel==null) state.v13ShieldLevel=0;
    if(state.v13UltimateCharge==null) state.v13UltimateCharge=0;
    if(state.v13WeaponCD==null) state.v13WeaponCD=0;
    if(state.v13DroneCD==null) state.v13DroneCD=0;
    if(state.v13UltimateFx==null) state.v13UltimateFx=0;
    if(state.v13LastTotalKills==null) state.v13LastTotalKills=state.v11TotalKills||0;
    if(state.v13LastBossKills==null) state.v13LastBossKills=state.bossKills||0;
  }

  function v13PlayerBullet(x,y,vx,vy,damage,color,w=7,h=18){
    state.bullets.push({x,y,vx,vy,w,h,damage,dmg:damage,color,type:'player',v13:true});
  }

  function v13MutateEnemy(e){
    v13Init();
    const sec=state.sector||0;
    if((state.kills||0)>=8 && state.v13MiniSector!==sec && !state.bossActive){
      state.v13MiniSector=sec; e.v13Mini=true; e.v13Elite=true;
      e.hp*=5.4; e.maxHp=e.hp; e.w=Math.max(92,e.w*1.62); e.h=Math.max(92,e.h*1.62);
      e.speed*=.72; e.shotCD=Math.min(e.shotCD,.62); e.targetY=Math.max(132,e.targetY||132); e.v13Worth=650;
      state.v13MiniFlash=1.25;
    } else if(Math.random()<(.17+sec*.025)){
      e.v13Elite=true; e.hp*=1.9; e.maxHp=e.hp; e.w*=1.16; e.h*=1.16; e.speed*=1.08; e.shotCD*=.74; e.v13Worth=240;
    }
    return e;
  }

  function v13ApplyUpgrade(kind){
    v13Init(); const p=state.player;
    if(kind==='weapon'){
      if(state.v13WeaponLevel<3) state.v13WeaponLevel++;
      else state.v13UltimateCharge=Math.min(100,state.v13UltimateCharge+45);
      state.flash=Math.max(state.flash,.16); state.shake=Math.max(state.shake,6); sfx('pickup');
    } else if(kind==='drone'){
      state.v13Drone=true; state.v13DroneLevel=Math.min(2,(state.v13DroneLevel||0)+1);
      state.v13UltimateCharge=Math.min(100,state.v13UltimateCharge+15); sfx('pickup');
    } else if(kind==='shield'){
      state.v13ShieldLevel=Math.min(3,(state.v13ShieldLevel||0)+1);
      if(p){ p.maxHp+=8; p.hp=Math.min(p.maxHp,p.hp+24); p.shield=Math.max(p.shield||0,28+state.v13ShieldLevel*24); }
      sfx('repair');
    } else if(kind==='ultimate'){
      state.v13UltimateCharge=Math.min(100,state.v13UltimateCharge+60); sfx('pickup');
    }
    return {weapon:state.v13WeaponLevel,drone:state.v13DroneLevel,shield:state.v13ShieldLevel,ultimate:state.v13UltimateCharge};
  }

  function v13Ultimate(){
    v13Init(); if(!playing||state.v12Paused||state.v13UltimateCharge<100) return false;
    state.v13UltimateCharge=0; state.v13UltimateFx=1.05; state.enemyBullets=[];
    const wiped=state.enemies.length;
    state.enemies.forEach(e=>addParticles(e.x,e.y,e.v13Mini?'#ffe47c':'#7df6ff',e.v13Mini?34:18,e.v13Mini?280:210));
    state.enemies=[]; state.kills+=wiped; state.score+=wiped*140;
    if(state.boss){ state.boss.hp=Math.max(1,state.boss.hp-state.boss.maxHp*.24); addParticles(state.boss.x,state.boss.y,'#ffffff',42,320); }
    state.flash=Math.max(state.flash,.48); state.shake=Math.max(state.shake,24); sfx('clear');
    return true;
  }

  function v13Update(dt,p){
    v13Init(); if(!p) return;
    const total=state.v11TotalKills||0;
    if(total>state.v13LastTotalKills){ state.v13UltimateCharge=Math.min(100,state.v13UltimateCharge+(total-state.v13LastTotalKills)*8); }
    state.v13LastTotalKills=total;
    const bk=state.bossKills||0;
    if(bk>state.v13LastBossKills){ state.v13UltimateCharge=Math.min(100,state.v13UltimateCharge+(bk-state.v13LastBossKills)*28); }
    state.v13LastBossKills=bk;

    state.v13WeaponCD-=dt;
    if(state.v13WeaponLevel>=2 && state.v13WeaponCD<=0){
      const y=p.y-p.h*.34, dmg=4+state.v13WeaponLevel*2;
      v13PlayerBullet(p.x-14,y,-72,-500,dmg,'#78efff'); v13PlayerBullet(p.x+14,y,72,-500,dmg,'#78efff');
      if(state.v13WeaponLevel>=3){ v13PlayerBullet(p.x-24,y, -130,-470,dmg+1,'#ff7fe2',6,16); v13PlayerBullet(p.x+24,y,130,-470,dmg+1,'#ff7fe2',6,16); }
      state.v13WeaponCD=state.v13WeaponLevel>=3?.23:.32;
    }

    state.v13DroneCD-=dt;
    if(state.v13Drone && state.v13DroneCD<=0){
      const t=state.time||0, r=34+(state.v13DroneLevel||1)*5;
      for(let i=0;i<(state.v13DroneLevel>=2?2:1);i++){
        const a=t*2.6+i*Math.PI, x=p.x+Math.cos(a)*r, y=p.y+Math.sin(a)*18;
        let target=null,best=1e9; const pool=state.boss?[state.boss,...state.enemies]:state.enemies;
        for(const e of pool){if(!e)continue;const dx=e.x-x,dy=e.y-y,d=dx*dx+dy*dy;if(d<best){best=d;target=e;}}
        let vx=0,vy=-540;if(target){const dx=target.x-x,dy=target.y-y,len=Math.max(1,Math.hypot(dx,dy));vx=dx/len*520;vy=dy/len*520;}
        v13PlayerBullet(x,y,vx,vy,7+(state.v13DroneLevel||1)*2,'#ffd86f',6,15);
      }
      state.v13DroneCD=state.v13DroneLevel>=2?.30:.42;
    }

    if(state.v13ShieldLevel>0){
      const cap=28+state.v13ShieldLevel*24; p.shield=Math.min(cap,(p.shield||0)+dt*(2.2+state.v13ShieldLevel*1.4));
    }
    state.v13UltimateFx=Math.max(0,(state.v13UltimateFx||0)-dt);
    state.v13MiniFlash=Math.max(0,(state.v13MiniFlash||0)-dt);
  }

  function drawV13Fx(){
    if(!playing||!state.player) return;
    const p=state.player; ctx.save();
    if(state.v13Drone){
      const t=state.time||0,r=34+(state.v13DroneLevel||1)*5,count=state.v13DroneLevel>=2?2:1;
      ctx.globalCompositeOperation='lighter';
      for(let i=0;i<count;i++){const a=t*2.6+i*Math.PI,x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*18;ctx.shadowColor='#ffd86f';ctx.shadowBlur=16;ctx.fillStyle='#fff2a8';ctx.beginPath();ctx.arc(x,y,5.5,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(255,216,111,.45)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,10,0,Math.PI*2);ctx.stroke();}
    }
    for(const e of state.enemies){if(!e.v13Elite)continue;ctx.shadowBlur=e.v13Mini?24:14;ctx.shadowColor=e.v13Mini?'#ffb64a':'#b46cff';ctx.strokeStyle=e.v13Mini?'rgba(255,190,80,.78)':'rgba(190,115,255,.48)';ctx.lineWidth=e.v13Mini?4:2;ctx.beginPath();ctx.arc(e.x,e.y,Math.max(e.w,e.h)*.48+(e.v13Mini?8:3),0,Math.PI*2);ctx.stroke();if(e.v13Mini){ctx.textAlign='center';ctx.fillStyle='rgba(255,232,175,.9)';ctx.font='900 9px system-ui,sans-serif';ctx.fillText('MINI BOSS',e.x,e.y-e.h*.60);}}
    if(state.v13UltimateFx>0){const a=Math.min(1,state.v13UltimateFx/.22);ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(p.x,p.y,20,p.x,p.y,Math.max(W,H)*.75);g.addColorStop(0,'rgba(255,255,255,'+(.28*a)+')');g.addColorStop(.18,'rgba(99,235,255,'+(.22*a)+')');g.addColorStop(.5,'rgba(150,70,255,'+(.12*a)+')');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);for(let i=0;i<18;i++){const ang=(Math.PI*2/18)*i+(1-state.v13UltimateFx)*.5;ctx.strokeStyle='rgba(180,245,255,'+(.28*a)+')';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x+Math.cos(ang)*24,p.y+Math.sin(ang)*24);ctx.lineTo(p.x+Math.cos(ang)*Math.max(W,H),p.y+Math.sin(ang)*Math.max(W,H));ctx.stroke();}}
    if(state.v13MiniFlash>0){const a=Math.min(.20,state.v13MiniFlash*.18);ctx.fillStyle='rgba(255,150,45,'+a+')';ctx.fillRect(0,0,W,H);}
    ctx.restore();
  }

  function spawnEnemy(){`);

    code=code.replace("state.enemies.push(e);","v13MutateEnemy(e); state.enemies.push(e);");

    code=code.replace(/function update\(dt\)\{\s*if\(!playing\) return;\s*if\(state\.v12Paused\) return;\s*const p = state\.player;/,`function update(dt){
    if(!playing) return;
    if(state.v12Paused) return;
    const p = state.player;
    v13Update(dt,p);`);

    code=code.replace("drawV11Phase3Fx();","drawV11Phase3Fx(); drawV13Fx();");

    code=code.replace("state.v11DeathX=null; state.v11DeathY=null;",`state.v11DeathX=null; state.v11DeathY=null;
    state.v13WeaponLevel=1; state.v13Drone=false; state.v13DroneLevel=0; state.v13ShieldLevel=0; state.v13UltimateCharge=0; state.v13WeaponCD=0; state.v13DroneCD=0; state.v13UltimateFx=0; state.v13LastTotalKills=0; state.v13LastBossKills=0; state.v13MiniSector=-1;`);

    code=code.replace("window.__COSMIC_V12={",`window.__COSMIC_V12={
      v13Upgrade:(kind)=>v13ApplyUpgrade(kind),
      v13Ultimate:()=>v13Ultimate(),`);

    code=code.replace("status:()=>({",`status:()=>({
        weaponLevel:state.v13WeaponLevel||1,drone:!!state.v13Drone,droneLevel:state.v13DroneLevel||0,shieldLevel:state.v13ShieldLevel||0,
        shield:state.player?(state.player.shield||0):0,ultimateCharge:Math.round(state.v13UltimateCharge||0),
        eliteCount:state.enemies?state.enemies.filter(e=>e.v13Elite).length:0,miniActive:!!(state.enemies&&state.enemies.some(e=>e.v13Mini)),`);

    return code;
  };

  const previous=window.__V11_PHASE2_PATCH;
  if(typeof previous==='function'&&!previous.__v13Wrapped){
    const wrapped=(code)=>window.__V13_PATCH(previous(code));
    wrapped.__v13Wrapped=true;
    window.__V11_PHASE2_PATCH=wrapped;
  }
})();