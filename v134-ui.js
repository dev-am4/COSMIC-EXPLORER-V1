(()=>{
  const $=s=>document.querySelector(s);
  const bosses=['TROOPER CORE','LUNAR HOWLER','MAGMA EMPEROR','VOID SINGULARITY'];
  const sectorNames=['EARTH','MOON','MARS','BLACK HOLE'];
  let lastBoss=false,lastPhase=0,lastArmorBroken=false,lastRage=false,lastDeath=false,lastSector=-1,hideTimer=null;

  function build(){
    if($('#v134Layer'))return;
    const root=document.createElement('div');root.id='v134Layer';root.innerHTML=`
      <div id="v134BossState" class="hidden" data-mode="armor"><small id="v134StateEy">BOSS ARMOR</small><strong id="v134StateText">100%</strong><div class="v134-meter"><i id="v134MeterFill"></i></div></div>
      <div id="v134Cine" class="hidden" data-sector="0"><div class="v134-cine-line"></div><small id="v134CineEy">TARGET ACQUIRED</small><strong id="v134CineTitle">TROOPER CORE</strong><span id="v134CineSub">ARMORED COMMAND UNIT</span></div>`;
    document.body.appendChild(root);
  }

  function tone(kind){
    try{
      const cfg=JSON.parse(localStorage.getItem('cosmicExplorerV12Settings')||'{}');if(cfg.sound===false)return;
      const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const ac=window.__V134AC||(window.__V134AC=new AC());if(ac.state==='suspended')ac.resume().catch(()=>{});const n=ac.currentTime;
      const beep=(f,d,g,type='sine',delay=0,end=f)=>{const o=ac.createOscillator(),v=ac.createGain();o.type=type;o.frequency.setValueAtTime(f,n+delay);o.frequency.exponentialRampToValueAtTime(Math.max(38,end),n+delay+d);v.gain.setValueAtTime(.0001,n+delay);v.gain.exponentialRampToValueAtTime(g,n+delay+.012);v.gain.exponentialRampToValueAtTime(.0001,n+delay+d);o.connect(v);v.connect(ac.destination);o.start(n+delay);o.stop(n+delay+d+.03)};
      if(kind==='break'){beep(720,.16,.018,'square',0,320);beep(980,.24,.012,'sine',.07,420)}
      else if(kind==='rage'){beep(105,.34,.026,'sawtooth',0,62);beep(155,.42,.020,'triangle',.10,84)}
      else if(kind==='death'){beep(150,.55,.025,'sawtooth',0,48);beep(520,.42,.014,'sine',.10,80)}
      else{beep(230,.20,.018,'triangle',0,460);beep(460,.24,.013,'sine',.08,760)}
    }catch(_){ }
  }

  function cine(ey,title,sub,sec=0,kind='phase',duration=1750){
    const el=$('#v134Cine');if(!el)return;el.dataset.sector=String(sec);$('#v134CineEy').textContent=ey;$('#v134CineTitle').textContent=title;$('#v134CineSub').textContent=sub;
    el.classList.remove('hidden','on');void el.offsetWidth;el.classList.add('on');tone(kind);clearTimeout(hideTimer);hideTimer=setTimeout(()=>el.classList.remove('on'),Math.max(900,duration-380));setTimeout(()=>el.classList.add('hidden'),duration);
  }

  function updateState(st){
    const box=$('#v134BossState');if(!box)return;const boss=!!st.bossActive&&!!st.playing;box.classList.toggle('hidden',!boss);if(!boss)return;
    const armor=Number(st.bossArmor||0),max=Math.max(1,Number(st.bossArmorMax||1)),ratio=Math.max(0,Math.min(1,armor/max));
    if(st.bossDeath>0){box.dataset.mode='death';$('#v134StateEy').textContent='CORE COLLAPSE';$('#v134StateText').textContent='CRITICAL';$('#v134MeterFill').style.width='0%';}
    else if(st.bossRage){box.dataset.mode='rage';$('#v134StateEy').textContent='FINAL RAGE';$('#v134StateText').textContent='MAX THREAT';$('#v134MeterFill').style.width='100%';}
    else if(st.bossArmorBroken){box.dataset.mode='weak';$('#v134StateEy').textContent='WEAK POINT';$('#v134StateText').textContent='EXPOSED';$('#v134MeterFill').style.width='100%';}
    else{box.dataset.mode='armor';$('#v134StateEy').textContent='BOSS ARMOR';$('#v134StateText').textContent=Math.round(ratio*100)+'%';$('#v134MeterFill').style.width=Math.round(ratio*100)+'%';}
  }

  function tick(){
    build();const st=window.__COSMIC_V12?.status?.();
    if(st){
      updateState(st);const boss=!!st.bossActive&&!!st.playing,sec=Number(st.sector||0),phase=Number(st.bossPhase||0),armorBroken=!!st.bossArmorBroken,rage=!!st.bossRage,death=Number(st.bossDeath||0)>0;
      if(boss&&!lastBoss){cine(sectorNames[sec]+' · TARGET ACQUIRED',bosses[sec]||'UNKNOWN TARGET','ARMORED SIGNATURE · PHASE 1',sec,'intro',2050);}
      else if(boss&&phase>lastPhase&&phase>=2){cine('PHASE '+phase+' TRANSFORMATION',bosses[sec]||'BOSS',phase===3?'FINAL COMBAT FORM':'ARMOR CONFIGURATION SHIFT',sec,'phase',1600);}
      if(boss&&armorBroken&&!lastArmorBroken)cine('ARMOR BREAK','WEAK POINT EXPOSED','DIRECT HITS DEAL BONUS DAMAGE',sec,'break',1650);
      if(boss&&rage&&!lastRage)cine('FINAL RAGE','THREAT LEVEL MAXIMUM','DODGE SIGNATURE BURSTS · KEEP MOVING',sec,'rage',1750);
      if(boss&&death&&!lastDeath)cine('CORE COLLAPSE',bosses[sec]||'BOSS','SIGNATURE DESTABILIZING',sec,'death',2050);
      lastBoss=boss;lastPhase=phase;lastArmorBroken=armorBroken;lastRage=rage;lastDeath=death;lastSector=sec;
      if(!st.playing){lastBoss=false;lastPhase=0;lastArmorBroken=false;lastRage=false;lastDeath=false;lastSector=-1;}
    }
    requestAnimationFrame(tick);
  }

  function register(){if('serviceWorker'in navigator&&location.protocol==='https:')setTimeout(()=>navigator.serviceWorker.register('/sw-v134.js?v=134',{scope:'/'}).catch(()=>{}),1150)}
  const ready=()=>{build();const tag=$('.v11tag');if(tag)tag.textContent='ARCADE SPACE MISSION · V13.4 BOSS CINEMATIC';register();requestAnimationFrame(tick)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();