'use strict';
// ===== v4: shared adaptive levels, rewards, sfx, and 4 new games =====
// adaptive rule (same as Build a Word): struggled (3+ wrong or slow) -> one easier; quick + perfect -> one harder; range 1..6, saved per game
const GLV={};function glv(g){return GLV[g]||(GLV[g]=Math.min(6,Math.max(1,+(localStorage['wfLv_'+g]||1))))}
function adapt(g,wrongN,ms,quickMs,slowMs){let l=glv(g);if(wrongN>=3||ms>slowMs)l=Math.max(1,l-1);else if(wrongN===0&&ms<quickMs)l=Math.min(6,l+1);GLV[g]=l;localStorage['wfLv_'+g]=l;return l}
window.__lv=GLV;
// ---- extra sound effects
function tone(f,t0,d,type='sine',vol=.2){try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime+t0;o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(ac.destination);o.start(t);o.stop(t+d)}catch(e){}}
function sfxPop(){try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const n=ac.sampleRate*.08,b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n)**3;const s=ac.createBufferSource(),g=ac.createGain();g.gain.value=.5;s.buffer=b;s.connect(g).connect(ac.destination);s.start()}catch(e){}tone(900,0,.08,'triangle',.15)}
function sfxFanfare(){[523,659,784,1047].forEach((f,i)=>tone(f,i*.12,.25,'triangle',.18));tone(1319,.5,.5,'sine',.15)}
function sfxBoing(){tone(180,0,.25,'sine',.15);tone(140,.08,.2,'sine',.1)}
function sfxFlip(){tone(700,0,.06,'square',.06);tone(1000,.05,.06,'square',.05)}
// ---- sticker unlock celebration (every 10 stars)
const _star=star;star=function(n=1){const before=Math.floor(stars/10);_star(n);const now=Math.floor(stars/10);if(now>before&&now<=STK.length)newSticker(STK[now-1])};
function newSticker(e){const d=document.createElement('div');d.className='newstk';d.innerHTML='<div class="rays2"></div><div class="big">'+e+'</div><div class="lbl">🎁 ✨</div>';document.body.appendChild(d);sfxFanfare();confetti();say('Wow! A new sticker!',false);setTimeout(()=>d.remove(),2600)}
// ---- picture bank for first sounds / memory
const PICS={A:['🐜','ant'],B:['🐝','bee'],C:['🐱','cat'],D:['🐶','dog'],E:['🥚','egg'],F:['🐸','frog'],G:['🍇','grapes'],H:['🎩','hat'],I:['🍦','ice cream'],J:['🧃','juice'],K:['🪁','kite'],L:['🦁','lion'],M:['🌙','moon'],N:['👃','nose'],O:['🐙','octopus'],P:['🐷','pig'],Q:['👑','queen'],R:['🌈','rainbow'],S:['☀️','sun'],T:['🌳','tree'],U:['☂️','umbrella'],V:['🎻','violin'],W:['🍉','watermelon'],Y:['🪀','yo-yo'],Z:['🦓','zebra']};
const PL=Object.keys(PICS);const shuf=a=>a.slice().sort(()=>Math.random()-.5);
function celebrate(el,big){const r=el?el.getBoundingClientRect():{left:innerWidth/2,top:innerHeight/2,width:0,height:0};sparkle(r.left+r.width/2,r.top+r.height/2,18);if(big){cheer();confetti()}else{tone(784,0,.12,'triangle');tone(1047,.1,.15,'triangle')}}
function wobble(el){el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');sfxBoing()}

// ===== 1) Hear & Pop: "Pop the B!" =====
let hp={};
function start_hear(){const s=$('#hear');s.querySelectorAll('.balloon').forEach(b=>b.remove());const l=glv('hear'),n=[3,3,4,5,5,6][l-1];
 hp={t:rnd(PL),wrong:0,t0:Date.now(),done:false};const letters=shuf([hp.t,...shuf(PL.filter(c=>c!==hp.t)).slice(0,n-1)]);
 const W=s.clientWidth,H=s.clientHeight,cols=Math.min(n,3),rows=Math.ceil(n/cols);
 letters.forEach((L,i)=>{const b=document.createElement('div');b.className='balloon hb';b.textContent=L;b.dataset.l=L;b.style.background=rnd(COLORS);
  const c=i%cols,r=Math.floor(i/cols);b.style.left=((c+.5)*W/cols-55)+'px';b.style.top=(H*.2+r*(H*.62/rows)+(c%2)*25)+'px';b.style.animationDelay=(-Math.random()*3)+'s';
  b.addEventListener('pointerdown',()=>{if(hp.done||b.popped)return;if(L===hp.t){hp.done=true;b.popped=1;sfxPop();b.classList.add('pop');celebrate(b,true);star();say(rnd(PRAISE)+' '+L+'! '+SND[L]);
    adapt('hear',hp.wrong,Date.now()-hp.t0,4000,20000);setTimeout(()=>mode==='hear'&&start_hear(),2600)}
   else{hp.wrong++;wobble(b);say('That\'s '+L+'. Pop the '+hp.t+'!')}});s.appendChild(b)});
 $('#hearbtn').onclick=()=>say('Pop the '+hp.t+'! '+SND[hp.t]);setTimeout(()=>say('Pop the '+hp.t+'!'),300)}

// ===== 2) First Sound: drag the picture to its first letter =====
let fs={};
function start_first(){const l=glv('first'),n=[2,2,3,3,4,4][l-1];const t=rnd(PL.filter(c=>c!==fs.t));fs={t,wrong:0,t0:Date.now(),done:false};
 const pic=$('#fpic');pic.textContent=PICS[t][0];pic.style.transform='';pic.className='fpic';
 const box=$('#fletters');box.innerHTML='';shuf([t,...shuf(PL.filter(c=>c!==t)).slice(0,n-1)]).forEach(L=>{const d=document.createElement('div');d.className='house';d.dataset.l=L;d.innerHTML='<span>'+L+'</span>';d.onclick=()=>say(L+', '+SND[L]);box.appendChild(d)});
 setTimeout(()=>say(PICS[t][1]+'! '+(l<=2?SND[t]+', '+SND[t]+', '+PICS[t][1]+'. ':'')+'What sound does it start with?'),300)}
(function(){let sx,sy,on=false,ox,oy;const pic=()=>$('#fpic');
 document.addEventListener('pointerdown',e=>{if(e.target.id!=='fpic'||fs.done)return;e.preventDefault();on=true;const p=pic();try{p.setPointerCapture(e.pointerId)}catch(_){}sx=e.clientX;sy=e.clientY;const r=p.getBoundingClientRect();ox=r.left+r.width/2-sx;oy=r.top+r.height/2-sy;p.style.transition='none';p.classList.add('drag');say(PICS[fs.t][1])});
 document.addEventListener('pointermove',e=>{if(!on)return;pic().style.transform=`translate(${e.clientX-sx}px,${e.clientY-sy}px) scale(1.1)`});
 const end=e=>{if(!on)return;on=false;const p=pic();p.classList.remove('drag');const cx=e.clientX+ox,cy=e.clientY+oy;
  const h=[...document.querySelectorAll('.house')].find(h=>{const r=h.getBoundingClientRect();return cx>r.left-30&&cx<r.right+30&&cy>r.top-30&&cy<r.bottom+30});
  if(h&&h.dataset.l===fs.t){fs.done=true;const r=h.getBoundingClientRect(),r0=p.getBoundingClientRect();p.style.transition='transform .25s';p.style.transform=`translate(${e.clientX-sx+(r.left+r.width/2-cx)}px,${e.clientY-sy+(r.top+r.height/2-cy)}px) scale(.6)`;
   h.classList.add('win');celebrate(h,true);star();say(rnd(PRAISE)+' '+PICS[fs.t][1]+' starts with '+fs.t+'! '+SND[fs.t]);adapt('first',fs.wrong,Date.now()-fs.t0,5000,25000);setTimeout(()=>mode==='first'&&start_first(),3000)}
  else{if(h){fs.wrong++;wobble(h);say('That\'s '+h.dataset.l+'. '+SND[h.dataset.l]+'. Try again!')}p.style.transition='transform .35s ease';p.style.transform=''}};
 document.addEventListener('pointerup',end);document.addEventListener('pointercancel',end)})();

// ===== 3) Trace the Letter =====
let tr={};
function start_trace(){const l=glv('trace');const L=rnd(l<=3?'OCLITUVSAH'.split(''):PL);const cv=$('#tcv'),W=cv.clientWidth,H=cv.clientHeight,dpr=Math.min(2,devicePixelRatio||1);
 cv.width=W*dpr;cv.height=H*dpr;const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);
 const brush=[46,42,38,34,30,28][l-1],need=[.5,.55,.6,.66,.72,.78][l-1],fsz=Math.min(W,H)*.85;
 // mask of the letter
 const m=document.createElement('canvas');m.width=W;m.height=H;const mg=m.getContext('2d');mg.font=`900 ${fsz}px Arial Rounded MT Bold,Arial,sans-serif`;mg.textAlign='center';mg.textBaseline='middle';mg.fillText(L,W/2,H/2+fsz*.04);
 const px=mg.getImageData(0,0,W,H).data,pts=[];for(let y=4;y<H;y+=10)for(let x=4;x<W;x+=10)if(px[(y*W+x)*4+3]>128)pts.push([x,y]);
 tr={L,pts,hit:new Uint8Array(pts.length),need,brush,g,W,H,fsz,done:false,t0:Date.now(),strokes:0,color:rnd(COLORS),last:null};
 drawTrace();$('#tmeter').style.width='0%';setTimeout(()=>say('Trace the '+L+'! '+SND[L]),300);$('#tsay').onclick=()=>say(L+', '+SND[L])}
