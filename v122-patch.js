(()=>{
  window.__V122_PATCH=(code)=>{
    // Move every V12.1 asset retry URL onto the V12.2 cache line.
    code=code.split('?v=121').join('?v=122');
    code=code.replace("window.__COSMIC_ASSET_STATUS=status;",`status.boot=window.__COSMIC_ASSET_BOOT||null;
      status.version='12.2';
      window.__COSMIC_ASSET_STATUS=status;`);
    return code;
  };
  const previous=window.__V11_PHASE2_PATCH;
  if(typeof previous==='function'&&!previous.__v122Wrapped){
    const wrapped=(code)=>window.__V122_PATCH(previous(code));
    wrapped.__v122Wrapped=true;
    window.__V11_PHASE2_PATCH=wrapped;
  }
})();