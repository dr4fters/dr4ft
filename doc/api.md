# Create game
_Intent: Create a draft room_
Method: POST
Path: /api/games

Takes in draft parameters, as  **JSON**, all of the following parameters are expected in the request body, except the gameId and secret which need to be in the request params.

## Parameters(Body)

| Parameter | Type    | Sample   |
|:-------:|:------:|:-------:|
| title     | string  | myTitle  |
| seats     | int     | 8        |
| sets     | array     | ["XLN","XLN","XLN"]        |
| type      | string  | "draft", "sealed", "cube sealed", "cube draft", "chaos"  |
| cube      | object | {"list": "card1\ncard2\ncard3", "cards": 15, "packs": 3     |
| isPrivate | boolean | true     |
| fourPack  | boolean | true     |
| modernOnly| boolean | true     |
| totalChaos| boolean | true     |

If type is "cube draft" or "cube sealed", the variable "cube" must have 3 attributes:
"list" is the list of all cards, joined with "\n"
"cards" is the number of cards per pack
"packs" is the number of packs per player

_webhook[string]_, not implemented yet

## Returns

Type: **JSON**

| Attribute | Type    | Sample    |      Info       |
|:-------:|:-------:|:--------:|:-----------:|
| gamePath  | string  | #g/t7fazj | path to game|
| gameId    | string  | t7fazj    | id of game  |
| secret    | string  | 3020a726-b9f0-4e5d-9ea6-beefa43016b5 | random key used for further api calls |

# Get game status
_Intent: Check the status of the draft, which players are ready, and which are not._
Method: GET
Path: /api/games/:gameId/status?secret=:secret


## Parameters(Params)
gameId: `<id of game>`[string]
secret: `<secret of the game>`[string]

## Returns

Type: **JSON**

| Attribute    | Type    | Sample |  Info           |
|:----------:|:-------:|:-----:|:-----------:|
| didGameStart | boolean | true   | true if the game started|
| currentPack  | int     | 1      | pack number. 0 when not started  |
| players      | Array   | []     | List of players in the game |

Each player has several attributes

| Attribute     | Type    | Sample   |     Info        |
|:-----------:|:-------:|:-------:|:-----------:|
|playerName     | string  | dr4fter  | the player name|
|id             | string  |fj0ryrept4| the player Id|
|isReadyToStart | boolean | true     | shows if the player started|
|seatNumber     | int     | 0        | from 0, 0 means the first player|

The playerId is important as two players could share the same name.

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
_Intent: Start the draft_
Method: POST
Path: /api/games/:gameId/start?secret=:secret

## Parameters(Params)
gameId: `<id of game>`[string]
secret: `<secret of the game>`[string]

## Parameters(Body)

| Parameter     | type    | sample   |
|:-----------:|:-------:|:-------:|
| addBots       | boolean | true     |
| useTimer      | boolean | true     |
| timer         | string  | "Fast", "Moderate", "Slow", or "Leisurely"  |
| shufflePlayers| boolean | false    |

**timer** is mandatory only if **useTimer** is set to _true_

## Returns

Type: **JSON**

Message: "Game _gameId_ successfully started
bots: Number of bots created in the game

### Sample
```javascript
{
    "message": "Game pucip3cvv8 successfully started",
    "bots": 7
}
```

sends a 400 with parameters' errors if some parameters were wrong

# Get decklist(s)
_Intent: Gets decklists at end of draft_
Method: GET
Path: /api/games/:gameId/deck?secret=:secret&seat=:seat&id=:playerId

## Parameters(Params)
gameId: `<id of game>`[string]
secret: `<secret of the game>`[string]
seat: `<seat number>`[int]
id: `<playerId>`[string]

## Returns

If no seat/id has been provided, returns an array with all players of the game

Type: **JSON**

| Attribute  | type   | sample |             |
|:--------:|:------:|:-----:|:-----------:|
| seatNumber | int    | 0      | seat Number|
| playerName | string | dr4fter| "bot" or "player name"  |
| playerId   | string | 1      | player Id |
| pool       | array  | 1      | array of `<cards>`  |

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
