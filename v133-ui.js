(()=>{
  const $=s=>document.querySelector(s);
  const sig=[
    {name:'ORBITAL CANNON',hint:'MOVE OUT OF TARGETED LIGHT COLUMNS',accent:'EARTH CORE'},
    {name:'GRAVITY PULSE',hint:'BOOST REDUCES THE PULL',accent:'LUNAR HOWLER'},
    {name:'HEAT ZONE',hint:'LEAVE ORANGE TARGET ZONES BEFORE IGNITION',accent:'MAGMA EMPEROR'},
    {name:'EVENT HORIZON',hint:'EXPECT GRAVITY PULL + CURVED PROJECTILES',accent:'VOID SINGULARITY'}
  ];
  let lastBoss=false,lastSector=-1,lastPhase=0,alertTimer=null;

  function sound(kind){
    try{const cfg=JSON.parse(localStorage.getItem('cosmicExplorerV12Settings')||'{}');if(cfg.sound===false)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const ac=window.__V133AC||(window.__V133AC=new AC());if(ac.state==='suspended')ac.resume().catch(()=>{});const n=ac.currentTime;const tone=(f,d,g=.02,type='sine',delay=0,end=f)=>{const o=ac.createOscillator(),v=ac.createGain();o.type=type;o.frequency.setValueAtTime(f,n+delay);o.frequency.exponentialRampToValueAtTime(Math.max(35,end),n+delay+d);v.gain.setValueAtTime(.0001,n+delay);v.gain.exponentialRampToValueAtTime(g,n+delay+.012);v.gain.exponentialRampToValueAtTime(.0001,n+delay+d);o.connect(v);v.connect(ac.destination);o.start(n+delay);o.stop(n+delay+d+.03)};if(kind==='boss'){tone(95,.34,.028,'sawtooth',0,58);tone(240,.24,.02,'triangle',.12,480)}else{tone(260,.16,.018,'triangle',0,520);tone(520,.21,.014,'sine',.08,840)}}catch(_){ }
  }

  function build(){
    if($('#v133Layer'))return;
    const root=document.createElement('div');root.id='v133Layer';root.innerHTML=`
      <div id="v133Signature" class="hidden"><small>BOSS SIGNATURE</small><strong id="v133SigName">ORBITAL CANNON</strong><span id="v133SigPhase">PHASE 1</span></div>
      <div id="v133Alert" class="hidden"><div class="v133-line"></div><small id="v133AlertEy">SIGNATURE MECHANIC</small><strong id="v133AlertTitle">ORBITAL CANNON</strong><span id="v133AlertSub">MOVE OUT OF TARGETED LIGHT COLUMNS</span></div>`;
    document.body.appendChild(root);
  }

  function showAlert(sec,phase,isBossStart){
    const d=sig[sec]||sig[0],el=$('#v133Alert');if(!el)return;
    $('#v133AlertEy').textContent=isBossStart?d.accent+' · SIGNATURE DETECTED':'PHASE '+phase+' · SIGNATURE ESCALATION';
    $('#v133AlertTitle').textContent=d.name;$('#v133AlertSub').textContent=d.hint;
    el.dataset.sector=String(sec);el.classList.remove('hidden','on');void el.offsetWidth;el.classList.add('on');sound(isBossStart?'boss':'phase');
    clearTimeout(alertTimer);alertTimer=setTimeout(()=>el.classList.remove('on'),1450);setTimeout(()=>el.classList.add('hidden'),1920);
  }

  function tick(){
    build();const st=window.__COSMIC_V12?.status?.(),box=$('#v133Signature');
    if(st){
      const boss=!!st.bossActive,sec=Number(st.sector||0),phase=Number(st.bossPhase||0),d=sig[sec]||sig[0];
      box.classList.toggle('hidden',!boss||!st.playing);box.dataset.sector=String(sec);
      if(boss){$('#v133SigName').textContent=st.bossSignature||d.name;$('#v133SigPhase').textContent='PHASE '+Math.max(1,phase||1);
        if(!lastBoss||sec!==lastSector)showAlert(sec,phase||1,true);else if(phase>lastPhase)showAlert(sec,phase,false);
      }
      lastBoss=boss;lastSector=sec;lastPhase=phase;
      if(!st.playing){lastBoss=false;lastSector=-1;lastPhase=0;}
    }
    requestAnimationFrame(tick);
  }

  function register(){if('serviceWorker'in navigator&&location.protocol==='https:')setTimeout(()=>navigator.serviceWorker.register('/sw-v133.js?v=133',{scope:'/'}).catch(()=>{}),1050)}
  const ready=()=>{build();const tag=$('.v11tag');if(tag)tag.textContent='ARCADE SPACE MISSION · V13.3 BOSS INTELLIGENCE';register();requestAnimationFrame(tick)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();