import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/performance";
import 'firebase/analytics';

import config from "./firebaseAuth"

firebase.initializeApp(config);
firebase.analytics();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const firebaseAuth = firebase.auth;
export const db = firebase.firestore();

export function auth(email, pw) {
  let username = localStorage.getItem("user");
  return firebaseAuth()
    .createUserWithEmailAndPassword(email, pw)
    .then(function(newUser) {
      db.collection("users")
        .doc(newUser.user.uid)
        .set({
          email,
          username,
          admin: false,
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
      return firebase.auth().currentUser.updateProfile({
        displayName: username
      });
    });
}

export function logout() {
  return firebaseAuth().signOut();
}

export function login(email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw);
}

export function resetPassword(email) {
  return firebaseAuth().sendPasswordResetEmail(email);
}
