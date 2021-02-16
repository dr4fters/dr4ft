const {describe, it} = require("mocha");
const assert = require("assert").strict;

import { exampleDeck as deck } from "./test-cards.js";
import mtga from "./mtga.js";

describe("export/mtga", () => {
  it("download of *** file", () => {
    assert.equal(mtga.download, undefined, "download disabled");
  });

  it("copy to clipboard", () => {
    assert.equal(
      mtga.copy("My deck", deck),
      copyOutput(),
      "correct output"
    );
  });
});

const copyOutput = () => (
  `Deck
2 Nezumi Shortfang (CHK) 131
1 Kessig Prowler (EMN) 163
1 Murderous Rider (ELD) 97
1 Refuse /// Cooperate (HOU) 156
1 Riverglide Pathway (ZNR) 264
1 Graf Rats (EMN) 91
1 Dead /// Gone (PLC) 113

Sideboard
1 Catch /// Release (DGM) 125
1 Who /// What /// When /// Where /// Why (UND) 75`
);
