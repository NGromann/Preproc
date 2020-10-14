const package = require('./package.json');

const { Command } = require('commander');
const program = new Command();

const Parser = require('./lib/Parser');

const fs = require('fs');
const Path = require('path');

program
  .version(package.version)
  .description('Parse preprocessors statements in .yaml files')
  .option('-d, --define <variables...>', 'Define a variable to be used. E.g. "-d foo=bar" or "-d baz"')
  .arguments('<path>')
  .action(main)
  .parse(process.argv);

function main(path, options) {
    console.log(program.opts());
        
    var resolvedPath = Path.resolve(path);
    
    var fileContent = fs.readFileSync(resolvedPath, { encoding: 'utf8' });

    Parser.parse(fileContent, options.define);
}


