(()=>{
  window.__V134_PATCH=(code)=>{
    code=code.split('?v=133').join('?v=134');

    code=code.replace("function spawnEnemy(){",`function v134Init(){
    if(state.v134BossRef===undefined) state.v134BossRef=null;
    if(state.v134Intro==null) state.v134Intro=0;
    if(state.v134Transform==null) state.v134Transform=0;
    if(state.v134WeakFlash==null) state.v134WeakFlash=0;
    if(state.v134Death==null) state.v134Death=0;
    if(state.v134RageCD==null) state.v134RageCD=0;
    if(state.v134Armor==null) state.v134Armor=0;
    if(state.v134ArmorMax==null) state.v134ArmorMax=0;
    if(state.v134ArmorBroken==null) state.v134ArmorBroken=false;
    if(state.v134Rage==null) state.v134Rage=false;
  }

  function v134WeakPoint(b,sec){
    const t=state.time||0;
    if(sec===0) return {x:b.x,y:b.y-6,r:24};
    if(sec===1) return {x:b.x+Math.sin(t*2.1)*30,y:b.y+6,r:23};
    if(sec===2) return {x:b.x-26+Math.sin(t*1.6)*10,y:b.y+18,r:25};
    return {x:b.x+Math.cos(t*2.4)*34,y:b.y+10+Math.sin(t*1.7)*12,r:22};
  }

  function v134ArmBoss(b){
    state.v134BossRef=b;
    state.v134ArmorMax=Math.max(52,Math.round(b.maxHp*.30));
    state.v134Armor=state.v134ArmorMax;
    state.v134ArmorBroken=false;
    state.v134Rage=false;
    state.v134RageCD=1.25;
    state.v134WeakFlash=0;
    state.v134Transform=0;
    state.v134TransformHold=0;
    state.v134LastBossPhase=b.v11Phase||1;
    state.v134Intro=Math.max(state.v134Intro||0,2.55);
  }

  function v134ArmorScan(b){
    if(!b||b.v134Dying||state.v134Transform>0)return;
    const sec=state.sector||0,bodyR=Math.max(48,Math.min(b.w,b.h)*.38);
    for(const q of state.bullets){
      if(!q)continue;
      const dx=(q.x||0)-b.x,dy=(q.y||0)-b.y;
      if(!state.v134ArmorBroken&&!q.v134ArmorSeen&&dx*dx+dy*dy<bodyR*bodyR){
        q.v134ArmorSeen=true;
        const dmg=Math.max(2,q.damage||q.dmg||7);
        state.v134Armor=Math.max(0,state.v134Armor-dmg*.82);
        if(state.v134Armor<=0){
          state.v134ArmorBroken=true;state.v134Transform=Math.max(state.v134Transform,.68);state.v134TransformHold=b.hp;
          state.v134WeakFlash=1.15;state.enemyBullets=[];state.shake=Math.max(state.shake,14);state.flash=Math.max(state.flash,.18);
          addParticles(b.x,b.y,['#8feeff','#e5f0ff','#ff9a55','#c98aff'][sec]||'#fff',42,250);sfx('clear');
        }
      }
    }
    if(state.v134ArmorBroken){
      const w=v134WeakPoint(b,sec);
      for(const q of state.bullets){
        if(!q||q.v134WeakSeen)continue;
        const dx=(q.x||0)-w.x,dy=(q.y||0)-w.y;
        if(dx*dx+dy*dy<w.r*w.r){
          q.v134WeakSeen=true;
          const dmg=Math.max(2,q.damage||q.dmg||7);
          b.hp-=dmg*1.35;state.v134WeakFlash=Math.max(state.v134WeakFlash,.22);
          addParticles(w.x,w.y,'#fff3a8',5,105);
        }
      }
    }
  }

  function v134RageBurst(b){
    const p=state.player;if(!p||!b)return;
    const sec=state.sector||0,col=['#6eeaff','#e4edff','#ff8b50','#c878ff'][sec]||'#fff';
    const aim=Math.atan2(p.y-b.y,p.x-b.x),count=W<700?3:5;
    for(let i=0;i<count;i++){
      const u=count===1?0:i/(count-1)-.5,ang=aim+u*.64,spd=235+sec*12;
      state.enemyBullets.push({x:b.x,y:b.y+22,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd,w:15,h:15,damage:9+sec,color:col,v133Curve:sec===3,v133CurveSign:i%2?-1:1});
    }
    state.shake=Math.max(state.shake,5.5);
  }

  function v134BossCinematic(dt){
    v134Init();const b=state.boss;
    state.v134Intro=Math.max(0,(state.v134Intro||0)-dt);
    state.v134Transform=Math.max(0,(state.v134Transform||0)-dt);
    state.v134WeakFlash=Math.max(0,(state.v134WeakFlash||0)-dt);
    if(!b){state.v134BossRef=null;state.v134Rage=false;return;}
    if(state.v134BossRef!==b)v134ArmBoss(b);

    const ph=b.v11Phase||1;
    if(ph!==(state.v134LastBossPhase||1)&&!b.v134Dying){
      state.v134LastBossPhase=ph;state.v134Transform=.94;state.v134TransformHold=b.hp;state.enemyBullets=[];
      state.v134WeakFlash=.46;state.shake=Math.max(state.shake,11+ph*2);state.flash=Math.max(state.flash,.12);
      addParticles(b.x,b.y,ph===2?'#fff0a0':'#ff73d6',30+ph*4,235);sfx('boss');
    }
    if(state.v134Transform>0&&state.v134TransformHold>0)b.hp=Math.max(b.hp,state.v134TransformHold);

    v134ArmorScan(b);

    if(ph>=3&&!state.v134Rage&&!b.v134Dying){
      state.v134Rage=true;state.v134RageCD=.65;state.enemyBullets=[];state.shake=Math.max(state.shake,15);state.flash=Math.max(state.flash,.20);
      addParticles(b.x,b.y,'#ff5b8f',48,285);sfx('boss');
    }
    if(state.v134Rage&&!b.v134Dying&&state.v134Transform<=0&&(state.v11BossWarning||0)<=0){
      state.v134RageCD-=dt;
      if(state.v134RageCD<=0){v134RageBurst(b);state.v134RageCD=W<700?1.45:1.20;}
    }
  }

  function drawV134Fx(){
    if(!playing)return;v134Init();const b=state.boss,sec=state.sector||0,t=state.time||0;
    ctx.save();
    if((state.v134Intro||0)>0&&b){
      const k=Math.min(1,(state.v134Intro||0)/.45);ctx.fillStyle='rgba(0,0,6,'+(0.38*k)+')';ctx.fillRect(0,0,W,H);
      const bar=Math.max(24,H*.065);ctx.fillStyle='rgba(0,0,0,'+(0.86*k)+')';ctx.fillRect(0,0,W,bar);ctx.fillRect(0,H-bar,W,bar);
      ctx.strokeStyle='rgba('+(sec===0?'90,225,255':sec===1?'220,235,255':sec===2?'255,125,70':'190,110,255')+','+(.22*k)+')';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(W*.16,bar);ctx.lineTo(W*.84,bar);ctx.moveTo(W*.16,H-bar);ctx.lineTo(W*.84,H-bar);ctx.stroke();
    }
    if(b){
      const r=Math.max(b.w,b.h)*.46;
      if(!state.v134ArmorBroken){
        const ratio=Math.max(0,state.v134Armor/Math.max(1,state.v134ArmorMax));ctx.globalCompositeOperation='lighter';
        ctx.strokeStyle='rgba(110,205,255,'+(.26+ratio*.34)+')';ctx.shadowColor='#76dcff';ctx.shadowBlur=16;ctx.lineWidth=3.5;
        for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(b.x,b.y,r+11,-Math.PI*.43+i*Math.PI*.5,-Math.PI*.08+i*Math.PI*.5);ctx.stroke();}
      }else if(!b.v134Dying){
        const w=v134WeakPoint(b,sec),pulse=.55+.45*Math.sin(t*8);ctx.globalCompositeOperation='lighter';ctx.shadowColor='#fff0a0';ctx.shadowBlur=18;ctx.strokeStyle='rgba(255,238,140,'+(.45+.35*pulse)+')';ctx.lineWidth=2.5;
        ctx.beginPath();ctx.arc(w.x,w.y,w.r+4+pulse*3,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(w.x-w.r-8,w.y);ctx.lineTo(w.x-w.r+1,w.y);ctx.moveTo(w.x+w.r-1,w.y);ctx.lineTo(w.x+w.r+8,w.y);ctx.moveTo(w.x,w.y-w.r-8);ctx.lineTo(w.x,w.y-w.r+1);ctx.moveTo(w.x,w.y+w.r-1);ctx.lineTo(w.x,w.y+w.r+8);ctx.stroke();
      }
      if(state.v134Transform>0){
        const prog=1-state.v134Transform/.94,a=Math.max(0,Math.min(1,state.v134Transform/.18));ctx.globalCompositeOperation='lighter';
        for(let i=0;i<3;i++){ctx.strokeStyle='rgba(255,'+(160+i*28)+','+(110+i*40)+','+(.42*a)+')';ctx.lineWidth=4-i;ctx.beginPath();ctx.arc(b.x,b.y,r+18+prog*(85+i*28),0,Math.PI*2);ctx.stroke();}
      }
      if(state.v134Rage&&!b.v134Dying){
        ctx.globalCompositeOperation='lighter';const pulse=.5+.5*Math.sin(t*11);ctx.strokeStyle='rgba(255,70,115,'+(.28+.25*pulse)+')';ctx.lineWidth=4;ctx.shadowColor='#ff426f';ctx.shadowBlur=25;ctx.beginPath();ctx.arc(b.x,b.y,r+18+pulse*8,0,Math.PI*2);ctx.stroke();
      }
    }
    if((state.v134Death||0)>0){
      const left=state.v134Death,total=2.25,age=total-left,x=state.v134DeathX||W*.5,y=state.v134DeathY||H*.25,p=Math.min(1,age/total);ctx.globalCompositeOperation='lighter';
      if(sec===0){for(let i=0;i<8;i++){const a=Math.PI*2*i/8+t*.18;ctx.strokeStyle='rgba(100,235,255,'+(1-p)*.48+')';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*(45+age*170),y+Math.sin(a)*(45+age*170));ctx.stroke();}}
      else if(sec===1){for(let i=0;i<4;i++){ctx.strokeStyle='rgba(225,240,255,'+Math.max(0,.48-p*.32-i*.06)+')';ctx.lineWidth=4-i*.6;ctx.beginPath();ctx.arc(x,y,28+age*(75+i*28),0,Math.PI*2);ctx.stroke();}}
      else if(sec===2){for(let i=0;i<18;i++){const a=Math.PI*2*i/18+i*.37,r=24+age*(70+(i%5)*24);ctx.fillStyle='rgba(255,'+(105+i%3*42)+',45,'+Math.max(0,.62-p*.45)+')';ctx.beginPath();ctx.arc(x+Math.cos(a)*r,y+Math.sin(a)*r,2+(i%4),0,Math.PI*2);ctx.fill();}}
      else {const rr=Math.max(6,120*(1-p)+age*18);ctx.strokeStyle='rgba(205,145,255,'+Math.max(0,.68-p*.5)+')';ctx.lineWidth=5;ctx.shadowColor='#9f5cff';ctx.shadowBlur=28;ctx.beginPath();ctx.arc(x,y,rr,0,Math.PI*2);ctx.stroke();const g=ctx.createRadialGradient(x,y,4,x,y,rr*1.8);g.addColorStop(0,'rgba(0,0,0,.92)');g.addColorStop(.45,'rgba(95,35,155,.18)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(x-rr*2,y-rr*2,rr*4,rr*4);}
    }
    if(state.v134WeakFlash>0){ctx.fillStyle='rgba(255,240,150,'+Math.min(.10,state.v134WeakFlash*.12)+')';ctx.fillRect(0,0,W,H);}
    ctx.restore();
  }

  function spawnEnemy(){`);

    code=code.replace("state.v11BossWarning=2.15;",`state.v11BossWarning=2.75;state.v134Intro=2.75;state.v134BossRef=null;`);

    code=code.replace("if((state.v11BossWarning||0)>0||b.y<125)return;",`if((state.v11BossWarning||0)>0||(state.v134Transform||0)>0||b.v134Dying||b.y<125)return;`);

    code=code.replace("state.v132ThreatPulse=Math.max(0,(state.v132ThreatPulse||0)-dt);v133BossMechanics(dt);",`state.v132ThreatPulse=Math.max(0,(state.v132ThreatPulse||0)-dt);v133BossMechanics(dt);v134BossCinematic(dt);`);

    code=code.replace("if((state.v11BossWarning||0)<=0 && b.y>=128 && b.shotCD<=0){",`if((state.v11BossWarning||0)<=0 && (state.v134Transform||0)<=0 && !b.v134Dying && b.y>=128 && b.shotCD<=0){`);

    code=code.replace("drawV11Phase3Fx(); drawV13Fx(); drawV131Fx(); drawV132Fx(); drawV133Fx();","drawV11Phase3Fx(); drawV13Fx(); drawV131Fx(); drawV132Fx(); drawV133Fx(); drawV134Fx();");

    code=code.replace(`if(b.hp<=0){
        addParticles(b.x,b.y,'#fff0a0',58,300); addParticles(b.x,b.y,'#ff69ca',42,260); state.shake=18; state.flash=.22; state.v11BossDefeat=1.35;
        state.score+=1200; state.bossKills++; state.progress=0; state.v11DeathX=b.x; state.v11DeathY=b.y; state.boss=null; state.wave=1; state.kills=0;
        if(state.bossKills>=ASSETS.planets.length){
          state.v11Finale=true; state.bossActive=true; state.v11MissionComplete=2.6; state.v11BossDefeat=2.2; state.enemyBullets=[]; sfx('clear');
        } else {
          state.bossActive=false; state.sector=(state.sector+1)%ASSETS.planets.length; showBanner(ASSETS.planets[state.sector].key,'planet'+state.sector); sfx('clear');
        }
      }`,`if(b.hp<=0&&!b.v134Dying){
        b.v134Dying=true;b.hp=1;b.shotCD=999;state.v134Death=2.25;state.v134DeathX=b.x;state.v134DeathY=b.y;state.enemyBullets=[];state.enemies=[];
        state.shake=20;state.flash=.28;state.v11BossDefeat=2.25;addParticles(b.x,b.y,'#fff0a0',64,315);addParticles(b.x,b.y,'#ff69ca',44,270);sfx('clear');
      }
      if(b.v134Dying){
        state.v134Death=Math.max(0,(state.v134Death||0)-dt);b.hp=1;b.shotCD=999;b.x+=(W*.5-b.x)*Math.min(1,dt*1.6);b.y+=(H*.25-b.y)*Math.min(1,dt*1.2);
        if(Math.floor(state.v134Death*10)%3===0&&Math.random()<.18)addParticles(b.x+(Math.random()-.5)*b.w*.7,b.y+(Math.random()-.5)*b.h*.7,['#9feaff','#eef4ff','#ff9658','#c77cff'][state.sector]||'#fff',5,115);
        if(state.v134Death<=0){
          state.score+=1200;state.bossKills++;state.progress=0;state.v11DeathX=b.x;state.v11DeathY=b.y;state.boss=null;state.wave=1;state.kills=0;state.v134BossRef=null;state.v134Rage=false;
          if(state.bossKills>=ASSETS.planets.length){
            state.v11Finale=true;state.bossActive=true;state.v11MissionComplete=2.6;state.v11BossDefeat=2.2;state.enemyBullets=[];sfx('clear');
          }else{
            state.bossActive=false;state.sector=(state.sector+1)%ASSETS.planets.length;showBanner(ASSETS.planets[state.sector].key,'planet'+state.sector);sfx('clear');
          }
        }
      }`);

    code=code.replace("state.v133BossSector=-1;state.v133LastPhase=0;state.v133MechanicCD=.8;state.v133Orbital=[];state.v133Heat=[];state.v133MoonPulse=0;state.v133VoidPulse=0;state.v133PhaseFx=0;",`state.v133BossSector=-1;state.v133LastPhase=0;state.v133MechanicCD=.8;state.v133Orbital=[];state.v133Heat=[];state.v133MoonPulse=0;state.v133VoidPulse=0;state.v133PhaseFx=0;state.v134BossRef=null;state.v134Intro=0;state.v134Transform=0;state.v134WeakFlash=0;state.v134Death=0;state.v134Armor=0;state.v134ArmorMax=0;state.v134ArmorBroken=false;state.v134Rage=false;state.v134RageCD=0;`);

    code=code.replace("bossPhase:state.boss?.v11Phase||0,bossSignature:",`bossArmor:Math.round(state.v134Armor||0),bossArmorMax:Math.round(state.v134ArmorMax||0),bossArmorBroken:!!state.v134ArmorBroken,bossRage:!!state.v134Rage,bossIntro:state.v134Intro||0,bossTransform:state.v134Transform||0,bossDeath:state.v134Death||0,weakPointOpen:!!state.v134ArmorBroken,bossPhase:state.boss?.v11Phase||0,bossSignature:`);

    return code;
  };

  const previous=window.__V11_PHASE2_PATCH;
  if(typeof previous==='function'&&!previous.__v134Wrapped){
    const wrapped=(code)=>window.__V134_PATCH(previous(code));
    wrapped.__v134Wrapped=true;
    window.__V11_PHASE2_PATCH=wrapped;
  }
})();