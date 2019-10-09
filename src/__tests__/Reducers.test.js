import reducer from "../reducers/reducer";
import * as types from "../actions/actionsPanel";

describe("Reducer", () => {
  it("should handle SET_POPUP", () => {
    expect(
      reducer([], {
        type: types.SET_POPUP,
        payload: true
      })
    ).toEqual({
      popupAvatar: true
    });
  });
  it("should handle CHANGE_RIGHT_BAR", () => {
    expect(
      reducer([], {
        type: types.CHANGE_RIGHT_BAR,
        payload: true
      })
    ).toEqual({
      rightBar: true
    });
  });
});
