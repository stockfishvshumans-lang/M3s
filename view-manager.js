// Fixed - view manager with force option, scoped
window.ViewManager={
  current:null,
  locked:false,
  show(name, force=false){
    if(!force && (this.locked || this.current===name)) return false;
    const t=document.getElementById(name);
    if(!t) return false;
    this.locked=true;
    // Only hide views that are part of allViews list, not every .view
    const allViews=['start-modal','mission-config-modal','mp-menu-modal','lobby-modal','class-selection-modal','classroom-setup-modal','game-wrapper','teacher-dashboard','report-modal','win-modal','agent-dashboard-modal','shop-modal','codex-modal','leaderboard-modal','quiz-forge-menu-modal','quiz-flashcard-modal','pause-modal','campaign-modal','reward-modal','training-modal','intervention-report-modal','cctv-modal','boot-overlay','cinematic-intro','story-overlay','cinematic-outro','cyber-warp-door','class-curtain','start-countdown','curtain-countdown','glitch-overlay'];
    allViews.forEach(id=>{ if(id!==name){ const el=document.getElementById(id); if(el) el.classList.add('hidden'); } });
    t.classList.remove('hidden');
    if(t.classList.contains('modal')) t.style.setProperty('display','flex','important');
    else if(name==='game-wrapper') { t.style.setProperty('display','block','important'); if(window.fixGameResolution) window.fixGameResolution(); }
    else t.style.setProperty('display','flex','important');
    this.current=name;
    setTimeout(()=>this.locked=false, force?0:150);
    return true;
  },
  forceShow(name){ return this.show(name,true); }
};
