import React, {Component} from "react"

import {STRINGS} from '../config'
import Header from './Header'
import JoinPanel from './JoinPanel'
import NewsPanel from './NewsPanel'
import CreatePanel from './CreatePanel'
import Version from './Version'
import App from 'Src/app'

export default class Lobby extends Component {
  componentDidMount() {
    App.register(this)
  }
  render() {
    document.title = STRINGS.BRANDING.SITE_TITLE
    const { roomInfo, serverVersion } = App.state

    return (
      <div className="container">
        <div className="lobby">
          <Header/>
          <CreatePanel/>
          <JoinPanel roomInfo={roomInfo}/>
          <NewsPanel motd={STRINGS.PAGE_SECTIONS.MOTD}/>
          {STRINGS.BRANDING.PAYPAL}
          {STRINGS.PAGE_SECTIONS.FOOTER}
          <Version version={serverVersion}/>
        </div>
      </div>
    )
  }
}
