import reducer from "../reducers/reducer";
import * as types from "../actions/actionsPanel";

describe("Reducers", () => {
  it("should return the initial state", () => {
    const result = reducer([], { type: "unknown", payload: true });
    expect(result).toEqual([]);
  });

  it("should handle SET_POPUP", () => {
    const result = reducer([], { type: types.SET_POPUP, payload: true });
    expect(result).toEqual({ popupAvatar: true });
  });

  it("should handle CHANGE_RIGHT_BAR", () => {
    const result = reducer([], { type: types.CHANGE_RIGHT_BAR, payload: true });
    expect(result).toEqual({ rightBar: true });
  });

  it("should handle CHANGE_POPUP_DEV", () => {
    const result = reducer([], { type: types.SET_POPUP_DEV, payload: true });
    expect(result).toEqual({ popupDev: true });
  });
});
