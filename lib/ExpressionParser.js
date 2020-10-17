const Expression = require('./Expression');

const openingExpr = /\{\{/g;
const closingExpr = /\}\}/g;
const quoteExpr = /(?<!\\)\"/g;

const logMatch = (match) => console.log(`Found ${match[0]} start=${match.index} end=${match.index + match[0].length}.`);

function findExpressionsInText(content) {
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
    
    var expressions = [];
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
        
        const expressionContent = content.substring(expressionContentStart, expressionContentEnd).trim();

        expressions.push(new Expression(expressionContent, expressionStart, expressionEnd));
    }

    return expressions;
}

module.exports.findExpressionsInText = findExpressionsInText;