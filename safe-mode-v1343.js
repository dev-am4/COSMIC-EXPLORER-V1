(()=>{
  const p=new URLSearchParams(location.search);
  if(p.get('safe')!=='1')return;
  window.__COSMIC_SAFE_MODE=true;
  // Skip the deep V11.2→V13.4.2 transform stack after a boot failure, but retain fast boot/recovery.
  if(typeof window.__V1343_FASTBOOT_PATCH==='function')window.__V11_PHASE2_PATCH=window.__V1343_FASTBOOT_PATCH;
  try{document.documentElement.dataset.cosmicSafe='1'}catch(_){ }
})();