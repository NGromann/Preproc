import VariableDefinition from './VariableDefinition';
import * as ExpressionParser from './ExpressionParser';
import * as ExpressionRunner from './ExpressionRunner';
import { ConfigureSandbox } from './Sandbox';
export function parse(content: string, variables: string[]) {
    console.log();
    console.log("-> Variables:", variables);
    console.log("-> File content:");
    console.log(content);
    console.log();

    const variableDefinitions : VariableDefinition[] = []
    for (const variableString of variables) {
        variableDefinitions.push(new VariableDefinition(variableString));
    }

    const expressions = ExpressionParser.findExpressionsInText(content);

    console.log(expressions);

    const sandbox = ConfigureSandbox(variableDefinitions);

    console.log(sandbox);

    ExpressionRunner.runExpressions(content, expressions, sandbox);
}