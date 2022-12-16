import { useEffect, useState } from "react";

import { getDatabase, ref, push, set } from "firebase/database";
import { firebaseApp, firebaseDatabase } from "../../configs/firebase";

import { ToastContainer, toast } from "react-toastify";
import { Form, Button, Accordion, Container, Row, Col } from "react-bootstrap";

let AdminAddProduct = () => {
  let [isAdd, setIsAdd] = useState(false);

  useEffect(() => {
    if (isAdd) {
      let executor = async () => {
        let form = document.getElementById("page-form");

        let name = form[0].value.trim();
        let categoryId = form[1].value.trim() > -1 ? +form[1].value.trim() : 0;
        let price = form[2].value.trim();
        let images = form[3].value.trim();

        const productsRef = ref(firebaseDatabase, "products");
        const newProductRef = push(productsRef);
        set(newProductRef, {
          name,
          categoryId,
          price,
          images,
          views: 0,
          hot: false,
        });

        form.reset();
        toast.success("Thêm thành công!", { autoClose: 500 });
      };
      executor();
    }

    setIsAdd(false);
  }, [isAdd]);

  return (
    <Container>
      <ToastContainer autoClose={5000} />
      <Row className="m-5">
        <div
          className="p-5 rounded-4 bg-white"
          style={{ boxShadow: "0px 0px 8px 0px rgb(0 0 0 / 4%)" }}
        >
          <h5 className="mb-4">Thêm sản phẩm mới</h5>
          <Form
            id="page-form"
            onSubmit={(event) => {
              event.preventDefault();
              setIsAdd(true);
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Tên sản phẩm</Form.Label>
              <Form.Control type="text" placeholder="Nhập tên sản phẩm..." />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Loại sản phẩm</Form.Label>
              <Form.Select aria-label="Default select example">
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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Link ảnh sản phẩm</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập link ảnh sản phẩm..."
              />
            </Form.Group>
            <Button variant="dark" type="submit">
              Thêm
            </Button>
          </Form>
        </div>
      </Row>
    </Container>
  );
};

export default AdminAddProduct;
