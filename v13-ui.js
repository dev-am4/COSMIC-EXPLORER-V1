(()=>{
  const $=s=>document.querySelector(s);
  let lastBossKills=0,lastMini=false,upgradeOpen=false,upgradeTimer=null;

  function sound(kind){
    try{
      const cfg=JSON.parse(localStorage.getItem('cosmicExplorerV12Settings')||'{}'); if(cfg.sound===false)return;
      const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
      const ac=window.__V13AC||(window.__V13AC=new AC());if(ac.state==='suspended')ac.resume().catch(()=>{});
      const now=ac.currentTime,tone=(f,d,g=.025,type='sine',delay=0,end=null)=>{const o=ac.createOscillator(),v=ac.createGain();o.type=type;o.frequency.setValueAtTime(f,now+delay);if(end)o.frequency.exponentialRampToValueAtTime(Math.max(30,end),now+delay+d);v.gain.setValueAtTime(.0001,now+delay);v.gain.exponentialRampToValueAtTime(g,now+delay+.012);v.gain.exponentialRampToValueAtTime(.0001,now+delay+d);o.connect(v);v.connect(ac.destination);o.start(now+delay);o.stop(now+delay+d+.03)};
      if(kind==='upgrade'){tone(220,.18,.024,'triangle',0,440);tone(440,.24,.022,'sine',.12,880)}
      else if(kind==='ultimate'){tone(70,.55,.05,'sawtooth',0,45);tone(230,.36,.03,'triangle',.12,720);tone(720,.42,.022,'sine',.28,1280)}
      else if(kind==='mini'){tone(110,.18,.025,'square',0,70);tone(90,.18,.022,'square',.22,55)}
    }catch(_){ }
  }

  function build(){
    if($('#v13Layer'))return;
    const root=document.createElement('div');root.id='v13Layer';root.innerHTML=`
      <div id="v13Hud" class="hidden">
        <div class="v13-chip"><span>WEAPON</span><b id="v13Weapon">LV.1</b></div>
        <div class="v13-chip"><span>DRONE</span><b id="v13Drone">OFF</b></div>
        <div class="v13-chip"><span>SHIELD</span><b id="v13Shield">—</b></div>
        <button id="v13Ultimate" style="--charge:0%"><i></i><span>ULTIMATE</span><b id="v13UltimatePct">0%</b><small>Q</small></button>
      </div>
      <div id="v13Upgrade" class="hidden">
        <div class="v13-upgrade-panel">
          <div class="v13-upgrade-ey">SECTOR SECURED · CHOOSE ONE</div>
          <h2>EVOLVE YOUR SHIP</h2>
          <div class="v13-upgrade-grid">
            <button data-upgrade="weapon"><i>✦</i><span>WEAPON EVOLUTION</span><b id="v13WeaponChoice">MULTI SHOT</b><small>เพิ่มจำนวนกระสุนและมุมยิง</small></button>
            <button data-upgrade="drone"><i>◈</i><span>GUARDIAN DRONE</span><b id="v13DroneChoice">UNLOCK DRONE</b><small>โดรนช่วยเล็งและยิงอัตโนมัติ</small></button>
            <button data-upgrade="shield"><i>⬡</i><span>SHIELD CORE</span><b id="v13ShieldChoice">REGEN SHIELD</b><small>ฟื้นเกราะต่อเนื่องและเพิ่ม Hull</small></button>
          </div>
          <div class="v13-upgrade-foot">เลือก 1 ระบบ · ภารกิจจะดำเนินต่อทันที</div>
        </div>
      </div>
      <div id="v13Mini" class="hidden"><small>ELITE SIGNATURE</small><strong>MINI BOSS</strong><span>DESTROY IT BEFORE THE MAIN CORE</span></div>`;
    document.body.appendChild(root);

    root.querySelectorAll('[data-upgrade]').forEach(btn=>btn.addEventListener('click',()=>{
      const kind=btn.dataset.upgrade,api=window.__COSMIC_V12;if(!api?.v13Upgrade)return;
      api.v13Upgrade(kind);upgradeOpen=false;$('#v13Upgrade').classList.add('hidden');sound('upgrade');setTimeout(()=>api.pause?.(false),120);
    }));
    $('#v13Ultimate').addEventListener('click',useUltimate);
    window.addEventListener('keydown',e=>{if((e.key||'').toLowerCase()==='q'){e.preventDefault();useUltimate();}});
  }

  function useUltimate(){
    const api=window.__COSMIC_V12,st=api?.status?.();if(!api?.v13Ultimate||!st?.playing||st.paused||Number(st.ultimateCharge||0)<100)return;
    if(api.v13Ultimate()){sound('ultimate');const b=$('#v13Ultimate');b.classList.remove('fired');void b.offsetWidth;b.classList.add('fired');}
  }

  function openUpgrade(st){
    if(upgradeOpen||st.attract||st.finale||Number(st.bossKills||0)>=4)return;
    const api=window.__COSMIC_V12;if(!api)return;upgradeOpen=true;api.pause?.(true);
    const w=Number(st.weaponLevel||1),d=Number(st.droneLevel||0),s=Number(st.shieldLevel||0);
    $('#v13WeaponChoice').textContent=w>=3?'OVERDRIVE +45%':'LEVEL '+Math.min(3,w+1)+' MULTI SHOT';
    $('#v13DroneChoice').textContent=d<=0?'UNLOCK DRONE':d===1?'TWIN DRONE':'DRONE OVERCHARGE';
    $('#v13ShieldChoice').textContent='SHIELD CORE '+Math.min(3,s+1);
    $('#v13Upgrade').classList.remove('hidden');sound('upgrade');
  }

  function miniToast(on){
    const el=$('#v13Mini');if(!el)return;
    if(on&&!lastMini){el.classList.remove('hidden','out');void el.offsetWidth;el.classList.add('on');sound('mini');setTimeout(()=>{el.classList.add('out');setTimeout(()=>el.classList.add('hidden'),420)},1800)}
    lastMini=on;
  }

  function tick(){
    build();const api=window.__COSMIC_V12,st=api?.status?.();const hud=$('#v13Hud');
    if(st){
      hud.classList.toggle('hidden',!st.playing);
      $('#v13Weapon').textContent='LV.'+(st.weaponLevel||1);
      $('#v13Drone').textContent=st.drone?((st.droneLevel||1)>=2?'TWIN':'ON'):'OFF';
      $('#v13Shield').textContent=(st.shieldLevel||0)>0?'CORE '+st.shieldLevel:Math.round(st.shield||0)>0?Math.round(st.shield):'—';
      const ch=Math.max(0,Math.min(100,Number(st.ultimateCharge||0))),ult=$('#v13Ultimate');ult.style.setProperty('--charge',ch+'%');$('#v13UltimatePct').textContent=Math.round(ch)+'%';ult.classList.toggle('ready',ch>=100);
      miniToast(!!st.miniActive);
      const bk=Number(st.bossKills||0);
      if(st.playing&&bk>lastBossKills){lastBossKills=bk;if(bk<4&&!st.attract){clearTimeout(upgradeTimer);upgradeTimer=setTimeout(()=>{const now=window.__COSMIC_V12?.status?.();if(now?.playing&&Number(now.bossKills||0)===bk)openUpgrade(now)},1180)}}
      if(!st.playing){lastBossKills=0;lastMini=false;if(upgradeOpen){upgradeOpen=false;$('#v13Upgrade').classList.add('hidden')}}
    }
    requestAnimationFrame(tick);
  }

  function register(){if('serviceWorker'in navigator&&location.protocol==='https:')setTimeout(()=>navigator.serviceWorker.register('/sw-v13.js?v=130',{scope:'/'}).catch(()=>{}),700)}
  const ready=()=>{build();const tag=$('.v11tag');if(tag)tag.textContent='ARCADE SPACE MISSION · V13 EVOLUTION';register();requestAnimationFrame(tick)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();