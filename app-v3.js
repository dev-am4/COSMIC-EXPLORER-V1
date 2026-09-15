(() => {
'use strict';

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

const missions = [
  {
    id:'earth',number:'01',name:'วงโคจรโลก',short:'EARTH ORBIT',goal:6,difficulty:1,
    desc:'ออกจากโลก ผ่านเขตดาวเทียมและเศษวัตถุอวกาศ พร้อมรวบรวมข้อมูลเพื่อเปิดเส้นทางสู่ดวงจันทร์',
    fact:'วัตถุในวงโคจรเคลื่อนที่ไปรอบโลกภายใต้อิทธิพลของแรงโน้มถ่วง ไม่ได้ลอยนิ่งอยู่กับที่',
    tip:'เก็บ Fuel Cell และ Data Core ต่อเนื่องเพื่อสร้าง Combo แล้วใช้ BOOST เฉพาะช่วงที่ต้องหลบ',
    questions:[
      {q:'แรงหลักที่ทำให้ดาวเทียมโคจรรอบโลกคืออะไร?',a:['แรงโน้มถ่วง','แรงลม','แรงเสียง','แรงแม่เหล็ก'],c:0},
      {q:'ชั้นบรรยากาศของโลกช่วยสิ่งมีชีวิตอย่างไร?',a:['ป้องกันรังสีบางส่วนและช่วยรักษาอุณหภูมิ','ทำให้โลกหยุดหมุน','สร้างแรงโน้มถ่วงทั้งหมด','ทำให้ดวงจันทร์ส่องแสง'],c:0},
      {q:'สถานีอวกาศนานาชาติอยู่บริเวณใด?',a:['วงโคจรต่ำของโลก','พื้นผิวดวงจันทร์','วงโคจรดาวอังคาร','นอกกาแล็กซี'],c:0}
    ],palette:['#01030a','#061a34'],accent:'#72e7ff'
  },
  {
    id:'moon',number:'02',name:'เส้นทางสู่ดวงจันทร์',short:'MOON',goal:7,difficulty:1.13,
    desc:'ออกจากวงโคจรโลกและเดินทางผ่านอวกาศระหว่างโลกกับดวงจันทร์ รักษาทรัพยากรให้พร้อมสำหรับระยะไกล',
    fact:'ระยะห่างเฉลี่ยระหว่างโลกกับดวงจันทร์ประมาณ 384,400 กิโลเมตร',
    tip:'Time Crystal ช่วยชะลอวัตถุอวกาศชั่วคราว และ Magnet จะดึงของสำคัญเข้าหายาน',
    questions:[
      {q:'แสงที่เราเห็นจากดวงจันทร์ส่วนใหญ่เกิดจากอะไร?',a:['แสงอาทิตย์สะท้อนพื้นผิว','ดวงจันทร์สร้างแสงเอง','แสงจากโลกเท่านั้น','แสงจากดาวอังคาร'],c:0},
      {q:'แรงโน้มถ่วงบนดวงจันทร์เมื่อเทียบกับโลกเป็นอย่างไร?',a:['น้อยกว่าโลก','มากกว่าโลกมาก','เท่ากับโลกพอดี','ไม่มีแรงโน้มถ่วง'],c:0},
      {q:'ดวงจันทร์ใช้เวลาประมาณเท่าไรในการโคจรรอบโลกหนึ่งรอบ?',a:['ประมาณ 27 วัน','ประมาณ 24 ชั่วโมง','ประมาณ 365 วัน','ประมาณ 12 ชั่วโมง'],c:0}
    ],palette:['#010309','#171c30'],accent:'#dce7f2'
  },
  {
    id:'mars',number:'03',name:'ดาวอังคาร',short:'MARS',goal:8,difficulty:1.34,
    desc:'มุ่งหน้าสู่ดาวอังคาร ฝ่ากระแสฝุ่นและวัตถุอวกาศ พร้อมค้นหา Quantum Key ที่ซ่อนอยู่ในเส้นทาง',
    fact:'สีแดงของดาวอังคารเกี่ยวข้องกับเหล็กออกไซด์ในฝุ่นและหินบนพื้นผิว',
    tip:'Warp Charge ทำให้ยานเร็วขึ้นโดยไม่กินพลังงานและชนอุกกาบาตได้ชั่วคราว',
    questions:[
      {q:'เหตุใดดาวอังคารจึงมีลักษณะเป็นสีแดง?',a:['เหล็กออกไซด์บนพื้นผิว','มหาสมุทรสีแดง','แสงจากดาวพฤหัสบดี','มีไฟลุกตลอดเวลา'],c:0},
      {q:'ดาวอังคารมีดวงจันทร์บริวารกี่ดวง?',a:['2 ดวง','1 ดวง','4 ดวง','ไม่มี'],c:0},
      {q:'ดาวอังคารอยู่ลำดับที่เท่าไรจากดวงอาทิตย์?',a:['ลำดับที่ 4','ลำดับที่ 2','ลำดับที่ 6','ลำดับที่ 8'],c:0}
    ],palette:['#080301','#2b0c06'],accent:'#ff9865'
  },
  {
    id:'blackhole',number:'04',name:'ขอบหลุมดำ',short:'BLACK HOLE',goal:10,difficulty:1.62,
    desc:'ภารกิจสุดท้าย เข้าใกล้บริเวณรอบหลุมดำ เก็บข้อมูลแรงโน้มถ่วง และเปิด Quantum Gate ก่อนออกจากเขตอันตราย',
    fact:'ขอบฟ้าเหตุการณ์คือขอบเขตรอบหลุมดำที่เมื่อผ่านเข้าไปแล้ว แม้แต่แสงก็ไม่สามารถกลับออกมาได้',
    tip:'แรงโน้มถ่วงในด่านนี้รบกวนการเคลื่อนที่ ใช้ Shield Overcharge และ Warp Charge ให้ถูกจังหวะ',
    questions:[
      {q:'ขอบเขตที่เมื่อผ่านเข้าไปแล้วไม่สามารถกลับออกมาจากหลุมดำได้เรียกว่าอะไร?',a:['Event Horizon','Solar Ring','Gravity Wall','Photon Sea'],c:0},
      {q:'เหตุใดเราจึงมองเห็นบริเวณรอบหลุมดำได้?',a:['สสารร้อนรอบหลุมดำสามารถเปล่งรังสี','ตัวหลุมดำปล่อยแสงสีขาว','หลุมดำสะท้อนแสงเหมือนกระจก','ไม่มีสิ่งใดมองเห็นได้รอบหลุมดำ'],c:0},
      {q:'แรงใดมีบทบาทสำคัญที่สุดใกล้หลุมดำ?',a:['แรงโน้มถ่วง','แรงเสียดทานอากาศ','แรงลม','แรงลอยตัว'],c:0}
    ],palette:['#010103','#16031f'],accent:'#bd7cff'
  }
];

const ships = [
  {id:'orbiter',name:'ORBITER',subtitle:'BALANCED',desc:'สมดุลระหว่างความเร็ว เกราะ และการใช้พลังงาน เหมาะกับการเล่นต่อเนื่อง',speed:76,armor:76,energy:77,move:1,damage:1,fuel:1},
  {id:'raptor',name:'RAPTOR',subtitle:'HIGH SPEED',desc:'เร็วและตอบสนองไว เหมาะกับ Combo และเก็บของพิเศษ แต่กินพลังงานมากกว่า',speed:97,armor:49,energy:58,move:1.36,damage:1.25,fuel:1.22},
  {id:'guardian',name:'GUARDIAN',subtitle:'HEAVY ARMOR',desc:'ทนทานและประหยัดพลังงาน เหมาะกับผู้เล่นที่ต้องการบินไกลแบบปลอดภัย',speed:58,armor:97,energy:92,move:.84,damage:.66,fuel:.76}
];

const specials = {
  fuel:{name:'Fuel Cell',icon:'⚡',desc:'+25 Energy'},
  repair:{name:'Repair Drone',icon:'✚',desc:'+24 Hull'},
  shield:{name:'Shield Overcharge',icon:'◉',desc:'อมตะ 6 วินาที'},
  time:{name:'Time Crystal',icon:'◇',desc:'ชะลออันตราย 7 วินาที'},
  magnet:{name:'Gravity Magnet',icon:'⌁',desc:'ดูดไอเท็ม 8 วินาที'},
  warp:{name:'Warp Charge',icon:'✦',desc:'Warp 6 วินาที'},
  key:{name:'Quantum Key',icon:'◆',desc:'ครบ 3 เปิด Quantum Gate'}
};

const difficultyProfiles = {
  easy:{spawn:1.28,speed:.82,damage:.7,special:1.18,label:'Easy'},
  normal:{spawn:1,speed:1,damage:1,special:1,label:'Normal'},
  hard:{spawn:.78,speed:1.22,damage:1.28,special:.88,label:'Hard'}
};

const state = {
  screen:'home',selectedShip:0,selectedMission:0,activeMission:0,
  score:0,sectorScore:0,collected:0,fuel:100,shield:100,hits:0,distance:0,sectorsCleared:0,
  running:false,transitioning:false,emergencyActive:false,boost:false,lastTime:0,
  spawnTimer:0,coreTimer:0,specialTimer:0,eventTimer:20,event:null,eventDuration:0,
  rocks:[],cores:[],pickups:[],particles:[],stars:[],keys:{left:false,right:false},
  powers:{shield:0,time:0,magnet:0,warp:0},quantumKeys:0,gates:0,rescues:0,
  combo:1,comboTimer:0,bestCombo:1,specialItems:0,inventory:{fuel:0,repair:0,shield:0,time:0,magnet:0,warp:0,key:0},
  emergencyType:null,questionIndex:0,raf:0,idleTimer:0,factTimer:0,toastTimer:0,pickupTimer:0,eventBannerTimer:0,
  settings:{difficulty:'normal',volume:70,idleSeconds:45,sound:true},
  audioCtx:null,engineNodes:null,invulnerable:0,operatorPaused:false
};

const canvas=$('#gameCanvas'),ctx=canvas.getContext('2d'),arena=$('#arena');
const shipBody={x:0,y:0,w:44,h:58,vx:0};
let width=1,height=1,dpr=1;

function loadSettings(){
  try{
    const saved=JSON.parse(localStorage.getItem('cosmic.operator.v3')||'null');
    if(saved&&typeof saved==='object') state.settings={...state.settings,...saved};
  }catch(_){}
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
  const newPin=$('#pinChangeInput').value.trim();
  if(newPin){
    if(!/^\d{4,8}$/.test(newPin)){toast('PIN ต้องเป็นตัวเลข 4–8 หลัก');return false}
    localStorage.setItem('cosmic.operator.pin.v3',newPin);
    $('#pinChangeInput').value='';
  }
  localStorage.setItem('cosmic.operator.v3',JSON.stringify(state.settings));
  updateSoundButton();resetIdle();toast('บันทึก Operator Settings แล้ว');return true;
}
function getOperatorPin(){return localStorage.getItem('cosmic.operator.pin.v3')||'2468'}

function getLeaders(){try{return JSON.parse(localStorage.getItem('cosmic.leaders.v3')||'[]')}catch(_){return[]}}
function saveLeader(entry){
  const list=getLeaders();list.push(entry);list.sort((a,b)=>b.score-a.score);
  localStorage.setItem('cosmic.leaders.v3',JSON.stringify(list.slice(0,8)));renderLeaderboard();
}
function renderLeaderboard(){
  const box=$('#homeLeaderboard'),list=getLeaders();
  if(!list.length){box.innerHTML='<div class="empty-state">ยังไม่มี Expedition · เริ่มเล่นเพื่อสร้างสถิติแรก</div>';return}
  box.innerHTML=list.slice(0,5).map((x,i)=>`<div class="leader-row"><b>#${i+1}</b><div>${escapeHtml(x.ship)}<small>${escapeHtml(x.difficulty)} · ${x.sectors} sectors · ${x.rescues} rescues</small></div><strong>${x.score}</strong></div>`).join('');
}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

function renderHome(){
  $('#homeRoute').innerHTML=missions.map(m=>`<div class="route-item"><small>${m.number} · ${m.short}</small><strong>${m.name}</strong></div>`).join('');
  $('#itemLegend').innerHTML=Object.values(specials).map(x=>`<div class="legend-item"><div class="legend-icon">${x.icon}</div><div><b>${x.name}</b><small>${x.desc}</small></div></div>`).join('');
  renderLeaderboard();
}
function renderSetup(){
  const shipsBox=$('#shipCards');shipsBox.innerHTML='';
  ships.forEach((s,i)=>{
    const b=document.createElement('button');b.type='button';b.className='ship-card'+(i===state.selectedShip?' selected':'');
    b.innerHTML=`<div class="mini-ship"></div><strong>${s.name}</strong><small>${s.subtitle}</small>`;
    b.addEventListener('click',()=>{state.selectedShip=i;renderSetup();resetIdle();sfx('tap')});shipsBox.appendChild(b);
  });
  const missionBox=$('#missionCards');missionBox.innerHTML='';
  missions.forEach((m,i)=>{
    const b=document.createElement('button');b.type='button';b.className='mission-card'+(i===state.selectedMission?' selected':'');
    b.innerHTML=`<span class="m-number">START ${m.number}</span><h4>${m.name}</h4><p>${m.desc}</p><div class="difficulty">${[1,2,3,4].map(n=>`<i class="${n<=Math.ceil(m.difficulty*2)?'on':''}"></i>`).join('')}</div>`;
    b.addEventListener('click',()=>{state.selectedMission=i;renderSetup();resetIdle();sfx('tap')});missionBox.appendChild(b);
  });
  const s=ships[state.selectedShip],m=missions[state.selectedMission];
  $('#selectedShipName').textContent=s.name;$('#shipDescription').textContent=s.desc;
  setSpec('Speed',s.speed);setSpec('Armor',s.armor);setSpec('Energy',s.energy);
  $('#selectedMissionTag').textContent=m.number;$('#launchSummary').textContent=`${s.name} · เริ่มจาก ${m.name} แล้วบินต่อเนื่อง`;
}
function setSpec(key,val){$('#spec'+key).style.width=val+'%';$('#spec'+key+'Value').textContent=val}

function showScreen(name){
  state.screen=name;
  $$('.screen').forEach(x=>x.classList.toggle('active',x.id==='screen'+name[0].toUpperCase()+name.slice(1)));
  resetIdle();
}
function resetExpedition(){
  state.score=0;state.sectorScore=0;state.collected=0;state.fuel=100;state.shield=100;state.hits=0;state.distance=0;state.sectorsCleared=0;
  state.rocks=[];state.cores=[];state.pickups=[];state.particles=[];state.powers={shield:0,time:0,magnet:0,warp:0};state.quantumKeys=0;state.gates=0;state.rescues=0;
  state.combo=1;state.comboTimer=0;state.bestCombo=1;state.specialItems=0;state.inventory={fuel:0,repair:0,shield:0,time:0,magnet:0,warp:0,key:0};
  state.event=null;state.eventDuration=0;state.invulnerable=0;$('#globalScore').textContent='0';
}
function startCampaign(){state.selectedMission=0;renderSetup();showScreen('setup');toast('Continuous Expedition · เริ่มจากโลกและบินต่อจนถึงหลุมดำ');sfx('launch')}
function openSetup(){renderSetup();showScreen('setup');sfx('tap')}
function prepareExpedition(){
  resetExpedition();state.activeMission=state.selectedMission;state.collected=0;state.running=false;state.transitioning=false;
  resizeCanvas();const m=missions[state.activeMission],s=ships[state.selectedShip];
  $('#briefNumber').textContent=m.number;$('#briefTitle').textContent=m.name;$('#briefText').textContent=m.desc;
  $('#briefObjective').textContent=`เก็บ Data Core ${m.goal} จุด · ไอเท็มพิเศษช่วยให้บินต่อเนื่อง`;
  $('#sideShipName').textContent=s.name;$('#missionTip').textContent=m.tip;$('#liveObjective').textContent=`Data Core 0 / ${m.goal}`;
  $('#briefOverlay').classList.remove('hidden');$('#countdownOverlay').classList.add('hidden');$('#transitionOverlay').classList.add('hidden');$('#emergencyOverlay').classList.add('hidden');$('#attractOverlay').classList.add('hidden');
  renderInventory();updateHud();showScreen('game');draw();
}
async function beginCountdown(){
  ensureAudio();$('#briefOverlay').classList.add('hidden');$('#countdownOverlay').classList.remove('hidden');
  for(const n of [3,2,1]){$('#countdownValue').textContent=n;sfx('count');await wait(620)}
  $('#countdownValue').textContent='GO';sfx('go');await wait(380);$('#countdownOverlay').classList.add('hidden');startSector(true);
}
function wait(ms){return new Promise(r=>setTimeout(r,ms))}
function startSector(first=false){
  const m=missions[state.activeMission];
  state.running=true;state.transitioning=false;state.emergencyActive=false;state.lastTime=performance.now();
  state.spawnTimer=.2;state.coreTimer=.55;state.specialTimer=2.4+Math.random()*1.8;state.eventTimer=16+Math.random()*12;
  shipBody.x=width/2;shipBody.y=height-80;shipBody.vx=0;
  $('#hudMission').textContent=m.short;$('#liveObjective').textContent=`Data Core ${state.collected} / ${m.goal}`;
  showFact(m.fact);startEngine();cancelAnimationFrame(state.raf);state.raf=requestAnimationFrame(loop);arena.focus();resetIdle();
  if(first)sfx('launch');
}

function difficulty(){return difficultyProfiles[state.settings.difficulty]||difficultyProfiles.normal}
function update(dt){
  if(state.emergencyActive||state.transitioning)return;
  const m=missions[state.activeMission],s=ships[state.selectedShip],d=difficulty();
  const timeScale=state.powers.time>0?.5:1;
  const warpActive=state.powers.warp>0;
  const manualBoost=state.boost&&state.fuel>2;
  const speedBoost=warpActive?1.7:manualBoost?1.48:1;
  const steering=(state.keys.right?1:0)-(state.keys.left?1:0);
  shipBody.vx+=steering*930*s.move*dt;shipBody.vx*=Math.pow(.0022,dt);shipBody.x+=shipBody.vx*dt;shipBody.x=Math.max(30,Math.min(width-30,shipBody.x));

  const drain=(warpActive?0:(manualBoost?5:1.12))*s.fuel*(state.event==='solar'?1.55:1);
  state.fuel-=drain*dt;
  state.distance+=(62*m.difficulty*speedBoost)*dt;
  state.invulnerable=Math.max(0,state.invulnerable-dt);
  for(const k of Object.keys(state.powers))state.powers[k]=Math.max(0,state.powers[k]-dt);
  if(state.comboTimer>0){state.comboTimer-=dt;if(state.comboTimer<=0)state.combo=1}
  if(state.eventDuration>0){state.eventDuration-=dt;if(state.eventDuration<=0)state.event=null}

  state.stars.forEach(st=>{st.y+=st.v*m.difficulty*d.speed*speedBoost*dt;if(st.y>height+25){st.y=-15;st.x=Math.random()*width}});

  state.spawnTimer-=dt;
  if(state.spawnTimer<=0){
    const r=13+Math.random()*21;
    state.rocks.push({x:r+Math.random()*(width-r*2),y:-38,r,v:(145+Math.random()*150)*m.difficulty*d.speed*(state.event==='meteor'?1.25:1),spin:(Math.random()-.5)*2.2,rot:0});
    state.spawnTimer=(.46+Math.random()*.34)*d.spawn/(state.event==='meteor'?1.8:1)/Math.max(1,m.difficulty*.84);
  }
  state.coreTimer-=dt;
  if(state.coreTimer<=0){
    state.cores.push({x:28+Math.random()*(width-56),y:-26,r:12,v:125*m.difficulty*d.speed,rot:0});
    state.coreTimer=(.9+Math.random()*.7)/(state.event==='data'?2.2:1);
  }
  state.specialTimer-=dt;
  if(state.specialTimer<=0){
    spawnSpecial();state.specialTimer=(4.2+Math.random()*3.2)*d.special/(state.event==='solar'?0.65:1);
  }
  state.eventTimer-=dt;
  if(state.eventTimer<=0){startRandomEvent();state.eventTimer=20+Math.random()*16}

  const hazardScale=timeScale;
  state.rocks.forEach(a=>{a.y+=a.v*hazardScale*dt;a.rot+=a.spin*dt});
  state.cores.forEach(c=>{c.y+=c.v*dt;c.rot+=2.8*dt});
  state.pickups.forEach(p=>{p.y+=p.v*dt;p.rot+=p.spin*dt});

  if(state.powers.magnet>0){
    [...state.cores,...state.pickups].forEach(o=>{
      const dx=shipBody.x-o.x,dy=shipBody.y-o.y,dist=Math.hypot(dx,dy);
      if(dist<250&&dist>1){o.x+=dx/dist*260*dt;o.y+=dy/dist*260*dt}
    });
  }

  for(let i=state.rocks.length-1;i>=0;i--){
    const a=state.rocks[i];
    if(rectCircle(shipBody,a)){
      state.rocks.splice(i,1);
      if(warpActive||state.powers.shield>0||state.invulnerable>0){burst(a.x,a.y,'shield',14);addScore(22);sfx('shield');continue}
      impact(a.x,a.y);state.hits++;state.combo=1;state.comboTimer=0;
      state.shield-=22*s.damage*d.damage*m.difficulty;
      if(state.shield<=0){state.shield=0;triggerEmergency('shield');return}
    }else if(a.y>height+50)state.rocks.splice(i,1);
  }

  for(let i=state.cores.length-1;i>=0;i--){
    const c=state.cores[i];
    if(rectCircle(shipBody,c)){
      state.cores.splice(i,1);burst(c.x,c.y,'collect',14);state.collected++;registerCombo();addScore(60+state.activeMission*15);state.fuel=Math.min(100,state.fuel+3);sfx('collect');
      $('#liveObjective').textContent=`Data Core ${state.collected} / ${m.goal}`;
      if(state.collected>=m.goal){completeSector();return}
    }else if(c.y>height+35)state.cores.splice(i,1);
  }

  for(let i=state.pickups.length-1;i>=0;i--){
    const p=state.pickups[i];
    if(rectCircle(shipBody,p)){
      state.pickups.splice(i,1);applySpecial(p.type,p.x,p.y);
    }else if(p.y>height+35)state.pickups.splice(i,1);
  }

  if(state.fuel<=0){state.fuel=0;triggerEmergency('fuel');return}
  updateParticles(dt);updateEngine();updateHud();
}

function spawnSpecial(){
  let pool=['fuel','repair','shield','time','magnet','warp','key'];
  if(state.fuel<35)pool.push('fuel','fuel');
  if(state.shield<40)pool.push('repair','repair');
  const type=pool[Math.floor(Math.random()*pool.length)];
  state.pickups.push({type,x:30+Math.random()*(width-60),y:-30,r:type==='key'?15:13,v:105+Math.random()*35,rot:0,spin:(Math.random()-.5)*2.5});
}
function startRandomEvent(){
  const choices=['meteor','data','solar'];state.event=choices[Math.floor(Math.random()*choices.length)];state.eventDuration=7;
  const labels={meteor:'METEOR STORM · อุกกาบาตหนาแน่น',data:'DATA SURGE · Data Core เพิ่มขึ้น',solar:'SOLAR FLARE · พลังงานลดเร็ว แต่ไอเท็มเพิ่ม'};
  showEvent(labels[state.event]);sfx('event');
}
function showEvent(text){
  clearTimeout(state.eventBannerTimer);$('#eventTitle').textContent=text;$('#eventBanner').classList.remove('hidden');
  state.eventBannerTimer=setTimeout(()=>$('#eventBanner').classList.add('hidden'),1800);
}
function registerCombo(){
  if(state.comboTimer>0)state.combo=Math.min(5,state.combo+1);else state.combo=1;
  state.comboTimer=3.7;state.bestCombo=Math.max(state.bestCombo,state.combo);
}
function addScore(base){const gain=Math.round(base*state.combo);state.sectorScore+=gain;state.score+=gain}
function applySpecial(type,x,y){
  const meta=specials[type];state.inventory[type]++;state.specialItems++;registerCombo();addScore(type==='key'?120:45);burst(x,y,type,18);sfx(type==='key'?'key':'power');
  if(type==='fuel')state.fuel=Math.min(100,state.fuel+25);
  if(type==='repair')state.shield=Math.min(100,state.shield+24);
  if(type==='shield')state.powers.shield=Math.max(state.powers.shield,6);
  if(type==='time')state.powers.time=Math.max(state.powers.time,7);
  if(type==='magnet')state.powers.magnet=Math.max(state.powers.magnet,8);
  if(type==='warp')state.powers.warp=Math.max(state.powers.warp,6);
  if(type==='key'){
    state.quantumKeys++;
    if(state.quantumKeys>=3)activateQuantumGate();
  }
  showPickup(`${meta.icon} ${meta.name} · ${meta.desc}`);renderInventory();updateHud();
}
function activateQuantumGate(){
  state.quantumKeys=0;state.gates++;state.score+=1000;state.sectorScore+=1000;state.fuel=100;state.shield=100;state.powers.warp=Math.max(state.powers.warp,9);state.invulnerable=3;
  showEvent('QUANTUM GATE OPEN · FULL RESTORE +1000');sfx('gate');
  for(let i=0;i<60;i++)state.particles.push({x:width/2,y:height/2,vx:(Math.random()-.5)*520,vy:(Math.random()-.5)*520,life:.8+Math.random()*.8,max:1.6,size:2+Math.random()*5,type:'gate'});
}

function triggerEmergency(type){
  if(state.emergencyActive)return;
  state.running=false;cancelAnimationFrame(state.raf);stopEngine();state.emergencyActive=true;state.emergencyType=type;state.questionIndex=(state.questionIndex+1)%missions[state.activeMission].questions.length;
  $('#emergencyIcon').textContent=type==='fuel'?'⚡':'🔧';
  $('#emergencyTitle').textContent=type==='fuel'?'พลังงานหมด · POWER FAILURE':'โครงสร้างยานเสียหาย · HULL CRITICAL';
  $('#emergencyText').textContent=type==='fuel'?'ตอบให้ถูกเพื่อเปิด Fuel Reserve +60% และบินต่อทันที':'ตอบให้ถูกเพื่อเรียก Repair Drone ซ่อม Hull +65% และบินต่อทันที';
  $('#emergencyOverlay').classList.remove('hidden');renderEmergencyQuestion();sfx('alarm');
}
function renderEmergencyQuestion(){
  const list=missions[state.activeMission].questions,q=list[state.questionIndex%list.length];
  $('#emergencyQuestion').textContent=q.q;$('#emergencyFeedback').textContent='';
  const box=$('#emergencyAnswers');box.innerHTML='';
  q.a.forEach((ans,i)=>{
    const b=document.createElement('button');b.type='button';b.className='answer-btn';b.textContent=ans;b.addEventListener('click',()=>answerEmergency(i,q));box.appendChild(b);
  });
}
function answerEmergency(index,q){
  const buttons=$$('#emergencyAnswers .answer-btn');buttons.forEach(b=>b.disabled=true);buttons[q.c]?.classList.add('correct');
  if(index===q.c){
    state.rescues++;state.invulnerable=2.8;state.score+=180;
    if(state.emergencyType==='fuel')state.fuel=Math.max(state.fuel,60);else state.shield=Math.max(state.shield,65);
    $('#emergencyFeedback').textContent='✓ ถูกต้อง · ระบบกู้คืนทำงาน กำลังกลับเข้าสู่เส้นทาง';sfx('rescue');
    setTimeout(()=>{
      $('#emergencyOverlay').classList.add('hidden');state.emergencyActive=false;state.lastTime=performance.now();state.running=true;startEngine();state.raf=requestAnimationFrame(loop);updateHud();
    },1000);
  }else{
    buttons[index]?.classList.add('wrong');state.score=Math.max(0,state.score-60);
    $('#emergencyFeedback').textContent='ยังไม่ถูก · เปลี่ยนคำถามใหม่เพื่อกู้ยานต่อ';
    sfx('fail');
    setTimeout(()=>{state.questionIndex=(state.questionIndex+1)%missions[state.activeMission].questions.length;renderEmergencyQuestion()},900);
  }
}

async function completeSector(){
  if(state.transitioning)return;
  state.running=false;state.transitioning=true;cancelAnimationFrame(state.raf);stopEngine();state.sectorsCleared++;state.score+=500;state.sectorScore+=500;sfx('success');
  const from=missions[state.activeMission];
  if(state.activeMission>=missions.length-1){await wait(700);finishExpedition(true,'เดินทางผ่านทุก Sector สำเร็จ');return}
  const to=missions[state.activeMission+1];
  $('#transitionFrom').textContent=from.short;$('#transitionTo').textContent=to.short;$('#transitionTitle').textContent='SECTOR CLEARED +500';$('#transitionSubtitle').textContent=`${from.name} → ${to.name} · เติมทรัพยากรระหว่างทาง`;
  $('#transitionOverlay').classList.remove('hidden');sfx('transition');
  state.fuel=Math.min(100,state.fuel+22);state.shield=Math.min(100,state.shield+18);state.invulnerable=2;
  await wait(1800);
  state.activeMission++;state.collected=0;state.rocks=[];state.cores=[];state.pickups=[];state.event=null;state.eventDuration=0;state.sectorScore=0;
  $('#transitionOverlay').classList.add('hidden');showFact(missions[state.activeMission].fact);updateHud();startSector(false);
}
function abortExpedition(){if(state.screen!=='game')return;state.running=false;cancelAnimationFrame(state.raf);stopEngine();finishExpedition(false,'ผู้เล่นจบ Expedition')}
function finishExpedition(success,message){
  state.running=false;state.transitioning=false;state.emergencyActive=false;cancelAnimationFrame(state.raf);stopEngine();
  showScreen('report');const s=ships[state.selectedShip];
  $('#reportTitle').textContent=success?'EXPEDITION COMPLETE':'EXPEDITION REPORT';$('#reportSubtitle').textContent=message;
  $('#reportGrade').textContent=grade();$('#reportScore').textContent=state.score.toLocaleString('th-TH');$('#reportSectors').textContent=`${state.sectorsCleared}/${missions.length-state.selectedMission}`;
  $('#reportRescues').textContent=state.rescues;$('#reportGates').textContent=state.gates;$('#reportCombo').textContent='x'+state.bestCombo;$('#reportItems').textContent=state.specialItems;
  saveLeader({score:state.score,ship:s.name,difficulty:difficulty().label,sectors:state.sectorsCleared,rescues:state.rescues,gates:state.gates,at:Date.now()});sfx('report');
}
function grade(){
  const routeLength=missions.length-state.selectedMission;
  if(state.sectorsCleared>=routeLength&&state.bestCombo>=4&&state.rescues<=2)return'S';
  if(state.sectorsCleared>=routeLength)return'A';
  if(state.sectorsCleared>=Math.ceil(routeLength/2))return'B';return'C';
}

function rectCircle(rect,c){
  const cx=Math.max(rect.x-rect.w/2,Math.min(c.x,rect.x+rect.w/2)),cy=Math.max(rect.y-rect.h/2,Math.min(c.y,rect.y+rect.h/2));
  return (c.x-cx)**2+(c.y-cy)**2<c.r*c.r;
}
function impact(x,y){
  burst(x,y,'impact',22);arena.classList.remove('shake');void arena.offsetWidth;arena.classList.add('shake');
  $('#impactFlash').classList.remove('flash');void $('#impactFlash').offsetWidth;$('#impactFlash').classList.add('flash');sfx('hit');
}
function burst(x,y,type,count=14){
  for(let i=0;i<count;i++)state.particles.push({x,y,vx:(Math.random()-.5)*280,vy:(Math.random()-.5)*280,life:.5+Math.random()*.45,max:.95,size:1.5+Math.random()*4,type});
}
function updateParticles(dt){
  state.particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(.07,dt);p.vy*=Math.pow(.07,dt);p.life-=dt});
  state.particles=state.particles.filter(p=>p.life>0);
}

