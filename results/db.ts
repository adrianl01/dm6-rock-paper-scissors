import * as admin from "firebase-admin";
import * as serviceAccount from "./key.json"
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any)
});

// const firebaseConfig = {
//     apiKey: "AIzaSyAG7nhpICKL8q7SxU0sVyrpAmNx9w9TvLQ",
//     authDomain: "stone-papper-scissors-game.firebaseapp.com",
//     projectId: "stone-papper-scissors-game",
//     storageBucket: "stone-papper-scissors-game.appspot.com",
//     messagingSenderId: "867209374951",
//     appId: "1:867209374951:web:9936c4bf7f13a24ec70642",
//     measurementId: "G-YSNCS03T82"
// };

// // Initialize Firebase

// const app = initializeApp(firebaseConfig);

// ------------------
const fs = admin.firestore();
export { fs }




