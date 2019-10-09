export const SET_POPUP = "SET_POPUP";
export const SET_POPUP_DEV = "SET_POPUP_DEV";
export const CHANGE_RIGHT_BAR = "CHANGE_RIGHT_BAR";


export function setPopup(status) {
  return {
    type: SET_POPUP,
    payload: status
  };
}

export function setPopupDev(status) {
  return {
    type: SET_POPUP_DEV,
    payload: status
  };
}

export function changeRightBar(status) {
  return {
    type: CHANGE_RIGHT_BAR,
    payload: status
  };
}