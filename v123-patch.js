(()=>{
  window.__V123_PATCH=(code)=>{
    // Keep runtime image retries on the newest cache line.
    code=code.split('?v=122').join('?v=123');

    // Extend field telemetry for cinematic overlays without coupling the UI to the game closure.
    code=code.replace(
      "status:()=>({playing,paused:!!state.v12Paused,difficulty:v12Difficulty().label,attractDelay:state.v12AttractDelay,time:state.time||0,sector:state.sector,bossActive:!!state.bossActive})",
      `status:()=>({
        playing,paused:!!state.v12Paused,difficulty:v12Difficulty().label,attractDelay:state.v12AttractDelay,
        time:state.time||0,sector:state.sector,bossActive:!!state.bossActive,bossKills:state.bossKills||0,
        score:state.score||0,finale:!!state.v11Finale,
        hp:state.player?state.player.hp:0,maxHp:state.player?state.player.maxHp:0,
        nearMiss:(()=>{const p=state.player;if(!p||!state.enemyBullets||!state.enemyBullets.length)return false;for(const b of state.enemyBullets){const dx=(b.x||0)-p.x,dy=(b.y||0)-p.y,d2=dx*dx+dy*dy;if(d2>900&&d2<3600)return true;}return false;})()
      })`
    );

    return code;
  };

  const previous=window.__V11_PHASE2_PATCH;
  if(typeof previous==='function'&&!previous.__v123Wrapped){
    const wrapped=(code)=>window.__V123_PATCH(previous(code));
    wrapped.__v123Wrapped=true;
    window.__V11_PHASE2_PATCH=wrapped;
  }
})();