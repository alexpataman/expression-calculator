function eval() {
    // Do not use eval!!!
    return;
}

const expressionCalculator = (str) => {
    // remove all spaces
    str = str.replace(/\s/g, '');

    // stack for checking brackets
    let stack = [];

    for (let i = 0; i < str.length; i++) {
        if (str[i] === ')') {
            if (!stack.length) {
                throw 'ExpressionError: Brackets must be paired';
            }

            let toCalculate = str.slice(stack[stack.length - 1] + 1, i);
            let calculated = doCalculate(toCalculate);

            str = str.slice(0, stack[stack.length - 1]) + calculated + str.slice(i + 1);
            i = stack.pop();
        } else if (str[i] === '(') {
            stack.push(i);
        }
    }
    if (stack.length) {
        throw 'ExpressionError: Brackets must be paired';
    }

    return doCalculate(str);
}

function doCalculate(expr) {
    const operators = ['+', '-', '*', '/'];

    const calculate = (operation, a, b) => {
        a = +a, b = +b;

        switch (operation) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '*':
                return a * b;
            case '/':
                if (b === 0) {
                    throw 'TypeError: Division by zero.';
                }
                return a / b;
        }
    }

    for (let operator of operators) {
        //let regexPattern = `(?!^)(?<!\\/|\\*|\\+|\\-)\\${operator}`;
        // don't match beginning of the string and don't match one by one operators
        let regexPattern = `(?!^)(?<!\\${operators.map(el => '\\' + el).join('|')})\\${operator}`;
        let found = [...expr.matchAll(new RegExp(regexPattern, 'g'))];
        let matchedOperation = found[found.length - 1];

        if (matchedOperation) {
            let x = expr.slice(0, matchedOperation.index);
            let y = expr.slice(matchedOperation.index + 1);

            return y ? calculate(matchedOperation[0], doCalculate(x), doCalculate(y)) : x;
        }
    }

    return +expr;
}

module.exports = {
    expressionCalculator
}