// ONE master router that ALL exit paths use
window.M3SH_SHOW_DASHBOARD = function(){
  // Hide game, modals, boot, intro, story, warp door - prevent blank starfield
  document.querySelectorAll('.modal, #game-wrapper, #report-screen, ...').forEach(el=>{
    if(el.id !== 'start-modal'){ el.classList.add('hidden'); el.style.display='none'; }
  });
  
  // SHOW DEPLOYMENT VECTORS DASHBOARD - your main lobby screenshot
  const startModal = document.getElementById('start-modal');
  startModal.classList.remove('hidden');
  startModal.style.display = 'flex';
  startModal.style.visibility = 'visible';
  startModal.style.opacity = '1';
  startModal.style.zIndex = '100';
  startModal.style.background = 'rgba(0,0,0,0.95)';
  
  // Force show MWUAH CADET, CAMPAIGN OPERATION, SURVIVAL, etc.
  ['DEPLOYMENT VECTORS','CAMPAIGN OPERATION','MWUAH','SYSTEM TERMINALS'].forEach(kw=>{
    document.querySelectorAll('*').forEach(el=>{
      if(el.textContent.includes(kw)){
        let p=el; for(let i=0;i<6&&p;i++){p.classList.remove('hidden'); p.style.display=''; p.style.visibility='visible'; p.style.opacity='1'; p=p.parentElement;}
      }
    });
  });
};

// Override ALL 10 exit paths to use master router
window.goHome = async function(skipConfirm){ /* ... */ window.M3SH_SHOW_DASHBOARD(); };
window.abortStudent = ()=>{ if(confirm("Disconnect?")) window.M3SH_SHOW_DASHBOARD(); };
window.cancelMission = ()=>window.M3SH_SHOW_DASHBOARD();
window.returnToLobby = ()=>window.M3SH_SHOW_DASHBOARD();
window.exitRoom = ()=>{ socket.emit('leave_room'); window.M3SH_SHOW_DASHBOARD(); };
window.leaveLobby = ()=>window.M3SH_SHOW_DASHBOARD();
window.closeReport = ()=>window.M3SH_SHOW_DASHBOARD();
window.switchView = function(viewId){ if(viewId==='start-modal'){ window.M3SH_SHOW_DASHBOARD(); return; } /* ... */ };