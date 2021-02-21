const { chunk } = require("lodash");
const axios = require("axios");
const { app: config } = require("../../config");
const legacy = require("./legacy");
const logger = require("../logger");

const poolServiceUrl = config.POOL_SERVICE_URL;

const SealedCube = ({ cubeList, playersLength, playerPoolSize = 90 }) => {
  return DraftCube({
    cubeList,
    playersLength,
    packsNumber: 1,
    playerPackSize: playerPoolSize
  });
};

const DraftCube = ({ cubeList, playersLength, packsNumber = 3, playerPackSize = 15 }) => {
  return axios.post(`${poolServiceUrl}pool/cube`, {
    list: cubeList,
    players: playersLength,
    packs: packsNumber,
    playerPackSize
  })
    .then(({ data }) => data)
    .catch(reason => {
      logger.error("could not fetch draft cube packs. Fallback to legacy", reason);
      return legacy.DraftCube({ cubeList, playersLength, packsNumber, playerPackSize });
    });
};

const SealedNormal = ({ playersLength, sets }) => (
  axios.post(`${poolServiceUrl}pool/regular/sealed`, {
    players: playersLength,
    sets: sets
  })
    .then(({ data }) => data)
    .catch(reason => {
      logger.error("could not fetch sealed regular packs. Fallback to legacy", reason);
      return legacy.SealedNormal({ playersLength, sets });
    })
);

const DraftNormal = ({ playersLength, sets }) => (
  axios.post(`${poolServiceUrl}pool/regular/draft`, {
    players: playersLength,
    sets: sets,
  })
    .then(({ data }) => data)
    .catch(reason => {
      logger.error("could not fetch draft regular packs. Fallback to legacy", reason);
      return legacy.DraftNormal({ playersLength, sets });
    })
);

const DraftChaos = ({ playersLength, packsNumber = 3, modernOnly, totalChaos }) => (
  axios.post(`${poolServiceUrl}pool/chaos/draft`, {
    players: playersLength,
    packs: packsNumber,
    modern: modernOnly,
    totalChaos: totalChaos
  })
    .then(({ data }) => data)
    .catch(reason => {
      logger.error("could not fetch draft chaos packs. Fallback to legacy", reason);
      return legacy.DraftChaos({ playersLength, packsNumber, modernOnly, totalChaos });
    })
);

const SealedChaos = ({ playersLength, packsNumber = 6, modernOnly, totalChaos }) => (
  axios.post(`${poolServiceUrl}pool/chaos/sealed`, {
    players: playersLength,
    packs: packsNumber,
    modern: modernOnly,
    totalChaos: totalChaos
  })
    .then(({ data }) => data)
    .catch(reason => {
      logger.error("could not fetch sealed chaos packs. Fallback to legacy", reason);
      return legacy.SealedChaos({ playersLength, packsNumber, modernOnly, totalChaos });
    })
);

const ControlCubeList = (list) => (
  axios.post(`${poolServiceUrl}pool/cube/list`, {
    list
  })
    .catch((reason) => {
      logger.error("could not control cube list. Fallback to legacy", reason);
      return legacy.controlCubeList(list);
    })
);

const getPoolInfos = () => (
  axios.get(`${poolServiceUrl}infos`)
    .then(({ data }) => data)
    .catch(reason => {
      logger.error("could not fetch infos. Fallback to legacy", reason);
      return legacy.getPoolInfos();
    })
);

module.exports = {
  SealedCube,
  DraftCube,
  SealedNormal,
  DraftNormal,
  SealedChaos,
  DraftChaos,
  ControlCubeList,
  getPoolInfos
};
