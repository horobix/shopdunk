import { useEffect, useState } from "react";
import { Link, redirect } from "react-router-dom";

import { firebaseApp, firebaseDatabase } from "../configs/firebase";
import { ref, child, get, set } from "firebase/database";

import getCurrentCart from "../helpers/cart-manager/get-current-cart";
import addToCart from "../helpers/cart-manager/add-to-cart";
import removeFromCart from "../helpers/cart-manager/remove-from-cart";
import changeItemQuantity from "../helpers/cart-manager/change-item-quantity";
import updateCart from "../helpers/cart-manager/update-cart";

import truncateString from "../helpers/truncate-string";
import currencyFormatter from "../helpers/currency-formatter";

import {
  Breadcrumb,
  Container,
  Row,
  Col,
  Table,
  Button,
} from "react-bootstrap";
import { MdOutlineCancel } from "react-icons/md";
import { BsArrowLeft } from "react-icons/bs";

import ErrorPage from "./error-page";
import Header from "./partials/header";
import Footer from "./partials/footer";
import { toast, ToastContainer } from "react-toastify";

let Cart = () => {
  // Initial
  document.title = "Giỏ hàng của bạn";

  let [cart, getCart] = useState([]);
  let [cartProducts, getCartProducts] = useState([]);
  let [amount, getAmount] = useState(0);
  let [isRefresh, refresher] = useState(false);

  // Single cart row
  let CartRow = ({ refresh, productId, name, price, quantity, images }) => {
    return (
      <tr>
        <td className="p-0">
          <div className="d-flex align-items-center justify-content-center h-100">
            <MdOutlineCancel
              onClick={() => {
                removeFromCart(productId);
                toast.success("Cập nhật thành công!", { autoClose: 500 });
                refresher(true);
              }}
              className="fs-4"
              style={{ cursor: "pointer" }}
            />
          </div>
        </td>
        <td>
          <div className="m-0" style={{ width: "90px", height: "90px" }}>
            <img className="w-100" src={images} alt={name} />
          </div>
        </td>
        <td className="p-0">
          <div className="d-flex align-items-center h-100">
            <Link
              className="text-dark text-decoration-none"
              to={`/product/${productId}`}
            >
              {truncateString(name, 30)}
            </Link>
          </div>
        </td>
        <td>
          <div className="d-flex align-items-center h-100">
            {currencyFormatter(price)}
          </div>
        </td>
        <td>
          <div className="d-flex align-items-center w-50 h-100">
            <input
              className="cartItem customInputNumber1 w-100 border-0"
              type="number"
              min={1}
              productid={productId}
              defaultValue={quantity}
            />
          </div>
        </td>
      </tr>
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
              price={product.price}
              quantity={product.quantity}
              images={product.images}
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

  let _updateCart = () => {
    let inputs = document.querySelectorAll("td > div > .cartItem");
    let newCart = [];

    for (let i = 0; i < inputs.length; i++) {
      newCart.push({
        productId: inputs[i].getAttribute("productid"),
        quantity: inputs[i].value.trim(),
      });
    }
    toast.success("Cập nhật thành công!", { autoClose: 500 });
    updateCart(newCart);
    refresher(true);
  };

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
              <h5>Giỏ hàng của bạn</h5>
              {cart.length ? (
                <div className="mt-4">
                  <Table>
                    <thead>
                      <tr>
                        <th></th>
                        <th></th>
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                      </tr>
                    </thead>
                    <tbody>
                      <CartRows />
                    </tbody>
                  </Table>
                  <div className="d-flex justify-content-end">
                    <Button onClick={() => _updateCart()}>
                      Cập nhật giỏ hàng
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-muted">
                  Chưa có sản phẩm nào trong giỏ hàng
                </p>
              )}
            </div>
          </Col>
          <Col className="col-4">
            <div
              className="p-4 bg-white rounded-3 overflow-hidden"
              style={{ boxShadow: "0px 0px 8px 0px rgb(0 0 0 / 4%)" }}
            >
              <h5>Tổng giỏ hàng</h5>
              <hr />
              <Row className="row-cols-2 pt-2 pb-4">
                <Col>Tổng cộng</Col>
                <Col className="text-end">{currencyFormatter(amount)}</Col>
              </Row>
              <div>
                <Button className="w-100">
                  <Link
                    className="text-white text-decoration-none"
                    to={"/place-order"}
                  >
                    Thanh toán
                  </Link>
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

const cartRoute = {
  path: "/cart",
  element: <Cart />,
  errorElement: <ErrorPage />,
  children: [],
};

export default cartRoute;
