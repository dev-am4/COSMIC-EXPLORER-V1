(()=>{
  const $=s=>document.querySelector(s);
  let wired=false,lastLevels='0/0/0';
  function sound(){try{const cfg=JSON.parse(localStorage.getItem('cosmicExplorerV12Settings')||'{}');if(cfg.sound===false)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const ac=window.__V131AC||(window.__V131AC=new AC());if(ac.state==='suspended')ac.resume().catch(()=>{});const n=ac.currentTime;[[260,.18,.022,'triangle'],[520,.22,.018,'sine'],[880,.25,.014,'sine']].forEach((x,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.type=x[3];o.frequency.setValueAtTime(x[0],n+i*.07);g.gain.setValueAtTime(.0001,n+i*.07);g.gain.exponentialRampToValueAtTime(x[2],n+i*.07+.012);g.gain.exponentialRampToValueAtTime(.0001,n+i*.07+x[1]);o.connect(g);g.connect(ac.destination);o.start(n+i*.07);o.stop(n+i*.07+x[1]+.03);});}catch(_){}}

  function build(){
    if($('#v131Layer'))return;
    const root=document.createElement('div');root.id='v131Layer';root.innerHTML=`
      <div id="v131Modules" class="hidden">
        <div class="v131-module laser"><span>LASER</span><b id="v131Laser">—</b></div>
        <div class="v131-module arc"><span>ARC</span><b id="v131Arc">—</b></div>
        <div class="v131-module missile"><span>MISSILE</span><b id="v131Missile">—</b></div>
      </div>
      <div id="v131Toast" class="hidden"><small>COMBAT MODULE ONLINE</small><strong id="v131ToastTitle">LASER CANNON</strong><span id="v131ToastSub">HITSCAN BEAM ACTIVE</span></div>`;
    document.body.appendChild(root);
  }

  const info={weapon:['LASER CANNON','HITSCAN BEAM · MORE DAMAGE PER LEVEL'],drone:['ARC LIGHTNING','CHAIN TARGETS · MORE LINKS PER LEVEL'],shield:['HOMING MISSILE','TRACKING WARHEAD · DEFENSE OFFENSE HYBRID']};

  function moduleToast(kind,level){
    const d=info[kind]||info.weapon,el=$('#v131Toast');if(!el)return;
    $('#v131ToastTitle').textContent=d[0]+' · LV.'+level;$('#v131ToastSub').textContent=d[1];
    el.classList.remove('hidden','on');void el.offsetWidth;el.classList.add('on');sound();
    setTimeout(()=>el.classList.remove('on'),1550);setTimeout(()=>el.classList.add('hidden'),1980);
  }

  function wireUpgrade(){
    const panel=$('#v13Upgrade');if(!panel)return;
    panel.querySelectorAll('[data-upgrade]').forEach(btn=>{
      if(btn.dataset.v131==='1')return;btn.dataset.v131='1';
      btn.addEventListener('click',()=>{
        const api=window.__COSMIC_V12;if(!api?.v131Specialize)return;
        const r=api.v131Specialize(btn.dataset.upgrade);if(!r)return;
        const k=btn.dataset.upgrade,lv=k==='weapon'?r.laser:k==='drone'?r.arc:r.missile;moduleToast(k,lv);
      });
    });
    wired=true;
  }

  function relabelUpgrade(st){
    const panel=$('#v13Upgrade');if(!panel||panel.classList.contains('hidden'))return;
    const w=panel.querySelector('[data-upgrade="weapon"]'),d=panel.querySelector('[data-upgrade="drone"]'),s=panel.querySelector('[data-upgrade="shield"]');
    if(w){w.querySelector('span').textContent='LASER CANNON';w.querySelector('b').textContent='BEAM LV.'+Math.min(3,(st.laserLevel||0)+1);w.querySelector('small').textContent='ยิงลำแสงทันที แรงขึ้นและถี่ขึ้นทุกระดับ';}
    if(d){d.querySelector('span').textContent='ARC LIGHTNING';d.querySelector('b').textContent='CHAIN LV.'+Math.min(3,(st.arcLevel||0)+1);d.querySelector('small').textContent='สายฟ้าชิ่งหลายเป้าหมาย พร้อมอัปเกรด Guardian Drone';}
    if(s){s.querySelector('span').textContent='HOMING MISSILE';s.querySelector('b').textContent='TRACKING LV.'+Math.min(3,(st.missileLevel||0)+1);s.querySelector('small').textContent='จรวดติดตามเป้าหมาย พร้อมอัปเกรด Shield Core';}
    const ey=panel.querySelector('.v13-upgrade-ey');if(ey)ey.textContent='SECTOR SECURED · CHOOSE COMBAT MODULE';
    const h=panel.querySelector('h2');if(h)h.textContent='EVOLVE COMBAT SYSTEM';
  }

  function tick(){
    build();if(!wired)wireUpgrade();
    const st=window.__COSMIC_V12?.status?.();if(st){
      const mods=$('#v131Modules');mods?.classList.toggle('hidden',!st.playing);
      const l=Number(st.laserLevel||0),a=Number(st.arcLevel||0),m=Number(st.missileLevel||0);
      $('#v131Laser').textContent=l?'LV.'+l:'—';$('#v131Arc').textContent=a?'LV.'+a:'—';$('#v131Missile').textContent=m?'LV.'+m:'—';
      relabelUpgrade(st);
      lastLevels=l+'/'+a+'/'+m;
    }
    requestAnimationFrame(tick);
  }

  function register(){if('serviceWorker'in navigator&&location.protocol==='https:')setTimeout(()=>navigator.serviceWorker.register('/sw-v131.js?v=131',{scope:'/'}).catch(()=>{}),850)}
  const ready=()=>{build();const tag=$('.v11tag');if(tag)tag.textContent='ARCADE SPACE MISSION · V13.1 COMBAT DEPTH';register();requestAnimationFrame(tick)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();