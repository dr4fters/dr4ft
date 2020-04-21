export const ZONE_MAIN = "main";
export const ZONE_SIDEBOARD = "side";
export const ZONE_PACK = "pack";
export const ZONE_JUNK = "junk";

const ZONE_NAMES = {
  [ZONE_PACK]: "Pack",
  [ZONE_MAIN]: "Main Deck",
  [ZONE_SIDEBOARD]: "Sideboard",
  [ZONE_JUNK]: "Junk"
};

export const getZoneDisplayName = (zoneName) => ZONE_NAMES[zoneName];
