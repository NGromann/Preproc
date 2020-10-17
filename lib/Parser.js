const ExpressionParser = require('./ExpressionParser');

function parse(content, variables) {
    console.log(content, variables);

    let expressions = ExpressionParser.findExpressionsInText(content);

    console.log(expressions);
}

module.exports.parse = parse;