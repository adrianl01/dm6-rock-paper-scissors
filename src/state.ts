import { onValue, ref } from "firebase/database"
import { rtdb } from "./db"
import * as map from "lodash/map"
const API_BASE_URL = "http://localhost:3000"
import { Router } from "@vaadin/router";
import { error } from "console";

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
        gameStatus: []
    },
    listeners: [],
    init() { if (this.data.rtdbRoomId !== " ") { this.listenRoom() } },
    listenRoom() {
        console.log("listenRoom")
        const cs = state.data; const db = rtdb;
        const chatroomsRef = ref(db, "/rooms/" + cs.rtdbRoomId);
        if (state.data.ownerName == false) {
            onValue(chatroomsRef, (snap => {
                const val = snap.val();
                const rtdbStatus = map(val);
                console.log(rtdbStatus[0])
                if (rtdbStatus[0] == state.data.playerName) {
                    cs.ownerName = true;
                    this.setState(cs)
                } else {
                    state.data.rivalName = state.data.playerName;
                }
            }));
        }
        onValue(chatroomsRef, (snapshot => {
            const val = snapshot.val();
            const rtdbStatus = map(val);
            cs.gameStatus = rtdbStatus[0].gameStatusList;
            this.setState(cs);
        }))
    },

    getState() { return this.data; },

    pushGame(gameStatus) {
        const rtdbRoom = this.data.rtdbRoomId; const player1 = this.data.playerName; const player2 = this.data.rivalName;
        const nameId = 1000 + Math.floor(Math.random() * 999)
        const stringedGameStatus = JSON.stringify(gameStatus)
        const strngNameId = JSON.stringify(nameId)
        const strngGameStatus = '{' + '"' + strngNameId + "matchStatus" + '"' + ':' + stringedGameStatus + '}';
        const gameStatusReady = JSON.parse(strngGameStatus)
        const gameStatusList = state.data.gameStatus
        gameStatusList.push(gameStatusReady)
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
    },
    setPlayerName(playerName: string) {
        const cs = this.getState();
        cs.playerName = playerName;
        this.setState(cs);
    },
    setRivalName(playerName: string) {
        const cs = this.getState();
        cs.playerName = playerName;
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
    signUp() {
        console.log("esto es el signUp")
        const cs = state.data;
        console.log(cs.playerName)
        fetch(API_BASE_URL + "/signup", {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ player1: cs.playerName })
        }).then((res) => {
            console.log(res.status)
            if (res.status == 400) {
                return console.log("ese perfil ya existe")
            } else { return res.json(); }
        })
            .then(data => {
                if (data == undefined) {
                    state.singIn()
                } else {
                    cs.userId = data.id;
                    console.log("User Id:", data.id);
                    this.setState(cs);
                    state.singIn()
                }
            })
    },
    singIn() {
        console.log("Inside singIn function")
        const cs = this.getState()
        if (cs.playerName) {
            fetch(API_BASE_URL + "/signin", {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ player1: cs.playerName })
            }).then((res) => {
                return res.json();
            }).then(data => {
                cs.userId = data.id;
                console.log("User Id:", data.id);
                this.setState(cs);
                if (state.data.roomId == "") { state.askNewRoom() } else { state.accessToRoom() }
            })
        } else {
            console.error("No hay un email en el state");
        }
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
                console.log("rtdbId:", data.rtdbRoomId)
                console.log("el router se ejecuta")

            })
    },

    setState(newState) {
        this.data = newState;
        for (const cb of this.listeners) {
            cb();
        }
        // --------------------------
        console.log("State Changed", this.data)
    },
    subscribe(callback: (any) => any) {
        this.listeners.push(callback)
    }
}

export { state }