# drafts.ninja [![Stories in Ready](https://badge.waffle.io/arxanas/drafts.ninja.png?label=ready&title=Ready)](https://waffle.io/arxanas/drafts.ninja) [![Gitter chat](https://badges.gitter.im/arxanas/drafts.ninja.png)](https://gitter.im/arxanas/drafts.ninja)

[drafts.ninja](http://drafts.ninja) is a fork of aeosynth's `draft` project. It
supports all of the features of `draft` and more. Here are some of the
highlights:

  * **Pick confirmation**: In order to prevent misclicks, `draft` requires you to
    click a card twice in order to select it. However, the selected card is
indistinguishable from the other cards in the pack. The UI in drafts.ninja
indicates which card is currently selected.

  * **Autopick**: If your time expires, `draft` will select a card for you at
    random. This rarely turns out well. If you have preliminarily selected a
card but not confirmed it, drafts.ninja will automatically pick it for you.

  * **Connection indicators**: Are your draftmates disconnected or just slow?
    drafts.ninja displays a connection indicator next to each player in the
draft, letting you know if a player is no longer with us.

  * **Kick players**: If one of your players has disconnected and is holding up
    the draft, you can kick them and the rest of their picks will be made
automatically for them. No more abandoning the draft halfway through!

  * **Ready confirmation**: Each player must mark themself as ready before the
    game can start. If you have unresponsive players, you can kick them before
the draft has started and get a new person.

  * **Suggest lands**: After agonizing over your maindeck, you don't want to
    spend a lot of time constructing your manabase. With the click of a button,
drafts.ninja will add lands to your deck using an algorithm designed to
conservatively choose your color ratio. It'll even add some basic lands to your
sideboard as well, just in case.

Like `draft` before it, drafts.ninja is unaffiliated with Wizards of the Coast,
and is licensed under the MIT license.

Bugs or feature requests? Feel free to open an issue.

# Installation

drafts.ninja is a NodeJS application. Install NodeJS, then just run `make run`
in your terminal and visit [http://localhost:1337](http://localhost:1337).

drafts.ninja is written in [ES6] and transpiled with [Traceur], and uses [React]
on the client-side.

  [ES6]: https://github.com/lukehoban/es6features
  [Traceur]: https://github.com/google/traceur-compiler
  [React]: https://github.com/facebook/react
