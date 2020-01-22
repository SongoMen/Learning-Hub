import * as actions from "../actions/actionsPanel";

describe("Panel actions", () => {
  it("should create an action to hide/show rightbar", () => {
    const rightBar = "true";
    const expectedAction = {
      type: actions.CHANGE_RIGHT_BAR,
      payload: rightBar
    };
    expect(actions.changeRightBar(rightBar)).toEqual(expectedAction);
  });
  it("should create an action to hide/show popup", () => {
    const popup = "true";
    const expectedAction = {
      type: actions.SET_POPUP,
      payload: popup
    };
    expect(actions.setPopup(popup)).toEqual(expectedAction);
  });
  it("should create an action to hide/show dev popup", () => {
    const popupDev = "true";
    const expectedAction = {
      type: actions.SET_POPUP_DEV,
      payload: popupDev
    };
    expect(actions.setPopupDev(popupDev)).toEqual(expectedAction);
  });
});
