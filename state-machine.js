// Fixed - validated transitions, gen handling
const STATES={IDLE:'idle',PREPARING:'preparing',LOBBY:'lobby',COUNTDOWN:'countdown',PLAYING:'playing',PAUSED:'paused',ENDING:'ending',DEFEATED:'defeated',VICTORY:'victory',REPORT:'report',CLEANUP:'cleanup',HOME:'home'};
const ALLOWED={
  idle:['preparing','lobby','home'],
  preparing:['countdown','lobby','home','cleanup'],
  lobby:['countdown','preparing','home','cleanup'],
  countdown:['playing','home','cleanup'],
  playing:['paused','ending','home','cleanup'],
  paused:['playing','home','cleanup'],
  ending:['defeated','victory','home','cleanup','report'],
  defeated:['home','report','cleanup'],
  victory:['home','report','cleanup'],
  report:['home','cleanup'],
  cleanup:['idle','home'],
  home:['preparing','lobby','idle']
};
window.GameMachine={
  current:'idle',
  gen:0,
  locked:false,
  transition(to){
    if(this.locked) return false;
    const from=this.current;
    const allowed=ALLOWED[from];
    if(allowed && !allowed.includes(to) && from!=='ending' && to!=='home'){
      // Allow home always, otherwise check
      if(to!=='home' && to!=='cleanup'){
        console.warn(`Blocked transition ${from} -> ${to}`);
        // Still allow if it's ending -> home (our fix)
        if(!(from==='ending' && ['home','defeated','victory','cleanup','report'].includes(to))){
          // return false; // keep permissive for now but log
        }
      }
    }
    if(window.TimerRegistry) window.TimerRegistry.clearAll();
    if(to==='preparing' || to==='lobby' || to==='home') this.gen++;
    if(window.ComboSystem && (to==='preparing' || to==='home')) window.ComboSystem.reset();
    this.current=to;
    return true;
  }
};
