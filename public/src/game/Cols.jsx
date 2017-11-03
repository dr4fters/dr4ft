import React, {Component} from "react"

import _ from "Lib/utils"
import App from 'Src/app'
import {getZone} from 'Src/cards'

class Cols extends Component {
  constructor(props) {
    super(props)
    this.state={
      className: 'right',
      url: undefined
    }
    this.enter = this.enter.bind(this)
    this.zone = this.zone.bind(this)
  }
  render() {
    const zones = this.props.zones.map(this.zone)
    let img = this.state.url && 
              <img className={this.state.className}
                   id='img'
                   onMouseEnter={this.enter.bind(this, this.state.url)}
                   src={this.state.url}/>
    return <div>{zones}{img}</div>
  };
  enter(url, e) {
    let {offsetLeft} = e.target
    let {clientWidth} = document.documentElement

    let imgWidth = 240
    let colWidth = 180

    let className = offsetLeft + colWidth > clientWidth - imgWidth
      ? 'left'
      : 'right'

    this.setState({ url, className })
  };
  zone(zoneName) {
    let zone = getZone(zoneName)

    let sum = 0
    let cols = []
    for (let key in zone) {
      let items = zone[key].map(card =>
        <div onClick= {App._emit('click', zoneName, card.name)}
             onMouseOver= {this.enter.bind(this, card.url)} >
          <img src= {card.url} alt= {card.name} />
        </div>
      )

      sum += items.length
      cols.push(
        <div className='col'>
          <div>
            {`${key} - ${items.length} cards`}
          </div>
        {items}
        </div>
      )
    }

    return (
      <div className='zone'>
        <h1>
          {`${zoneName} ${sum}`}
        </h1>
        {cols}
      </div>
    )
  }
}

export default Cols
