import { useState, useEffect } from "react";

import "../styles/index.css";
import Header from "./partials/header";
import Footer from "./partials/footer";
import SliderThumbs from "./partials/slider-thumbs";
import SaleInfoCard from "./partials/sale-info-card";
import currencyFormatter from "../helpers/currency-formatter";
import ProductGrid from "./partials/product-grid";
import { getCurrentAccount } from "../authentication/authentication";

import { useParams } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

import addToCart from "../helpers/cart-manager/add-to-cart";

import {
  get,
  set,
  ref,
  child,
  query,
  orderByChild,
  limitToFirst,
  limitToLast,
  equalTo,
} from "firebase/database";
import { firebaseDatabase } from "../configs/firebase";
import { ToastContainer, toast } from "react-toastify";

let Product = () => {
  let [isSignIn, setSignStatus] = useState(false);
  let { productId } = useParams();

  let [currentAccount, setCurrentAccount] = useState({});
  let [productData, getProductData] = useState({});
  let [relevantProducts, getRelevantProducts] = useState([]);
  let [isAddToCart, setAddToCart] = useState(false);
  let [isRedirect, setRedirect] = useState(false);

  useEffect(() => {
    getCurrentAccount((result) => {
      if (result.status == "signed-in") {
        setSignStatus(true);
        setCurrentAccount(result.account);
      }
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    let executor = async () => {
      let categoryID = await get(
        child(ref(firebaseDatabase), `products/${productId}`)
      )
        .then((snapshot) => {
          if (snapshot.exists()) {
            document.title = snapshot.val().name;
            getProductData(snapshot.val());

            return snapshot.val().categoryId;
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });

      let relevantProductsRef = query(
        ref(firebaseDatabase, "products"),
        orderByChild("categoryId"),
        equalTo(categoryID),
        limitToFirst(4)
      );

      await get(relevantProductsRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            getRelevantProducts(snapshot.val());
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };

    executor();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <ToastContainer autoClose={500} pauseOnHover={false} />
        <Row lg="2">
          <Col>
            <div className="p-5">
              <SliderThumbs
                images={[
                  productData.images,
                  productData.images,
                  productData.images,
                  productData.images,
                ]}
              />
            </div>
          </Col>
          <Col>
            <div className="flex-wrap py-5 w-5">
              <div>
                <p className="fs-3 fw-semibold">{productData.name}</p>
              </div>
              <div>
                <p className="fs-5 fw-semibold text-primary">
                  {currencyFormatter(productData.price)}
                </p>
                <div className="mt-4">
                  <SaleInfoCard />
                </div>
                <Container className="mt-3 px-0">
                  <Row className="mx-0 gx-2" lg="2">
                    <Col>
                      <Button
                        variant="primary"
                        className="w-100 text-uppercase  fw-semibold"
                        onClick={() => {
                          addToCart(
                            {
                              productId: productId,
                              quantity: 1,
                            },
                            () => {
                              window.location.href = "/place-order";
                            }
                          );
                        }}
                      >
                        Mua Ngay
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        variant="outline-primary"
                        className="w-100 text-uppercase fw-semibold"
                        onClick={async () => {
                          if (isSignIn) {
                            let cart = await get(
                              child(
                                ref(firebaseDatabase),
                                `users/${currentAccount.uid}/cart`
                              )
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

                            if (cart.length == 0) {
                              cart.push({
                                productId: productId,
                                quantity: 1,
                              });
                            } else {
                              let i;
                              for (i = 0; i < cart.length; i++) {
                                if (cart[i].productId == productId) {
                                  cart[i].quantity++;
                                  break;
                                }
                              }

                              if (i == cart.length) {
                                cart.push({
                                  productId: productId,
                                  quantity: 1,
                                });
                              }
                            }
                            set(
                              ref(
                                firebaseDatabase,
                                `users/${currentAccount.uid}/cart`
                              ),
                              JSON.stringify(cart)
                            );
                            toast.success("Đã thêm vào giỏ", {
                              autoClose: 500,
                              pauseOnHover: false,
                            });
                          } else {
                            window.location.href = "/signin";
                          }
                        }}
                      >
                        Thêm Vào Giỏ
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </div>
            </div>
          </Col>
        </Row>
        <div className="py-4">
          <ProductGrid
            gridTitle="Sản phẩm liên quan"
            products={relevantProducts}
          />
        </div>
      </Container>
      <Footer />
    </>
  );
};

const productRoute = {
  path: "/product/:productId",
  element: <Product />,
  children: [],
};
export default productRoute;
