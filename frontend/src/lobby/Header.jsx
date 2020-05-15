import React from "react";

import { STRINGS } from "../config";
import Spaced from "../components/Spaced";
import App from "../app";

const Header = () => (
  <header>
    <h1 className="lobby-header">
      {STRINGS.BRANDING.SITE_NAME}
    </h1>
    <ServerInfo />
    <ApplicationError />
  </header>
);

const ApplicationError = () => (
  <p dangerouslySetInnerHTML={{__html: App.err}} className='error' />
);

const ServerInfo = () => {
  const { numUsers, numPlayers, numActiveGames } = App.state;
  const users = `${numUsers} ${numUsers === 1
    ? "user"
    : "users"} connected`;

  const players = `${numPlayers}
     ${numPlayers === 1
    ? "player"
    : "players"}
      playing ${numActiveGames}
        ${numActiveGames === 1
    ? "game"
    : "games"}`;

  return <p><Spaced elements={[users, players]} /></p>;
};

export default Header;
