(()=>{
  const $=s=>document.querySelector(s);
  const latest='/sw-v1343.js?v=1343';
  let bootShown=false;
  function cfg(){try{return JSON.parse(localStorage.getItem('cosmicExplorerV12Settings')||'{}')||{};}catch(_){return {};}}

  function registerLatest(){
    if(!('serviceWorker' in navigator)||location.protocol!=='https:')return;
    const native=window.__COSMIC_SW_NATIVE_REGISTER||navigator.serviceWorker.register.bind(navigator.serviceWorker);
    native(latest,{scope:'/',updateViaCache:'none'}).then(reg=>{try{reg.update()}catch(_){}}).catch(()=>{});
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      const home=$('#home'),untouched=!window.__COSMIC_USER_INTERACTED&&!window.__COSMIC_START_PENDING;
      if(home&&!home.classList.contains('hidden')&&untouched&&!sessionStorage.getItem('cosmicSw1343Reloaded')){
        sessionStorage.setItem('cosmicSw1343Reloaded','1');setTimeout(()=>location.reload(),80);
      }
    },{once:true});
  }

  function build(){
    if($('#v1343BootStatus'))return;
    const el=document.createElement('div');el.id='v1343BootStatus';el.className='hidden';el.innerHTML='<small>ENGINE</small><b id="v1343BootText">READY</b>';
    document.body.appendChild(el);
  }

  function showBoot(text,bad=false){
    build();const el=$('#v1343BootStatus');if(!el)return;el.classList.remove('hidden');el.dataset.bad=bad?'1':'0';$('#v1343BootText').textContent=text;
    clearTimeout(showBoot.t);showBoot.t=setTimeout(()=>el.classList.add('hidden'),2200);
  }

  function ready(){
    build();const tag=$('.v11tag');if(tag)tag.textContent='ARCADE SPACE MISSION · V13.4.3 FAST BOOT';
    registerLatest();
    if(window.__COSMIC_SAFE_MODE)showBoot('SAFE RECOVERY',true);
    window.addEventListener('cosmic:engine-ready',()=>{
      const ms=Number(localStorage.getItem('cosmicLastBootMs')||0);if(!bootShown&&new URLSearchParams(location.search).get('diag')==='1'){bootShown=true;showBoot('READY · '+ms+'ms');}
    });
    window.addEventListener('cosmic:runtime-error',()=>showBoot('RECOVERING…',true));
    const c=cfg();if(c.fps&&new URLSearchParams(location.search).get('diag')!=='1')document.documentElement.dataset.cosmicDiag='1';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();