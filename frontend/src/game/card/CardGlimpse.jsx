import React, {Component} from "react";
import PropTypes from "prop-types";

import App from "../../app";
import {ZONE_PACK} from "../../zones";
import CardBase from "./CardBase.jsx"
import CardDefault from "./CardDefault.jsx"
import SelectionState from "./SelectionState.jsx"
import "./CardGlimpse.scss"

class CardGlimpse extends Component {
  constructor (props) {
    super(props);

    this.onClickPickCard = this.onClickPickCard.bind(this);
    this.onClickBurnCard = this.onClickBurnCard.bind(this);
  }

  onClickPickCard (e) {
    e.stopPropagation();
    App.emit("click", this.props.zoneName, this.props.card);
  }

  onClickBurnCard (e) {
    e.stopPropagation();
    App.emit("burn", this.props.card);
  }

  render () {
    const {zoneName, card} = this.props;

    const Card = zoneName === ZONE_PACK ? CardBase : CardDefault
    const isPick = zoneName === ZONE_PACK && App.state.gameState.isPick(card.cardId);
    const isBurn = zoneName === ZONE_PACK && App.state.gameState.isBurn(card.cardId);

    return (
      <div className='CardGlimpse' onClickCapture={this.onClick}>
        <Card card={card} zoneName={zoneName} />

        <div className="glimpse-options">
          <div className="pick" onClick={this.onClickPickCard} >
            <i className="icon ion-android-checkbox" />
          </div>

          <div className="burn" onClick={this.onClickBurnCard} >
            <i className="icon ion-flame" />
          </div>
        </div>

        <SelectionState isPick={isPick} isBurn={isBurn} />
      </div>
    );
  }
}

CardGlimpse.propTypes = {
  card: PropTypes.object.isRequired,
  zoneName: PropTypes.string.isRequired
};

export default CardGlimpse;
