import React from "react";
import {MockFirebase} from "firebase-mock";
import config from "../components/firebaseAuth";
import * as firebase from "firebase/app";
// Login Actions
import {auth, logout, login, resetPassword} from "../components/auth";

describe("auth actions", () => {
  it("login should work", () => {
    login("example@domain.com", "12")
      .then((signedInUser: firebase.auth.UserCredential) => {
        let userInfo = signedInUser.user;
        if (userInfo != null) {
          expect(userInfo.email).toEqual("example@domain.com");
        }
      })
      .catch(e => {
        console.log(e);
      });
  });
  it("sign out should work", () => {
    logout()
      .then((signedInUser: firebase.auth.UserCredential) => {
        let userInfo = signedInUser;
        expect(userInfo).toEqual(undefined);
      })
      .catch(e => {
        console.log(e);
      });
  });
});
