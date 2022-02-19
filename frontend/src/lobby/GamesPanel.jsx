import React from "react";
import PropTypes from "prop-types";

import CreateGameButton from "./CreateGameButton";

import "./GamesPanel.scss";

const GamesPanel = ({roomInfo}) => {
  return (
    <fieldset className='GamesPanel fieldset'>
      <legend className='legend'>Games</legend>
      {roomInfo.length
        ? <table className='join-game-table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Infos</th>
              <th>Players</th>
              <th/>
            </tr>
          </thead>
          <tbody>
            {roomInfo.map(room => <tr key={room}>
              <td>{room.title}</td>
              <td>{room.type}</td>
              <td>{room.packsInfo}</td>
              <td>{room.usedSeats}/{room.totalSeats}</td>
              <td>
                <a href={`#g/${room.id}`} className='join-game-link'>
                  <div>Join game</div>
                </a>
              </td>
            </tr>)}
          </tbody>
        </table>
        : "There are no public rooms open currently."}
      <CreateGameButton />
    </fieldset>
  );
};

GamesPanel.propTypes = {
  roomInfo: PropTypes.array
};

export default GamesPanel;
