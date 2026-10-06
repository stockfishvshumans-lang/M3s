// Fixed - no leak, delete after fire, separate timeout/interval tracking
window.TimerRegistry={
  ids:new Set(),
  add(fn,ms){
    const id=setInterval(fn,ms);
    this.ids.add(id);
    return id;
  },
  addTimeout(fn,ms){
    const gen=window.GameMachine?window.GameMachine.gen:0;
    const id=setTimeout(()=>{
      this.ids.delete(id);
      if(window.GameMachine && window.GameMachine.gen!==gen) return;
      fn();
    },ms);
    this.ids.add(id);
    return id;
  },
  clear(id){
    if(!id) return;
    clearInterval(id); clearTimeout(id);
    this.ids.delete(id);
  },
  clearAll(){
    this.ids.forEach(id=>{ clearInterval(id); clearTimeout(id); });
    this.ids.clear();
  }
};
