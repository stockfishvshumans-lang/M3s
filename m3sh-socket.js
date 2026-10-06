
// FIXED m3sh-socket.js - Single shared connection to Render, no GitHub Pages 404, checks socket-status exists
window.M3SH_SOCKET_URL = 'https://m33sh.onrender.com';

function getSharedSocket(){
  if(window.M3SHSharedSocket && window.M3SHSharedSocket.connected) return window.M3SHSharedSocket;
  if(typeof io === 'undefined') return null;
  window.M3SHSharedSocket = io(window.M3SH_SOCKET_URL, {transports:['websocket','polling'], timeout:10000});
  window.M3SHSharedSocket.on('connect', ()=>{
    const el = document.getElementById('socket-status');
    if(el){ // FIX: Check if element exists before setting textContent
      el.textContent = 'ONLINE - Render';
      el.style.color = '#00ff41';
      el.style.display = 'block';
    }
  });
   window.M3SHSharedSocket.on('connect_error', ()=>{
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
  get socket(){ return getSharedSocket(); },
  init(){ return getSharedSocket(); },
  emit(ev,d){
    const s = getSharedSocket();
    if(s && s.connected) s.emit(ev,d);
  }
};
setTimeout(()=>window.M3SHSocket.init(), 800);


