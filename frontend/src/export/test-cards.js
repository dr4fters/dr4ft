import {ZONE_MAIN, ZONE_SIDEBOARD} from "../zones";

// Multi-facetted layout | Example card
// ----------------------|---------------------------------
// split                 | Dead // Gone
// split (fuse)          | Catch // Release
// split (unhinged)      | Who // What // When // Where // Why

const splitCards = [
  {
    "uuid": "bea0e066-b932-546f-ae6d-7c311e395bf8",
    "name": "Dead // Gone",
    "faceName": "Dead",
    "otherFaceIds": [
      "38face9b-00dc-555b-b88b-f62d19f5eab9"
    ],
    "color": "Red",
    "colors": [
      "R"
    ],
    "colorIdentity": [
      "R"
    ],
    "setCode": "PLC",
    "cmc": 4,
    "number": "113",
    "type": "Instant",
    "manaCost": "{R}",
    "rarity": "Common",
    "url": "https://api.scryfall.com/cards/96fd8d8e-8f2a-4240-bcb7-18f73fd47bd5?format=image",
    "identifiers": {
      "scryfallId": "96fd8d8e-8f2a-4240-bcb7-18f73fd47bd5",
      "mtgoId": "26517"
    },
    "layout": "split",
    "isDoubleFaced": false,
    "flippedCardURL": "",
    "flippedIsBack": false,
    "flippedNumber": "",
    "supertypes": [],
    "subtypes": [],
    "text": "Dead deals 2 damage to target creature.",
    "cardId": "2e00f448-6522-11eb-a1e1-f9319a861858"
  },
  {
    "uuid": "ed55a9ee-f1bb-5178-9259-3160b7c65c83",
    "name": "Catch // Release",
    "faceName": "Catch",
    "otherFaceIds": [
      "44a70943-7e2e-5c3b-9453-5a085dced28f"
    ],
    "color": "Multicolor",
    "colors": [
      "U",
      "R"
    ],
    "colorIdentity": [
      "R",
      "U",
      "W"
    ],
    "setCode": "DGM",
    "cmc": 9,
    "number": "125",
    "type": "Sorcery",
    "manaCost": "{1}{U}{R}",
    "rarity": "Rare",
    "url": "https://api.scryfall.com/cards/29968873-56f3-4528-ab0b-f11dd67dd162?format=image",
    "identifiers": {
      "scryfallId": "29968873-56f3-4528-ab0b-f11dd67dd162",
      "mtgoId": "48512"
    },
    "layout": "split",
    "isDoubleFaced": false,
    "flippedCardURL": "",
    "flippedIsBack": false,
    "flippedNumber": "",
    "supertypes": [],
    "subtypes": [],
    "text": "Gain control of target permanent until end of turn. Untap it. It gains haste until end of turn.\nFuse (You may cast one or both halves of this card from your hand.)",
    "cardId": "2e00f440-6522-11eb-a1e1-f9319a861858"
  },
  {
    "uuid": "6eba118a-91ac-5734-a776-0fba67684a42",
    "name": "Who // What // When // Where // Why",
    "faceName": "Who",
    "otherFaceIds": [
      "035da06a-c4fe-54c2-946d-66cd0481fa12",
      "823b9f86-5d85-55bf-96a3-bab429a852aa",
      "e1b00e53-7b48-5bc6-842a-66839f08ca7d",
      "5b138950-4f9a-56e0-a614-5d1627471b4e"
    ],
    "color": "Multicolor",
    "colors": [
      "W"
    ],
    "colorIdentity": [
      "B",
      "G",
      "R",
      "U",
      "W"
    ],
    "setCode": "UND",
    "cmc": 13,
    "number": "75",
    "type": "Instant",
    "manaCost": "{X}{W}",
    "rarity": "Rare",
    "url": "https://api.scryfall.com/cards/fea4a077-718b-44af-87be-90df61aab643?format=image",
    "identifiers": {
      "scryfallId": "fea4a077-718b-44af-87be-90df61aab643"
    },
    "layout": "split",
    "isDoubleFaced": false,
    "flippedCardURL": "",
    "flippedIsBack": false,
    "flippedNumber": "",
    "supertypes": [],
    "subtypes": [],
    "text": "Target player gains X life.",
    "cardId": "2e00f45a-6522-11eb-a1e1-f9319a861858"
  }
];

// Multi-facetted layout | Example card
// ----------------------|---------------------------------
// flip                  | Nezumi Shortfang

