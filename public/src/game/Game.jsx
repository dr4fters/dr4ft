import React, {Component} from "react"

import _ from "Lib/utils"
import App from 'Src/app'
import {Zones} from 'Src/cards'
import {Checkbox} from "Src/utils"

import PlayersPanel from "./PlayersPanel"
import StartPanel from "./StartPanel"
import DeckSettings from "./DeckSettings"
import GameSettings from "./GameSettings"
import Cols from "./Cols"
import Grid from "./Grid"
import Chat from "./Chat"


export default class Game extends Component {
  constructor(props) {
    super(props)
    this.state = this.props.state
    App.register(this)
  }
  componentWillMount() {
    App.state.players = []
    App.send('join', this.props.id)
    App.state.chat = true
  }

  componentWillReceiveProps({id}) {
    if (this.props.id === id)
      return

    App.send('join', id)
  }

  render() {
    return (
      <div className='container'>
        <audio id='beep' src='/media/beep.wav'/>
        <div className='game'>
          <div className='game-controls'>
            <div className='game-status'>
              <PlayersPanel/>
              <StartPanel/>
            </div>
            <DeckSettings />
            <GameSettings/>
          </div>
          <CardsZone />
        </div>
        <Chat />
      </div>
    )
  }
}

const CardsZone = () => {
  const pack
  = Object.keys(Zones.pack).length
    ? <Grid key={_.uid()} zones={['pack']} />
    : <div key={_.uid()}/>
  const props = { zones: ['main', 'side', 'junk'] }
  const pool = App.state.cols ? <Cols key={_.uid()} {...props}/> : <Grid key={_.uid()} {...props} />
  return [pack, pool]
}
