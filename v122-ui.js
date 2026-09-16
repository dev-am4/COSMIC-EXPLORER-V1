(()=>{
  const $=s=>document.querySelector(s);
  const KEYS=[
    ['player1','/assets/v9/player1.webp?v=122'],['player2','/assets/v9/player2.webp?v=122'],['player3','/assets/v9/player3.webp?v=122'],['player4','/assets/v9/player4.webp?v=122'],
    ['enemy1'],['enemy2'],['enemy3'],['enemy4'],['boss1'],['boss2'],['boss3'],['boss4'],
    ['planet-earth'],['planet-moon'],['planet-mars'],['planet-hole'],
    ['pickup-energy'],['pickup-repair'],['pickup-shield'],['pickup-weapon'],['pickup-rocket'],['pickup-bomb']
  ];
  let auditRunning=false,auditRetried=false;

  const normalizeVersion=img=>{
    if(!img) return;
    const raw=img.getAttribute('src')||'';
    if(/\/assets\/v9\/player[1-4]\.webp/i.test(raw)&&!/v=122/.test(raw)){
      const n=(raw.match(/player([1-4])\.webp/i)||[])[1]||'1';
      img.src='/assets/v9/player'+n+'.webp?v=122';
    }
  };

  function guardImages(){
    document.querySelectorAll('img').forEach(normalizeVersion);
    const hero=$('#v11ShipImg');
    if(hero&&!hero.dataset.v122guard){
      hero.dataset.v122guard='1';
      hero.addEventListener('error',()=>{
        const n=(hero.src.match(/player([1-4])\.webp/i)||[])[1]||'1';
        const retry=Number(hero.dataset.v122retry||0);
        if(retry<3){hero.dataset.v122retry=String(retry+1);hero.src='/assets/v9/player'+n+'.webp?v=122&r='+Date.now();}
        else if(n!=='1'){hero.dataset.v122retry='0';hero.src='/assets/v9/player1.webp?v=122&r='+Date.now();}
      });
      hero.addEventListener('load',()=>hero.dataset.v122retry='0');
    }
  }

  document.addEventListener('error',e=>{
    const img=e.target;if(!(img instanceof HTMLImageElement)||img.dataset.v122global==='done')return;
    const data=window.V9_ASSET_DATA||{};
    const src=img.getAttribute('src')||'';
    const local=(src.match(/\/assets\/v9\/([^/?]+)\.webp/i)||[])[1];
    if(local&&data[local]){img.dataset.v122global='done';img.src=data[local];return;}
    if(local&&/^player[1-4]$/i.test(local)){
      const n=local.match(/[1-4]/)?.[0]||'1';img.dataset.v122global='done';img.src='/assets/v9/player'+n+'.webp?v=122&r='+Date.now();
    }
  },true);

  const loadImage=(key,src)=>new Promise(resolve=>{
    const img=new Image();let done=false;
    const finish=ok=>{if(done)return;done=true;clearTimeout(timer);resolve({key,ok,w:img.naturalWidth||0,h:img.naturalHeight||0});};
    img.onload=()=>finish(true);img.onerror=()=>finish(false);
    const timer=setTimeout(()=>finish(false),5000);img.src=src;
  });

  function rescueScript(key){
    const path='/assets/v9/'+key+'.js?v=122&audit='+Date.now();
    return new Promise(resolve=>{const s=document.createElement('script');s.src=path;s.onload=()=>resolve(true);s.onerror=()=>resolve(false);document.head.appendChild(s);});
  }

  async function audit(){
    if(auditRunning)return;auditRunning=true;
    const data=window.V9_ASSET_DATA||{};
    let results=await Promise.all(KEYS.map(([key,direct])=>loadImage(key,direct||data[key]||'')));
    const missing=results.filter(x=>!x.ok).map(x=>x.key);
    if(missing.length&&!auditRetried){
      auditRetried=true;
      await Promise.all(missing.filter(k=>!/^player/.test(k)).map(rescueScript));
      const d2=window.V9_ASSET_DATA||{};
      results=await Promise.all(KEYS.map(([key,direct])=>loadImage(key,direct||d2[key]||'')));
    }
    const failed=results.filter(x=>!x.ok).map(x=>x.key);
    const report={ts:Date.now(),version:'12.2',total:KEYS.length,ok:KEYS.length-failed.length,failed,results};
    window.__COSMIC_V122_AUDIT=report;
    try{localStorage.setItem('cosmicExplorerV122AssetAudit',JSON.stringify(report));}catch(_){ }
    window.dispatchEvent(new CustomEvent('cosmic:v122-audit',{detail:report}));
    const badge=$('#v122AuditBadge');if(badge){badge.textContent='ASSETS '+report.ok+'/'+report.total;badge.dataset.ok=failed.length?'0':'1';}
    auditRunning=false;
  }

  function debugBadge(){
    if(!new URLSearchParams(location.search).has('debug')||$('#v122AuditBadge'))return;
    const b=document.createElement('a');b.id='v122AuditBadge';b.href='/asset-check.html';b.textContent='ASSETS …';document.body.appendChild(b);
  }

  function polish(){
    guardImages();
    const tag=$('.v11tag');if(tag)tag.textContent='ARCADE SPACE MISSION · V12.2 ASSET SAFE MODE';
    debugBadge();
  }

  function registerSW(){
    if(!('serviceWorker' in navigator)||location.protocol!=='https:')return;
    navigator.serviceWorker.register('/sw-v122.js?v=122',{scope:'/'}).catch(()=>{});
  }

  const mo=new MutationObserver(polish);mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
  const ready=()=>{polish();registerSW();setTimeout(audit,350);};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
  window.addEventListener('cosmic:assets-ready',()=>setTimeout(audit,100));
})();