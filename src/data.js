try {
  var Cards = require('../data/cards')
  var Sets = require('../data/sets')
} catch(err) {
  Cards = {}
  Sets = {}
}

module.exports = { Cards, Sets,
  mws: require('../data/mws')
}
