(()=>{
  // V13.4.4 STABLE CORE: intentionally bypasses the accumulated runtime patch stack.
  // Keep the proven V11 core, start the render/input loop immediately, and let images load in background.
  window.__V11_PHASE2_PATCH=(input)=>{
    let code=input;
    code=code.split('?v=121').join('?v=1344');

    const bootRe=/loadImages\(\)\.then\(\(\)=>\{\s*fit\(\);\s*initStars\(\);\s*buildHome\(\);\s*setupControls\(\);\s*requestAnimationFrame\(frame\);\s*\}\);/;
    const stableBoot=`let __v1344Booted=false;
  function __v1344Boot(){
    if(__v1344Booted)return;
    __v1344Booted=true;
    fit();
    initStars();
    buildHome();
    setupControls();
    window.__COSMIC_ENGINE_READY=true;
    window.__COSMIC_VERSION='13.4.4';
    try{window.dispatchEvent(new CustomEvent('cosmic:engine-ready',{detail:{version:'13.4.4'}}));}catch(_){}
    requestAnimationFrame(frame);
  }
  __v1344Boot();
  Promise.resolve().then(()=>loadImages()).catch(e=>console.warn('[V13.4.4 asset load]',e));`;

    if(bootRe.test(code)) code=code.replace(bootRe,stableBoot);
    else console.error('[V13.4.4] stable boot target not found');

    // Prevent one draw/update error from looking like an endless loading screen.
    code=code.replace(/function frame\(ts\)\{\s*const dt=Math\.min\(\.033,\(ts-last\|\|16\)\/1000\);\s*last=ts;\s*update\(dt\);\s*draw\(\);\s*requestAnimationFrame\(frame\);\s*\}/,
`function frame(ts){
    const dt=Math.min(.033,(ts-last||16)/1000);last=ts;
    try{update(dt);draw();}
    catch(e){
      console.error('[V13.4.4 frame]',e);
      window.__COSMIC_RUNTIME_ERROR=String(e&&e.message||e);
      try{window.dispatchEvent(new CustomEvent('cosmic:runtime-error',{detail:{message:window.__COSMIC_RUNTIME_ERROR}}));}catch(_){}
    }
    requestAnimationFrame(frame);
  }`);

    return code;
  };
})();