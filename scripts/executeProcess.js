const childProcess = require('child_process');

module.exports = function (path) {
    var process = childProcess.fork(path);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        console.log(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        var err = code === 0 ? null : new Error('exit code ' + code);
        if (err) {
          console.log(err);
        }
    });
}