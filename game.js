'use strict';
const $=s=>document.querySelector(s);
const COLORS=['#ff6b9a','#ffb01f','#5ee08a','#4fa8ff','#b57bff','#ff7a45','#2fd3c4'];
// letter sounds spoken as easy syllables
const SND={A:'ah',B:'buh',C:'kuh',D:'duh',E:'eh',F:'fff',G:'guh',H:'huh',I:'ih',J:'juh',K:'kuh',L:'lll',M:'mmm',N:'nnn',O:'aw',P:'puh',Q:'kwuh',R:'rrr',S:'sss',T:'tuh',U:'uh',V:'vvv',W:'wuh',X:'ks',Y:'yuh',Z:'zzz'};
const WORDS=[['CAT','🐱'],['DOG','🐶'],['SUN','☀️'],['PIG','🐷'],['BUS','🚌'],['HAT','🎩'],['BED','🛏️'],['COW','🐮'],['FOX','🦊'],['BEE','🐝'],['CAR','🚗'],['EGG','🥚'],['BUG','🐛'],['CUP','🥤'],['HEN','🐔'],['BAT','🦇'],['PIE','🥧'],['BOX','📦'],['ANT','🐜'],['OWL','🦉']];
const PRAISE=['Great job!','Yay!','You did it!','Super!','Awesome!','Wow!','Amazing!','Good job!','High five!'];
const CHEERS=['⭐','🌟','🎉','👏','🥳','💖','🌈'];
const rnd=a=>a[Math.floor(Math.random()*a.length)];
let stars=+(localStorage.wfStars||0);const showStars=()=>$('#stars').textContent='⭐ '+stars;showStars();
function star(n=1){stars+=n;localStorage.wfStars=stars;showStars();$('#stars').classList.remove('yay');void $('#stars').offsetWidth;$('#stars').classList.add('yay')}
// ---- speech
let voice=null;function pickVoice(){const v=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang));voice=v.find(v=>/samantha|female|google us/i.test(v.name))||v[0]||null}
if('speechSynthesis'in window){pickVoice();speechSynthesis.onvoiceschanged=pickVoice}
function say(t,cancel=true){if(!('speechSynthesis'in window))return;if(cancel)speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);if(voice)u.voice=voice;u.rate=.85;u.pitch=1.3;speechSynthesis.speak(u)}
// ---- sfx
let ac;function beep(f=600,d=.12,type='sine'){try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;o.frequency.exponentialRampToValueAtTime(f*1.6,ac.currentTime+d);g.gain.setValueAtTime(.25,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}
function cheer(){owlCheer();const c=$('#cheer');c.textContent=rnd(CHEERS);c.classList.add('on');setTimeout(()=>c.classList.remove('on'),900);[523,659,784].forEach((f,i)=>setTimeout(()=>beep(f,.15),i*110))}
// ---- confetti
const cv=$('#cf'),cx=cv.getContext('2d');let parts=[];
function resize(){cv.width=innerWidth;cv.height=innerHeight}addEventListener('resize',resize);resize();
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
function confetti(){const n=RM?30:110;for(let i=0;i<n;i++)parts.push({k:i%3,x:innerWidth*(.2+Math.random()*.6),y:innerHeight*.35,vx:(Math.random()-.5)*14,vy:-Math.random()*14-5,c:rnd(COLORS),s:9+Math.random()*9,r:Math.random()*6,vr:(Math.random()-.5)*.4,f:Math.random()*6,life:150});starBurst(innerWidth/2,innerHeight*.4)}
function sparkle(x,y,n=14){if(RM)n=5;for(let i=0;i<n;i++){const a=Math.PI*2*i/n,v=3+Math.random()*4;parts.push({k:3,x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,c:rnd(['#fff59d','#ffffff','#ffd23f','#ffe0f0']),s:6+Math.random()*8,r:0,vr:.2,f:0,life:40})}}
function starBurst(x,y){const d=document.createElement('div');d.className='burst';d.style.left=x+'px';d.style.top=y+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),900)}
function star5(s){cx.beginPath();for(let i=0;i<10;i++){const r=i%2?s*.45:s,a=i*Math.PI/5-Math.PI/2;cx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}cx.fill()}
(function loop(){cx.clearRect(0,0,cv.width,cv.height);parts=parts.filter(p=>p.life-->0);for(const p of parts){const sp=p.k===3;p.vy+=sp?.05:.3;p.vx*=sp?.93:.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;p.f+=.15;
 cx.save();cx.globalAlpha=Math.min(1,p.life/30);cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;
 if(sp){star5(p.s*(p.life/40))}else if(p.k===0){cx.scale(1,Math.cos(p.f));cx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2)}else if(p.k===1){cx.beginPath();cx.arc(0,0,p.s/3,0,7);cx.fill()}else{star5(p.s/2)}cx.restore()}requestAnimationFrame(loop)})();
