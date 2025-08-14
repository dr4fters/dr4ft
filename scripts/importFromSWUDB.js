const fs = require("fs");
const RARITY = {
  1: "Common",
  2: "Uncommon",
  3: "Rare",
  4: "Legendary",
  5: "Special"
};

const ASPECTS = {
  1: "Aggresion",
  2: "Command",
  3: "Cunning",
  4: "Vigilance",
  5: "Heroism",
  6: "Villany"
};

async function importSet() {
  const allSets = await (await fetch("https://swudb.com/api/card/getAllSets")).json();

  const setsToFetch = allSets.filter(({ cardCount }) => cardCount);
  let cardIdx = 1;
  let setIdx = 0;

  const sets = {};
  const cards = {};
  const cardsByName = {};

  while (setIdx < setsToFetch.length) {
    console.log("Started processing ", setsToFetch[setIdx].expansionAbbreviation, "total base cards:", setsToFetch[setIdx].cardCount);

    cardIdx = 1;
    while (cardIdx <= setsToFetch[setIdx].cardCount) {
      const response = await fetch("https://swudb.com/api/card/getPrintingInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardNumber: String(cardIdx).padStart(3, "0"),
          expansionAbbreviation: setsToFetch[setIdx].expansionAbbreviation,
          language: ""
        })
      });
      const data = await response.json();

      if (data.cardId) {
        const formattedCardNumber = (number) => String(number).padStart(3, "0");
        const baseCardCode = `${setsToFetch[setIdx].expansionAbbreviation}_${formattedCardNumber(cardIdx)}`;
        const cardName = data.title !== "" ? `${data.cardName}, ${data.title}` : data.cardName;

        //Card whole collection
        let alternativeIdx = 0;
        while (alternativeIdx < data.alternativePrintings.length) {
          const altCardCode = `${data.alternativePrintings[alternativeIdx].expansionAbbreviation}_${formattedCardNumber(data.alternativePrintings[alternativeIdx].cardNumber)}`;

          if (cards[altCardCode]) {
            console.log(altCardCode, " already on the DB");
          } else {
            const alternativeResponse = await fetch("https://swudb.com/api/card/getPrintingInfo", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                cardNumber: formattedCardNumber(data.alternativePrintings[alternativeIdx].cardNumber),
                expansionAbbreviation: data.alternativePrintings[alternativeIdx].expansionAbbreviation,
                language: ""
              })
            });
            const alt = await alternativeResponse.json();

            cards[altCardCode] = {
              defaultExpansionAbbreviation: data.alternativePrintings[alternativeIdx].expansionAbbreviation,
              cardName: alt.cardName,
              title: alt.title,
              defaultCardNumber: formattedCardNumber(data.alternativePrintings[alternativeIdx].cardNumber),
              defaultImagePath: `https://swudb.com/images/${alt.frontImagePath}`.replaceAll("~/", ""),
              frontImagePath: `https://swudb.com/images/${alt.frontImagePath}`.replaceAll("~/", ""),
              backImagePath: (alt.backImagePath ? `https://swudb.com/images/${alt.backImagePath}` : "https://karabast.net/card-back.png").replaceAll("~/", ""),
              aspects: alt.aspects.map(aspect => ASPECTS[aspect]),
              defaultRarity: data.alternativePrintings[0].rarity,
              type: alt.cardTypeDescription
            };

            console.log("ADDED ", altCardCode, data.cardName);
          }

          alternativeIdx++;
        }

        //Cards by name
        if (!cardsByName[cardName]) {
          cardsByName[cardName] = {
            default: baseCardCode
          };
        }

        Object.entries(data.alternativePrintings).forEach(([entry, value]) => {
          if (!cardsByName[cardName][value.expansionAbbreviation]) {
            cardsByName[cardName][value.expansionAbbreviation] = {};
          }

          cardsByName[cardName][value.expansionAbbreviation][formattedCardNumber(value.cardNumber)] = baseCardCode;


          console.log("ADDED to alts", cardName, value.expansionAbbreviation, formattedCardNumber(value.cardNumber));
        });

        //Set collection
        if (setsToFetch[setIdx].expansionType === 1 && setsToFetch[setIdx].formatLegality !== 0) {
          if (!sets[setsToFetch[setIdx].expansionAbbreviation]) {
            sets[setsToFetch[setIdx].expansionAbbreviation] = {
              cardsByNumber: {},
              code: setsToFetch[setIdx].expansionAbbreviation,
              releaseDate: setsToFetch[setIdx].releaseDate,
              baseSetSize: setsToFetch[setIdx].cardCount,
              name: setsToFetch[setIdx].expansionName
            };
          }

          sets[setsToFetch[setIdx].expansionAbbreviation].cardsByNumber[formattedCardNumber(cardIdx)] = baseCardCode;

          if (!sets[setsToFetch[setIdx].expansionAbbreviation][data.cardTypeDescription]) {
            sets[setsToFetch[setIdx].expansionAbbreviation][data.cardTypeDescription] = [];
          }

          sets[setsToFetch[setIdx].expansionAbbreviation][data.cardTypeDescription].push(baseCardCode);

          if (data.cardTypeDescription === "Leader" || (data.cardTypeDescription === "Base" && data.alternativePrintings[0].rarity !== 3)) {
            console.log("Skipping", baseCardCode, data.cardTypeDescription, RARITY[data.alternativePrintings[0].rarity]);
          } else {
            if (!sets[setsToFetch[setIdx].expansionAbbreviation][RARITY[data.alternativePrintings[0].rarity]]) {
              sets[setsToFetch[setIdx].expansionAbbreviation][RARITY[data.alternativePrintings[0].rarity]] = [];
            }

            sets[setsToFetch[setIdx].expansionAbbreviation][RARITY[data.alternativePrintings[0].rarity]].push(baseCardCode);
          }

          console.log("ADDED to set", setsToFetch[setIdx].expansionAbbreviation, RARITY[data.alternativePrintings[0].rarity], baseCardCode, `${cardIdx} / ${setsToFetch[setIdx].cardCount}`);
        }
      }

      cardIdx++;
    }

    setIdx++;
  }

  fs.writeFile("data/cards.json", JSON.stringify(cards), function (err) {
    if (err) {
      console.log(err);
    }
    console.log("DONE with cards");
    fs.writeFile("data/cubable_cards_by_name.json", JSON.stringify(cardsByName), function (err) {
      if (err) {
        console.log(err);
      }
      console.log("DONE cards by name");
      fs.writeFile("data/sets.json", JSON.stringify(sets), function (err) {
        if (err) {
          console.log(err);
        }
        console.log("DONE with sets");
      });
    });
  });
}

importSet();
