(()=>{
  const canvas=document.getElementById('game');
  if(!canvas) return;
  // Mobile direct-drag control: the ship follows the finger delta anywhere on the game field.
  // This dispatches the existing keyboard controls, so game physics/bounds remain authoritative.
  let active=false,lastX=0,lastY=0,keys={ArrowLeft:false,ArrowRight:false,ArrowUp:false,ArrowDown:false};
  const setKey=(key,on)=>{
    if(keys[key]===on) return;
    keys[key]=on;
    window.dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{key,code:key,bubbles:true}));
  };
  const release=()=>{ Object.keys(keys).forEach(k=>setKey(k,false)); active=false; };
  const move=(x,y)=>{
    const dx=x-lastX,dy=y-lastY; lastX=x; lastY=y;
    const dead=1.5;
    setKey('ArrowLeft',dx < -dead); setKey('ArrowRight',dx > dead);
    setKey('ArrowUp',dy < -dead); setKey('ArrowDown',dy > dead);
    // Keep movement responsive even when finger briefly stops between touchmove frames.
    clearTimeout(move.t); move.t=setTimeout(()=>Object.keys(keys).forEach(k=>setKey(k,false)),70);
  };
  canvas.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse') return;
    active=true; lastX=e.clientX; lastY=e.clientY;
    try{canvas.setPointerCapture(e.pointerId);}catch(_){}
    e.preventDefault();
  },{passive:false});
  canvas.addEventListener('pointermove',e=>{ if(!active)return; move(e.clientX,e.clientY); e.preventDefault(); },{passive:false});
  canvas.addEventListener('pointerup',release,{passive:false});
  canvas.addEventListener('pointercancel',release,{passive:false});
  canvas.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});

  // Asset diagnostics + cache-busted retry for iOS/Safari if an image failed during first preload.
  const assets=['player1','player2','player3','player4'];
  assets.forEach(name=>{
    const img=new Image();
    img.decoding='async';
    img.src=`/assets/v9/${name}.webp?v=10`;
    img.onerror=()=>console.warn('[COSMIC] missing player asset',name,img.src);
  });
})();
