(()=>{
  window.__V1342_PATCH=(code)=>{
    code=code.split('?v=1341').join('?v=1342');
    const hits={};
    const rep=(name,find,replacement)=>{const before=code;code=code.replace(find,replacement);hits[name]=before!==code;};

    rep('qa-helper',"function spawnEnemy(){",`function v1342QaTick(dt){
    if(!state.v1342Qa||!playing)return;
    const p=state.player;if(!p)return;
    const tt=state.time||0;
    if(p.maxHp!=null)p.hp=p.maxHp;else p.hp=Math.max(100,p.hp||0);
    p.shield=Math.max(999,p.shield||0);
    p.x=W*.5+Math.sin(tt*.86)*Math.min(W*.27,220);
    p.y=H*.72+Math.sin(tt*1.27)*Math.min(H*.065,42);
    if(state.keys){state.keys.up=false;state.keys.down=false;state.keys.left=false;state.keys.right=false;state.keys.boost=false;}
  }

  function spawnEnemy(){`);

    rep('qa-tick',"state.v134WeakFlash=Math.max(0,(state.v134WeakFlash||0)-dt);v1341PerfTick(dt);",`state.v134WeakFlash=Math.max(0,(state.v134WeakFlash||0)-dt);v1341PerfTick(dt);v1342QaTick(dt);`);

    const beforeApi=code;
    code=code.replace(/diagnostics:\(\)=>\(\{fps:Math\.round\(v1341Init\(\)\.fps\|\|0\),mode:v1341Init\(\)\.mode,quality:v1341Init\(\)\.quality,particles:state\.particles\?\.length\|\|0,enemyBullets:state\.enemyBullets\?\.length\|\|0,playerBullets:state\.bullets\?\.length\|\|0,stars:state\.stars\?\.length\|\|0\}\)/,m=>m+`,
      perfQA:(on)=>{state.v1342Qa=!!on;if(state.v1342Qa){state.v12Paused=false;state.v11Attract=false;if(state.player){if(state.player.maxHp!=null)state.player.hp=state.player.maxHp;state.player.shield=999;}}return state.v1342Qa;},
      patchHealth:()=>window.__COSMIC_V1342_PATCH_HEALTH||null`);
    hits['qa-api']=beforeApi!==code;

    rep('highscore-isolation',"if(!state.v11Attract&&score>best){best=score;localStorage.setItem('cosmicExplorerV11HighScore',String(score));}","if(!state.v11Attract&&!state.v1342Qa&&score>best){best=score;localStorage.setItem('cosmicExplorerV11HighScore',String(score));}");

    // Keep the heaviest cinematic loops inside the adaptive render budget.
    rep('earth-death-budget',"for(let i=0;i<8;i++){const a=Math.PI*2*i/8+t*.18;","for(let i=0,n=v1341Budget(8,6,4);i<n;i++){const a=Math.PI*2*i/n+t*.18;");
    rep('moon-death-budget',"for(let i=0;i<4;i++){ctx.strokeStyle='rgba(225,240,255,'","for(let i=0;i<v1341Budget(4,3,2);i++){ctx.strokeStyle='rgba(225,240,255,'");
    rep('mars-death-budget',"for(let i=0;i<18;i++){const a=Math.PI*2*i/18+i*.37,r=24+age*(70+(i%5)*24);","for(let i=0,n=v1341Budget(18,12,8);i<n;i++){const a=Math.PI*2*i/n+i*.37,r=24+age*(70+(i%5)*24);");
    rep('void-ring-budget',"for(let i=0;i<4;i++){ctx.strokeStyle='rgba('+(150+i*18)+','+(75+i*8)+',255,'","for(let i=0;i<v1341Budget(4,3,2);i++){ctx.strokeStyle='rgba('+(150+i*18)+','+(75+i*8)+',255,'");

    window.__COSMIC_V1342_PATCH_HEALTH={version:'13.4.2',ts:Date.now(),hits};
    return code;
  };

  const previous=window.__V11_PHASE2_PATCH;
  if(typeof previous==='function'&&!previous.__v1342Wrapped){
    const wrapped=(code)=>window.__V1342_PATCH(previous(code));
    wrapped.__v1342Wrapped=true;
    window.__V11_PHASE2_PATCH=wrapped;
  }
})();