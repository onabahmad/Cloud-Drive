import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBlrCAN_ZeS0eyNxclOxtV549R2Pl2Epps",
  authDomain: "cloud-drive-d971f.firebaseapp.com",
  projectId: "cloud-drive-d971f",
  storageBucket: "cloud-drive-d971f.appspot.com",
  messagingSenderId: "766523401169",
  appId: "1:766523401169:web:95e3f4f5efc1997bf2b6f0",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const database = getDatabase(app);
