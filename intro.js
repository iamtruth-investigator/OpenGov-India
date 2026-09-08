/* OpenGov India — intro controller */
(function(){
  'use strict';
  const intro=document.getElementById('ogIntro');
  if(!intro) return;
  const reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const seenKey='opengov_intro_seen_v1';
  let alreadySeen=false;
  try{alreadySeen=sessionStorage.getItem(seenKey)==='1'}catch(e){}
  if(alreadySeen){intro.hidden=true;return}
  const message=intro.querySelector('[data-intro-message]');
  const messages=[
    'Development information, brought together.',
    'Projects. Funding. Progress.',
    'Citizen observations, clearly separated.',
    'AI-assisted review. Human verification.',
    'A clearer view of public development.'
  ];
  let closed=false;
  function finish(){
    if(closed) return;
    closed=true;
    try{sessionStorage.setItem(seenKey,'1')}catch(e){}
    intro.classList.add('is-done');
    window.setTimeout(function(){intro.hidden=true},850);
  }
  const skip=intro.querySelector('[data-intro-skip]');
  if(skip) skip.addEventListener('click',finish);
  if(reduce){
    if(message) message.textContent=messages[messages.length-1];
    window.setTimeout(finish,900);
    return;
  }
  let i=0;
  function next(){
    if(closed||!message) return;
    const fade=message.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-5px)'}],{duration:220,fill:'forwards'});
    fade.onfinish=function(){
      i=Math.min(i+1,messages.length-1);
      message.textContent=messages[i];
      message.animate([{opacity:0,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,fill:'forwards'});
    };
  }
  const timers=[2400,4700,7000,9300].map(function(delay){return window.setTimeout(next,delay)});
  window.setTimeout(function(){if(!closed) finish()},12200);
  window.addEventListener('pagehide',function(){timers.forEach(clearTimeout)});
})();
