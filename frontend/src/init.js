import App from "./app";
import "./events";
import { default as router } from "./router";

import "./react-select-search.scss";

App.init(router);

if (module.hot) {
  module.hot.accept();
}
