import React, {Component} from "react";
import PropTypes from "prop-types";

import App from "../app";
import "./PlayersPanel.scss"

const PlayersPanel = () => (
  <fieldset className='PlayersPanel fieldset'>
    <legend className='legend game-legend'>Players ({App.state.players.length}/{App.state.gameSeats})</legend>
    <PlayersTable />
    <div id='self-time-fixed' hidden>
      <div className='label'>Time left</div>
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
    <th key="4" className={columnVisibility("packs")}>Packs</th>
    <th key="5" className={columnVisibility("timer")}>Timer</th>
    <th key="6" className={columnVisibility("trice")}>Hash</th>
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
  if (selfTime && selfTimeFixed && zone) {
    const selfRect = selfTime.getBoundingClientRect();
    const zoneRect = zone.getBoundingClientRect();
    const selfTimeRect = selfTimeFixed.getBoundingClientRect();
    selfTimeFixed.hidden = !(App.state.round > 0 && selfRect.top < 0);
    selfTimeFixed.style.left = `${zoneRect.right - selfTimeRect.width}px`;
    selfTimeFixed.style.top
    = zoneRect.top > 0
        ? `${zoneRect.top + 5}px`
        : "5px";
  }
};

const columnVisibility = (columnName) => {
  switch(columnName) {
  case "packs":
    return App.state.isGameFinished || !App.state.didGameStart || App.state.isSealed ? "hidden" : "";
  case "timer":
    return App.state.isGameFinished || !App.state.didGameStart || App.state.isSealed ? "hidden" : "";
  case "trice":
    return !App.state.isGameFinished ? "hidden" : "";
  default:
    return "";
  }
};

const PlayerEntry = ({player, index}) => {
  const {players, self, didGameStart, isHost} = App.state;
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
    <td key={2}>{index === self ? <SelfName name={App.state.name} /> : name}</td>,
    <td key={3} className={columnVisibility("packs")} >{packs}</td>,
    <td key={4} id={className==="self" ? "self-time":""} className={columnVisibility("timer")}>{time}</td>,
    <td key={5} className={columnVisibility("trice")}>{hash && hash.cock}</td>,
  ];

  const selfTimeFixed = document.getElementById("self-time-fixed-time");
  if (selfTimeFixed && className==="self") {
    selfTimeFixed.innerHTML = time;
    fixPackTimeToScreen();
  }

  if (isHost) {
    //Move Player
    if (!didGameStart && length > 1)
      columns.push(
        <td key={6}>
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
        <td key={7}>
          <button onClick={()=> App.send("kick", index)}>
            Kick
          </button>
        </td>);
    else
      columns.push(<td key={8}/>);

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
    }}
    onBlur={(e) => {
      App.send("name", e.currentTarget.value);
    }}
  />
);

SelfName.propTypes = {
  name: PropTypes.string.isRequired,
};

export default PlayersPanel;
