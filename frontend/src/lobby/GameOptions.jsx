import React, {Fragment} from "react";
import PropTypes from "prop-types";

import _ from "utils/utils";
import App from "../app";
import Checkbox from "../components/Checkbox";
import Select from "../components/Select";

import Set from "./Set";
import SetReplicated from "./SetReplicated";
import CubeList from "./CubeList";

const GameOptions = () => {
  const { 
      setsDraft, setsSealed, setsDecadentDraft, 
      gametype, gamesubtype, 
      picksPerPack} = App.state;

  switch (`${gamesubtype} ${gametype}`) {
  case "regular draft":
    return <RegularDraft sets={setsDraft} type={"setsDraft"}  picksPerPack={picksPerPack}/>;
  case "regular sealed":
    return <RegularSealed sets={setsSealed} type={"setsSealed"} />;
  case "decadent draft":
    return <Decadent sets={setsDecadentDraft} type={"setsDecadentDraft"} picksPerPack={picksPerPack}/>;
  case "cube draft":
    return <CubeDraft picksPerPack={picksPerPack} />;
  case "cube sealed":
    return <CubeSealed />;
  case "chaos draft":
    return <ChaosDraft picksPerPack={picksPerPack} />;
  case "chaos sealed":
    return <ChaosSealed />;
  default:
    return null;
  }
};

const RegularDraft = ({sets, type, picksPerPack}) => (
  <div>
    <Regular sets={sets} type={type} />
    <PicksPerPacks picksPerPack={picksPerPack} />
  </div>
);

RegularDraft.propTypes = {
  sets: PropTypes.array,
  type: PropTypes.string
};

const RegularSealed = ({sets, type}) => (
  <Regular sets={sets} type={type} />
);

RegularSealed.propTypes = {
  sets: PropTypes.array,
  type: PropTypes.string
};

const Regular = ({sets, type}) => (
  <Fragment>
    <div>
      Number of packs:{" "}
      <Select
        value={sets.length}
        onChange={App._emit("changeSetsNumber", type)}
        opts={_.seq(12, 1)} />
    </div>
    <div>
      <Sets sets={sets} type={type} />
    </div>
  </Fragment>
);

Regular.propTypes = {
  sets: PropTypes.array,
  type: PropTypes.string
};

const Sets = ({sets, type}) => (
  sets.map((set, i) => <Set type={type} selectedSet={set} index={i} key={i} />)
);

const Decadent = ({sets, type, picksPerPack}) => (
  <Fragment>
    <div>
      Number of packs:{" "}
      <Select
        value={sets.length}
        onChange={App._emit("changeSetsNumber", type)}
        opts={_.seq(60, 36)} />
    </div>
    <div>
      <SetReplicated type={type} selectedSet={sets[0]} />
    </div>
    <PicksPerPacks picksPerPack={picksPerPack} />
  </Fragment>
);

Decadent.propTypes = {
  sets: PropTypes.array,
  type: PropTypes.string
};

const CubeDraft = ({picksPerPack}) => (
  <div>
    <CubeList />
    <CubeOptions />
    <PicksPerPacks picksPerPack={picksPerPack} />
    <BurnsPerPacks />
  </div>
);

const CubeSealed = () => (
  <div>
    <CubeList />
    <CubeSealedOptions />
  </div>
);

const CubeSealedOptions = () => (
  <div>
    Cards per player:{" "}
    <Select link="cubePoolSize" opts={_.seq(120, 15)} />
  </div>
);

const CubeOptions = () => (
  <div>
    <div>
      Number of packs:{" "}
      <Select link="packs" opts={_.seq(12, 1)} />
    </div>
    <div>
      Cards per pack:{" "}
      <Select link="cards" opts={_.seq(30, 5)} />
    </div>
  </div>
);

const ChaosDraft = ({picksPerPack}) => (
  <div>
    <Chaos packsNumber={"chaosDraftPacksNumber"} />
    <PicksPerPacks picksPerPack={picksPerPack} />
  </div>
);

const ChaosSealed = () => (
  <Chaos packsNumber={"chaosSealedPacksNumber"} />
);

const PicksPerPacks = ({picksPerPack}) => (
  <div>
  Picks per pack:{" "}
  <Select
    value={picksPerPack}
    onChange={App._emit("changePicksPerPack")}
    opts={_.seq(12, 1)} />
  </div>
)

const BurnsPerPacks = () => (
  <div>
    Burns per pack:{" "}
    <Select link={"burnsPerPack"} opts={_.seq(4, 0)} /> 
  </div>
);

const Chaos = ({packsNumber}) => (
  <div>
    <div>
      Number of packs:{" "}
      <Select
        onChange={(e) => {App.save(packsNumber, parseInt(e.currentTarget.value));}}
        link={packsNumber}
        opts={_.seq(12, 3)} />
    </div>
    <div>
      <Checkbox link='modernOnly' side='right' text='Only Modern Sets: ' />
    </div>
    <div>
      <Checkbox link='totalChaos' side='right' text='Total Chaos: ' />
    </div>
  </div>
);

Chaos.propTypes = {
  packsNumber: PropTypes.string
};

export default GameOptions;
