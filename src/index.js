import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

var config = {
    apiKey: "AIzaSyACL1UaBkgMjdTMCnXRrvqakMsP5dkBYh8",
    authDomain: "info343-group.firebaseapp.com",
    databaseURL: "https://info343-group.firebaseio.com",
    projectId: "info343-group",
    storageBucket: "info343-group.appspot.com",
    messagingSenderId: "63549430360"
  };
firebase.initializeApp(config);

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));