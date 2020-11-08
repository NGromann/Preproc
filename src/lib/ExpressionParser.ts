import { Expression, ExpressionType } from './Expression';

const openingExpr = /\{\{/g;
const closingExpr = /\}\}/g;
const quoteExpr = /(?<!\\)\"/g;

const expressionFilterTypeMap: { [regex: string]: number } = {
    "^\\s*else if ([\\s\\S]*)\\s*$" : ExpressionType.ElseCondition, // [\\s\\S] workaround for missing dot-all flag
    "^\\s*if ([\\s\\S]*)\\s*$" : ExpressionType.Condition,
    "^\\s*else\\s*$" : ExpressionType.Else,
    "^\\s*end\\s*$" : ExpressionType.BlockEnd,
    "^\\s*\\=([\\s\\S]*)\\s*$" : ExpressionType.Assignment,
    "^\\s*\\:([\\s\\S]*)\\s*$" : ExpressionType.Execution,
};

const logMatch = (match: RegExpMatchArray) => console.log(`Found ${match[0]} start=${match.index} end=${match.index + match[0].length}.`);

export function findExpressionsInText(content: string) {
    let openingMatches = Array.from(content.matchAll(openingExpr));
    let closingMatches = Array.from(content.matchAll(closingExpr));
    let quoteMatches = Array.from(content.matchAll(quoteExpr));

    if (quoteMatches.length % 2 > 0) {
        throw Error("Closing quote expected.");
    }

    // Iterate through the quote pairs
    for (let i = 0; i < quoteMatches.length; i += 2) {
        const openingQuoteMatch = quoteMatches[i];
        const closingQuoteMatch = quoteMatches[i+1];

        openingMatches = openingMatches.filter(x => x.index < openingQuoteMatch.index || x.index > closingQuoteMatch.index);
        closingMatches = closingMatches.filter(x => x.index < openingQuoteMatch.index || x.index > closingQuoteMatch.index);
    }
    
    let expressions = [];
    for (const openingMatch of openingMatches) {
        // Find the next closingExpression
        const closingMatch = closingMatches.find(x => x.index > openingMatch.index);
        
        if (!closingMatch) {
            throw Error("Expected }}");
        }

        const expressionStart = openingMatch.index;
        const expressionEnd = closingMatch.index + closingMatch[0].length;

        const expressionContentStart = openingMatch.index + openingMatch[0].length;
        const expressionContentEnd = closingMatch.index;
        
        const expressionText = content.substring(expressionContentStart, expressionContentEnd).trim();

        let expressionType = null;
        let expressionContent = null;

        for (const expressionFilter of Object.keys(expressionFilterTypeMap)) {
            const match = new RegExp(expressionFilter).exec(expressionText);
            if (match != null) {
                expressionType = expressionFilterTypeMap[expressionFilter];
                expressionContent = match[1] || null;
                break;
            }
        }

        if (expressionType == null) {
            throw Error(`Operator expected in ${expressionText}`);
        }

        expressions.push(new Expression(expressionText, expressionType, expressionContent, expressionStart, expressionEnd));
    }

    return expressions;
}