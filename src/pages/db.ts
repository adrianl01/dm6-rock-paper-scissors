import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getFirestore } from "firebase/firestore"
const firebaseConfig = ({
    apikey: process.env.API_KEY,
    databaseURL: process.env.DB_URL,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
});

const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);
const fsdb = getFirestore(app)
export { rtdb, fsdb }
