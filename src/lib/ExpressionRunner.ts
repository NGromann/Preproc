import { stringify } from "querystring";
import { Expression, ExpressionType } from "./Expression";
import { compileAndRun, compileCode } from "./ExpressionCompiler";

let content: string;
let followingExpressions: Expression[];

export function runExpressions(startContent: string, expressions: Expression[], sandbox: {[key: string]: any }) {
    content = startContent;

    followingExpressions = expressions;

    while(followingExpressions.length > 0) {
        let expression = followingExpressions[0];

        followingExpressions.shift();

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
            
            console.log('________________');
            console.log('Evaluation: '+conditionResult);

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


                console.log(`Remove from ${expression.start} to ${expression.end}`);
                console.log(`${content.substring(expression.start, expression.end)}`);
                
                RemoveExpressionFromContent(expression);
                

                if (nextElseBlock && nextElseBlock.start < nextEndBlock.start) {
                    // There is an else(-if) block before the end block.
                    // Remove everything between.
                    console.log(`Also remove from ${nextElseBlock.start} to ${nextEndBlock.end} (else)`);
                    console.log(`${content.substring(nextElseBlock.start, nextEndBlock.end)}`);
                    
                    RemoveRangeFromContent(nextElseBlock.start, nextEndBlock.end);
                }
                else
                {
                    console.log(`Also remove from ${nextEndBlock.start} to ${nextEndBlock.end} (end)`);
                    console.log(`${content.substring(nextEndBlock.start, nextEndBlock.end)}`);

                    RemoveExpressionFromContent(nextEndBlock);
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

                const rangeEndIndex = nextElseEndBlock.expressionType == ExpressionType.BlockEnd ? nextElseEndBlock.end : nextElseEndBlock.start;

                console.log(`Remove from ${expression.start} to ${rangeEndIndex}:`);
                console.log(`${content.substring(expression.start, rangeEndIndex)}`);

                RemoveRangeFromContent(expression.start, rangeEndIndex);
            }

            console.log(`Updated content:\n${content}\n`);
            
            break;
        case ExpressionType.Execution:
            compileAndRun(expression.expressionContent, sandbox);

            RemoveExpressionFromContent(expression);

            break;
        case ExpressionType.Assignment:
            const executionResult = compileAndRun(`return ${expression.expressionContent}`, sandbox);
            
            RemoveExpressionFromContent(expression);

            insertIntoContent(executionResult, expression.start);

            break;
        }
    }
    console.log("\n\n\nFinal Content:\n");
    console.log(content);
}

function firstExpressionOnLevelWhere(expressions: Expression[], filter: (expression: Expression) => boolean) {
    let currentLevel = 0;
    for (let i = 0; i < expressions.length; i++) {
        const expression = expressions[i];

        if (currentLevel == 0 && filter(expression) === true) {
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

// Removes the expression from the expression list and from the file content string
function RemoveExpressionFromContent(expression: Expression) {
    const index = followingExpressions.indexOf(expression);

    // Remove the expression from the followingExpressions list
    if (index != -1) {
        followingExpressions.splice(index, 1);
    }

    // Cut the expression out of the content string
    content = content.slice(0, expression.start) + content.slice(expression.end);

    const cutLength = expression.end - expression.start;

    // Update the following expression's start and end indexes
    for (const followingExpression of followingExpressions) {
        if (followingExpression.start > expression.start) {
            followingExpression.start -= cutLength;
            followingExpression.end -= cutLength;
        }
    }

    return expression;
}

// Removes all the expressions between the start and end index from the followingExpressions list.
// Also cuts the substring between the start and end index from the file content string.
function RemoveRangeFromContent(start: number, end: number) {
    var expressionsInRange = followingExpressions.filter(expr => expr.start >= start && expr.end <= end);

    for (const expression of expressionsInRange) {
        const index = followingExpressions.indexOf(expression);
    
        // Remove the expression from the followingExpressions list
        followingExpressions.splice(index, 1);        
    }

    // Cut the expression out of the content string
    content = content.slice(0, start) + content.slice(end);

    // Update the following expression's start and end indexes
    const cutLength = end - start;
    for (const followingExpression of followingExpressions) {
        if (followingExpression.start > start) {
            followingExpression.start -= cutLength;
            followingExpression.end -= cutLength;
        }
    }



    return expressionsInRange;
}

function insertIntoContent(insertion: string, position: number) {
    content = content.substring(0, position) + insertion + content.substring(position);

    const insertionLength = insertion.length;

    for (const followingExpression of followingExpressions) {
        if (followingExpression.start > position) {
            followingExpression.start += insertionLength;
            followingExpression.end += insertionLength;
        }
    }

}