var fs = require('fs')
var fetch = require('node-fetch')
var {Cards} = require('../data')

var URL = 'https://aeos.cloudant.com/draft/_design/draft/_view/score?group=true'

fetch(URL)
.then(res => {
  if (res.ok)
    return res.json()
  throw Error('not ok')
})
.then(data => {
  for (var row of data.rows) {
    var {key, value} = row
    var lc = key.toLowerCase()
    // TODO scrub the db
    if (!(lc in Cards))
      continue

    Cards[lc].score = value.sum / value.count
  }

  fs.writeFileSync('data/cards.json', JSON.stringify(Cards, null, 2))
})
.catch(console.log)
