import React from "react";

import { STRINGS } from "Src/config";
import { Spaced } from "Src/utils";
import App from "Src/app";

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
  <p className='error'>
    <div dangerouslySetInnerHTML={{__html: App.err}} />
  </p>
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
