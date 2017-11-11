var spawn = require('child_process').spawn

;(function run() {
  spawn('node', ['scripts/app.js'], { stdio: 'inherit' })
  .on('close', run)
})()
