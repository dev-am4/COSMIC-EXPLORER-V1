(()=>{
  const $=s=>document.querySelector(s);
  const arena=$('#arena'); if(!arena) return;
  const fx=document.createElement('canvas'); fx.id='v7FxCanvas'; arena.prepend(fx);
  ['v7-nebula-layer','v7-speedlines','v7-scan','v7-vignette','v7-fireglow'].forEach(c=>{const d=document.createElement('div');d.className=c;arena.appendChild(d)});
  const tl=document.createElement('i'),br=document.createElement('i');tl.className='v7-corner tl';br.className='v7-corner br';arena.append(tl,br);
  const flash=document.createElement('div');flash.className='v7-flash';arena.appendChild(flash);
  const ctx=fx.getContext('2d',{alpha:true});let W=0,H=0,dpr=1,t=0,boost=false;
  const stars=Array.from({length:170},()=>({x:Math.random(),y:Math.random(),z:Math.random(),p:Math.random()*6.28}));
  const dust=Array.from({length:28},()=>({x:Math.random(),y:Math.random(),r:20+Math.random()*100,a:.015+Math.random()*.05,h:180+Math.random()*110}));
  function resize(){const r=arena.getBoundingClientRect();dpr=Math.min(2,devicePixelRatio||1);W=Math.max(1,r.width);H=Math.max(1,r.height);fx.width=W*dpr;fx.height=H*dpr;fx.style.width=W+'px';fx.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
  new ResizeObserver(resize).observe(arena);resize();
  function sectorHue(){const s=($('#hudSector')?.textContent||'EARTH').toUpperCase();return s.includes('MARS')?18:s.includes('MOON')?210:s.includes('BLACK')?286:198}
  function draw(){t+=.016;ctx.clearRect(0,0,W,H);const hue=sectorHue();
    dust.forEach((d,i)=>{const y=(d.y*H+(t*(4+i%3)))%H,g=ctx.createRadialGradient(d.x*W,y,0,d.x*W,y,d.r*2.6);g.addColorStop(0,`hsla(${(hue+i*5)%360},90%,62%,${d.a})`);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.beginPath();ctx.arc(d.x*W,y,d.r*2.6,0,Math.PI*2);ctx.fill()});
    stars.forEach((s,i)=>{const speed=(18+s.z*72)*(boost?4.8:1);s.y=(s.y+speed/Math.max(800,H)/60)%1;const x=s.x*W,y=s.y*H,sz=.7+s.z*1.8;ctx.globalAlpha=.22+s.z*.7;ctx.strokeStyle=i%11===0?'#ffb9e2':i%7===0?'#91f4ff':'#fff';ctx.lineWidth=sz;if(boost){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-22-s.z*70);ctx.stroke()}else{ctx.beginPath();ctx.arc(x,y,sz,0,Math.PI*2);ctx.fillStyle=ctx.strokeStyle;ctx.fill()}});ctx.globalAlpha=1;requestAnimationFrame(draw)
  }draw();
  const boostBtn=$('#boostBtn'),shootBtn=$('#shootBtn');
  const setBoost=v=>{boost=v;arena.classList.toggle('v7-boost',v)};
  ['pointerdown','touchstart'].forEach(e=>boostBtn?.addEventListener(e,()=>setBoost(true),{passive:true}));
  ['pointerup','pointercancel','touchend','touchcancel'].forEach(e=>boostBtn?.addEventListener(e,()=>setBoost(false),{passive:true}));
  document.addEventListener('keydown',e=>{if(e.key==='Shift')setBoost(true)});document.addEventListener('keyup',e=>{if(e.key==='Shift')setBoost(false)});
  function popFlash(bg){if(bg)flash.style.background=bg;flash.classList.remove('on');void flash.offsetWidth;flash.classList.add('on')}
  let firePulse=0;function fireFX(){if(performance.now()-firePulse>100){firePulse=performance.now();popFlash('radial-gradient(circle at 50% 72%,rgba(255,255,190,.45),rgba(255,87,178,.14) 15%,transparent 44%)')}}
  ['pointerdown','touchstart'].forEach(e=>shootBtn?.addEventListener(e,fireFX,{passive:true}));
  ['#bossBanner','#sectorNotice','#waveBanner'].map($).filter(Boolean).forEach(el=>new MutationObserver(()=>{if(!el.classList.contains('hidden'))popFlash(el.id==='bossBanner'?'radial-gradient(circle,rgba(255,80,137,.5),transparent 56%)':'radial-gradient(circle,rgba(90,226,255,.45),transparent 55%)')}).observe(el,{attributes:true,childList:true,subtree:true}));
})();
