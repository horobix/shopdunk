import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  get,
  ref,
  child,
  equalTo,
  query,
  orderByChild,
} from "firebase/database";
import { firebaseApp, firebaseDatabase } from "../configs/firebase";

const auth = getAuth(firebaseApp);
import { getAuth, sendEmailVerification } from "firebase/auth";

import { getCurrentAccount } from "../authentication/authentication";
import ErrorPage from "./error-page";

import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

let PlaceOrderDone = () => {
  let { uid } = useParams();

  let [email, getEmail] = useState("");

  useEffect(() => {
    let executor = async () => {
      document.title = "Đặt hàng thành công!";
    };
    executor();
  }, []);

  return (
    <>
      <Container className="p-3">
        <div
          className="d-flex flex-column align-items-center bg-white rounded-4 p-5"
          style={{ boxShadow: "0px 0px 8px 0px rgb(0 0 0 / 4%)" }}
        >
          <div style={{ width: "500px" }}>
            <img className="w-100" src="/delivery-animate.svg" alt="" />
          </div>
          <div>
            <h4 className="text-center">Đặt hàng thành công!🎉</h4>
            <p className="text-center">
              Đơn hàng sẽ được giao đến tay bạn sớm nhất.
            </p>
          </div>
          <div>
            <Link className="text-decoration-none fw-semibold" to="/">
              Trở về Trang chủ
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
};

const placeOrderDoneRoute = {
  path: "/place-order-done",
  element: <PlaceOrderDone />,
  errorElement: <ErrorPage />,
  children: [],
};

export default placeOrderDoneRoute;
