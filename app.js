(() => {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const missions = [
    {
      id:'earth', number:'01', name:'วงโคจรโลก', short:'EARTH ORBIT', difficulty:1,
      desc:'นำยานออกจากโลก เก็บข้อมูลดาวเทียมและหลบเศษวัตถุอวกาศในวงโคจรต่ำ',
      objective:'เก็บ Data Core 5 จุด', goal:5,
      fact:'ดาวเทียมในวงโคจรไม่ได้ลอยนิ่ง แต่กำลังเคลื่อนที่ไปรอบโลกภายใต้อิทธิพลของแรงโน้มถ่วง',
      tip:'อย่ากด BOOST ค้างตลอดเวลา เพราะจะสิ้นเปลืองพลังงานโดยไม่จำเป็น',
      question:'แรงหลักที่ทำให้ดาวเทียมยังคงโคจรรอบโลกคืออะไร?',
      answers:['แรงโน้มถ่วง','แรงลม','แรงเสียง','แรงแม่เหล็ก'], correct:0,
      palette:['#01030a','#07152c'], accent:'#73ddff'
    },
    {
      id:'moon', number:'02', name:'เส้นทางสู่ดวงจันทร์', short:'MOON', difficulty:1.15,
      desc:'เดินทางออกจากวงโคจรโลก มุ่งสู่ดวงจันทร์ พร้อมรักษาพลังงานของยานให้เพียงพอ',
      objective:'เก็บ Data Core 6 จุด', goal:6,
      fact:'ระยะห่างเฉลี่ยระหว่างโลกกับดวงจันทร์ประมาณ 384,400 กิโลเมตร',
      tip:'ยาน Guardian รับความเสียหายได้น้อยกว่า เหมาะกับด่านที่มีอุกกาบาตหนาแน่น',
      question:'แสงที่เราเห็นจากดวงจันทร์ส่วนใหญ่เกิดจากอะไร?',
      answers:['ดวงจันทร์สร้างแสงเอง','แสงอาทิตย์สะท้อนพื้นผิว','แสงจากโลกเท่านั้น','แสงจากดาวอังคาร'], correct:1,
      palette:['#010309','#171b2b'], accent:'#d8e4f2'
    },
    {
      id:'mars', number:'03', name:'ดาวอังคาร', short:'MARS', difficulty:1.38,
      desc:'ฝ่ากระแสฝุ่นและวัตถุอวกาศเพื่อเก็บข้อมูลจากดาวเคราะห์สีแดง',
      objective:'เก็บ Data Core 7 จุด', goal:7,
      fact:'สีแดงของดาวอังคารเกี่ยวข้องกับเหล็กออกไซด์ที่พบในฝุ่นและหินบนพื้นผิว',
      tip:'ใช้การขยับสั้น ๆ และอ่านเส้นทางอุกกาบาตล่วงหน้า จะปลอดภัยกว่าการส่ายยานตลอดเวลา',
      question:'เหตุใดดาวอังคารจึงมีลักษณะเป็นสีแดง?',
      answers:['มีมหาสมุทรสีแดง','เหล็กออกไซด์บนพื้นผิว','แสงจากดาวพฤหัสบดี','ชั้นบรรยากาศเรืองแสง'], correct:1,
      palette:['#070301','#2a0c06'], accent:'#ff9864'
    },
    {
      id:'blackhole', number:'04', name:'ขอบหลุมดำ', short:'BLACK HOLE', difficulty:1.7,
      desc:'ภารกิจขั้นสูง เข้าใกล้บริเวณรอบหลุมดำ เก็บข้อมูลแรงโน้มถ่วง และหลีกเลี่ยงการสูญเสียยาน',
      objective:'เก็บ Data Core 8 จุด', goal:8,
      fact:'ขอบฟ้าเหตุการณ์คือขอบเขตรอบหลุมดำที่เมื่อผ่านเข้าไปแล้ว แม้แต่แสงก็ไม่สามารถกลับออกมาได้',
      tip:'ด่านนี้อุกกาบาตเร็วขึ้นชัดเจน เก็บ BOOST ไว้ใช้เมื่อจำเป็นต้องหลบในระยะสั้น',
      question:'ขอบเขตที่เมื่อผ่านเข้าไปแล้วไม่สามารถกลับออกมาจากหลุมดำได้เรียกว่าอะไร?',
      answers:['Solar Ring','Event Horizon','Gravity Wall','Photon Sea'], correct:1,
      palette:['#010103','#16031e'], accent:'#be7dff'
    }
  ];

  const ships = [
    {id:'orbiter',name:'ORBITER',subtitle:'BALANCED',desc:'สมดุลระหว่างความเร็ว เกราะ และการใช้พลังงาน เหมาะสำหรับผู้เล่นครั้งแรก',speed:74,armor:74,energy:76,move:1,damage:1,fuel:1},
    {id:'raptor',name:'RAPTOR',subtitle:'HIGH SPEED',desc:'ตอบสนองไวและเร่งความเร็วได้ดี แต่ใช้พลังงานมากและเกราะบางกว่า',speed:96,armor:48,energy:58,move:1.34,damage:1.27,fuel:1.22},
    {id:'guardian',name:'GUARDIAN',subtitle:'HEAVY ARMOR',desc:'เกราะแข็งแรงและประหยัดพลังงาน แลกกับการเคลื่อนที่ที่ช้าลง',speed:57,armor:96,energy:91,move:.84,damage:.67,fuel:.75}
  ];

  const difficultyProfiles = {
    easy:{spawn:1.28,speed:.82,damage:.68,label:'Easy'},
    normal:{spawn:1,speed:1,damage:1,label:'Normal'},
    hard:{spawn:.78,speed:1.22,damage:1.28,label:'Hard'}
  };

  const state = {
    screen:'home', selectedShip:0, selectedMission:0, campaign:false,
    score:0, missionScore:0, fuel:100, shield:100, collected:0, hits:0, distance:0,
    running:false, boost:false, lastTime:0, spawnTimer:0, coreTimer:0,
    rocks:[], cores:[], particles:[], stars:[], keys:{left:false,right:false},
    raf:0, idleTimer:0, factTimer:0, toastTimer:0, quizAnswered:false,
    settings:{difficulty:'normal',volume:70,idleSeconds:45,sound:true},
    audioCtx:null
  };

  const canvas = $('#gameCanvas');
  const ctx = canvas.getContext('2d');
  const arena = $('#arena');
  const shipBody = {x:0,y:0,w:44,h:58,vx:0};
  let width=1,height=1,dpr=1;

  function loadSettings(){
    try{
      const saved=JSON.parse(localStorage.getItem('cosmic.operator.v2')||'null');
      if(saved && typeof saved==='object') state.settings={...state.settings,...saved};
    }catch(_){ }
    $('#difficultySelect').value=state.settings.difficulty;
    $('#volumeRange').value=state.settings.volume;
    $('#volumeValue').textContent=state.settings.volume+'%';
    $('#idleRange').value=state.settings.idleSeconds;
    $('#idleValue').textContent=state.settings.idleSeconds+'s';
    $('#soundEnabled').checked=!!state.settings.sound;
    updateSoundButton();
  }

  function saveSettings(){
    state.settings.difficulty=$('#difficultySelect').value;
    state.settings.volume=Number($('#volumeRange').value);
    state.settings.idleSeconds=Number($('#idleRange').value);
    state.settings.sound=$('#soundEnabled').checked;
    localStorage.setItem('cosmic.operator.v2',JSON.stringify(state.settings));
    updateSoundButton(); resetIdle(); toast('บันทึก Operator Settings แล้ว');
  }

  function getLeaders(){
    try{return JSON.parse(localStorage.getItem('cosmic.leaders.v2')||'[]');}catch(_){return []}
  }
  function saveLeader(entry){
    const list=getLeaders(); list.push(entry); list.sort((a,b)=>b.score-a.score); localStorage.setItem('cosmic.leaders.v2',JSON.stringify(list.slice(0,8))); renderLeaderboard();
  }
  function renderLeaderboard(){
    const list=getLeaders(); const targets=[$('#homeLeaderboard')].filter(Boolean);
    targets.forEach(box=>{
      if(!list.length){box.innerHTML='<div class="empty-state">ยังไม่มีคะแนน · เริ่มภารกิจเพื่อสร้างสถิติแรก</div>';return;}
      box.innerHTML=list.slice(0,5).map((x,i)=>`<div class="leader-row"><b>#${i+1}</b><div>${escapeHtml(x.mission)}<small>${escapeHtml(x.ship)} · ${escapeHtml(x.difficulty)}</small></div><strong>${x.score}</strong></div>`).join('');
    });
  }
  function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

  function renderHome(){
    $('#homeRoute').innerHTML=missions.map(m=>`<div class="route-item"><small>${m.number} · ${m.short}</small><strong>${m.name}</strong></div>`).join('');
    renderLeaderboard();
  }

  function renderSetup(){
    $('#shipCards').innerHTML='';
    ships.forEach((s,i)=>{
      const b=document.createElement('button'); b.type='button'; b.className='ship-card'+(i===state.selectedShip?' selected':'');
      b.innerHTML=`<div class="mini-ship"></div><strong>${s.name}</strong><small>${s.subtitle}</small>`;
      b.addEventListener('click',()=>{state.selectedShip=i;renderSetup();resetIdle();sfx('tap')});
      $('#shipCards').appendChild(b);
    });
    $('#missionCards').innerHTML='';
    missions.forEach((m,i)=>{
      const b=document.createElement('button');b.type='button';b.className='mission-card'+(i===state.selectedMission?' selected':'');
      b.innerHTML=`<span class="m-number">MISSION ${m.number}</span><h4>${m.name}</h4><p>${m.desc}</p><div class="difficulty">${[1,2,3,4].map(n=>`<i class="${n<=Math.ceil(m.difficulty*2)?'on':''}"></i>`).join('')}</div>`;
      b.addEventListener('click',()=>{state.selectedMission=i;state.campaign=false;renderSetup();resetIdle();sfx('tap')});
      $('#missionCards').appendChild(b);
    });
    const s=ships[state.selectedShip],m=missions[state.selectedMission];
    $('#selectedShipName').textContent=s.name;$('#shipDescription').textContent=s.desc;
    setSpec('Speed',s.speed);setSpec('Armor',s.armor);setSpec('Energy',s.energy);
    $('#selectedMissionTag').textContent=m.number;$('#launchSummary').textContent=`${s.name} · ${m.name}`;
  }
  function setSpec(key,val){$('#spec'+key).style.width=val+'%';$('#spec'+key+'Value').textContent=val;}

  function showScreen(name){
    state.screen=name;
    $$('.screen').forEach(x=>x.classList.toggle('active',x.id==='screen'+name[0].toUpperCase()+name.slice(1)));
    resetIdle();
  }

  function openSetup(){state.campaign=false;renderSetup();showScreen('setup');sfx('tap')}
  function startCampaign(){state.campaign=true;state.selectedMission=0;state.score=0;$('#globalScore').textContent='0';renderSetup();showScreen('setup');toast('Campaign Mode · เล่นต่อเนื่อง 4 ภารกิจ');sfx('launch')}
  function prepareMission(){
    state.running=false; cancelAnimationFrame(state.raf); state.quizAnswered=false;
    state.missionScore=0;state.fuel=100;state.shield=100;state.collected=0;state.hits=0;state.distance=0;state.rocks=[];state.cores=[];state.particles=[];state.boost=false;
    resizeCanvas(); updateHud();
    const m=missions[state.selectedMission],s=ships[state.selectedShip];
    $('#briefNumber').textContent=m.number;$('#briefTitle').textContent=m.name;$('#briefText').textContent=m.desc;$('#briefObjective').textContent=m.objective;
    $('#hudMission').textContent=m.name;$('#sideShipName').textContent=s.name;$('#missionTip').textContent=m.tip;
    $('#briefOverlay').classList.remove('hidden');$('#countdownOverlay').classList.add('hidden');$('#transitionOverlay').classList.add('hidden');$('#attractOverlay').classList.add('hidden');
    showScreen('game'); draw();
  }

  async function beginCountdown(){
    ensureAudio(); $('#briefOverlay').classList.add('hidden'); $('#countdownOverlay').classList.remove('hidden');
    const val=$('#countdownValue');
    for(const n of [3,2,1]){val.textContent=n;sfx('count');await wait(650)}
    val.textContent='GO';sfx('go');await wait(420);$('#countdownOverlay').classList.add('hidden');startGame();
  }
  function wait(ms){return new Promise(r=>setTimeout(r,ms))}

  function startGame(){
    const m=missions[state.selectedMission];
    state.running=true;state.lastTime=performance.now();state.spawnTimer=.25;state.coreTimer=.65;shipBody.x=width/2;shipBody.y=height-80;shipBody.vx=0;
    $('#factToast').textContent=m.fact;$('#factToast').classList.add('show');clearTimeout(state.factTimer);state.factTimer=setTimeout(()=>$('#factToast').classList.remove('show'),4600);
    cancelAnimationFrame(state.raf);state.raf=requestAnimationFrame(loop);arena.focus();resetIdle();sfx('launch');
  }

  function difficulty(){return difficultyProfiles[state.settings.difficulty]||difficultyProfiles.normal}
  function update(dt){
    const m=missions[state.selectedMission],s=ships[state.selectedShip],d=difficulty();
    const steering=((state.keys.right?1:0)-(state.keys.left?1:0));
    shipBody.vx += steering*920*s.move*dt; shipBody.vx*=Math.pow(.0022,dt); shipBody.x+=shipBody.vx*dt; shipBody.x=Math.max(30,Math.min(width-30,shipBody.x));
    const boostMul=state.boost&&state.fuel>2?1.52:1;
    state.fuel-=((state.boost?5.1:1.18)*s.fuel)*dt; if(state.fuel<=0){state.fuel=0;finishMission(false,'พลังงานหมดก่อนเก็บข้อมูลครบ');return}
    state.distance+=(58*m.difficulty*boostMul)*dt;
    state.stars.forEach(st=>{st.y+=st.v*m.difficulty*d.speed*boostMul*dt;if(st.y>height+20){st.y=-10;st.x=Math.random()*width}});
    state.spawnTimer-=dt;
    if(state.spawnTimer<=0){
      const r=13+Math.random()*21;state.rocks.push({x:r+Math.random()*(width-r*2),y:-35,r,v:(145+Math.random()*145)*m.difficulty*d.speed,spin:(Math.random()-.5)*2,rot:0});
      state.spawnTimer=(.48+Math.random()*.34)*d.spawn/Math.max(1,m.difficulty*.86);
    }
    state.coreTimer-=dt;
    if(state.coreTimer<=0){state.cores.push({x:26+Math.random()*(width-52),y:-25,r:12,v:122*m.difficulty*d.speed,rot:0});state.coreTimer=.86+Math.random()*.66}
    state.rocks.forEach(a=>{a.y+=a.v*dt;a.rot+=a.spin*dt});state.cores.forEach(c=>{c.y+=c.v*dt;c.rot+=2.6*dt});
    for(let i=state.rocks.length-1;i>=0;i--){const a=state.rocks[i];if(rectCircle(shipBody,a)){state.rocks.splice(i,1);impact(a.x,a.y);state.hits++;state.shield-=23*s.damage*d.damage*m.difficulty;if(state.shield<=0){state.shield=0;finishMission(false,'โล่พลังงานเสียหายทั้งหมด');return}}else if(a.y>height+45){state.rocks.splice(i,1);state.missionScore+=3}}
    for(let i=state.cores.length-1;i>=0;i--){const c=state.cores[i];if(rectCircle(shipBody,c)){state.cores.splice(i,1);collectBurst(c.x,c.y);state.collected++;state.missionScore+=55+state.selectedMission*15;state.fuel=Math.min(100,state.fuel+5);sfx('collect');if(state.collected>=m.goal){finishMission(true,'เก็บข้อมูลครบตามเป้าหมาย');return}}else if(c.y>height+35)state.cores.splice(i,1)}
    updateParticles(dt);updateHud();
  }

  function rectCircle(rect,c){const cx=Math.max(rect.x-rect.w/2,Math.min(c.x,rect.x+rect.w/2)),cy=Math.max(rect.y-rect.h/2,Math.min(c.y,rect.y+rect.h/2));return (c.x-cx)**2+(c.y-cy)**2<c.r*c.r}
  function impact(x,y){
    for(let i=0;i<20;i++) state.particles.push({x,y,vx:(Math.random()-.5)*260,vy:(Math.random()-.5)*260,life:.55+Math.random()*.3,max:.85,size:2+Math.random()*4,type:'impact'});
    arena.classList.remove('shake');void arena.offsetWidth;arena.classList.add('shake');$('#impactFlash').classList.remove('flash');void $('#impactFlash').offsetWidth;$('#impactFlash').classList.add('flash');sfx('hit');
  }
  function collectBurst(x,y){for(let i=0;i<14;i++)state.particles.push({x,y,vx:(Math.random()-.5)*180,vy:(Math.random()-.5)*180,life:.45+Math.random()*.25,max:.7,size:1+Math.random()*3,type:'collect'})}
  function updateParticles(dt){state.particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(.05,dt);p.vy*=Math.pow(.05,dt);p.life-=dt});state.particles=state.particles.filter(p=>p.life>0)}

  function draw(){
    if(!ctx)return; const m=missions[state.selectedMission]||missions[0];
    ctx.clearRect(0,0,width,height);const g=ctx.createLinearGradient(0,0,0,height);g.addColorStop(0,m.palette[0]);g.addColorStop(1,m.palette[1]);ctx.fillStyle=g;ctx.fillRect(0,0,width,height);
    drawBackdrop(m);drawStars();drawCores();drawRocks();drawParticles();drawShip();
  }
  function drawBackdrop(m){
    if(m.id==='earth'){ctx.fillStyle='rgba(44,119,211,.18)';ctx.beginPath();ctx.arc(width*.84,height*.13,86,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(116,231,255,.12)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(width*.84,height*.13,94,0,Math.PI*2);ctx.stroke()}
    if(m.id==='moon'){ctx.fillStyle='rgba(216,224,232,.13)';ctx.beginPath();ctx.arc(width*.82,height*.15,78,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(110,118,128,.1)';for(const [dx,dy,r] of [[-22,-8,13],[19,16,9],[-6,23,7]]){ctx.beginPath();ctx.arc(width*.82+dx,height*.15+dy,r,0,Math.PI*2);ctx.fill()}}
    if(m.id==='mars'){const mg=ctx.createRadialGradient(width*.82,height*.16,12,width*.82,height*.16,92);mg.addColorStop(0,'rgba(255,178,120,.26)');mg.addColorStop(.55,'rgba(179,65,34,.24)');mg.addColorStop(1,'rgba(64,16,8,.05)');ctx.fillStyle=mg;ctx.beginPath();ctx.arc(width*.82,height*.16,92,0,Math.PI*2);ctx.fill()}
    if(m.id==='blackhole'){ctx.save();ctx.translate(width*.81,height*.18);ctx.strokeStyle='rgba(190,125,255,.24)';ctx.lineWidth=13;ctx.beginPath();ctx.ellipse(0,0,94,32,-.18,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='rgba(255,186,106,.16)';ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(0,0,113,40,-.18,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#000';ctx.beginPath();ctx.arc(0,0,42,0,Math.PI*2);ctx.fill();ctx.restore()}
  }
  function drawStars(){
    const warp=state.boost&&state.running&&state.fuel>1;
    ctx.save();ctx.lineCap='round';state.stars.forEach(st=>{const alpha=.35+st.s*.22;if(warp){ctx.strokeStyle=`rgba(190,225,255,${Math.min(.9,alpha+.2)})`;ctx.lineWidth=Math.max(1,st.s);ctx.beginPath();ctx.moveTo(st.x,st.y);ctx.lineTo(st.x,st.y-22-st.v*.08);ctx.stroke()}else{ctx.fillStyle=`rgba(255,255,255,${alpha})`;ctx.beginPath();ctx.arc(st.x,st.y,st.s,0,Math.PI*2);ctx.fill()}});ctx.restore();
  }
  function drawCores(){state.cores.forEach(c=>{ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.rot);ctx.strokeStyle='#83efff';ctx.lineWidth=3;ctx.shadowColor='#69dcff';ctx.shadowBlur=13;ctx.beginPath();ctx.moveTo(0,-c.r);ctx.lineTo(c.r,0);ctx.lineTo(0,c.r);ctx.lineTo(-c.r,0);ctx.closePath();ctx.stroke();ctx.restore()})}
  function drawRocks(){state.rocks.forEach(a=>{ctx.save();ctx.translate(a.x,a.y);ctx.rotate(a.rot);ctx.fillStyle='#716963';ctx.strokeStyle='#9d948d';ctx.lineWidth=2;ctx.beginPath();for(let j=0;j<8;j++){const ang=j/8*Math.PI*2,rr=a.r*(.83+(j%3)*.08),x=Math.cos(ang)*rr,y=Math.sin(ang)*rr;j?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='rgba(20,16,14,.22)';ctx.beginPath();ctx.arc(-a.r*.22,-a.r*.1,a.r*.2,0,Math.PI*2);ctx.fill();ctx.restore()})}
  function drawParticles(){state.particles.forEach(p=>{const a=Math.max(0,p.life/p.max);ctx.fillStyle=p.type==='collect'?`rgba(120,236,255,${a})`:`rgba(255,148,92,${a})`;ctx.beginPath();ctx.arc(p.x,p.y,p.size*a,0,Math.PI*2);ctx.fill()})}
  function drawShip(){
    const s=ships[state.selectedShip];ctx.save();ctx.translate(shipBody.x,shipBody.y);if(state.boost&&state.running)ctx.shadowColor='#6ee9ff',ctx.shadowBlur=18;ctx.fillStyle='#e4edf4';ctx.beginPath();
    if(s.id==='raptor'){ctx.moveTo(0,-34);ctx.lineTo(15,27);ctx.lineTo(0,18);ctx.lineTo(-15,27)}else if(s.id==='guardian'){ctx.moveTo(0,-28);ctx.lineTo(23,17);ctx.lineTo(14,29);ctx.lineTo(0,21);ctx.lineTo(-14,29);ctx.lineTo(-23,17)}else{ctx.moveTo(0,-31);ctx.lineTo(20,23);ctx.lineTo(7,17);ctx.lineTo(0,29);ctx.lineTo(-7,17);ctx.lineTo(-20,23)}ctx.closePath();ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#6bd7ff';ctx.beginPath();ctx.ellipse(0,-8,6,11,0,0,Math.PI*2);ctx.fill();const flame=state.running?(state.boost?56:40):25;ctx.fillStyle=state.boost?'#fff1a2':'#ffad66';ctx.beginPath();ctx.moveTo(-7,22);ctx.quadraticCurveTo(0,flame+Math.random()*7,7,22);ctx.closePath();ctx.fill();ctx.restore();
  }

  function loop(t){if(!state.running)return;const dt=Math.min(.033,(t-state.lastTime)/1000||0);state.lastTime=t;update(dt);draw();if(state.running)state.raf=requestAnimationFrame(loop)}

  function updateHud(){
    const m=missions[state.selectedMission];$('#hudData').textContent=`${state.collected} / ${m.goal}`;$('#hudFuel').textContent=Math.round(state.fuel)+'%';$('#hudFuelBar').style.width=Math.max(0,state.fuel)+'%';$('#hudShield').textContent=Math.round(state.shield)+'%';$('#hudShieldBar').style.width=Math.max(0,state.shield)+'%';$('#hudScore').textContent=state.missionScore;$('#globalScore').textContent=state.score+state.missionScore;$('#sideSpeed').textContent=Math.round((state.boost?38:24)*m.difficulty*ships[state.selectedShip].move)+' km/s';$('#sideDistance').textContent=Math.round(state.distance).toLocaleString('th-TH')+' km';$('#sideHits').textContent=state.hits;
  }

  function finishMission(success,message){
    if(!state.running)return;state.running=false;state.boost=false;cancelAnimationFrame(state.raf);state.keys.left=false;state.keys.right=false;sfx(success?'success':'fail');
    const bonus=success?Math.max(0,Math.round(state.shield*2+state.fuel)):0;state.missionScore+=bonus;state.score+=state.missionScore;$('#globalScore').textContent=state.score;
    showReport(success,message);
  }

  function grade(){const m=missions[state.selectedMission];const ratio=(state.missionScore/(m.goal*(55+state.selectedMission*15)+300));if(ratio>.9&&state.hits<=1)return'S';if(ratio>.7)return'A';if(ratio>.5)return'B';return'C'}
  function showReport(success,message){
    const m=missions[state.selectedMission],s=ships[state.selectedShip];showScreen('report');$('#reportTitle').textContent=success?'MISSION COMPLETE':'MISSION ENDED';$('#reportSubtitle').textContent=`${m.name} · ${message}`;$('#reportGrade').textContent=success?grade():'C';$('#reportScore').textContent=state.missionScore;$('#reportData').textContent=`${state.collected}/${m.goal}`;$('#reportShield').textContent=Math.round(state.shield)+'%';$('#reportFuel').textContent=Math.round(state.fuel)+'%';$('#reportHits').textContent=state.hits;$('#quizQuestion').textContent=m.question;$('#quizFeedback').textContent='';state.quizAnswered=false;
    const box=$('#quizAnswers');box.innerHTML='';m.answers.forEach((a,i)=>{const b=document.createElement('button');b.type='button';b.className='answer-btn';b.textContent=a;b.addEventListener('click',()=>answerQuiz(i,success));box.appendChild(b)});
    const isLast=state.selectedMission===missions.length-1;$('#reportNext').textContent=state.campaign&&!isLast?'ไปภารกิจถัดไป':state.campaign&&isLast?'จบ Campaign · หน้าแรก':'เล่นด่านถัดไป';
    saveLeader({score:state.missionScore,mission:m.name,ship:s.name,difficulty:difficulty().label,at:Date.now()});
  }
  function answerQuiz(index,success){
    if(state.quizAnswered)return;state.quizAnswered=true;const m=missions[state.selectedMission],buttons=$$('#quizAnswers .answer-btn');buttons.forEach(b=>b.disabled=true);buttons[m.correct]?.classList.add('correct');if(index===m.correct){state.score+=200;state.missionScore+=200;$('#reportScore').textContent=state.missionScore;$('#globalScore').textContent=state.score;$('#quizFeedback').textContent='✓ ถูกต้อง · โบนัส +200 คะแนน';sfx('success')}else{buttons[index]?.classList.add('wrong');$('#quizFeedback').textContent='คำตอบที่ถูกคือ: '+m.answers[m.correct];sfx('fail')}
  }

  async function nextFromReport(){
    if(state.campaign){
      if(state.selectedMission>=missions.length-1){state.campaign=false;showScreen('home');toast(`Campaign Complete · คะแนนรวม ${state.score}`);return}
      const from=missions[state.selectedMission],to=missions[state.selectedMission+1];state.selectedMission++;await showTransition(from,to);prepareMission();
    }else{
      state.selectedMission=(state.selectedMission+1)%missions.length;renderSetup();showScreen('setup');
    }
  }
  async function showTransition(from,to){
    showScreen('game');$('#briefOverlay').classList.add('hidden');$('#transitionFrom').textContent=from.short;$('#transitionTo').textContent=to.short;$('#transitionTitle').textContent=`${from.name} → ${to.name}`;$('#transitionSubtitle').textContent='กำลังปรับเส้นทางและสภาพแวดล้อมของยาน';$('#transitionOverlay').classList.remove('hidden');sfx('transition');await wait(1600);$('#transitionOverlay').classList.add('hidden')
  }

  function resizeCanvas(){
    const r=arena.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,2);width=Math.max(1,r.width);height=Math.max(1,r.height);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);shipBody.y=height-80;if(!shipBody.x)shipBody.x=width/2;
    const target=Math.min(150,Math.max(80,Math.floor(width*height/5400)));if(state.stars.length!==target)state.stars=Array.from({length:target},()=>({x:Math.random()*width,y:Math.random()*height,s:.35+Math.random()*1.45,v:18+Math.random()*62}));draw();
  }

  function setMove(side,on){state.keys[side]=on;if(on)resetIdle()}
  function setBoost(on){state.boost=on;if(on){resetIdle();if(state.running)sfx('boost')}}
  function bindHold(el,down,up){el.addEventListener('pointerdown',e=>{e.preventDefault();down();});['pointerup','pointercancel','pointerleave'].forEach(ev=>el.addEventListener(ev,up))}

  function ensureAudio(){if(!state.audioCtx){const AC=window.AudioContext||window.webkitAudioContext;if(AC)state.audioCtx=new AC()}if(state.audioCtx?.state==='suspended')state.audioCtx.resume().catch(()=>{})}
  function sfx(type){
    if(!state.settings.sound||state.settings.volume<=0)return;ensureAudio();const ac=state.audioCtx;if(!ac)return;const gain=ac.createGain(),osc=ac.createOscillator(),now=ac.currentTime,vol=(state.settings.volume/100)*.12;gain.connect(ac.destination);osc.connect(gain);gain.gain.setValueAtTime(0.0001,now);
    const cfg={tap:[420,.05,'sine'],count:[520,.11,'square'],go:[900,.18,'sine'],launch:[150,.42,'sawtooth'],collect:[760,.13,'sine'],hit:[90,.22,'sawtooth'],success:[680,.35,'sine'],fail:[150,.3,'square'],transition:[210,.7,'sine'],boost:[115,.1,'sawtooth']}[type]||[420,.08,'sine'];osc.type=cfg[2];osc.frequency.setValueAtTime(cfg[0],now);if(type==='launch'||type==='transition')osc.frequency.exponentialRampToValueAtTime(type==='launch'?420:620,now+cfg[1]);if(type==='hit')osc.frequency.exponentialRampToValueAtTime(45,now+cfg[1]);if(type==='success')osc.frequency.exponentialRampToValueAtTime(1020,now+cfg[1]);gain.gain.exponentialRampToValueAtTime(vol,now+.015);gain.gain.exponentialRampToValueAtTime(.0001,now+cfg[1]);osc.start(now);osc.stop(now+cfg[1]+.02)
  }
  function updateSoundButton(){$('#soundToggle').textContent=state.settings.sound&&state.settings.volume>0?'🔊':'🔇'}

  function openOperator(){
    $('#difficultySelect').value=state.settings.difficulty;$('#volumeRange').value=state.settings.volume;$('#volumeValue').textContent=state.settings.volume+'%';$('#idleRange').value=state.settings.idleSeconds;$('#idleValue').textContent=state.settings.idleSeconds+'s';$('#soundEnabled').checked=state.settings.sound;$('#operatorModal').classList.remove('hidden');resetIdle();sfx('tap')
  }
  function closeOperator(){$('#operatorModal').classList.add('hidden');resetIdle()}

  function resetIdle(){
    clearTimeout(state.idleTimer);$('#attractOverlay').classList.add('hidden');
    state.idleTimer=setTimeout(()=>{
      if(!$('#operatorModal').classList.contains('hidden'))return resetIdle();
      if(state.screen==='game'){state.running=false;cancelAnimationFrame(state.raf);$('#attractOverlay').classList.remove('hidden');sfx('transition')}
      else{showScreen('home');toast('Attract Mode · พร้อมรับผู้เล่นคนถัดไป')}
    },Math.max(15,state.settings.idleSeconds)*1000);
  }
  function wakeAttract(){state.campaign=false;state.score=0;$('#globalScore').textContent='0';$('#attractOverlay').classList.add('hidden');showScreen('home');sfx('go')}

  function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(state.toastTimer);state.toastTimer=setTimeout(()=>el.classList.remove('show'),2200)}

  function abortMission(){state.running=false;cancelAnimationFrame(state.raf);state.campaign=false;showScreen('home');toast('ยกเลิกภารกิจแล้ว')}

  function bindEvents(){
    $('#brandButton').addEventListener('click',()=>{state.running=false;cancelAnimationFrame(state.raf);state.campaign=false;showScreen('home')});
    $('#campaignStart').addEventListener('click',startCampaign);$('#missionSelectOpen').addEventListener('click',openSetup);$('#setupBack').addEventListener('click',()=>showScreen('home'));$('#launchSelected').addEventListener('click',prepareMission);$('#briefStart').addEventListener('click',beginCountdown);$('#reportHome').addEventListener('click',()=>{state.campaign=false;showScreen('home')});$('#reportNext').addEventListener('click',nextFromReport);$('#abortMission').addEventListener('click',abortMission);$('#attractWake').addEventListener('click',wakeAttract);
    bindHold($('#moveLeft'),()=>setMove('left',true),()=>setMove('left',false));bindHold($('#moveRight'),()=>setMove('right',true),()=>setMove('right',false));bindHold($('#boostButton'),()=>setBoost(true),()=>setBoost(false));
    arena.addEventListener('keydown',e=>{if(['ArrowLeft','a','A'].includes(e.key)){setMove('left',true);e.preventDefault()}if(['ArrowRight','d','D'].includes(e.key)){setMove('right',true);e.preventDefault()}if(e.code==='Space'){setBoost(true);e.preventDefault()}});arena.addEventListener('keyup',e=>{if(['ArrowLeft','a','A'].includes(e.key))setMove('left',false);if(['ArrowRight','d','D'].includes(e.key))setMove('right',false);if(e.code==='Space')setBoost(false)});
    $('#soundToggle').addEventListener('click',()=>{state.settings.sound=!state.settings.sound;localStorage.setItem('cosmic.operator.v2',JSON.stringify(state.settings));updateSoundButton();if(state.settings.sound)sfx('tap')});
    $('#operatorOpen').addEventListener('click',openOperator);$('#operatorClose').addEventListener('click',closeOperator);$('[data-close-operator]').addEventListener('click',closeOperator);$('#operatorSave').addEventListener('click',()=>{saveSettings();closeOperator()});
    $('#volumeRange').addEventListener('input',e=>$('#volumeValue').textContent=e.target.value+'%');$('#idleRange').addEventListener('input',e=>$('#idleValue').textContent=e.target.value+'s');
    $('#resetScores').addEventListener('click',()=>{localStorage.removeItem('cosmic.leaders.v2');renderLeaderboard();toast('ล้างคะแนนในเครื่องแล้ว')});
    document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='o'&&state.screen!=='game')openOperator();if(e.key==='Escape'&&!$('#operatorModal').classList.contains('hidden'))closeOperator()});
    document.addEventListener('pointerdown',resetIdle,{passive:true});window.addEventListener('resize',resizeCanvas);new ResizeObserver(resizeCanvas).observe(arena);
  }

  function init(){loadSettings();renderHome();renderSetup();bindEvents();resizeCanvas();showScreen('home');updateHud();resetIdle()}
  init();
})();
