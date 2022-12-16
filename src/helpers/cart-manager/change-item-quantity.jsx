import { ref, child, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseApp, firebaseDatabase } from "../../configs/firebase";
import getCurrentCart from "./get-current-cart";
import removeFromCart from "./remove-from-cart";

const auth = getAuth(firebaseApp);

let changeItemQuantity = (item) => {
  getCurrentCart((cart) => {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].productId == item.productId) {
        cart[i].quantity += item.change;
        cart[i].quantity = cart[i].quantity > 0 ? cart[i].quantity : 0;
        break;
      }
    }

    cart = cart.filter((item) => item.quantity);

    onAuthStateChanged(auth, async (user) => {
      let uid = user.uid;
      set(ref(firebaseDatabase, `users/${uid}/cart`), JSON.stringify(cart));
    });
  });
};

export default changeItemQuantity;
