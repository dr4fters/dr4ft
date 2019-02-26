import React, {Component} from "react";
import PropTypes from "prop-types";

import _ from "NodePackages/utils/utils";
import App from "Src/app";
import {getZone} from "Src/cards";
import {Spaced} from "Src/utils";

const Grid = ({zones}) => (
  <div>
    {zones.map(zone)}
  </div>
);

Grid.propTypes = {
  zones: PropTypes.array.isRequired
};

const zone = (zoneName, index) => {
  const zone = getZone(zoneName);
  const values = _.values(zone);
  const cards = _.flat(values);

  const zoneTitle = zoneName + (zoneName === "pack" ? " " + App.state.round : "");
  const zoneHelper = App.state.didGameStart
    ? zoneName === "pack"
      ? `Pick ${App.state.pickNumber} / ${cards[0].packSize}`
      : cards.length
    : 0;

  return (
    <div className='zone' key={index}>
      <h1>
        <Spaced elements={[zoneTitle, zoneHelper]}/>
      </h1>
      {cards.map((card, i) => <Card key={i+card.name} card={card} zoneName={zoneName} />)}
    </div>
  );
};
class Card extends Component {
  constructor(props) {
    super(props);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.getClassName = this.getClassName.bind(this);
    this.state = {
      url: props.card.url,
      className: this.getClassName()
    };
  }

  getClassName() {
    const {card, zoneName} = this.props;
    const isAutopickable = zoneName === "pack" && card.isAutopick;
    return `card 
    ${isAutopickable ? "autopick-card " : ""}
    ${card.foil ? "foil-card " : ""}`;
  }
  onMouseEnter() {
    if(this.props.card.isDoubleFaced) {
      this.setState({
        url: this.props.card.flippedCardURL,
        className: `${this.getClassName()} ${this.props.card.layout === "flip" ? "flipped" : ""}` 
      });
    }
  }
  onMouseLeave() {
    if(this.props.card.isDoubleFaced) {
      this.setState({
        url: this.props.card.url,
        className: this.getClassName()
      });
    }
  }
  render() {
    const {card, zoneName} = this.props;
    const isAutopickable = zoneName === "pack" && card.isAutopick;
    const title
    = isAutopickable
      ? "This card will be automatically picked if your time expires."
      : "";
    return (
      <span className={this.state.className}
        title={title}
        onClick={App._emit("click", zoneName, card.name)}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}>
        <img src={`${this.state.url}&version=${App.state.cardSize}`} alt={card.name}/>
      </span>
    );
  }
}
Card.propTypes = {
  card: PropTypes.object.isRequired,
  zoneName: PropTypes.string.isRequired
};
export default Grid;
