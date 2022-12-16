import { useEffect, useState } from "react";

import { firebaseApp, firebaseDatabase } from "../configs/firebase";
import { ref, child, get } from "firebase/database";

import ErrorPage from "./error-page";
import Header from "./partials/header";
import Footer from "./partials/footer";
import ProductGrid from "./partials/product-grid";

import { Container, Row, Col, Button, Form } from "react-bootstrap";

let Search = () => {
  let [rawProducts, getRawProducts] = useState([]);
  let [products, getProducts] = useState([]);

  useEffect(() => {
    let executor = async () => {
      let rawProducts = await get(child(ref(firebaseDatabase), `products`))
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

      getProducts(rawProducts);
      getRawProducts(rawProducts);
    };
    executor();
  }, []);

  let _filter = (keyword) => {
    if (keyword && products) {
      let filteredProducts = rawProducts.filter((product) =>
        product.name.toLowerCase().includes(keyword.toLowerCase())
      );
      getProducts(filteredProducts);
    } else {
      getProducts(rawProducts);
    }
  };

  return (
    <>
      <Header />
      <Container className="bg-white">
        <Row className="justify-content-center p-5">
          <Col className="col-8">
            <Form onSubmit={(event) => event.preventDefault()}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  Nhập từ khoá để tìm kiếm
                </Form.Label>
                <Form.Control
                  onChange={(event) => _filter(event.target.value.trim())}
                  type="text"
                  placeholder="Nhập từ khoá..."
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <ProductGrid gridTitle="Kết quả tìm kiếm" products={products} />
        </Row>
      </Container>
      <Footer />
    </>
  );
};

const searchRoute = {
  path: "/search",
  element: <Search />,
  errorElement: <ErrorPage />,
  children: [],
};
export default searchRoute;
