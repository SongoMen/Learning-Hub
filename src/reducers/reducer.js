import * as actions from "../actions/actionsPanel";

export default (state, action) => {
  switch (action.type) {
    case actions.SET_POPUP:
      return { ...state, popupAvatar: action.payload };
    case actions.CHANGE_RIGHT_BAR:
      return {...state, rightBar: action.payload};
    default:
      return state;
  }
};