const flipCards = [
  {
    "uuid": "a888a494-31c0-592a-bc4a-b4a9c9181ce6",
    "name": "Nezumi Shortfang // Stabwhisker the Odious",
    "faceName": "Nezumi Shortfang",
    "otherFaceIds": [
      "996c7cc2-9201-5f7c-ba67-f62158d6bcb8"
    ],
    "color": "Black",
    "colors": [
      "B"
    ],
    "colorIdentity": [
      "B"
    ],
    "setCode": "CHK",
    "cmc": 2,
    "number": "131",
    "type": "Creature",
    "manaCost": "{1}{B}",
    "rarity": "Rare",
    "url": "https://api.scryfall.com/cards/c8265c39-d287-4c5a-baba-f2f09dd80a1c?format=image",
    "identifiers": {
      "scryfallId": "c8265c39-d287-4c5a-baba-f2f09dd80a1c",
      "mtgoId": "21213"
    },
    "layout": "flip",
    "isDoubleFaced": true,
    "flippedCardURL": "https://api.scryfall.com/cards/c8265c39-d287-4c5a-baba-f2f09dd80a1c?format=image",
    "flippedIsBack": false,
    "flippedNumber": "",
    "supertypes": [],
    "subtypes": [
      "Rat",
      "Rogue"
    ],
    "power": "1",
    "toughness": "1",
    "text": "{1}{B}, {T}: Target opponent discards a card. Then if that player has no cards in hand, flip Nezumi Shortfang.",
    "cardId": "333eb36b-6523-11eb-a1e1-f9319a861858"
  }
];

// Multi-facetted layout | Example card
// ----------------------|---------------------------------
// transform             | Kessig Prowler

const transformCards = [
  {
    "uuid": "dd845d91-fc48-591e-b172-faeafe968345",
    "name": "Kessig Prowler // Sinuous Predator",
    "faceName": "Kessig Prowler",
    "otherFaceIds": [
      "7e6b0af1-c53d-5c00-b076-b288487d9e5f"
    ],
    "color": "Green",
    "colors": [
      "G"
    ],
    "colorIdentity": [
      "G"
    ],
    "setCode": "EMN",
    "cmc": 1,
    "number": "163",
    "type": "Creature",
    "manaCost": "{G}",
    "rarity": "Uncommon",
    "url": "https://api.scryfall.com/cards/f89f116a-1e8e-4ae7-be39-552e4954f229?format=image",
    "identifiers": {
      "scryfallId": "f89f116a-1e8e-4ae7-be39-552e4954f229",
      "mtgoId": "61446"
    },
    "layout": "transform",
    "isDoubleFaced": true,
    "flippedCardURL": "https://api.scryfall.com/cards/f89f116a-1e8e-4ae7-be39-552e4954f229?format=image&face=back",
    "flippedIsBack": true,
    "flippedNumber": "163",
    "supertypes": [],
    "subtypes": [
      "Werewolf",
      "Horror"
    ],
    "power": "2",
    "toughness": "1",
    "text": "{4}{G}: Transform Kessig Prowler.",
    "frameEffects": [
      "mooneldrazidfc"
    ],
    "cardId": "333eb375-6523-11eb-a1e1-f9319a861858"
  }

];

// Multi-facetted layout | Example card
// ----------------------|---------------------------------
// adventure             | urderous Rider

const adventureCards = [
  {
    "uuid": "1583e21a-84a4-5299-b3aa-ab4dec02d2e7",
    "name": "Murderous Rider // Swift End",
    "meld": "Murderous Rider",
    "otherFaceIds": [
      "7d27e18f-6ffa-5328-a13b-dfb41a2f0109"
    ],
    "color": "Black",
    "colors": [
      "B"
    ],
    "colorIdentity": [
      "B"
    ],
    "setCode": "ELD",
    "cmc": 3,
    "number": "97",
    "type": "Creature",
    "manaCost": "{1}{B}{B}",
    "rarity": "Rare",
    "url": "https://api.scryfall.com/cards/e73d8a84-2c0d-423c-89c7-71de0af9e1ac?format=image",
    "identifiers": {
      "scryfallId": "e73d8a84-2c0d-423c-89c7-71de0af9e1ac",
      "mtgoId": "78308"
    },
    "layout": "adventure",
    "isDoubleFaced": false,
    "flippedCardURL": "",
    "flippedIsBack": false,
    "flippedNumber": "",
    "supertypes": [],
    "subtypes": [
      "Zombie",
      "Knight"
    ],
    "power": "2",
    "toughness": "3",
    "text": "Lifelink\nWhen Murderous Rider dies, put it on the bottom of its owner's library.",
    "cardId": "333e8c54-6523-11eb-a1e1-f9319a861858"
  }
];

// Multi-facetted layout | Example card
// ----------------------|---------------------------------
// aftermath             | Refuse // Cooperate

