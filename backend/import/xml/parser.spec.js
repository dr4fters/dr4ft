/* eslint-env node, mocha */
const assert = require("assert");
const parser = require("./parser");

describe("Unit tests for XML Cockatrice Parser", () => {
  describe("throw an error when xml structure not supported", () => {
    it("xml content cannot be null", () => {
      assert.throws(() => parser.parse(""), Error, "Error thrown" );
    });

    it("xml content must be valid cockatrice format", () => {
      assert.throws(() => parser.parse("<xml></xml>"), Error, "Error thrown" );
    });
  });
  describe("can parse a valid cockatrice v4 xml", () => {
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
            names: ["Card name"],
            number: 42,
            power: "",
            rarity: "common",
            side: "front",
            supertypes: [],
            text: "Card description",
            toughness: 2,
            type: "Instant",
            types: ["Instant"],
            url: "http://.../image.jpg"
          }],
          code: "PF20",
          name: "MagicFest 2020",
          releaseDate: "2020-01-01",
          type: "Promo"
        }
      });
    });
    it("can parse split cards", () => {
      const result = parser.parse(`
      <cockatrice_carddatabase version="4">
  <sets>
    <set>
      <name>IPR</name>
      <longname>IPA Remastered</longname>
      <settype>Custom</settype>
      <releasedate>2020-04-10</releasedate>
    </set>
  </sets>
  <cards>
      <card>
        <name>Fire // Ice</name>
        <text>Fire deals 2 damage divided as you choose among one or two targets.  --- Tap target permanent. Draw a card.</text>
        <prop>
          <layout>split</layout>
          <type>Instant</type>
          <maintype>Instant</maintype>
          <manacost>1R // 1U</manacost>
          <cmc>4</cmc>
          <colors>RU</colors>
          <coloridentity>RU</coloridentity>
        </prop>
        <set rarity="uncommon" uuid="ae92942b-919c-4ea9-b693-85fcef765d5a" picurl="https://img.scryfall.com/cards/png/front/f/9/f98f4538-5b5b-475d-b98f-49d01dae6f04.png?1562954160" num="302" muid="27165">IPR</set>
        <tablerow>3</tablerow>
      </card>
  </cards>
</cockatrice_carddatabase>`);
      assert.deepEqual(result, {
        IPR: {
          baseSetSize: 1,
          cards: [{
            cmc: 4,
            colors: ["R", "U"],
            isAlternative: false,
            layout: "split",
            loyalty: "",
            manaCost: "1R // 1U",
            name: "Fire // Ice",
            names: ["Fire", "Ice"],
            number: 302,
            power: "",
            rarity: "uncommon",
            side: "a",
            supertypes: [],
            text: "Fire deals 2 damage divided as you choose among one or two targets.  --- Tap target permanent. Draw a card.",
            toughness: "",
            type: "Instant",
            types: ["Instant"],
            url: "https://img.scryfall.com/cards/png/front/f/9/f98f4538-5b5b-475d-b98f-49d01dae6f04.png?1562954160"
          }],
          code: "IPR",
          name: "IPA Remastered",
          releaseDate: "2020-04-10",
          type: "Custom"
        }
      });
    });
  });

  describe("can parse a valid cockatrice v3 xml", () => {
    it("xml is valid", () => {
      const result = parser.parse(`<?xml version="1.0" encoding="UTF-8"?>
      <cockatrice_carddatabase version="3">
      <sets>
      <set>
        <name>DMS</name>
        <longname>Dreamscape</longname>
      </set>
      </sets>
      <cards>
      <card>
       <name>Aven Harrier</name>
       <set rarity="common" picURL="/Aven Harrier.full.jpg" rarity="common">DMS</set>
       <color>W</color>
       <manacost>1W</manacost>
       <cmc>2</cmc>
       <type>Creature - Bird Archer </type>
       <pt>1/2</pt>
       <tablerow>2</tablerow>
       <text>Flying
      Prowess (Whenever you cast a noncreature spell this creature gets +1/+1 until end of turn.)</text>
      </card>
  </cards>
</cockatrice_carddatabase>`);
      assert.deepEqual(result, {
        DMS: {
          baseSetSize: 1,
          cards: [{
            cmc: 2,
            colors: ["W"],
            isAlternative: false,
            layout: "normal",
            loyalty: "",
            manaCost: "1W",
            name: "Aven Harrier",
            names: ["Aven Harrier"],
            number: 0,
            power: 1,
            rarity: "common",
            side: "a",
            supertypes: [],
            text: `Flying
      Prowess (Whenever you cast a noncreature spell this creature gets +1/+1 until end of turn.)`,
            toughness: 2,
            type: "Creature",
            types: ["Creature"],
            url: "/Aven Harrier.full.jpg"
          }],
          code: "DMS",
          name: "Dreamscape",
          releaseDate: "",
          type: ""
        }
      });
    });
    it("sets information can be found in cards.sets node", () => {
      const result = parser.parse(`<?xml version="1.0" encoding="UTF-8"?>
      <cockatrice_carddatabase version="3">
      <cards>
      <card>
       <name>Aven Harrier</name>
       <set rarity="common" picURL="/Aven Harrier.full.jpg" rarity="common">DMS</set>
       <color>W</color>
       <manacost>1W</manacost>
       <cmc>2</cmc>
       <type>Creature - Bird Archer </type>
       <pt>1/2</pt>
       <tablerow>2</tablerow>
       <text>Flying
      Prowess (Whenever you cast a noncreature spell this creature gets +1/+1 until end of turn.)</text>
      </card>
  </cards>
</cockatrice_carddatabase>`);
      assert.deepEqual(result, {
        DMS: {
          baseSetSize: 1,
          cards: [{
            cmc: 2,
            colors: ["W"],
            isAlternative: false,
            layout: "normal",
            loyalty: "",
            manaCost: "1W",
            name: "Aven Harrier",
            names: ["Aven Harrier"],
            number: 0,
            power: 1,
            rarity: "common",
            side: "a",
            supertypes: [],
            text: `Flying
      Prowess (Whenever you cast a noncreature spell this creature gets +1/+1 until end of turn.)`,
            toughness: 2,
            type: "Creature",
            types: ["Creature"],
            url: "/Aven Harrier.full.jpg"
          }],
          code: "DMS",
          name: "DMS",
          releaseDate: "",
          type: ""
        }
      });
    });
  });
});

