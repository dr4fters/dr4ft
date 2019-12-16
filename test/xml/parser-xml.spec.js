/* eslint-env node, mocha */
const assert = require("assert");
const parser = require("../../src/make/xml/parser");

describe("Unit tests for XML Cockatrice Parser", () => {
  describe("throw an error when xml structure not supported", () => {
    it("xml content cannot be null", () => {
      assert.throws(() => parser.parse(""), Error, "Error thrown" );
    });

    it("xml content must be valid cockatrice format", () => {
      assert.throws(() => parser.parse("<xml></xml>"), Error, "Error thrown" );
    });
  });
  describe("can parse a valid xml", () => {
    it("xml is valid", () => {
      const result = parser.parse(`<cockatrice_carddatabase version="4">
  <sets>
    <set>
      <name>PF20</name>
      <longname>MagicFest 2020</longname>
      <settype>Promo</settype>
      <releasedate>2020-01-01</releasedate>
    </set>
  </sets>
  <cards>
    <card>
      <name>Card name</name>
      <text>Card description</text>
      <token>1</token>
      <cipt>1</cipt>
      <upsidedown>1</upsidedown>
      <tablerow>3</tablerow>
      <set rarity="common" uuid="12345678-abcd-1234-abcd-1234567890ab" num="42" muid="123456" picurl="http://.../image.jpg">PF20</set>
      <related>Another card name</related>
      <reverse-related>Another card name</reverse-related>
      <prop>
        <layout>normal</layout>
        <side>front</side>
        <type>Instant</type>
        <maintype>Instant</maintype>
        <manacost>R</manacost>
        <cmc>1</cmc>
        <colors>R</colors>
        <coloridentity>R</coloridentity>
        <pt>0/2</pt>
        <loyalty>4</loyalty>
        <format-standard>legal</format-standard>
        <format-commander>legal</format-commander>
        <format-modern>legal</format-modern>
        <format-pauper>legal</format-pauper>
      </prop>
    </card>
  </cards>
</cockatrice_carddatabase>`);
      assert.deepEqual(result, {
        PF20: {
          baseSetSize: 1,
          cards: [{
            cmc: 1,
            colors: ["R"],
            isAlternative: false,
            layout: "normal",
            loyalty: 4,
            manaCost: "R",
            name: "Card name",
            number: 42,
            power: 0,
            rarity: "common",
            side: "front",
            supertypes: [],
            text: "Card description",
            toughness: 2,
            type: "instant",
            types: ["instant"],
            url: "http://.../image.jpg"
          }],
          code: "PF20",
          name: "MagicFest 2020",
          releaseDate: "2020-01-01",
          type: "Promo"
        }
      });
    });
  });
});

