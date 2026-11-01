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
function cheer(){const c=$('#cheer');c.textContent=rnd(CHEERS);c.classList.add('on');setTimeout(()=>c.classList.remove('on'),900);[523,659,784].forEach((f,i)=>setTimeout(()=>beep(f,.15),i*110))}
// ---- confetti
const cv=$('#cf'),cx=cv.getContext('2d');let parts=[];
function resize(){cv.width=innerWidth;cv.height=innerHeight}addEventListener('resize',resize);resize();
function confetti(){for(let i=0;i<150;i++)parts.push({x:innerWidth/2,y:innerHeight/2,vx:(Math.random()-.5)*16,vy:-Math.random()*16-4,c:rnd(COLORS),s:8+Math.random()*8,r:Math.random()*6,life:140})}
(function loop(){cx.clearRect(0,0,cv.width,cv.height);parts=parts.filter(p=>p.life-->0);for(const p of parts){p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.r+=.2;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);cx.restore()}requestAnimationFrame(loop)})();
// ---- navigation
let mode='menu',timers=[];
function show(m){mode=m;timers.forEach(clearInterval);timers=[];document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===m));if(m==='pop')startPop();if(m==='build')startBuild();if(m==='find')startFind()}
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
 b.addEventListener('pointerdown',()=>{if(b.popped)return;b.popped=1;b.classList.add('pop');beep(300+Math.random()*500,.15,'triangle');setTimeout(()=>b.remove(),350);
  const big=$('#bigl');big.textContent=L;big.style.opacity=1;clearTimeout(big.t);big.t=setTimeout(()=>big.style.opacity=0,1200);
  say(L+'! '+SND[L]+', '+SND[L]);star();if(++pops%5===0){setTimeout(()=>{say(rnd(PRAISE),false);cheer();confetti()},200)}})}
// ---- Build a Word
let wi=Math.floor(Math.random()*WORDS.length),word,filled;
function startBuild(){[word]=WORDS[wi%WORDS.length];const em=WORDS[wi%WORDS.length][1];wi++;filled=0;
 $('#pic').textContent=em;$('#pic').onclick=()=>say(word.toLowerCase());
 $('#slots').innerHTML=word.split('').map(()=>'<div class="slot"></div>').join('');
 const order=word.split('').map((c,i)=>({c,i})).sort(()=>Math.random()-.5);
 $('#tiles').innerHTML='';order.forEach(o=>{const t=document.createElement('div');t.className='tile';t.textContent=o.c;t.style.color=rnd(COLORS);$('#tiles').appendChild(t);drag(t)});
 setTimeout(()=>say(word.toLowerCase()+'! Let\'s spell '+word.toLowerCase()+'.'),300);hint()}
function hint(){const need=word[filled];const t=[...document.querySelectorAll('.tile:not(.used)')].find(t=>t.textContent===need);if(t){t.classList.remove('hint');void t.offsetWidth;t.classList.add('hint')}}
function drag(t){let sx,sy,dragging=false;
 t.addEventListener('pointerdown',e=>{dragging=true;t.setPointerCapture(e.pointerId);sx=e.clientX;sy=e.clientY;t.classList.add('drag');say(t.textContent+', '+SND[t.textContent])});
 t.addEventListener('pointermove',e=>{if(!dragging)return;t.style.transform=`translate(${e.clientX-sx}px,${e.clientY-sy}px) scale(1.15)`});
 const end=e=>{if(!dragging)return;dragging=false;t.classList.remove('drag');t.style.transform='';
  const slot=document.querySelectorAll('.slot')[filled];const r=slot.getBoundingClientRect();const tapped=Math.hypot(e.clientX-sx,e.clientY-sy)<10;
  const near=e.clientX>r.left-40&&e.clientX<r.right+40&&e.clientY>r.top-40&&e.clientY<r.bottom+40;
  if(t.textContent===word[filled]&&(near||tapped)){slot.textContent=t.textContent;slot.classList.add('full','yay');t.classList.add('used');beep(600+filled*120);filled++;star();
   if(filled===word.length){setTimeout(()=>{say(word.split('').map(c=>SND[c]).join(' ')+'... '+word.toLowerCase()+'! '+rnd(PRAISE));cheer();confetti();star(2)},250);setTimeout(()=>mode==='build'&&startBuild(),4200)}else hint()}
  else{t.classList.add('shake');setTimeout(()=>t.classList.remove('shake'),400);hint()}};
 t.addEventListener('pointerup',end);t.addEventListener('pointercancel',end)}
// ---- Find the Letter
let target;
function startFind(){const pool=LET.split('').sort(()=>Math.random()-.5).slice(0,4);target=rnd(pool);
 $('#ask').textContent='👉 '+target+' ?';$('#ask').onclick=()=>say('Tap the '+target+'!');
 $('#choices').innerHTML='';pool.forEach((L,i)=>{const b=document.createElement('button');b.className='choice';b.textContent=L;b.style.background=COLORS[(i+Math.floor(Math.random()*7))%7];
  b.onclick=()=>{if(L===target){b.classList.add('yay');say(rnd(PRAISE)+' That\'s '+L+'! '+SND[L]);cheer();star();if(stars%5===0)confetti();setTimeout(()=>mode==='find'&&startFind(),2200)}
   else{b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),400);say('That\'s '+L+'. Find the '+target+'!')}};$('#choices').appendChild(b)});
 setTimeout(()=>say('Tap the '+target+'!'),300)}
