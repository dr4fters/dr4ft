const CardColors = {
    "W": 0,
    "U": 1,
    "B": 2,
    "R": 3,
    "G": 4,
    "C": 5
  };
  
  const CardColorNames = {
    "White": 0,
    "Blue": 1,
    "Black": 2,
    "Red": 3, 
    "Green": 4,
    "Colorless": 5,
  }
  
  /** 
   * @desc eatColorPips ... Separates out the colored pips {4}{W} --> W for bias analysis.
   * @param {String} manaCost ... String of the manacost with generic and colored costs.
   * @returns {Array} ... Returns an array of the color pip bias.
   */
  function eatColorPips(manaCost) {
    colorBias = [0, 0, 0, 0, 0];
  
    /**
     * Eventually will replace this with a proper RegEX.
     */
  
    manaCost = manaCost.split("{").join("");
    manaCost = manaCost.split("}").join("")
    manaCost = manaCost.split("X").join("")
    manaCost = manaCost.split("/").join("")
  
    for (var number = 0; number <= 9; number++) {
        manaCost = manaCost.split(number).join("");
    }
  
    for (var char = 0; char < manaCost.length; char++) {
      colorBias[CardColors[manaCost.charAt(char)]]++;
    }
  
    return colorBias;
  }
  
  /**
   * @desc generatePackStats(pack) ... Examines and create an object for the statistics of a pack.
   * @param {object} pack ... An object containing the name, UUID, CMC, and other relevant information about the pack.
   * @returns {object} ... Returns an object containing information about the pack.
   */
  function generatePackStats(packs) {
    // colorBias, an array from [0, 1] reference enum CardColors, each pack is weighted by color.
    var colorBias = [0, 0, 0, 0, 0, 0];
    var colorPipBias = [0, 0, 0, 0, 0];
    var typeBias = {};
    
    var cmcBias = 0;
    var totalCount = packs.length;
    var nonLandCount = 0;
  
    for (var pack in packs) {
      // packObj used to make my life easier regarding referencing.
      var packObj = packs[pack];
      
      var manaCost = packObj.manaCost;
      var type = packObj.type;
      var color = packObj.color;
      var CMC = packObj.cmc;
  
      if (type != "Land") {
        nonLandCount++;
        colorBias[CardColorNames[color]]++;
        
        if (CMC > 0) {
          cmcBias += CMC;
        }
  
        if (color != "Colorless") {
          newColorBias = eatColorPips(manaCost);
  
          for (var val = 0; val < colorPipBias.length; val++) {
            colorPipBias[val] += newColorBias[val];
          }
        } 
      }
  
      typeBias[type] = (typeBias[type] || 0) + 1; // Increase the number for whatever type it is or initialize the value.
    }
  
    for (var val = 0; val < colorPipBias.length; val++) {
      colorPipBias[val] /= nonLandCount;
    }
  
    for (var val = 0; val < colorBias.length; val++) {
      colorBias[val] /= nonLandCount;
    }
  
    cmcBias /= nonLandCount;
  
    for (var type in typeBias) {
      typeBias[type] /= totalCount;
    }
  
    var packStats = {"colorBias": colorBias, "colorPipBias": colorPipBias, "typeBias": typeBias, "cmcBias": cmcBias}
  
    return packStats;
  }