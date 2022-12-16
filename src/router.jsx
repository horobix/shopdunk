import { createBrowserRouter } from "react-router-dom";

import indexRoute from "./routes/index";
import productsRoute from "./routes/products";
import productRoute from "./routes/product";
import signUpRoute from "./routes/sign-up";
import signInRoute from "./routes/sign-in";
import signOutRoute from "./routes/sign-out";
import resetPasswordRoute from "./routes/reset-password";
import emailVerifyRoute from "./routes/email-verify";
import accountRoute from "./routes/account";
import searchRoute from "./routes/search";
import cartRoute from "./routes/cart";
import placeOrderRoute from "./routes/place-order";
import placeOrderDoneRoute from "./routes/place-order-done";
import adminRoute from "./routes/admin";

const Router = createBrowserRouter([
  indexRoute,
  productsRoute,
  productRoute,
  signUpRoute,
  signInRoute,
  signOutRoute,
  resetPasswordRoute,
  emailVerifyRoute,
  accountRoute,
  searchRoute,
  placeOrderRoute,
  cartRoute,
  placeOrderDoneRoute,
  adminRoute,
]);

export default Router;
