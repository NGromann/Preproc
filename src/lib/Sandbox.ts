import LooseObject from "./LooseObject";
import VariableDefinition from "./VariableDefinition";

export function ParseSandboxConfiguration(variableDefinitionStrings: string[]) {
    const variableDefinitions : VariableDefinition[] = []
    for (const variableString of variableDefinitionStrings) {
        variableDefinitions.push(new VariableDefinition(variableString));
    }
    return ConfigureSandbox(variableDefinitions);
}

function ConfigureSandbox(variables: VariableDefinition[]) {
    const sandbox: LooseObject = {};
    for (const variable of variables) {
        sandbox[variable.name] = variable.value;
    }
    return sandbox;
}