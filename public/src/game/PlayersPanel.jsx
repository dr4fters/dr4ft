import React, {Component} from "react";
import PropTypes from "prop-types";

import App from "../app";

const PlayersPanel = () => (
  <fieldset className='fieldset'>
    <legend className='legend game-legend'>Players</legend>
    <PlayersTable />
    <div id='self-time-fixed' hidden>
      <u>Time Left</u>
      <div id='self-time-fixed-time' />
    </div>
  </fieldset>
);

const PlayersTable = () => (
  <table id='players'>
    <tbody>
      <PlayerTableHeader />
      <PlayerEntries />
    </tbody>
  </table>
);

const PlayerTableHeader = () => (
  <tr>
    <th key="1">#</th>
    <th key="2"/>
    <th key="3">Drafter</th>
    <th className={App.state.isSealed ? "hidden": ""} key="4">Packs</th>
    <th className={App.state.isSealed ? "hidden": ""} key="5">Timer</th>
    <th key="6">Trice</th>
    <th key="7">MWS</th>
  </tr>
);

class PlayerEntries extends Component {
  decrement() {
    for (let p of App.state.players)
      if (p.time)
        p.time--; this.forceUpdate();
  }
  componentDidMount() {
    this.timer = window.setInterval(this.decrement.bind(this), 1e3);
  }
  componentWillUnmount() {
    window.clearInterval(this.timer);
  }
  render() {
    return (
      App.state.players.map((p,i) => <PlayerEntry key ={i} player={p} index={i} />)
    );
  }
}

window.onscroll = () => {
  fixPackTimeToScreen();
};

const fixPackTimeToScreen = () => {
  const selfTime = document.getElementById("self-time");
  const selfTimeFixed = document.getElementById("self-time-fixed");
  const {[0]: zone} = document.getElementsByClassName("zone");
  if (selfTime && selfTimeFixed) {
    const selfRect = selfTime.getBoundingClientRect();
    const zoneRect = zone.getBoundingClientRect();
    const selfTimeRect = selfTimeFixed.getBoundingClientRect();
    selfTimeFixed.hidden = !(App.state.round > 0 && selfRect.top < 0);
    selfTimeFixed.style.left = `${zoneRect.right - selfTimeRect.width - 5}px`;
    selfTimeFixed.style.top 
    = zoneRect.top > 0
        ? `${zoneRect.top + 5}px`
        : "5px";
  }
};

const PlayerEntry = ({player, index}) => {
  const {players, self, didGameStart, isHost, isSealed} = App.state;
  const {isBot, name, packs, time, hash} = player;
  const {length} = players;

  const opp
  = length % 2 === 0
    ? (self + length/2) % length
    : null;

  const className
  = index === self
    ? "self"
    : index === opp
      ? "opp"
      : null;

  const connectionStatusIndicator
  = <span className={isBot ? "icon-bot" : "icon-connected"}
    title={isBot ? "This player is a bot.": ""} />;

  const columns = [
    <td key={0}>{index + 1}</td>,
    <td key={1}>{connectionStatusIndicator}</td>,
    <td key={2}>{index === self ? <SelfName name={name} /> : name}</td>,
    <td key={3} className={isSealed ? "hidden": ""} >{packs}</td>,
    <td id={className==="self" ? "self-time":""} className={isSealed ? "hidden": ""} key={4}>{time}</td>,
    <td key={5}>{hash && hash.cock}</td>,
    <td key={6}>{hash && hash.mws}</td>
  ];

  const selfTimeFixed = document.getElementById("self-time-fixed-time");
  if (selfTimeFixed && className==="self") {
    selfTimeFixed.innerHTML = time;
    fixPackTimeToScreen();
  }

  if (isHost) {
    //Move Player
    if(!didGameStart)
      columns.push(
        <td key={7}>
          <button onClick={()=> App.send("swap", [index, index - 1])}>
            <img src="../../media/arrow-up.png" width="16px"/>
          </button>
          <button onClick={()=> App.send("swap", [index, index + 1])}>
            <img src="../../media/arrow-down.png" width="16px"/>
          </button>
        </td>);
    //Kick button
    if (index !== self && !isBot)
      columns.push(
        <td key={8}>
          <button onClick={()=> App.send("kick", index)}>
            kick
          </button>
        </td>);
    else
      columns.push(<td key={9}/>);

  }

  return <tr className={className}>{columns}</tr>;
};

PlayerEntry.propTypes = {
  player: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
};

const SelfName = ({ name }) => (
  <input
    style={{ width: "150px" }}
    type='text'
    maxLength={15}
    value={name}
    onChange={(e) => {
      App.save("name", e.currentTarget.value);
      App.send("name", e.currentTarget.value);
    }}
  />
);

SelfName.propTypes = {
  name: PropTypes.string.isRequired,
};

export default PlayersPanel;
