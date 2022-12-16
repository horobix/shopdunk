import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import currencyFormatter from "../../helpers/currency-formatter";
import truncateString from "../../helpers/truncate-string";
import "../../styles/product-card.css";

let ProductCard = ({ id, name, price, images }) => {
  return (
    <Link
      to={`/product/${id}`}
      className="text-dark fw-bold text-decoration-none"
    >
      <Card className="product-card border-0" style={{ minHeight: "30rem" }}>
        <div className="p-5">
          <div>
            <Card.Img className="w-100" variant="top" src={images} />
          </div>
        </div>
        <Card.Body className="d-flex flex-column justify-content-end text-center mb-5">
          <Card.Title href="/abc">
            <div className="text-dark fw-bold text-decoration-none">
              {truncateString(name, 40)}
            </div>
          </Card.Title>
          <Card.Text className="fw-semibold text-primary">
            {currencyFormatter(price)}
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default ProductCard;
