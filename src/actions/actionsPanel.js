export const SET_POPUP = "SET_POPUP";
export const CHANGE_RIGHT_BAR = "CHANGE_RIGHT_BAR";


export function setPopupAvatar(status) {
  return {
    type: SET_POPUP,
    payload: status
  };
}

export function changeRightBar(status) {
  return {
    type: CHANGE_RIGHT_BAR,
    payload: status
  };
}