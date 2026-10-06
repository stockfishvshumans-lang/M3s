// Fixed m3sh-socket.js - queue, instant init, single connection
window.M3SH_SOCKET_URL='https://m33sh.onrender.com';
window._m3shQueue=[];
function getSharedSocket(){
  if(window.M3SHSharedSocket) return window.M3SHSharedSocket;
  if(typeof window.io!=='function'){
    console.warn('[M3SH] Socket.IO not ready yet, queuing');
    return null;
  }
  window.M3SHSharedSocket = io(window.M3SH_SOCKET_URL, {transports:['websocket','polling'], timeout:10000, reconnection:true});
  window.M3SHSharedSocket.on('connect', ()=>{
    const el=document.getElementById('socket-status');
    if(el){ el.textContent='ONLINE - Render'; el.style.color='#00ff41'; el.style.display='block'; setTimeout(()=>{ el.style.display='none'; },3000); }
    // flush queue
    while(window._m3shQueue.length){ const {ev,d}=window._m3shQueue.shift(); window.M3SHSharedSocket.emit(ev,d); }
  });
  window.M3SHSharedSocket.on('connect_error', (error)=>{
    console.warn('[M3SH] Render connection error:', error.message);
    const el=document.getElementById('socket-status');
    if(el){ el.textContent='OFFLINE - Solo Mode'; el.style.color='#ffaa00'; el.style.display='block'; }
  });
  window.M3SHSharedSocket.on('disconnect', ()=>{
    const el=document.getElementById('socket-status');
    if(el){ el.textContent='OFFLINE - Solo Mode'; el.style.color='#ffaa00'; el.style.display='block'; }
  });
  return window.M3SHSharedSocket;
}
window.M3SHSocket={
  serverUrl:window.M3SH_SOCKET_URL,
  socket:null,
  init(){
    this.socket=getSharedSocket();
    if(!this.socket) setTimeout(()=>this.init(),500);
  },
  emit(ev,d){
    const s=getSharedSocket() || this.socket;
    if(s && s.connected) s.emit(ev,d);
    else { window._m3shQueue.push({ev,d}); if(window._m3shQueue.length>50) window._m3shQueue.shift(); }
  }
};
window.M3SHSocket.init();
