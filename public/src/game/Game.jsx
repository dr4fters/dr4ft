import React, {Component} from "react"

import App from '../app'
import {Zones} from '../cards'
import PlayersPanel from "./PlayersPanel"
import StartPanel from "./StartPanel"
import DeckSettings from "./DeckSettings"
import GameSettings from "./GameSettings"
import {Checkbox} from "../utils"
import Cols from "./Cols"
import Grid from "./Grid"
import Chat from "./Chat"
import _ from "../../lib/utils"


export default class Game extends Component {
  //TODO: voir si on peut pas se passer du constructor (voir state = {})
  constructor(props) {
    super(props)
    this.state = this.props.state
    App.register(this)
  }
  componentWillMount() {
    App.state.players = []
    App.send('join', this.props.id)
    App.state.chat = true
  };
  componentDidMount() {
    this.timer = window.setInterval(decrement, 1e3)
  };
  componentWillUnmount() {
    window.clearInterval(this.timer)
  };
  componentWillReceiveProps({id}) {
    if (this.props.id === id) 
      return

    App.send('join', id)
  };
  render() {
    return <div className='container'>
      <audio id='beep' src='/media/beep.wav'/>,
      <div className='game'>
        <div className='game-controls'>
          <div className='game-status'>
            <PlayersPanel/>
            <StartPanel/>
          </div>
          <DeckSettings />
          <GameSettings/>
        </div>
        <Cards />
      </div>
      <Chat />
    </div>
  }
}

const Cards = () => {
    const pack = 
    Object.keys(Zones.pack).length ?
        <Grid zones={['pack']} />:
        <div/>
    const props = { zones: ['main', 'side', 'junk'] }
    const pool = App.state.cols ? <Cols {...props}/> : <Grid {...props} />
    return [pack, pool]
}

function decrement() {
  for (let p of App.state.players) 
    if (p.time) 
      p.time--; App.update()
}