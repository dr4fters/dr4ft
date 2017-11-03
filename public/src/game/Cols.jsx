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
    this.onMouseEnter = this.onMouseEnter.bind(this)
  }
  onMouseEnter(url, e) {
    let {offsetLeft} = e.target
    let {clientWidth} = document.documentElement

    let imgWidth = 240
    let colWidth = 180

    let className = offsetLeft + colWidth > clientWidth - imgWidth
      ? 'left'
      : 'right'

    this.setState({ url, className })
  }
  render() {
    return (
      <div>
        <Zones onMouseEnter={this.onMouseEnter} zoneNames={this.props.zones} />
        <ImageHelper onMouseEnter={this.onMouseEnter}
          className={this.state.className}
          src={this.state.url} />
      </div>
    )
  }
}

const Zones = ({onMouseEnter, zoneNames}) => {
  const renderZone = (zoneName) => {
    const zone = getZone(zoneName)
    let sum = 0
    let cols = []

    for (let key in zone) {
      let items = zone[key].map(card =>
        <div key={_.uid()}
             onClick={App._emit('click', zoneName, card.name)}
             onMouseEnter={e => onMouseEnter(card.url, e)} >
          <img src={card.url} alt={card.name} />
        </div>
      )

      sum += items.length
      cols.push(
        <div key={_.uid()} className='col'>
          <div>
            {`${key} - ${items.length} cards`}
          </div>
        {items}
        </div>
      )
    }

    return (
      <div key={_.uid()} className='zone'>
        <h1>
          {`${zoneName} ${sum}`}
        </h1>
        {cols}
      </div>
    )
  }

  return zoneNames.map(renderZone)
}

const ImageHelper = ({onMouseEnter, className, src}) => (
  src
  ? <img className={className}
       id='img'
       onMouseEnter={e => onMouseEnter(src, e)}
       src={src}/>
  : <div />
)

export default Cols
