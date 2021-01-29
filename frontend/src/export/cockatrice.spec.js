import {ZONE_MAIN, ZONE_SIDEBOARD} from "../zones.js";
import { multiFacettedCards } from "./test-cards.js";
import cockatrice from "./cockatrice.js";

const {describe, it} = require("mocha");
const assert = require("assert").strict;

const deck = {
  [ZONE_MAIN]: [multiFacettedCards[0], ...multiFacettedCards.slice(0, multiFacettedCards.length - 1)],
  [ZONE_SIDEBOARD]: [multiFacettedCards[multiFacettedCards.length - 1]]
};

describe.only("export/cockatrice", () => {
  it("download of .cod file", () => {
    assert.equal(
      cockatrice.download("My deck", deck),
      downloadOutput(),
      "correct output"
    );
  });

  it("copy to clipboard", () => {
    assert.equal(
      cockatrice.copy("My deck", deck),
      copyOutput(),
      "correct output"
    );
  });
});

const downloadOutput = () => (
  `<?xml version="1.0" encoding="UTF-8"?>
<cockatrice_deck version="1">
  <deckname>My deck</deckname>
  <zone name="main">
    <card number="2" name="Nezumi Shortfang"/>
    <card number="1" name="Kessig Prowler"/>
    <card number="1" name="Murderous Rider // Swift End"/>
    <card number="1" name="Refuse // Cooperate"/>
    <card number="1" name="Riverglide Pathway"/>
    <card number="1" name="Dead // Gone"/>
    <card number="1" name="Catch // Release"/>
  </zone>
  <zone name="side">
    <card number="1" name="Who // What // When // Where // Why"/>
  </zone>
</cockatrice_deck>`
);

const copyOutput = () => (
  `2 Nezumi Shortfang
1 Kessig Prowler
1 Murderous Rider // Swift End
1 Refuse // Cooperate
1 Riverglide Pathway
1 Dead // Gone
1 Catch // Release
Sideboard
1 Who // What // When // Where // Why`
);
