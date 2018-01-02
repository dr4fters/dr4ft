var fs = require('fs')
var _ = require('../_')
var raw = require('../../data/AllSets')

var COLORS = {
  W: 'White',
  U: 'Blue',
  B: 'Black',
  R: 'Red',
  G: 'Green'
}

var Cards = {}
var Sets = {}

before()

var types = ['core', 'expansion', 'commander', 'planechase', 'starter', 'un']
var codes = ['EMA', 'MMA', 'VMA', 'CNS', 'TPR', 'MM2', 'EXP', 'MPS', 'CN2', 'MM3', 'MPS_AKH', "IMA"]
for (var code in raw) {
  var set = raw[code]
  if (types.indexOf(set.type) > -1
    || codes.indexOf(code) > -1)
    doSet(set, code)
}

after()

fs.writeFileSync('data/cards.json', JSON.stringify(Cards, null, 2))
fs.writeFileSync('data/sets.json', JSON.stringify(Sets, null, 2))

function before() {
  raw.UGL.cards = raw.UGL.cards.filter(x => x.layout !== 'token')

  for (card of raw.TSB.cards)
	card.rarity = 'special'
  
  raw.TSP.cards = raw.TSP.cards.concat(raw.TSB.cards)

  // Add set codes here to have them removed 
  for (var removeSet of ['TSB','ITP','CP1','CP2','CP3']) {
	  if (raw[removeSet]) {
	    delete raw[removeSet]
    }
	  else {
	    console.log("Set " + removeSet + " would be removed but not found in MTGJSON. (in make/cards)")
    }	  
  }	
  raw.PLC.booster = Array(11).fill('common')
  raw.FUT.booster = Array(11).fill('common')

  ;['BFZ', 'OGW'].forEach(setName => {
    for (card of raw[setName].cards)
      if (card.text && card.text.startsWith('Devoid'))
        card.colors = card.manaCost
          .replace(/[\d{}]/g, '')
          .replace(/(.)\1+/g, '$1')
          .split('')
          .map(c => COLORS[c])
  })

  var card
  for (card of raw.EMN.cards)
    if (card.layout === 'double-faced' || card.layout === 'meld')
      card.rarity = 'special'
  for (card of raw.SOI.cards)
    if (card.layout === 'double-faced')
      card.rarity = 'special'
  for (card of raw.ISD.cards)
    if (card.layout === 'double-faced')
      card.rarity = 'special'
  for (card of raw.DGM.cards)
    if (/Guildgate/.test(card.name))
      card.rarity = 'special'
  for (card of raw.CNS.cards)
    if ((card.type === 'Conspiracy')
      || /draft/.test(card.text))
      card.rarity = 'special'
  for (card of raw.FRF.cards)
    if (card.types[0] === 'Land'
      && (card.name !== 'Crucible of the Spirit Dragon'))
      card.rarity = 'special'

  //http://mtgsalvation.gamepedia.com/Magic_2015/Sample_decks
  // Each sample deck has several cards numbered 270 and higher that do not
  // appear in Magic 2015 booster packs.
  raw.M15.cards = raw.M15.cards.filter(x => parseInt(x.number) < 270)
  raw.ORI.cards = raw.ORI.cards.filter(x => parseInt(x.number) < 273)
  //raw.KLD.cards = raw.KLD.cards.filter(x => parseInt(x.number) < 265)

  raw.OGW.cards.find(x => x.name === 'Wastes').rarity = 'Common'
}