function drawTrace(){const{g,W,H,L,fsz}=tr;g.clearRect(0,0,W,H);g.font=`900 ${fsz}px Arial Rounded MT Bold,Arial,sans-serif`;g.textAlign='center';g.textBaseline='middle';
 g.fillStyle='#ffffff26';g.fillText(L,W/2,H/2+fsz*.04);g.setLineDash([6,14]);g.lineWidth=4;g.strokeStyle='#ffffffbb';g.strokeText(L,W/2,H/2+fsz*.04);g.setLineDash([])}
(function(){let on=false;const cv=()=>$('#tcv');
 function at(e){const r=cv().getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]}
 function paint(p){const{g,brush}=tr;g.lineCap='round';g.lineJoin='round';g.strokeStyle=tr.color;g.lineWidth=brush;g.shadowColor='#fff';g.shadowBlur=8;g.beginPath();const a=tr.last||p;g.moveTo(a[0],a[1]);g.lineTo(p[0],p[1]);g.stroke();g.shadowBlur=0;tr.last=p;
  const r2=(brush*.75)**2;let c=0;tr.pts.forEach((q,i)=>{if(!tr.hit[i]&&(q[0]-p[0])**2+(q[1]-p[1])**2<r2){tr.hit[i]=1}if(tr.hit[i])c++});const f=c/tr.pts.length;$('#tmeter').style.width=Math.min(100,f/tr.need*100)+'%';
  if(Math.random()<.15)sparkle(p[0]+cv().getBoundingClientRect().left,p[1]+cv().getBoundingClientRect().top,3);
  if(f>=tr.need&&!tr.done){tr.done=true;on=false;celebrate(cv(),true);star(2);say(rnd(PRAISE)+' You traced '+tr.L+'!');adapt('trace',Math.max(0,tr.strokes-4),Date.now()-tr.t0,9000,40000);setTimeout(()=>mode==='trace'&&start_trace(),3000)}}
 document.addEventListener('pointerdown',e=>{if(e.target.id!=='tcv'||tr.done)return;e.preventDefault();on=true;tr.strokes++;tr.last=null;tone(500+Math.random()*300,0,.08,'sine',.08);paint(at(e))});
 document.addEventListener('pointermove',e=>{if(on&&!tr.done)paint(at(e))});const up=()=>{on=false};document.addEventListener('pointerup',up);document.addEventListener('pointercancel',up)})();

