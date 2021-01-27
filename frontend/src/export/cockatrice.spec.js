// import  { clone } from 'lodash'
import {ZONE_MAIN, ZONE_SIDEBOARD} from "../zones.js";
import { multiFacettedCards } from "./test-cards.js";
import cockatrice from "./cockatrice.js";

const {describe, it} = require("mocha");
const assert = require("assert").strict;


const deck = {
  [ZONE_MAIN]: [multiFacettedCards[0], ...multiFacettedCards.slice(0, multiFacettedCards.length - 1)],
  [ZONE_SIDEBOARD]: [multiFacettedCards[multiFacettedCards.length - 1]]
};

const downloadOutput = `<?xml version="1.0" encoding="UTF-8"?>
<cockatrice_deck version="1">
  <deckname>My deck</deckname>
  <zone name="main">
    <card number="2" name="Riverglide Pathway // Lavaglide Pathway"/>
    <card number="1" name="Murderous Rider // Swift End"/>
    <card number="1" name="Nezumi Shortfang // Stabwhisker the Odious"/>
    <card number="1" name="Kessig Prowler // Sinuous Predator"/>
    <card number="1" name="Dead // Gone"/>
  </zone>
  <zone name="side">
    <card number="1" name="Who // What // When // Where // Why"/>
  </zone>
</cockatrice_deck>`;

describe("export/cockatrice", () => {
  it("download of .cod file", () => {
    assert.equal(
      cockatrice.download("My deck", deck),
      downloadOutput,
      "correct output"
    );
  });
});
