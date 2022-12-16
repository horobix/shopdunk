// Local Cart
export let getLocalCart = () => {
  let cart = localStorage.getItem("shopdunk_cart");

  return cart ? JSON.parse(cart) : [];
};

export let updateLocalCart = (newCart) => {
  localStorage.setItem("shopdunk_cart", JSON.stringify(newCart));
};

export let clearLocalCart = () => {
  localStorage.removeItem("shopdunk_cart");
};

export let addToLocalCart = (newProduct) => {
  let cart = getLocalCart();

  if (cart.length == 0) {
    cart.push(newProduct);
  } else {
    let flag = true;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].productId == newProduct.productId) {
        cart[i].quantity += newProduct.quantity;
        flag = false;
      }
    }

    if (flag) {
      cart.push(newProduct);
    }
  }

  updateLocalCart(cart);
};

export let removeFromLocalCart = (productId) => {
  let cart = getLocalCart();
  cart = cart.filter((product) => product.productId !== productId);

  updateLocalCart(cart);
};
