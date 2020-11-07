export default class VariableDefinition {
    public name: string;
    public value: any;

    public constructor(definition: string) {
        if (definition.trim().length == 0) {
            throw Error('Empty variable definition.');
        }

        const parts = definition.split(/=(.+)/);

        this.name = parts[0].trim();
        
        if (parts.length > 1) {
            this.value = parts[1];
        } else {
            this.value = true;
        }
    }
}