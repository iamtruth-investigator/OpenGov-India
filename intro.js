/* OpenGov India — cinematic story controller */
(function(){
  'use strict';
  const intro=document.getElementById('ogIntro'); if(!intro) return;
  const reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const seenKey='opengov_intro_seen_v2'; let seen=false;
  try{seen=sessionStorage.getItem(seenKey)==='1'}catch(e){}
  if(seen){intro.hidden=true;return;}
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
    message.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-6px)'}],{duration:230,fill:'forwards'}).onfinish=function(){
      if(closed)return; message.textContent=text; message.animate([{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,fill:'forwards'});
    };
  }
  function finish(){
    if(closed)return; closed=true; timers.forEach(clearTimeout);
    try{sessionStorage.setItem(seenKey,'1')}catch(e){}
    intro.classList.add('is-done'); window.setTimeout(function(){intro.hidden=true},1050);
  }
  const skip=intro.querySelector('[data-intro-skip]'); if(skip)skip.addEventListener('click',finish);
  if(reduce){if(message)message.textContent=messages[messages.length-1];window.setTimeout(finish,900);return;}
  if(message)message.textContent=messages[0];
  [2200,4400,6600,8800,11000].forEach(function(delay){timers.push(window.setTimeout(function(){i++;setMessage(messages[i]);},delay));});
  timers.push(window.setTimeout(finish,13300));
  window.addEventListener('pagehide',function(){timers.forEach(clearTimeout)});
})();