function after() {
  var masterpiecelist = {
    "BFZ": {
      "cards": ["prairie stream","sunken hollow","smoldering marsh","cinder glade","canopy vista","hallowed fountain","watery grave","blood crypt","stomping ground","temple garden","godless shrine","steam vents","overgrown tomb","sacred foundry","breeding pool","flooded strand","polluted delta","bloodstained mire","wooded foothills","windswept heath","marsh flats","scalding tarn","verdant catacombs","arid mesa","misty rainforest"],
      "code": "EXP"
    },
    "OGW": {
      "cards": ["mystic gate","sunken ruins","graven cairns","fire-lit thicket","wooded bastion","fetid heath","cascade bluffs","twilight mire","rugged prairie","flooded grove","ancient tomb","dust bowl","eye of ugin","forbidden orchard","horizon canopy","kor haven","mana confluence","strip mine","tectonic edge","wasteland"],
      "code": "EXP"
    },
    "KLD": {
      "cards": ['cataclysmic gearhulk', 'torrential gearhulk', 'noxious gearhulk', 'combustible gearhulk', 'verdurous gearhulk', 'aether vial', "champion's helm", 'chromatic lantern', 'chrome mox', 'cloudstone curio', 'crucible of worlds', 'gauntlet of power', 'hangarback walker', 'lightning greaves', 'lotus petal', 'mana crypt', 'mana vault', "mind's eye", 'mox opal', "painter's servant", 'rings of brighthearth', 'scroll rack', 'sculpting steel', 'sol ring', 'solemn simulacrum', 'static orb', 'steel overseer', 'sword of feast and famine', 'sword of fire and ice', 'sword of light and shadow'],
      "code": "MPS"
    },
    "AER": {
      "cards": ["Paradox Engine","Planar Bridge","Arcbound Ravager","Black Vise","Chalice of the Void","Defense Grid","Duplicant","Engineered Explosives","Ensnaring Bridge","Extraplanar Lens","Grindstone","Meekstone","Oblivion Stone","Ornithopter","Sphere of Resistance","Staff of Domination","Sundering Titan","Sword of Body and Mind","Sword of War and Peace","Trinisphere","Vedalken Shackles","Wurmcoil Engine"],
      "code": "MPS"
    },
    "AKH": {
      "cards": ["Austere Command","Aven Mindcensor","Containment Priest","Loyal Retainers","Worship","Wrath of God","Consecrated Sphinx","Counterbalance","Counterspell","Cryptic Command","Daze","Divert","Force of Will","Pact of Negation","Spell Pierce","Stifle","Attrition","Dark Ritual","Diabolic Intent","Entomb","Mind Twist","Aggravated Assault","Chain Lightning","Maelstrom Pulse","Vindicate","Hazoret the Fervent","Kefnet the Mindful","Oketra the True","Bontu the Glorified","Rhonas the Indomitable"],
      "code": "MPS_AKH"
    },
    "HOU": {
      "cards": ["Armageddon","Capsize","Forbid","Omniscience","Opposition","Sunder","Threads of Disloyalty","Avatar of Woe","Damnation","Desolation Angel","Diabolic Edict","Doomsday","No Mercy","Slaughter Pact","Thoughtseize","Blood Moon","Boil","Shatterstorm","Through the Breach","Choke","The Locust God","Lord of Extinction","The Scarab God","The Scorpion God"],
      "code": "MPS_AKH"
    }
  }
  for (var masterset in masterpiecelist) {
    if (Sets[masterset]['special']) {
      Sets[masterset]['special']['masterpieces'] = []
      //masterpiecelist[masterset]['cards']
    } else {
      Sets[masterset]['special'] = {
        "masterpieces": []
      }
      for (var mpindex in masterpiecelist[masterset]['cards']) {
        Sets[masterset]['special']['masterpieces'].push(masterpiecelist[masterset]['cards'][mpindex].toLowerCase())
      }
    }
    var mastercards = masterpiecelist[masterset]['cards']
  }
  var {EMN} = Sets
  EMN.special = {
    "mythic":[
      "gisela, the broken blade",
      "ulrich of the krallenhorde"
    ],
    "rare":[
      "voldaren pariah",
      "docent of perfection",
      "bruna, the fading light",
      "hanweir garrison",
      "hanweir battlements"
    ],
    "common":[
      "ulvenwald captive",
      "vildin-pack outcast",
      "midnight scavengers",
      "graf rats"
    ],
    "uncommon":[
      "tangleclaw werewolf",
      "shrill howler",
      "conduit of storms",
      "extricator of sin",
      "kessig prowler",
      "smoldering werewolf",
      "curious homunculus",
      "grizzled angler",
      "lone rider",
      "cryptolith fragment"
    ]
  }
  EMN.size = 8
  var {SOI} = Sets
  SOI.special = {
    "mythic": [
      "archangel avacyn",
      "startled awake",
      "arlinn kord"
    ],
    "rare": [
      "hanweir militia captain",
      "elusive tormentor",
      "thing in the ice",
      "geier reach bandit",
      "sage of ancient lore",
      "westvale abbey"
    ],
    "uncommon": [
      "avacynian missionaries",
      "pious evangel",
      "town gossipmonger",
      "aberrant researcher",
      "daring sleuth",
      "uninvited geist",
      "accursed witch",
      "heir of falkenrath",
      "kindly stranger",
      "breakneck rider",
      "convicted killer",
      "skin invasion",
      "village messenger",
      "autumnal gloom",
      "duskwatch recruiter",
      "hermit of the natterknolls",
      "lambholt pacifist",
      "harvest hand",
      "neglected heirloom",
      "thraben gargoyle"
    ],
    "common": [
      "convicted killer",
      "gatstaf arsonists",
      "hinterland logger",
      "solitary hunter"
    ]
  }
  SOI.size = 8
  var {ISD} = Sets
  ISD.special = {
    mythic: [
        'garruk relentless'
    ],
    rare: [
        'bloodline keeper',
        'daybreak ranger',
        'instigator gang',
        'kruin outlaw',
        'ludevic\'s test subject',
        'mayor of avabruck'
    ],
    uncommon: [
        'civilized scholar',
        'cloistered youth',
        'gatstaf shepherd',
        'hanweir watchkeep',
        'reckless waif',
        'screeching bat',
        'ulvenwald mystics'
    ],
    common: [
        'delver of secrets',
        'grizzled outcasts',
        'thraben sentry',
        'tormented pariah',
        'village ironsmith',
        'villagers of estwald'
    ]
  }
  var {DKA} = Sets
  DKA.special = {
    mythic: [
      'elbrus, the binding blade',
      'huntmaster of the fells'
    ],
    rare: [
      'mondronen shaman',
      'ravenous demon'
    ],
    uncommon: [
      'afflicted deserter',
      'chalice of life',
      'lambholt elder',
      'soul seizer'
    ],
    common: [
      'chosen of markov',
      'hinterland hermit',
      'loyal cathar',
      'scorned villager'
    ]
  }
  var {DGM} = Sets
  DGM.mythic.splice(DGM.mythic.indexOf("maze's end"), 1)
  DGM.special = {
    gate: DGM.special,
    shock: [
      'blood crypt',
      'breeding pool',
      'godless shrine',
      'hallowed fountain',
      'overgrown tomb',
      'sacred foundry',
      'steam vents',
      'stomping ground',
      'temple garden',
      'watery grave',
      'maze\'s end'
    ]
  }
  alias(DGM.special.shock, 'DGM')

  var {FRF} = Sets
  for (let card of FRF.special)
    Cards[card].sets.FRF.rarity = / /.test(card) ? 'common' : 'basic'
  FRF.special = {
    common: FRF.special,
    fetch: [
      'flooded strand',
      'bloodstained mire',
      'wooded foothills',
      'windswept heath',
      'polluted delta',
    ]
  }
  alias(FRF.special.fetch, 'FRF')

  /* this got moved to removeBonusCards function
  var KLDRaw = raw.KLD.cards
  var {KLD} = Sets
  for (let cardindex in KLDRaw) {
    card = KLDRaw[cardindex]
    if (card.number > 264) {
      for (var rarity of ['common', 'uncommon', 'rare', 'mythic']) {
        if (KLD[rarity].indexOf(card.name.toLowerCase()) > -1) {
          KLD[rarity].splice(KLD[rarity].indexOf(card.name.toLowerCase()), 1)
        }
      }
    }
  }*/

  // if a card has cards that don't appear in boosters over a certain card #
  // send them to removeBonusCards with their set code and the highest numbered booster card
  removeBonusCards("KLD", 264)
  removeBonusCards("AER", 184)
  removeBonusCards("AKH", 269)
  removeBonusCards("HOU", 199)
  removeBonusCards("XLN", 279)

  Sets.OGW.common.push('wastes')// wastes are twice as common
}

