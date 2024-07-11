import { auth } from "../config/firebaseConfig";
import {
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { useContext } from "react";
import { AuthContext } from "../component/authContext";

const useAuth = () => {
  return useContext(AuthContext);
};

const doSignInWithEmailAndPassword = async (email, password) => {
  return setPersistence(auth, browserSessionPersistence)
    .then(() => {
      return signInWithEmailAndPassword(auth, email, password);
    })
    .catch((error) => {
      console.error(error);
    });
};

const doSignOut = () => {
  return signOut(auth);
};

export { doSignInWithEmailAndPassword, doSignOut, useAuth };
