import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set } from "firebase/database";
import fs from "node:fs";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

console.log("DB_URL:", process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL);
console.log("PROJECT_ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const data = JSON.parse(fs.readFileSync("./babysitters.json", "utf8"));

const base = ref(db, "nannies");

for (let i = 0; i < data.length; i += 1) {
  const nanny = data[i];
  const createdAt = Date.now() + i;
  const newRef = push(base);
  await set(newRef, { ...nanny, createdAt });
}

console.log("Seed done:", data.length);
