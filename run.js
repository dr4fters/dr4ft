var spawn = require('child_process').spawn

;(function run() {
  spawn('node', ['app.js'], { stdio: 'inherit' })
  .on('close', run)
})()
