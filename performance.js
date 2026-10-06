// Fixed - DPR + style sync + resize observer
window.fixGameResolution=function(){
  const c=document.getElementById('gameCanvas');
  if(!c||!c.parentElement) return;
  const r=c.parentElement.getBoundingClientRect();
  if(r.width===0||r.height===0) return;
  const dpr=Math.min(window.devicePixelRatio||1,2);
  const maxW=1920, maxH=1080;
  const w=Math.min(r.width*dpr, maxW), h=Math.min(r.height*dpr, maxH);
  c.width=w; c.height=h;
  c.style.width=r.width+'px'; c.style.height=r.height+'px';
  const ctx=c.getContext('2d');
  if(ctx) ctx.setTransform(dpr,0,0,dpr,0,0);
};
if(typeof ResizeObserver!=='undefined'){
  const ro=new ResizeObserver(()=>{ window.fixGameResolution(); });
  window.addEventListener('DOMContentLoaded', ()=>{
    const wrap=document.getElementById('game-wrapper')||document.getElementById('gameCanvas')?.parentElement;
    if(wrap) ro.observe(wrap);
  });
}
