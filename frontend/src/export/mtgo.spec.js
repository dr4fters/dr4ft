const {describe, it} = require("mocha");
const assert = require("assert").strict;

import { exampleDeck as deck } from "./test-cards.js";
import mtgo from "./mtgo.js";

describe("export/mtgo", () => {
  // console.log(multiFacettedCards.map(c => ([c.name, c.layout])))
  it("download of .dek file", () => {
    assert.equal(
      mtgo.download("My deck", deck),
      downloadOutput(),
      "correct output"
    );
  });

  it("copy to clipboard", () => {
    assert.equal(mtgo.copy, undefined, "copy to clipboard disabled");

    // assert.equal(
    //   mtgo.copy("My deck", deck),
    //   copyOutput(),
    //   "correct output"
    // );
  });
});

const downloadOutput = () => (
  `<?xml version="1.0" encoding="UTF-8"?>
<Deck xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NetDeckID>0</NetDeckID>
  <PreconstructedDeckID>0</PreconstructedDeckID>

  <Cards CatID="21213" Quantity="2" Sideboard="false" Name="Nezumi Shortfang" Annotation="0" />
  <Cards CatID="61446" Quantity="1" Sideboard="false" Name="Kessig Prowler" Annotation="0" />
  <Cards CatID="78308" Quantity="1" Sideboard="false" Name="Murderous Rider" Annotation="0" />
  <Cards CatID="64832" Quantity="1" Sideboard="false" Name="Refuse/Cooperate" Annotation="0" />
  <Cards CatID="83533" Quantity="1" Sideboard="false" Name="Riverglide Pathway" Annotation="0" />
  <Cards CatID="26517" Quantity="1" Sideboard="false" Name="Dead/Gone" Annotation="0" />

  <Cards CatID="48512" Quantity="1" Sideboard="true" Name="Catch/Release" Annotation="0" />
</Deck>
`);
