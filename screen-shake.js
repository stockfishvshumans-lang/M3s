// Fixed - bidirectional shake + no transform concat bug
window.ScreenShake={
  shake(i=10){
    const t=document.getElementById('game-wrapper');
    if(!t) return;
    const x=(Math.random()-0.5)*i*2, y=(Math.random()-0.5)*i*2;
    t.style.transform=`translate(${x}px,${y}px)`;
    setTimeout(()=>{ t.style.transform=''; },200);
  }
};
