(()=>{
  const expected=[
    ['enemy1','/assets/v9/enemy1.js'],['enemy2','/assets/v9/enemy2.js'],['enemy3','/assets/v9/enemy3.js'],['enemy4','/assets/v9/enemy4.js'],
    ['boss1','/assets/v9/boss1.js'],['boss2','/assets/v9/boss2.js'],['boss3','/assets/v9/boss3.js'],['boss4','/assets/v9/boss4.js'],
    ['planet-earth','/assets/v9/planet-earth.js'],['planet-moon','/assets/v9/planet-moon.js'],['planet-mars','/assets/v9/planet-mars.js'],['planet-hole','/assets/v9/planet-hole.js'],
    ['pickup-energy','/assets/v9/pickup-energy.js'],['pickup-repair','/assets/v9/pickup-repair.js'],['pickup-shield','/assets/v9/pickup-shield.js'],['pickup-weapon','/assets/v9/pickup-weapon.js'],['pickup-rocket','/assets/v9/pickup-rocket.js'],['pickup-bomb','/assets/v9/pickup-bomb.js']
  ];
  const missingInitial=[],retried=[];
  window.V9_ASSET_DATA=window.V9_ASSET_DATA||{};
  const retry=(key,path)=>{
    if(window.V9_ASSET_DATA[key]) return;
    missingInitial.push(key);
    const src=path+'?v=122&rescue='+Date.now();
    if(document.readyState==='loading'){
      document.write('<script src="'+src.replace(/"/g,'&quot;')+'"><\\/script>');
      retried.push(key);
      return;
    }
    const s=document.createElement('script');s.src=src;s.async=false;document.head.appendChild(s);retried.push(key);
  };
  expected.forEach(([key,path])=>retry(key,path));

  // Warm the four real ship files before the game builds its selector.
  const ships=[];
  for(let i=1;i<=4;i++){
    const img=new Image();img.decoding='async';img.src='/assets/v9/player'+i+'.webp?v=122';ships.push(img);
  }
  window.__COSMIC_V122_SHIP_WARMUP=ships;

  const finish=()=>{
    const stillMissing=expected.filter(([key])=>!window.V9_ASSET_DATA[key]).map(([key])=>key);
    const status={ts:Date.now(),expected:expected.length,missingInitial,retried,stillMissing};
    window.__COSMIC_ASSET_BOOT=status;
    try{localStorage.setItem('cosmicExplorerV122BootAssets',JSON.stringify(status));}catch(_){ }
    window.dispatchEvent(new CustomEvent('cosmic:v122-asset-boot',{detail:status}));
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',finish,{once:true});else finish();
})();