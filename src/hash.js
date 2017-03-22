var crypto = require('crypto')

var opts = {
  cock: {
    algo: 'sha1',
    separator: ';',
    prefix: 'SB:',
    name(name) {
      return name.toLowerCase()
    },
    digest(digest) {
      // 10 digits of base 16 -> 8 digits of base 32
      return parseInt(digest.slice(0, 10), 16).toString(32)
    }
  },
  mws: {
    algo: 'md5',
    separator: '',
    prefix: '#',
    name(name) {
      return name.toUpperCase().replace(/[^A-Z]/g, '')
    },
    digest(digest) {
      return digest.slice(0, 8)
    }
  }
}

function hash(deck, opts) {
  var items = []
  for (var zoneName in deck) {
    var prefix = zoneName === 'side'
      ? opts.prefix
      : ''

    var cards = deck[zoneName]
    for (var cardName in cards) {
      var count = cards[cardName]
      var item = prefix + opts.name(cardName)
      while (count--)
        items.push(item)
    }
  }

  var data = items.sort().join(opts.separator)
  var digest = crypto
    .createHash(opts.algo)
    .update(data, 'ascii')
    .digest('hex')
  return opts.digest(digest)
}

module.exports = function (deck) {
  return {
    cock: hash(deck, opts.cock),
    mws: hash(deck, opts.mws)
  }
}