function owlCheer(){document.querySelectorAll('.owl').forEach(o=>{o.classList.remove('cheer');void o.getBoundingClientRect();o.classList.add('cheer')})}
// ---- navigation
let mode='menu',timers=[];
function show(m){mode=m;timers.forEach(clearInterval);timers=[];document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===m));document.body.dataset.m=m;if(m==='menu')shelf();if(m==='pop')startPop();if(m==='build')startBuild();if(m==='find')startFind();if(window['start_'+m])window['start_'+m]()}
document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{beep(500);say(b.getAttribute('aria-label'));show(b.dataset.m)});
$('#home').onclick=()=>{beep(400);show('menu');say('Pick a game!')};
$('#fs').onclick=()=>{const d=document,e=d.documentElement;if(d.fullscreenElement||d.webkitFullscreenElement){(d.exitFullscreen||d.webkitExitFullscreen).call(d)}else{(e.requestFullscreen||e.webkitRequestFullscreen||(()=>{})).call(e)}};
$('#go').onclick=()=>{$('#start').remove();beep(700);say('Hi! Pick a game!')};
// ---- Letter Pop
const LET='ABCDEFGHIJKLMNOPQRSTUVWXYZ';let pops=0;
function startPop(){const s=$('#pop');s.querySelectorAll('.balloon').forEach(b=>b.remove());for(let i=0;i<5;i++)setTimeout(addBalloon,i*500);timers.push(setInterval(()=>{if(s.querySelectorAll('.balloon').length<6)addBalloon()},1400))}
function addBalloon(){if(mode!=='pop')return;const s=$('#pop'),b=document.createElement('div'),L=rnd(LET.split(''));b.className='balloon';b.textContent=L;b.style.background=rnd(COLORS);
 const W=s.clientWidth,H=s.clientHeight;let x=Math.random()*(W-110),y=H;b.style.left=x+'px';b.style.top=y+'px';s.appendChild(b);const sp=.6+Math.random()*.8,ph=Math.random()*6;
 (function fly(){if(!b.isConnected||b.popped)return;y-=sp;b.style.top=y+'px';b.style.left=(x+Math.sin(y/40+ph)*20)+'px';if(y<-150){b.remove();return}requestAnimationFrame(fly)})();
 b.addEventListener('pointerdown',()=>{if(b.popped)return;b.popped=1;b.classList.add('pop');{const r=b.getBoundingClientRect();sparkle(r.left+r.width/2,r.top+r.height/2)}beep(300+Math.random()*500,.15,'triangle');setTimeout(()=>b.remove(),350);
  const big=$('#bigl');big.textContent=L;big.style.opacity=1;clearTimeout(big.t);big.t=setTimeout(()=>big.style.opacity=0,1200);
  say(L+'! '+SND[L]+', '+SND[L]);star();if(++pops%5===0){setTimeout(()=>{say(rnd(PRAISE),false);cheer();confetti()},200)}})}
// ---- Build a Word (drag only, adaptive level 1-6 saved on device)
const WORDS4=[['FISH','🐟'],['FROG','🐸'],['CAKE','🎂'],['BOAT','⛵'],['STAR','⭐'],['DUCK','🦆'],['BEAR','🐻'],['MOON','🌙'],['TREE','🌳'],['BIRD','🐦']];
// ghost letters, decoys, hint delay (ms, 0 = right away), hint strength, 4-letter words
const LV={1:{g:1,d:0,h:0,s:1,f:0},2:{g:1,d:0,h:1500,s:1,f:0},3:{g:0,d:1,h:3000,s:0,f:0},4:{g:0,d:2,h:5000,s:0,f:0},5:{g:0,d:1,h:5000,s:0,f:1},6:{g:0,d:3,h:8000,s:0,f:1}};
let lvl=Math.min(6,Math.max(1,+(localStorage.wfLvl||1))),word,filled,wrong,t0,hintT,lastW='';
function nextLevel(ms){const quick=ms<word.length*2500;if(wrong>=3||ms>30000)lvl=Math.max(1,lvl-1);else if(wrong===0&&quick)lvl=Math.min(6,lvl+1);localStorage.wfLvl=lvl}
function startBuild(){const P=LV[lvl],list=P.f?WORDS4:WORDS;let w;do w=rnd(list);while(w[0]===lastW&&list.length>1);lastW=w[0];word=w[0];filled=0;wrong=0;t0=Date.now();
 $('#pic').innerHTML='<span>'+w[1]+'</span>';$('#pic').onclick=()=>say(word.toLowerCase());
 $('#slots').innerHTML='';$('#slots').className=word.length>3?'n4':'';word.split('').forEach(c=>{const d=document.createElement('div');d.className='slot';d.dataset.c=c;if(P.g){d.textContent=c;d.classList.add('ghost')}$('#slots').appendChild(d)});
 const letters=word.split('');const pool=LET.split('').filter(c=>!word.includes(c)).sort(()=>Math.random()-.5);for(let i=0;i<P.d;i++)letters.push(pool[i]);
 letters.sort(()=>Math.random()-.5);$('#tiles').innerHTML='';letters.forEach(c=>{const t=document.createElement('div');t.className='tile';t.textContent=c;t.style.color=rnd(COLORS);$('#tiles').appendChild(t);drag(t)});
 setTimeout(()=>say(word.toLowerCase()+'! Let\'s spell '+word.toLowerCase()+'.'),300);schedHint()}
