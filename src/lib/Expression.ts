export enum ExpressionType { 
    Condition = 0,
    ElseCondition = 1,
    Else = 2,
    BlockEnd = 3,
    Assignment = 4,
    Execution = 5,
};

export class Expression {

    public fullExpression: string;

    public expressionType: ExpressionType;
    public expressionContent: string;
    public start: number;
    public end: number;

    constructor(fullExpression: string, expressionType: ExpressionType, expressionContent: string, start: number, end: number) {
        this.fullExpression = fullExpression;

        this.expressionType = expressionType;
        this.expressionContent = expressionContent;
        this.start = start;
        this.end = end;
    }
}