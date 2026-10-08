// m3sh-socket.js - Single shared Socket.IO connection to Render - Cold-start resilient
window.M3SH_SOCKET_URL = 'https://m33sh.onrender.com';

function getSharedSocket(){
  if(window.M3SHSharedSocket && window.M3SHSharedSocket.connected) return window.M3SHSharedSocket;
  if(typeof io === 'undefined'){
    console.warn('[M3SH] Socket.IO CDN not ready');
    return null;
  }
  if(window.M3SHSharedSocket) return window.M3SHSharedSocket; // return existing even if not yet connected
  window.M3SHSharedSocket = io(window.M3SH_SOCKET_URL, {
    transports:['websocket','polling'],
    timeout: 20000,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000
  });
  window.M3SHSharedSocket.on('connect', ()=>{
    const el = document.getElementById('socket-status');
    if(el){
      el.textContent = 'ONLINE - Render';
      el.style.color = '#00ff41';
      el.style.display = 'block';
    }
  });
  window.M3SHSharedSocket.on('connect_error', (err)=>{
    const el = document.getElementById('socket-status');
    if(el){
      el.textContent = 'OFFLINE - Solo (Render waking...)';
      el.style.color = '#ffaa00';
      el.style.display = 'block';
    }
    console.warn('[M3SH] Connect error:', err?.message);
  });
  window.M3SHSharedSocket.on('disconnect', ()=>{
    const el = document.getElementById('socket-status');
    if(el){
      el.textContent = 'DISCONNECTED - Reconnecting...';
      el.style.color = '#ffaa00';
    }
  });
  return window.M3SHSharedSocket;
}

window.M3SHSocket = {
  serverUrl: window.M3SH_SOCKET_URL,
  socket: null,
  init(){
    this.socket = getSharedSocket();
  },
  emit(ev,d){
    const s = getSharedSocket();
    if(s && s.connected) s.emit(ev,d);
    else console.warn('[M3SH] Emit dropped, not connected:', ev);
  }
};

// Defer init until DOM ready + socket CDN loaded
document.addEventListener('DOMContentLoaded', ()=>{
  setTimeout(()=>window.M3SHSocket.init(), 800);
});
