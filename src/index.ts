import pJson from '../package.json';

import { Command } from "commander";
const program = new Command();

// const Parser = require('./lib/Parser');
import * as Parser from './lib/Parser';


import * as fs from 'fs';
import * as Path from 'path';

program
    .version(pJson.version)
    .description('Parse preprocessors statements in .yaml files')
    .option('-d, --define <variables...>', 'Define a variable to be used. E.g. "-d foo=bar" or "-d baz"')
    .arguments('<path>')
    .action(main)
    .parse(process.argv);

function main(path: string, options: Command) {
    console.log(program.opts());
        
    var resolvedPath = Path.resolve(path);

    var fileContent = fs.readFileSync(resolvedPath, { encoding: 'utf8' });

    Parser.parse(fileContent, options.define);
}