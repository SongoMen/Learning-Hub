import React from "react";
import ReactDOM from "react-dom";

import "./stylesheet/main.sass";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";

import configureStore from "./store";

import { Provider } from "react-redux";

ReactDOM.render(
  <Provider store={configureStore()}>
    <App />
  </Provider>,
  document.getElementById("root")
);
serviceWorker.register();
