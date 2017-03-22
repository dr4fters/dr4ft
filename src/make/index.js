var target = process.argv[2]
require('traceur').require.makeDefault(function(path) {
  return path.indexOf('node_modules') === -1
})
require('./' + target)
