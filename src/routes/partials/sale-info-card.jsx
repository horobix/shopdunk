import { Card, Button } from "react-bootstrap";
import { BsGiftFill, BsDot } from "react-icons/bs";

let SaleInfoCard = () => {
  return (
    <Card>
      <Card.Header className="d-flex align-items-center">
        <BsGiftFill />
        <p className="ms-1 m-0">Thông tin khuyến mãi</p>
      </Card.Header>
      <Card.Body>
        <div className="px-3">
          <span style={{ color: "#ff0000" }}>
            <strong>Ưu đãi thanh toán:</strong>
          </span>
          <span style={{ color: "#ff0000" }}>
            <strong>&nbsp;</strong>
          </span>
          <br />
          <BsDot />{" "}
          <span style={{ fontSize: "0.9rem" }}>
            Giảm 1 triệu khi quét QR VNPAY (Code: HMQR1TR)
          </span>
          <br />
          <BsDot />{" "}
          <span style={{ fontSize: "0.9rem" }}>
            Giảm 1 triệu qua Moca (Code: SHOPDUNKIP14)
          </span>
          <br />
          <BsDot />{" "}
          <span style={{ fontSize: "0.9rem" }}>
            Giảm 1 triệu qua mã TPBANK EVO
          </span>
          <br />
          <BsDot />{" "}
          <span style={{ fontSize: "0.9rem" }}>
            Giảm 5% tối đa 1 triệu qua KREDIVO
          </span>
          <br />
          <BsDot />{" "}
          <span style={{ fontSize: "0.9rem" }}>
            Giảm 10% tối đa 300.000đ qua thẻ NAPAS
          </span>
          <div className="mb-2"></div>
          <span style={{ color: "#ff0000" }}>
            <strong>Ưu đãi mua kèm:</strong>
          </span>
          <br />
          <BsDot />{" "}
          <span style={{ fontSize: "0.9rem" }}>Mua nhiều giảm sâu</span>
          <br />
          &nbsp;&nbsp;- Combo 3 phụ kiện giảm 200.000đ
          <br />
          &nbsp;&nbsp;- Combo 4 phụ kiện giảm 300.000đ
          <br />
          &nbsp;&nbsp;- Combo từ 5 phụ kiện giảm 400.000đ
          <br />
          <BsDot />{" "}
          <span style={{ fontSize: "0.9rem" }}>
            Giảm 200.000đ khi mua Apple Care
          </span>
          <br />
          <BsDot />{" "}
          <span style={{ fontSize: "0.9rem" }}>
            Giảm 20% gói bảo hành kim cương 12 tháng và 24 tháng
          </span>
          <br />
          <BsDot />{" "}
          <span style={{ fontSize: "0.9rem" }}>
            Giảm tới 200.000đ khi mua AirPods
          </span>
          <div className="mb-2"></div>
          <span style={{ color: "#ff0000" }}>
            <strong>Ưu đãi đặc quyền:</strong>
          </span>
          <br />
          <BsDot />{" "}
          <span style={{ fontSize: "0.9rem" }}>
            Tặng đến 4 triệu khi thu cũ đổi mới iPhone
          </span>
          <br />
          <BsDot /> <span style={{ fontSize: "0.9rem" }}>Hỗ trợ trả góp</span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SaleInfoCard;
