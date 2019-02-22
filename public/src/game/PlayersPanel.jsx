import React, {Component} from "react";
import PropTypes from "prop-types";

import _ from "NodePackages/utils/utils";
import App from "Src/app";

const PlayersPanel = () => (
  <fieldset className='fieldset'>
    <legend className='legend game-legend'>Players</legend>
    <PlayersTable />
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
    <th key="3">name</th>
    <th key="4">packs</th>
    <th key="7">time</th>
    <th key="8">cock</th>
    <th key="9">mws</th>
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
  fixPackTimeToScreen()
}

const fixPackTimeToScreen = () => {
  const normalCss = 'position: relative; font-size: 16px; left: 0px; top: 0px; margin-right: 0px;'
  const fixedCss = 'position: fixed; font-size: 20px; left: 2px; top: 2px; margin-right: 20px; display: flex; justify-self: flex-end;'
  const {[0]: selfElem} = document.getElementsByClassName('self')
  const elem = document.getElementById('self-time')
  const rect = selfElem.getBoundingClientRect();
  elem.style.cssText 
  = rect.top < 0 && elem.innerHTML != '0'
    ? fixedCss
    : normalCss
}

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
    <td key={2}>{name}</td>,
    <td key={3}>{packs}</td>,
    <td id={className==='self' ? 'self-time':''} key={4}>{time}</td>,
    <td key={5}>{hash && hash.cock}</td>,
    <td key={6}>{hash && hash.mws}</td>
  ];

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

export default PlayersPanel;
