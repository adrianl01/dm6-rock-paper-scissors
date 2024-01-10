import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getFirestore } from "firebase/firestore"
const firebaseConfig = ({
    apikey: "Gb114NwQJcuPTT4GsvCJCbRtJwsrmmMxQMJNgB65",
    databaseURL: "https://imessages-d5664-default-rtdb.firebaseio.com",
    authDomain: "imessages-d5664.firebaseapp.com",
    projectId: "imessages-d5664",
});

const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);
const fsdb = getFirestore(app)
export { rtdb, fsdb }
