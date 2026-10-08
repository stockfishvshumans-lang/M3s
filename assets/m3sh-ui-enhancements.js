/* M3SH UI Enhancements v27 - Top 15 Most Important */
// This file adds non-overlapping fixes, toast, QR, role selector, landscape handling

(function(){
  // 1. Toast System
  window.showToast = function(msg, type='info'){
    let container = document.getElementById('toast-container');
    if(!container){
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    container.appendChild(toast);
    if(navigator.vibrate) try{ navigator.vibrate(10); }catch(e){}
    setTimeout(()=>{ toast.remove(); }, 3000);
  };

  // Override alert to toast (preserve for debugging)
  const originalAlert = window.alert;
  window.alert = function(msg){
    if(typeof msg === 'string' && msg.length < 200){
      window.showToast(msg, 'gold');
    } else {
      originalAlert(msg);
    }
  };

  // 2. Numpad Toggle + Haptic
  function initNumpad(){
    const numpad = document.getElementById('virtual-numpad');
    if(!numpad) return;
    
    let toggle = document.getElementById('numpad-toggle');
    if(!toggle){
      toggle = document.createElement('button');
      toggle.id = 'numpad-toggle';
      toggle.innerHTML = '123';
      toggle.setAttribute('aria-label','Toggle Numpad');
      document.body.appendChild(toggle);
    }
    
    toggle.onclick = () => {
      numpad.classList.toggle('open');
      if(navigator.vibrate) try{ navigator.vibrate(15); }catch(e){}
      toggle.textContent = numpad.classList.contains('open') ? '✕' : '123';
    };

    // Haptic on num buttons
    numpad.querySelectorAll('.num-btn').forEach(btn=>{
      btn.addEventListener('touchstart', ()=>{
        if(navigator.vibrate) try{ navigator.vibrate(10); }catch(e){}
      }, {passive:true});
    });
  }

  // 3. Phone Landscape Detection + Keyboard handling
  function checkLandscape(){
    const isLandscape = window.innerWidth > window.innerHeight;
    const isShort = window.innerHeight < 450;
    const isPhoneLandscape = isLandscape && isShort;
    document.body.classList.toggle('is-phone-landscape', isPhoneLandscape);
    
    // iPad landscape
    const isIpadLandscape = window.innerWidth >= 1024 && window.innerWidth <= 1366 && isLandscape;
    document.body.classList.toggle('is-ipad-landscape', isIpadLandscape);
  }

  // Visual Viewport keyboard handling
  if(window.visualViewport){
    window.visualViewport.addEventListener('resize', ()=>{
      const heightDiff = window.innerHeight - window.visualViewport.height;
      const keyboardOpen = heightDiff > 150;
      document.body.classList.toggle('keyboard-open', keyboardOpen);
      if(keyboardOpen){
        document.documentElement.style.setProperty('--viewport-height', window.visualViewport.height + 'px');
      }
    });
  }

  // 4. QR Code Generation
  function loadQR(){
    if(window.QRCode) return Promise.resolve();
    return new Promise((res, rej)=>{
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  window.generateQR = async function(text, canvasId){
    try{
      await loadQR();
      const canvas = document.getElementById(canvasId);
      if(!canvas) return;
      await QRCode.toCanvas(canvas, text, {
        width: 160,
        margin: 1,
        color: { dark: '#000', light: '#fff' }
      });
    }catch(e){
      // Fallback to API
      const canvas = document.getElementById(canvasId);
      if(canvas){
        const img = document.createElement('img');
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(text)}`;
        img.style.width = '160px'; img.style.height = '160px'; img.style.background='#fff'; img.style.padding='8px'; img.style.borderRadius='8px';
        canvas.replaceWith(img);
        img.id = canvasId;
      }
    }
  };

  // Hook into room code display
  function hookQR(){
    const roomCodeEl = document.getElementById('room-code-display');
    if(roomCodeEl){
      const observer = new MutationObserver(()=>{
        const code = roomCodeEl.textContent.trim();
        if(code && code !== '----' && code.length >=4){
          let qrWrap = document.getElementById('room-qr-wrap');
          if(!qrWrap){
            qrWrap = document.createElement('div');
            qrWrap.id = 'room-qr-wrap';
            qrWrap.className = 'qr-container';
            qrWrap.innerHTML = `<div class="qr-label">SCAN TO JOIN</div><canvas id="room-qr-canvas"></canvas><div class="qr-code-text">${code}</div>`;
            roomCodeEl.parentNode.insertBefore(qrWrap, roomCodeEl.nextSibling);
          }
          const canvas = document.getElementById('room-qr-canvas');
          if(canvas) window.generateQR(code, 'room-qr-canvas');
          const textEl = qrWrap.querySelector('.qr-code-text');
          if(textEl) textEl.textContent = code;
        }
      });
      observer.observe(roomCodeEl, { childList:true, characterData:true, subtree:true });
    }

    // Quiz code QR
    const quizCodes = document.querySelectorAll('[id*="quiz-code"], [id*="qf-code"], .code-display h1');
    quizCodes.forEach(el=>{
      const obs = new MutationObserver(()=>{
        const code = el.textContent.trim();
        if(code && code.startsWith('QUIZ-')){
          let wrap = el.parentNode.querySelector('.qr-container');
          if(!wrap){
            wrap = document.createElement('div');
            wrap.className = 'qr-container';
            wrap.innerHTML = `<div class="qr-label">SCAN QUIZ CODE</div><canvas id="quiz-qr-${Date.now()}"></canvas><div class="qr-code-text">${code}</div>`;
            el.parentNode.appendChild(wrap);
            const canvas = wrap.querySelector('canvas');
            if(canvas) window.generateQR(code, canvas.id);
          }
        }
      });
      obs.observe(el, { childList:true, characterData:true, subtree:true });
    });
  }

  // 5. Role Selector
  function initRoleSelector(){
    if(localStorage.getItem('m3sh_role')) return;
    
    const modal = document.createElement('div');
    modal.id = 'role-selector-modal';
    modal.innerHTML = `
      <div style="max-width:600px; width:100%;">
        <h1 style="font-family:'Orbitron'; color:#00f3ff; text-align:center; margin-bottom:8px; letter-spacing:3px;">SELECT ROLE</h1>
        <p style="text-align:center; color:#8b9bb4; font-size:13px; margin-bottom:24px;">Choose how you want to play M3SH</p>
        <div class="role-grid">
          <div class="role-card" data-role="student">
            <div class="role-icon">🎮</div>
            <div class="role-title">STUDENT</div>
            <div class="role-desc">Join a class with a code, solve math, survive waves</div>
          </div>
          <div class="role-card teacher" data-role="teacher">
            <div class="role-icon">👨‍🏫</div>
            <div class="role-title">TEACHER</div>
            <div class="role-desc">Create quizzes, host classroom, view live reports</div>
          </div>
        </div>
        <p style="text-align:center; margin-top:20px;"><button id="role-skip" style="background:none; border:none; color:#666; font-size:12px; cursor:pointer;">Skip (choose later)</button></p>
      </div>
    `;
    document.body.appendChild(modal);
    
    modal.querySelectorAll('.role-card').forEach(card=>{
      card.onclick = ()=>{
        const role = card.dataset.role;
        localStorage.setItem('m3sh_role', role);
        window.showToast(`Role set to ${role.toUpperCase()}`, 'success');
        modal.remove();
        if(role === 'student'){
          // Try to open join code
          setTimeout(()=>{
            const joinBtn = document.querySelector('[onclick*="switchQuizTab"]');
            if(window.switchQuizTab) window.switchQuizTab('join', {target:{classList:{add:()=>{}}}});
          }, 500);
        } else {
          if(window.openQuizForge) setTimeout(()=>window.openQuizForge(), 500);
        }
      };
    });
    
    modal.querySelector('#role-skip').onclick = ()=>{
      localStorage.setItem('m3sh_role','guest');
      modal.remove();
    };
  }

  // 6. Loading Progress Bar
  function initLoadingBar(){
    let bar = document.getElementById('loading-progress');
    if(!bar){
      bar = document.createElement('div');
      bar.id = 'loading-progress';
      document.body.appendChild(bar);
    }
    
    let progress = 0;
    const interval = setInterval(()=>{
      progress += Math.random()*15;
      if(progress > 90) progress = 90;
      bar.style.width = progress + '%';
      if(progress >= 90) clearInterval(interval);
    }, 200);
    
    window.addEventListener('load', ()=>{
      bar.style.width = '100%';
      setTimeout(()=>{ bar.style.opacity='0'; setTimeout(()=>bar.remove(), 500); }, 300);
    });
  }

  // 7. Screen Shake
  window.shakeScreen = function(intensity=1){
    const wrapper = document.getElementById('game-wrapper') || document.body;
    wrapper.classList.remove('shake');
    void wrapper.offsetWidth; // trigger reflow
    wrapper.classList.add('shake');
    if(navigator.vibrate) try{ navigator.vibrate(intensity*40); }catch(e){}
    setTimeout(()=>wrapper.classList.remove('shake'), 400);
  };

  // Hook into existing nuke/boom if exists
  const origNuke = window.nuke;
  if(typeof origNuke === 'function'){
    window.nuke = function(){
      window.shakeScreen(2);
      return origNuke.apply(this, arguments);
    };
  }

  // 8. Init all
  function init(){
    initNumpad();
    checkLandscape();
    hookQR();
    initLoadingBar();
    
    // Role selector after 1s if first time
    if(!localStorage.getItem('m3sh_hasSeenIntro') || !localStorage.getItem('m3sh_role')){
      setTimeout(initRoleSelector, 1500);
    }
    
    window.addEventListener('resize', checkLandscape);
    window.addEventListener('orientationchange', ()=>setTimeout(checkLandscape, 300));
    
    // Fix 100dvh on iOS
    function setVH(){
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    setVH();
    window.addEventListener('resize', setVH);
    
    console.log('✅ M3SH UI Enhancements v27 loaded');
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
