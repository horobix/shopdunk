import { useState, useEffect } from "react";

import "../styles/index.css";
import Header from "./partials/header";
import Footer from "./partials/footer";
import Slider from "./partials/slider";
import ProductGrid from "./partials/product-grid";

import { Link, Outlet, redirect, Navigate } from "react-router-dom";
import { Container, Row, Col, Breadcrumb } from "react-bootstrap";

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
  limitToFirst,
  limitToLast,
  equalTo,
} from "firebase/database";
import { firebaseApp, firebaseDatabase } from "../configs/firebase";

let IPhones = () => {
  let [title, changeTitle] = useState("ShopDunk - iPhone");
  let [iPhones, getIPhones] = useState([]);

  useEffect(() => {
    document.title = title;
    const iPhonesRef = query(
      ref(firebaseDatabase, "products"),
      orderByChild("categoryId"),
      equalTo(0)
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
  }, []);

  return <ProductGrid gridTitle="iPhone" products={iPhones} />;
};

let IPads = () => {
  let [title, changeTitle] = useState("ShopDunk - iPad");
  let [iPads, getIPads] = useState([]);

  useEffect(() => {
    document.title = title;
    const iPadsRef = query(
      ref(firebaseDatabase, "products"),
      orderByChild("categoryId"),
      equalTo(1)
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
  }, []);

  return <ProductGrid gridTitle="iPad" products={iPads} />;
};

let Macs = () => {
  let [title, changeTitle] = useState("ShopDunk - Mac");
  let [macs, getMacs] = useState([]);

  useEffect(() => {
    document.title = title;
    const macsRef = query(
      ref(firebaseDatabase, "products"),
      orderByChild("categoryId"),
      equalTo(2)
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
  }, []);

  return <ProductGrid gridTitle="Mac" products={macs} />;
};

let Watches = () => {
  let [title, changeTitle] = useState("ShopDunk - Apple Watch");
  let [watches, getWatches] = useState([]);

  useEffect(() => {
    document.title = title;
    const watchesRef = query(
      ref(firebaseDatabase, "products"),
      orderByChild("categoryId"),
      equalTo(3)
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
  }, []);

  return <ProductGrid gridTitle="Apple Watch" products={watches} />;
};

let Sounds = () => {
  let [title, changeTitle] = useState("ShopDunk - Âm thanh");
  let [sounds, getSounds] = useState([]);

  useEffect(() => {
    document.title = title;
    const soundsRef = query(
      ref(firebaseDatabase, "products"),
      orderByChild("categoryId"),
      equalTo(4)
    );

    get(soundsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          getSounds(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return <ProductGrid gridTitle="Âm thanh" products={sounds} />;
};

let Accessories = () => {
  let [title, changeTitle] = useState("ShopDunk - Phụ kiện");
  let [accessories, getAccessories] = useState([]);

  useEffect(() => {
    document.title = title;
    const accessoriesRef = query(
      ref(firebaseDatabase, "products"),
      orderByChild("categoryId"),
      equalTo(5)
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
  }, []);

  return <ProductGrid gridTitle="Phụ kiện" products={accessories} />;
};

let iPhonesImages = [
  "/sliders/products/iphones/slider-image-1.jpeg",
  "/sliders/products/iphones/slider-image-2.jpeg",
];

let iPadsImages = [
  "/sliders/products/ipads/slider-image-1.png",
  "/sliders/products/ipads/slider-image-2.png",
];

let macsImages = ["/sliders/products/macs/slider-image-1.jpeg"];

let watchesImages = [
  "/sliders/products/watches/slider-image-1.jpeg",
  "/sliders/products/watches/slider-image-2.jpeg",
];

let soundsImages = [
  "/sliders/products/sounds/slider-image-1.png",
  "/sliders/products/sounds/slider-image-2.jpeg",
];

let accessoriesImages = [
  "/sliders/products/accessories/slider-image-1.jpeg",
  "/sliders/products/accessories/slider-image-2.jpeg",
];

let Products = () => {
  return (
    <>
      <Header />
      <Container>
        <Outlet />
      </Container>
      <Footer />
    </>
  );
};

const productsRoute = {
  path: "/products",
  element: <Products />,
  children: [
    {
      path: "/products/iphones",
      element: (
        <div className="pb-5">
          <div className="py-4">
            <Link className="text-decoration-none text-black-50" to="/">
              Trang Chủ&nbsp;/&nbsp;
            </Link>
            <Link
              className="text-decoration-none text-primary"
              to="/products/iphones"
            >
              iPhone
            </Link>
          </div>
          <Slider images={iPhonesImages} />
          <IPhones />
        </div>
      ),
    },
    {
      path: "/products/ipads",
      element: (
        <div className="pb-5">
          <div className="py-4">
            <Link className="text-decoration-none text-black-50" to="/">
              Trang Chủ&nbsp;/&nbsp;
            </Link>
            <Link
              className="text-decoration-none text-primary"
              to="/products/ipads"
            >
              iPad
            </Link>
          </div>
          <Slider images={iPadsImages} />
          <IPads />
        </div>
      ),
    },
    {
      path: "/products/macs",
      element: (
        <div className="pb-5">
          <div className="py-4">
            <Link className="text-decoration-none text-black-50" to="/">
              Trang Chủ&nbsp;/&nbsp;
            </Link>
            <Link
              className="text-decoration-none text-primary"
              to="/products/macs"
            >
              Mac
            </Link>
          </div>
          <Slider images={macsImages} />
          <Macs />
        </div>
      ),
    },
    {
      path: "/products/watches",
      element: (
        <div className="pb-5">
          <div className="py-4">
            <Link className="text-decoration-none text-black-50" to="/">
              Trang Chủ&nbsp;/&nbsp;
            </Link>
            <Link
              className="text-decoration-none text-primary"
              to="/products/watches"
            >
              Apple Watch
            </Link>
          </div>
          <Slider images={watchesImages} />
          <Watches />
        </div>
      ),
    },
    {
      path: "/products/sounds",
      element: (
        <div className="pb-5">
          <div className="py-4">
            <Link className="text-decoration-none text-black-50" to="/">
              Trang Chủ&nbsp;/&nbsp;
            </Link>
            <Link
              className="text-decoration-none text-primary"
              to="/products/sounds"
            >
              Âm thanh
            </Link>
          </div>
          <Slider images={soundsImages} />
          <Sounds />
        </div>
      ),
    },
    {
      path: "/products/accessories",
      element: (
        <div className="pb-5">
          <div className="py-4">
            <Link className="text-decoration-none text-black-50" to="/">
              Trang Chủ&nbsp;/&nbsp;
            </Link>
            <Link
              className="text-decoration-none text-primary"
              to="/products/accessories"
            >
              Phụ kiện
            </Link>
          </div>
          <Slider images={accessoriesImages} />
          <Accessories />
        </div>
      ),
    },
  ],
};
export default productsRoute;