function schedHint(){clearTimeout(hintT);hintT=setTimeout(hint,LV[lvl].h)}
function hint(){if(mode!=='build'||document.querySelector('.tile.drag'))return;const open=[...document.querySelectorAll('.slot:not(.full)')];if(!open.length)return;const need=open[0].dataset.c;
 const t=[...document.querySelectorAll('.tile:not(.used)')].find(t=>t.textContent===need);if(t){const c=LV[lvl].s?'hint':'hint2';t.classList.remove('hint','hint2');void t.offsetWidth;t.classList.add(c)}}
function drag(t){let sx,sy,on=false,moved=false;
 t.addEventListener('pointerdown',e=>{if(t.classList.contains('used'))return;e.preventDefault();on=true;moved=false;try{t.setPointerCapture(e.pointerId)}catch(_){}t.classList.remove('hint','hint2','shake');const r=t.getBoundingClientRect();t.ox=r.left+r.width/2-e.clientX;t.oy=r.top+r.height/2-e.clientY;sx=e.clientX;sy=e.clientY;t.style.transition='none';t.classList.add('drag');say(t.textContent+', '+SND[t.textContent])});
 t.addEventListener('pointermove',e=>{if(!on)return;if(Math.hypot(e.clientX-sx,e.clientY-sy)>12)moved=true;t.style.transform=`translate(${e.clientX-sx}px,${e.clientY-sy}px) scale(1.15)`});
 const back=()=>{t.style.transition='transform .35s ease';t.style.transform='';setTimeout(()=>{t.style.transition='';t.classList.add('shake');setTimeout(()=>t.classList.remove('shake'),400)},350)};
 const end=e=>{if(!on)return;on=false;t.classList.remove('drag');
  if(!moved){t.style.transition='transform .2s';t.style.transform='';return}
  const cx=e.clientX+t.ox,cy=e.clientY+t.oy;
  const slot=[...document.querySelectorAll('.slot:not(.full)')].find(s=>{const r=s.getBoundingClientRect();return s.dataset.c===t.textContent&&cx>r.left-45&&cx<r.right+45&&cy>r.top-45&&cy<r.bottom+45});
  if(slot){t.style.transition='';t.style.transform='';slot.textContent=t.textContent;slot.classList.remove('ghost');slot.classList.add('full','yay');{const r=slot.getBoundingClientRect();sparkle(r.left+r.width/2,r.top+r.height/2)}t.classList.add('used');beep(600+filled*120);filled++;star();
   if(filled===word.length){clearTimeout(hintT);nextLevel(Date.now()-t0);setTimeout(()=>{say(word.split('').map(c=>SND[c]).join(' ')+'... '+word.toLowerCase()+'! '+rnd(PRAISE));cheer();confetti();star(2)},250);setTimeout(()=>mode==='build'&&startBuild(),4200)}else schedHint()}
  else{wrong++;back();beep(220,.12,'sine');setTimeout(hint,600)}};
 t.addEventListener('pointerup',end);t.addEventListener('pointercancel',end)}
window.__wf={get lvl(){return lvl},get word(){return word},get wrong(){return wrong}};
// ---- Find the Letter
let target;
function startFind(){const pool=LET.split('').sort(()=>Math.random()-.5).slice(0,4);target=rnd(pool);
 $('#ask').textContent='👉 '+target+' ?';$('#ask').onclick=()=>say('Tap the '+target+'!');
 $('#choices').innerHTML='';pool.forEach((L,i)=>{const b=document.createElement('button');b.className='choice';b.textContent=L;b.style.background=COLORS[(i+Math.floor(Math.random()*7))%7];
  b.onclick=()=>{if(L===target){b.classList.add('yay');{const r=b.getBoundingClientRect();sparkle(r.left+r.width/2,r.top+r.height/2,18)}say(rnd(PRAISE)+' That\'s '+L+'! '+SND[L]);cheer();star();if(stars%5===0)confetti();setTimeout(()=>mode==='find'&&startFind(),2200)}
   else{b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),400);say('That\'s '+L+'. Find the '+target+'!')}};$('#choices').appendChild(b)});
 setTimeout(()=>say('Tap the '+target+'!'),300)}

// ---- sticker shelf: a new sticker every 10 stars
const STK=['🐶','🐱','🦄','🚀','🦖','🍦','🌈','🐙','🚒','🦁','🐸','🎈','🍩','🐼','🦋','⚽','🐳','🌟'];
function shelf(){const got=Math.floor(stars/10),el=$('#shelf');el.innerHTML='';const off=Math.max(0,Math.min(got,STK.length)-5);STK.slice(off,off+6).forEach((e,j)=>{const i=j+off;const d=document.createElement('div');d.className='stk'+(i<got?' got':'');d.textContent=i<got?e:'?';if(i<got)d.onclick=()=>{d.classList.remove('yay');void d.offsetWidth;d.classList.add('yay');beep(700)};el.appendChild(d)});
 $('#nextbar').style.width=(stars%10)*10+'%'}
shelf();
