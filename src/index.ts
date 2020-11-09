import LooseObject from './lib/LooseObject';
import * as ExpressionParser from './lib/ExpressionParser';
import * as ExpressionRunner from './lib/ExpressionRunner';
import { PostCleanupContent } from './lib/PostCleanup';

export function Parse(content: string, sandboxConfiguration: LooseObject) {
    const expressions = ExpressionParser.findExpressionsInText(content);

    const parsedContent = ExpressionRunner.runExpressions(content, expressions, sandboxConfiguration);

    return PostCleanupContent(parsedContent);
}