# Preproc.js - The only preprocessor you will ever need.

## What is preproc.js?
Preproc.js is an all in one preprocessor usable for all types of files. The expressions can be written in JavaScript and compiled from the command line or using node.js. 

## Usage
### Command line
#### Install preproc.js:
``` console
foo@bar:~$ npm install -g preproc.js
```

#### Compile the source file:
``` console
foo@bar:~$ preproc <input-path>
```
Optionally specify an output path:
``` console
foo@bar:~$ preproc <input-path> -o <output-path>
```

### Node.js
#### Install preproc.js:
``` console
foo@bar:~$ npm install preproc.js
```

#### Compile a string:
``` javascript
const parser = require('preproc');
const input = 'Current Date: {{ = new Date().toLocaleString() }}';
const result = parser.Parse(input, {});

console.log(result);
```
