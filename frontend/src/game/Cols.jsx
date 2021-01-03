import React, {Component} from "react";
import PropTypes from "prop-types";

import App from "../app";
import {getZoneDisplayName} from "../zones";
import Spaced from "../components/Spaced";
import {getCardSrc, getFallbackSrc} from "../cardimage";
import CardBase from "./card/CardBase.jsx"

class Cols extends Component {
  constructor(props) {
    super(props);
    this.state={
      className: "right",
      card: undefined
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter(card, e) {
    let {offsetLeft} = e.target;
    let {clientWidth} = document.documentElement;

    let imgWidth = 240;
    let colWidth = 180;

    let className = offsetLeft + colWidth > clientWidth - imgWidth
      ? "left"
      : "right";

    if ("split" === card.layout) {
      className += " split-card";
    }

    if (card.foil) {
      className += " foil-card "; 
      // mixmix - I broke this by absorbing .foil-card into .CardBase.-foil (see CardBase.scss)
      // personally I don't care about whether pickedc cards in the col view display their foiliness
    }

    this.setState({ card, className });
  }
  onMouseLeave() {
    this.setState({
      card: undefined
    });
  }

  render() {
    return (
      <div>
        <Zones onMouseOver={this.onMouseEnter} zoneNames={this.props.zones} onMouseLeave={this.onMouseLeave} />
        <ImageHelper onMouseEnter={this.onMouseEnter} {...this.state} />
      </div>
    );
  }
}

Cols.propTypes = {
  zones: PropTypes.array.isRequired
};

const Zones = ({onMouseOver, zoneNames, onMouseLeave}) => {
  const renderZone = (zoneName) => {
    const zone = App.getSortedZone(zoneName);
    let sum = 0;
    let cols = [];

    for (let key in zone) {
      let items = zone[key].map((card, index) =>
        <div 
          className="card-col"
          key={index}
          onClick={App._emit("click", zoneName, card)}
          onMouseOver={e => onMouseOver(card, e)}
          onMouseLeave={onMouseLeave} >

          <CardBase card={card} />
        </div>
      );

      sum += items.length;
      cols.push(
        <div key={key} className='col'>
          <div>
            <strong>{`${key} (${items.length})`}</strong>
          </div>
          {items}
        </div>
      );
    }

    return (
      <div key={zoneName} className='zone'>
        <h1>
          <Spaced elements={[getZoneDisplayName(zoneName), sum]}/>
        </h1>
        {cols}
      </div>
    );
  };

  return zoneNames.map(renderZone);
};

const ImageHelper = ({onMouseEnter, className, card}) => {
  if (!card) return <div />

  return (
    card.isDoubleFaced
      ? <div className={className} id="doubleimg">
        <img className="card" src={getCardSrc(card)} onError= {getFallbackSrc(card)} onMouseEnter={onMouseEnter.bind(card)} />
        <img className={`card ${card.layout === "flip" ? "flipped" : ""}`}
          src={getCardSrc({ ...card, isBack: card.flippedIsBack, number: card.flippedNumber, })}
          onError={e => e.target.src = card.flippedCardURL}
          onMouseEnter={onMouseEnter.bind(card)} />
      </div>

      : <div id='img' className = {className}>
        <img
          className = "image-inner"
          onMouseEnter = {e => onMouseEnter(card, e)}
          onError= {getFallbackSrc(card)}
          src = {getCardSrc(card)} />
      </div>
  )
};

ImageHelper.propTypes = {
  onMouseEnter: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  card: PropTypes.object
};

export default Cols;
