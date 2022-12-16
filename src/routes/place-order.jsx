import { useEffect, useState } from "react";
import { Link, redirect } from "react-router-dom";

import { firebaseApp, firebaseDatabase } from "../configs/firebase";
import { ref, child, get, set, push, update } from "firebase/database";

import getCurrentCart from "../helpers/cart-manager/get-current-cart";
import addToCart from "../helpers/cart-manager/add-to-cart";
import removeFromCart from "../helpers/cart-manager/remove-from-cart";
import changeItemQuantity from "../helpers/cart-manager/change-item-quantity";
import updateCart from "../helpers/cart-manager/update-cart";

import { getCurrentAccount } from "../authentication/authentication";

import truncateString from "../helpers/truncate-string";
import currencyFormatter from "../helpers/currency-formatter";

import {
  Breadcrumb,
  Container,
  Row,
  Col,
  Table,
  Button,
  Form,
} from "react-bootstrap";
import { MdOutlineCancel } from "react-icons/md";
import { BsArrowLeft } from "react-icons/bs";

import ErrorPage from "./error-page";
import Header from "./partials/header";
import Footer from "./partials/footer";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";

let PlaceOrder = () => {
  // Initial

  document.title = "Thanh toán";
  let [account, getAccount] = useState({});
  let [cart, getCart] = useState([]);
  let [cartProducts, getCartProducts] = useState([]);
  let [amount, getAmount] = useState(0);
  let [isRefresh, refresher] = useState(false);
  let [isPlaceOrder, setPlaceOrder] = useState(false);

  // Single cart row
  let CartRow = ({ name, quantity, images }) => {
    return (
      <div className="d-flex align-items-center mb-4">
        <div style={{ width: "60px", height: "60px" }}>
          <img className="w-100" src={images} alt={name} />
        </div>
        <div className="flex-grow-1 d-flex align-items-center justify-content-between">
          <h6 className="m-0">{truncateString(name, 30)}</h6>
          <p className="m-0">x{quantity}</p>
        </div>
      </div>
    );
  };

  // All cart rows
  let CartRows = () => {
    if (cartProducts.length) {
      return (
        <>
          {cartProducts.map((product) => (
            <CartRow
              key={JSON.stringify(product)}
              productId={product.productId}
              name={product.name}
              images={product.images}
              quantity={product.quantity}
            />
          ))}
        </>
      );
    }

    return <></>;
  };

  // Get data
  useEffect(() => {
    window.scrollTo(0, 0);

    getCurrentAccount((result) => {
      if (result.status == "signed-out") {
        window.location.href = "/signin";
      } else {
        let userId = result.account.uid;

        get(child(ref(firebaseDatabase), `users/${userId}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              getAccount({
                userId: userId,
                ...snapshot.val(),
              });
            } else {
              getAccount({});
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });

    getCurrentCart(async (cart) => {
      getCart(cart);

      let currentAmount = 0;
      let products = await Promise.all(
        cart.map((item) => {
          return get(child(ref(firebaseDatabase), `products/${item.productId}`))
            .then((snapshot) => {
              if (snapshot.exists()) {
                currentAmount += +snapshot.val().price * item.quantity;
                return {
                  productId: item.productId,
                  ...snapshot.val(),
                  quantity: item.quantity,
                };
              } else {
                return {};
              }
            })
            .catch((error) => {
              console.error(error);
            });
        })
      );

      getCartProducts(products);
      getAmount(currentAmount);
      refresher(false);
    });
  }, [isRefresh]);

  useEffect(() => {
    if (isPlaceOrder) {
      let executor = async () => {
        let fullName = document.querySelector("form .fullName").value.trim();
        let phone = document.querySelector("form .phone").value.trim();
        let email = document.querySelector("form .email").value.trim();
        let address = document.querySelector("form .address").value.trim();
        let paymentMethod = document
          .querySelector("form .paymentMethod")
          .value.trim();

        if (fullName && phone && email && address && paymentMethod) {
          let bill = {
            userId: account.userId,
            fullName: fullName,
            phone: phone,
            address: address,
            paymentMethod: paymentMethod,
            amount: amount,
            status: "pending",
            orderDate: moment().format("MM-DD-YYYY"),
            orderTime: moment().format("hh:mm:ss"),
          };

          let newBillKey = push(child(ref(firebaseDatabase), "bills")).key;
          bill["id"] = newBillKey;
          const updates = {};
          updates[`/bills/${account.userId}/${newBillKey}`] = bill;
          update(ref(firebaseDatabase), updates);

          for (let i = 0; i < cart.length; i++) {
            const billDetailsListRef = ref(
              firebaseDatabase,
              `billDetails/${newBillKey}`
            );
            const newBillDetailsRef = push(billDetailsListRef);
            set(newBillDetailsRef, {
              billId: newBillKey,
              ...cart[i],
              name: cartProducts[i].name,
              price: cartProducts[i].price,
              images: cartProducts[i].images,
              total: cart[i].quantity * cartProducts[i].price,
            });
          }

          updateCart([]);
          window.location.href = "/place-order-done";
        } else {
          toast.warning("Vui lòng nhập đầy đủ thông tin!", { autoClose: 800 });
        }
      };
      executor();
    }

    setPlaceOrder(false);
  }, [isPlaceOrder]);

  // Finally
  return (
    <>
      <Header />
      <ToastContainer hideProgressBar={false} />
      <Container>
        <div className="pt-4">
          <Link
            className="d-flex align-items-center text-decoration-none text-dark"
            to="/"
          >
            <BsArrowLeft />
            &nbsp;Chọn thêm sản phẩm khác
          </Link>
        </div>
        <Row className="row-cols-2 gx-2 py-5">
          <Col className="col-8">
            <div
              className="p-4 bg-white rounded-3 overflow-hidden"
              style={{ boxShadow: "0px 0px 8px 0px rgb(0 0 0 / 4%)" }}
            >
              <h5>Thông tin đơn hàng</h5>
              <div className="mt-4">
                <Form action="">
                  <Form.Group className="mb-3">
                    <Form.Label
                      className="fw-semibold"
                      style={{ fontSize: ".9rem" }}
                    >
                      Họ và Tên*
                    </Form.Label>
                    <Form.Control
                      className="fullName"
                      type="text"
                      placeholder="Họ và Tên..."
                      defaultValue={account.fullName || ""}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label
                      className="fw-semibold"
                      style={{ fontSize: ".9rem" }}
                    >
                      Số điện thoại*
                    </Form.Label>
                    <Form.Control
                      className="phone"
                      type="text"
                      placeholder="Số điện thoại..."
                      defaultValue={account.phone || ""}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label
                      className="fw-semibold"
                      style={{ fontSize: ".9rem" }}
                    >
                      Email*
                    </Form.Label>
                    <Form.Control
                      className="email"
                      type="text"
                      placeholder="Email..."
                      defaultValue={account.email || ""}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label
                      className="fw-semibold"
                      style={{ fontSize: ".9rem" }}
                    >
                      Địa chỉ nhận hàng*
                    </Form.Label>
                    <Form.Control
                      className="address"
                      as="textarea"
                      placeholder="Địa chỉ nhận hàng..."
                      defaultValue={account.address || ""}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label
                      className="fw-semibold"
                      style={{ fontSize: ".9rem" }}
                    >
                      Phương thức thanh toán*
                    </Form.Label>
                    <Form.Select
                      className="paymentMethod"
                      aria-label="Default select example"
                      defaultValue={"1"}
                    >
                      <option value="1">Thanh toán khi nhận hàng (COD)</option>
                      <option value="2">
                        Sử dụng ví điện tử (Momo, Zalo Pay, ...)
                      </option>
                      <option value="3">Chuyển khoản qua ngân hàng</option>
                    </Form.Select>
                  </Form.Group>
                </Form>
              </div>
            </div>
          </Col>
          <Col className="col-4">
            <div
              className="p-4 bg-white rounded-3 overflow-hidden"
              style={{ boxShadow: "0px 0px 8px 0px rgb(0 0 0 / 4%)" }}
            >
              <h5>Tổng giỏ hàng</h5>
              <hr />
              <CartRows />
              <hr />
              <Row className="row-cols-2 pt-2 pb-4">
                <Col>Tổng cộng</Col>
                <Col className="text-end">{currencyFormatter(amount)}</Col>
              </Row>
              <div>
                <Button onClick={() => setPlaceOrder(true)} className="w-100">
                  Đặt hàng
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

const placeOrderRoute = {
  path: "/place-order",
  element: <PlaceOrder />,
  errorElement: <ErrorPage />,
  children: [],
};

export default placeOrderRoute;
