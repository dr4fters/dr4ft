var assert = require('assert')
var _ = require('./_')
var {Cards, Sets} = require('./data')
var BASICS = [
  'Forest',
  'Island',
  'Mountain',
  'Plains',
  'Swamp'
]

function transform(cube, seats, type) {
  var {list, cards, packs} = cube

  assert(typeof list === 'string', 'typeof list')
  assert(typeof cards === 'number', 'typeof cards')
  assert(5 <= cards && cards <= 30, 'cards range')
  assert(typeof packs === 'number', 'typeof packs')
  assert(3 <= packs && packs <= 12, 'packs range')

  list = list.split('\n').map(_.ascii)

  var min = type === 'cube draft'
    ? seats * cards * packs
    : seats * 90
  assert(min <= list.length && list.length <= 1e5,
    `this cube needs between ${min} and 100,000 cards; it has ${list.length}`)

  var bad = []
  for (var cardName of list)
    if (!(cardName in Cards))
      bad.push(cardName)

  if (bad.length) {
    var msg = `invalid cards: ${bad.splice(-10).join('; ')}`
    if (bad.length)
      msg += `; and ${bad.length} more`
    throw Error(msg)
  }

  cube.list = list
}

var util = module.exports = {
  deck(deck, pool) {
    pool = _.count(pool, 'name')

    for (var zoneName in deck) {
      var zone = deck[zoneName]
      for (var cardName in zone) {
        if (typeof zone[cardName] !== 'number')
          return
        if (BASICS.indexOf(cardName) > -1)
          continue
        if (!(cardName in pool))
          return
        pool[cardName] -= zone[cardName]
        if (pool[cardName] < 0)
          return
      }
    }

    return true
  },
  game({seats, type, sets, cube}) {
    assert(typeof seats === 'number', 'typeof seats')
    assert(2 <= seats && seats <= 100, 'seats range')
    assert(['draft', 'sealed', 'cube draft', 'cube sealed', 'chaos'].indexOf(type) > -1,
      'indexOf type')

    if (/cube/.test(type))
      transform(cube, seats, type)
    //remove the below check for now to allow Random sets
    //TODO add if check for Random set
    //else
    //  sets.forEach(set => assert(set in Sets, `${set} in Sets`))
  }
}
