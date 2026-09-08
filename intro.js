/* OpenGov India — cinematic story controller */
(function(){
  'use strict';
  const intro=document.getElementById('ogIntro'); if(!intro) return;
  const reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const seenKey='opengov_intro_seen_v3';
  const root=document.documentElement, body=document.body;
  const lock=()=>{root.classList.add('og-intro-lock'); body.classList.add('og-intro-lock'); root.style.overflow='hidden'; body.style.overflow='hidden';};
  const unlock=()=>{root.classList.remove('og-intro-lock'); body.classList.remove('og-intro-lock'); root.style.overflow=''; body.style.overflow='';};
  let seen=false;
  try{seen=sessionStorage.getItem(seenKey)==='1'}catch(e){}
  if(seen){intro.hidden=true;unlock();return;}
  lock();
  const message=intro.querySelector('[data-intro-message]');
  const messages=[
    'India / Assam — development in view.',
    'Projects. Funding. Progress.',
    'Government records + public context.',
    'Citizen observations → human verification.',
    'AI-assisted intelligence — never a final finding.',
    'Understand. Monitor. Participate.'
  ];
  let closed=false, i=0, timers=[];
  function setMessage(text){
    if(!message) return;
    const out=message.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-6px)'}],{duration:200,fill:'forwards'});
    out.onfinish=function(){
      if(closed)return;
      message.textContent=text;
      message.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,fill:'forwards'});
    };
  }
  function finish(){
    if(closed)return;
    closed=true; timers.forEach(clearTimeout);
    try{sessionStorage.setItem(seenKey,'1')}catch(e){}
    intro.classList.add('is-done');
    window.setTimeout(function(){intro.hidden=true;unlock()},950);
  }
  const skip=intro.querySelector('[data-intro-skip]'); if(skip)skip.addEventListener('click',finish);
  if(reduce){if(message)message.textContent=messages[messages.length-1];window.setTimeout(finish,700);return;}
  if(message)message.textContent=messages[0];
  [2100,4100,6100,8100,10100].forEach(function(delay){timers.push(window.setTimeout(function(){i++;setMessage(messages[i]);},delay));});
  timers.push(window.setTimeout(finish,12200));
  window.addEventListener('pagehide',function(){timers.forEach(clearTimeout);unlock()});
})();
