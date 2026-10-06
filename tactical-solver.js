// Fixed - expanded solver: x/2, 2(x+1), negative, decimals
window.solveTacticalEquation=function(equation){
 try{
  let eq=equation.trim().replace(/\s+/g,'');
  if(!eq.includes('=')) return null;
  let [left,right]=eq.split('=');
  let rhs=parseFloat(right);
  if(isNaN(rhs)) return null;
  left=left.replace(/\s/g,'');
  // x/2 = c  => x = c*2
  let m=left.match(/^x\/(\-?\d+(?:\.\d+)?)$/);
  if(m){ let d=parseFloat(m[1]); if(d!==0) return rhs*d; }
  // 2(x+3)=c  => simple handling: a(x+b)=c
  m=left.match(/^(\-?\d+(?:\.\d+)?)\(x([\+\-])(\d+(?:\.\d+)?)\)$/);
  if(m){
    let a=parseFloat(m[1]), op=m[2], b=parseFloat(m[3]);
    if(op==='-') b=-b;
    // a(x+b)=rhs => x+b=rhs/a => x=rhs/a - b
    return rhs/a - b;
  }
  // x+b=c , x-b=c
  m=left.match(/^x([\+\-])(\d+(?:\.\d+)?)$/);
  if(m){ let op=m[1], b=parseFloat(m[2]); return op==='+'?rhs-b:rhs+b; }
  // ax=c
  m=left.match(/^(\-?\d*\.?\d*)x$/);
  if(m){
    let coeff=m[1]; if(coeff===''||coeff==='+') coeff=1; else if(coeff==='-') coeff=-1; else coeff=parseFloat(coeff);
    if(coeff===0) return null; return rhs/coeff;
  }
  // ax+b=c
  m=left.match(/^(\-?\d*\.?\d*)x([\+\-])(\d+(?:\.\d+)?)$/);
  if(m){
    let coeff=m[1]; if(coeff===''||coeff==='+') coeff=1; else if(coeff==='-') coeff=-1; else coeff=parseFloat(coeff);
    let op=m[2], b=parseFloat(m[3]); if(op==='-') b=-b;
    return (rhs-b)/coeff;
  }
  if(left==='x') return rhs;
  return null;
 }catch(e){ console.warn("Tactical solver error:", e); return null; }
};
window.nexusAutoCorrect=function(input){
 if(!input) return input;
 return input.trim().replace(/\s*\+\s*/g,' + ').replace(/\s*\-\s*/g,' - ').replace(/\s*\=\s*/g,' = ').replace(/\s*\/\s*/g,' / ').replace(/\bX\b/g,'x');
};
console.log("🧠 tactical-solver.js v2 fixed loaded");
