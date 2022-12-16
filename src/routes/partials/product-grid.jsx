import { Container, Row, Col, Button } from "react-bootstrap";
import ProductCard from "./product-card";

import { IoIosArrowForward } from "react-icons/io";

let ProductGrid = ({
  gridTitle,
  products,
  isShowMore = false,
  isReverse = false,
  // sort = false,
  // orderBy = null,
  // type = "asc",
}) => {
  let productObjects = [];
  for (let product in products) {
    productObjects.push({
      id: product,
      name: products[product].name,
      price: products[product].price,
      images: products[product].images,
    });
  }

  if (isReverse) {
    productObjects = productObjects.reverse();
  }

  let productCards = productObjects.map((productObject) => (
    <Col key={productObject.id}>
      <ProductCard
        id={productObject.id}
        name={productObject.name}
        price={productObject.price}
        images={productObject.images}
      />
    </Col>
  ));

  return (
    <div>
      <div className="pt-5 pb-4">
        <h3 className="text-center">{gridTitle}</h3>
      </div>
      <Row className="g-3" lg="4">
        {productCards}
      </Row>
      {isShowMore && (
        <div className="d-flex justify-content-center pt-4">
          <Button
            className="d-flex align-items-center"
            variant="outline-primary"
          >
            Xem tất cả {gridTitle} <IoIosArrowForward />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
