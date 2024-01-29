import { fsdb, rtdb } from "./db"
import { onValue, ref } from "firebase/database"
import { collection, query, where, getDocs } from "firebase/firestore";
const roomsRef = collection(fsdb, "rooms")
import * as map from "lodash/map"
const API_BASE_URL = "http://localhost:3000"
import { funcRoomId } from "../comps/room-id";
import { error } from "console";
import { Router } from "@vaadin/router";

const state = {
    data: {
        ownerName: false,
        playerNumber: 0,
        rivalNumber: 0,
        playerName: "",
        rivalName: "",
        userId: "",
        roomId: "",
        rtdbRoomId: "",
        gameStatus: [
            {
                player: "",
                playerOnline: false,
                playerStatus: false,
                rival: "",
                rivalOnline: false,
                rivalStatus: false,
            }
        ],
        rooms: [],
        playerOnValue: "disabled"
    },
    listeners: [],
    init() { if (this.data.rtdbRoomId !== " ") { this.listenRoom() } },
    listenRoom() {
        const cs = state.data; const db = rtdb;
        const chatroomsRef = ref(db, "/rooms/" + cs.rtdbRoomId);
        // function roomOnValue() {
        onValue(chatroomsRef, (snapshot => {
            const val = snapshot.val();
            const rtdbStatus = map(val);
            console.log("se ejecuta el onValue del GameStatus")
            const res = rtdbStatus[0].gameStatusList
            console.log(rtdbStatus[0].player, rtdbStatus[0].rival)
            if (rtdbStatus[0].rival !== "" && state.data.ownerName == true) {
                console.log("SE EJECUTA CUANDO SOY EL JUGADOR UNO y No pasa nada")
                console.log(rtdbStatus[0].gameStatusList)
                cs.gameStatus = rtdbStatus[0].gameStatusList;
                cs.rivalName = rtdbStatus[0].rival
                this.setState(cs);
            } else if (state.data.ownerName == false) {
                console.log("SE EJECUTA CUANDO NO SOY EL JUGADOR UNO")
                cs.gameStatus = rtdbStatus[0].gameStatusList;
                cs.playerName = rtdbStatus[0].player
                this.setState(cs);
            }
        }))
        // }
        // if (cs.rivalName !== "") { roomOnValue(); }
        // if (state.data.playerOnValue == "enabled") { roomOnValue(); }
    },

    getState() { return this.data; },

    pushGame(gameStatus) {
        const rtdbRoom = this.data.rtdbRoomId; const player1 = this.data.playerName; const player2 = this.data.rivalName;
        // const nameId = 1000 + Math.floor(Math.random() * 999)
        // const stringedGameStatus = JSON.stringify(gameStatus)
        // const strngNameId = JSON.stringify(nameId)
        // const strngGameStatus = '{' + '"' + strngNameId + "matchStatus" + '"' + ':' + stringedGameStatus + '}';
        // const gameStatusReady = JSON.parse(strngGameStatus)
        const gameStatusList = gameStatus
        // gameStatusList.push(gameStatusReady)
        const gameState = {
            gameStatusList,
            player: player1,
            rival: player2,
            rtdbRoom: rtdbRoom,
        }
        console.log(gameState)
        fetch(API_BASE_URL + "/games", {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(gameState),
        })
        state.data.playerOnValue = "enabled";
    },
    setPlayerName(playerName: string) {
        const cs = this.getState();
        cs.playerName = playerName;
        this.setState(cs);
    },
    setRivalName(playerName: string) {
        const cs = this.getState();
        cs.rivalName = playerName;
        this.setState(cs);
    },
    playerOne() {
        const ownerName = state.data.ownerName;
        fetch(API_BASE_URL + "/games", {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(ownerName),
        })
    },
    roomId() {
        const userId = state.data.userId;
        const q = query(roomsRef, where("userId", "==", userId));
        getDocs(q).then(res => {
            res.forEach((n) => {
                {
                    state.data.rooms.push(n.id)
                }
            })
            if (state.data.rooms.length > 0) { console.log("se ejecuta funcRoomId en el State"); funcRoomId(); }
            else { console.log("se ejecuta el signUp en el State"); state.signUp(); };
        });
        // setTimeout(() => {
        //     console.log(state.data.rooms);
        // }, 5000)
    },
    signUp() {
        console.log("esto es el signUp")
        const cs = state.data;
        var currentPlayer
        if (state.data.playerName == "") {
            currentPlayer = cs.rivalName
        } else {
            currentPlayer = cs.playerName
        }
        fetch(API_BASE_URL + "/signup", {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ player: currentPlayer })
        }).then((res) => {
            console.log(res.status)
            if (res.status == 400) {
                return error("ese perfil ya existe")
            } else { return res.json(); }
        })
            .then(data => {
                if (data == undefined) {
                    state.singIn()
                } else {
                    cs.userId = data.id;
                    this.setState(cs);
                    state.askNewRoom();
                }
            })
    },
    singIn() {
        console.log("Inside singIn function")
        const cs = this.getState()
        var currentPlayer
        if (state.data.playerName == "") {
            currentPlayer = cs.rivalName
        } else {
            currentPlayer = cs.playerName
        }
        if (currentPlayer) {
            fetch(API_BASE_URL + "/signin", {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ player1: currentPlayer })
            }).then((res) => {
                return res.json();
            }).then(data => {
                cs.userId = data.id;
                this.setState(cs);
                if (state.data.roomId == "") { state.roomId() } else { state.accessToRoom() }
                // if (state.data.roomId == "") { state.askNewRoom() } 
            })
        } else { console.error("No hay un email en el state"); }
        // lunes 9/10/2023 19:16, agregar el endpoint signUp. Update: lunes 30/10/2023, ya estan todos los enpoints listos hace una semana.
    },
    askNewRoom() {
        console.log("askNewRoom");
        const cs = this.getState();
        console.log(cs.userId)
        if (cs.playerName) {
            fetch(API_BASE_URL + "/rooms", {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ userId: cs.userId, playerName: cs.playerName })
            }).then((res) => {
                return res.json();
            }).then(data => {
                console.log(data)
                cs.roomId = data.id;
                this.setState(cs);
                state.accessToRoom();
            })

        } else {
            console.error("No hay userId")
        }
    },
    accessToRoom() {
        console.log("accessToRoom");
        const cs = this.getState();
        const roomIdState = cs.roomId;
        const userIdState = cs.userId;
        fetch(API_BASE_URL + "/rooms/" + roomIdState + "?userId=" + userIdState)
            .then((res) => {
                return res.json();
            }).then(data => {
                cs.rtdbRoomId = data.rtdbRoomId;
                this.setState(cs);
                this.listenRoom();
                console.log("CAMBIO A /INSTRUCTIONS")
                Router.go("/instructions");
            })
    },
    setState(newState) {
        this.data = newState;
        for (const cb of this.listeners) {
            cb();
        }
        // --------------------------
        console.log("State Changed", this.data)
        if (state.data.ownerName == false && state.data.playerName !== "" && state.data.rivalName !== "") { state.pushGame(state.data.gameStatus) }
    },
    subscribe(callback: (any) => any) {
        this.listeners.push(callback)
    }
}

export { state }