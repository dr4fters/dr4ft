import React, {Component} from "react";
import PropTypes from "prop-types";

import App from "../app";
import {getZone} from "../cards";
import {Spaced} from "../utils.jsx";

const isURLScryfall = (url) => {
  try {
    return /scryfall\.com/.test(new URL(url).hostname);
  }catch(err) {
    return false;
  }
};

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
        <ImageHelper onMouseEnter={this.onMouseEnter}
          className={this.state.className}
          card={this.state.card} />
      </div>
    );
  }
}

Cols.propTypes = {
  zones: PropTypes.array.isRequired
};

const Zones = ({onMouseOver, zoneNames, onMouseLeave}) => {
  const renderZone = (zoneName) => {
    const zone = getZone(zoneName);
    let sum = 0;
    let cols = [];

    for (let key in zone) {
      let items = zone[key].map((card, index) =>
        <div key={index}
          onClick={App._emit("click", zoneName, card.name)}
          onMouseOver={e => onMouseOver(card, e)}
          onMouseLeave={onMouseLeave} >
          <img src={isURLScryfall(card.url)
            ? `${card.url}&version=${App.state.cardSize}`
            : card.url}
          alt={card.name} />
        </div>
      );

      sum += items.length;
      cols.push(
        <div key={key} className='col'>
          <div>
            {`${key} - ${items.length} cards`}
          </div>
          {items}
        </div>
      );
    }

    return (
      <div key={zoneName} className='zone'>
        <h1>
          <Spaced elements={[zoneName, sum]}/>
        </h1>
        {cols}
      </div>
    );
  };

  return zoneNames.map(renderZone);
};

const ImageHelper = ({onMouseEnter, className, card}) => (
  card
    ? card.isDoubleFaced
      ? <div className={className} id="doubleimg">
        <img className="card" src={card.url} onMouseEnter={e => onMouseEnter(card, e)} />
        <img className={`card ${card.layout === "flip" ? "flipped" : ""}`} src={card.flippedCardURL} onMouseEnter={e => onMouseEnter(card, e)} />
      </div>
      : <img className={className}
        id='img'
        onMouseEnter={e => onMouseEnter(card, e)}
        src={isURLScryfall(card.url)
          ? `${card.url}&version=${App.state.cardSize}`
          : card.url}/>
    : <div />
);

ImageHelper.propTypes = {
  onMouseEnter: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  card: PropTypes.object
};

export default Cols;
