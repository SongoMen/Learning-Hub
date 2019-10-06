import { createStore,applyMiddleware } from "redux";
import reducer from "./reducers/reducer";
import thunk from "redux-thunk";

function configureStore() {
  return createStore(
    reducer,
    {popupAvatar: "false",rightBar:"true"},
    applyMiddleware(thunk)
  );
}

export default configureStore;
