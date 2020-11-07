export enum ExpressionType { 
    Condition = 0, 
    ElseCondition = 1, 
    Else = 2, 
    BlockEnd = 3, 
    Assignment = 4 
};

export class Expression {

    public expressionType: ExpressionType;
    public expressionContent: string;
    public start: number;
    public end: number;

    constructor(expressionType: ExpressionType, expressionContent: string, start: number, end: number) {
        this.expressionType = expressionType;
        this.expressionContent = expressionContent;
        this.start = start;
        this.end = end;
    }
}