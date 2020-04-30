import React, {Fragment} from "react";
import PropTypes from "prop-types";

import _ from "utils/utils";
import App from "../app";
import { Checkbox, Select } from "../utils";

import Set from "./Set";
import CubeList from "./CubeList";

const GameOptions = () => {
  const { setsDraft, setsSealed, gametype, gamesubtype } = App.state;

  switch (`${gamesubtype} ${gametype}`) {
  case "regular glimpse":
  case "regular draft":
    return <Regular sets={setsDraft} type={"setsDraft"} />;
  case "regular sealed":
    return <Regular sets={setsSealed} type={"setsSealed"} />;
  case "cube glimpse":
  case "cube draft":
    return <CubeDraft />;
  case "cube sealed":
    return <CubeSealed />;
  case "chaos glimpse":
  case "chaos draft":
    return <Chaos packsNumber={"chaosDraftPacksNumber"} />;
  case "chaos sealed":
    return <Chaos packsNumber={"chaosSealedPacksNumber"}/>;
  default:
    return <Regular sets={setsDraft} type={"setsDraft"} />;
  }
};

const Regular = ({ sets, type }) => (
  <Fragment >
    <div>
      Number of packs:{" "}
      <Select
        value={sets.length}
        onChange={App._emit("changeSetsNumber", type)}
        opts={_.seq(12, 1)} />
    </div>
    <div className="wrapper">
      <Sets sets={sets} type={type} />
    </div>
  </Fragment>
);

Regular.propTypes = {
  sets: PropTypes.array,
  type: PropTypes.string
};

const Sets = ({ sets, type }) => (
  sets
    .map((set, i) => <Set type={type} selectedSet={set} index={i} key={i} />)
);

const CubeDraft = () => (
  <div>
    <CubeList />
    <CubeOptions />
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
    <Select link="cubePoolSize" opts={_.seq(120, 15)} />
    {" "}cards per player
  </div>
);

const CubeOptions = () => (
  <div>
    <Select link="cards" opts={_.seq(30, 5)} />
    {" "}cards
    <Select link="packs" opts={_.seq(12, 1)} />
    {" "}packs
  </div>
);

const Chaos = ({ packsNumber }) => (
  <div>
    <div>
      Number of packs:{" "}
      <Select
        onChange={(e) => { App.save(packsNumber, parseInt(e.currentTarget.value));}}
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
  packsNumber: PropTypes.number
};

export default GameOptions;
