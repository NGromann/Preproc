import VariableDefinition from "./VariableDefinition";

export function ConfigureSandbox(variables: VariableDefinition[]) {
    const sandbox: { [key: string]: any } = {};
    for (const variable of variables) {
        sandbox[variable.name] = variable.value;
    }
    return sandbox;
}