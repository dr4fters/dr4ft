import React, {Component} from "react";
import PropTypes from "prop-types";

import App from "../../app";
import {ZONE_PACK} from "../../zones";
import DefaultCard from "./CardDefault.jsx" // TODO just use CardBase.jsx
import "./CardGlimpse.scss"

class CardGlimpse extends Component {
  constructor (props) {
    super(props);

    // this.state = {
    //   isClicked: false
    // };

    // this.onClick = this.onClick.bind(this);
    this.onClickPickCard = this.onClickPickCard.bind(this);
    this.onClickBurnCard = this.onClickBurnCard.bind(this);
  }

  // onClick (e) {
  //   if (!this.state.isClicked) {
  //     e.stopPropagation(); //TOOD: Use specific Card with no onClick and change opacity of the card on click
  //     this.setState({
  //       isClicked: true,
  //     });
  //   }
  // }

  onClickPickCard (e) {
    e.stopPropagation();
    App.emit("click", this.props.zoneName, this.props.card);
    // this.setState({
    //   isClicked: false,
    // });
  }

  onClickBurnCard (e) {
    e.stopPropagation();
    App.emit("burn", this.props.card);
    // this.setState({
    //   isClicked: false,
    // });
  }
  

  render () {
    const {zoneName, card} = this.props;

    const isAutoPickable = zoneName === ZONE_PACK && App.state.gameState.isAutopick(card.cardId);
    const isAutoBurnable = App.state.gameState.isAutoremovableAutopick(card.cardId, App.state.picksPerPack);

    return (
      <div className='CardGlimpse' onClickCapture={this.onClick}>
        <DefaultCard card={card} zoneName={zoneName} />

        <div className="glimpse-options">
          <div className="pick" onClick={this.onClickPickCard} >
            <img src="/media/pick.svg" alt="Pick" />
          </div>

          <div className="burn" onClick={this.onClickBurnCard} >
            <img src="/media/burn.svg" alt="Burn" />
          </div>
        </div>

        <div className="glimpse-state">
          {isAutoPickable && <img src="/media/pick.svg" alt="Picked" />}
          {isAutoBurnable && <img src="/media/burn.svg" alt="Picked" />}
        </div>
      </div>
    );
  }
}

CardGlimpse.propTypes = {
  card: PropTypes.object.isRequired,
  zoneName: PropTypes.string.isRequired
};

export default CardGlimpse
