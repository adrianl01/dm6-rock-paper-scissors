import express from "express";
import { rtdb, fsdb } from "./src/db";
import { ref, set } from "firebase/database"
import { doc, collection, addDoc, getDoc, getDocs, where, query, setDoc } from "firebase/firestore"
import cors from "cors"
import { v4 as uuid4 } from "uuid"

const port = 3000;
const app = express();
app.use(express.json())
app.use(cors())

const usersRef = collection(fsdb, "users")
const roomsRef = collection(fsdb, "rooms")
const roomShortId = 1000 + Math.floor(Math.random() * 999)
const createDocRoomsRef = doc(fsdb, "rooms/" + roomShortId.toString())

// -----------------------------------------------

app.post("/signup", function (req, res) {
    console.log(req.body)
    const name = req.body.player;
    console.log("datos en el sign up:" + name)
    const q = query(usersRef, where("name", "==", name))
    getDocs(q).then(searchRes => {
        console.log(searchRes.empty)
        if (searchRes.empty == true) {
            console.log("dentro del if")
            addDoc(usersRef, { name }).then(newUserRef => {
                res.json({ id: newUserRef.id, new: true, owner: name })
            })
        } else {
            console.log("dentro del otro if")
            res.status(400).json({ message: "user already exist" })
        }
    })
});

// -----------------------------------------------

app.post("/signin", (req, res) => {
    console.log(req.body)
    const name = req.body.player1
    console.log("---------------------------")
    console.log("nombre en el sign in:", name);
    const q = query(usersRef, where("name", "==", name))
    getDocs(q).then(searchRes => {
        if (searchRes.empty) {
            res.status(404).json({
                message: "not found"
            })
        } else {
            console.log(searchRes.docs[0].id)
            res.json({
                id: searchRes.docs[0].id
            })
        }
    })
})

// -----------------------------------------------

app.post("/rooms", function (req, res) {
    const userId = req.body.userId;
    const ownerName = req.body.playerName;
    getDoc(doc(usersRef, userId)).then(doc => {
        console.log("---------------------------")
        console.log("doc:", doc.data())
        if (doc.exists()) {
            console.log("userId:", userId)
            const rtdbRoomsRef = ref(rtdb, "rooms/" + uuid4())
            set(rtdbRoomsRef, {
                gameState: {
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
                    },
                    player: ownerName,
                    playerPoints: 0,
                    rival: "",
                    rivalPoints: 0,
                    rtdbRoom: "",
                },

            }).then(() => {
                const roomLongId = rtdbRoomsRef.key;
                setDoc(createDocRoomsRef, {
                    userId: userId,
                    rtdbRoomId: roomLongId
                }).then(() => {
                    res.json({
                        id: roomShortId.toString()
                    })
                })
            })
        } else {
            res.status(401).json({ message: "Necesistas crear una cuenta para crear una room" })
        }
    })
})

// -----------------------------------------------

app.get("/rooms/:roomId", function (req, res) {
    const { userId } = req.query;
    const { roomId } = req.params;
    console.log(userId, roomId)

    const docRoomsRef = doc(fsdb, "rooms/", roomId)
    getDoc(doc(usersRef, userId.toString())).then(doc => {
        if (doc.exists()) {
            getDoc(docRoomsRef).then((snap) => {
                const data = snap.data();
                console.log("---------------------------")
                console.log("roomData:", data)
                res.json(data)
            });
        } else {
            res.status(401).json({ message: "Necesitas crear una cuenta para crear una room" });
        };
    });
});

// -----------------------------------------------

app.post("/games", (req, res) => {
    console.log("---------------------------")
    console.log("esto es el endpoint games")
    const gameState = req.body
    console.log(gameState)
    const rtdbRoom = gameState.rtdbRoom
    const rtdbRoomsRef = ref(rtdb, "rooms/" + rtdbRoom)
    set(rtdbRoomsRef, {
        gameState,
    }).then(() => { res.json({ resMessage: "Message sent" }) })
})

app.use(express.static("dist"));
app.get("*", () => { __dirname + "/dist/index.html" })

app.get("/", (req, res) => {
    res.status(200).send("OK")
})

app.listen(port, () => {
    console.log(`Example app listening at ${port}`)
})













