// M3SH FINAL FIX - Title M3sh + boss_god.png favicon + Strengthened dashboard return
// Fixes: Tab title JESSMATH: ELITE DEFENSE -> M3sh, favicon -> assets/boss_god.png, blank starfield -> DEPLOYMENT VECTORS dashboard

(function(){
  console.log('[M3SH FINAL FIX] Title + Favicon + Dashboard return - Best approach');

  // FIX 1: Edit HTML header - Title of tab -> M3sh, icon/logo -> boss_god.png from assets
  function fixTitleAndFavicon(){
    document.title = 'M3sh';
    const titleEl = document.querySelector('title');
    if(titleEl) titleEl.textContent = 'M3sh';

    document.querySelectorAll('link[rel*="icon"]').forEach(el=>el.remove());

    const faviconPaths = [
      './assets/boss_god.png',
      'assets/boss_god.png',
      '/M3s/assets/boss_god.png',
      'https://stockfishvshumans-lang.github.io/M3s/assets/boss_god.png'
    ];

    faviconPaths.forEach((path, index)=>{
      const link = document.createElement('link');
      link.rel = index===0? 'icon' : 'alternate icon';
      link.type = 'image/png';
      link.href = path;
      document.head.appendChild(link);
    });

    const appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    appleLink.href = './assets/boss_god.png';
    document.head.appendChild(appleLink);

    console.log('[M3SH FINAL FIX] Title -> M3sh, Favicon -> boss_god.png');
  }

  fixTitleAndFavicon();
  document.addEventListener('DOMContentLoaded', fixTitleAndFavicon);
  setTimeout(fixTitleAndFavicon, 500);
  setTimeout(fixTitleAndFavicon, 2000);

  // BEST APPROACH: Single master router + CSS guard + Auto-heal
  const DASHBOARD_KEYWORDS = ['DEPLOYMENT VECTORS','CAMPAIGN OPERATION','SURVIVAL','MULTIPLAYER','CLASSROOM','SYSTEM TERMINALS','MWUAH','CADET','UPLINK SECURE'];

  const cssGuard = document.createElement('style');
  cssGuard.id = 'm3sh-dashboard-guard';
  cssGuard.textContent = `
    #start-modal.m3sh-force-show {
      display: flex!important;
      visibility: visible!important;
      opacity: 1!important;
      z-index: 100!important;
      position: fixed!important;
      top: 0!important;
      left: 0!important;
      width: 100vw!important;
      height: 100vh!important;
      background: rgba(0,0,0,0.95)!important;
      flex-direction: column!important;
      align-items: center!important;
      justify-content: center!important;
      overflow: auto!important;
      pointer-events: auto!important;
    }
    #start-modal.m3sh-force-show * {
      visibility: visible!important;
      opacity: 1!important;
    }
    #bgCanvas.m3sh-behind { z-index: 1!important; }
    #gameCanvas.m3sh-hidden { display: none!important; visibility: hidden!important; }
  `;
  document.head.appendChild(cssGuard);

  window.M3SH_SHOW_DASHBOARD = function(source = 'unknown'){
    console.log(`[M3SH MASTER] Showing dashboard - Source: ${source}`);
    try {
      if(window.state){
        window.state.isPlaying = false;
        window.state.matchConcluded = true;
        window.state.bossActive = false;
        window.state.isPaused = false;
        window.state.isGlobalFreeze = false;
        if(window.state.meteors) window.state.meteors = [];
        if(window.state.lasers) window.state.lasers = [];
        if(window.state.particles) window.state.particles = [];
      }
      if(window.cleanupGame) { try{ window.cleanupGame(); }catch(e){} }
      if(window.gameLoopId){ cancelAnimationFrame(window.gameLoopId); window.gameLoopId = null; }

      document.querySelectorAll('.modal').forEach(el=>{
        if(el.id!== 'start-modal'){
          el.classList.add('hidden');
          el.style.display = 'none';
          el.classList.remove('m3sh-force-show');
        }
      });

      ['boot-overlay','cinematic-intro','story-overlay','game-wrapper','report-screen','victory-modal','defeat-modal','training-modal','incubator-modal','mission-config-modal','mp-menu-modal','pause-modal','reward-modal','cyber-warp-door','glitch-overlay'].forEach(id=>{
        const el = document.getElementById(id);
        if(el && id!== 'start-modal'){
          el.classList.add('hidden');
          el.style.display = 'none';
          el.classList.remove('m3sh-force-show');
        }
      });

      const startModal = document.getElementById('start-modal');
      if(startModal){
        startModal.classList.remove('hidden');
        startModal.classList.add('m3sh-force-show');
        startModal.style.display = 'flex';
        startModal.style.visibility = 'visible';
        startModal.style.opacity = '1';
        startModal.style.zIndex = '100';

        DASHBOARD_KEYWORDS.forEach(keyword=>{
          startModal.querySelectorAll('*').forEach(el=>{
            if((el.textContent||'').includes(keyword)){
              el.classList.remove('hidden');
              el.style.display = '';
              el.style.visibility = 'visible';
              el.style.opacity = '1';
              let p = el.parentElement;
              for(let i=0;i<6&&p;i++){
                p.classList.remove('hidden');
                p.style.display = '';
                p.style.visibility = 'visible';
                p.style.opacity = '1';
                p = p.parentElement;
              }
            }
          });
        });

        const gameCanvas = document.getElementById('gameCanvas');
        if(gameCanvas) { gameCanvas.classList.add('m3sh-hidden'); gameCanvas.style.display = 'none'; }
        const bgCanvas = document.getElementById('bgCanvas');
        if(bgCanvas) { bgCanvas.classList.add('m3sh-behind'); bgCanvas.style.zIndex = '1'; }

        localStorage.setItem('m3sh_hasSeenIntro','true');
        if(window.updateOrbsVisibility) { try{ window.updateOrbsVisibility(); }catch(e){} }
        if(window.Sound) { try{ window.Sound.playBGM('menu'); }catch(e){} }
        if(typeof clearSession === 'function') { try{ clearSession(); }catch(e){} }

        console.log(`[M3SH MASTER] Dashboard shown - Source: ${source} - MWUAH CADET - DEPLOYMENT VECTORS`);
        return true;
      } else {
        document.querySelectorAll('*').forEach(el=>{
          if((el.textContent||'').trim() === 'DEPLOYMENT VECTORS'){
            let p = el;
            for(let i=0;i<10&&p;i++){
              p.classList.remove('hidden');
              p.classList.add('m3sh-force-show');
              p.style.display = p.tagName==='DIV'? 'flex' : '';
              p.style.visibility = 'visible';
              p.style.opacity = '1';
              p.style.zIndex = '50';
              p = p.parentElement;
            }
          }
        });
        return true;
      }
    } catch(e){
      console.error('[M3SH MASTER] Error:', e);
      const sm = document.getElementById('start-modal');
      if(sm){
        sm.classList.remove('hidden');
        sm.classList.add('m3sh-force-show');
        sm.style.display = 'flex';
      }
      return false;
    }
  };

  const exitPaths = [
    'goHome','abortStudent','cancelMission','returnToLobby','exitRoom','leaveLobby',
    'closeReport','closeVictory','closeDefeat','quitGame','exitGame','abandonMission',
    'closeMissionConfig','closeMultiplayerMenu'
  ];

  exitPaths.forEach(name=>{
    const original = window[name];
    window[name] = function(...args){
      console.log(`[M3SH MASTER] Exit: ${name} -> Dashboard`);
      if(name==='goHome' || name==='quitGame' || name==='exitGame' || name==='abandonMission'){
        const skip = args[0];
        if(!skip && window.state && window.state.isPlaying){
          if(!confirm("ABORT MISSION? Progress will be lost.")) return;
        }
      }
      if(name==='abortStudent' &&!confirm("Disconnect from Classroom?")) return;

      if(typeof currentRoomId!== 'undefined' && currentRoomId && window.socket){
        try{ window.socket.emit('leave_room', { room: currentRoomId }); }catch(e){}
      }

      if(typeof clearSession === 'function'){ try{ clearSession(); }catch(e){} }

      const warpDoor = document.getElementById('cyber-warp-door');
      if(warpDoor){
        warpDoor.classList.remove('hidden');
        warpDoor.style.display = 'block';
        warpDoor.style.zIndex = '2147483647';
        setTimeout(()=>warpDoor.classList.add('active'),10);
        setTimeout(()=>{
          warpDoor.classList.remove('active');
          setTimeout(()=>{
            warpDoor.classList.add('hidden');
            warpDoor.style.display = 'none';
            window.M3SH_SHOW_DASHBOARD(name);
          },500);
        },800);
      } else {
        window.M3SH_SHOW_DASHBOARD(name);
      }

      if(original && name!=='goHome'){
        try{ original.apply(this, args); }catch(e){}
        setTimeout(()=>window.M3SH_SHOW_DASHBOARD(name+'_cleanup'),100);
      }
    };
  });

  const origSwitchView = window.switchView;
  window.switchView = function(viewId){
    if(viewId==='start-modal' || viewId==='main-lobby' || viewId==='command-center' || viewId==='dashboard'){
      window.M3SH_SHOW_DASHBOARD(`switchView_${viewId}`);
      return;
    }
    if(origSwitchView){
      try{ return origSwitchView.apply(this, arguments); }catch(e){}
    }
    document.querySelectorAll('.view,.modal').forEach(el=>{
      if(el.id!==viewId && el.id!=='bgCanvas' && el.id!=='vr-grid-bg'){
        if(el.id!=='start-modal') el.classList.add('hidden');
      }
    });
    const target = document.getElementById(viewId);
    if(target){
      target.classList.remove('hidden');
      target.style.display = '';
      target.style.visibility = 'visible';
      target.style.opacity = '1';
    }
  };

  let blankCheck = 0;
  setInterval(()=>{
    const startModal = document.getElementById('start-modal');
    const gameWrapper = document.getElementById('game-wrapper');
    const isGameNotPlaying =!window.state ||!window.state.isPlaying;
    const isStartHidden =!startModal || startModal.classList.contains('hidden') || startModal.style.display==='none' ||!startModal.classList.contains('m3sh-force-show');
    const isGameHidden =!gameWrapper || gameWrapper.classList.contains('hidden') || gameWrapper.style.display==='none';
    const noModalVisible = document.querySelectorAll('.modal:not(.hidden)').length===0;

    if(isGameNotPlaying && isStartHidden && isGameHidden && noModalVisible){
      blankCheck++;
      if(blankCheck>3){
        console.warn('[M3SH MASTER] Blank starfield detected - Auto-fixing to dashboard');
        window.M3SH_SHOW_DASHBOARD('auto_fix_blank');
        blankCheck=0;
      }
    } else {
      blankCheck=0;
    }
  },1000);

  setTimeout(()=>{
    const startModal = document.getElementById('start-modal');
    if(startModal){
      const observer = new MutationObserver((muts)=>{
        muts.forEach(m=>{
          if(m.attributeName==='class' || m.attributeName==='style'){
            const isHidden = startModal.classList.contains('hidden') || startModal.style.display==='none';
            const isGameNotPlaying =!window.state ||!window.state.isPlaying;
            const noModal = document.querySelectorAll('.modal:not(.hidden)').length===0;
            if(isHidden && isGameNotPlaying && noModal){
              setTimeout(()=>{
                if(startModal.classList.contains('hidden') && (!window.state ||!window.state.isPlaying)){
                  console.warn('[M3SH MASTER] Dashboard hidden incorrectly - Auto-showing');
                  window.M3SH_SHOW_DASHBOARD('mutation_observer');
                }
              },500);
            }
          }
        });
      });
      observer.observe(startModal, { attributes: true, attributeFilter: ['class','style'] });
    }
  },1000);

  setInterval(()=>{
    ['report-modal','victory-modal','defeat-modal','pause-modal'].forEach(id=>{
      const modal = document.getElementById(id);
      if(!modal) return;
      modal.querySelectorAll('button').forEach(btn=>{
        const text = (btn.textContent||'').toLowerCase();
        if(text.includes('home') || text.includes('dashboard') || text.includes('return') || text.includes('lobby') || text.includes('menu') || (btn.getAttribute('onclick')||'').includes('goHome')){
          btn.onclick = (e)=>{ e.preventDefault(); e.stopPropagation(); window.M3SH_SHOW_DASHBOARD(`${id}_button`); };
        }
      });
    });
  },1000);

  const hasSeen = localStorage.getItem('m3sh_hasSeenIntro')==='true';
  if(hasSeen){
    document.addEventListener('DOMContentLoaded', ()=>{
      setTimeout(()=>{
        const boot = document.getElementById('boot-overlay');
        const intro = document.getElementById('cinematic-intro');
        const story = document.getElementById('story-overlay');
        const isBootVisible = boot &&!boot.classList.contains('hidden');
        const isIntroVisible = intro &&!intro.classList.contains('hidden');
        if(isBootVisible || isIntroVisible){
          window.M3SH_SHOW_DASHBOARD('reload_skip_intro');
        }
      },500);
    });
  }

  const origStartSystem = window.startSystem;
  if(origStartSystem){
    window.startSystem = function(...args){
      localStorage.setItem('m3sh_hasSeenIntro','true');
      return origStartSystem.apply(this, args);
    };
  }

  console.log('[M3SH FINAL FIX] Loaded - Title M3sh + boss_god.png + Dashboard return');
})();