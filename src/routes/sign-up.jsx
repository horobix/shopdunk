import ErrorPage from "./error-page";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { firebaseDatabase } from "../configs/firebase";
import { set, ref } from "firebase/database";

import isEmail from "../helpers/is-email";
import md5 from "md5";

import {
  _signIn,
  _signOut,
  isEmailExists,
  createNewAccount,
  getCurrentAccount,
} from "../authentication/authentication";

let SignUp = () => {
  let [isShowRepass, toggleRepass] = useState(false);
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

  let submitForm = async (event, signUpForm) => {
    event.preventDefault();

    let email = signUpForm[0].value.trim();
    let password = signUpForm[1].value.trim();
    let rePassword = signUpForm[2].value.trim();
    let isValidForm = true;

    if (!email || !isEmail(email) || (await isEmailExists(email))) {
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
            feedbackMsg: "Email này đã được sử dụng",
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

    if (!rePassword) {
      setRePassState({
        inputClass: "is-invalid",
        feedbackMsg: "Vui lòng nhập lại mật khẩu",
      });
      isValidForm = false;
    } else {
      if (currentPassword == rePassword) {
        setRePassState({
          inputClass: "is-valid",
          feedbackMsg: "",
        });
      } else {
        setRePassState({
          inputClass: "is-invalid",
          feedbackMsg: "Nhập lại mật khẩu không khớp",
        });
        isValidForm = false;
      }
    }

    if (!isValidForm) return;

    setValidForm(true);

    let result = await createNewAccount(email, password);

    if (result.isSuccess) {
      await set(ref(firebaseDatabase, `users/${result.newAccount.uid}`), {
        email: result.newAccount.email,
        fullName: "",
        phone: "",
        address: "",
        role: "user",
        hashedPass: md5(password),
      });
      toast.success("Đăng ký thành công!");
      setTimeout(() => {
        window.location.href = `emailverify/${result.newAccount.uid}`;
      }, 1000);
    } else {
      toast.error("Có lỗi xảy ra!");
    }
    setValidForm(false);
  };

  useEffect(() => {
    document.title = "Đăng ký";
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
              Đăng ký tài khoản mới&nbsp;
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
                      (await isEmailExists(email))
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
                            feedbackMsg: "Email này đã được sử dụng",
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
                      toggleRepass(true);
                      getCurrentPassword(event.target.value.trim());
                    } else {
                      toggleRepass(false);
                      setRePassState({
                        inputClass: "",
                        feedbackMsg: "",
                      });
                    }
                  }}
                  onBlur={(event) => {
                    let password = event.target.value.trim();
                    if (!password) {
                      setPassState({
                        inputClass: "is-invalid",
                        feedbackMsg: "Vui lòng nhập mật khẩu",
                      });
                      toggleRepass(false);
                      setRePassState({
                        inputClass: "",
                        feedbackMsg: "",
                      });
                    } else {
                      let length = password.length;
                      if (length < 6) {
                        setPassState({
                          inputClass: "is-invalid",
                          feedbackMsg: "Độ dài mật khẩu ít nhất 6 kí tự",
                        });
                        toggleRepass(false);
                        setRePassState({
                          inputClass: "",
                          feedbackMsg: "",
                        });
                      } else {
                        getCurrentPassword(password);
                        setPassState({
                          inputClass: "is-valid",
                          feedbackMsg: "",
                        });
                        toggleRepass(true);
                      }
                    }
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  {passState.feedbackMsg}
                </Form.Control.Feedback>
              </Form.Group>
              {isShowRepass && (
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Lặp lại mật khẩu
                  </Form.Label>
                  <Form.Control
                    className={rePassState.inputClass}
                    type="password"
                    placeholder="Nhập lại mật khẩu..."
                    onBlur={(event) => {
                      let rePassword = event.target.value.trim();

                      if (!rePassword) {
                        setRePassState({
                          inputClass: "is-invalid",
                          feedbackMsg: "Vui lòng nhập lại mật khẩu",
                        });
                      } else {
                        if (currentPassword == rePassword) {
                          setRePassState({
                            inputClass: "is-valid",
                            feedbackMsg: "",
                          });
                        } else {
                          setRePassState({
                            inputClass: "is-invalid",
                            feedbackMsg: "Nhập lại mật khẩu không khớp",
                          });
                        }
                      }
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {rePassState.feedbackMsg}
                  </Form.Control.Feedback>
                </Form.Group>
              )}
              <Form.Group className="d-flex flex-column mt-2">
                <Button
                  className="d-flex align-items-center justify-content-center"
                  variant="dark"
                  type="submit"
                >
                  {validForm ? (
                    <Spinner animation="border" role="status"></Spinner>
                  ) : (
                    <span>Đăng ký</span>
                  )}
                </Button>
                <p className="mt-3 text-center">
                  Đã có tài khoản?
                  <Link className="text-decoration-none " to="/signin">
                    &nbsp;Đăng nhập
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

const signUpRoute = {
  path: "/signup",
  element: <SignUp />,
  errorElement: <ErrorPage />,
  children: [],
};

export default signUpRoute;
