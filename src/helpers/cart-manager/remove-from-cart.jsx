import { ref, child, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseApp, firebaseDatabase } from "../../configs/firebase";
import getCurrentCart from "./get-current-cart";

const auth = getAuth(firebaseApp);

let removeFromCart = (productId) => {
  getCurrentCart((cart) => {
    cart = cart.filter((item) => item.productId != productId);

    onAuthStateChanged(auth, async (user) => {
      let uid = user.uid;
      set(ref(firebaseDatabase, `users/${uid}/cart`), JSON.stringify(cart));
    });
  });
};

export default removeFromCart;
