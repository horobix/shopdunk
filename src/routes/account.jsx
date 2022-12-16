import { firebaseApp, firebaseDatabase } from "../configs/firebase";
import { ref, child, get, set, update } from "firebase/database";
import { getCurrentAccount } from "../authentication/authentication";
import { getAuth, updatePassword } from "firebase/auth";
import truncateString from "../helpers/truncate-string";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import md5 from "md5";

import currencyFormatter from "../helpers/currency-formatter";

import { Link } from "react-router-dom";
import {
  Accordion,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Button,
  Badge,
  Table,
} from "react-bootstrap";
import { MdOutlineCancel } from "react-icons/md";

import Header from "./partials/header";
import Footer from "./partials/footer";
import ErrorPage from "./error-page";

const auth = getAuth(firebaseApp);

let Account = () => {
  let [account, getAccount] = useState({});
  let [information, getInformation] = useState({});

  let [isGetBills, toggleGetBills] = useState(false);
  let [bills, getBills] = useState({});
  let [billsDetails, getBillsDetails] = useState([]);

  // Get account
  useEffect(() => {
    let executor = async () => {
      getCurrentAccount(({ status, account: currentAccount }) => {
        if (status == "signed-out") {
          window.location.href = "/signin";
        } else {
          document.title = `Tài khoản - ${currentAccount.email}`;
          getAccount(currentAccount);

          get(child(ref(firebaseDatabase), `users/${currentAccount.uid}`))
            .then((snapshot) => {
              if (snapshot.exists()) {
                getInformation(snapshot.val());
              } else {
                console.log("No data available");
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
    };
    executor();
  }, []);

  // Update info
  let updateInfo = async (form) => {
    let oldPass = form[1].value.trim();
    let newPass = form[2].value.trim();
    let fullName = form[3].value.trim();
    let phone = form[4].value.trim();
    let address = form[5].value.trim();

    let { hashedPass: currentPass } = await get(
      child(ref(firebaseDatabase), `users/${account.uid}`)
    )
      .then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });

    if (md5(oldPass) == currentPass) {
      const updates = {};
      updates[`users/${account.uid}/fullName`] = fullName;
      updates[`users/${account.uid}/phone`] = phone;
      updates[`users/${account.uid}/address`] = address;
      updates[`users/${account.uid}/hashedPass`] = md5(newPass);
      await update(ref(firebaseDatabase), updates);
      await updatePassword(account, newPass)
        .then(() => {})
        .catch((error) => {});
      toast.success("Cập nhật thành công!");
    } else {
      toast.error("Mật khẩu cũ không đúng!");
    }
  };

  // Get bills & bills details
  useEffect(() => {
    getCurrentAccount(async ({ account }) => {
      let bills = await get(
        child(ref(firebaseDatabase), `bills/${account.uid}`)
      )
        .then((snapshot) => {
          if (snapshot.exists()) {
            let result = [];
            for (let bill in snapshot.val()) {
              result.push({
                ...snapshot.val()[bill],
              });
            }
            getBills(result);
            return result;
          } else {
            return [];
          }
        })
        .catch((error) => {
          console.error(error);
        });

      let billDetails = await Promise.all(
        bills.map((bill) => {
          return get(child(ref(firebaseDatabase), `billDetails/${bill.id}`))
            .then((snapshot) => {
              if (snapshot.exists()) {
                let result = [];
                for (let billDetail in snapshot.val()) {
                  result.push({
                    ...snapshot.val()[billDetail],
                  });
                }

                return result;
              } else {
                return [];
              }
            })
            .catch((error) => {
              console.error(error);
            });
        })
      );

      getBillsDetails(billDetails);
    });

    toggleGetBills(false);
  }, [isGetBills]);

  // Bill lines
  let BillLines = () => {
    let Status = {
      pending: (
        <Badge className="ms-2" bg="info">
          Đã tiếp nhận
        </Badge>
      ),
      shipping: (
        <Badge className="ms-2" bg="primary">
          Đang giao hàng
        </Badge>
      ),
      success: (
        <Badge className="ms-2" bg="success">
          Đã giao hàng
        </Badge>
      ),
      cancelled: (
        <Badge className="ms-2" bg="danger">
          Đã huỷ
        </Badge>
      ),
    };

    let DetailLine = ({ images, name, price, quantity, total, status }) => {
      return (
        <tr>
          <td>
            <div
              className="overflow-hidden"
              style={{ width: "100px", height: "100px" }}
            >
              <img className="w-100" src={images} alt={name} />
            </div>
          </td>
          <td>
            <Link
              className="fw-semibold text-decoration-none text-dark"
              to={`/product/1`}
            >
              {name}
            </Link>
          </td>
          <td>{currencyFormatter(price)}</td>
          <td>{quantity}</td>
          <td>{currencyFormatter(total)}</td>
        </tr>
      );
    };

    // Cancel order
    let cancelOrder = (bill) => {
      set(
        ref(firebaseDatabase, `bills/${bill.userId}/${bill.id}/status`),
        "cancelled"
      );

      toggleGetBills(true);
    };

    return bills.map((bill, _id) => (
      <Accordion.Item key={JSON.stringify(bill)} eventKey={_id}>
        <Accordion.Header>
          <div className="d-flex align-items-center justify-content-between">
            <p className="m-0 fw-bold" style={{ fontSize: ".9rem" }}>
              Đơn hàng #{bill.id} {Status[bill.status]}
            </p>
            <p
              className="ms-5 m-0 text-muted text-end"
              style={{ fontSize: ".9rem" }}
            >
              <span>{bill.orderDate}</span>&nbsp;
              <span>{bill.orderTime}</span>
            </p>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <Table>
            <thead>
              <tr>
                <th></th>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {billsDetails &&
                billsDetails[_id] &&
                billsDetails[_id].map((detail) => (
                  <DetailLine key={JSON.stringify(detail)} {...detail} />
                ))}
            </tbody>
          </Table>
          <div>
            <p className="fw-semibold text-center">
              Thành tiền: {currencyFormatter(bill.amount)}
            </p>
          </div>
          <div className="d-flex justify-content-end">
            {bill.status == "shipping" ||
            bill.status == "success" ||
            bill.status == "cancelled" ? (
              <Button
                className="d-flex align-items-center"
                variant="danger"
                disabled
              >
                <MdOutlineCancel className="me-1" />
                Huỷ đơn hàng
              </Button>
            ) : (
              <Button
                onClick={() => cancelOrder(bill)}
                className="d-flex align-items-center"
                variant="danger"
              >
                <MdOutlineCancel className="me-1" />
                Huỷ đơn hàng
              </Button>
            )}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    ));
  };

  return (
    <>
      <ToastContainer />
      <Header></Header>
      <Container>
        <Row className="row-cols-2 py-5 g-2">
          <Col className="col-3">
            <div className="d-flex align-items-center ">
              <div
                className="border border-2 rounded-circle overflow-hidden"
                style={{ width: "6rem", height: "6rem" }}
              >
                <img
                  src="/users/account-page/account-avatar.svg"
                  alt="Avatar"
                />
              </div>
              <div className="ms-3">
                <p className="m-0 fw-semibold">
                  {account.emailVerified ? (
                    <Badge bg="success">Đã xác thực</Badge>
                  ) : (
                    <Badge bg="primary">Chưa xác thực</Badge>
                  )}
                </p>
                <p className="m-0 fw-semibold">
                  {truncateString(account.email, 20)}
                </p>
                <Link
                  className="text-decoration-none"
                  to={""}
                  style={{ fontSize: ".9rem" }}
                >
                  Sửa thông tin
                </Link>
              </div>
            </div>
          </Col>
          <Col className="col-9 rounded-3 bg-white shadow-sm px-4 py-4">
            <div>
              <div>
                <h5>Hồ Sơ Của Tôi</h5>
                <p style={{ fontSize: ".9rem" }}>
                  Quản lý thông tin hồ sơ để bảo mật tài khoản
                </p>
              </div>
              <hr style={{ border: "1px solid #ccc" }} />
              <div>
                <Form
                  onSubmit={(event) => {
                    event.preventDefault();
                    updateInfo(event.target);
                  }}
                >
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={account.email || ""}
                      readOnly
                    />
                    <Form.Text className="text-muted">
                      Bạn không thể thay đổi địa chỉ email.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Mật khẩu cũ</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Mật khẩu cũ..."
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Mật khẩu mới
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Mật khẩu mới..."
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Họ và Tên</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Họ và Tên..."
                      defaultValue={information.fullName}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Số điện thoại
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Số điện thoại..."
                      defaultValue={information.phone}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Địa chỉ</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Địa chỉ..."
                      defaultValue={information.address}
                    />
                  </Form.Group>
                  <Button variant="dark" type="submit">
                    Cập nhập
                  </Button>
                </Form>
              </div>
              <hr style={{ border: "1px solid #363636" }} />
              <div>
                <div className="mb-3">
                  <h5>Đơn hàng của tôi</h5>
                  <p style={{ fontSize: ".9rem" }}>
                    Các đơn hàng mà bạn đã đặt
                  </p>
                  <hr style={{ border: "1px solid #ccc" }} />
                </div>
                <div>
                  <Accordion>
                    {bills.length ? (
                      <BillLines />
                    ) : (
                      <p>Bạn chưa đặt đơn nào.</p>
                    )}
                  </Accordion>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer></Footer>
    </>
  );
};

const accountRoute = {
  path: "/account",
  element: <Account />,
  errorElement: <ErrorPage />,
  children: [],
};

export default accountRoute;
