import LooseObject from './lib/LooseObject';
import * as ExpressionParser from './lib/ExpressionParser';
import * as ExpressionRunner from './lib/ExpressionRunner';

export function Parse(content: string, sandboxConfiguration: LooseObject) {
    const expressions = ExpressionParser.findExpressionsInText(content);

    return ExpressionRunner.runExpressions(content, expressions, sandboxConfiguration);
}