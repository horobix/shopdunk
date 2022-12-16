import { firebaseApp, firebaseDatabase } from "../configs/firebase";
import {
  signOut,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { get, set, query, ref, orderByChild, equalTo } from "firebase/database";

const auth = getAuth(firebaseApp);

export let isEmailExists = async (email) => {
  const existsUserRef = query(
    ref(firebaseDatabase, "users"),
    orderByChild("email"),
    equalTo(email)
  );

  let result = await get(existsUserRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return result;
};

export let createNewAccount = async (email, password) => {
  let result = await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return {
        isSuccess: true,
        newAccount: user,
      };
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return {
        isSuccess: false,
        errorCode: errorCode,
        errorMessage: errorMessage,
      };
    });

  return result;
};

export let _signIn = async (email, password) => {
  let result = await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return {
        status: "success",
        user: userCredential.user,
      };
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      return {
        status: "failure",
        errorCode: errorCode,
        errorMessage: errorMessage,
      };
    });

  return result;
};

export let _signOut = async () => {
  let result = await signOut(auth)
    .then(() => {
      return {
        status: "success",
      };
    })
    .catch((error) => {
      return {
        status: "failure",
      };
    });

  return result;
};

export let getCurrentAccount = (handler) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      handler({
        status: "signed-in",
        account: user,
      });
    } else {
      handler({
        status: "signed-out",
      });
    }
  });
};

export let sendPasswordResetMail = async (email) => {
  let result = await sendPasswordResetEmail(auth, email)
    .then(() => {
      return { status: "success" };
    })
    .catch((error) => {
      return {
        status: "failure",
        errorCode: errorCode,
        errorMessage: errorMessage,
      };
    });

  return result;
};
