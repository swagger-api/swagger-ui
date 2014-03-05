var util = require('util'),
    exec = require('child_process').exec,
    child;

var printOutput = function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
        console.log('exec error: ' + error);
    }
};

child = exec('npm run-script build', printOutput);