(()=>{
  const canvas=document.getElementById('game');
  if(!canvas) return;

  // V10.1 mobile control: use the whole playfield as a virtual joystick.
  // Drag direction stays active while the finger is held; release stops immediately.
  let active=false,startX=0,startY=0,pointerId=null;
  const held={ArrowLeft:false,ArrowRight:false,ArrowUp:false,ArrowDown:false};
  const emit=(key,on)=>{
    if(held[key]===on) return;
    held[key]=on;
    window.dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{key,code:key,bubbles:true,cancelable:true}));
  };
  const stop=()=>{
    Object.keys(held).forEach(k=>emit(k,false));
    active=false; pointerId=null;
  };
  const steer=(x,y)=>{
    const dx=x-startX,dy=y-startY;
    const dead=10;
    emit('ArrowLeft',dx < -dead);
    emit('ArrowRight',dx > dead);
    emit('ArrowUp',dy < -dead);
    emit('ArrowDown',dy > dead);
  };

  canvas.style.touchAction='none';
  canvas.style.webkitUserSelect='none';
  canvas.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse') return;
    active=true; pointerId=e.pointerId; startX=e.clientX; startY=e.clientY;
    try{canvas.setPointerCapture(e.pointerId);}catch(_){}
    e.preventDefault();
  },{passive:false});
  canvas.addEventListener('pointermove',e=>{
    if(!active || (pointerId!==null && e.pointerId!==pointerId)) return;
    steer(e.clientX,e.clientY); e.preventDefault();
  },{passive:false});
  canvas.addEventListener('pointerup',e=>{ if(pointerId===null||e.pointerId===pointerId) stop(); e.preventDefault(); },{passive:false});
  canvas.addEventListener('pointercancel',stop,{passive:false});
  canvas.addEventListener('lostpointercapture',stop);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  canvas.addEventListener('touchstart',e=>e.preventDefault(),{passive:false});
  canvas.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});

  // Preload real local player art before/alongside the game loader.
  // Keep strong references so iOS Safari does not discard decoded images aggressively.
  window.__COSMIC_PLAYER_PRELOAD=window.__COSMIC_PLAYER_PRELOAD||{};
  ['player1','player2','player3','player4'].forEach(name=>{
    const img=new Image();
    img.decoding='async';
    img.onload=()=>{
      window.__COSMIC_PLAYER_PRELOAD[name]=img;
      if(img.decode) img.decode().catch(()=>{});
    };
    img.onerror=()=>console.error('[COSMIC V10.1] player asset failed:',name,img.src);
    img.src=`/assets/v9/${name}.webp?v=101`;
    window.__COSMIC_PLAYER_PRELOAD[name]=img;
  });
})();
