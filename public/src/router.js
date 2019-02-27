import React, { Suspense } from "react";
import { render } from "react-dom";

const Lobby = React.lazy(() => import("./lobby/Lobby"));
const Game = React.lazy(() => import("./game/Game"));
let App;

export default function(_App) {
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
    component = (
      <Suspense fallback={<div>Loading...</div>}>
        <Game id={ id } />
      </Suspense>
    );
    App.state.players = [];
    App.send("join", id);
    App.state.chat = true;
    App.once("gameInfos", (gameInfos) => App.updateFileName(gameInfos));
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
