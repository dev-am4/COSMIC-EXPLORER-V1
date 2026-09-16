(()=>{
  const $=s=>document.querySelector(s);
  let badge=null,lastQuality='';
  function cfg(){try{return JSON.parse(localStorage.getItem('cosmicExplorerV12Settings')||'{}')||{};}catch(_){return {};}}
  function buildBadge(){if(badge)return badge;badge=document.createElement('div');badge.id='v1341PerfBadge';badge.className='hidden';badge.innerHTML='<small>PERF</small><b>60 FPS</b><span>AUTO · HIGH</span>';document.body.appendChild(badge);return badge;}
  function applyQuery(){const p=new URLSearchParams(location.search),mode=p.get('perf');if(!['auto','high','balanced','low'].includes(mode))return;try{const c=cfg();c.performanceMode=mode;localStorage.setItem('cosmicExplorerV12Settings',JSON.stringify(c));}catch(_){ }const run=()=>window.__COSMIC_V12?.setPerformance?.(mode);if(!run())setTimeout(run,900);}
  function tick(){const st=window.__COSMIC_V12?.status?.();if(!st)return;const q=st.performanceQuality||'high',mode=st.performanceMode||'auto';if(q!==lastQuality){document.documentElement.dataset.cosmicPerf=q;lastQuality=q;}const c=cfg(),show=!!c.fps||new URLSearchParams(location.search).get('diag')==='1';const el=buildBadge();el.classList.toggle('hidden',!show);if(show){el.querySelector('b').textContent=(st.fps||0)+' FPS';el.querySelector('span').textContent=mode.toUpperCase()+' · '+q.toUpperCase();el.dataset.quality=q;}}
  function ready(){const tag=$('.v11tag');if(tag)tag.textContent='ARCADE SPACE MISSION · V13.4.1 PERFORMANCE';applyQuery();setInterval(tick,500);tick();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();