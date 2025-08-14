import React, {Component} from "react";
import PropTypes from "prop-types";

import App from "../app";
import {getZoneDisplayName} from "../zones";
import Spaced from "../components/Spaced";
import CardBase from "./card/CardBase.jsx";
import "./Cols.scss";

class Cols extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      <div className="Cols">
        <Zones onMouseOver={this.onMouseEnter} zoneNames={this.props.zones} onMouseLeave={this.onMouseLeave} />
        <CornerCardPreview {...this.state} />
      </div>
    );
  }
}

Cols.propTypes = {
  zones: PropTypes.array.isRequired,
  filter: PropTypes.filter
};

const Zones = ({onMouseOver, zoneNames, onMouseLeave, filter}) => {
  const renderZone = (zoneName) => {
    const zone = App.getSortedZone(zoneName, filter);
    let sum = 0;
    let cols = [];

    for (let key in zone) {
      let items = zone[key].map((card, index) =>
        <div
          className="card-container"
          key={`${index}-${card.uuid || card.name}`}
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

const CornerCardPreview = ({className, card}) => {
  // This is the on-hover enlarged helper you see in the bottom left when hovering over a card in column view
  if (!card) return <div />;

  return (
    <div className={`CornerCardPreview ${className}`}>
      <CardBase card={card} />
      {card.isDoubleFaced && <CardBase card={card} showFlipped />}
    </div>
  );
};

CornerCardPreview.propTypes = {
  className: PropTypes.string.isRequired,
  card: PropTypes.object
};

export default Cols;
