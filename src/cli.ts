#!/usr/bin/env node

import pJson from '../package.json';

import { Command } from "commander";
const program = new Command();

import * as Parser from '.';

import { ParseSandboxConfiguration } from './lib/Sandbox';

import * as fs from 'fs';
import * as Path from 'path';

program
    .version(pJson.version)
    .description('Parse preprocessors statements in files')
    .option('-s, --set <variables...>', 'set one or more variables to be used. E.g. "-d foo=bar baz"')
    .option('-o, --output <path>', 'write the result into a file instead of the console')
    .arguments('<path>')
    .action(main)
    .parse(process.argv);

function main(path: string, options: Command) {
    var resolvedInputPath = Path.resolve(path);

    var fileContent = fs.readFileSync(resolvedInputPath, { encoding: 'utf8' });

    const variableDefinitions : string[] = options.set || [];

    const sandbox = ParseSandboxConfiguration(variableDefinitions);

    const parsedContent = Parser.Parse(fileContent, sandbox);
    
    if (options.output) {
        var resolvedOutputPath = Path.resolve(options.output);
        fs.writeFileSync(resolvedOutputPath, parsedContent);
    } else {
        console.log(parsedContent);
    }
}