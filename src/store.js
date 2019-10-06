import { createStore,applyMiddleware } from "redux";
import reducer from "./reducers/reducer";
import thunk from "redux-thunk";

function configureStore() {
  return createStore(
    reducer,
    {popup: "false"},
    applyMiddleware(thunk)
  );
}

export default configureStore;
