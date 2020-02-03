import React from "react";
import {MockFirebase} from "firebase-mock";

// Login Actions
import {auth, logout, login, resetPassword} from "../components/auth";

function mockFirebaseService() {
  return new Promise(resolve => resolve(true));
}

jest.mock('firebase', () => new Promise(resolve => resolve(true)));

describe("auth actions", () => {

  beforeEach(() => {
    mockAuth = new MockFirebase();
  });

  it("signIn should call firebase", () => {
    const user = {
      email: "first.last@yum.com",
      password: "abd123",
    };
    auth(user.email, user.password);
    expect(mockFirebaseService).toHaveBeenCalled();
  });
});
