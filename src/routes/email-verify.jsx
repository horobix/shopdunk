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

let EmailVerify = () => {
  let { uid } = useParams();

  let [email, getEmail] = useState("");

  useEffect(() => {
    let executor = async () => {
      document.title = "Xác nhận tài khoản";
      getCurrentAccount((result) => {
        sendEmailVerification(result.account);
      });
    };
    executor();
  }, []);

  return (
    <>
      <Container className="p-5">
        <Row className="align-items-center row-cols-2 p-4 bg-white">
          <Col>
            <img
              src="/users/email-verification/new-message-animate.svg"
              alt=""
            />
          </Col>
          <Col>
            <h4>
              Chúng tôi đã gửi cho bạn một email xác thực, vui lòng kiểm tra
              email!
            </h4>
          </Col>
          <Col className="d-flex col-12 justify-content-center ">
            <Link className="text-decoration-none fw-semibold" to="/">
              Trở về Trang chủ
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
};

const emailVerifyRoute = {
  path: "/emailverify/:uid",
  element: <EmailVerify />,
  errorElement: <ErrorPage />,
  children: [],
};

export default emailVerifyRoute;
