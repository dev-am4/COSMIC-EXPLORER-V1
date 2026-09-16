(()=>{
  const SHIPS=[
    {name:'ARCADE STAR',role:'ALL-ROUND',src:'/assets/v9/player1.webp?v=110'},
    {name:'PINK SHUTTLE',role:'FAST',src:'/assets/v9/player2.webp?v=110'},
    {name:'NEON ARMOR',role:'ARMOR',src:'/assets/v9/player3.webp?v=110'},
    {name:'WHITE VIOLET',role:'BALANCED',src:'/assets/v9/player4.webp?v=110'}
  ];
  let selected=0,ready=false,touchX=0,touchY=0;
  const $=s=>document.querySelector(s);

  function buildSelector(){
    if(ready) return;
    const base=$('#shipSelect');
    const startRow=$('#home .start-row');
    if(!base||!startRow||base.children.length<4) return;
    ready=true;
    base.setAttribute('aria-hidden','true');

    const stage=document.createElement('div');
    stage.className='v11-stage';
    stage.innerHTML=`
      <button class="v11-arrow v11-prev" aria-label="Previous ship">‹</button>
      <div class="v11-hero">
        <div class="v11-orbit v11-orbit-a"></div><div class="v11-orbit v11-orbit-b"></div>
        <div class="v11-ship-glow"></div>
        <img id="v11ShipImg" alt="Selected ship">
        <div class="v11-ship-copy"><strong id="v11ShipName"></strong><span id="v11ShipRole"></span></div>
        <div class="v11-dots" id="v11Dots"></div>
      </div>
      <button class="v11-arrow v11-next" aria-label="Next ship">›</button>`;
    startRow.parentNode.insertBefore(stage,startRow);
    SHIPS.forEach((_,i)=>{const d=document.createElement('button');d.type='button';d.className='v11-dot';d.setAttribute('aria-label','Ship '+(i+1));d.onclick=()=>select(i);$('#v11Dots').appendChild(d);});
    $('.v11-prev').onclick=()=>select(selected-1);
    $('.v11-next').onclick=()=>select(selected+1);

    stage.addEventListener('touchstart',e=>{const t=e.changedTouches[0];touchX=t.clientX;touchY=t.clientY;},{passive:true});
    stage.addEventListener('touchend',e=>{const t=e.changedTouches[0],dx=t.clientX-touchX,dy=t.clientY-touchY;if(Math.abs(dx)>42&&Math.abs(dx)>Math.abs(dy)*1.25) select(selected+(dx<0?1:-1));},{passive:true});
    window.addEventListener('keydown',e=>{if(!$('#home')?.classList.contains('hidden')){if(e.key==='ArrowLeft')select(selected-1);if(e.key==='ArrowRight')select(selected+1);}});
    select(0);
  }

  function select(i){
    selected=(i+SHIPS.length)%SHIPS.length;
    const cards=[...document.querySelectorAll('#shipSelect .ship-card')];
    if(cards[selected]) cards[selected].click();
    const s=SHIPS[selected],img=$('#v11ShipImg');
    if(img){img.classList.remove('swap');void img.offsetWidth;img.src=s.src;img.classList.add('swap');}
    if($('#v11ShipName')) $('#v11ShipName').textContent=s.name;
    if($('#v11ShipRole')) $('#v11ShipRole').textContent=s.role;
    document.querySelectorAll('.v11-dot').forEach((d,n)=>d.classList.toggle('active',n===selected));
  }

  function tutorial(){
    let tip=$('#v11Tutorial');
    if(!tip){tip=document.createElement('div');tip.id='v11Tutorial';tip.innerHTML='<strong>DRAG TO MOVE</strong><span>AUTO FIRE ENABLED</span>';document.body.appendChild(tip);}
    tip.classList.remove('hide');
    const dismiss=()=>{tip.classList.add('hide');window.removeEventListener('pointerdown',dismiss,true);};
    setTimeout(()=>window.addEventListener('pointerdown',dismiss,true),320);
    setTimeout(dismiss,3200);
  }

  const start=$('#startBtn');
  if(start) start.addEventListener('click',()=>setTimeout(tutorial,180));

  const sound=$('#soundBtn');
  if(sound){
    const sync=()=>{const off=/OFF/i.test(sound.textContent);sound.dataset.off=off?'1':'0';sound.setAttribute('aria-label',off?'Sound off':'Sound on');};
    sound.addEventListener('click',()=>setTimeout(sync,0));sync();
  }

  const timer=setInterval(()=>{buildSelector();if(ready)clearInterval(timer);},80);
  window.addEventListener('load',buildSelector,{once:true});
})();