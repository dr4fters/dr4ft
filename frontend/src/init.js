import App from "./app";
import "./events";
import { default as router } from "./router";

App.init(router);

if (module.hot) {
  module.hot.accept();
}
