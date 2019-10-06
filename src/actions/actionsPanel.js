export const SET_POPUP = "SET_POPUP";


export function SetPopup(status) {
  return {
    type: SET_POPUP,
    payload: status
  };
}