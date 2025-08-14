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
    const isPick = zoneName === ZONE_PACK && App.state.gameState.isPick(card.cardId);

    return (
      <div
        className={`CardDefault ${card.type === "Leader"? "-leader" : ""} ${card.type === "Base"? "-base" : ""}`}
        title={isPick ? "This card will be automatically picked if your time expires." : ""}
        onClick={App._emit("click", zoneName, card)}
      >
        <CardBase card={card} zoneName={zoneName}/>
      </div>
    );
  }
}

CardDefault.propTypes = {
  card: PropTypes.object.isRequired,
  zoneName: PropTypes.string.isRequired
};
