[![CircleCI](https://circleci.com/gh/SongoMen/Learning-Hub.svg?style=svg)](https://circleci.com/gh/SongoMen/Learning-Hub)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/65407de27f98477b810a9888f6e6d5c7)](https://www.codacy.com/manual/pat.kozlowski2000/learning-app?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=SongoMen/learning-app&amp;utm_campaign=Badge_Grade)
[![codecov](https://codecov.io/gh/SongoMen/Learning-Hub/branch/master/graph/badge.svg)](https://codecov.io/gh/SongoMen/Learning-Hub)
<div>
  <img align="left" widt="70px" height="70px" src="https://github.com/SongoMen/learning-app/blob/master/public/favicon.ico"> 
  <h1>Learning Hub</h1>
</div>

Fast and easy learning platform where you can start courses and track your progress.  
  <br>
  
Technology stack: 
* React
* Firebase
* react-router
* Sass
* Jest
* Enzyme
<br>

## Live version: https://learning-a4a51.web.app/
<br>
 
## Running locally
1. Create file firebaseAuth.js inside components directory with your firebase informations:

```
// firebaseAuth.js file template

const config = {
  apiKey: "XXX",
  authDomain: "XXX",
  databaseURL: "XXX",
  projectId: "XXX",
  storageBucket: "XXX",
  messagingSenderId: "XXX",
  appId: "XXX",
  measurementId: "XXX"
};
export default config;
```
2. Install required modules:
```
$ npm install
```
3. Start application:
```
$ npm start
```
4. Open web browser to: http://localhost:3000/

TODO: 
* Tests
