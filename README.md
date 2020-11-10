# Preproc.js - The only preprocessor you will ever need.

![npm](https://img.shields.io/npm/v/preproc.js)
![GitHub](https://img.shields.io/github/license/NGromann/Preproc)

## What is preproc.js?
Preproc.js is an all in one preprocessor usable for all types of files. The expressions can be written in JavaScript and compiled from the command line or using node.js. 

## Usage
### Command line
Install preproc.js:
``` console
foo@bar:~$ npm install -g preproc.js
```

Compile the source file:
``` console
foo@bar:~$ preproc <input-path>
```
Optionally specify an output path:
``` console
foo@bar:~$ preproc <input-path> -o <output-path>
```

### Node.js
Install preproc.js:
``` console
foo@bar:~$ npm install preproc.js
```

Compile a string:
``` javascript
const parser = require('preproc');
const input = 'Current Date: {{ = new Date().toLocaleString() }}';
const result = parser.Parse(input, {});

console.log(result); // Current Date: 9.11.2020, 18:51:09
```

## Preprocessor expressions
The preprocessor expressions can be written in JavaScript. All of them must be wrapped into double curly brackets `{{ ... }}`.

#### Executions
The `:` operator can be used to simply execute code:
```
{{ :
  const date = new Date();
  const timeString = date.toLocaleString();
}}
Current Date: {{ = timeString }}
```
Result:
`Current Date: 9.11.2020, 18:51:09`

#### Assignments
The `=` operator can be used to return a given value:
```
Current Date: {{ = new Date().toLocaleString() }}
```
Result:
`Current Date: 9.11.2020, 18:51:09`

#### Conditions
Use the keywords `if`, `else if`, `else` and `end` to output the inner text based on conditions:
```
{{ :
  const currentHour = new Date().getHours();
}}

{{ if currentHour <= 10 }}
Good morning!
{{ else if currentHour >= 18 }}
Good evening!
{{ else }}
Good day!
{{ end }}
```
Result:
`Good evening!`

## Command-line Options
| Short | Full                   | Description                                                                                    |
|-------|------------------------|------------------------------------------------------------------------------------------------|
| -V    | --version              | output the version number                                                                      |
| -s    | --set \<variables...\> | set one or more variables to be used. `"-d foo=bar baz"` can be retrieved using `{{ = foo }}`  |
| -o    | --output \<path\>      | write the result into a file instead of the console                                            |
| -h    | --help                 | display help for command                                                                       |
