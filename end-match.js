// Fixed - one endMatch with forceShow, safeExit hides modals
window.endMatch=function(r){
  if(window.GameMachine && window.GameMachine.current==='ending') return;
  if(window.GameMachine) window.GameMachine.transition('ending');
  if(window.TimerRegistry) window.TimerRegistry.clearAll();
  if(window.ViewManager){
    if(r==='defeated') window.ViewManager.forceShow('win-modal'); // actually defeat-modal if you have it, using win-modal as fallback
    else window.ViewManager.forceShow('win-modal');
    // If you have separate defeat-modal id, use it:
    const targetId = r==='defeated' ? 'win-modal' : 'win-modal'; // change to 'defeat-modal' / 'victory-modal' if exist
    const el=document.getElementById(r==='defeated'?'defeat-modal': 'victory-modal') || document.getElementById(targetId);
    if(el && window.ViewManager){ window.ViewManager.forceShow(el.id); }
  }
  // Explicit fallback for your actual modal ids:
  if(r==='defeated'){
    const dm=document.getElementById('defeat-modal')||document.getElementById('win-modal');
    if(dm && window.ViewManager) window.ViewManager.forceShow(dm.id);
  }else{
    const vm=document.getElementById('victory-modal')||document.getElementById('win-modal');
    if(vm && window.ViewManager) window.ViewManager.forceShow(vm.id);
  }
};
window.safeExit=function(){
  if(window.TimerRegistry) window.TimerRegistry.clearAll();
  document.querySelectorAll('.modal').forEach(el=>{ el.classList.add('hidden'); el.style.setProperty('display','none','important'); });
  if(window.GameMachine) window.GameMachine.transition('home');
  if(window.goHome) window.goHome(true);
};
