import { Expression, ExpressionType } from "./Expression";
import { compileAndRun, compileCode } from "./ExpressionCompiler";

export function runExpressions(content: string, expressions: Expression[], sandbox: {[key: string]: any }) {
    for (let i = 0; i < expressions.length; i++) {
        let expression = expressions[i];

        let followingExpressions = expressions.slice(i+1);

        switch (expression.expressionType) {
        case ExpressionType.Condition:
        case ExpressionType.ElseCondition:
        case ExpressionType.Else:
            // conditionResult is the result of the evaluation if the expression. 
            // If this is an else expression, conditionResult will always be true.
            let conditionResult = true;
            if (expression.expressionType == ExpressionType.Condition || expression.expressionType == ExpressionType.ElseCondition) {
                conditionResult = !!compileAndRun(`return ${expression.expressionContent}`, sandbox);
            }
            
            if (conditionResult) 
            {
                // The expression evaluated to true. 
                // We will now remove all following else(-if) conditions.

                const nextElseBlock = firstExpressionOnLevelWhere(followingExpressions, expr => {
                    return expr.expressionType == ExpressionType.ElseCondition || expr.expressionType == ExpressionType.Else;
                });

                const nextEndBlock = firstExpressionOnLevelWhere(followingExpressions, expr => {
                    return expr.expressionType == ExpressionType.BlockEnd;
                });

                if (!nextEndBlock) {
                    // There is no following End Block.
                    throw Error('End expected');
                }

                if (nextElseBlock && nextElseBlock.start < nextEndBlock.start) {
                    // There is an else(-if) block before the end block.
                    // Remove everything between.
                    console.log(`Remove from ${nextElseBlock.start} to ${nextEndBlock.end}`);
                } 
            }
            else 
            {
                // The expression evaluated to false. 
                // We will now remove everything until the following else(-if) conditions.

                const nextElseEndBlock = firstExpressionOnLevelWhere(followingExpressions, expr => {
                    return expr.expressionType == ExpressionType.ElseCondition || expr.expressionType == ExpressionType.Else || expr.expressionType == ExpressionType.BlockEnd;
                });

                if (!nextElseEndBlock) {
                    // There is no following End Block.
                    throw Error('End or else expected');
                }

                console.log(`Remove from ${expression.start} to ${nextElseEndBlock.end}`);
            }
        }
    }
}

function firstExpressionOnLevelWhere(expressions: Expression[], filter: (expression: Expression) => boolean) {
    let currentLevel = 0;
    for (let i = 0; i < expressions.length; i++) {
        const expression = expressions[i];

        if (filter(expression) === true) {
            return expression;
        }

        if (expression.expressionType == ExpressionType.Condition) {
            currentLevel++;
        } else if (expression.expressionType == ExpressionType.BlockEnd) {
            currentLevel--;
        }

        if (currentLevel < 0) {
            return null;
        }
    }
    return null;
}

function firstExpressionOnLevel(expressions: Expression[]) {
    return firstExpressionOnLevelWhere(expressions, () => true);
}

