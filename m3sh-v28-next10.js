/* M3SH v28 JS - Settings, CCTV thumbs, Swipe Dodge, Color-blind, Tutorial, Confetti, Offline */

(function(){
  // SETTINGS
  window.openSettings = function(){
    let modal = document.getElementById('settings-modal');
    if(!modal){
      modal = document.createElement('div');
      modal.id = 'settings-modal';
      modal.innerHTML = `
        <div class="settings-content">
          <div class="settings-header">
            <h2>⚙️ SYSTEM SETTINGS</h2>
            <button onclick="closeSettings()" style="background:none;border:1px solid #ff0055;color:#ff0055;padding:6px 12px;border-radius:6px;cursor:pointer;font-family:Orbitron;font-size:10px;">✕ CLOSE</button>
          </div>
          <div class="settings-body">
            <div class="setting-group">
              <div class="setting-group-title">🎨 GRAPHICS</div>
              <div class="setting-row">
                <div><div class="setting-label">Quality</div><div class="setting-desc">Lower = better battery</div></div>
                <div class="setting-control"><select id="setting-graphics" onchange="saveSetting('graphics',this.value)"><option value="high">High</option><option value="med" selected>Medium</option><option value="low">Low</option></select></div>
              </div>
              <div class="setting-row">
                <div><div class="setting-label">Particle Effects</div><div class="setting-desc">Explosions, trails</div></div>
                <div class="setting-control"><div class="toggle-switch on" id="toggle-particles" onclick="toggleSetting('particles',this)"></div></div>
              </div>
              <div class="setting-row">
                <div><div class="setting-label">Reduced Motion</div><div class="setting-desc">Disable shake, pulse</div></div>
                <div class="setting-control"><div class="toggle-switch" id="toggle-reduced" onclick="toggleSetting('reducedMotion',this)"></div></div>
              </div>
            </div>
            <div class="setting-group">
              <div class="setting-group-title">♿ ACCESSIBILITY</div>
              <div class="setting-row">
                <div><div class="setting-label">Color-Blind Mode</div><div class="setting-desc">Blue/Yellow instead of Red/Green</div></div>
                <div class="setting-control"><div class="toggle-switch" id="toggle-colorblind" onclick="toggleSetting('colorBlind',this)"></div></div>
              </div>
              <div class="setting-row">
                <div><div class="setting-label">Large Text</div><div class="setting-desc">Increase UI size 20%</div></div>
                <div class="setting-control"><div class="toggle-switch" id="toggle-large" onclick="toggleSetting('largeText',this)"></div></div>
              </div>
            </div>
            <div class="setting-group">
              <div class="setting-group-title">🎮 CONTROLS</div>
              <div class="setting-row">
                <div><div class="setting-label">Swipe Dodge</div><div class="setting-desc">Swipe left/right to dodge</div></div>
                <div class="setting-control"><div class="toggle-switch on" id="toggle-swipe" onclick="toggleSetting('swipeDodge',this)"></div></div>
              </div>
              <div class="setting-row">
                <div><div class="setting-label">Haptic Feedback</div><div class="setting-desc">Vibrate on buttons (Android)</div></div>
                <div class="setting-control"><div class="toggle-switch on" id="toggle-haptic" onclick="toggleSetting('haptic',this)"></div></div>
              </div>
            </div>
            <div class="setting-group">
              <div class="setting-group-title">💾 DATA</div>
              <div class="setting-row">
                <div><div class="setting-label">Clear Save Data</div><div class="setting-desc">Reset progress, keep account</div></div>
                <div class="setting-control"><button onclick="clearSave()" style="background:rgba(255,0,85,0.1);border:1px solid #ff0055;color:#ff0055;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:11px;">CLEAR</button></div>
              </div>
            </div>
            <div style="text-align:center; padding-top:10px; color:#555; font-size:10px; font-family:Orbitron;">M3SH v28 • BUILT FOR CLASSROOM</div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      loadSettings();
    }
    modal.style.display = 'flex';
  };
  window.closeSettings = function(){
    const m = document.getElementById('settings-modal');
    if(m) m.style.display = 'none';
  };
  window.saveSetting = function(k,v){
    localStorage.setItem('m3sh_'+k, v);
    applySettings();
    if(window.showToast) showToast('Saved: '+k,'success');
  };
  window.toggleSetting = function(k, el){
    const on = !el.classList.contains('on');
    el.classList.toggle('on', on);
    localStorage.setItem('m3sh_'+k, on ? 'true':'false');
    applySettings();
  };
  window.loadSettings = function(){
    const map = {graphics:'setting-graphics', particles:'toggle-particles', reducedMotion:'toggle-reduced', colorBlind:'toggle-colorblind', largeText:'toggle-large', swipeDodge:'toggle-swipe', haptic:'toggle-haptic'};
    for(let k in map){
      const v = localStorage.getItem('m3sh_'+k);
      if(v===null) continue;
      const el = document.getElementById(map[k]);
      if(!el) continue;
      if(el.tagName==='SELECT') el.value = v;
      else el.classList.toggle('on', v==='true');
    }
  };
  window.applySettings = function(){
    const g = localStorage.getItem('m3sh_graphics') || 'med';
    document.body.setAttribute('data-graphics', g);
    document.body.classList.toggle('reduced-motion', localStorage.getItem('m3sh_reducedMotion')==='true');
    document.body.classList.toggle('color-blind', localStorage.getItem('m3sh_colorBlind')==='true');
    document.body.classList.toggle('large-text', localStorage.getItem('m3sh_largeText')==='true');
  };
  window.clearSave = function(){
    if(confirm('Clear local save? Account stays.')){
      localStorage.removeItem('m3sh_save');
      localStorage.removeItem('m3sh_progress');
      if(window.showToast) showToast('Save cleared','success');
    }
  };
  // init
  setTimeout(applySettings, 100);

  // CCTV THUMBNAILS - Enhance spy grid
  window.enhanceSpyCard = function(cardEl, data){
    // data = {name, score, waves, status}
    if(!cardEl) return;
    if(cardEl.querySelector('.spy-card-header')) return; // already enhanced
    const name = data.name || cardEl.textContent.trim() || 'AGENT';
    const score = data.score || 0;
    const waves = data.waves || 0;
    const status = data.status || 'online';
    cardEl.innerHTML = `
      <div class="spy-card-header">
        <div class="spy-card-name">${name}</div>
        <div class="spy-card-status ${status}">${status.toUpperCase()}</div>
      </div>
      <div class="spy-thumbnail">👨‍🚀</div>
      <div class="spy-card-stats">
        <div class="spy-stat"><div class="spy-stat-value">${score}</div><div class="spy-stat-label">SCORE</div></div>
        <div class="spy-stat"><div class="spy-stat-value">${waves}</div><div class="spy-stat-label">WAVES</div></div>
      </div>
      <div class="spy-progress"><div class="spy-progress-fill" style="width:${Math.min(score/10,100)}%"></div></div>
    `;
    cardEl.classList.add('spy-card');
  };

  // Hook into existing spy grid observer
  const spyGrid = document.getElementById('spy-grid-container') || document.getElementById('roster-grid');
  if(spyGrid){
    const obs = new MutationObserver(()=>{
      spyGrid.querySelectorAll('.spy-card, .roster-card, .player-row').forEach((el,i)=>{
        if(!el.dataset.enhanced){
          const name = el.dataset.name || el.textContent.trim().split('\\n')[0] || 'AGENT-'+(i+1);
          window.enhanceSpyCard(el, {name, score: Math.floor(Math.random()*500), waves: Math.floor(Math.random()*5), status: Math.random()>0.2?'online':'offline'});
          el.dataset.enhanced = '1';
        }
      });
    });
    obs.observe(spyGrid, {childList:true, subtree:true});
  }

  // SWIPE DODGE
  let touchStartX = 0, touchStartY = 0;
  const canvas = document.getElementById('gameCanvas') || document.getElementById('bgCanvas');
  if(canvas){
    canvas.addEventListener('touchstart', e=>{
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, {passive:true});
    canvas.addEventListener('touchend', e=>{
      if(localStorage.getItem('m3sh_swipeDodge')==='false') return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if(Math.abs(dx) > 80 && Math.abs(dy) < 60){
        if(dx > 0){
          // swipe right
          if(window.dodgeRight) window.dodgeRight();
          if(window.showToast) showToast('→ DODGE RIGHT','info');
          window.shakeScreen && window.shakeScreen(0.5);
        } else {
          if(window.dodgeLeft) window.dodgeLeft();
          if(window.showToast) showToast('← DODGE LEFT','info');
          window.shakeScreen && window.shakeScreen(0.5);
        }
        if(navigator.vibrate) try{navigator.vibrate(20);}catch(e){}
      }
    }, {passive:true});
  }

  // TUTORIAL
  window.startTutorial = function(){
    const overlay = document.createElement('div');
    overlay.id = 'tutorial-overlay';
    overlay.innerHTML = `
      <div class="tutorial-spotlight" id="tut-spot" style="top:60%;left:20%;width:60%;height:80px;"></div>
      <div class="tutorial-tooltip" id="tut-tip" style="top:35%;left:50%;transform:translateX(-50%);">
        <h4>🎯 HOW TO PLAY</h4>
        <p>Type the answer and press ENTER. Use EMP to freeze enemies.</p>
        <div style="display:flex;gap:8px;justify-content:flex-end;">
          <button class="btn" onclick="nextTut()">NEXT</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.classList.add('active');
    let step = 0;
    window.nextTut = function(){
      step++;
      const spot = document.getElementById('tut-spot');
      const tip = document.getElementById('tut-tip');
      if(step===1){
        spot.style.top='80%'; spot.style.left='10px'; spot.style.width='95%'; spot.style.height='100px';
        tip.innerHTML = `<h4>🛡️ TACTICAL</h4><p>Use Shield, Nuke, Scan when overwhelmed.</p><div style="display:flex;gap:8px;justify-content:flex-end;"><button class="btn" onclick="nextTut()">NEXT</button></div>`;
      } else if(step===2){
        spot.style.top='10%'; spot.style.left='10px'; spot.style.width='95%'; spot.style.height='60px';
        tip.innerHTML = `<h4>📊 SCORE</h4><p>Survive waves, get high score. Teacher sees live.</p><div style="display:flex;gap:8px;justify-content:flex-end;"><button class="btn" onclick="closeTut()">GOT IT</button></div>`;
      } else {
        closeTut();
      }
    };
    window.closeTut = function(){
      overlay.remove();
      localStorage.setItem('m3sh_tutorial','done');
    };
  };
  // Auto show tutorial once
  if(!localStorage.getItem('m3sh_tutorial')){
    setTimeout(()=>{ if(window.startTutorial) window.startTutorial(); }, 2000);
  }

  // EMPTY STATES
  function checkEmpty(){
    const grids = [document.getElementById('roster-grid'), document.getElementById('spy-grid-container'), document.getElementById('quiz-list')];
    grids.forEach(g=>{
      if(!g) return;
      if(g.children.length===0 && !g.querySelector('.empty-state')){
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.innerHTML = `<div class="empty-state-icon">📡</div><div class="empty-state-title">NO AGENTS YET</div><div class="empty-state-desc">Waiting for students to join.<br>Share the room code.</div><button class="btn" onclick="location.reload()">REFRESH</button>`;
        g.appendChild(empty);
      }
    });
  }
  setInterval(checkEmpty, 3000);

  // CONFETTI
  window.launchConfetti = function(){
    let canvas = document.getElementById('confetti-canvas');
    if(!canvas){
      canvas = document.createElement('canvas');
      canvas.id = 'confetti-canvas';
      document.body.appendChild(canvas);
    }
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const pieces = [];
    for(let i=0;i<150;i++){
      pieces.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height - canvas.height, r:Math.random()*6+2, d:Math.random()*5+2, color:`hsl(${Math.random()*60+180},100%,50%)`, tilt:Math.random()*10-5});
    }
    let frame = 0;
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pieces.forEach(p=>{
        p.y += p.d; p.x += Math.sin(frame/10 + p.r); p.tilt += 0.1;
        if(p.y > canvas.height) p.y = -20;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.r, p.r);
      });
      frame++;
      if(frame < 300) requestAnimationFrame(draw);
      else canvas.remove();
    }
    draw();
  };
  // Hook perfect score
  const origWin = window.showWin || window.onGameWin;
  // We will call confetti from report modal
  const reportModal = document.getElementById('report-modal');
  if(reportModal){
    const obs = new MutationObserver(()=>{
      if(!reportModal.classList.contains('hidden')){
        const scoreEl = document.getElementById('rep-score');
        if(scoreEl && parseInt(scoreEl.textContent) > 800){
          setTimeout(()=>window.launchConfetti(), 500);
        }
      }
    });
    obs.observe(reportModal, {attributes:true, attributeFilter:['class']});
  }

  // OFFLINE / RECONNECT UX
  function initOffline(){
    let banner = document.getElementById('offline-banner');
    if(!banner){
      banner = document.createElement('div');
      banner.id = 'offline-banner';
      banner.innerHTML = `<span class="pulse-dot"></span> SOLO MODE - Scores saved locally - <span style="text-decoration:underline;cursor:pointer;" onclick="location.reload()">RECONNECT</span>`;
      document.body.appendChild(banner);
    }
    let reconnect = document.createElement('div');
    reconnect.className = 'reconnect-status';
    reconnect.id = 'reconnect-status';
    reconnect.innerHTML = `<div class="reconnect-spinner"></div> Render waking...`;
    document.body.appendChild(reconnect);

    // Listen socket status
    const sockEl = document.getElementById('socket-status');
    if(sockEl){
      const obs = new MutationObserver(()=>{
        const isOffline = sockEl.textContent.includes('OFFLINE') || sockEl.classList.contains('offline');
        banner.classList.toggle('show', isOffline);
        reconnect.classList.toggle('show', sockEl.textContent.includes('Connecting') || sockEl.textContent.includes('waking'));
      });
      obs.observe(sockEl, {childList:true, characterData:true, attributes:true, subtree:true});
    }
  }
  initOffline();

  console.log('✅ M3SH v28 Next 10 loaded');
})();
