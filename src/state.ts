import { onValue, ref } from "firebase/database"
import { rtdb } from "./db"
import * as map from "lodash/map"
const API_BASE_URL = "http://localhost:3000"
import { Router } from "@vaadin/router";

const state = {
    data: {
        playerNumber: 0,
        playerName: "",
        roomId: "",
        rtdbRoomId: "",
        gameStatus: [],
    },
    listeners: [],
    init() {
        if (this.data.rtdbRoomId !== " ") {
            this.listenRoom()
        }

    },

    listenRoom() {
        console.log("listenRoom")
        const cs = this.getState();
        const db = rtdb;
        const chatroomsRef = ref(db, "/rooms/" + cs.rtdbRoomId);
        onValue(chatroomsRef, (snapshot => {
            const val = snapshot.val();
            const rtdbStatus = map(val);
            cs.gameStatus = rtdbStatus
            this.setState(cs);
            Router.go("/chat")
        }))
    },

    getState() {
        return this.data;
    },

    setName(name: string) {
        const currentState = this.getState();
        currentState.name = name;
        this.setState(currentState);
    },

    pushMessage(message: string) {
        console.log("mensaje del pushMessage" + message)
        const rtdbRoom = this.data.rtdbRoomId;
        const nombreDelState = this.data.fullName;
        fetch(API_BASE_URL + "/messages", {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                rtdbRoom: rtdbRoom,
                from: nombreDelState,
                message: message
            }),
        })
    },
    setPlayerName(playerName: string) {
        console.log("setPlayerName")
        const cs = this.getState();
        cs.playerName = playerName;
        this.setState(cs);
    },
    signUp() {
        console.log("esto es el signUp")
        const cs = this.getState();
        fetch(API_BASE_URL + "/signup", {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ email: cs.email, name: cs.fullName })
        }).then((res) => {
            return res.json();
        }).then(data => {
            console.log("data del sign up" + data.id)
            cs.userId = data.id;
            // console.log("User Id:", data.id);
            this.setState(cs);
            state.askNewRoom();
        })


    },
    singIn() {
        console.log("Inside singIn function")
        const cs = this.getState()
        if (cs.email) {
            fetch(API_BASE_URL + "/signin", {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ email: cs.email })
            }).then((res) => {
                return res.json();
            }).then(data => {
                cs.userId = data.id;
                console.log("User Id:", data.id);
                this.setState(cs);
                state.accessToRoom();
            })
        } else {
            console.error("No hay un email en el state");
        }
        // lunes 9/10/2023 19:16, agregar el endpoint signUp. Update: lunes 30/10/2023, ya estan todos los enpoints listos hace una semana.
    },

    askNewRoom() {
        console.log("askNewRoom");
        const cs = this.getState();
        if (cs.playerName) {
            fetch(API_BASE_URL + "/rooms", {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ playerName: cs.playerName })
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