import * as firebase from "firebase";

const onAuthStateChanged = jest.fn();

const getRedirectResult = jest.fn(() => {
  return Promise.resolve({
    user: {
      displayName: "redirectResultTestDisplayName",
      email: "redirectTest@test.com",
    }
  });
});

const sendPasswordResetEmail = jest.fn(() => Promise.resolve());

// INITIALIZE APP

jest.spyOn(firebase, "auth").mockImplementation(() => {
  return {
    onAuthStateChanged,
    currentUser: {
      displayName: "testDisplayName",
      email: "test@test.com",
    },
    getRedirectResult,
    sendPasswordResetEmail
  };
});

test("firebase.auth().getRedirectResult", async () => {
    const result = await firebase.auth().getRedirectResult()
    expect(result).toEqual({
      user: {
        displayName: "redirectResultTestDisplayName",
        email: "redirectTest@test.com",
      }
    })
    expect(firebase.auth).toHaveBeenCalled();
    expect(getRedirectResult).toHaveBeenCalled();
  });
  