function draw(){
  if(!ctx)return;
  const m=missions[state.activeMission]||missions[0];
  ctx.clearRect(0,0,width,height);
  const g=ctx.createLinearGradient(0,0,0,height);g.addColorStop(0,m.palette[0]);g.addColorStop(1,m.palette[1]);ctx.fillStyle=g;ctx.fillRect(0,0,width,height);
  drawNebula(m);drawStars();drawBackdrop(m);drawCores();drawPickups();drawRocks();drawParticles();drawShip();
}
function drawNebula(m){
  const ng=ctx.createRadialGradient(width*.25,height*.25,0,width*.25,height*.25,width*.65);ng.addColorStop(0,m.id==='mars'?'rgba(160,54,28,.12)':m.id==='blackhole'?'rgba(119,49,160,.11)':'rgba(48,91,160,.09)');ng.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=ng;ctx.fillRect(0,0,width,height);
}
function drawBackdrop(m){
  if(m.id==='earth'){
    const x=width*.84,y=height*.12,r=Math.min(110,width*.12);const pg=ctx.createRadialGradient(x-r*.3,y-r*.35,4,x,y,r);pg.addColorStop(0,'#9ceeff');pg.addColorStop(.17,'#2d7bce');pg.addColorStop(.55,'#164a89');pg.addColorStop(1,'#07142d');ctx.fillStyle=pg;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(113,232,255,.18)';ctx.lineWidth=5;ctx.beginPath();ctx.arc(x,y,r+4,0,Math.PI*2);ctx.stroke();
  }
  if(m.id==='moon'){
    const x=width*.83,y=height*.14,r=Math.min(96,width*.105);const pg=ctx.createRadialGradient(x-r*.35,y-r*.35,2,x,y,r);pg.addColorStop(0,'#f2f1ec');pg.addColorStop(.55,'#a5abb1');pg.addColorStop(1,'#505762');ctx.fillStyle=pg;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(50,54,60,.17)';[[-.25,-.12,.18],[.18,.2,.13],[-.05,.3,.09],[.28,-.25,.1]].forEach(([dx,dy,rr])=>{ctx.beginPath();ctx.arc(x+dx*r,y+dy*r,rr*r,0,Math.PI*2);ctx.fill()});
  }
  if(m.id==='mars'){
    const x=width*.83,y=height*.15,r=Math.min(108,width*.12);const pg=ctx.createRadialGradient(x-r*.32,y-r*.32,4,x,y,r);pg.addColorStop(0,'#ffc094');pg.addColorStop(.38,'#c55d38');pg.addColorStop(.72,'#71301f');pg.addColorStop(1,'#2e130e');ctx.fillStyle=pg;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(83,26,15,.25)';ctx.lineWidth=7;ctx.beginPath();ctx.arc(x,y+8,r*.64,.2,2.8);ctx.stroke();
  }
  if(m.id==='blackhole'){
    const x=width*.8,y=height*.18;ctx.save();ctx.translate(x,y);const dg=ctx.createLinearGradient(-130,0,130,0);dg.addColorStop(0,'rgba(255,164,70,0)');dg.addColorStop(.35,'rgba(255,185,90,.55)');dg.addColorStop(.55,'rgba(199,111,255,.65)');dg.addColorStop(1,'rgba(129,67,255,0)');ctx.strokeStyle=dg;ctx.lineWidth=16;ctx.beginPath();ctx.ellipse(0,0,120,36,-.16,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='rgba(218,129,255,.22)';ctx.lineWidth=6;ctx.beginPath();ctx.ellipse(0,0,145,46,-.16,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#000';ctx.shadowColor='rgba(178,98,255,.5)';ctx.shadowBlur=32;ctx.beginPath();ctx.arc(0,0,48,0,Math.PI*2);ctx.fill();ctx.restore();
  }
}
function drawStars(){
  const warp=state.powers.warp>0||(state.boost&&state.running&&state.fuel>1);
  ctx.save();ctx.lineCap='round';
  state.stars.forEach(st=>{
    const a=.28+st.s*.26;
    if(warp){ctx.strokeStyle=`rgba(190,225,255,${Math.min(.95,a+.28)})`;ctx.lineWidth=Math.max(1,st.s);ctx.beginPath();ctx.moveTo(st.x,st.y);ctx.lineTo(st.x,st.y-26-st.v*.13);ctx.stroke()}
    else{ctx.fillStyle=`rgba(255,255,255,${a})`;ctx.beginPath();ctx.arc(st.x,st.y,st.s,0,Math.PI*2);ctx.fill()}
  });ctx.restore();
}
function drawCores(){
  state.cores.forEach(c=>{ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.rot);ctx.strokeStyle='#82efff';ctx.lineWidth=3;ctx.shadowColor='#65ddff';ctx.shadowBlur=14;ctx.beginPath();ctx.moveTo(0,-c.r);ctx.lineTo(c.r,0);ctx.lineTo(0,c.r);ctx.lineTo(-c.r,0);ctx.closePath();ctx.stroke();ctx.restore()});
}
function pickupColor(type){return {fuel:'#ffd16a',repair:'#7df0b8',shield:'#71e8ff',time:'#b886ff',magnet:'#ff83d6',warp:'#fff3a1',key:'#eafaff'}[type]||'#fff'}
function drawPickups(){
  state.pickups.forEach(p=>{ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);const c=pickupColor(p.type);ctx.strokeStyle=c;ctx.fillStyle=c;ctx.shadowColor=c;ctx.shadowBlur=16;ctx.lineWidth=2.5;
    if(p.type==='fuel'){ctx.strokeRect(-8,-11,16,22);ctx.fillRect(8,-5,3,10);ctx.beginPath();ctx.moveTo(-2,-7);ctx.lineTo(4,-1);ctx.lineTo(0,-1);ctx.lineTo(2,7);ctx.lineTo(-4,1);ctx.lineTo(0,1);ctx.closePath();ctx.fill()}
    else if(p.type==='repair'){ctx.fillRect(-3,-11,6,22);ctx.fillRect(-11,-3,22,6)}
    else if(p.type==='key'){ctx.beginPath();ctx.moveTo(0,-14);ctx.lineTo(12,0);ctx.lineTo(0,14);ctx.lineTo(-12,0);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(0,0,4,0,Math.PI*2);ctx.fill()}
    else{ctx.beginPath();ctx.arc(0,0,12,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fill()}
  ctx.restore()});
}
function drawRocks(){
  state.rocks.forEach(a=>{ctx.save();ctx.translate(a.x,a.y);ctx.rotate(a.rot);ctx.fillStyle='#706861';ctx.strokeStyle='#9a9189';ctx.lineWidth=2;ctx.beginPath();for(let j=0;j<8;j++){const ang=j/8*Math.PI*2,rr=a.r*(.84+(j%3)*.08),x=Math.cos(ang)*rr,y=Math.sin(ang)*rr;j?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='rgba(22,17,14,.22)';ctx.beginPath();ctx.arc(-a.r*.22,-a.r*.1,a.r*.21,0,Math.PI*2);ctx.fill();ctx.restore()});
}
function drawParticles(){
  const colors={collect:'120,236,255',impact:'255,145,88',shield:'116,232,255',fuel:'255,209,106',repair:'125,240,184',time:'184,134,255',magnet:'255,131,214',warp:'255,243,161',key:'225,251,255',gate:'188,125,255'};
  state.particles.forEach(p=>{const a=Math.max(0,p.life/p.max),rgb=colors[p.type]||colors.collect;ctx.fillStyle=`rgba(${rgb},${a})`;ctx.beginPath();ctx.arc(p.x,p.y,p.size*a,0,Math.PI*2);ctx.fill()});
}
function drawShip(){
  const s=ships[state.selectedShip],warp=state.powers.warp>0;ctx.save();ctx.translate(shipBody.x,shipBody.y);
  if(warp||state.powers.shield>0||state.invulnerable>0){ctx.strokeStyle='rgba(113,232,255,.55)';ctx.lineWidth=2;ctx.shadowColor='#71e8ff';ctx.shadowBlur=20;ctx.beginPath();ctx.ellipse(0,0,31,43,0,0,Math.PI*2);ctx.stroke()}
  ctx.shadowColor=warp?'#fff3a1':'#71e8ff';ctx.shadowBlur=warp?22:8;ctx.fillStyle='#e5edf4';ctx.beginPath();
  if(s.id==='raptor'){ctx.moveTo(0,-35);ctx.lineTo(15,27);ctx.lineTo(0,18);ctx.lineTo(-15,27)}
  else if(s.id==='guardian'){ctx.moveTo(0,-28);ctx.lineTo(24,17);ctx.lineTo(14,30);ctx.lineTo(0,21);ctx.lineTo(-14,30);ctx.lineTo(-24,17)}
  else{ctx.moveTo(0,-32);ctx.lineTo(20,23);ctx.lineTo(7,17);ctx.lineTo(0,29);ctx.lineTo(-7,17);ctx.lineTo(-20,23)}
  ctx.closePath();ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#6edaff';ctx.beginPath();ctx.ellipse(0,-8,6,11,0,0,Math.PI*2);ctx.fill();
  const flame=state.running?(warp?64:state.boost?53:40):24;ctx.fillStyle=warp?'#fff3a1':state.boost?'#fff0a0':'#ffa65d';ctx.beginPath();ctx.moveTo(-7,22);ctx.quadraticCurveTo(0,flame+Math.random()*7,7,22);ctx.closePath();ctx.fill();ctx.restore();
}

function loop(t){
  if(!state.running)return;
  const dt=Math.min(.033,(t-state.lastTime)/1000||0);state.lastTime=t;update(dt);draw();
  if(state.running)state.raf=requestAnimationFrame(loop);
}
function updateHud(){
  const m=missions[state.activeMission]||missions[0];
  $('#hudMission').textContent=m.short;$('#hudData').textContent=`${state.collected} / ${m.goal}`;
  $('#hudFuel').textContent=Math.round(Math.max(0,state.fuel))+'%';$('#hudFuelBar').style.width=Math.max(0,state.fuel)+'%';
  $('#hudShield').textContent=Math.round(Math.max(0,state.shield))+'%';$('#hudShieldBar').style.width=Math.max(0,state.shield)+'%';
  $('#hudCombo').textContent='x'+state.combo;$('#hudScore').textContent=state.score;$('#globalScore').textContent=state.score;
  $('#sideSpeed').textContent=Math.round((state.powers.warp>0?56:state.boost?39:25)*m.difficulty*ships[state.selectedShip].move)+' km/s';
  $('#sideDistance').textContent=Math.round(state.distance).toLocaleString('th-TH')+' km';$('#sideHits').textContent=state.hits;$('#sideRescues').textContent=state.rescues;
  $('#keyCount').textContent=`${state.quantumKeys} / 3`;
  updatePowerChip('Shield',state.powers.shield);updatePowerChip('Time',state.powers.time);updatePowerChip('Magnet',state.powers.magnet);updatePowerChip('Warp',state.powers.warp);
}
function updatePowerChip(name,val){
  const chip=$('#power'+name),txt=$('#power'+name+'Time');chip.classList.toggle('active',val>0);txt.textContent=val>0?val.toFixed(1)+'s':'—';
}
function renderInventory(){
  const order=['fuel','repair','shield','time','magnet','warp','key'];
  $('#inventoryList').innerHTML=order.map(k=>`<div class="inventory-row"><span>${specials[k].icon} ${specials[k].name}</span><b>${state.inventory[k]}</b></div>`).join('');
}
function showFact(text){
  $('#factToast').textContent=text;$('#factToast').classList.add('show');clearTimeout(state.factTimer);state.factTimer=setTimeout(()=>$('#factToast').classList.remove('show'),4500);
}
function showPickup(text){
  $('#pickupToast').textContent=text;$('#pickupToast').classList.add('show');clearTimeout(state.pickupTimer);state.pickupTimer=setTimeout(()=>$('#pickupToast').classList.remove('show'),1300);
}
function toast(msg){
  const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(state.toastTimer);state.toastTimer=setTimeout(()=>el.classList.remove('show'),2200);
}

function resizeCanvas(){
  const r=arena.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,2);width=Math.max(1,r.width);height=Math.max(1,r.height);
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
  shipBody.y=height-80;if(!shipBody.x)shipBody.x=width/2;
  const target=Math.min(180,Math.max(90,Math.floor(width*height/4800)));
  if(state.stars.length!==target)state.stars=Array.from({length:target},()=>({x:Math.random()*width,y:Math.random()*height,s:.3+Math.random()*1.5,v:16+Math.random()*68}));
  draw();
}
function setMove(side,on){state.keys[side]=on;if(on)resetIdle()}
function setBoost(on){state.boost=on;if(on){resetIdle();if(state.running)sfx('boost')}updateEngine()}
function bindHold(el,down,up){el.addEventListener('pointerdown',e=>{e.preventDefault();down()});['pointerup','pointercancel','pointerleave'].forEach(ev=>el.addEventListener(ev,up))}

function ensureAudio(){
  if(!state.audioCtx){const AC=window.AudioContext||window.webkitAudioContext;if(AC)state.audioCtx=new AC()}
  if(state.audioCtx?.state==='suspended')state.audioCtx.resume().catch(()=>{});
}
function startEngine(){
  if(!state.settings.sound||state.settings.volume<=0)return;ensureAudio();stopEngine();
  const ac=state.audioCtx;if(!ac)return;
  const master=ac.createGain(),o1=ac.createOscillator(),o2=ac.createOscillator(),lfo=ac.createOscillator(),lfoGain=ac.createGain();
  o1.type='sawtooth';o2.type='triangle';o1.frequency.value=48;o2.frequency.value=72;lfo.frequency.value=3.2;lfoGain.gain.value=4;
  lfo.connect(lfoGain);lfoGain.connect(o1.frequency);o1.connect(master);o2.connect(master);master.connect(ac.destination);
  master.gain.value=(state.settings.volume/100)*.022;o1.start();o2.start();lfo.start();state.engineNodes={master,o1,o2,lfo};
}
function stopEngine(){
  const n=state.engineNodes;if(!n)return;try{n.master.gain.exponentialRampToValueAtTime(.0001,state.audioCtx.currentTime+.08);n.o1.stop(state.audioCtx.currentTime+.1);n.o2.stop(state.audioCtx.currentTime+.1);n.lfo.stop(state.audioCtx.currentTime+.1)}catch(_){}
  state.engineNodes=null;
}
function updateEngine(){
  const n=state.engineNodes;if(!n||!state.audioCtx)return;const active=state.powers.warp>0||state.boost,target=active?86:48;
  try{n.o1.frequency.setTargetAtTime(target,state.audioCtx.currentTime,.08);n.o2.frequency.setTargetAtTime(active?128:72,state.audioCtx.currentTime,.08);n.master.gain.setTargetAtTime((state.settings.volume/100)*(active?.038:.022),state.audioCtx.currentTime,.05)}catch(_){}
}
function noiseBurst(duration=.18,vol=.08){
  const ac=state.audioCtx;if(!ac)return;const len=Math.max(1,Math.floor(ac.sampleRate*duration)),buf=ac.createBuffer(1,len,ac.sampleRate),data=buf.getChannelData(0);
  for(let i=0;i<len;i++)data[i]=(Math.random()*2-1)*(1-i/len);
  const src=ac.createBufferSource(),gain=ac.createGain(),filter=ac.createBiquadFilter();filter.type='lowpass';filter.frequency.value=900;src.buffer=buf;src.connect(filter);filter.connect(gain);gain.connect(ac.destination);gain.gain.value=(state.settings.volume/100)*vol;src.start();
}
function sfx(type){
  if(!state.settings.sound||state.settings.volume<=0)return;ensureAudio();const ac=state.audioCtx;if(!ac)return;const now=ac.currentTime,vol=(state.settings.volume/100)*.1;
  if(type==='hit'||type==='alarm'||type==='gate'){noiseBurst(type==='gate'?.7:.25,type==='gate'?.12:.1)}
  const cfg={
    tap:[430,.05,'sine'],count:[520,.1,'square'],go:[920,.18,'sine'],launch:[145,.4,'sawtooth'],collect:[760,.12,'sine'],
    hit:[82,.22,'sawtooth'],power:[620,.15,'sine'],key:[980,.22,'sine'],shield:[420,.1,'triangle'],success:[680,.34,'sine'],
    fail:[150,.28,'square'],transition:[210,.7,'sine'],boost:[115,.08,'sawtooth'],event:[300,.24,'triangle'],alarm:[190,.45,'square'],
    rescue:[520,.55,'sine'],gate:[180,.9,'sine'],report:[420,.6,'sine']
  }[type]||[420,.08,'sine'];
  const gain=ac.createGain(),osc=ac.createOscillator();osc.type=cfg[2];osc.frequency.setValueAtTime(cfg[0],now);osc.connect(gain);gain.connect(ac.destination);gain.gain.setValueAtTime(.0001,now);
  if(['launch','transition','rescue','gate','report'].includes(type))osc.frequency.exponentialRampToValueAtTime(type==='gate'?1200:type==='rescue'?940:620,now+cfg[1]);
  if(type==='hit')osc.frequency.exponentialRampToValueAtTime(45,now+cfg[1]);gain.gain.exponentialRampToValueAtTime(vol,now+.015);gain.gain.exponentialRampToValueAtTime(.0001,now+cfg[1]);osc.start(now);osc.stop(now+cfg[1]+.03);
}
function updateSoundButton(){$('#soundToggle').textContent=state.settings.sound&&state.settings.volume>0?'🔊':'🔇'}

function requestOperator(){
  state.operatorPaused=state.running;
  if(state.running){state.running=false;cancelAnimationFrame(state.raf);stopEngine()}
  $('#operatorPinInput').value='';$('#operatorPinError').textContent='';$('#operatorPinModal').classList.remove('hidden');setTimeout(()=>$('#operatorPinInput').focus(),50);resetIdle();
}
function submitOperatorPin(){
  if($('#operatorPinInput').value===getOperatorPin()){$('#operatorPinModal').classList.add('hidden');openOperator();sfx('tap')}
  else{$('#operatorPinError').textContent='รหัสไม่ถูกต้อง';sfx('fail')}
}
function openOperator(){
  $('#difficultySelect').value=state.settings.difficulty;$('#volumeRange').value=state.settings.volume;$('#volumeValue').textContent=state.settings.volume+'%';
  $('#idleRange').value=state.settings.idleSeconds;$('#idleValue').textContent=state.settings.idleSeconds+'s';$('#soundEnabled').checked=state.settings.sound;$('#pinChangeInput').value='';
  $('#operatorModal').classList.remove('hidden');resetIdle();
}
function resumeAfterOperator(){
  if(state.operatorPaused&&state.screen==='game'&&!state.emergencyActive&&!state.transitioning){state.operatorPaused=false;state.lastTime=performance.now();state.running=true;startEngine();cancelAnimationFrame(state.raf);state.raf=requestAnimationFrame(loop)}
  else state.operatorPaused=false;
}
function closeOperator(){$('#operatorModal').classList.add('hidden');resumeAfterOperator();resetIdle()}
function closePin(){$('#operatorPinModal').classList.add('hidden');resumeAfterOperator();resetIdle()}

function resetIdle(){
  clearTimeout(state.idleTimer);$('#attractOverlay').classList.add('hidden');
  state.idleTimer=setTimeout(()=>{
    if(!$('#operatorModal').classList.contains('hidden')||!$('#operatorPinModal').classList.contains('hidden'))return resetIdle();
    if(state.screen==='game'){
      state.running=false;cancelAnimationFrame(state.raf);stopEngine();$('#attractOverlay').classList.remove('hidden');
    }else showScreen('home');
  },Math.max(15,state.settings.idleSeconds)*1000);
}
function wakeAttract(){state.running=false;state.emergencyActive=false;state.transitioning=false;stopEngine();$('#attractOverlay').classList.add('hidden');showScreen('home');resetExpedition();sfx('go')}

function bindEvents(){
  $('#brandButton').addEventListener('click',()=>{state.running=false;cancelAnimationFrame(state.raf);stopEngine();showScreen('home')});
  $('#campaignStart').addEventListener('click',startCampaign);$('#missionSelectOpen').addEventListener('click',openSetup);$('#setupBack').addEventListener('click',()=>showScreen('home'));
  $('#launchSelected').addEventListener('click',prepareExpedition);$('#briefStart').addEventListener('click',beginCountdown);$('#abortMission').addEventListener('click',abortExpedition);
  $('#reportHome').addEventListener('click',()=>showScreen('home'));$('#reportReplay').addEventListener('click',()=>{state.selectedMission=0;prepareExpedition()});$('#attractWake').addEventListener('click',wakeAttract);
  bindHold($('#moveLeft'),()=>setMove('left',true),()=>setMove('left',false));bindHold($('#moveRight'),()=>setMove('right',true),()=>setMove('right',false));bindHold($('#boostButton'),()=>setBoost(true),()=>setBoost(false));
  arena.addEventListener('keydown',e=>{if(['ArrowLeft','a','A'].includes(e.key)){setMove('left',true);e.preventDefault()}if(['ArrowRight','d','D'].includes(e.key)){setMove('right',true);e.preventDefault()}if(e.code==='Space'){setBoost(true);e.preventDefault()}});
  arena.addEventListener('keyup',e=>{if(['ArrowLeft','a','A'].includes(e.key))setMove('left',false);if(['ArrowRight','d','D'].includes(e.key))setMove('right',false);if(e.code==='Space')setBoost(false)});
  $('#soundToggle').addEventListener('click',()=>{state.settings.sound=!state.settings.sound;localStorage.setItem('cosmic.operator.v3',JSON.stringify(state.settings));updateSoundButton();if(state.settings.sound){sfx('tap');if(state.running)startEngine()}else stopEngine()});
  $('#operatorOpen').addEventListener('click',requestOperator);$('#operatorPinSubmit').addEventListener('click',submitOperatorPin);$('#operatorPinCancel').addEventListener('click',closePin);$('[data-close-pin]').addEventListener('click',closePin);
  $('#operatorPinInput').addEventListener('keydown',e=>{if(e.key==='Enter')submitOperatorPin()});
  $('#operatorClose').addEventListener('click',closeOperator);$('[data-close-operator]').addEventListener('click',closeOperator);
  $('#operatorSave').addEventListener('click',()=>{if(saveSettings())closeOperator()});
  $('#volumeRange').addEventListener('input',e=>$('#volumeValue').textContent=e.target.value+'%');$('#idleRange').addEventListener('input',e=>$('#idleValue').textContent=e.target.value+'s');
  $('#resetScores').addEventListener('click',()=>{localStorage.removeItem('cosmic.leaders.v3');renderLeaderboard();toast('ล้างคะแนนในเครื่องแล้ว')});
  document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='o'&&state.screen!=='game')requestOperator();if(e.key==='Escape'){if(!$('#operatorModal').classList.contains('hidden'))closeOperator();if(!$('#operatorPinModal').classList.contains('hidden'))closePin()}});
  document.addEventListener('pointerdown',resetIdle,{passive:true});window.addEventListener('resize',resizeCanvas);new ResizeObserver(resizeCanvas).observe(arena);
}

function init(){
  loadSettings();renderHome();renderSetup();bindEvents();resizeCanvas();renderInventory();showScreen('home');updateHud();resetIdle();
}
init();
})();
