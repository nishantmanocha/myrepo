import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB2SqL8u-dxV12uTIK32yEPqLOJzW4rIBg",
  authDomain: "fineduguard.firebaseapp.com",
  projectId: "fineduguard",
  storageBucket: "fineduguard.firebasestorage.app",
  messagingSenderId: "391480015245",
  appId: "1:391480015245:web:0109d07434eddb12d6a5c4",
  measurementId: "G-DM2KR4SJ5J",
};

export const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);
export const auth = getAuth(app);
