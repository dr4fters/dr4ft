# design

## server

_: generic js utilities

bot: class

data: wrapper around the data folder

game: class

hash: create cockatrice/mws deck hashes

human: class

pool: generates the cardpool for a specific game

room: base class for game room. used as the lobby

router: accepts new sockets, routes players into rooms (lobby or game)

sock: socket wrapper

util: validates game options, decklist for hashing

## client

components: ui

app: utility, default options

cards: logic

data: set codes and names

init: traceur cannot into circular dependencies

router: does routing
