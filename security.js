// Polished - XSS fix
window.Safe={sanitize(s){return String(s).replace(/[<>'"&]/g,'').slice(0,50);},setText(el,t){if(el)el.textContent=this.sanitize(t);}};