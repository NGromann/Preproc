// For this demo we import the already existing module at ../dist/src. 
// If you instaled it from npm, use the following line:
// const preproc = require('preproc.js');
const preproc = require('../dist/src');

const fs = require('fs');

function main() {
    const employeeTemplate = fs.readFileSync('./employee.yaml', { encoding: 'utf8' });

    const result = preproc.Parse(employeeTemplate, {
        // Try changing these variables and watch the output change:
        nickname: 'Devel',
        includeFavFood: true,
    });

    console.log(result);
}

main();