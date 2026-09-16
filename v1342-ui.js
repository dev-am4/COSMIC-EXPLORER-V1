(()=>{
  const $=s=>document.querySelector(s), QA_KEY='cosmicExplorerPerfQA', SETTINGS='cosmicExplorerV12Settings';
  let running=false,timer=null,samples=[],started=0,lastStage=-1,previousMode='auto';
  const params=new URLSearchParams(location.search);
  const isQa=params.get('perfqa')==='1';

  function cfg(){try{return JSON.parse(localStorage.getItem(SETTINGS)||'{}')||{};}catch(_){return {};}}
  function saveCfg(c){try{localStorage.setItem(SETTINGS,JSON.stringify(c));}catch(_){ }}
  function register(){if('serviceWorker'in navigator&&location.protocol==='https:')setTimeout(()=>navigator.serviceWorker.register('/sw-v1342.js?v=1342',{scope:'/'}).catch(()=>{}),900)}

  function build(){
    if(!isQa||$('#v1342Qa'))return;
    const el=document.createElement('div');el.id='v1342Qa';el.innerHTML=`<div class="v1342-card">
      <div class="v1342-ey">PERFORMANCE QA · 60 SEC</div><strong id="v1342Title">PREPARING TEST</strong>
      <div class="v1342-grid"><div><span>TIME</span><b id="v1342Time">60s</b></div><div><span>FPS</span><b id="v1342Fps">—</b></div><div><span>SECTOR</span><b id="v1342Sector">—</b></div><div><span>LOAD</span><b id="v1342Load">—</b></div></div>
      <div class="v1342-bar"><i id="v1342Fill"></i></div><p id="v1342Hint">Runs all four bosses on HIGH quality to measure worst-case load.</p>
      <div id="v1342Result" class="hidden"></div><div class="v1342-actions hidden" id="v1342Actions"><button id="v1342Apply">APPLY RECOMMENDATION</button><button id="v1342Again">RUN AGAIN</button><button id="v1342Close">CLOSE</button></div>
    </div>`;document.body.appendChild(el);
  }

  function status(){return window.__COSMIC_V12?.status?.()||null;}
  function api(){return window.__COSMIC_V12||null;}
  function q(v){return Math.round(v*10)/10;}
  function recommendation(avg,p10,min,below){
    if(avg>=56&&p10>=50&&below<=8)return'high';
    if(avg>=48&&p10>=39&&min>=28)return'balanced';
    return'low';
  }
  function resultText(r){return `<div class="v1342-result-title">RECOMMENDED · ${r.recommendation.toUpperCase()}</div><div class="v1342-result-grid"><span>AVG <b>${r.avg} FPS</b></span><span>P10 <b>${r.p10} FPS</b></span><span>MIN <b>${r.min} FPS</b></span><span>&lt;45 FPS <b>${r.below45}%</b></span></div><small>Tested in HIGH mode across Earth, Moon, Mars and Black Hole boss load.</small>`;}

  function finish(){
    if(!running)return;running=false;clearInterval(timer);timer=null;
    const good=samples.filter(n=>Number.isFinite(n)&&n>0).sort((a,b)=>a-b);const avg=good.length?good.reduce((a,b)=>a+b,0)/good.length:0,min=good[0]||0,p10=good[Math.min(good.length-1,Math.floor(good.length*.10))]||0,below=good.length?good.filter(n=>n<45).length/good.length*100:100;
    const rec=recommendation(avg,p10,min,below),r={ts:Date.now(),version:'13.4.2',duration:60,avg:q(avg),p10:q(p10),min:q(min),below45:q(below),recommendation:rec,samples:good.length,hardware:{cores:navigator.hardwareConcurrency||null,memory:navigator.deviceMemory||null}};
    try{localStorage.setItem(QA_KEY,JSON.stringify(r));}catch(_){ }
    const a=api();a?.perfQA?.(false);a?.setPerformance?.(previousMode);a?.home?.();
    $('#v1342Title').textContent='TEST COMPLETE';$('#v1342Time').textContent='DONE';$('#v1342Fill').style.width='100%';$('#v1342Result').innerHTML=resultText(r);$('#v1342Result').classList.remove('hidden');$('#v1342Actions').classList.remove('hidden');$('#v1342Hint').textContent='Recommendation is saved locally. Apply only if you want this machine locked to that mode.';
    $('#v1342Apply').onclick=()=>{const c=cfg();c.performanceMode=rec;saveCfg(c);a?.setPerformance?.(rec);$('#v1342Apply').textContent='APPLIED · '+rec.toUpperCase();};
    $('#v1342Again').onclick=()=>location.reload();$('#v1342Close').onclick=()=>location.href='/';
  }

  function stage(sec,elapsed){
    const a=api();if(!a)return;const local=elapsed-sec*15;
    if(sec!==lastStage){lastStage=sec;a.testBoss?.(sec);$('#v1342Sector').textContent=['EARTH','MOON','MARS','BLACK HOLE'][sec]||'—';}
    if(local>5&&local<5.8)a.bossQA?.('breakArmor');
    if(local>8&&local<8.8)a.bossQA?.('phase3');
  }

  function start(){
    const a=api();if(!a){setTimeout(start,180);return;}running=true;samples=[];started=performance.now();lastStage=-1;const c=cfg();previousMode=['auto','high','balanced','low'].includes(c.performanceMode)?c.performanceMode:'auto';
    a.setPerformance?.('high');a.perfQA?.(true);stage(0,0);$('#v1342Title').textContent='WORST-CASE BOSS LOAD';
    timer=setInterval(()=>{if(!running)return;const st=status(),elapsed=(performance.now()-started)/1000,left=Math.max(0,60-elapsed),sec=Math.min(3,Math.floor(elapsed/15));stage(sec,elapsed);if(st?.fps)samples.push(Number(st.fps));$('#v1342Time').textContent=Math.ceil(left)+'s';$('#v1342Fps').textContent=(st?.fps||0)+' FPS';$('#v1342Load').textContent=(st?.performanceQuality||'high').toUpperCase();$('#v1342Fill').style.width=Math.min(100,elapsed/60*100)+'%';if(elapsed>=60)finish();},500);
  }

  function ready(){
    const tag=$('.v11tag');if(tag)tag.textContent='ARCADE SPACE MISSION · V13.4.2 PERFORMANCE QA';register();
    if(!isQa)return;build();start();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();