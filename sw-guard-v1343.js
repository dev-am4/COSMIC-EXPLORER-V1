(()=>{
  if(!('serviceWorker' in navigator))return;
  const sw=navigator.serviceWorker,latest='/sw-v1343.js?v=1343';
  let nativeRegister=null;
  try{nativeRegister=sw.register.bind(sw);window.__COSMIC_SW_NATIVE_REGISTER=nativeRegister;}catch(_){return;}
  const guarded=(url,opts)=>{
    const src=String(url||'');
    if(/\/sw-v\d+\.js/i.test(src)||src.includes('sw-v1343.js')){
      const o=Object.assign({},opts||{},{scope:'/',updateViaCache:'none'});
      return nativeRegister(latest,o);
    }
    return nativeRegister(url,opts);
  };
  try{Object.defineProperty(sw,'register',{configurable:true,value:guarded});window.__COSMIC_SW_GUARD_OK=true;}
  catch(_){try{sw.register=guarded;window.__COSMIC_SW_GUARD_OK=sw.register===guarded;}catch(__){window.__COSMIC_SW_GUARD_OK=false;}}
})();