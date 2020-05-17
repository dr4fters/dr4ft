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
  const { setsDraft, setsSealed, setsDecadentDraft, gametype, gamesubtype } = App.state;

  switch (`${gamesubtype} ${gametype}`) {
  case "regular draft":
    return <RegularDraft sets={setsDraft} type={"setsDraft"} />;
  case "regular sealed":
    return <RegularSealed sets={setsSealed} type={"setsSealed"} />;
  case "decadent draft":
    return <Decadent sets={setsDecadentDraft} type={"setsDecadentDraft"} />;
  case "cube draft":
    return <CubeDraft/>;
  case "cube sealed":
    return <CubeSealed/>;
  case "chaos draft":
    return <ChaosDraft/>
  case "chaos sealed":
    return <ChaosSealed/>;
  default:
    return null;
  }
};

const RegularDraft = ({sets, type}) => (
  <Fragment>
    <blockquote className="game-mode-description">
      <p>Each player starts with {sets.length} booster packs.</p>
      <p>To begin, each player opens one pack, chooses (drafts) one card, and passes the rest to the next player.</p>
      <p>That player drafts one card from what's left, passes it, and so on until no cards are left.</p>
      <p>Then everyone opens their next pack, starting a new round. Packs are passed in alternating directions each round.</p>
      <p>Once all cards have been drafted, each player builds a deck out of the cards they drafted.</p>
    </blockquote>
    <Regular sets={sets} type={type} />
  </Fragment>
);

RegularDraft.propTypes = {
  sets: PropTypes.array,
  type: PropTypes.string
}

const RegularSealed = ({sets, type}) => (
  <Fragment>
    <blockquote className="game-mode-description">
      <p>Each player opens {sets.length} booster packs and builds a deck using any of those cards.</p>
    </blockquote>
    <Regular sets={sets} type={type} />
  </Fragment>
);

RegularSealed.propTypes = {
  sets: PropTypes.array,
  type: PropTypes.string
}

const Regular = ({ sets, type }) => (
  <Fragment>
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

const Decadent = ({ sets, type }) => (
  <Fragment>
    <blockquote className="game-mode-description">
      <p>Also known as "Rich Man's Draft" or "Decadent Sealed".</p>
      <p>Like a regular draft except each player chooses one card from the pack, discards the rest, then opens a new pack.</p>
    </blockquote>
    <div>
      Number of packs:{" "}
      <Select
        value={sets.length}
        onChange={App._emit("changeSetsNumber", type)}
        opts={_.seq(60, 36)} />
    </div>
    <div className="wrapper">
      <SetReplicated type={type} selectedSet={sets[0]} />
    </div>
  </Fragment>
);

Decadent.propTypes = {
  sets: PropTypes.array,
  type: PropTypes.string
};

const CubeDraft = () => (
  <Fragment>
    <blockquote className="game-mode-description">
      <p>A draft where each pack is a random set of cards from a large pool of cards called the "cube".</p>
    </blockquote>
    <div>
      <CubeList />
      <CubeOptions />
    </div>
  </Fragment>
);

const CubeSealed = () => (
  <Fragment>
    <blockquote className="game-mode-description">
      <p>Like sealed except each pack is a random set of cards from a large pool of cards called the "cube".</p>
    </blockquote>
    <div>
      <CubeList />
      <CubeSealedOptions />
    </div>
  </Fragment>
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
    {" "}cards / 
    <Select link="packs" opts={_.seq(12, 1)} />
    {" "}packs
  </div>
);

const ChaosDraft = () => (
  <Fragment>
    <blockquote className="game-mode-description">
      <p>A draft where each booster pack is from a random set.</p>
      <p>Take it up a notch with total chaos to build booster packs where each card in the pack is from a random set!</p>
    </blockquote>
    <Chaos packsNumber={"chaosDraftPacksNumber"} />
  </Fragment>
);

const ChaosSealed = () => (
  <Fragment>
    <blockquote className="game-mode-description">
      <p>Like sealed except each booster pack is from a random set.</p>
      <p>Take it up a notch with total chaos to build booster packs where each card in the pack is from a random set!</p>
    </blockquote>
    <Chaos packsNumber={"chaosSealedPacksNumber"}/>
  </Fragment>
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
  packsNumber: PropTypes.string
};

export default GameOptions;
