import { getCurrentAccount } from "../../authentication/authentication";
import { BsCart, BsSearch, BsPerson } from "react-icons/bs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/header.css";
import {
  Dropdown,
  Container,
  Nav,
  Navbar,
  Button,
  OverlayTrigger,
  Offcanvas,
  Popover,
  DropdownButton,
  ListGroup,
  Row,
  Col,
} from "react-bootstrap";

import truncateString from "../../helpers/truncate-string";
import moneyCurrency from "../../helpers/currency-formatter";
import {
  getLocalCart,
  clearLocalCart,
  addToLocalCart,
  removeFromLocalCart,
  updateLocalCart,
} from "../partials/cart-manage";
import { firebaseDatabase } from "../../configs/firebase";
import { ref, child, get, set } from "firebase/database";
import currencyFormatter from "../../helpers/currency-formatter";

let Header = () => {
  let [isSignIn, setSignStatus] = useState(false);
  let [show, setShow] = useState(false);
  let [cartProductData, updateCartProductsData] = useState([]);
  let [isUpdate, toggleIsUpdate] = useState(false);
  let [isUpdateFirebaseCartData, toggleIsUpdateFirebaseCartData] =
    useState(false);
  let [currentAccount, setCurrentAccount] = useState({});

  let handleClose = () => setShow(false);
  let handleShow = () => setShow(true);

  useEffect(() => {
    getCurrentAccount((result) => {
      if (result.status == "signed-in") {
        setSignStatus(true);
        setCurrentAccount(result.account);
      }
    });
    toggleIsUpdateFirebaseCartData(false);
  }, [isUpdateFirebaseCartData]);

  useEffect(() => {
    let executor = async () => {
      let cart = await get(
        child(ref(firebaseDatabase), `users/${currentAccount.uid}/cart`)
      )
        .then((snapshot) => {
          if (snapshot.exists()) {
            return JSON.parse(snapshot.val());
          } else {
            return [];
          }
        })
        .catch((error) => {
          console.error(error);
        });

      let result = await Promise.all(
        cart.map((item) => {
          return get(child(ref(firebaseDatabase), `products/${item.productId}`))
            .then((snapshot) => {
              if (snapshot.exists()) {
                let currentProduct = snapshot.val();
                currentProduct["_id"] = item.productId;
                currentProduct["quantity"] = item.quantity;
                return currentProduct;
              } else {
                console.log("No data available");
              }
            })
            .catch((error) => {
              console.error(error);
            });
        })
      );

      updateCartProductsData(result);
      toggleIsUpdate(false);
    };
    executor();
  }, [isUpdate]);

  let CartItemLine = ({ _id, name, price, quantity, images }) => (
    <ListGroup className="mb-3">
      <ListGroup.Item>
        <div className="d-flex ">
          <div className="border border-1" style={{ width: "5rem" }}>
            <img className="w-100" src={images} />
          </div>

          <div className="ps-2">
            <p>{truncateString(name)}</p>
            <div>
              {quantity} x {currencyFormatter(price)}
            </div>
          </div>
        </div>
      </ListGroup.Item>

      <ListGroup.Item className="p-0 overflow-hidden">
        <Button
          onClick={async () => {
            let cart = await get(
              child(ref(firebaseDatabase), `users/${currentAccount.uid}/cart`)
            )
              .then((snapshot) => {
                if (snapshot.exists()) {
                  return JSON.parse(snapshot.val());
                } else {
                  return [];
                }
              })
              .catch((error) => {
                console.error(error);
              });

            let restProduct = cart.filter((item) => item.productId !== _id);

            set(
              ref(firebaseDatabase, `users/${currentAccount.uid}/cart`),
              JSON.stringify(restProduct)
            );
            toggleIsUpdate(true);
          }}
          className="w-100 rounded-0"
          variant="danger"
        >
          Xoá khỏi giỏ
        </Button>
      </ListGroup.Item>
    </ListGroup>
  );

  let renderItemLine = () => {
    let total = 0;
    let lines = cartProductData.map((item) => {
      total += item.price * item.quantity;
      return (
        <CartItemLine
          key={JSON.stringify(item)}
          _id={item._id}
          name={item.name}
          price={item.price}
          quantity={item.quantity}
          images={item.images}
        />
      );
    });

    return (
      <>
        <div>{lines}</div>
        <hr />
        <div>
          <h5 className="text-center">Tạm tính</h5>
          <h5 className="text-center fw-semibold text-primary">
            {currencyFormatter(total)}
          </h5>
        </div>
        <hr />
        <Row>
          <Col>
            <Button className="w-100" variant="primary">
              <Link
                className="text-white text-decoration-none"
                to="/cart"
              >
                Xem giỏ hàng
              </Link>
            </Button>
          </Col>
          <Col>
            <Button className="w-100" variant="primary">
              <Link
                className="text-white text-decoration-none"
                to="/place-order"
              >
                Thanh toán
              </Link>
            </Button>
          </Col>
        </Row>
      </>
    );
  };

  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Giỏ hàng của bạn</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {cartProductData.length ? (
            renderItemLine()
          ) : (
            <p>Chưa có sản phẩm nào</p>
          )}
        </Offcanvas.Body>
      </Offcanvas>
      <header className="header">
        <Navbar className="p-0" expand="lg">
          <Container>
            <div className="header__logo">
              <Link className="header__logo" to="/">
                <img className="header__logo-image" src="/logo.svg" alt="" />
              </Link>
            </div>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse
              id="basic-navbar-nav"
              className="justify-content-between"
            >
              <Nav className="header__menu justify-content-between w-100  mx-lg-5">
                <Nav>
                  <Link
                    className="header__menu-item text-white text-decoration-none"
                    to="/products/iphones"
                  >
                    iPhone
                  </Link>
                </Nav>
                <Nav>
                  <Link
                    className="header__menu-item text-white text-decoration-none"
                    to="/products/ipads"
                  >
                    iPad
                  </Link>
                </Nav>
                <Nav>
                  <Link
                    className="header__menu-item text-white text-decoration-none"
                    to="/products/macs"
                  >
                    Mac
                  </Link>
                </Nav>
                <Nav>
                  <Link
                    className="header__menu-item text-white text-decoration-none"
                    to="/products/watches"
                  >
                    Watch
                  </Link>
                </Nav>
                <Nav>
                  <Link
                    className="header__menu-item text-white text-decoration-none"
                    to="/products/sounds"
                  >
                    Âm thanh
                  </Link>
                </Nav>
                <Nav>
                  <Link
                    className="header__menu-item text-white text-decoration-none"
                    to="/products/accessories"
                  >
                    Phụ kiện
                  </Link>
                </Nav>
                <Nav.Link className="header__menu-item text-white" href="#link">
                  Dịch vụ
                </Nav.Link>
                <Nav.Link className="header__menu-item text-white" href="#link">
                  Khuyến mại
                </Nav.Link>
                <Nav.Link className="header__menu-item text-white" href="#link">
                  Trả góp
                </Nav.Link>
              </Nav>
              <ul className="d-flex align-items-center justify-content-center list-unstyled m-0">
                <li className="cursor-pointer me-2" role="button">
                  {isSignIn ? (
                    <Dropdown>
                      <Dropdown.Toggle variant="dark" id="dropdown-basic">
                        <BsPerson size="22px" color="white" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item as="button">
                          <Link
                            className="text-decoration-none text-dark"
                            to="/account"
                          >
                            Tài khoản
                          </Link>
                        </Dropdown.Item>
                        <Dropdown.Item as="button">
                          <Link
                            className="text-decoration-none text-dark"
                            to="/signout"
                          >
                            Đăng xuất
                          </Link>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : (
                    <Dropdown>
                      <Dropdown.Toggle variant="dark" id="dropdown-basic">
                        <BsPerson size="22px" color="white" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item as="button">
                          <Link
                            className="text-decoration-none text-dark"
                            to="/signin"
                          >
                            Đăng nhập
                          </Link>
                        </Dropdown.Item>
                        <Dropdown.Item as="button">
                          <Link
                            className="text-decoration-none text-dark"
                            to="/signup"
                          >
                            Đăng ký
                          </Link>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </li>
                <li className="cursor-pointer ms-2 me-2" role="button">
                  <BsCart
                    onClick={() => {
                      handleShow();
                      toggleIsUpdate(true);
                      toggleIsUpdateFirebaseCartData(true);
                    }}
                    size="18px"
                    color="white"
                  />
                </li>
                <li className="cursor-pointer ms-2" role="button">
                  <Link className="text-decoration-none text-dark" to="/search">
                    <BsSearch size="18px" color="white" />
                  </Link>
                </li>
              </ul>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </>
  );
};

export default Header;
