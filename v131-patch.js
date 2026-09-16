(()=>{
  window.__V131_PATCH=(code)=>{
    code=code.split('?v=130').join('?v=131');

    code=code.replace("function spawnEnemy(){",`function v131Init(){
    if(!state.v131Modules) state.v131Modules={laser:0,arc:0,missile:0};
    if(!state.v131Fx) state.v131Fx={beams:[],arcs:[]};
    if(state.v131LaserCD==null) state.v131LaserCD=0;
    if(state.v131ArcCD==null) state.v131ArcCD=0;
    if(state.v131MissileCD==null) state.v131MissileCD=0;
  }

  function v131Targets(){
    const out=[]; if(state.boss&&state.boss.hp>0) out.push(state.boss);
    for(const e of state.enemies){ if(e&&e.hp>0) out.push(e); }
    return out;
  }

  function v131Nearest(x,y,exclude=[]){
    let best=null,bd=1e18; for(const e of v131Targets()){
      if(exclude.includes(e)) continue;
      const dx=e.x-x,dy=e.y-y,d=dx*dx+dy*dy; if(d<bd){bd=d;best=e;}
    } return best;
  }

  function v131ClassifyEnemy(e){
    if(!e||!e.v13Elite) return e;
    if(e.v13Mini){e.v131Type='mini';e.v131Pattern=0;return e;}
    const roll=((e.formationSlot||0)+(state.sector||0)*2)%3;
    e.v131Type=roll===0?'striker':roll===1?'sniper':'tank';
    if(e.v131Type==='striker'){e.speed*=1.24;e.shotCD=Math.min(e.shotCD,.72);e.v13Worth=Math.max(e.v13Worth||0,260);}
    if(e.v131Type==='sniper'){e.speed*=.82;e.shotCD=Math.min(e.shotCD,.95);e.targetY=Math.max(106,Math.min(190,e.targetY||140));e.v13Worth=Math.max(e.v13Worth||0,280);}
    if(e.v131Type==='tank'){e.hp*=1.42;e.maxHp=e.hp;e.speed*=.76;e.w*=1.10;e.h*=1.10;e.shotCD*=1.08;e.v13Worth=Math.max(e.v13Worth||0,320);}
    return e;
  }

  function v131EnemyBullet(x,y,ang,speed,damage,color,size=14){
    state.enemyBullets.push({x,y,vx:Math.cos(ang)*speed,vy:Math.sin(ang)*speed,w:size,h:size,damage,color});
  }

  function v131EliteShoot(e){
    const p=state.player;if(!p)return;const aim=Math.atan2(p.y-e.y,p.x-e.x);
    if(e.v131Type==='sniper'){
      v131EnemyBullet(e.x,e.y,aim,285,12,'#ff78b7',12);
      state.flash=Math.max(state.flash,.035);
    }else if(e.v131Type==='striker'){
      for(let i=-1;i<=1;i++)v131EnemyBullet(e.x,e.y,aim+i*.17,235,8,'#ffb24c',13);
    }else if(e.v131Type==='tank'){
      for(let i=-2;i<=2;i++)v131EnemyBullet(e.x,e.y,Math.PI/2+i*.22,175,9,'#b46cff',16);
    }else enemyShoot(e);
  }

  function v131MiniShoot(e){
    const p=state.player;if(!p)return;const aim=Math.atan2(p.y-e.y,p.x-e.x),pat=(e.v131Pattern=(e.v131Pattern||0)+1)%3;
    if(pat===0){for(let i=-3;i<=3;i++)v131EnemyBullet(e.x,e.y,aim+i*.15,220,9,'#ffcf65',15);}
    else if(pat===1){for(let i=-4;i<=4;i++)v131EnemyBullet(e.x,e.y,Math.PI/2+i*.18,190+Math.abs(i)*7,9,'#ff7b63',15);}
    else {for(let i=0;i<10;i++){const a=(Math.PI*2/10)*i+(state.time||0)*.3;v131EnemyBullet(e.x,e.y,a,155,8,'#c783ff',14);}v131EnemyBullet(e.x,e.y,aim,290,12,'#ffffff',12);}
    state.shake=Math.max(state.shake,4.5);
  }

  function v131Specialize(kind){
    v131Init(); const map={weapon:'laser',drone:'arc',shield:'missile'},k=map[kind]||kind;
    if(!(k in state.v131Modules))return null;
    state.v131Modules[k]=Math.min(3,(state.v131Modules[k]||0)+1);
    state.flash=Math.max(state.flash,.15);state.shake=Math.max(state.shake,5);sfx('pickup');
    return {...state.v131Modules};
  }

  function v131Update(dt,p){
    v131Init();if(!p)return;
    state.v131LaserCD-=dt;state.v131ArcCD-=dt;state.v131MissileCD-=dt;
    const mods=state.v131Modules;

    if(mods.laser>0&&state.v131LaserCD<=0){
      const t=v131Nearest(p.x,p.y);if(t){
        const dmg=8+mods.laser*5;t.hp-=dmg;addParticles(t.x,t.y,'#73efff',4+mods.laser*2,85);
        state.v131Fx.beams.push({x1:p.x,y1:p.y-p.h*.36,x2:t.x,y2:t.y,life:.10+.035*mods.laser,max:.10+.035*mods.laser});
      }
      state.v131LaserCD=Math.max(.28,.64-mods.laser*.11);
    }

    if(mods.arc>0&&state.v131ArcCD<=0){
      const pts=[{x:p.x,y:p.y-p.h*.3}],used=[];let from=pts[0];
      for(let i=0;i<Math.min(4,1+mods.arc);i++){
        const t=v131Nearest(from.x,from.y,used);if(!t)break;used.push(t);t.hp-=6+mods.arc*3;addParticles(t.x,t.y,'#d78cff',5,95);pts.push({x:t.x,y:t.y});from=t;
      }
      if(pts.length>1)state.v131Fx.arcs.push({pts,life:.18,max:.18});
      state.v131ArcCD=Math.max(.42,1.05-mods.arc*.16);
    }

    if(mods.missile>0&&state.v131MissileCD<=0){
      const target=v131Nearest(p.x,p.y);if(target){
        const count=mods.missile>=3?2:1;
        for(let i=0;i<count;i++)state.bullets.push({x:p.x+(i?16:-10),y:p.y-p.h*.22,vx:(i?55:-35),vy:-250,w:10,h:22,damage:11+mods.missile*4,dmg:11+mods.missile*4,color:'#ffcf68',type:'player',special:true,homing:target,v131Homing:true});
      }
      state.v131MissileCD=Math.max(.48,1.08-mods.missile*.15);
    }

    state.v131Fx.beams.forEach(f=>f.life-=dt);state.v131Fx.beams=state.v131Fx.beams.filter(f=>f.life>0);
    state.v131Fx.arcs.forEach(f=>f.life-=dt);state.v131Fx.arcs=state.v131Fx.arcs.filter(f=>f.life>0);
  }

  function drawV131Fx(){
    if(!playing||!state.player)return;v131Init();ctx.save();ctx.globalCompositeOperation='lighter';
    for(const f of state.v131Fx.beams){const a=Math.max(0,f.life/f.max);ctx.shadowColor='#6eefff';ctx.shadowBlur=18;ctx.strokeStyle='rgba(170,250,255,'+a+')';ctx.lineWidth=2.5+(state.v131Modules.laser||0);ctx.beginPath();ctx.moveTo(f.x1,f.y1);ctx.lineTo(f.x2,f.y2);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,'+(a*.8)+')';ctx.lineWidth=1;ctx.stroke();}
    for(const f of state.v131Fx.arcs){const a=Math.max(0,f.life/f.max);ctx.shadowColor='#ca7dff';ctx.shadowBlur=16;ctx.strokeStyle='rgba(213,153,255,'+a+')';ctx.lineWidth=2.4;ctx.beginPath();f.pts.forEach((pt,i)=>{if(i===0)ctx.moveTo(pt.x,pt.y);else{const prev=f.pts[i-1],mx=(prev.x+pt.x)/2+(Math.random()-.5)*16,my=(prev.y+pt.y)/2+(Math.random()-.5)*16;ctx.lineTo(mx,my);ctx.lineTo(pt.x,pt.y);}});ctx.stroke();}
    for(const b of state.bullets){if(!b.v131Homing)continue;const ang=Math.atan2(b.vy||-1,b.vx||0)+Math.PI/2;ctx.save();ctx.translate(b.x,b.y);ctx.rotate(ang);ctx.shadowColor='#ffd35f';ctx.shadowBlur=14;ctx.fillStyle='#fff0a0';ctx.beginPath();ctx.moveTo(0,-11);ctx.lineTo(6,8);ctx.lineTo(0,5);ctx.lineTo(-6,8);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(255,170,60,.65)';ctx.beginPath();ctx.moveTo(0,7);ctx.lineTo(0,15);ctx.stroke();ctx.restore();}
    for(const e of state.enemies){if(!e.v13Elite||e.v13Mini)continue;const col=e.v131Type==='sniper'?'#ff78b7':e.v131Type==='tank'?'#a984ff':'#ffb24c';ctx.shadowColor=col;ctx.shadowBlur=10;ctx.strokeStyle=col;ctx.globalAlpha=.55;ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,Math.max(e.w,e.h)*.52,0,Math.PI*1.25);ctx.stroke();ctx.globalAlpha=.8;ctx.font='800 7px system-ui,sans-serif';ctx.textAlign='center';ctx.fillStyle=col;ctx.fillText((e.v131Type||'elite').toUpperCase(),e.x,e.y-e.h*.60);ctx.globalAlpha=1;}
    ctx.restore();
  }

  function spawnEnemy(){`);

    code=code.replace("v13MutateEnemy(e); state.enemies.push(e);","v13MutateEnemy(e); v131ClassifyEnemy(e); state.enemies.push(e);");

    code=code.replace("if(e.shotCD<=0 && dist(e,p)<660){ enemyShoot(e); e.shotCD = 2.2 + Math.random()*1.8; }",`if(e.shotCD<=0 && dist(e,p)<660){
      if(e.v13Mini) v131MiniShoot(e); else if(e.v13Elite) v131EliteShoot(e); else enemyShoot(e);
      e.shotCD = e.v13Mini ? (.72+Math.random()*.34) : e.v13Elite ? (1.05+Math.random()*.78) : (2.2+Math.random()*1.8);
    }`);

    code=code.replace("state.score += 120; state.kills++; state.progress++;","state.score += (e.v13Worth||120); state.kills++; state.progress++;");

    code=code.replace("state.v13MiniFlash=Math.max(0,(state.v13MiniFlash||0)-dt);","state.v13MiniFlash=Math.max(0,(state.v13MiniFlash||0)-dt);\n    v131Update(dt,p);");

    code=code.replace("drawV11Phase3Fx(); drawV13Fx();","drawV11Phase3Fx(); drawV13Fx(); drawV131Fx();");

    code=code.replace("state.v13MiniSector=-1;",`state.v13MiniSector=-1;
    state.v131Modules={laser:0,arc:0,missile:0};state.v131Fx={beams:[],arcs:[]};state.v131LaserCD=0;state.v131ArcCD=0;state.v131MissileCD=0;`);

    code=code.replace("v13Ultimate:()=>v13Ultimate(),",`v13Ultimate:()=>v13Ultimate(),
      v131Specialize:(kind)=>v131Specialize(kind),`);

    code=code.replace("attract:!!state.v11Attract,weaponLevel:",`laserLevel:state.v131Modules?.laser||0,arcLevel:state.v131Modules?.arc||0,missileLevel:state.v131Modules?.missile||0,
        attract:!!state.v11Attract,weaponLevel:`);

    return code;
  };

  const previous=window.__V11_PHASE2_PATCH;
  if(typeof previous==='function'&&!previous.__v131Wrapped){
    const wrapped=(code)=>window.__V131_PATCH(previous(code));
    wrapped.__v131Wrapped=true;
    window.__V11_PHASE2_PATCH=wrapped;
  }
})();