import { tokenize } from '../src/lexer';
import { parse } from '../src/parser';
import { evaluate } from '../src/evaluator';
import { renderTokensAsHTML } from '../src/render/html';
// import { renderTokensAsLaTeX } from '../src/render/latex';
import { createContext } from '../src/context';
import { createSolutionStack } from '../src/evaluator/solution';

const input = document.querySelector('textarea')!;

const errorBox = document.querySelector('#error')!;

const solveBtn = document.querySelector('#solve')!;

const solutionBox = document.querySelector('#solution')!;

// create evaluation context
const ctx = createContext({
    preferences: {
        fractionDigits: 3,
        precision: 15,
        angles: 'deg'
    }
});

// utility to solve a given math expression string
// - steps taken
//      - tokenize input string
//      - parse tokens into AST tree
//      - evaluate and solve each node in AST body
//      - render solution as HTML
function solve(code = '') {
    console.clear();

    console.log('code:', code);

    const tokens = tokenize(ctx, code);
    console.log(
        'tokens:',
        tokens.map((t) => `${t.type}[${t.value}] ${t.line}:${t.column}`)
    );

    // const htmlStr = renderTokensAsHTML(tokens, { colorScheme: 'auto' })
    // console.log('render: html', htmlStr)

    // const latexStr = renderTokensAsLaTeX(tokens, { mode: 'align' })
    // console.log('render: latex\n', latexStr)

    const ast = parse(tokens);
    console.log('ast:', ast);

    const result = ast.body.map((node) => {
        const solution = createSolutionStack();
        const value = evaluate(ctx, node, solution);
        return { value, solution };
    });
    console.log(
        'result:',
        result.map((r) => r.value)
    );
    console.log(
        'solution:',
        result.map((r) => r.solution.steps)
    );

    let solution = '';
    for (const r of result) {
        const steps = r.solution.steps;
        steps.pop();
        if (steps.length < 2) continue;
        solution += steps.join('\n') + '\n\n';
    }

    const content = renderTokensAsHTML(tokenize(ctx, solution), {
        colorScheme: 'auto'
    });

    solutionBox.innerHTML = content.html + `<style>${content.css}</style>`;
}

// initial test program
const testProgram = `
# variables
x = 5
y = -3.14159
z = 1.618
w = 0.577

# examples
r1 = 2x^3 + sqrt(25) - abs(-10) * cos(0)
r2 = sin(30) * log10(100) + y^2 / (4 + 2)
r3 = z(x+y)^2 - sqrt(z^3 + 4x) + ln(exp(2))
r4 = w^x + tan(45) * sqrt(x^2 + y^2) - floor(3.7z)
r5 = (x*y + z*w)^2 / (sin(w) + cos(x)) + abs(y - z)
r6 = 2^(x-1) + log2(64) + sqrt(w+1) - ceil(y*z)
r7 = add(x,y,z,w) + div(x^2, y^2) * log2(4)
`.trim();

input.value = testProgram;

function safeSolve(input: string) {
    try {
        solve(input);
        errorBox.classList.remove('active');
    } catch (err) {
        errorBox.classList.add('active');
        errorBox.textContent = `${err}`;
        solutionBox.innerHTML = '';
    }
}

safeSolve(testProgram);

// solve input string when `Solve` button is clicked
solveBtn.addEventListener('click', () => {
    safeSolve(input.value);
});
