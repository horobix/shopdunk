import { useEffect, useState } from "react";

import { ref, child, get, set, push, remove } from "firebase/database";
import { firebaseApp, firebaseDatabase } from "../../configs/firebase";

import { ToastContainer, toast } from "react-toastify";
import {
  Table,
  Form,
  Button,
  Accordion,
  Container,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import { BsFillTrashFill, BsPencilSquare } from "react-icons/bs";

import truncateString from "../../helpers/truncate-string";
import currencyFormatter from "../../helpers/currency-formatter";

let AminProductManager = () => {
  let categories = ["iPhone", "iPad", "Mac", "Watch", "Âm thanh", "Phụ kiện"];

  const [modalData, setModalData] = useState({});
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let [isAdd, setIsAdd] = useState(false);

  let [isGetProducts, toggleIsGetProducts] = useState(true);
  let [products, getProducts] = useState([]);

  // Get products
  useEffect(() => {
    if (isGetProducts) {
      let executor = async () => {
        let _products = await get(child(ref(firebaseDatabase), `products`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              let result = [];

              for (let product in snapshot.val()) {
                result.push({
                  productId: product,
                  ...snapshot.val()[product],
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

        getProducts(_products);
      };
      executor();
    }

    toggleIsGetProducts(false);
  }, [isGetProducts]);

  // Delete product
  let deleteProduct = (productId) => {
    let _confirm = confirm("Bạn muốn xoá sản phẩm này?");
    if (_confirm) {
      remove(child(ref(firebaseDatabase), `products/${productId}`))
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });
      toast.success("Xoá thành công!", { autoClose: 500 });
      toggleIsGetProducts(true);
    }
  };

  // Update product
  let updateProduct = (productId) => {
    let form = document.getElementById("page-form");

    let name = form[0].value.trim();
    let categoryId = form[1].value.trim();
    let price = form[2].value.trim();
    let images = form[3].value.trim();

    set(ref(firebaseDatabase, `products/${productId}`), {
      name,
      categoryId,
      price,
      images,
    });
    toast.success("Cập nhật thành công!", { autoClose: 500 });

    toggleIsGetProducts(true);
  };

  let ProductRow = ({ productId, name, categoryId, price, images }) => {
    return (
      <tr>
        <td>
          <div style={{ width: "100px", height: "100px" }}>
            <img className="w-100" src={images} alt={name} />
          </div>
        </td>
        <td>{truncateString(name, 30)}</td>
        <td>{categories[+categoryId]}</td>
        <td>{currencyFormatter(price)}</td>
        <td>
          <div className="d-flex">
            <div
              onClick={() => {
                handleShow();
                setModalData({ productId, name, categoryId, price, images });
              }}
              className="btn btn-primary me-1"
            >
              <BsPencilSquare />
            </div>
            <div
              onClick={() => {
                deleteProduct(productId);
              }}
              className="btn btn-danger ms-1"
            >
              <BsFillTrashFill />
            </div>
          </div>
        </td>
      </tr>
    );
  };

  let ProductRows = ({ products }) => {
    if (products.length) {
      return products.map((product) => (
        <ProductRow key={JSON.stringify(product)} {...product} />
      ));
    }

    return (
      <tr>
        <td>Không tìm thấy sản phẩm nào</td>
      </tr>
    );
  };

  return (
    <Container>
      <ToastContainer autoClose={5000} />
      <Row className="m-5">
        <div
          className="p-5 rounded-4 bg-white"
          style={{ boxShadow: "0px 0px 8px 0px rgb(0 0 0 / 4%)" }}
        >
          <h5 className="mb-4">Quản lý sản phẩm</h5>
          <div>
            <Table>
              <thead>
                <tr>
                  <th></th>
                  <th>Sản phẩm</th>
                  <th>Loại sản phẩm</th>
                  <th>Giá</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <ProductRows products={products} />
              </tbody>
            </Table>
          </div>
        </div>
      </Row>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật thông tin sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="page-form">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Tên sản phẩm</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên sản phẩm..."
                defaultValue={modalData.name}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Loại sản phẩm</Form.Label>
              <Form.Select
                aria-label="Default select example"
                defaultValue={modalData.categoryId}
              >
                <option value="-1">Chọn loại sản phẩm</option>
                <option value="0">iPhone</option>
                <option value="1">iPad</option>
                <option value="2">Mac</option>
                <option value="3">Watch</option>
                <option value="4">Âm thanh</option>
                <option value="5">Phụ kiện</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Giá sản phẩm</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                placeholder="Nhập giá sản phẩm..."
                defaultValue={modalData.price}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Link ảnh sản phẩm</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập link ảnh sản phẩm..."
                defaultValue={modalData.images}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              updateProduct(modalData.productId);
              handleClose();
            }}
          >
            Lưu thông tin
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AminProductManager;