function removeBonusCards(setCode, maxNumber) {
  // some sets contain unique cards that aren't in boosters
  // ex: KLD planeswalker decks have cards numbered > 264 that are not in boosters
  // setCode is 3 letter set code
  // maxNumber is the highest number of a main set card
  var setRaw = raw[setCode].cards
  //var {setCode} = Sets
  for (let cardindex in setRaw) {
    var card = setRaw[cardindex]
    if (card.number > maxNumber) {
      for (var rarity of ['common', 'uncommon', 'rare', 'mythic']) {
        if (Sets[setCode][rarity].indexOf(card.name.toLowerCase()) > -1) {
          Sets[setCode][rarity].splice(Sets[setCode][rarity].indexOf(card.name.toLowerCase()), 1)
        }
      }
    }
  }
}

function alias(arr, code) {
  // some boosters contain reprints which are not in the set proper
  for (var cardName of arr) {
    var {sets} = Cards[cardName]
    var codes = Object.keys(sets)
    var last = codes[codes.length - 1]
    sets[code] = sets[last]
  }
}

function doSet(rawSet, code) {
  var cards = {}
  var set = {
    common: [],
    uncommon: [],
    rare: [],
    mythic: [],
    special: [],
  }
  var card

  for (card of rawSet.cards)
    doCard(card, cards, code, set)

  //because of split cards, do this only after processing the entire set
  for (var cardName in cards) {
    card = cards[cardName]
    var lc = cardName.toLowerCase()

    if (lc in Cards)
      Cards[lc].sets[code] = card.sets[code]
    else
      Cards[lc] = card

    //Taking care of DoubleFaced Cards URL
    if(card.isDoubleFaced) {
      rawSet.cards.some(x=> {
        if(x.name == card.names[1]) {
          card.flippedCardURL=`http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${x.multiverseid}&type=card`
          return true
        }
      })
    }
  }
  
  if (!rawSet.booster)
    return

  for (var rarity of ['mythic', 'special'])
    if (!set[rarity].length)
      delete set[rarity]

  set.size = rawSet.booster.filter(x => x === 'common').length
  Sets[code] = set
}

