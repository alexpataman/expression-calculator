function eval() {
    // Do not use eval!!!
    return;
}

const expressionCalculator = (str) => {

    // order of operators is important
    const operations = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => {
            if (b === 0) {
                throw 'TypeError: Division by zero.';
            }
            return (a / b);
        }
    }
    const operators = Object.keys(operations);

    const processExpression = (expr) => {
        for (let operator of operators) {
            // don't match beginning of the string and don't match one by one operators
            let regexPattern = `(?!^)(?<!\\${operators.map(el => '\\' + el).join('|')})\\${operator}`;
            let found = [...expr.matchAll(new RegExp(regexPattern, 'g'))];
            let matchedOperation = found[found.length - 1];

            if (matchedOperation) {
                let x = expr.slice(0, matchedOperation.index);
                let y = expr.slice(matchedOperation.index + 1);

                return y ? operations[matchedOperation[0]](processExpression(x), processExpression(y)) : x;
            }
        }

        return +expr;
    }

    const calculate = (str) => {
        // remove all spaces
        str = str.replace(/\s/g, '');

        // stack for checking brackets
        let stack = [];

        for (let i = 0; i < str.length; i++) {
            if (str[i] === ')') {
                if (!stack.length) {
                    throw 'ExpressionError: Brackets must be paired';
                }

                // expression in brackets, should be calculated
                let toCalculate = str.slice(stack[stack.length - 1] + 1, i);

                let calculated = processExpression(toCalculate);

                // combine the whole expression again
                str = str.slice(0, stack[stack.length - 1]) + calculated + str.slice(i + 1);

                // return index back to the latest position of open bracket
                i = stack.pop();

            } else if (str[i] === '(') {
                stack.push(i);
            }
        }
        if (stack.length) {
            throw 'ExpressionError: Brackets must be paired';
        }
        return processExpression(str);
    }

    return calculate(str);
}

module.exports = {
    expressionCalculator
}