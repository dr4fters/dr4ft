/* eslint-disable */
import React, { Suspense } from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import store from "./state/store";

const Lobby = React.lazy(() => import("./lobby/Lobby"));
const Game = React.lazy(() => import("./game/Game"));
let App;

export default function router(_App) {
  App = _App;
  route();
  window.addEventListener("hashchange", route);
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
      <Suspense fallback={<div>Loading...</div>}>
        <Provider store={store}>
          <Game id={ id } />
        </Provider>
      </Suspense>
    );
    break;
  case "":
    component = (
      <Suspense fallback={<div>Loading...</div>}>
        <Lobby />
      </Suspense>
    );
    break;
  default:
    return App.error(`not found: ${path}`);
  }

  render(component, document.getElementById("root"));
}