function doCard(rawCard, cards, code, set) {
  var rarity = rawCard.rarity.split(' ')[0].toLowerCase()
  if (rarity === 'basic')
    if (/snow-covered/.test(rawCard.name.toLowerCase()))
      rarity = 'special'
    else
      return

  var {name} = rawCard
  if (['double-faced', 'flip'].indexOf(rawCard.layout) > -1
    && rawCard.number.indexOf('b') > -1)
    return

  if (rawCard.layout === 'split' || rawCard.layout === 'aftermath')
    name = rawCard.names.join(' // ')

  name = _.ascii(name)

  if (name in cards) {
    if (rawCard.layout === 'split') {
      var card = cards[name]
      card.cmc += rawCard.cmc
      if (card.color !== rawCard.color)
        card.color = 'multicolor'
    }
    return
  }

  var {colors} = rawCard
  var color = !colors ? 'colorless' :
    colors.length > 1 ? 'multicolor' :
    colors[0].toLowerCase()

  var picUrl = rawCard.url || `http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${rawCard.multiverseid}&type=card`
  //console.log(rawCard.name + rawCard.types)
  cards[name] = { color, name,
    type: rawCard.types[rawCard.types.length - 1],
    cmc: rawCard.cmc || 0,
    text: rawCard.text || '',
    manaCost: rawCard.manaCost || '',
    sets: {
      [code]: { rarity,
        url: picUrl
      }
    },
    layout: rawCard.layout,
    isDoubleFaced: rawCard.layout == "double-faced",
    names: rawCard.names
  }

  set[rarity].push(name.toLowerCase())
}
