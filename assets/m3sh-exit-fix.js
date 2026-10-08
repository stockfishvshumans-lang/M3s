/* M3SH EXIT / RELOAD / ABORT MASTER FIX v29 - Critical */
(function(){
  // --- 1. FORCE HIDDEN TO WIN ALWAYS ---
  // Patch switchView to use !important hiding and strip inline styles
  const originalSwitchView = window.switchView;
  window.switchView = function(targetViewId){
    const allViews = [
      'start-modal','mission-config-modal','mp-menu-modal','lobby-modal',
      'class-selection-modal','classroom-setup-modal','game-wrapper',
      'teacher-dashboard','report-modal','win-modal','agent-dashboard-modal',
      'shop-modal','codex-modal','leaderboard-modal','quiz-forge-menu-modal',
      'quiz-flashcard-modal','pause-modal','campaign-modal','reward-modal',
      'training-modal','intervention-report-modal','cctv-modal','boot-overlay',
      'cinematic-intro','story-overlay','cinematic-outro','cyber-warp-door',
      'class-curtain','glitch-overlay'
    ];
    allViews.forEach(id=>{
      const el = document.getElementById(id);
      if(!el) return;
      // Strip ALL inline display/position/z-index that were set with !important
      el.style.removeProperty('display');
      el.style.removeProperty('position');
      el.style.removeProperty('top');
      el.style.removeProperty('left');
      el.style.removeProperty('width');
      el.style.removeProperty('height');
      el.style.removeProperty('z-index');
      el.style.removeProperty('background');
      el.style.removeProperty('flex-direction');
      el.style.removeProperty('flex-grow');
      // Now hide with !important via inline, guaranteed to win
      el.classList.add('hidden');
      el.style.setProperty('display','none','important');
    });
    const target = document.getElementById(targetViewId);
    if(target){
      target.classList.remove('hidden');
      target.style.removeProperty('display');
      // Game wrapper needs block
      if(targetViewId === 'game-wrapper'){
        target.style.setProperty('display','block','important');
        if(window.fixGameResolution) setTimeout(()=>window.fixGameResolution(), 50);
      } else {
        // Modals need flex unless specified
        if(target.classList.contains('modal') || target.id.includes('modal')){
          target.style.setProperty('display','flex','important');
        } else {
          target.style.setProperty('display','flex','important');
        }
      }
    }
    console.log('🔀 switchView ->', targetViewId);
  };

  // --- 2. DEEP CLEANUP - ALWAYS unsub regardless of mode ---
  const originalCleanup = window.cleanupGame;
  window.cleanupGame = function(){
    console.log('🧹 DEEP CLEANUP v29 - killing all zombies');
    try{
      // Kill rAF
      if(window.gameLoopId){ cancelAnimationFrame(window.gameLoopId); window.gameLoopId = null; }
      // Kill ALL intervals/timeouts known
      const killList = [
        'scoreInterval','autoStartTimer','intermissionTimer',
        '_intermissionTimer','_countdownTimer','_spawnTimer'
      ];
      killList.forEach(name=>{
        try{ if(window[name]) { clearInterval(window[name]); clearTimeout(window[name]); window[name]=null; } }catch(e){}
      });
      // Kill from state
      ['gameTimer','lockTimer','vsInterval','partySyncInterval','petAttackTimer','overdriveTimer'].forEach(k=>{
        try{ if(window.state && window.state[k]) { clearInterval(window.state[k]); clearTimeout(window.state[k]); window.state[k]=null; } }catch(e){}
      });
      if(typeof scoreInterval !== 'undefined' && scoreInterval){ clearInterval(scoreInterval); scoreInterval=null; }
      if(typeof autoStartTimer !== 'undefined' && autoStartTimer){ clearInterval(autoStartTimer); clearTimeout(autoStartTimer); autoStartTimer=null; }

      // ALWAYS unsub Firebase listeners - THIS WAS THE BUG
      if(typeof roomUnsub === 'function'){ try{ roomUnsub(); }catch(e){} roomUnsub=null; }
      if(typeof dashboardUnsub !== 'undefined' && dashboardUnsub){ try{ dashboardUnsub(); }catch(e){} dashboardUnsub=null; }
      if(typeof window.roomUnsub === 'function'){ try{ window.roomUnsub(); }catch(e){} window.roomUnsub=null; }
      if(typeof window.dashboardUnsub === 'function'){ try{ window.dashboardUnsub(); }catch(e){} window.dashboardUnsub=null; }
      // Also kill any classroom monitor
      if(window.monitorUnsub){ try{ window.monitorUnsub(); }catch(e){} window.monitorUnsub=null; }

      // Clear canvas
      if(window.ctx && window.canvas){ window.ctx.clearRect(0,0,window.canvas.width,window.canvas.height); }

      // Reset body classes - keep only safe ones
      document.body.classList.remove('in-combat','dashboard-active','classroom-mode','critical-health','overdrive-active','is-phone-landscape','keyboard-open');
      document.body.removeAttribute('data-graphics'); // will be reapplied by settings

      // Reset state deeply
      if(window.state){
        state.isPlaying = false;
        state.isPaused = false;
        state.isGlobalFreeze = false;
        state.isOverdrive = false;
        state.bossActive = false;
        state.matchConcluded = false;
        state.bossData = null;
        state.meteors = [];
        state.lasers = [];
        state.particles = [];
        state.floatingTexts = [];
        state.shockwaves = [];
        state.score = 0;
        state.health = 100;
        state.level = 1;
        state.xp = 0;
        state.combo = 0;
        state.maxCombo = 0;
        state.timeRemaining = 120;
        state.gameMode = 'solo';
        state.roundsPlayed = 0;
      }

      // Reset globals
      try{
        currentRoomId = null;
        isHost = false;
        myPlayerIndex = 0;
        totalPlayers = 1;
        isAutoStarting = false;
        intermissionSeconds = 10;
      }catch(e){}

      // Reset warp door inline z-index leak
      const warp = document.getElementById('cyber-warp-door');
      if(warp){
        warp.classList.remove('active');
        warp.style.removeProperty('z-index');
        warp.classList.add('hidden');
        warp.style.setProperty('display','none','important');
      }

      // Hide all overlays that might block
      ['class-curtain','panopticon-alert','pause-modal','report-modal','win-modal'].forEach(id=>{
        const el = document.getElementById(id);
        if(el){ el.classList.add('hidden'); el.style.setProperty('display','none','important'); el.classList.remove('active'); }
      });

    }catch(e){ console.error('cleanup error',e); }

    // Call original if exists for any extra logic
    // originalCleanup is intentionally NOT called to avoid old buggy conditional
  };

  // --- 3. MASTER EXIT ROUTER - Single entry, guarded against double call ---
  let isExiting = false;
  window.goHome = async function(skipConfirm=false){
    if(isExiting){ console.log('⏳ Already exiting, ignoring'); return; }
    if(window.Sound && !skipConfirm) window.Sound.click();
    if(!skipConfirm && window.state && state.isPlaying){
      if(!confirm('ABORT MISSION? Progress will be lost.')) return;
    }
    isExiting = true;
    console.log('🚀 MASTER EXIT v29 - Soft Reset');

    const warpDoor = document.getElementById('cyber-warp-door');
    if(warpDoor){
      warpDoor.classList.remove('hidden');
      warpDoor.style.removeProperty('display');
      warpDoor.style.setProperty('display','flex','important');
      warpDoor.style.setProperty('z-index','2147483647','important');
      setTimeout(()=>warpDoor.classList.add('active'),10);
      if(window.Sound) window.Sound.playTone(150,'sawtooth',0.6);
    }

    // Firebase cleanup - try but don't block
    try{
      if(currentRoomId){
        if(isHost && state.gameMode !== 'classroom'){
          // Don't await forever, timeout after 2s
          const p = updateDoc(doc(db,'rooms',currentRoomId),{gameState:'closed',status:'archived'});
          await Promise.race([p, new Promise(r=>setTimeout(r,2000))]);
        } else if(!isHost && state.gameMode !== 'classroom'){
          if(socket) socket.emit('leave_room',{room:currentRoomId});
        } else if(state.gameMode === 'classroom' && isHost){
          const p2 = updateDoc(doc(db,'rooms',currentRoomId),{status:'archived'});
          await Promise.race([p2, new Promise(r=>setTimeout(r,1500))]);
        }
      }
    }catch(e){ console.warn('exit sync skipped',e); }

    if(typeof clearSession === 'function'){ try{ clearSession(); }catch(e){} }

    window.cleanupGame();

    setTimeout(()=>{
      window.switchView('start-modal');
      if(window.updateOrbsVisibility) window.updateOrbsVisibility();
      if(window.Sound) window.Sound.playBGM('menu');
      if(warpDoor){
        warpDoor.classList.remove('active');
        setTimeout(()=>{
          warpDoor.classList.add('hidden');
          warpDoor.style.removeProperty('z-index');
          warpDoor.style.setProperty('display','none','important');
          isExiting = false;
        },500);
      } else {
        isExiting = false;
      }
      // Re-enable exit button
      const exitBtn = document.getElementById('btn-exit-dash');
      if(exitBtn){ exitBtn.disabled=false; exitBtn.innerText='EXIT DASHBOARD'; }
    },800);
  };

  // --- 4. Fix cancelMission ---
  window.cancelMission = function(){
    if(window.Sound) window.Sound.click();
    window.cleanupGame();
    window.switchView('start-modal');
    if(window.updateOrbsVisibility) window.updateOrbsVisibility();
    pendingGameMode = 'solo';
  };

  // --- 5. Fix abortQuiz ---
  window.abortQuiz = function(){
    if(window.Sound) window.Sound.click();
    if(confirm('ABORT DRILL? No data will be saved.')){
      window.goHome(true);
    }
  };

  // --- 6. Fix abortStudent ---
  window.abortStudent = function(){
    if(confirm('Disconnect from Classroom?')){
      window.goHome(true);
    }
  };

  // --- 7. Fix closeClassEntirely ---
  window.closeClassEntirely = function(){
    if(window.Sound) window.Sound.click();
    const exitBtn = document.getElementById('btn-exit-dash');
    if(exitBtn){ exitBtn.disabled=true; exitBtn.innerText='EXITING...'; }
    window.goHome(true);
  };

  // --- 8. Fix quitFromPause ---
  window.quitFromPause = function(){
    if(window.Sound) window.Sound.click();
    if(confirm('ABORT MISSION? Progress will be lost.')){
      document.getElementById('pause-modal')?.classList.add('hidden');
      window.goHome(true);
    }
  };

  // --- 9. Fix closeIncubator etc ---
  const fixSimpleClose = (closeId, openId)=>{
    const fnName = 'close'+closeId.charAt(0).toUpperCase()+closeId.slice(1);
    if(window[fnName]){
      const orig = window[fnName];
      window[fnName] = function(){
        if(window.Sound) window.Sound.click();
        const modal = document.getElementById(closeId+'-modal');
        if(modal){ modal.classList.add('hidden'); modal.style.setProperty('display','none','important'); }
        if(openId){
          const openEl = document.getElementById(openId);
          if(openEl){ openEl.classList.remove('hidden'); openEl.style.removeProperty('display'); }
        }
        // Don't call orig to avoid its buggy inline styles
      };
    }
  };
  fixSimpleClose('incubator','start-modal');
  // Generic closer for any modal with X button that just adds hidden but leaves inline styles

  // --- 10. BeforeUnload - clean room if host ---
  window.addEventListener('beforeunload', ()=>{
    try{
      if(currentRoomId && isHost){
        // Use sendBeacon if available
        if(navigator.sendBeacon){
          // Can't do Firestore via beacon, but at least emit socket leave
          if(window.socket) socket.emit('leave_room',{room:currentRoomId});
        }
      }
    }catch(e){}
  });

  // --- 11. Hard reset on stuck - if user sees black screen >3s after goHome, auto fix ---
  window.addEventListener('load', ()=>{
    setInterval(()=>{
      const startModal = document.getElementById('start-modal');
      const gameWrapper = document.getElementById('game-wrapper');
      const dash = document.getElementById('teacher-dashboard');
      // If start-modal should be visible but is hidden by inline styles, force it
      if(startModal && !startModal.classList.contains('hidden')){
        const display = window.getComputedStyle(startModal).display;
        if(display === 'none'){
          console.warn('⚠️ Detected stuck start-modal, auto-fixing');
          startModal.style.setProperty('display','flex','important');
        }
      }
    },3000);
  });

  console.log('✅ M3SH EXIT FIX v29 loaded - ghost listeners killed');
})();
