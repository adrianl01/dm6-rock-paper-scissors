import { fsdb, rtdb } from "./db"
import { onValue, ref } from "firebase/database"
import { collection, query, where, getDocs } from "firebase/firestore";
const roomsRef = collection(fsdb, "rooms")
import { funcRoomId } from "../components/room-id";
import { Router } from "@vaadin/router";
import { error } from "console";

console.log("port:", process.env.API_BASE_URL)

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
        cleaner: true,
        gameStatus:
        {
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
        }
        ,
        rooms: [],
        playerOnValue: "disabled",
        results: false
    },

    listeners: [],

    getState() { return this.data; },

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
    },

    setPlayerName(playerName: string) {
        const cs = this.getState();
        cs.playerName = playerName;
        this.setState(cs);
    },

    setRivalName(rivalName: string) {
        const cs = this.getState();
        cs.rivalName = rivalName;
        this.setState(cs);
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
        fetch(process.env.API_BASE_URL + "/signup", {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ player: currentPlayer })
        }).then((res) => {
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
                    state.singIn();
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
            fetch(process.env.API_BASE_URL + "/signin", {
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
                if (state.data.ownerName == true) {
                    state.roomId()
                }
                if (state.data.ownerName == false) { state.accessToRoom(); }
            })
        } else { console.error("No hay un email en el state"); }
        // lunes 9/10/2023 19:16, agregar el endpoint signUp. Update: lunes 30/10/2023, ya estan todos los enpoints listos hace una semana.
    },
    askNewRoom() {
        console.log("askNewRoom");
        const cs = this.getState();
        if (cs.playerName) {
            fetch(process.env.API_BASE_URL + "/rooms", {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ userId: cs.userId, playerName: cs.playerName })
            }).then((res) => {
                return res.json();
            }).then(data => {
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
        fetch(process.env.API_BASE_URL + "/rooms/" + roomIdState + "?userId=" + userIdState)
            .then((res) => {
                return res.json();
            }).then(async data => {
                cs.rtdbRoomId = data.rtdbRoomId;
                this.setState(cs);
                this.listenRoom();
            })
    },

    init() { if (this.data.rtdbRoomId !== " ") { this.listenRoom() } },

    roomCleaner() {
        console.log("roomCleaner");
        let player1 = state.data.playerName; let player2 = state.data.rivalName;
        const gameStatus = {
            player: player1,
            playerOnline: true,
            playerStatus: false,
            rival: player2,
            rivalOnline: true,
            rivalStatus: false,
            used: false,
            hands: {
                player: "",
                rival: ""
            }
        }
        const rtdbRoom = this.data.rtdbRoomId;
        // if (state.data.playerName !== undefined) { player1 = state.data.playerName };
        // if (state.data.playerName !== undefined) { player2 = state.data.rivalName };
        function fetcher() {
            const gameState = {
                gameStatus,
                player: player1,
                rival: player2,
                playerPoints: state.data.playerNumber,
                rivalPoints: state.data.rivalNumber,
                rtdbRoom: rtdbRoom,
            };
            fetch(process.env.API_BASE_URL + "/games", {
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(gameState),
            }).then(res => {
                console.log("Mensaje del roomCleaner:", res.statusText);
                if (res.statusText == "OK") { return state.data.cleaner = true };
            });
        }

        // if (state.data.cleaner == true) {
        console.log("roomCleaner");
        state.data.gameStatus.used = false;
        fetcher();
        if (location.pathname == "/game") { Router.go("instructions") }
        //     state.data.gameStatus.used = true
        //     fetcher()
        // } else if (state.data.ownerName == true) {
        //     if (rtdbStatus.used == true) {
        //         console.log("VACIANDO GAMESTATUS")
        //         fetcher();
        // state.listenRoom();
        // console.log("CAMBIO A /INSTRUCTIONS")
        // Router.go("/instructions");
        // }
        // else if (rtdbStatus.used == false) {
        //     console.log("YA ESTABA VACIO GAMESTATUS")
        //     state.data.cleaner = true
        //     state.listenRoom();
        //     // console.log("CAMBIO A /INSTRUCTIONS")
        //     // Router.go("/instructions");
        // }

        // else {
        //     console.log("jugador dos");
        //     state.data.cleaner = true
        //     state.listenRoom();
        // }
    },
    listenRoom() {
        console.log("listenRoom")
        const cs = state.data; const db = rtdb;
        const chatroomsRef = ref(db, "/rooms/" + cs.rtdbRoomId);
        if (cs.cleaner == true) {
            onValue(chatroomsRef, (snapshot => {
                const val = snapshot.val();
                const rtdbStatus = val.gameState;
                console.log(rtdbStatus);
                console.log("onValue RTDBGameStatus")
                if (state.data.ownerName == true) {
                    console.log(rtdbStatus.rival)
                    console.log("OBTAINING PLAYER TWO INFO")
                    cs.gameStatus = rtdbStatus.gameStatus;
                    cs.rivalName = rtdbStatus.rival;
                    cs.playerNumber = rtdbStatus.playerPoints;
                    cs.rivalNumber = rtdbStatus.rivalPoints
                    this.setState(cs);
                    if (location.pathname === "/newgame") { Router.go("instructions") };
                    if (location.pathname === "/game") { if (state.data.results) { Router.go("/instructions") } }
                } else if (state.data.ownerName == false) {
                    console.log("OBTAINING PLAYER ONE INFO");
                    cs.gameStatus = rtdbStatus.gameStatus;
                    cs.playerName = rtdbStatus.player;
                    cs.playerNumber = rtdbStatus.playerPoints;
                    cs.rivalNumber = rtdbStatus.rivalPoints
                    this.setState(cs);
                    if (location.pathname === "/gameroom") { Router.go("instructions") };
                    if (location.pathname === "/game") { if (state.data.results) { Router.go("/instructions") } }
                }
            }))
        }
    },

    pushGame(gameStatus) {
        console.log("pushGame")
        const rtdbRoom = this.data.rtdbRoomId;
        let player1 = "";
        let player2 = "";
        if (state.data.playerName !== undefined) { player1 = state.data.playerName };
        if (state.data.playerName !== undefined) { player2 = state.data.rivalName };
        // const nameId = 1000 + Math.floor(Math.random() * 999)
        // const stringedGameStatus = JSON.stringify(gameStatus)
        // const strngNameId = JSON.stringify(nameId)
        // const strngGameStatus = '{' + '"' + strngNameId + "matchStatus" + '"' + ':' + stringedGameStatus + '}';
        // const gameStatusReady = JSON.parse(strngGameStatus)
        // gameStatusList.push(gameStatusReady)
        console.log(gameStatus)
        console.log(player1, player2);
        const gameState = {
            gameStatus,
            playerPoints: state.data.playerNumber,
            rivalPoints: state.data.rivalNumber,
            player: player1,
            rival: player2,
            rtdbRoom: rtdbRoom,
        };
        state.data.gameStatus.used = true
        fetch(process.env.API_BASE_URL + "/games", {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(gameState),
        })
            .then(res => {
                console.log(res.statusText)
            })
        state.data.playerOnValue = "enabled";
    },

    async pushGameAsync(gameStatus) {
        console.log("PUSHGAME EN EL ASYNC PUSHGAME")
        let res = await state.pushGame(gameStatus);
        console.log(res)
    },

    // playerOne() {
    //     const ownerName = state.data.ownerName;
    //     fetch(process.env.API_BASE_URL + "/games", {
    //         method: "post",
    //         headers: {
    //             "content-type": "application/json",
    //         },
    //         body: JSON.stringify(ownerName),
    //     })
    // },

    roomId() {
        console.log("roomId");
        const userId = state.data.userId;
        const q = query(roomsRef, where("userId", "==", userId));
        getDocs(q).then(res => {
            res.forEach((n) => {
                {
                    state.data.rooms.push(n.id)
                }
            })
        }).then(() => {
            console.log(state.data.rooms.length)
            if (state.data.rooms.length > 0) { console.log("funcRoomId from State"); funcRoomId(); }
            else { console.log("New room is created due to lack of it"); state.askNewRoom(); };
        });
    },

    hands(hands) {
        console.log("pushGame Hands")
        const rtdbRoom = this.data.rtdbRoomId;
        let player1 = "";
        let player2 = "";
        if (state.data.playerName !== undefined) { player1 = state.data.playerName };
        if (state.data.playerName !== undefined) { player2 = state.data.rivalName };
        const handsStatus = hands;
        const gameStatus = state.data.gameStatus;
        console.log(handsStatus);
        const gameState = {
            gameStatus,
            handsStatus,
            player: player1,
            rival: player2,
            rtdbRoom: rtdbRoom,
        };
        state.data.gameStatus.used = true
        fetch(process.env.API_BASE_URL + "/games", {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(gameState),
        })
            .then(res => {
                console.log(res.statusText)
            })
    }
}

export { state }