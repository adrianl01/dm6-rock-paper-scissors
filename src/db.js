"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fsdb = exports.rtdb = void 0;
var app_1 = require("firebase/app");
var database_1 = require("firebase/database");
var firestore_1 = require("firebase/firestore");
var firebaseConfig = ({
    apikey: "Gb114NwQJcuPTT4GsvCJCbRtJwsrmmMxQMJNgB65",
    databaseURL: "https://imessages-d5664-default-rtdb.firebaseio.com",
    authDomain: "imessages-d5664.firebaseapp.com",
    projectId: "imessages-d5664",
});
var app = (0, app_1.initializeApp)(firebaseConfig);
var rtdb = (0, database_1.getDatabase)(app);
exports.rtdb = rtdb;
var fsdb = (0, firestore_1.getFirestore)(app);
exports.fsdb = fsdb;
