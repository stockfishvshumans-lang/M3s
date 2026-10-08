/* M3SH MAIN DASHBOARD v32 - Improved Single Source + Sync Fix */
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
      prof.innerHTML='<div style="padding:20px;color:#555;text-align:center;font-family:Orbitron;font-size:11px;">MOVED TO MAIN DASHBOARD</div>';
    }
  }
  function syncData(){
    const map=[['dash-coins-display','main-coins-display'],['agent-name-display','main-agent-name'],['rank-title','main-rank-title'],['xp-text','main-xp-text'],['profile-xp-fill','main-xp-fill'],['dash-avatar-img','main-avatar-img']];
    map.forEach(([a,b])=>{
      const o=document.getElementById(a), n=document.getElementById(b);
      if(!o||!n) return;
      if(a.includes('xp-fill')) n.style.width=o.style.width;
      else if(a.includes('avatar')){ if(o.src) n.src=o.src; }
      else n.textContent=o.textContent;
    });
    const idEl=document.getElementById('main-agent-id');
    if(idEl && typeof currentUser!=='undefined' && currentUser) idEl.textContent=currentUser.uid.substring(0,8).toUpperCase();
    const lastEl=document.getElementById('main-last-active');
    if(lastEl){ const l=getLast(); if(l){ lastEl.textContent=new Date(l).toLocaleTimeString(); } }
  }
  setInterval(syncData,1000);
  window.showMainDashboard=function(){
    ensureStructure();
    ['boot-overlay','cinematic-intro','story-overlay','cinematic-outro','class-curtain','cyber-warp-door','glitch-overlay','game-wrapper','teacher-dashboard','start-modal','mission-config-modal','mp-menu-modal','lobby-modal','pause-modal','report-modal','win-modal','campaign-modal'].forEach(id=>{
      const el=document.getElementById(id); if(el){ el.classList.add('hidden'); el.style.setProperty('display','none','important'); }
    });
    const md=document.getElementById('main-dashboard');
    if(md){ md.classList.remove('hidden'); md.style.setProperty('display','flex','important'); }
    document.body.classList.remove('dashboard-active','in-combat','classroom-mode');
    document.body.classList.add('main-dashboard-active');
    syncData();
    if(window.updateOrbsVisibility) window.updateOrbsVisibility();
    setLast();
  };
  window.showAuthModal=function(){
    ['main-dashboard','game-wrapper','teacher-dashboard'].forEach(id=>{const el=document.getElementById(id); if(el){el.classList.add('hidden'); el.style.setProperty('display','none','important');}});
    const sm=document.getElementById('start-modal');
    if(sm){ sm.classList.remove('hidden'); sm.style.setProperty('display','flex','important');
      const a=document.getElementById('auth-section'); if(a){a.classList.remove('hidden'); a.style.setProperty('display','block','important');}
    }
  };
  const pg=setInterval(()=>{
    if(window.playAsGuest){
      clearInterval(pg);
      const orig=window.playAsGuest;
      window.playAsGuest=function(){
        window.isGuestMode=true; window.currentUser={uid:'GUEST-'+Date.now()};
        try{ if(orig) orig(); }catch(e){}
        setTimeout(()=>{ window.showMainDashboard(); const ne=document.getElementById('main-agent-name'); if(ne) ne.textContent='GUEST'; },300);
      };
    }
  },200);
  const iv=setInterval(()=>{
    if(window.goHome){
      clearInterval(iv);
      window.goHome=async function(skip=false){
        if(window.Sound&&!skip) window.Sound.click();
        if(!skip&&window.state&&state.isPlaying){ if(!confirm('ABORT MISSION?')) return; }
        const expired=isExpired();
        const warp=document.getElementById('cyber-warp-door');
        if(warp){ warp.classList.remove('hidden'); warp.style.setProperty('display','flex','important'); warp.style.setProperty('z-index','2147483647','important'); setTimeout(()=>warp.classList.add('active'),10); }
        try{
          if(!expired && typeof currentRoomId!=='undefined'&&currentRoomId){
            if(typeof isHost!=='undefined'&&isHost&&state.gameMode!=='classroom'){ await Promise.race([updateDoc(doc(db,'rooms',currentRoomId),{gameState:'closed',status:'archived'}), new Promise(r=>setTimeout(r,1200))]); }
            else if(typeof socket!=='undefined'&&socket&&currentRoomId&&!isHost){ socket.emit('leave_room',{room:currentRoomId}); }
          }
        }catch(e){}
        if(typeof clearSession==='function'){try{clearSession();}catch(e){}}
        if(window.cleanupGame) window.cleanupGame();
        setTimeout(()=>{
          const logged=(typeof currentUser!=='undefined'&&currentUser) || window.isGuestMode;
          if(logged) window.showMainDashboard(); else window.showAuthModal();
          if(window.Sound) window.Sound.playBGM('menu');
          if(warp){ warp.classList.remove('active'); setTimeout(()=>{warp.classList.add('hidden'); warp.style.removeProperty('z-index'); warp.style.setProperty('display','none','important');},500); }
        },600);
      };
    }
  },200);
  addEventListener('DOMContentLoaded',()=>{
    const expired=isExpired(), hasSeen=localStorage.getItem('m3sh_hasSeenIntro')==='true';
    if(expired){ localStorage.setItem('m3sh_forceIntro','true'); localStorage.removeItem('m3sh_hasSeenIntro'); return; }
    if(hasSeen){
      setTimeout(()=>{
        ['boot-overlay','cinematic-intro','story-overlay'].forEach(id=>{const el=document.getElementById(id); if(el){el.classList.add('hidden'); el.style.setProperty('display','none','important');}});
      },200);
    }
  });
  addEventListener('load',()=>{
    ensureStructure();
    const clock=document.getElementById('main-dash-clock');
    if(clock) setInterval(()=>{ clock.textContent=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); },1000);
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