// ===== 4) Memory Match: letter card <-> picture card =====
let mm={};
function start_memory(){const l=glv('memory'),pairs=[2,3,3,4,5,6][l-1];const ls=shuf(PL).slice(0,pairs);mm={open:[],got:0,pairs,wrong:0,t0:Date.now(),lock:false};
 const g=$('#mgrid');g.innerHTML='';g.style.gridTemplateColumns='repeat('+(pairs<=2?2:pairs<=4?3:4)+',1fr)';
 shuf(ls.flatMap(L=>[{L,k:'l'},{L,k:'p'}])).forEach(c=>{const d=document.createElement('button');d.className='mcard';d.dataset.l=c.L;
  d.innerHTML='<div class="mi"><div class="mf mback">⭐</div><div class="mf mfront">'+(c.k==='l'?'<b>'+c.L+'</b>':PICS[c.L][0])+'</div></div>';
  d.onclick=()=>{if(mm.lock||d.classList.contains('up'))return;d.classList.add('up');sfxFlip();say(c.k==='l'?c.L:PICS[c.L][1]);mm.open.push(d);
   if(mm.open.length===2){const[a,b]=mm.open;mm.open=[];if(a.dataset.l===b.dataset.l){mm.got++;setTimeout(()=>{a.classList.add('got');b.classList.add('got');celebrate(b,false);star();say(rnd(PRAISE)+' '+a.dataset.l+' is for '+PICS[a.dataset.l][1]+'!')},450);
     if(mm.got===mm.pairs){adapt('memory',Math.max(0,mm.wrong-mm.pairs),Date.now()-mm.t0,pairs*5000,pairs*20000);setTimeout(()=>{cheer();confetti();sfxFanfare();star(2)},1200);setTimeout(()=>mode==='memory'&&start_memory(),4200)}}
    else{mm.wrong++;mm.lock=true;setTimeout(()=>{a.classList.remove('up');b.classList.remove('up');mm.lock=false},1100)}}};g.appendChild(d)});
 setTimeout(()=>say('Find the matching pairs!'),300)}

