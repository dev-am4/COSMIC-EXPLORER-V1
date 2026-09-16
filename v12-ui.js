(()=>{
  const $=s=>document.querySelector(s);
  const KEY='cosmicExplorerV12Leaderboard';
  const SETTINGS='cosmicExplorerV12Settings';
  const readSettings=()=>{try{return Object.assign({difficulty:'normal',attractDelay:15,sound:true,kiosk:false},JSON.parse(localStorage.getItem(SETTINGS)||'{}'));}catch(_){return {difficulty:'normal',attractDelay:15,sound:true,kiosk:false};}};
  const readBoard=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]');}catch(_){return [];}};
  const writeBoard=b=>{try{localStorage.setItem(KEY,JSON.stringify(b.slice(0,10)));}catch(_){}};

  function saveReport(r){
    if(!r||!Number.isFinite(Number(r.score))) return;
    const board=readBoard();
    board.push({score:Number(r.score)||0,rank:r.rank||'C',kills:Number(r.kills)||0,bosses:Number(r.bosses)||0,combo:Number(r.combo)||0,hp:Number(r.hp)||0,elapsed:Number(r.elapsed)||0,ts:Date.now()});
    board.sort((a,b)=>b.score-a.score||b.bosses-a.bosses||a.elapsed-b.elapsed);
    writeBoard(board);
    syncHomeBest();
  }

  function syncHomeBest(){
    const board=readBoard(),best=board[0]?.score||Number(localStorage.getItem('cosmicExplorerV11HighScore')||0)||0;
    let el=$('#v12Best');
    if(!el){
      el=document.createElement('div'); el.id='v12Best'; el.className='v12-best';
      const row=$('#home .start-row'); if(row) row.parentNode.insertBefore(el,row);
    }
    if(el) el.innerHTML=`<span>BEST SCORE</span><strong>${best.toLocaleString()}</strong>`;
  }

  function renderBoard(){
    const list=$('#v12BoardList'); if(!list) return;
    const board=readBoard();
    if(!board.length){list.innerHTML='<div class="v12-empty">NO SCORES YET</div>';return;}
    list.innerHTML=board.map((r,i)=>{
      const m=Math.floor((r.elapsed||0)/60),s=String((r.elapsed||0)%60).padStart(2,'0');
      return `<div class="v12-score-row"><b>#${i+1}</b><strong>${Number(r.score).toLocaleString()}</strong><span>RANK ${r.rank}</span><span>${r.bosses}/4 BOSSES</span><span>${m}:${s}</span></div>`;
    }).join('');
  }

  function fullscreen(){
    const root=document.documentElement;
    if(!document.fullscreenElement){
      (root.requestFullscreen||root.webkitRequestFullscreen)?.call(root).catch?.(()=>{});
    }else{(document.exitFullscreen||document.webkitExitFullscreen)?.call(document);}
  }

  function build(){
    if($('#v12Toolbar')) return;
    const cfg=readSettings();
    const toolbar=document.createElement('div'); toolbar.id='v12Toolbar'; toolbar.innerHTML=`
      <button id="v12PauseBtn" aria-label="Pause">Ⅱ</button>
      <button id="v12FullBtn" aria-label="Fullscreen">⛶</button>`;
    document.body.appendChild(toolbar);

    const homeTools=document.createElement('div'); homeTools.id='v12HomeTools'; homeTools.innerHTML=`
      <button id="v12LeaderboardBtn">LEADERBOARD</button>
      <button id="v12HomeFullBtn">FULLSCREEN</button>
      <a href="/operator.html" id="v12OperatorBtn">OPERATOR</a>
      <span id="v12DifficultyBadge">${String(cfg.difficulty||'normal').toUpperCase()}</span>`;
    const card=$('#home .home-card'); if(card) card.appendChild(homeTools);

    const pause=document.createElement('div'); pause.id='v12Pause'; pause.className='hidden'; pause.innerHTML=`
      <div class="v12-modal-card v12-pause-card">
        <small>MISSION CONTROL</small><h2>PAUSED</h2>
        <div class="v12-pause-actions"><button id="v12Resume">RESUME</button><button id="v12Restart">RESTART</button><button id="v12PauseFull">FULLSCREEN</button><a href="/operator.html">OPERATOR</a></div>
        <p>ESC / P TO RESUME</p>
      </div>`;
    document.body.appendChild(pause);

    const board=document.createElement('div'); board.id='v12Board'; board.className='hidden'; board.innerHTML=`
      <div class="v12-modal-card v12-board-card"><button class="v12-close" id="v12BoardClose">×</button><small>LOCAL ARCADE RECORDS</small><h2>TOP 10</h2><div id="v12BoardList"></div></div>`;
    document.body.appendChild(board);

    $('#v12PauseBtn').onclick=()=>window.dispatchEvent(new Event('cosmic:v12-toggle-pause'));
    $('#v12FullBtn').onclick=fullscreen; $('#v12HomeFullBtn').onclick=fullscreen; $('#v12PauseFull').onclick=fullscreen;
    $('#v12Resume').onclick=()=>window.__COSMIC_V12?.pause(false);
    $('#v12Restart').onclick=()=>{pause.classList.add('hidden');window.__COSMIC_V12?.restart();};
    $('#v12LeaderboardBtn').onclick=()=>{renderBoard();board.classList.remove('hidden');};
    $('#v12BoardClose').onclick=()=>board.classList.add('hidden');
    board.addEventListener('pointerdown',e=>{if(e.target===board)board.classList.add('hidden');});

    window.addEventListener('keydown',e=>{
      if((e.key==='Escape'||e.key.toLowerCase()==='p')&&!$('#home')?.classList.contains('hidden')===false) return;
      if((e.key==='Escape'||e.key.toLowerCase()==='p')&&$('#home')?.classList.contains('hidden')&&!$('#gameOver')?.classList.contains('hidden')) return;
      if((e.key==='Escape'||e.key.toLowerCase()==='p')&&$('#home')?.classList.contains('hidden')){e.preventDefault();window.dispatchEvent(new Event('cosmic:v12-toggle-pause'));}
    });

    window.addEventListener('cosmic:v12-pause-state',e=>{
      const on=!!e.detail?.paused; pause.classList.toggle('hidden',!on); toolbar.classList.toggle('v12-paused',on);
    });
    window.addEventListener('cosmic:v12-start',()=>{toolbar.classList.add('v12-playing');pause.classList.add('hidden');});
    window.addEventListener('cosmic:report',e=>{toolbar.classList.remove('v12-playing');saveReport(e.detail);});

    const sound=$('#soundBtn'); if(sound&&cfg.sound===false&&/ON/i.test(sound.textContent)) setTimeout(()=>sound.click(),50);
    if(cfg.kiosk){ document.body.classList.add('v12-kiosk'); homeTools.querySelector('#v12OperatorBtn')?.classList.add('hidden'); }
    syncHomeBest();
  }

  const t=setInterval(()=>{if($('#home .home-card')){clearInterval(t);build();}},80);
  window.addEventListener('load',build,{once:true});
})();