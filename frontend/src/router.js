/* eslint-disable */
import React, { Suspense } from "react";
import { render } from "react-dom";

const Lobby = React.lazy(() => import("./lobby/Lobby"));
const Game = React.lazy(() => import("./game/Game"));
let App;

export default function router(_App) {
  App = _App;
  route();
  window.addEventListener("hashchange", route);
}

const Loading = () => {
  // return null
  return (
    <div style={{ padding: 30 }}>
      Loading...
    </div>
  )
}
function route() {
  let path = location.hash.slice(1);
  let [route, id] = path.split("/");
  let component;

  switch(route) {
  case "g":
    App.state.gameId = id;
    App.initGameState(id);
    App.state.players = [];
    App.send("join", id);
    App.once("gameInfos", App.updateGameInfos);
    component = (
      <Suspense fallback={Loading()}>
        <Game id={ id } />
      </Suspense>
    );
    break;
  case "":
    component = (
      <Suspense fallback={Loading()}>
        <Lobby />
      </Suspense>
    );
    break;
  default:
    return App.error(`not found: ${path}`);
  }

  render(component, document.getElementById("root"));
}
