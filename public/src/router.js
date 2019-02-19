import React from "react";
import { render } from "react-dom";

import Lobby from "./lobby/Lobby";
import Game  from "./game/Game";
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
    component = <Game id={ id } />;
    App.state.players = [];
    App.send("join", id);
    App.state.chat = true;
    break;
  case "":
    component = <Lobby />;
    break;
  default:
    return App.error(`not found: ${path}`);
  }

  render(component, document.getElementById("root"));
}
