import ErrorPage from "./error-page";
import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import isEmail from "../helpers/is-email";

import {
  isEmailExists,
  sendPasswordResetMail,
} from "../authentication/authentication";

let ResetPassword = () => {
  let [emailState, setEmailState] = useState({
    inputClass: "",
    feedbackMsg: "",
  });

  let [validForm, setValidForm] = useState(false);

  let submitForm = async (event, signUpForm) => {
    event.preventDefault();

    let email = signUpForm[0].value.trim();

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

    if (!isValidForm) return;

    setValidForm(true);

    let result = await sendPasswordResetMail(email);
    console.log(result);
    if (result.status == "success") {
      toast.success("Đã gửi email khôi phục mật khẩu!");
      setTimeout(() => {
        window.location.href = "/signin";
      }, 1000);
    } else {
      toast.error("Có lỗi xảy ra!");
    }

    setValidForm(false);
  };

  useEffect(() => {
    document.title = "Lấy lại mật khẩu";
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
              Quên mật khẩu&nbsp;
            </h4>
            <Form onSubmit={(event) => submitForm(event, event.target)}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  Email tài khoản cần lấy lại mật khẩu
                </Form.Label>
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

              <Form.Group className="d-flex flex-column mt-2">
                <Button
                  className="d-flex align-items-center justify-content-center"
                  variant="dark"
                  type="submit"
                >
                  {validForm ? (
                    <Spinner animation="border" role="status"></Spinner>
                  ) : (
                    <span>Xác nhận</span>
                  )}
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const resetPasswordRoute = {
  path: "/resetpassword",
  element: <ResetPassword />,
  errorElement: <ErrorPage />,
  children: [],
};

export default resetPasswordRoute;
