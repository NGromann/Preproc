# Preproc.js Example
## Usage
### Command line
If you did not already install it, use ...
``` console
foo@bar:~$ npm install -g preproc.js
```
... to install preproc.js globally. Next parse the example file:
``` console
foo@bar:~$ preproc employee.yaml --set nickname="Devel" includeFavFood
```

### Node.js
First navigate into the example directory:
``` console
foo@bar:~$ cd example
```
then run the example file:
``` console
foo@bar:~$ node getEmployee.js
```
Try changing the variables passed to the parser in getEmployee.js:
``` javascript
const result = preproc.Parse(employeeTemplate, {
    // Try changing these variables and watch the output change:
    nickname: 'Hello World',
    includeFavFood: false,
});
```
Run it again and you should be able to see a different output.
