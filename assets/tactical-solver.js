// ==========================================
// 🧠 TACTICAL-SOLVER.JS - NEXUS Math Solver v2 - Safe parser
// No Function() / eval - shunting-yard safe evaluator
// ==========================================

window.solveTacticalEquation = function(equation) {
    try {
        equation = equation.trim().replace(/\s+/g, ' ');
        if (!equation.includes('=')) return null;
        let [left, right] = equation.split('=').map(s => s.trim());
        let rhs = parseFloat(right);
        if (isNaN(rhs)) return null;
        left = left.replace(/\s/g, '');
        let m = left.match(/^x([\+\-])(\d+(?:\.\d+)?)$/);
        if (m) {
            let op = m[1]; let b = parseFloat(m[2]);
            return op === '+' ? rhs - b : rhs + b;
        }
        m = left.match(/^(-?\d*\.?\d*)x$/);
        if (m) {
            let coeff = m[1];
            if (coeff === '' || coeff === '+') coeff = 1;
            else if (coeff === '-') coeff = -1;
            else coeff = parseFloat(coeff);
            if (coeff === 0) return null;
            return rhs / coeff;
        }
        m = left.match(/^(-?\d*\.?\d*)x([\+\-])(\d+(?:\.\d+)?)$/);
        if (m) {
            let coeff = m[1];
            if (coeff === '' || coeff === '+') coeff = 1;
            else if (coeff === '-') coeff = -1;
            else coeff = parseFloat(coeff);
            let op = m[2]; let b = parseFloat(m[3]);
            if (op === '-') b = -b;
            return (rhs - b) / coeff;
        }
        if (left === 'x') return rhs;
        return null;
    } catch(e) {
        console.warn("Tactical solver error:", e);
        return null;
    }
};

window.nexusAutoCorrect = function(input) {
    if (!input) return input;
    return input.trim()
        .replace(/\s*\+\s*/g, ' + ')
        .replace(/\s*\-\s*/g, ' - ')
        .replace(/\s*\=\s*/g, ' = ')
        .replace(/\bX\b/g, 'x');
};

// Safe math evaluator - no Function(), no eval
// Supports + - * / ( ) and decimal numbers, x is treated as variable placeholder for multiplication
window.evaluateFlat = window.evaluateFlat || function(expr) {
    try {
        if (typeof expr !== 'string') return null;
        // Strict whitelist: only numbers, x, + - * / ( ) . whitespace
        if (/[^0-9x+\-*/().\s]/.test(expr)) return null;
        // Replace x with * for multiplication (but keep 'x' as variable? Original intent was multiplication)
        // For safety, if expr contains 'x' not as operator, reject unless it's '3x' pattern -> convert
        let sanitized = expr.replace(/([0-9])x/g, '$1*').replace(/x([0-9])/g, '*$1').replace(/x/g, '*');
        // Remove double operators, empty
        sanitized = sanitized.trim();
        if (!sanitized || sanitized.length > 100) return null;
        // Shunting-yard to RPN then evaluate
        const tokens = sanitized.match(/(\d+\.?\d*|\+|\-|\*|\/|\(|\))/g);
        if (!tokens) return null;
        const prec = { '+':1, '-':1, '*':2, '/':2 };
        const output = [];
        const ops = [];
        for (let t of tokens) {
            if (!isNaN(t)) output.push(parseFloat(t));
            else if (t in prec) {
                while (ops.length && ops[ops.length-1] !== '(' && prec[ops[ops.length-1]] >= prec[t]) {
                    output.push(ops.pop());
                }
                ops.push(t);
            } else if (t === '(') ops.push(t);
            else if (t === ')') {
                while (ops.length && ops[ops.length-1] !== '(') output.push(ops.pop());
                if (ops.length && ops[ops.length-1] === '(') ops.pop(); else return null;
            }
        }
        while (ops.length) {
            const op = ops.pop();
            if (op === '(' || op === ')') return null;
            output.push(op);
        }
        const stack = [];
        for (let token of output) {
            if (typeof token === 'number') stack.push(token);
            else {
                if (stack.length < 2) return null;
                const b = stack.pop(), a = stack.pop();
                if (token === '+') stack.push(a+b);
                else if (token === '-') stack.push(a-b);
                else if (token === '*') stack.push(a*b);
                else if (token === '/') { if (b===0) return null; stack.push(a/b); }
            }
        }
        return stack.length===1 ? stack[0] : null;
    } catch(e) { return null; }
};

console.log("🧠 tactical-solver.js v2 loaded - Safe parser, no eval");
