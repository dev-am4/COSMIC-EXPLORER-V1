(()=>{
  const apply=()=>{
    const tag=document.querySelector('.v11tag');
    if(tag)tag.textContent='ARCADE SPACE MISSION · V13.4.5 BOSS CORE';
    window.__COSMIC_UI_VERSION='13.4.5';
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  window.addEventListener('cosmic:engine-ready',()=>{
    if(window.__COSMIC_PATCH_STATUS)console.info('[COSMIC V13.4.5]',window.__COSMIC_PATCH_STATUS);
  },{once:true});
})();