import ErrorPage from "./error-page";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { FcApproval } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { firebaseApp, firebaseDatabase } from "../configs/firebase";
import { ref, child, get, set, update } from "firebase/database";
import { getAuth, updatePassword } from "firebase/auth";
import md5 from "md5";

import isEmail from "../helpers/is-email";

import {
  _signIn,
  _signOut,
  isEmailExists,
  createNewAccount,
  getCurrentAccount,
} from "../authentication/authentication";

const auth = getAuth(firebaseApp);

let SignIn = () => {
  let [emailState, setEmailState] = useState({
    inputClass: "",
    feedbackMsg: "",
  });
  let [passState, setPassState] = useState({ inputClass: "", feedbackMsg: "" });
  let [rePassState, setRePassState] = useState({
    inputClass: "",
    feedbackMsg: "",
  });
  let [currentPassword, getCurrentPassword] = useState("");
  let [notification, setNotification] = useState("");
  let [validForm, setValidForm] = useState(false);
  let [currentAccount, _getCurrentAccount] = useState({});

  let submitForm = async (event, signUpForm) => {
    event.preventDefault();

    let email = signUpForm[0].value.trim();
    let password = signUpForm[1].value.trim();
    let rePassword = signUpForm[2].value.trim();
    let isValidForm = true;

    if (!email || !isEmail(email) || !(await isEmailExists(email))) {
      if (!email) {
        setEmailState({
          inputClass: "is-invalid",
          feedbackMsg: "Vui lòng nhập email",
        });
        isValidForm = false;
      } else {
        if (!isEmail(email)) {
          setEmailState({
            inputClass: "is-invalid",
            feedbackMsg: "Định dạng email không hợp lệ",
          });
          isValidForm = false;
        } else {
          setEmailState({
            inputClass: "is-invalid",
            feedbackMsg: "Email này chưa được đăng ký",
          });
          isValidForm = false;
        }
      }
    } else {
      setEmailState({
        inputClass: "is-valid",
        feedbackMsg: "",
      });
    }

    if (!password) {
      setPassState({
        inputClass: "is-invalid",
        feedbackMsg: "Vui lòng nhập mật khẩu",
      });
      isValidForm = false;
    } else {
      let length = password.length;
      if (length < 6) {
        setPassState({
          inputClass: "is-invalid",
          feedbackMsg: "Độ dài mật khẩu ít nhất 6 kí tự",
        });
        isValidForm = false;
      } else {
        setPassState({
          inputClass: "is-valid",
          feedbackMsg: "",
        });
      }
    }

    if (!isValidForm) return;

    setValidForm(true);

    let result = await _signIn(email, password);
    if (result.status == "failure") {
      toast.error("Đăng nhập thất bại!");
      return;
    }

    getCurrentAccount(async ({ status, account }) => {
      const updates = {};
      updates[`users/${account.uid}/hashedPass`] = md5(password);
      await update(ref(firebaseDatabase), updates);
    });

    setValidForm(false);
    toast.success("Đăng nhập thành công!");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  useEffect(() => {
    document.title = "Đăng nhập";
  }, []);

  return (
    <div
      className="p-5 position-relative"
      aria-live="polite"
      aria-atomic="true"
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Container className="w-75 p-5 rounded-2 bg-white shadow-sm">
        <Row className="row-cols-2">
          <Col>
            <img src="/users/signup-page/mobile-login-animate.svg" alt="" />
          </Col>
          <Col>
            <h4 className="d-flex algin-items-center mb-4 fw-semibold">
              Đăng nhập vào hệ thống&nbsp;
            </h4>
            <Form onSubmit={(event) => submitForm(event, event.target)}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Email</Form.Label>
                <Form.Control
                  className={emailState.inputClass}
                  type="text"
                  placeholder="Nhập email..."
                  onBlur={async (event) => {
                    let email = event.target.value.trim();
                    if (
                      !email ||
                      !isEmail(email) ||
                      !(await isEmailExists(email))
                    ) {
                      if (!email) {
                        setEmailState({
                          inputClass: "is-invalid",
                          feedbackMsg: "Vui lòng nhập email",
                        });
                      } else {
                        if (!isEmail(email)) {
                          setEmailState({
                            inputClass: "is-invalid",
                            feedbackMsg: "Định dạng email không hợp lệ",
                          });
                        } else {
                          setEmailState({
                            inputClass: "is-invalid",
                            feedbackMsg: "Email này chưa được đăng ký",
                          });
                        }
                      }
                    } else {
                      setEmailState({
                        inputClass: "is-valid",
                        feedbackMsg: "",
                      });
                    }
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  {emailState.feedbackMsg}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Mật khẩu</Form.Label>
                <Form.Control
                  className={passState.inputClass}
                  type="password"
                  placeholder="Nhập mật khẩu..."
                  onChange={(event) => {
                    if (event.target.value) {
                      getCurrentPassword(event.target.value.trim());
                    } else {
                    }
                  }}
                  onBlur={(event) => {
                    let password = event.target.value.trim();
                    if (!password) {
                      setPassState({
                        inputClass: "is-invalid",
                        feedbackMsg: "Vui lòng nhập mật khẩu",
                      });
                    } else {
                      getCurrentPassword(password);
                      setPassState({
                        inputClass: "is-valid",
                        feedbackMsg: "",
                      });
                    }
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  {passState.feedbackMsg}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="d-flex flex-column mt-2">
                <Button
                  className="d-flex align-items-center justify-content-center"
                  variant="dark"
                  type="submit"
                >
                  {validForm ? (
                    <Spinner animation="border" role="status"></Spinner>
                  ) : (
                    <span>Đăng nhập</span>
                  )}
                </Button>
                <p className="mt-3 text-center">
                  <Link className="text-decoration-none " to="/resetpassword">
                    &nbsp; Quên mật khẩu
                  </Link>
                </p>
                <p className="text-center">
                  Chưa có tài khoản?
                  <Link className="text-decoration-none " to="/signUp">
                    &nbsp;Đăng ký
                  </Link>
                </p>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const signInRoute = {
  path: "/signin",
  element: <SignIn />,
  errorElement: <ErrorPage />,
  children: [],
};

export default signInRoute;
