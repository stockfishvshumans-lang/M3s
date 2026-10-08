/* M3SH MAIN DASHBOARD v31 - Single Source Truth */
(function(){
  const IDLE=30*60*1000, STUCK=7000;
  const now=()=>Date.now();
  const getLast=()=>parseInt(localStorage.getItem('m3sh_lastActive')||'0');
  const setLast=()=>localStorage.setItem('m3sh_lastActive', now()+'');
  const isExpired=()=>{const l=getLast(); return !l || (now()-l)>IDLE;};
  let lastBump=0;
  ['click','keydown','touchstart','mousemove'].forEach(e=>addEventListener(e,()=>{const t=now(); if(t-lastBump>30000){setLast(); lastBump=t;}}, {passive:true}));
  setLast();

  function ensureStructure(){
    const prof=document.getElementById('profile-section');
    const main=document.getElementById('main-dashboard');
    const content=document.getElementById('main-dashboard-content');
    if(!prof||!main||!content) return;
    if(content.children.length===0 && prof.querySelector('.dashboard-body')){
      const body=prof.querySelector('.dashboard-body');
      const bar=prof.querySelector('.dash-global-bar');
      if(bar) content.appendChild(bar.cloneNode(true));
      if(body) content.appendChild(body.cloneNode(true));
      prof.innerHTML='<div style="padding:20px;color:#666;text-align:center;">Moved to Main Dashboard</div>';
    }
  }

  window.showMainDashboard=function(){
    ensureStructure();
    ['boot-overlay','cinematic-intro','story-overlay','cinematic-outro','class-curtain','cyber-warp-door','glitch-overlay','game-wrapper','teacher-dashboard','start-modal','mission-config-modal','mp-menu-modal','lobby-modal','pause-modal','report-modal','win-modal','campaign-modal'].forEach(id=>{
      const el=document.getElementById(id); if(el){ el.classList.add('hidden'); el.style.setProperty('display','none','important'); }
    });
    const md=document.getElementById('main-dashboard');
    if(md){ md.classList.remove('hidden'); md.style.setProperty('display','flex','important'); md.style.setProperty('z-index','50','important'); }
    document.body.classList.remove('dashboard-active','in-combat','classroom-mode','critical-health');
    document.body.classList.add('main-dashboard-active');
    if(window.updateOrbsVisibility) window.updateOrbsVisibility();
    setLast();
  };

  window.showAuthModal=function(){
    ['main-dashboard','game-wrapper','teacher-dashboard'].forEach(id=>{const el=document.getElementById(id); if(el){el.classList.add('hidden'); el.style.setProperty('display','none','important');}});
    const sm=document.getElementById('start-modal');
    if(sm){ sm.classList.remove('hidden'); sm.style.setProperty('display','flex','important');
      const a=document.getElementById('auth-section'); if(a){a.classList.remove('hidden'); a.style.setProperty('display','block','important');}
      const p=document.getElementById('profile-section'); if(p){p.classList.add('hidden');}
    }
  };

  // Patch goHome after it exists
  const iv=setInterval(()=>{
    if(window.goHome){
      clearInterval(iv);
      window.goHome=async function(skip=false){
        if(window.Sound&&!skip) window.Sound.click();
        if(!skip&&window.state&&state.isPlaying){ if(!confirm('ABORT MISSION? Progress will be lost.')) return; }
        const warp=document.getElementById('cyber-warp-door');
        if(warp){ warp.classList.remove('hidden'); warp.style.setProperty('display','flex','important'); warp.style.setProperty('z-index','2147483647','important'); setTimeout(()=>warp.classList.add('active'),10); }
        try{
          if(typeof currentRoomId!=='undefined'&&currentRoomId){
            if(typeof isHost!=='undefined'&&isHost&&state.gameMode!=='classroom'){ await Promise.race([updateDoc(doc(db,'rooms',currentRoomId),{gameState:'closed',status:'archived'}), new Promise(r=>setTimeout(r,1200))]); }
            else if(typeof socket!=='undefined'&&socket&&currentRoomId&&!isHost){ socket.emit('leave_room',{room:currentRoomId}); }
          }
        }catch(e){}
        if(typeof clearSession==='function'){try{clearSession();}catch(e){}}
        if(window.cleanupGame) window.cleanupGame();
        setTimeout(()=>{
          const logged=(typeof currentUser!=='undefined'&&currentUser);
          if(logged) window.showMainDashboard(); else window.showAuthModal();
          if(window.Sound) window.Sound.playBGM('menu');
          if(warp){ warp.classList.remove('active'); setTimeout(()=>{warp.classList.add('hidden'); warp.style.removeProperty('z-index'); warp.style.setProperty('display','none','important');},500); }
        },600);
      };
    }
  },200);

  // Reload logic
  addEventListener('DOMContentLoaded',()=>{
    const expired=isExpired(), hasSeen=localStorage.getItem('m3sh_hasSeenIntro')==='true';
    if(expired){ localStorage.setItem('m3sh_forceIntro','true'); localStorage.removeItem('m3sh_hasSeenIntro'); return; }
    if(hasSeen){
      setTimeout(()=>{
        ['boot-overlay','cinematic-intro','story-overlay'].forEach(id=>{const el=document.getElementById(id); if(el){el.classList.add('hidden'); el.style.setProperty('display','none','important');}});
        const sm=document.getElementById('start-modal'); if(sm && !(typeof currentUser!=='undefined'&&currentUser)){ sm.classList.remove('hidden'); sm.style.setProperty('display','flex','important'); }
      },200);
    }
  });

  addEventListener('load',()=>{
    ensureStructure();
    let lastUid=null;
    setInterval(()=>{
      if(typeof currentUser!=='undefined'&&currentUser&&lastUid!==currentUser.uid){
        lastUid=currentUser.uid; setLast();
        const intro=document.getElementById('cinematic-intro');
        const vis=intro&&!intro.classList.contains('hidden')&&getComputedStyle(intro).display!=='none';
        if(!vis) window.showMainDashboard();
        if(localStorage.getItem('m3sh_forceIntro')){ localStorage.removeItem('m3sh_forceIntro'); localStorage.setItem('m3sh_hasSeenIntro','true'); }
      }
    },500);
    setTimeout(()=>{
      const intro=document.getElementById('cinematic-intro');
      if(intro&&!intro.classList.contains('hidden')&&getComputedStyle(intro).display!=='none'){
        if(window.skipStory) window.skipStory(); else { intro.classList.add('hidden'); intro.style.setProperty('display','none','important'); const logged=(typeof currentUser!=='undefined'&&currentUser); if(logged) window.showMainDashboard(); else window.showAuthModal(); }
        localStorage.setItem('m3sh_hasSeenIntro','true');
      }
    }, STUCK);
  });

  setInterval(()=>{
    if(window.state&&state.isPlaying) return;
    if(document.body.classList.contains('dashboard-active')) return;
    if(isExpired()){
      const intro=document.getElementById('cinematic-intro');
      const vis=intro&&!intro.classList.contains('hidden')&&getComputedStyle(intro).display!=='none';
      if(!vis&&document.body.classList.contains('main-dashboard-active')){
        localStorage.removeItem('m3sh_hasSeenIntro'); localStorage.setItem('m3sh_forceIntro','true'); location.reload();
      }
    }
  },60000);
})();
