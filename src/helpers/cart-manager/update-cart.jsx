import { ref, child, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseApp, firebaseDatabase } from "../../configs/firebase";
import getCurrentCart from "./get-current-cart";

const auth = getAuth(firebaseApp);

let updateCart = (newCart) => {
  onAuthStateChanged(auth, async (user) => {
    let uid = user.uid;
    set(ref(firebaseDatabase, `users/${uid}/cart`), JSON.stringify(newCart));
  });
};

export default updateCart;
