# Create game
**Intent:** Create a draft room

**Method**: POST

**Path:** /api/games

Takes in draft parameters, as  **JSON**, all of the following parameters are expected in the request body, except the `gameId` and `secret` which need to be in the request parameters.

## Parameters (Body)

| Parameter | Type    | Example  |
|:---------:|:-------:|:--------:|
| title     | string  | myTitle  |
| seats     | int     | 8        |
| sets      | array   | ["XLN","XLN","XLN"] |
| type      | string  | "draft", "sealed", "cube sealed", "cube draft", "chaos" |
| cube      | object  | {"list": "card1\ncard2\ncard3", "cards": 15, "packs": 3 |
| isPrivate | boolean | true     |
| fourPack  | boolean | true     |
| modernOnly| boolean | true     |
| totalChaos| boolean | true     |

If type is `cube draft` or `cube sealed`, the variable `cube` must have 3 attributes:

- `list` is the list of all cards, joined with `\n`
- `cards` is the number of cards per pack
- `packs` is the number of packs per player

```
⚠️ Not yet implemented: webhook[string]
```

## Returns

**Type:** JSON

| Attribute | Type    | Example   | Info         |
|:---------:|:-------:|:---------:|:------------:|
| gamePath  | string  | #g/t7fazj | path to game |
| gameId    | string  | t7fazj    | id of game   |
| secret    | string  | 3020a726-b9f0-4e5d-9ea6-beefa43016b5 | random key used for further API calls |



# Get game status
**Intent:** Check the status of the draft, which players are ready and which are not

**Method:** GET

**Path:** /api/games/:**gameId**/status?secret=:**secret**

## Parameters (Params)
**gameId:** `<id of game>`[string]

**secret:** `<secret of the game>`[string]

## Returns

**Type:** JSON

| Attribute    | Type    | Example | Info        |
|:------------:|:-------:|:-------:|:-----------:|
| didGameStart | boolean | true    | true if the game started |
| currentPack  | int     | 1       | pack number (0 when not started) |
| players      | array   | ["dr4fter","dr4fter2"] | list of players in the game |

Each player has several attributes.

| Attribute     | Type    | Example    | Info         |
|:-------------:|:-------:|:----------:|:------------:|
|playerName     | string  | dr4fter    | the player name |
|id             | string  | fj0ryrept4 | the player Id |
|isReadyToStart | boolean | true       | shows if the player started |
|seatNumber     | int     | 0          | from 0 (0 means the first player) |

The `playerId` is important as two players could share the same name.

### Sample

```javascript
{
    "didGameStart": true,
    "currentPack": 1,
    "players": [
        {
            "playerName": "dr4fter",
            "id": "fj0ryrept4",
            "isReadyToStart": true,
            "seatNumber": 0
        }
    ]
}
```



# Start a Game
**Intent:** Start the draft

**Method:** POST

**Path:** /api/games/**:gameId**/start?secret=**:secret**

## Parameters (Params)
**gameId:** `<id of game>`[string]

**secret:** `<secret of the game>`[string]

## Parameters (Body)

| Parameter     | Type    | Example   |
|:-------------:|:-------:|:---------:|
| addBots       | boolean | true      |
| useTimer      | boolean | true      |
| timer         | string  | "Fast", "Moderate", "Slow", or "Leisurely" |
| shufflePlayers| boolean | false     |

`timer` is mandatory only if `useTimer` is set to _true_.

## Returns

**Type:** JSON

| Attribute  | Type    | Example | Info      |
|:----------:|:-------:|:-------:|:---------:|
| message    | string  | Game pucip3cvv8 successfully started | "pucip3cvv8" is the `gameID` |
| bots       | int     | 7       | number of bots in the game |


### Sample
```javascript
{
    "message": "Game pucip3cvv8 successfully started",
    "bots": 7
}
```

Sends a 400 with parameters' errors if some parameters were wrong.



# Get decklist(s)
**Intent:** Gets decklists at end of draft

**Method:** GET

**Path:** /api/games/**:gameId**/deck?secret=**:secret**&seat=**:seat**&id=**:playerId**

## Parameters(Params)
**gameId:** `<id of game>`[string]

**secret:** `<secret of the game>`[string]

**seat:** `<seat number>`[int]

**id:** `<playerId>`[string]

## Returns

If no `seat`/`id` has been provided, returns an array with all players of the game.

Type: **JSON**

| Attribute  | Type   | Example | Info        |
|:----------:|:------:|:-------:|:-----------:|
| seatNumber | int    | 0       | number of seat |
| playerName | string | dr4fter | "bot" or "player name" |
| playerId   | string | 1       | Id of player |
| pool       | array  | ["Cancel","Grizzly Bears"]     | array of `<cards>` |

Each card has several attributes and the array is classified by pick order.

### Sample
```javascript
[
    {
        "seatNumber": 0,
        "playerName": "bot"
    },
    {
        "seatNumber": 1,
        "playerName": "dr4fter",
        "id": "fj0ryrept4",
        "pool": ["Imperial Aerosaur","Imperial Aerosaur","Imperial Aerosaur"]
    }
]
