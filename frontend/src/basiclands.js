/* The below script can be used to generate a different set of lands
 * The data used here is for MTGO + MTGA exports, which prefer to know extra details beyond card name.
 *
 * ## Use
 * 1. uncomment below lines
 * 2. change the "set" code (keeping in mind must be > Ixalan for Arena)
 * 3. run $ node frontend/src/basiclands.js
 * 4. copy the output in to replace the current lands
 */

// const { getCardByName } = require('../../backend/data')
// const set = 'm20' // must be lower case
// const lands = {
//   W: getCardByName(`plains (${set})`),
//   U: getCardByName(`island (${set})`),
//   B: getCardByName(`swamp (${set})`),
//   R: getCardByName(`mountain (${set})`),
//   G: getCardByName(`forest (${set})`)
// }

// console.log(JSON.stringify(lands, null, 2))

export default {
  "W": {
    "uuid": "4fefe700-3104-50e8-812e-2e305bc8813d",
    "name": "Plains",
    "color": "Colorless",
    "colors": [],
    "colorIdentity": [
      "W"
    ],
    "setCode": "M20",
    "cmc": 0,
    "number": "261",
    "type": "Land",
    "manaCost": "",
    "rarity": "Basic",
    "url": "https://api.scryfall.com/cards/73fb4a34-c11e-45e9-a986-43c0a0ae5424?format=image",
    "identifiers": {
      "scryfallId": "73fb4a34-c11e-45e9-a986-43c0a0ae5424",
      "mtgoId": "73421"
    },
    "layout": "normal",
    "isDoubleFaced": false,
    "flippedCardURL": "",
    "flippedIsBack": false,
    "flippedNumber": "",
    "supertypes": [
      "Basic"
    ],
    "subtypes": [
      "Plains"
    ],
    "text": "({T}: Add {W}.)"
  },
  "U": {
    "uuid": "db340b60-f2fb-5a74-9cc3-cc8cc33b9374",
    "name": "Island",
    "color": "Colorless",
    "colors": [],
    "colorIdentity": [
      "U"
    ],
    "setCode": "M20",
    "cmc": 0,
    "number": "265",
    "type": "Land",
    "manaCost": "",
    "rarity": "Basic",
    "url": "https://api.scryfall.com/cards/fe7f4393-38f9-43b5-873b-58246183b874?format=image",
    "identifiers": {
      "scryfallId": "fe7f4393-38f9-43b5-873b-58246183b874",
      "mtgoId": "73429"
    },
    "layout": "normal",
    "isDoubleFaced": false,
    "flippedCardURL": "",
    "flippedIsBack": false,
    "flippedNumber": "",
    "supertypes": [
      "Basic"
    ],
    "subtypes": [
      "Island"
    ],
    "text": "({T}: Add {U}.)"
  },
  "B": {
    "uuid": "328ba861-c227-521a-aff4-f93a86e6db06",
    "name": "Swamp",
    "color": "Colorless",
    "colors": [],
    "colorIdentity": [
      "B"
    ],
    "setCode": "M20",
    "cmc": 0,
    "number": "269",
    "type": "Land",
    "manaCost": "",
    "rarity": "Basic",
    "url": "https://api.scryfall.com/cards/184a196e-8604-49d2-a66a-6f7c0eafd5de?format=image",
    "identifiers": {
      "scryfallId": "184a196e-8604-49d2-a66a-6f7c0eafd5de",
      "mtgoId": "73437"
    },
    "layout": "normal",
    "isDoubleFaced": false,
    "flippedCardURL": "",
    "flippedIsBack": false,
    "flippedNumber": "",
    "supertypes": [
      "Basic"
    ],
    "subtypes": [
      "Swamp"
    ],
    "text": "({T}: Add {B}.)"
  },
  "R": {
    "uuid": "4066857f-e1f2-5095-9a60-ec713874fc20",
    "name": "Mountain",
    "color": "Colorless",
    "colors": [],
    "colorIdentity": [
      "R"
    ],
    "setCode": "M20",
    "cmc": 0,
    "number": "273",
    "type": "Land",
    "manaCost": "",
    "rarity": "Basic",
    "url": "https://api.scryfall.com/cards/399f7531-e137-463b-bec3-e86756b6ed71?format=image",
    "identifiers": {
      "scryfallId": "399f7531-e137-463b-bec3-e86756b6ed71",
      "mtgoId": "73445"
    },
    "layout": "normal",
    "isDoubleFaced": false,
    "flippedCardURL": "",
    "flippedIsBack": false,
    "flippedNumber": "",
    "supertypes": [
      "Basic"
    ],
    "subtypes": [
      "Mountain"
    ],
    "text": "({T}: Add {R}.)"
  },
  "G": {
    "uuid": "c4198bae-2c2b-51bc-8d57-5b9640232e6e",
    "name": "Forest",
    "color": "Colorless",
    "colors": [],
    "colorIdentity": [
      "G"
    ],
    "setCode": "M20",
    "cmc": 0,
    "number": "277",
    "type": "Land",
    "manaCost": "",
    "rarity": "Basic",
    "url": "https://api.scryfall.com/cards/42352899-f2f2-4dea-863b-8d685e63b454?format=image",
    "identifiers": {
      "scryfallId": "42352899-f2f2-4dea-863b-8d685e63b454",
      "mtgoId": "73453"
    },
    "layout": "normal",
    "isDoubleFaced": false,
    "flippedCardURL": "",
    "flippedIsBack": false,
    "flippedNumber": "",
    "supertypes": [
      "Basic"
    ],
    "subtypes": [
      "Forest"
    ],
    "text": "({T}: Add {G}.)"
  }
};
