import { useState, useEffect } from "react";

import "../styles/index.css";
import Header from "./partials/header";
import Footer from "./partials/footer";
import Slider from "./partials/slider";
import ProductGrid from "./partials/product-grid";
import ErrorPage from "./error-page";

import { Link, Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  get,
  set,
  ref,
  child,
  query,
  orderByChild,
  orderByValue,
  orderByKey,
  limitToFirst,
  limitToLast,
  equalTo,
  startAt,
  startAfter,
} from "firebase/database";
import { firebaseApp, firebaseDatabase } from "../configs/firebase";

let Index = () => {
  let images = [
    "/sliders/index/slider-image-1.jpeg",
    "/sliders/index/slider-image-2.jpeg",
    "/sliders/index/slider-image-3.png",
    "/sliders/index/slider-image-4.png",
  ];

  let [title, changeTitle] = useState(
    "ShopDunk - Đại lý ủy quyền Apple Cửa hàng Apple chính hãng"
  );
  let [iPhones, getIPhones] = useState([]);
  let [iPads, getIPads] = useState([]);
  let [macs, getMacs] = useState([]);
  let [airPods, getAirPods] = useState([]);
  let [watches, getWatches] = useState([]);
  let [accessories, getAccessories] = useState([]);
  let [newProducts, getNewProducts] = useState([]);
  let [mostViewsProducts, getMostViewsProducts] = useState([]);
  let [hotProducts, getHotProducts] = useState([]);

  useEffect(() => {
    document.title = title;
    // iPhones
    const iPhonesRef = query(
      ref(firebaseDatabase, "products"),
      orderByChild("categoryId"),
      equalTo(0),
      limitToFirst(4)
    );

    get(iPhonesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          getIPhones(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // ----------------------------------------------------------------
    // iPads
    const iPadsRef = query(
      ref(firebaseDatabase, "products"),
      orderByChild("categoryId"),
      equalTo(1),
      limitToFirst(4)
    );

    get(iPadsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          getIPads(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // ----------------------------------------------------------------
    // Macs

    const macsRef = query(
      ref(firebaseDatabase, "products"),
      orderByChild("categoryId"),
      equalTo(2),
      limitToFirst(4)
    );

    get(macsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          getMacs(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // ----------------------------------------------------------------
    // AirPods
    const airPodsRef = query(
      ref(firebaseDatabase, "products"),
      orderByChild("categoryId"),
      equalTo(4),
      limitToFirst(4)
    );

    get(airPodsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          getAirPods(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // ----------------------------------------------------------------
    // Watches
    const watchesRef = query(
      ref(firebaseDatabase, "products"),
      orderByChild("categoryId"),
      equalTo(3),
      limitToFirst(4)
    );

    get(watchesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          getWatches(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // ----------------------------------------------------------------
    // Accessories
    const accessoriesRef = query(
      ref(firebaseDatabase, "products"),
      orderByChild("categoryId"),
      equalTo(5),
      limitToLast(4)
    );

    get(accessoriesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          getAccessories(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // ----------------------------------------------------------------
    // New Products
    const newProductsRef = query(
      ref(firebaseDatabase, "products"),
      limitToLast(10)
    );

    get(newProductsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          getNewProducts(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // ----------------------------------------------------------------
    // Most Views Products
    const mostViewsProductsRef = query(
      ref(firebaseDatabase, "products"),
      orderByChild("views"),
      startAfter(0)
    );

    get(mostViewsProductsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          let products = snapshot.val();

          let productObjs = [];

          for (let product in products) {
            productObjs.push({
              name: products[product].name,
              price: products[product].price,
              images: products[product].images,
              views: products[product].views,
            });
          }

          productObjs.sort((a, b) => a.views - b.views);

          getMostViewsProducts(productObjs);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // ----------------------------------------------------------------
    // Hot Products
    const hotProductsRef = query(
      ref(firebaseDatabase, "products"),
      orderByChild("hot"),
      equalTo(true)
    );

    get(hotProductsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          getHotProducts(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // ----------------------------------------------------------------
  }, []);

  return (
    <>
      <Header />
      <Container>
        <Slider images={images} />
        <Row className="gx-3" lg="3">
          <Col>
            <div className="rounded-4 overflow-hidden">
              <img
                className="w-100"
                src="/banners/index/banner-image-1.png"
                alt="Banner"
              />
            </div>
          </Col>
          <Col>
            <div className="rounded-4 overflow-hidden">
              <img
                className="w-100"
                src="/banners/index/banner-image-2.jpeg"
                alt="Banner"
              />
            </div>
          </Col>
          <Col>
            <div className="rounded-4 overflow-hidden">
              <img
                className="w-100"
                src="/banners/index/banner-image-3.jpeg"
                alt="Banner"
              />
            </div>
          </Col>
        </Row>

        <ProductGrid gridTitle="iPhone" products={iPhones} isShowMore="true" />
        <ProductGrid gridTitle="iPad" products={iPads} isShowMore="true" />
        <ProductGrid gridTitle="Mac" products={macs} isShowMore="true" />
        <ProductGrid gridTitle="AirPod" products={airPods} isShowMore="true" />
        <ProductGrid gridTitle="Watch" products={watches} isShowMore="true" />
        <ProductGrid
          gridTitle="Phụ kiện chính hãng"
          products={accessories}
          isShowMore="true"
        />
        <Row className="my-4" lg="1">
          <Col>
            <div className="rounded-4 overflow-hidden">
              <img
                className="w-100"
                src="/banners/index/business-banner-image.png"
                alt="Banner"
              />
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

const indexRoute = {
  path: "/",
  element: <Index />,
  errorElement: <ErrorPage />,
  children: [],
};
export default indexRoute;