const aftermathCards = [
  {
    uuid: "7e1f20b1-f2bd-52ad-ac39-1e490018d067",
    name: "Refuse // Cooperate",
    faceName: "Refuse",
    otherFaceIds: [
      "5081088f-8d64-5649-857a-7496bbb26294"
    ],
    color: "Multicolor",
    colors: [
      "R"
    ],
    colorIdentity: [
      "R",
      "U"
    ],
    setCode: "HOU",
    cmc: 7,
    number: "156",
    type: "Instant",
    manaCost: "{3}{R}",
    rarity: "Rare",
    url: "https://api.scryfall.com/cards/054b07d8-99ae-430b-8e54-f9601fa572e7?format=image",
    identifiers: {
      scryfallId: "054b07d8-99ae-430b-8e54-f9601fa572e7",
      mtgoId: "64832"
    },
    layout: "aftermath",
    isDoubleFaced: false,
    flippedCardURL: "",
    flippedIsBack: false,
    flippedNumber: "",
    supertypes: [],
    subtypes: [],
    text: "Refuse deals damage to target spell's controller equal to that spell's converted mana cost.",
    cardId: "d35b41a0-6470-11eb-945b-6b958e4caae8"
  }
];

// Multi-facetted layout | Example card
// ----------------------|---------------------------------
// modal_dfc             | Riverglide Pathway

const modalDfcCards = [
  {
    "uuid": "b444c54f-a0fe-5c23-b89a-5ff49adab445",
    "name": "Riverglide Pathway // Lavaglide Pathway",
    "faceName": "Riverglide Pathway",
    "otherFaceIds": [
      "1cb8e283-5796-548c-af19-c44d9ac863e0"
    ],
    "color": "Colorless",
    "colors": [],
    "colorIdentity": [
      "R",
      "U"
    ],
    "setCode": "ZNR",
    "cmc": 0,
    "number": "264",
    "type": "Land",
    "manaCost": "",
    "rarity": "Rare",
    "url": "https://api.scryfall.com/cards/2668ac91-6cda-4f81-a08d-4fc5f9cb35b2?format=image",
    "identifiers": {
      "scryfallId": "2668ac91-6cda-4f81-a08d-4fc5f9cb35b2",
      "mtgoId": "83533"
    },
    "layout": "modal_dfc",
    "isDoubleFaced": true,
    "flippedCardURL": "https://api.scryfall.com/cards/2668ac91-6cda-4f81-a08d-4fc5f9cb35b2?format=image&face=back",
    "flippedIsBack": true,
    "flippedNumber": "264",
    "supertypes": [],
    "subtypes": [],
    "text": "{T}: Add {U}.",
    "cardId": "333e8c50-6523-11eb-a1e1-f9319a861858"
  }
];

// Multi-facetted layout | Example card
// ----------------------|---------------------------------
// meld                  | Graf Rats // Chittering Host

const meldCards = [
  {
    "uuid": "d8483bbd-7271-5fd3-9892-38473dc69f8b",
    "name": "Graf Rats // Chittering Host",
    "faceName": "Graf Rats",
    "otherFaceIds": [
      "3f8cdafb-10d5-510a-b908-49dd4c80fff3"
    ],
    "color": "Black",
    "colors": [
      "B"
    ],
    "colorIdentity": [
      "B"
    ],
    "setCode": "EMN",
    "cmc": 2,
    "number": "91",
    "type": "Creature",
    "manaCost": "{1}{B}",
    "rarity": "Common",
    "url": "https://api.scryfall.com/cards/3dedaff6-bd69-4fe3-a301-f7ea7c2f2861?format=image",
    "identifiers": {
      "scryfallId": "3dedaff6-bd69-4fe3-a301-f7ea7c2f2861",
      "mtgoId": "61168"
    },
    "layout": "meld",
    "isDoubleFaced": true,
    "flippedCardURL": "https://api.scryfall.com/cards/70b94f21-4f01-46f8-ad50-e2bb0b68ea33?format=image",
    "flippedIsBack": false,
    "flippedNumber": "96b",
    "supertypes": [],
    "subtypes": [
      "Rat"
    ],
    "power": "2",
    "toughness": "1",
    "text": "At the beginning of combat on your turn, if you both own and control Graf Rats and a creature named Midnight Scavengers, exile them, then meld them into Chittering Host.",
    "cardId": "e201fcb3-6f2b-11eb-a6ec-db06e7a87e52"
  }
]

export const multiFacettedCards = {
  flipCards,
  transformCards,
  adventureCards,
  aftermathCards,
  modalDfcCards,
  meldCards,
  splitCards
};

const deck = [
  ...flipCards,
  ...transformCards,
  ...adventureCards,
  ...aftermathCards,
  ...modalDfcCards,
  ...meldCards,
  ...splitCards
].reduce((acc, card, i, all) => {
  if (i === 0) acc.main.push(card);

  if (i < all.length - 2) acc.main.push(card);
  else acc.side.push(card);
  return acc;
}, { main: [], side: [] });

export const exampleDeck = {
  [ZONE_MAIN]: collectByName(deck.main),
  [ZONE_SIDEBOARD]: collectByName(deck.side, true)
};

function collectByName (cards, sideboard = false) {
  const collector = cards.reduce((acc, card) => {
    if (acc[card.name]) acc[card.name].count += 1;
    else acc[card.name] = { card, count: 1, sideboard };

    return acc;
  }, {});

  return Object.values(collector);
}
