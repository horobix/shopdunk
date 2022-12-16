import ErrorPage from "./error-page";

import { _signOut } from "../authentication/authentication";
import { useEffect } from "react";
import { clearLocalCart } from "./partials/cart-manage";

let SignOut = () => {
  useEffect(() => {
    _signOut();
    clearLocalCart();
    window.location.href = "/signin";
  });
  return <></>;
};
const signOutRoute = {
  path: "/signout",
  element: <SignOut />,
  errorElement: <ErrorPage />,
  children: [],
};

export default signOutRoute;
