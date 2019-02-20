import App from "./app";
import "./cards";
import router from "./router";

App.init(router);

if (module.hot) {
  module.hot.accept();
}
