import React from "react"

import _ from "Lib/utils"
import App from 'Src/app'
import {getZone} from 'Src/cards'
import {Spaced} from 'Src/utils'

const Grid = ({zones}) => (
  <div>
    {zones.map(zone)}
  </div>
)

const zone = (zoneName) => {
  const zone = getZone(zoneName)
  const values = _.values(zone)
  const cards = _.flat(values)

  const zoneHelper
  = `${cards.length}
    ${zoneName === 'pack'
      ? ' /  ' + cards[0].packSize.toString()
      : ""}
    ${cards.length === 1 ? 'card' : 'cards' }`

  return (
    <div className='zone' key={_.uid()}>
      <h1>
        <Spaced elements={[zoneName, zoneHelper]}/>
      </h1>
      <Cards zoneName={zoneName} cards={cards} />
    </div>
  )
}

const Cards = ({cards, zoneName}) => {
  const doCard = (card) => {
    const isAutopickable = card => zoneName === 'pack' && card.isAutopick
    const className =
    `card ${isAutopickable(card) ? 'autopick-card ' : ''}
    card ${card.foil ? 'foil-card ' : ''}`

    const title
    = isAutopickable(card)
      ? 'This card will be automatically picked if your time expires.'
      : ''

    return (
      <span key={_.uid()}
        className={className}
        title={title}
        onClick={App._emit('click', zoneName, card.name)}>
        <img src={card.url} alt={card.name}/>
      </span>
    )
  }

  return cards.map(doCard)
}


export default Grid
