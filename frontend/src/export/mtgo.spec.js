const {describe, it} = require("mocha");
const assert = require("assert").strict;

import { exampleDeck as deck } from "./test-cards.js";
import mtgo from "./mtgo.js";

describe("export/mtgo", () => {
  it("download of .dek file", () => {
    assert.equal(
      mtgo.download("My deck", deck),
      downloadOutput(),
      "correct output"
    );
  });

  it("copy to clipboard", () => {
    assert.equal(mtgo.copy, undefined, "copy to clipboard disabled");
  });
});

const downloadOutput = () => {
  return `2 Nezumi Shortfang
1 Kessig Prowler
1 Murderous Rider
1 Refuse/Cooperate
1 Riverglide Pathway
1 Dead/Gone

Sideboard
1 Catch/Release
1 Who/What/When/Where/Why`;
};
