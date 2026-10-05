
// FIXED m3sh-socket.js - Single shared connection to Render, no GitHub Pages 404, checks socket-status exists
window.M3SH_SOCKET_URL = 'https://m33sh.onrender.com';

function getSharedSocket(){
  if(window.M3SHSharedSocket) return window.M3SHSharedSocket;
  if(typeof window.io !== 'function'){
    console.error('[M3SH] Socket.IO client is unavailable; multiplayer is disabled.');
    return null;
  }
  window.M3SHSharedSocket = io(window.M3SH_SOCKET_URL, {transports:['websocket','polling'], timeout:10000});
  window.M3SHSharedSocket.on('connect', ()=>{
    const el = document.getElementById('socket-status');
    if(el){ // FIX: Check if element exists before setting textContent
      el.textContent = 'ONLINE - Render';
      el.style.color = '#00ff41';
      el.style.display = 'block';
    }
  });
  window.M3SHSharedSocket.on('connect_error', (error)=>{
    console.warn('[M3SH] Render connection error:', error.message);
    const el = document.getElementById('socket-status');
    if(el){
      el.textContent = 'OFFLINE - Solo Mode';
      el.style.color = '#ffaa00';
      el.style.display = 'block';
    }
  });
  return window.M3SHSharedSocket;
}

window.M3SHSocket = {
  serverUrl: 'https://m33sh.onrender.com',
  socket: null,
  init(){
    this.socket = getSharedSocket();
  },
  emit(ev,d){
    const s = getSharedSocket();
    if(s && s.connected) {
      s.emit(ev,d);
    } else {
      console.warn(`[M3SH] Socket event "${ev}" was not sent because the connection is offline.`);
    }
  }
};

setTimeout(()=>window.M3SHSocket.init(), 1000);
