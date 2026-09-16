(()=>{
  const fastBoot=(input)=>{
    let code=input;
    code=code.split('?v=1342').join('?v=1343').split('?v=121').join('?v=1343');

    // Do not block the engine/UI on all 22 images. Images keep loading in the background.
    const initRe=/loadImages\(\)\.then\(\(\)=>\{\s*fit\(\);\s*initStars\(\);\s*buildHome\(\);\s*setupControls\(\);\s*requestAnimationFrame\(frame\);\s*\}\);/;
    code=code.replace(initRe,`let v1343Booted=false,v1343Booting=false;
  function v1343ReadyBoot(){
    if(v1343Booted||v1343Booting)return;v1343Booting=true;
    try{
      fit();initStars();buildHome();setupControls();v1343Booted=true;v1343Booting=false;
      window.__COSMIC_ENGINE_READY=true;window.dispatchEvent(new CustomEvent('cosmic:engine-ready',{detail:{version:'13.4.3'}}));
      requestAnimationFrame(frame);
    }catch(e){v1343Booting=false;console.error('[V13.4.3 boot]',e);window.dispatchEvent(new CustomEvent('cosmic:runtime-error',{detail:{stage:'boot',message:String(e&&e.message||e)}}));}
  }
  Promise.resolve().then(()=>loadImages()).then(v1343ReadyBoot).catch(e=>{console.warn('[V13.4.3 assets]',e);v1343ReadyBoot();});
  setTimeout(v1343ReadyBoot,240);`);

    // A single rendering exception must not leave a permanently frozen canvas.
    const frameRe=/function frame\(ts\)\{\s*const dt=Math\.min\(\.033,\(ts-last\|\|16\)\/1000\);\s*last=ts;\s*update\(dt\);\s*draw\(\);\s*requestAnimationFrame\(frame\);\s*\}/;
    code=code.replace(frameRe,`function frame(ts){
    const dt=Math.min(.033,(ts-last||16)/1000);last=ts;
    if(state.v1343Fatal){requestAnimationFrame(frame);return;}
    try{update(dt);draw();state.v1343LastFrame=performance.now();}
    catch(e){
      state.v1343Fatal=true;playing=false;try{stopMusic();}catch(_){}
      const msg=String(e&&e.message||e);console.error('[V13.4.3 frame]',e);window.__COSMIC_RUNTIME_ERROR={ts:Date.now(),message:msg};
      window.dispatchEvent(new CustomEvent('cosmic:runtime-error',{detail:{stage:'frame',message:msg}}));
    }
    requestAnimationFrame(frame);
  }`);

    // The old robust asset loader can otherwise wait 6.5s on a dead image candidate.
    code=code.replace(/},6500\);/g,'},2200);');
    return code;
  };

  window.__V1343_FASTBOOT_PATCH=fastBoot;
  window.__V1343_PATCH=(code)=>{
    code=fastBoot(code);
    // Publish fast-boot state in the normal diagnostics API when the advanced stack is active.
    code=code.replace("status:()=>({",`status:()=>({engineReady:!!window.__COSMIC_ENGINE_READY,bootVersion:'13.4.3',`);
    return code;
  };

  const previous=window.__V11_PHASE2_PATCH;
  if(typeof previous==='function'&&!previous.__v1343Wrapped){
    const wrapped=(code)=>window.__V1343_PATCH(previous(code));
    wrapped.__v1343Wrapped=true;
    window.__V11_PHASE2_PATCH=wrapped;
  }
})();