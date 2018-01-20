import React, {Component} from "react"

import _ from "Lib/utils"
import App from "Src/app"

const READY_TITLE_TEXT
= 'The host may start the game once all users have clicked the "ready" checkbox.'

const PlayersPanel = () => (
  <fieldset className='fieldset'>
    <legend className='legend game-legend'>Players</legend>
    <PlayersTable />
  </fieldset>
)

const PlayersTable = ({players, columns}) => (
  <table id='players'>
    <tbody>
      <PlayerTableHeader />
      <PlayerEntries />
    </tbody>
  </table>
)

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
)

class PlayerEntries extends Component {
  decrement() {
    for (let p of App.state.players)
      if (p.time)
        p.time--; this.forceUpdate()
  }
  componentDidMount() {
    this.timer = window.setInterval(this.decrement.bind(this), 1e3)
  }
  componentWillUnmount() {
    window.clearInterval(this.timer)
  }
  render() {
    return (
      App.state.players.map((p,i) => <PlayerEntry key ={_.uid()} player={p} index={i} />)
    )
  }
}

const PlayerEntry = ({player, index}) => {
  const {players, self, didGameStart, isHost} = App.state
  const {isBot, name, packs, time, hash} = player
  const {length} = players

  const opp
  = length % 2 === 0
    ? (self + length/2) % length
    : null

  const className
  = index === self
    ? 'self'
    : index === opp
      ? 'opp'
      : null

  const connectionStatusIndicator
  = <span className={isBot ? 'icon-bot' : 'icon-connected'}
          title={isBot ? 'This player is a bot.': ''} />

  const columns = [
    <td key={_.uid()}>{index + 1}</td>,
    <td key={_.uid()}>{connectionStatusIndicator}</td>,
    <td key={_.uid()}>{name}</td>,
    <td key={_.uid()}>{packs}</td>,
    <td key={_.uid()}>{time}</td>,
    <td key={_.uid()}>{hash && hash.cock}</td>,
    <td key={_.uid()}>{hash && hash.mws}</td>
  ]

  if (isHost) {
    //Move Player
    if(!didGameStart)
      columns.push(
        <td key={_.uid()}>
          <button onClick={()=> App.send('swap', [index, index - 1])}>
            <img src="../../media/arrow-up.png" width="16px"/>
          </button>
          <button onClick={()=> App.send('swap', [index, index + 1])}>
            <img src="../../media/arrow-down.png" width="16px"/>
          </button>
        </td>)
    //Kick button
    if (index !== self && !isBot)
      columns.push(
        <td key={_.uid()}>
          <button onClick={()=> App.send('kick', index)}>
            kick
          </button>
        </td>)
    else
      columns.push(<td key={_.uid()}/>)

  }

  return <tr key={_.uid()} className={className}>{columns}</tr>
}

export default PlayersPanel
