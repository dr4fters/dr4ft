const {describe, it} = require("mocha");
const assert = require("assert").strict;

import { exampleDeck as deck } from "./test-cards.js";
import mtga from "./mtga.js";

describe("export/mtga", () => {
  it("download of *** file", () => {
    assert.equal(mtga.download, undefined, "download disabled");
  //   assert.equal(
  //     mtga.download("My deck", deck),
  //     downloadOutput(),
  //     "correct output"
  //   );
  });

  it("copy to clipboard", () => {
    assert.equal(
      mtga.copy("My deck", deck),
      copyOutput(),
      "correct output"
    );
  });
});

// const downloadOutput = () => (
//   `<?xml version="1.0" encoding="UTF-8"?>
// <Deck xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
//   <NetDeckID>0</NetDeckID>
//   <PreconstructedDeckID>0</PreconstructedDeckID>

//   <Cards CatID="21213" Quantity="2" Sideboard="false" Name="Nezumi Shortfang" Annotation="0" />
//   <Cards CatID="61446" Quantity="1" Sideboard="false" Name="Kessig Prowler" Annotation="0" />
//   <Cards CatID="78308" Quantity="1" Sideboard="false" Name="Murderous Rider" Annotation="0" />
//   <Cards CatID="64832" Quantity="1" Sideboard="false" Name="Refuse/Cooperate" Annotation="0" />
//   <Cards CatID="83533" Quantity="1" Sideboard="false" Name="Riverglide Pathway" Annotation="0" />
//   <Cards CatID="26517" Quantity="1" Sideboard="false" Name="Dead/Gone" Annotation="0" />

//   <Cards CatID="48512" Quantity="1" Sideboard="true" Name="Catch/Release" Annotation="0" />
// </Deck>
// `);

const copyOutput = () => (
  `Deck
2 Nezumi Shortfang (CHK) 131
1 Kessig Prowler (EMN) 163
1 Murderous Rider (ELD) 97
1 Refuse /// Cooperate (HOU) 156
1 Riverglide Pathway (ZNR) 264
1 Dead /// Gone (PLC) 113

Sideboard
1 Catch /// Release (DGM) 125
1 Who /// What /// When /// Where /// Why (UND) 75`
);