// ---- Find the Letter gets the adaptive rule too (3 to 6 choices)
let fw={w:0,t0:0};
start_find_hook:{const _sf=startFind;startFind=function(){_sf();fw={w:0,t0:Date.now()};const n=[2,3,4,4,5,6][glv('find')-1],ch=[...document.querySelectorAll('.choice')];
 // grow or shrink choices around the target
 const have=ch.map(c=>c.textContent);while(document.querySelectorAll('.choice').length>n){const x=[...document.querySelectorAll('.choice')].find(c=>c.textContent!==target);x.remove()}
 const pool=shuf(PL.filter(c=>!have.includes(c)));while(document.querySelectorAll('.choice').length<n){const t=document.querySelector('.choice:not([data-t])')||ch[0];const c=t.cloneNode(true);c.textContent=pool.pop();c.style.background=rnd(COLORS);c.onclick=null;$('#choices').appendChild(c)}
 document.querySelectorAll('.choice').forEach(c=>{const L=c.textContent,old=c.onclick;c.onclick=()=>{if(L===target){adapt('find',fw.w,Date.now()-fw.t0,3500,20000);if(old)old();else{c.classList.add('yay');celebrate(c,false);say(rnd(PRAISE)+' That\'s '+L+'!');star();setTimeout(()=>mode==='find'&&startFind(),2200)}}else{fw.w++;wobble(c);say('That\'s '+L+'. Find the '+target+'!')}}})}}

// ?mode=pop|build|find opens a game straight away (handy for links)
{const m=new URLSearchParams(location.search).get('mode');if(['pop','build','find','hear','first','trace','memory','stickers'].includes(m)){$('#start').remove();show(m)}}
// ---- sticker album + per-game levels
function start_stickers(){const got=Math.floor(stars/10),a=$('#album');a.innerHTML='';STK.forEach((e,i)=>{const d=document.createElement('div');d.className='stk'+(i<got?' got':'');d.textContent=i<got?e:'?';d.onclick=()=>{if(i<got){d.classList.remove('yay');void d.offsetWidth;d.classList.add('yay');tone(600+i*40,0,.15,'triangle')}};a.appendChild(d)});
 const G=[['🐱',+(localStorage.wfLvl||1)],['🔍',glv('find')],['👂',glv('hear')],['🍎',glv('first')],['✏️',glv('trace')],['🃏',glv('memory')]];
 $('#levels').innerHTML=G.map(([e,l])=>'<div>'+e+' '+'⭐'.repeat(l)+'</div>').join('');say(got?'Look at all your stickers!':'Play games to win stickers!')}
