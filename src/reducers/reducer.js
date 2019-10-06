import * as actions from "../actions/actionsPanel";

export default (state, action) => {
  switch (action.type) {
    case actions.SET_POPUP:
      return { ...state, popup: action.payload };
    default:
      return state;
  }
};
