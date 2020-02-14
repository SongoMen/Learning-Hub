import { createStore,applyMiddleware } from "redux";
import thunk from "redux-thunk";

import reducer from "./reducers/reducer";

function configureStore() {
  return createStore(
    reducer,
    {popupAvatar: "false",rightBar:"true",popupDev:"false"},
    applyMiddleware(thunk)
  );
}

export default configureStore;
