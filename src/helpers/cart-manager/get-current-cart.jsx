import { ref, child, get } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseApp, firebaseDatabase } from "../../configs/firebase";

const auth = getAuth(firebaseApp);

let getCurrentCart = (handler) => {
  onAuthStateChanged(auth, async (user) => {
    let uid = user.uid;

    let cart = await get(child(ref(firebaseDatabase), `users/${uid}/cart`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          return JSON.parse(snapshot.val());
        } else {
          return [];
        }
      })
      .catch((error) => {
        console.error(error);
      });

    handler(cart);
  });
};

export default getCurrentCart;
