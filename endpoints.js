"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var db_1 = require("./src/db");
var database_1 = require("firebase/database");
var firestore_1 = require("firebase/firestore");
var cors_1 = require("cors");
var uuid_1 = require("uuid");
var port = 3000;
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
var usersRef = (0, firestore_1.collection)(db_1.fsdb, "users");
var roomsRef = (0, firestore_1.collection)(db_1.fsdb, "rooms");
var roomShortId = 1000 + Math.floor(Math.random() * 999);
var createDocRoomsRef = (0, firestore_1.doc)(db_1.fsdb, "rooms/" + roomShortId.toString());
// -----------------------------------------------
app.post("/signup", function (req, res) {
    console.log(req.body);
    var name = req.body.player;
    console.log("datos en el sign up:" + name);
    var q = (0, firestore_1.query)(usersRef, (0, firestore_1.where)("name", "==", name));
    (0, firestore_1.getDocs)(q).then(function (searchRes) {
        console.log(searchRes.empty);
        if (searchRes.empty == true) {
            console.log("dentro del if");
            (0, firestore_1.addDoc)(usersRef, { name: name }).then(function (newUserRef) {
                res.json({ id: newUserRef.id, new: true, owner: name });
            });
        }
        else {
            console.log("dentro del otro if");
            res.status(400).json({ message: "user already exist" });
        }
    });
});
// -----------------------------------------------
app.post("/signin", function (req, res) {
    console.log(req.body);
    var name = req.body.player1;
    console.log("---------------------------");
    console.log("nombre en el sign in:", name);
    var q = (0, firestore_1.query)(usersRef, (0, firestore_1.where)("name", "==", name));
    (0, firestore_1.getDocs)(q).then(function (searchRes) {
        if (searchRes.empty) {
            res.status(404).json({
                message: "not found"
            });
        }
        else {
            console.log(searchRes.docs[0].id);
            res.json({
                id: searchRes.docs[0].id
            });
        }
    });
});
// -----------------------------------------------
app.post("/rooms", function (req, res) {
    var userId = req.body.userId;
    var ownerName = req.body.playerName;
    (0, firestore_1.getDoc)((0, firestore_1.doc)(usersRef, userId)).then(function (doc) {
        console.log("---------------------------");
        console.log("doc:", doc.data());
        if (doc.exists()) {
            console.log("userId:", userId);
            var rtdbRoomsRef_1 = (0, database_1.ref)(db_1.rtdb, "rooms/" + (0, uuid_1.v4)());
            (0, database_1.set)(rtdbRoomsRef_1, {
                gameState: {
                    gameStatus: {
                        player: "",
                        playerOnline: false,
                        playerStatus: false,
                        rival: "",
                        rivalOnline: false,
                        rivalStatus: false,
                        used: true,
                        hands: {
                            player: "",
                            rival: ""
                        }
                    },
                    player: ownerName,
                    playerPoints: 0,
                    rival: "",
                    rivalPoints: 0,
                    rtdbRoom: "",
                },
            }).then(function () {
                var roomLongId = rtdbRoomsRef_1.key;
                (0, firestore_1.setDoc)(createDocRoomsRef, {
                    userId: userId,
                    rtdbRoomId: roomLongId
                }).then(function () {
                    res.json({
                        id: roomShortId.toString()
                    });
                });
            });
        }
        else {
            res.status(401).json({ message: "Necesistas crear una cuenta para crear una room" });
        }
    });
});
// -----------------------------------------------
app.get("/rooms/:roomId", function (req, res) {
    var userId = req.query.userId;
    var roomId = req.params.roomId;
    console.log(userId, roomId);
    var docRoomsRef = (0, firestore_1.doc)(db_1.fsdb, "rooms/", roomId);
    (0, firestore_1.getDoc)((0, firestore_1.doc)(usersRef, userId.toString())).then(function (doc) {
        if (doc.exists()) {
            (0, firestore_1.getDoc)(docRoomsRef).then(function (snap) {
                var data = snap.data();
                console.log("---------------------------");
                console.log("roomData:", data);
                res.json(data);
            });
        }
        else {
            res.status(401).json({ message: "Necesitas crear una cuenta para crear una room" });
        }
        ;
    });
});
// -----------------------------------------------
app.post("/games", function (req, res) {
    console.log("---------------------------");
    console.log("esto es el endpoint games");
    var gameState = req.body;
    console.log(gameState);
    var rtdbRoom = gameState.rtdbRoom;
    var rtdbRoomsRef = (0, database_1.ref)(db_1.rtdb, "rooms/" + rtdbRoom);
    (0, database_1.set)(rtdbRoomsRef, {
        gameState: gameState,
    }).then(function () { res.json({ resMessage: "Message sent" }); });
});
app.use(express_1.default.static("dist"));
app.get("*", function () { __dirname + "/dist/index.html"; });
app.get("/", function (req, res) {
    res.status(200).send("OK");
});
app.listen(port, function () {
    console.log("Example app listening at ".concat(port));
});
