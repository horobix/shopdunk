import { ref, child, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseApp, firebaseDatabase } from "../../configs/firebase";
import getCurrentCart from "./get-current-cart";

const auth = getAuth(firebaseApp);

let addToCart = (item, callback = null) => {
  getCurrentCart((cart) => {
    let isExists = cart.findIndex(
      (cartItem) => cartItem.productId == item.productId
    );

    if (isExists >= 0) {
      cart[isExists].quantity += item.quantity;
    } else {
      cart.push(item);
    }

    onAuthStateChanged(auth, async (user) => {
      let uid = user.uid;

      set(ref(firebaseDatabase, `users/${uid}/cart`), JSON.stringify(cart));

      if (callback) callback();
    });
  });
};

export default addToCart;
