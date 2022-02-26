import {toTitleCase} from "./utils";

const {describe, it} = require("mocha");
const assert = require("assert");

describe("Acceptance tests for frontend utils", () => {
  it("toTitleCase() should capitalize each word", () => {
    assert(toTitleCase("") === "");
    assert(toTitleCase(0) === "");
    assert(toTitleCase({}) === "");

    assert(toTitleCase("draft") === "Draft");
    assert(toTitleCase("Draft") === "Draft");
    assert(toTitleCase("DRAFT") === "Draft");
    assert(toTitleCase("draft") === "Draft");

    assert(toTitleCase("cube draft") === "Cube Draft");
    assert(toTitleCase("CUBE DRAFT") === "Cube Draft");

    assert(toTitleCase("cube_draft") === "Cube_draft");
    assert(toTitleCase("CUBE_DRAFT") === "Cube_draft");
    assert(toTitleCase("cube_draft", "_") === "Cube_Draft");
    assert(toTitleCase("CUBE_DRAFT", "_") === "Cube_Draft");

    assert(toTitleCase("longer sentence of wordiness") === "Longer Sentence Of Wordiness");
    assert(toTitleCase("LONGER SENTENCE OF WORDINESS") === "Longer Sentence Of Wordiness");
    assert(toTitleCase("longer_sentence_of_wordiness") === "Longer_sentence_of_wordiness");
    assert(toTitleCase("LONGER_SENTENCE_OF_WORDINESS") === "Longer_sentence_of_wordiness");
    assert(toTitleCase("longer_sentence_of_wordiness", "_") === "Longer_Sentence_Of_Wordiness");
    assert(toTitleCase("LONGER_SENTENCE_OF_WORDINESS", "_") === "Longer_Sentence_Of_Wordiness");
  });
});
