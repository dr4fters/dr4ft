import React, {Fragment} from "react";
import PropTypes from "prop-types";

import _ from "utils/utils";
import App from "../app";
import Select from "../components/Select";

import SelectSet from "./SelectSet";

const GameOptions = () => {
  const {
    setsDraft, setsSealed,
    gametype, gamesubtype} = App.state;

  switch (`${gamesubtype} ${gametype}`) {
  case "regular draft":
    return <RegularDraft sets={setsDraft} type={"setsDraft"}/>;
  case "regular sealed":
    return <RegularSealed sets={setsSealed} type={"setsSealed"} />;
  default:
    return null;
  }
};

const RegularDraft = ({sets, type}) => (
  <div>
    <Regular sets={sets} type={type} />
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
  sets.map((set, i) => {
    return (
      <SelectSet
        value={App.state[type][i]}
        key={i}
        onChange={setCode => {
          App.state[type][i] = setCode;
          App.save(type, App.state[type]);
        }}
      />
    );
  })
);

export default GameOptions;
