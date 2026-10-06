// Fixed - safe text set, no lossy strip
window.Safe={
  sanitize(s){
    // Keep original but limit length, escaping is done by textContent
    return String(s).slice(0,120);
  },
  setText(el,t){
    if(!el) return;
    el.textContent = String(t).slice(0,120);
  },
  setHTML(el,html){ /* only for trusted */ if(el) el.innerHTML=html; }
};
