<p align="center">
  dr<img src="https://raw.githubusercontent.com/dr4fters/dr4ft/master/frontend/4.png" alt="4" height="14">ft
</p>

<p align='center'>
  <a href="https://travis-ci.com/dr4fters/dr4ft"><img src=https://travis-ci.com/dr4fters/dr4ft.svg?branch=master></a>
  <a href="https://david-dm.org/dr4fters/dr4ft"><img src=https://david-dm.org/dr4fters/dr4ft.svg></a>
  <a href="https://david-dm.org/dr4fters/dr4ft?type=dev"><img src=https://david-dm.org/dr4fters/dr4ft/dev-status.svg></a>
</p>



<br>

# dr4ft [![Discord](https://img.shields.io/discord/224178957103136779?label=Discord&logo=discord&logoColor=white&color=7289da)](https://mtgjson.com/discord)

*dr4ft* is a <kbd>NodeJS</kbd> based web-application that simulates draft and sealed format between players and/or bots.
Most of MTG sets are playable thanks to MTGJson support. We follow as much as possible the rules that determine how a real booster is created.

The application provides the following features:

* Draft and sealed format
* Regular, Cube and chaos game types
* Special game modes like "Glimpse Draft"
* 1 to 100 players
* 1 to 12 packs per player
* All playable sets ever printed
* Import your custom set and play it
* In-game chat
* Pick Timer
* Autopick
* Suggest lands
* Kick players
* Connection indicators
* Pick confirmation
* Grid and column view
* Card sorting by rarity, type, color or Manacost
* Bots
* Notifications when a pack is available
* API to create and manage a game remotely. [More docs here](https://github.com/dr4fters/dr4ft/blob/master/doc/api.md)
* Accurate Booster generation rules from @taw [magic-sealed-data](https://github.com/taw/magic-sealed-data)

## Technologies

*dr4ft* is written in [ES6] and transpiled with [Webpack] and [Babel], and uses [React] on the client-side.
The application uses [SocketIO] and the Websocket technology between client and server.

# Project History

*dr4ft* is a fork of *arxanas*' `drafts.ninja` fork of *aeosynth*'s `draft` project:

`draft` (initial project, discontinued)<br>
&nbsp;&nbsp;&nbsp; ↳ `drafts.ninja` (fork, discontinued)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↳ **`dr4ft`** (fork, **current main project**)

It supports all their features, and many more.

#### Known pages running this code:
 - [dr4ft.info](https://www.dr4ft.info)

<br>

# Installation

### Native

1) Install [Node.js](https://nodejs.org/en/download/) >= 12.0.0
2) Run<br>
`$ npm install`<br>
`$ npm start`
3) Visit [http://localhost:1337](http://localhost:1337)


### Docker

You can also create a Docker image and run the app in a container:
1) Install [Docker](https://www.docker.com/)
2) Build the image:<br>
`docker build -t dr4ft-app .`
3) Run it in a container:<br>
`docker run -dp 1337:1337 dr4ft-app`<br>
4) Visit [http://localhost:1337](http://localhost:1337)

## Usage

### Start Server

`npm start`
This command start the server

`npm run download_allsets`
This command downloads all sets from MTGJson and integrates them.

`npm run update_database`
This command downloads integrates all files previously downloaded from MTGJson.

`npm run download_booster_rules`
 download and parse booster generation rules from [magic-sealed-data](https://github.com/taw/magic-sealed-data)

## Development Notes

### VSCode

You can debug this application by adding the following configuration to your `launch.json`:

```json
{
  "name": "Launch via NPM",
  "type": "node",
  "request": "launch",
  "cwd": "${workspaceFolder}",
  "runtimeExecutable": "npm",
  "runtimeArgs": [
      "run", "start-debug"
  ],
  "port": 1338
}
```

You should now be able to set breakpoints in `backend/` and hit them when you start the debugger.
This relies on the `--inspect-brk=1338` flag to open port 1338 for the debugger to attach to.

Breakpoints for the frontend should be set in your browser console.

### Contributors

THANK YOU!

### Contribute!

Be a part of this project! You can run the test using the following.

1. Install dependencies from package.json by running `npm install`
2. Run the test via `npm test`
3. Make some fun new modules!

Found **bugs** or have **feature requests**? Feel free to [open an issue](https://github.com/dr4fters/dr4ft/issues/new)!
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

<p align='center'>
  <sub><i>The project is unaffiliated with Wizards of the Coast, and is licensed under the MIT license.</i></sub>
</p>



<!-- this are reference links -->
  [ES6]: https://github.com/lukehoban/es6features
  [Babel]: https://github.com/babel/babel
  [React]: https://github.com/facebook/react
  [Webpack]: https://webpack.js.org/
  [SocketIO]: https://socket.io
