import _ from '../../lib/utils'
import App from '../app'
import {getZone} from '../cards'
import {Spaced} from '../utils'
import React from "react"

const Grid = ({zones}) => (
  <div>
    {zones.map(zone)}
  </div>
)

const zone = (zoneName) => {
  const zone = getZone(zoneName)
  const values = _.values(zone)
  const cards = _.flat(values)

  const isAutopickable = card => zoneName === 'pack' && card.isAutopick
  const zoneHelper = `${cards.length} 
          ${zoneName === 'pack' ? 
              ' /  ' + cards[0].packSize.toString() : 
              ""} 
          ${cards.length === 1 ? 'card' : 'cards' }`

  return (
    <div className='zone'>
      <h1>
        <Spaced elements={[zoneName, zoneHelper]}/>
      </h1>
      {cards.map(card => <span
        className={`card ${isAutopickable(card)
        ? 'autopick-card '
        : ''} card ${card.foil
          ? 'foil-card '
          : ''}`}
        title={isAutopickable(card)
        ? 'This card will be automatically picked if your time expires.'
        : ''}
        onClick={App._emit('click', zoneName, card.name)}>
        <img src={card.url} alt={card.name}/>
      </span>)}
    </div>
  )
}

export default Grid