import React, {Component} from "react";
import PropTypes from "prop-types";

import App from "../../app";
import {ZONE_PACK} from "../../zones";
import CardBase from "./CardBase";
import "./CardDefault.scss";

// mixmix - this could be a stateless functional component
export default class CardDefault extends Component {
  render () {
    const { card, zoneName } = this.props;
    const isAutopickable = zoneName === ZONE_PACK && App.state.gameState.isAutopick(card.cardId);
    const isAutoremovableAutopick = App.state.gameState.isAutoremovableAutopick(card.cardId, App.state.picksPerPack);

    return (
      <div
        className="CardDefault"
        title={isAutopickable ? "This card will be automatically picked if your time expires." : ""}
        onClick={App._emit("click", zoneName, card)}
      >
        <CardBase card={card} zoneName={zoneName} />

        <div className="pick-state">
          {isAutopickable && <img src="/media/pick.svg" alt="Picked" />}
          {isAutoremovableAutopick && <img src="/media/autoremove.png" alt="Auto-removeable" />}
        </div>
      </div>
    );
  }
}

CardDefault.propTypes = {
  card: PropTypes.object.isRequired,
  zoneName: PropTypes.string.isRequired
};
