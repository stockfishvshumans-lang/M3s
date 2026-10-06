// Fixed - full device detection with resize listener
window.GadgetDetector={
  detect(){
    const w=window.innerWidth, h=window.innerHeight;
    let g='desktop', isTouch='ontouchstart' in window;
    if(w<375) g='mobile-small';
    else if(w<=428) g='mobile';
    else if(w<=1024) g='tablet';
    else g='desktop';
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency<=4 : false;
    return {g,width:w,height:h,isTouch,dpr,isLowEnd};
  },
  current:null,
  init(){
    this.current=this.detect();
    window.addEventListener('resize', ()=>{ 
      const next=this.detect();
      if(next.g!==this.current.g){ this.current=next; window.dispatchEvent(new CustomEvent('gadget:change',{detail:next})); }
    });
    document.documentElement.setAttribute('data-gadget', this.current.g);
  }
};
window.GadgetDetector.init();
